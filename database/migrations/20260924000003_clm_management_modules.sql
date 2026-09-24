-- ==============================================================================
-- HENU OS CLM — PHASE 7 MANAGEMENT MODULES & FINANCIAL SCHEMA MIGRATION
-- Target Platform: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. ITEMS & INVENTORY CATALOG
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type VARCHAR(20) NOT NULL DEFAULT 'SERVICE', -- 'GOODS' or 'SERVICE'
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    unit VARCHAR(50) DEFAULT 'unit',
    hsn_sac_code VARCHAR(50),
    tax_preference VARCHAR(50) DEFAULT 'TAXABLE', -- 'TAXABLE', 'NON_TAXABLE', 'OUT_OF_SCOPE', 'NON_GST'
    exemption_reason TEXT,
    image_url TEXT,
    
    -- Sales Details
    sales_enabled BOOLEAN DEFAULT TRUE,
    selling_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sales_account VARCHAR(100) DEFAULT 'Sales',
    sales_description TEXT,
    
    -- Purchase Details
    purchase_enabled BOOLEAN DEFAULT FALSE,
    cost_price NUMERIC(15, 2) DEFAULT 0.00,
    purchase_account VARCHAR(100) DEFAULT 'Cost of Goods Sold',
    purchase_description TEXT,
    preferred_vendor VARCHAR(150),
    
    -- Tax Rates
    intra_state_tax_rate NUMERIC(5, 2) DEFAULT 18.00, -- e.g. 18% GST (CGST + SGST)
    inter_state_tax_rate NUMERIC(5, 2) DEFAULT 18.00, -- IGST
    
    -- Inventory Tracking
    track_inventory BOOLEAN DEFAULT FALSE,
    inventory_account VARCHAR(100) DEFAULT 'Inventory Asset',
    opening_stock NUMERIC(12, 2) DEFAULT 0.00,
    opening_stock_rate NUMERIC(15, 2) DEFAULT 0.00,
    reorder_point NUMERIC(12, 2) DEFAULT 0.00,
    current_stock NUMERIC(12, 2) DEFAULT 0.00,
    
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXTENDED CUSTOMER CONTACTS & ADDRESSES
CREATE TABLE IF NOT EXISTS public.customer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    salutation VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    work_phone VARCHAR(50),
    mobile VARCHAR(50),
    designation VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alter customers table to support comprehensive GST, address, and financial metadata
