# HENU OS CLM — PHASE 4: BACKEND INFRASTRUCTURE & PRODUCTION INTEGRATION

## 1. Executive Summary & Repository Audit
During Phase 4, the HENU OS CLM monorepo transitioned from fixture-oriented interfaces to an enterprise-grade backend infrastructure. The system topology cleanly unifies **Admin Web (Next.js 14)** and **Client Mobile (Flutter)** on top of **Supabase PostgreSQL, Supabase Realtime, Storage, Edge Functions**, and production-grade **Docker containerization**.

### Audited Components
- **Admin Web (`apps/admin-web/`)**: React 18, Next.js 14, TailwindCSS, TanStack Query, Radix UI, Lucide Icons, Stitch Design Tokens.
- **Client Mobile (`apps/client-mobile/`)**: Flutter 3.x, Riverpod, GoRouter, Stitch Theme System, Supabase Flutter.
- **Shared Package (`packages/shared/`)**: Domain models, schemas, validators, and utility contracts.
- **Backend & Database (`database/migrations/`, `backend/functions/`)**: PostgreSQL schema, RLS policies, performance indices, and Deno Edge Functions.

---

## 2. System Architecture & Topology

```text
                    HENU OS CLM PLATFORM
                             |
             +---------------+---------------+
             |                               |
       Admin Web Portal               Client Mobile App
      (Next.js Standalone)            (Flutter / Dart)
             |                               |
             +---------------+---------------+
                             |
                   Public REST / WSS / JWT
                             |
          +------------------+-------------------+
          |                                      |
   Supabase PostgreSQL                    Edge Functions
  - Schema & Foreign Keys                - razorpay-webhook
  - Row Level Security (RLS)             - cashfree-webhook
  - Performance Indices                  - create-payment-order
  - Realtime Publications                - generate-invoice-pdf
          |                              - notification-dispatcher
          +------------------+-------------------+
                             |
                 External Cloud Gateways
       - Razorpay / Cashfree API (Server-Side)
       - Resend (Email) / Twilio (SMS) / FCM (Push)
```

---

## 3. Supabase Integration & Schema Structure

Database migration: `database/migrations/20260924000001_clm_master_schema.sql`

### Core Entities:
1. `users` & `client_profiles` / `admin_profiles`: Identity and role mappings.
2. `services`: Product and service catalog.
3. `quotes` & `quote_items`: Custom project estimates with multi-currency.
4. `orders` & `order_items`: Milestone-tracked service orders.
5. `invoices` & `invoice_items`: Tax-compliant billing documents with payment status tracking.
6. `payments`: Payment records, transaction IDs, payment methods, and receipt verification.
7. `support_threads` & `support_messages`: Realtime bidirectional customer support chat.
8. `notifications`: In-app event alerts.
9. `audit_logs`: Append-only audit and webhook idempotency ledger.

---

## 4. Authentication Architecture

- **Supabase Auth**: JWT-based session persistence with secure auto-refreshing tokens.
- **Client Separation**: Admin Web and Client Mobile use public anonymous keys (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) for standard operations.
- **No Credentials in DB**: Password hashing and authentication lifecycle are delegated completely to Supabase Auth.
- **Safe Session Restoration**: On launch, both Web and Mobile verify stored sessions and handle token expirations gracefully without unhandled errors.

---

## 5. Realtime Architecture & Performance Guards

### Realtime Channels:
- `notifications`: instant delivery of order status, invoice, and payment updates.
- `support_messages`: live chat between client and admin agent.
- `invoices` & `payments`: instant payment confirmation and state transition.

### Anti-Lag & Memory Leak Prevention:
- **Active Channel Registry (`activeChannels` Map)**: Guarantees no duplicate subscriptions are created when components re-render.
- **Debounced Cache Invalidation (`setupRealtimeQuerySync`)**: TanStack Query keys are invalidated with a 150ms debounce, preventing API waterfalls.
- **Clean Teardown**: Components and Riverpod providers dispose realtime streams on unmount.

