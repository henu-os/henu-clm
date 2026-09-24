# HENU OS CLM — PHASE 8 CLIENT AUTOMATION & ONBOARDING

## 1. Automated Customer Provisioning Flow
When an administrator creates a new Customer record in Admin Web (`/customers`) and toggles **"Create Client Account"**, the system automates client account provisioning through Supabase Auth.

```text
Admin creates Customer record in /customers
            │
            ▼
Server-side Edge Function invokes supabase.auth.admin.createUser()
            │
            ├─ Assigns role: 'client'
            ├─ Links account_id to newly created customer record
            └─ Generates secure onboarding token / invite link
            │
            ▼
Transactional Email / SMS sent with secure activation link
            │
            ▼
Customer activates credentials & logs into Flutter Client Mobile App
            │
            ▼
Row Level Security (RLS) ensures customer accesses ONLY their tenant data
```

---

## 2. Security & Zero-Trust Principles
- **No Service Role Keys in Frontend**: Admin browser and Flutter mobile client NEVER hold or invoke `SUPABASE_SERVICE_ROLE_KEY`.
- **Tenant Isolation**: Database policies ensure that:
  - `quotes`, `orders`, `invoices`, `payments`, `credit_notes` are filtered by `auth.uid() = client_auth_id` or linked `customer_id`.
  - IDOR attacks (modifying UUID parameters) fail immediately at the database policy layer.
- **Secure Document Delivery**: Document PDFs and signed receipts are accessed via time-limited Supabase Storage signed URLs.
