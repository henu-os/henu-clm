-- Migration: 20260924000005_clm_mobile_home_cms.sql
-- Description: Mobile Home Screen Configuration & CMS Engine for HENU OS CLM

CREATE TABLE IF NOT EXISTS public.mobile_home_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organization_settings(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Default Client Mobile Home',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Section Configs
    greeting_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 1,
      "title": "Good Morning",
      "sub_title": "Welcome back!",
      "show_client_name": true,
      "show_avatar": true,
      "custom_text": "",
      "alignment": "left"
    }'::jsonb,
    
    hero_banner_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 2,
      "heading": "Your business, managed smarter.",
      "description": "Manage your services, projects and payments from one place.",
      "image_url": "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
      "badge_text": "Priority Milestone",
      "cta_text": "Review Deliverables",
      "cta_route": "/orders",
      "secondary_cta_text": "",
      "secondary_cta_route": "",
      "is_active": true
    }'::jsonb,
    
    primary_cta_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 3,
      "label": "Create Your Quote Now",
      "icon": "add_circle_outline",
      "destination": "/quotes",
      "is_external": false,
      "button_style": "primary"
    }'::jsonb,
    
    quick_actions_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 4,
      "title": "Quick Actions",
      "actions": [
        { "id": "qa_1", "title": "Quotes", "icon": "request_quote_outlined", "route": "/quotes", "is_enabled": true },
        { "id": "qa_2", "title": "Invoices", "icon": "receipt_long_outlined", "route": "/invoices", "is_enabled": true },
        { "id": "qa_3", "title": "Payments", "icon": "credit_card_outlined", "route": "/payments", "is_enabled": true },
        { "id": "qa_4", "title": "Orders", "icon": "folder_outlined", "route": "/orders", "is_enabled": true },
        { "id": "qa_5", "title": "Projects", "icon": "assignment_outlined", "route": "/delivery", "is_enabled": true },
        { "id": "qa_6", "title": "Support", "icon": "support_agent_outlined", "route": "/support", "is_enabled": true },
        { "id": "qa_7", "title": "Catalog", "icon": "shopping_cart_outlined", "route": "/catalog", "is_enabled": true },
        { "id": "qa_8", "title": "Profile", "icon": "person_outline", "route": "/profile", "is_enabled": true }
      ]
    }'::jsonb,
    
    offer_section_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 5,
      "title": "Special Offer",
      "description": "Get your project started today with 15% off advisory packages.",
      "badge": "15% DISCOUNT",
      "image_url": "",
      "cta_text": "Claim Offer",
      "cta_route": "/quotes",
      "start_date": "2026-01-01T00:00:00Z",
      "expiry_date": "2026-12-31T23:59:59Z",
      "show_expired": false,
      "background_color": "#181A20",
      "is_active": true
    }'::jsonb,
    
    recent_activity_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 6,
      "title": "Recent Activity",
      "limit": 5,
      "display_type": "timeline",
      "is_active": true
    }'::jsonb,
    
    upcoming_config JSONB NOT NULL DEFAULT '{
      "enabled": true,
      "priority": 7,
      "title": "Upcoming",
      "limit": 3,
      "is_active": true
    }'::jsonb,
    
    bottom_nav_config JSONB NOT NULL DEFAULT '{
      "items": [
        { "id": "nav_home", "label": "Home", "icon": "home_outlined", "route": "/home", "is_enabled": true },
        { "id": "nav_portfolio", "label": "Portfolio", "icon": "folder_outlined", "route": "/orders", "is_enabled": true },
        { "id": "nav_services", "label": "Services", "icon": "room_service_outlined", "route": "/catalog", "is_enabled": true },
        { "id": "nav_finance", "label": "Finance", "icon": "receipt_long_outlined", "route": "/invoices", "is_enabled": true },
        { "id": "nav_profile", "label": "Hub", "icon": "person_outline", "route": "/profile", "is_enabled": true }
      ]
    }'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for fast tenant and client lookup
CREATE INDEX IF NOT EXISTS idx_mobile_home_org ON public.mobile_home_configurations(organization_id);
CREATE INDEX IF NOT EXISTS idx_mobile_home_client ON public.mobile_home_configurations(client_id);

-- Enable RLS
ALTER TABLE public.mobile_home_configurations ENABLE ROW LEVEL SECURITY;

-- Admins can manage all home configs
CREATE POLICY "Admins have full access to mobile_home_configurations"
    ON public.mobile_home_configurations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE user_id = auth.uid()
        )
    );

-- Clients can read active configurations for their tenant or global default
CREATE POLICY "Clients can view active mobile_home_configurations"
    ON public.mobile_home_configurations
    FOR SELECT
    USING (
        is_active = TRUE AND (
            client_id IS NULL OR 
            client_id IN (
                SELECT customer_id FROM public.client_profiles
                WHERE user_id = auth.uid()
            )
        )
    );
