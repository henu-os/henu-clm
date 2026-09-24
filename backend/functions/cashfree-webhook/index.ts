// Supabase Edge Function: cashfree-webhook
// Secure server-side webhook handler for Cashfree payment gateway events

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function verifyCashfreeSignature(rawBody: string, signature: string, timestamp: string, secretKey: string): boolean {
  if (!signature || !secretKey || !timestamp) return false;
  try {
    const dataToSign = `${timestamp}${rawBody}`;
    const expectedSignature = hmac('sha256', secretKey, dataToSign, 'utf8', 'base64');
    return expectedSignature === signature;
  } catch (err) {
    console.error('Cashfree signature error:', err);
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';
    const rawBody = await req.text();

    if (CASHFREE_SECRET_KEY && !verifyCashfreeSignature(rawBody, signature, timestamp, CASHFREE_SECRET_KEY)) {
      console.error('Invalid Cashfree signature');
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const eventId = payload.data?.order?.order_id || `cf_${Date.now()}`;

    // Idempotency check
    const { data: existingEvent } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', `webhook:cashfree:${eventId}:${eventType}`)
      .maybeSingle();

    if (existingEvent) {
      return new Response(JSON.stringify({ status: 'already_processed', event_id: eventId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      const order = payload.data.order;
      const payment = payload.data.payment;
      const invoiceId = order.order_tags?.invoice_id;
      const amount = payment.payment_amount;

      if (invoiceId) {
        await supabase
          .from('payments')
          .update({
            status: 'successful',
            provider_payment_id: payment.cf_payment_id?.toString(),
            paid_at: new Date().toISOString(),
            raw_response: payload.data,
          })
          .eq('invoice_id', invoiceId);

        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_amount: amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoiceId);

        const { data: invoice } = await supabase
          .from('invoices')
          .select('client_id, invoice_number, order_id')
          .eq('id', invoiceId)
          .single();

        if (invoice) {
          await supabase.from('notifications').insert({
            user_id: invoice.client_id,
            title: 'Payment Successful',
            body: `Payment of ₹${amount.toLocaleString('en-IN')} via Cashfree for invoice ${invoice.invoice_number} received.`,
            type: 'payment',
            link_url: `/invoices/${invoiceId}`,
            is_read: false,
          });
        }
      }
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      const order = payload.data.order;
      const payment = payload.data.payment;
      const invoiceId = order.order_tags?.invoice_id;

      if (invoiceId) {
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            provider_payment_id: payment.cf_payment_id?.toString(),
            failure_reason: payment.payment_message || 'Payment failed',
            raw_response: payload.data,
          })
          .eq('invoice_id', invoiceId);
      }
    }

    await supabase.from('audit_logs').insert({
      action: `webhook:cashfree:${eventId}:${eventType}`,
      entity_type: 'payment_webhook',
      metadata: { event_type: eventType, event_id: eventId },
    });

    return new Response(JSON.stringify({ status: 'success', event_id: eventId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Cashfree webhook error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
