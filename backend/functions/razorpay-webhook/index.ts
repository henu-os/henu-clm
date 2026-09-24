// Supabase Edge Function: razorpay-webhook
// Secure server-side webhook handler for Razorpay payment events

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expectedSignature = hmac('sha256', secret, payload, 'utf8', 'hex');
    return expectedSignature === signature;
  } catch (err) {
    console.error('Signature verification error:', err);
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
    const signature = req.headers.get('x-razorpay-signature') || '';
    const rawBody = await req.text();

    // Verify webhook signature
    if (RAZORPAY_WEBHOOK_SECRET && !verifySignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET)) {
      console.error('Invalid Razorpay signature');
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.payload?.payment?.entity?.id || `rzp_${Date.now()}`;
    const eventType = event.event;

    // Idempotency Check
    const { data: existingEvent } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', `webhook:razorpay:${eventId}`)
      .maybeSingle();

    if (existingEvent) {
      console.log(`Event ${eventId} already processed.`);
      return new Response(JSON.stringify({ status: 'already_processed', event_id: eventId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process event types
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amount = paymentEntity.amount / 100; // paise to rupees
      const notes = paymentEntity.notes || {};
      const invoiceId = notes.invoice_id;

      // Update payment record
      if (invoiceId) {
        await supabase
          .from('payments')
          .update({
            status: 'successful',
            provider_payment_id: paymentId,
            paid_at: new Date().toISOString(),
            raw_response: paymentEntity,
          })
          .eq('invoice_id', invoiceId);

        // Update invoice status
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_amount: amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', invoiceId);

        // Fetch invoice to get customer & order info for notifications
        const { data: invoice } = await supabase
          .from('invoices')
          .select('client_id, invoice_number, order_id')
          .eq('id', invoiceId)
          .single();

        if (invoice) {
          // Add in-app notification
          await supabase.from('notifications').insert({
            user_id: invoice.client_id,
            title: 'Payment Successful',
            body: `Payment of ₹${amount.toLocaleString('en-IN')} for invoice ${invoice.invoice_number} received successfully.`,
            type: 'payment',
            link_url: `/invoices/${invoiceId}`,
            is_read: false,
          });

          // If linked to order, mark order paid / in_progress
          if (invoice.order_id) {
            await supabase
              .from('orders')
              .update({
                payment_status: 'paid',
                updated_at: new Date().toISOString(),
              })
              .eq('id', invoice.order_id);
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      const invoiceId = paymentEntity.notes?.invoice_id;

      if (invoiceId) {
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            provider_payment_id: paymentEntity.id,
            failure_reason: paymentEntity.error_description || 'Payment failed',
            raw_response: paymentEntity,
          })
          .eq('invoice_id', invoiceId);
      }
    }

    // Record idempotency audit log
    await supabase.from('audit_logs').insert({
      action: `webhook:razorpay:${eventId}`,
      entity_type: 'payment_webhook',
      metadata: { event_type: eventType, event_id: eventId },
    });

    return new Response(JSON.stringify({ status: 'success', event_id: eventId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
