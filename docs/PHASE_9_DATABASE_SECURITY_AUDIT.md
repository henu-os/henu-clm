# HENU OS CLM — PHASE 9: DATABASE & SECURITY AUDIT

## 1. Schema & Primary/Foreign Key Verification
Every table across the 3 migration files is defined with UUIDv4 primary keys and explicit foreign key constraints with cascade/set-null policies:

### Core Relationships
1. **Organization / Tenant Isolation**:
   - `admin_profiles.user_id` -> `auth.users(id) ON DELETE CASCADE`
   - `client_profiles.user_id` -> `auth.users(id) ON DELETE CASCADE`
   - `client_profiles.customer_id` -> `public.customers(id) ON DELETE CASCADE`
2. **Customer & Catalog Entities**:
   - `customer_contacts.customer_id` -> `public.customers(id) ON DELETE CASCADE`
   - `services.category_id` -> `public.service_categories(id) ON DELETE SET NULL`
   - `service_add_ons.service_id` -> `public.services(id) ON DELETE CASCADE`
3. **Quotes, Orders & Delivery**:
   - `quotes.customer_id` -> `public.customers(id) ON DELETE RESTRICT`
   - `quote_items.quote_id` -> `public.quotes(id) ON DELETE CASCADE`
   - `quote_items.service_id` -> `public.services(id) ON DELETE SET NULL`
   - `orders.quote_id` -> `public.quotes(id) ON DELETE SET NULL`
   - `orders.customer_id` -> `public.customers(id) ON DELETE RESTRICT`
   - `order_milestones.order_id` -> `public.orders(id) ON DELETE CASCADE`
4. **Billing, Payments & Credit Notes**:
   - `invoices.customer_id` -> `public.customers(id) ON DELETE RESTRICT`
   - `invoices.order_id` -> `public.orders(id) ON DELETE SET NULL`
   - `payments.invoice_id` -> `public.invoices(id) ON DELETE CASCADE`
   - `payments.customer_id` -> `public.customers(id) ON DELETE RESTRICT`
   - `credit_notes.customer_id` -> `public.customers(id) ON DELETE RESTRICT`
   - `credit_notes.invoice_id` -> `public.invoices(id) ON DELETE SET NULL`
   - `credit_note_allocations.credit_note_id` -> `public.credit_notes(id) ON DELETE CASCADE`
   - `credit_note_allocations.invoice_id` -> `public.invoices(id) ON DELETE CASCADE`
   - `recurring_invoices.customer_id` -> `public.customers(id) ON DELETE RESTRICT`
   - `recurring_invoice_items.recurring_invoice_id` -> `public.recurring_invoices(id) ON DELETE CASCADE`
5. **Document Templates & Settings**:
   - `document_template_versions.template_id` -> `public.document_templates(id) ON DELETE CASCADE`
   - `custom_fields.organization_id` -> `public.organization_settings(id) ON DELETE CASCADE`

---

## 2. Row-Level Security (RLS) Policy Audit
All tables have `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;` enabled.

### Security Boundaries
- **Admins**: Granted full CRUD access (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) conditioned on:
  ```sql
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
  )
  ```
- **Clients**: Scoped read and conditional write restricted strictly to their own client record:
  ```sql
  -- Quotes Policy for Clients
  CREATE POLICY "Clients can view their own quotes"
    ON public.quotes FOR SELECT
    USING (
      customer_id IN (
        SELECT customer_id FROM public.client_profiles
        WHERE user_id = auth.uid()
      )
    );
  
  -- Invoices Policy for Clients
  CREATE POLICY "Clients can view their own invoices"
    ON public.invoices FOR SELECT
    USING (
      customer_id IN (
        SELECT customer_id FROM public.client_profiles
        WHERE user_id = auth.uid()
      )
    );
  ```
- **Malicious Cross-Tenant Access Prevention**: A client from Company A cannot query or mutate records belonging to Company B because queries evaluate against the authenticated `auth.uid()` mapped customer ID.

---

## 3. Service Role Key Hygiene
- **Search Query**: Evaluated across entire codebase for `SUPABASE_SERVICE_ROLE_KEY`.
- **Finding**: Zero exposure in `apps/admin-web/` browser-facing bundles, and zero exposure in `apps/client-mobile/` application code.
- **Backend Isolation**: Service-role client initialization is restricted to Deno edge functions (`backend/functions/*`) behind TLS endpoints with verified authentication headers or HMAC signatures.
