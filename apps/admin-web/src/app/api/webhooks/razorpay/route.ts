import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return expectedSignature === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (secret && !verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.payload?.payment?.entity?.id || `rzp_${Date.now()}`;
    const eventType = event.event;

    // Idempotency check in audit_logs
    const { data: existingLog } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', `webhook:razorpay:${eventId}`)
      .maybeSingle();

    if (existingLog) {
      return NextResponse.json({ status: 'already_processed', event_id: eventId }, { status: 200 });
    }

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload.payment.entity;
      const invoiceId = paymentEntity.notes?.invoice_id;
      const amount = paymentEntity.amount / 100;

      if (invoiceId) {
        await supabase
          .from('payments')
          .update({
            status: 'successful',
            provider_payment_id: paymentEntity.id,
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

    // Log idempotency
    await supabase.from('audit_logs').insert({
      action: `webhook:razorpay:${eventId}`,
      entity_type: 'payment_webhook',
      metadata: { event_type: eventType, event_id: eventId },
    });

    return NextResponse.json({ success: true, event_id: eventId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