---

## 6. Edge Functions & Webhook System

Edge functions are isolated in `backend/functions/`:

1. **`razorpay-webhook/index.ts`**:
   - Validates `x-razorpay-signature` using HMAC-SHA256 with `RAZORPAY_WEBHOOK_SECRET`.
   - Handles `payment.captured`, `order.paid`, and `payment.failed`.
   - Updates `payments`, `invoices`, and `orders` atomically.
   - Enforces idempotency via `audit_logs`.
2. **`cashfree-webhook/index.ts`**:
   - Validates `x-webhook-signature` using HMAC-SHA256 with timestamp and `CASHFREE_SECRET_KEY`.
   - Handles `PAYMENT_SUCCESS_WEBHOOK` and `PAYMENT_FAILED_WEBHOOK`.
3. **`create-payment-order/index.ts`**:
   - Authenticated endpoint verifying user JWT.
   - Generates upstream gateway order using server credentials.
   - Inserts `pending` payment record in database.
4. **`generate-invoice-pdf/index.ts`**:
   - Generates invoice payload and signed download URL from Supabase Storage bucket.
5. **`notification-dispatcher/index.ts`**:
   - Multi-channel router (`in_app`, `email` via Resend, `sms`, `push`).

---

## 7. Security Architecture & Boundary Verification

### Strict Secret Segregation:
| Secret Name | Client Exposure | Execution Environment |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Safe) | Next.js / Flutter Client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Safe) | Next.js / Flutter Client |
| `SUPABASE_SERVICE_ROLE_KEY` | **NEVER EXPOSED** | Edge Functions / Server API |
| `RAZORPAY_KEY_SECRET` | **NEVER EXPOSED** | Edge Functions / Server API |
| `CASHFREE_SECRET_KEY` | **NEVER EXPOSED** | Edge Functions / Server API |
| `RESEND_API_KEY` | **NEVER EXPOSED** | Edge Functions / Server API |
| `TWILIO_AUTH_TOKEN` | **NEVER EXPOSED** | Edge Functions / Server API |

### Row Level Security (RLS) Matrix:
- **Clients**: Enforced to access only rows where `client_id = auth.uid()` (or client profile mapping).
- **Admins**: Enforced via `auth.jwt() -> role IN ('super_admin', 'admin', 'sales', 'support')`.

---

## 8. Docker & Docker Compose Infrastructure

### Root Multi-Stage Dockerfile:
- **Stage 1 (deps)**: `node:20-alpine` with `pnpm@10.15.0`, frozen lockfile.
- **Stage 2 (builder)**: Inlines public build arguments, builds Next.js standalone application.
- **Stage 3 (runner)**: Minimal unprivileged user `nextjs:nodejs`, exposes port 3000, runs `node apps/admin-web/server.js`.

### Docker Compose (`docker-compose.yml`):
- **Project Name**: `wacrm`
- **Service**: `app`
- **Port Mapping**: `${HOST_PORT:-3000}:3000`
- **Healthcheck**: Queries `http://localhost:3000/api/health` with 30s interval, 5s timeout, 3 retries.
- **Restart Policy**: `unless-stopped`

---

## 9. Deployment & Rollback Instructions

### Production Deployment:
```bash
# 1. Clone repository
git clone https://github.com/henu-os/henu-clm.git
cd henu-clm

# 2. Configure production environment
cp .env.example .env.local
# Edit .env.local with production credentials

# 3. Build & start container
docker compose -p wacrm build
docker compose -p wacrm up -d

# 4. Verify health status
docker compose -p wacrm ps
curl http://localhost:3000/api/health
```

### Rollback:
```bash
# Graceful rollback to previous image tag or git commit
git checkout <PREVIOUS_STABLE_TAG>
docker compose -p wacrm up --build -d
```
