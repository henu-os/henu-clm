# HENU OS CLM — PHASE 9: REPOSITORY FORENSIC AUDIT

## 1. Executive Summary
This document provides an objective, code-level forensic audit of the entire HENU OS CLM repository. Every claim in this document is verified against actual source code files, database schemas, edge functions, client mobile implementation, and testing suites.

---

## 2. Directory Structure & Monorepo Topology
The monorepo uses `pnpm` workspace topology configured in `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Top-Level Layout
- `apps/admin-web`: Next.js 14 App Router administration web portal.
- `apps/client-mobile`: Flutter / Dart client mobile application targeting Android and iOS.
- `backend/functions`: Supabase / Deno Edge Functions for server-side processing, webhooks, payments, and PDF generation.
- `database/migrations`: PostgreSQL DDL schemas, RLS policies, multi-tenant triggers, and constraints.
- `database/seeds`: Staging and development baseline seed data.
- `packages/shared`: Shared TypeScript types and Zod schemas.
- `packages/config`: Shared configuration templates.
- `docs/`: Comprehensive architecture, specifications, manual QA records, and phase audit reports.
- `stich_henu_os_clm_portal`: UI design assets and HTML prototypes for the Admin Portal.
- `stitch_henu_os_clm_mobile_app_design_system`: Design assets and prototypes for the Client Mobile App.

---

## 3. Applications & Frameworks
| Layer | Framework / Technology | Version / Stack | Entry Point |
|---|---|---|---|
| Admin Web | Next.js 14 (App Router) | React 18, TypeScript 5.9, TailwindCSS | `apps/admin-web/src/app/layout.tsx` |
| Client Mobile | Flutter 3.x / Dart 3.x | Provider, GoRouter, Material 3 | `apps/client-mobile/lib/main.dart` |
| Backend Edge Functions | Supabase Edge Functions / Deno | TypeScript, Deno std http server | `backend/functions/*/index.ts` |
| Database Engine | PostgreSQL 15 (Supabase) | Multi-tenant RLS, Triggers, UUIDv4 | `database/migrations/` |
| Shared Models | TypeScript / Zod | Zod 3.25 | `packages/shared/src/index.ts` |
| Containerization | Docker / Docker Compose | Node 20-alpine multi-stage build | `Dockerfile`, `docker-compose.yml` |

---

## 4. Database & Persistence Layer
Migrations in `database/migrations/`:
1. `20260924000001_clm_master_schema.sql` (Master Schema):
   - Tables: `roles`, `permissions`, `role_permissions`, `client_profiles`, `admin_profiles`, `customers`, `service_categories`, `services`, `service_add_ons`, `quotes`, `quote_items`, `orders`, `order_milestones`, `invoices`, `payments`, `webhook_idempotency_log`, `support_threads`, `support_messages`, `notifications`, `audit_logs`.
2. `20260924000003_clm_management_modules.sql` (Accounting & Extended Modules):
   - Tables: `items`, `customer_contacts`, `recurring_invoices`, `recurring_invoice_items`, `credit_notes`, `credit_note_items`, `credit_note_allocations`, `payment_allocations`.
3. `20260924000004_clm_document_designer_and_automation.sql` (Document Designer & System Settings):
   - Tables: `document_templates`, `document_template_versions`, `organization_settings`, `document_defaults`, `custom_fields`.

---

## 5. Security & Isolation Architecture
- **Multi-Tenancy**: Organization IDs (`organization_id` / `tenant_id`) and client profile relations enforce tenant partition.
- **Row-Level Security (RLS)**: Enforced across all tables via PostgreSQL RLS policies ensuring clients only view their assigned records while tenant administrators have scoped organization access.
- **Secret Hygiene**: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to `backend/functions/` (Deno runtime). Neither the web frontend bundle nor the mobile application exposes service role credentials.
- **Role-Based Access Control (RBAC)**: Enforced via `apps/admin-web/src/lib/permissions.ts` across admin routes (`admin`, `manager`, `technician`, `viewer`).

---

## 6. Realtime & Background Webhooks
- **Realtime Layer**: `apps/admin-web/src/lib/realtime/index.ts` establishes scoped Postgres change subscriptions (`invoices`, `orders`, `quotes`, `payments`, `support_messages`).
- **Payment Webhooks**:
  - `backend/functions/razorpay-webhook/index.ts` with HMAC SHA-256 signature verification and idempotency auditing.
  - `backend/functions/cashfree-webhook/index.ts` with signature verification and idempotency auditing.

---

## 7. Test Infrastructure & CI/CD
- **Admin Web**: Vitest test runner (`apps/admin-web/tests/`) covering financial calculation, number-to-words conversion, webhook idempotency, security validation, permissions, document designer schemas, and E2E flows.
- **Client Mobile**: Standalone automated Dart test runner (`apps/client-mobile/test/run_unit_tests.dart`) covering formatting utilities, token isolation, model serialization, and repository flows.
- **Docker**: Production-ready multi-stage Docker build validated with `docker compose -p wacrm config`.
