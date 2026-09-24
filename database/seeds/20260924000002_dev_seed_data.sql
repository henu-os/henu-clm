-- ==============================================================================
-- HENU OS CLM — DEVELOPMENT & STAGING SEED DATA
-- Version: 1.0.0 (Phase 6 Environment Seed)
-- Target Platform: Supabase PostgreSQL 15+
-- ==============================================================================

-- 1. SYSTEM ROLES
INSERT INTO public.roles (id, code, name, description, is_system)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'super_admin', 'Super Administrator', 'Full platform administrative control', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'admin', 'Operations Administrator', 'System operations and customer manager', TRUE),
    ('33333333-3333-3333-3333-333333333333', 'sales', 'Sales Representative', 'Quote and proposal workbench manager', TRUE),
    ('44444444-4444-4444-4444-444444444444', 'support', 'Support Specialist', 'Customer concierge chat and ticketing', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 2. CUSTOMERS & ENTERPRISE ACCOUNTS
INSERT INTO public.customers (id, customer_code, company_name, industry, primary_contact_name, primary_contact_email, primary_contact_phone, vip_tier, status, total_spend)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'HENU-CL-2026-000001', 'Aero Dynamics Inc', 'Aerospace & Defence', 'Siddharth Rao', 'siddharth@folio.enterprise', '+15550192834', 'Enterprise VIP', 'ACTIVE', 48250.00),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'HENU-CL-2026-000002', 'Acme Global Ventures', 'Fintech', 'Elena Rostova', 'elena@acme.ventures', '+15550192899', 'Standard', 'ACTIVE', 15000.00)
ON CONFLICT (customer_code) DO NOTHING;

-- 3. SERVICE CATEGORIES & CATALOG
INSERT INTO public.service_categories (id, code, name, display_order, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'ADVISORY', 'Strategic Advisory', 1, TRUE),
    ('c2222222-2222-2222-2222-222222222222', 'ENGINEERING', 'Custom Engineering', 2, TRUE),
    ('c3333333-3333-3333-3333-333333333333', 'CONCIERGE', 'Concierge & Retainer', 3, TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.services (id, category_id, code, name, short_description, starting_price, currency, delivery_days, features)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'ARCH-ADV-01', 'Enterprise Cloud Architecture', 'High-availability multi-region cloud topology design', 18000.00, 'USD', '14-21 Days', '["Multi-region redundancy", "Zero-trust IAM", "IaC Terraform Modules"]'::jsonb),
    ('s2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'SEC-AUD-02', 'Full-Stack Security Audit', 'SOC2 / ISO27001 readiness & penetration testing', 14000.00, 'USD', '10-14 Days', '["Dynamic App Sec Testing", "Static Code Analysis", "Executive Compliance Report"]'::jsonb),
    ('s3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'RET-VIP-03', '24/7 Dedicated Concierge Retainer', 'Guaranteed 15-minute SLA dedicated engineering lead', 12500.00, 'USD', 'Monthly', '["Dedicated Slack Connect", "15-min Critical SLA", "Weekly Architecture Sync"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 4. DEMO QUOTES
INSERT INTO public.quotes (id, customer_id, quote_number, title, status, subtotal, tax, discount, total_amount, currency, valid_until)
VALUES
    ('q1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'QT-2026-0104', 'Enterprise Architecture Blueprint', 'PENDING_APPROVAL', 32000.00, 5760.00, 2000.00, 35760.00, 'USD', NOW() + INTERVAL '30 days'),
    ('q2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'QT-2026-0105', 'Fintech Security Compliance Review', 'PENDING_APPROVAL', 14000.00, 2520.00, 0.00, 16520.00, 'USD', NOW() + INTERVAL '14 days')
ON CONFLICT (quote_number) DO NOTHING;

-- 5. DEMO ORDERS
INSERT INTO public.orders (id, customer_id, quote_id, order_number, title, status, progress_percent, total_amount, currency, target_delivery_date)
VALUES
    ('o1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'q1111111-1111-1111-1111-111111111111', 'ORD-2026-0042', 'Platform Transformation', 'IN_PROGRESS', 72, 35760.00, 'USD', NOW() + INTERVAL '45 days')
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO public.order_milestones (id, order_id, title, status, is_completed, display_order)
VALUES
    ('m1111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 'Discovery & Threat Modeling', 'COMPLETED', TRUE, 1),
    ('m2222222-2222-2222-2222-222222222222', 'o1111111-1111-1111-1111-111111111111', 'Infrastructure as Code Templates', 'IN_PROGRESS', FALSE, 2),
    ('m3333333-3333-3333-3333-333333333333', 'o1111111-1111-1111-1111-111111111111', 'Staging Deploy & Penetration Test', 'PENDING', FALSE, 3)
ON CONFLICT DO NOTHING;

-- 6. DEMO INVOICES & PAYMENTS
INSERT INTO public.invoices (id, customer_id, order_id, invoice_number, title, status, subtotal, tax, discount, total_amount, balance_due, currency, due_date)
VALUES
    ('i1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-1111-1111-1111-111111111111', 'INV-2026-089', 'Monthly Engineering Retainer (May)', 'SENT', 12500.00, 0.00, 0.00, 12500.00, 12500.00, 'USD', NOW() + INTERVAL '7 days'),
    ('i2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'o1111111-1111-1111-1111-111111111111', 'INV-2026-081', 'Architecture Discovery Phase 1', 'PAID', 14000.00, 0.00, 0.00, 14000.00, 0.00, 'USD', NOW() - INTERVAL '15 days')
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO public.payments (id, customer_id, invoice_id, payment_number, amount, currency, gateway, gateway_payment_id, status, signature_verified)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'i2222222-2222-2222-2222-222222222222', 'PAY-2026-041', 14000.00, 'USD', 'RAZORPAY', 'pay_rzp_live_938174829', 'COMPLETED', TRUE)
ON CONFLICT (payment_number) DO NOTHING;

-- 7. DEMO CONCIERGE SUPPORT THREADS
INSERT INTO public.support_threads (id, customer_id, subject, status, priority, assigned_agent)
VALUES
    ('t1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Production Terraform Module Review', 'OPEN', 'HIGH', 'Henus Lead Architect')
ON CONFLICT DO NOTHING;

INSERT INTO public.support_messages (id, thread_id, sender_type, sender_name, content)
VALUES
    ('sm111111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111', 'CLIENT', 'Siddharth Rao', 'Hi team, we updated our AWS KMS key policy for review.'),
    ('sm222222-2222-2222-2222-222222222222', 't1111111-1111-1111-1111-111111111111', 'AGENT', 'Henus Lead Architect', 'Reviewing now. The cross-account assume-role condition looks solid.')
ON CONFLICT DO NOTHING;
