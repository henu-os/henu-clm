import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function verifyCashfreeSignature(rawBody: string, signature: string, timestamp: string, secretKey: string): boolean {
  if (!signature || !secretKey || !timestamp) return false;
  const dataToSign = `${timestamp}${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');
  return expectedSignature === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';

    if (secretKey && !verifyCashfreeSignature(rawBody, signature, timestamp, secretKey)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const eventId = payload.data?.order?.order_id || `cf_${Date.now()}`;

    // Idempotency check
    const { data: existingLog } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', `webhook:cashfree:${eventId}:${eventType}`)
      .maybeSingle();

    if (existingLog) {
      return NextResponse.json({ status: 'already_processed', event_id: eventId }, { status: 200 });
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
      }
    }

    await supabase.from('audit_logs').insert({
      action: `webhook:cashfree:${eventId}:${eventType}`,
      entity_type: 'payment_webhook',
      metadata: { event_type: eventType, event_id: eventId },
    });

    return NextResponse.json({ success: true, event_id: eventId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
