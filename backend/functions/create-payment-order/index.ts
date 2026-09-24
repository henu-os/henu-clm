// Supabase Edge Function: create-payment-order
// Server-side payment order initialization for Razorpay / Cashfree

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') || '';
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { invoice_id, gateway = 'razorpay' } = await req.json();

    if (!invoice_id) {
      return new Response(JSON.stringify({ error: 'invoice_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, clients(*)')
      .eq('id', invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (invoice.status === 'paid') {
      return new Response(JSON.stringify({ error: 'Invoice is already paid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const amountInRupees = Number(invoice.total_amount);
    const amountInPaise = Math.round(amountInRupees * 100);

    let orderId = `order_${Date.now()}`;
    let paymentPayload: Record<string, any> = {};

    if (gateway === 'razorpay' && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      // Call Razorpay API
      const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: invoice.invoice_number,
          notes: {
            invoice_id: invoice.id,
            client_id: invoice.client_id,
          },
        }),
      });

      if (!rzpResponse.ok) {
        const errData = await rzpResponse.json();
        throw new Error(`Razorpay error: ${JSON.stringify(errData)}`);
      }

      const rzpOrder = await rzpResponse.json();
      orderId = rzpOrder.id;
      paymentPayload = {
        key: RAZORPAY_KEY_ID,
        order_id: rzpOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        name: 'HENU OS CLM',
        description: `Invoice ${invoice.invoice_number}`,
        prefill: {
          name: invoice.clients?.company_name || '',
          email: invoice.clients?.email || user.email,
          contact: invoice.clients?.phone || '',
        },
      };
    } else {
      // Simulation / mock payload for local dev / staging when credentials not configured
      paymentPayload = {
        mock: true,
        order_id: orderId,
        amount: amountInPaise,
        currency: 'INR',
        invoice_id: invoice.id,
      };
    }

    // Insert pending payment record in database
    await supabase.from('payments').insert({
      invoice_id: invoice.id,
      client_id: invoice.client_id,
      amount: amountInRupees,
      currency: 'INR',
      status: 'pending',
      payment_method: gateway,
      provider_order_id: orderId,
    });

    return new Response(JSON.stringify({ success: true, gateway, order: paymentPayload }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Create payment order error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Payment initialization failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
