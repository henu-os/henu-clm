import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoice_id, gateway = 'razorpay' } = body;

    if (!invoice_id) {
      return NextResponse.json({ error: 'invoice_id is required' }, { status: 400 });
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const amountInRupees = Number(invoice.total_amount);
    const amountInPaise = Math.round(amountInRupees * 100);
    const orderId = `order_${Date.now()}`;

    const rzpKeyId = process.env.RAZORPAY_KEY_ID;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;

    let checkoutPayload: Record<string, any> = {
      order_id: orderId,
      amount: amountInPaise,
      currency: 'INR',
      invoice_id: invoice.id,
      mock: !rzpKeyId,
    };

    if (rzpKeyId && rzpSecret && gateway === 'razorpay') {
      const credentials = Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: invoice.invoice_number,
          notes: { invoice_id: invoice.id },
        }),
      });

      if (rzpRes.ok) {
        const rzpOrder = await rzpRes.json();
        checkoutPayload = {
          key: rzpKeyId,
          order_id: rzpOrder.id,
          amount: amountInPaise,
          currency: 'INR',
          name: 'HENU OS CLM',
          description: `Invoice ${invoice.invoice_number}`,
          prefill: {
            name: invoice.clients?.company_name || '',
            email: invoice.clients?.email || '',
            contact: invoice.clients?.phone || '',
          },
        };
      }
    }

    // Insert pending payment record
    await supabase.from('payments').insert({
      invoice_id: invoice.id,
      client_id: invoice.client_id,
      amount: amountInRupees,
      currency: 'INR',
      status: 'pending',
      payment_method: gateway,
      provider_order_id: checkoutPayload.order_id,
    });

    return NextResponse.json({
      success: true,
      gateway,
      order: checkoutPayload,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment initialization error' }, { status: 500 });
  }
}
