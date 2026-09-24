// Supabase Edge Function: generate-invoice-pdf
// Server-side invoice generation and storage signed link creation

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
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
    const { invoice_id } = await req.json();

    if (!invoice_id) {
      return new Response(JSON.stringify({ error: 'invoice_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch invoice along with client and items
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*, clients(*), invoice_items(*)')
      .eq('id', invoice_id)
      .single();

    if (error || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // In production, render HTML to PDF via Chromium or a PDF service.
    // For cloud storage artifact, create signed URL if file exists or provide download manifest
    const filePath = `invoices/${invoice.id}.pdf`;

    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60 * 60); // 1 hour validity

    return new Response(
      JSON.stringify({
        success: true,
        invoice_number: invoice.invoice_number,
        download_url: signedUrlData?.signedUrl || null,
        invoice_data: {
          id: invoice.id,
          number: invoice.invoice_number,
          client: invoice.clients?.company_name,
          total: invoice.total_amount,
          status: invoice.status,
          items: invoice.invoice_items,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Invoice generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
