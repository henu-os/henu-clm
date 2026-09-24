// Supabase Edge Function: notification-dispatcher
// Multi-channel notification router: In-App, Email (Resend), SMS (Twilio/Msg91), Push (FCM)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  type?: 'general' | 'payment' | 'quote' | 'order' | 'support';
  linkUrl?: string;
  channels?: ('in_app' | 'email' | 'sms' | 'push')[];
  emailData?: { to: string; subject: string; html?: string };
}

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
    const payload: NotificationPayload = await req.json();
    const { userId, title, body, type = 'general', linkUrl = '', channels = ['in_app'] } = payload;

    if (!userId || !title || !body) {
      return new Response(JSON.stringify({ error: 'userId, title, and body are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const deliveryResults: Record<string, any> = {};

    // 1. In-App Notification (Database table + Realtime Broadcast)
    if (channels.includes('in_app')) {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          body,
          type,
          link_url: linkUrl,
          is_read: false,
        })
        .select('id')
        .single();

      deliveryResults.in_app = error ? { success: false, error: error.message } : { success: true, id: data?.id };
    }

    // 2. Email Delivery (Resend abstraction)
    if (channels.includes('email') && payload.emailData && RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'HENU OS <notifications@henuos.com>',
            to: [payload.emailData.to],
            subject: payload.emailData.subject || title,
            html: payload.emailData.html || `<p>${body}</p>`,
          }),
        });
        const resData = await res.json();
        deliveryResults.email = { success: res.ok, data: resData };
      } catch (emailErr: any) {
        deliveryResults.email = { success: false, error: emailErr.message };
      }
    }

    return new Response(JSON.stringify({ success: true, results: deliveryResults }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Notification dispatch failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
