# HENU OS CLM — MANUAL TEST ACCOUNTS MATRIX

## 1. Overview
This matrix defines test accounts for manual QA across Admin Web and Client Mobile. Passwords are environment-controlled and never stored in the repository.

---

## 2. Test Account Directory

| Role / Persona | Email Identifier | Target Interface | Permissions & Access Scope | Expected Restrictions |
|---|---|---|---|---|
| **Super Admin** | `superadmin@henuos.com` | Admin Web | Full system access: Catalog, Quotes, Orders, Invoices, Payments, Support, Settings, Security, RBAC. | None. Full system superuser. |
| **Operations Admin** | `admin@henuos.com` | Admin Web | Operations access: Customers, Services, Quotes, Orders, Invoices, Support Chat. | Cannot alter global security / RBAC permissions. |
| **Sales Executive** | `sales@henuos.com` | Admin Web | Sales Workbench: Customer directory, Service Catalog, Create & Send Quotes. | Cannot modify payment gateway settings or access financial payout settings. |
| **Support Specialist** | `support@henuos.com` | Admin Web | Concierge Support: Realtime support chat, ticket resolution, customer activity feed. | Cannot create invoices or modify quote financial values. |
| **Client A (Enterprise VIP)** | `siddharth@folio.enterprise` | Client Mobile / Web | Customer Portal: View quotes, approve/reject proposals, view orders, pay invoices, 24/7 concierge support. | **Strictly isolated to Client A data.** Cannot query Client B records (enforced by RLS). |
| **Client B (Standard)** | `elena@acme.ventures` | Client Mobile / Web | Customer Portal: Quotes, orders, invoices, support for Acme Global Ventures. | **Strictly isolated to Client B data.** |

---

## 3. Local Password Convention
For local staging/development Supabase instances:
- **Default Dev Password**: Set securely in local environment as `PASSWORD_FROM_LOCAL_SECRET` (e.g. `HenuDev2026!`).
- **Session Lifespan**: 60 minutes with auto-refresh enabled.
