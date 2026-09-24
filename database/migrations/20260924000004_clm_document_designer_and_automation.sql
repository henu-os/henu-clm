-- ==============================================================================
-- HENU OS CLM — PHASE 8: DOCUMENT DESIGNER, ORGANIZATION & AUTOMATION SCHEMA
-- Target Platform: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. DOCUMENT TEMPLATES & DESIGNER CONFIGURATION
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    document_type VARCHAR(50) NOT NULL DEFAULT 'INVOICE', -- 'QUOTE', 'INVOICE', 'CREDIT_NOTE', 'PAYMENT_RECEIPT'
    layout_style VARCHAR(50) DEFAULT 'STANDARD', -- 'SPREADSHEET', 'STANDARD', 'MODERN', 'CLEAN'
    paper_size VARCHAR(20) DEFAULT 'A4', -- 'A4', 'A5', 'LETTER'
    orientation VARCHAR(20) DEFAULT 'PORTRAIT', -- 'PORTRAIT', 'LANDSCAPE'
    margin_top NUMERIC(4, 2) DEFAULT 0.70,
    margin_bottom NUMERIC(4, 2) DEFAULT 0.70,
    margin_left NUMERIC(4, 2) DEFAULT 0.55,
    margin_right NUMERIC(4, 2) DEFAULT 0.40,
    
    font_family VARCHAR(100) DEFAULT 'Inter',
    font_size INT DEFAULT 10,
    font_color VARCHAR(50) DEFAULT '#20202B',
    background_color VARCHAR(50) DEFAULT '#FFFFFF',
    background_image_url TEXT,
    
    header_config JSONB DEFAULT '{
        "show_org_name": true,
        "show_logo": true,
        "show_address": true,
        "show_phone": true,
        "show_email": true,
        "show_website": true,
        "show_gstin": true,
        "document_title": "TAX INVOICE",
        "logo_alignment": "LEFT"
    }'::jsonb,
    
    table_config JSONB DEFAULT '{
        "header_bg_color": "#20202B",
        "header_text_color": "#FFFFFF",
        "show_sn": true,
        "show_hsn_sac": true,
        "show_discount": true,
        "show_tax": true,
        "columns": [
            {"key": "sn", "label": "#", "visible": true},
            {"key": "item", "label": "Item & Description", "visible": true},
            {"key": "hsn_sac", "label": "HSN/SAC", "visible": true},
            {"key": "qty", "label": "Qty", "visible": true},
            {"key": "rate", "label": "Rate", "visible": true},
            {"key": "discount", "label": "Discount", "visible": true},
            {"key": "tax", "label": "Tax", "visible": true},
            {"key": "amount", "label": "Amount", "visible": true}
        ]
    }'::jsonb,
    
    total_config JSONB DEFAULT '{
        "show_subtotal": true,
        "show_tax_split": true,
        "show_total_in_words": true,
        "show_signature": true,
        "signature_label": "Authorized Signatory",
        "signature_image_url": null,
        "signatory_name": "Authorized Representative"
    }'::jsonb,
    
    footer_config JSONB DEFAULT '{
        "show_page_number": true,
        "footer_text": "Thank you for your business!"
    }'::jsonb,
    
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'PUBLISHED', -- 'DRAFT', 'PUBLISHED', 'ARCHIVED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DOCUMENT TEMPLATE VERSIONS
CREATE TABLE IF NOT EXISTS public.document_template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.document_templates(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    config JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORGANIZATION SETTINGS & BRANDING
CREATE TABLE IF NOT EXISTS public.organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(200) NOT NULL DEFAULT 'HENU OS PRIVATE LIMITED',
    industry VARCHAR(100) DEFAULT 'Technology & Enterprise Software',
    street1 VARCHAR(255) DEFAULT 'Second Floor, 10b-204',
    street2 VARCHAR(255) DEFAULT 'Pali Aasan Home, Bhagesar Road',
    city VARCHAR(100) DEFAULT 'Pali',
    state VARCHAR(100) DEFAULT 'Rajasthan',
    postal_code VARCHAR(50) DEFAULT '306401',
    country VARCHAR(100) DEFAULT 'India',
    phone VARCHAR(50) DEFAULT '+91 8094100513',
    fax VARCHAR(50),
    email VARCHAR(255) DEFAULT 'contact@henuos.com',
    website VARCHAR(255) DEFAULT 'https://henu-build.netlify.app/',
    gstin VARCHAR(50) DEFAULT '08AAICH3195C1ZL',
    pan VARCHAR(50) DEFAULT 'AAICH3195C',
    logo_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DEFAULT DOCUMENT NOTES & TERMS
CREATE TABLE IF NOT EXISTS public.document_defaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(50) UNIQUE NOT NULL, -- 'QUOTE', 'INVOICE', 'CREDIT_NOTE'
    default_customer_notes TEXT,
    default_terms_conditions TEXT,
    use_as_default_for_all BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CUSTOM FIELDS & ATTRIBUTES
CREATE TABLE IF NOT EXISTS public.custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(50) NOT NULL, -- 'CUSTOMERS', 'QUOTES', 'INVOICES', 'ITEMS'
    field_name VARCHAR(100) NOT NULL,
    field_key VARCHAR(100) UNIQUE NOT NULL,
    data_type VARCHAR(50) NOT NULL DEFAULT 'TEXT', -- 'TEXT', 'NUMBER', 'DROPDOWN', 'DATE', 'CHECKBOX'
    options JSONB DEFAULT '[]'::jsonb,
    is_mandatory BOOLEAN DEFAULT FALSE,
    show_in_pdf BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_doc_templates_type ON public.document_templates(document_type);
CREATE INDEX IF NOT EXISTS idx_doc_templates_default ON public.document_templates(is_default);
CREATE INDEX IF NOT EXISTS idx_custom_fields_module ON public.custom_fields(module);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY doc_templates_policy ON public.document_templates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY org_settings_policy ON public.organization_settings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY doc_defaults_policy ON public.document_defaults
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY custom_fields_policy ON public.custom_fields
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.organization_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_fields;