ALTER TABLE public.customers
    ADD COLUMN IF NOT EXISTS customer_type VARCHAR(50) DEFAULT 'BUSINESS',
    ADD COLUMN IF NOT EXISTS salutation VARCHAR(20),
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS customer_display_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS work_phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS mobile VARCHAR(50),
    ADD COLUMN IF NOT EXISTS gst_treatment VARCHAR(100) DEFAULT 'Registered Business - Regular',
    ADD COLUMN IF NOT EXISTS gstin VARCHAR(50),
    ADD COLUMN IF NOT EXISTS place_of_supply VARCHAR(100) DEFAULT 'State',
    ADD COLUMN IF NOT EXISTS pan VARCHAR(50),
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD',
    ADD COLUMN IF NOT EXISTS opening_balance NUMERIC(15, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(50) DEFAULT 'NET_30',
    ADD COLUMN IF NOT EXISTS portal_enabled BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS portal_language VARCHAR(20) DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS shipping_address JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS remarks TEXT;

-- 3. RECURRING INVOICES
CREATE TABLE IF NOT EXISTS public.recurring_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    profile_name VARCHAR(200) NOT NULL,
    repeat_every VARCHAR(50) NOT NULL DEFAULT 'MONTH', -- 'WEEK', 'MONTH', 'YEAR'
    repeat_interval INT DEFAULT 1,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    end_condition VARCHAR(50) DEFAULT 'NEVER', -- 'NEVER', 'AT_DATE', 'AFTER_OCCURRENCES'
    max_occurrences INT,
    occurrences_count INT DEFAULT 0,
    payment_terms VARCHAR(50) DEFAULT 'DUE_ON_RECEIPT',
    salesperson VARCHAR(150),
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'PAUSED', 'COMPLETED'
    
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    
    auto_send BOOLEAN DEFAULT TRUE,
    auto_charge BOOLEAN DEFAULT FALSE,
    customer_notes TEXT,
    terms_conditions TEXT,
    next_run_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recurring_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recurring_invoice_id UUID REFERENCES public.recurring_invoices(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    quantity NUMERIC(12, 2) DEFAULT 1.00,
    unit_price NUMERIC(15, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) DEFAULT 0.00,
    discount NUMERIC(15, 2) DEFAULT 0.00,
    total NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREDIT NOTES
CREATE TABLE IF NOT EXISTS public.credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE RESTRICT,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    credit_note_number VARCHAR(50) UNIQUE NOT NULL,
    reference_number VARCHAR(100),
    credit_note_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason VARCHAR(100) NOT NULL DEFAULT 'SALES_RETURN', -- 'SALES_RETURN', 'INVOICE_CORRECTION', 'DISCOUNT_GRANTED', 'OTHER'
    salesperson VARCHAR(150),
    subject VARCHAR(255),
    status VARCHAR(50) DEFAULT 'OPEN', -- 'DRAFT', 'OPEN', 'CLOSED', 'VOID'
    
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    adjustment NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    
    customer_notes TEXT,
    terms_conditions TEXT,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_note_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_note_id UUID REFERENCES public.credit_notes(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    quantity NUMERIC(12, 2) DEFAULT 1.00,
    unit_price NUMERIC(15, 2) NOT NULL,
    tax_rate NUMERIC(5, 2) DEFAULT 0.00,
    total NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_note_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_note_id UUID REFERENCES public.credit_notes(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    allocated_amount NUMERIC(15, 2) NOT NULL,
    allocated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENT ALLOCATIONS & ADVANCES
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'INVOICE_PAYMENT', -- 'INVOICE_PAYMENT' or 'CUSTOMER_ADVANCE'
    ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(50) DEFAULT 'BANK_TRANSFER', -- 'CASH', 'CHEQUE', 'CREDIT_CARD', 'BANK_TRANSFER', 'UPI', 'GATEWAY'
    ADD COLUMN IF NOT EXISTS deposit_to VARCHAR(100) DEFAULT 'BANK_ACCOUNT',
    ADD COLUMN IF NOT EXISTS bank_charges NUMERIC(15, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS tax_deduction_type VARCHAR(50) DEFAULT 'NO_TAX', -- 'NO_TAX', 'TDS', 'GST_ON_ADVANCE'
    ADD COLUMN IF NOT EXISTS tax_deducted_amount NUMERIC(15, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS unused_amount NUMERIC(15, 2) DEFAULT 0.00;

CREATE TABLE IF NOT EXISTS public.payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    allocated_amount NUMERIC(15, 2) NOT NULL,
    allocated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_items_sku ON public.items(sku);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_recurring_invoices_customer ON public.recurring_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_invoices_status ON public.recurring_invoices(status);
CREATE INDEX IF NOT EXISTS idx_credit_notes_customer ON public.credit_notes(customer_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_status ON public.credit_notes(status);
CREATE INDEX IF NOT EXISTS idx_payment_allocations_invoice ON public.payment_allocations(invoice_id);
CREATE INDEX IF NOT EXISTS idx_credit_note_allocations_invoice ON public.credit_note_allocations(invoice_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_note_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_note_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_allocations ENABLE ROW LEVEL SECURITY;

-- Items Policy: Authenticated users can view active items, Admins have full access
CREATE POLICY items_policy ON public.items
    FOR ALL USING (auth.role() = 'authenticated');

-- Recurring Invoices Policy: Admins have full access, Clients can view own
CREATE POLICY recurring_invoices_policy ON public.recurring_invoices
    FOR ALL USING (
        customer_id IN (SELECT id FROM public.customers WHERE primary_contact_email = auth.email())
        OR public.is_admin()
    );

-- Credit Notes Policy: Admins have full access, Clients can view own
CREATE POLICY credit_notes_policy ON public.credit_notes
    FOR ALL USING (
        customer_id IN (SELECT id FROM public.customers WHERE primary_contact_email = auth.email())
        OR public.is_admin()
    );

CREATE POLICY credit_note_items_policy ON public.credit_note_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY credit_note_allocations_policy ON public.credit_note_allocations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY payment_allocations_policy ON public.payment_allocations
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. REALTIME PUBLICATION SETUP
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recurring_invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credit_notes;
