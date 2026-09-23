# HENU OS CLM — MASTER SYSTEM ARCHITECTURE

**Document Version:** 1.0.0  
**Phase:** Phase 1 — Project Foundation & Master Architecture  
**Authoritative References:** [HENU_OS_CLM_PRD.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_PRD.md), [HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md), [HENU_OS_CLM_SECURITY_ACCESS.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_SECURITY_ACCESS.md), [HENU_OS_CLM_DATABASE_REALTIME_WEBHOOKS.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_DATABASE_REALTIME_WEBHOOKS.md)

---

## 1. EXECUTIVE SYSTEM OVERVIEW

The **HENU OS Customer Lifecycle Management (CLM)** platform is an enterprise-grade, real-time ecosystem connecting administrative operators with bespoke creative clients. The system is architected around a **Single Source of Truth** paradigm:

```text
┌────────────────────────────────────────────────────────┐
│                   ADMIN WEB PORTAL                     │
│               Next.js 14+ / TypeScript                │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTPS REST / WSS Realtime)
                            ▼
┌────────────────────────────────────────────────────────┐
│               SUPABASE MANAGED BACKEND                 │
│  API Gateway (Kong) │ PostgREST │ GoTrue Auth │ S3 Svc │
├────────────────────────────────────────────────────────┤
│          SUPABASE EDGE FUNCTIONS (Deno Serverless)     │
│  - Payment Creation (Razorpay / Cashfree)              │
│  - Webhook Cryptographic Verification (HMAC-SHA256)    │
│  - PDF Tax Invoice Engine & Push Dispatcher            │
├────────────────────────────────────────────────────────┤
│          CORE DATABASE ENGINE (PostgreSQL 15+)         │
│  - Row Level Security (RLS) Tenant Isolation           │
│  - Granular Dynamic RBAC (has_permission RPC)          │
│  - Atomic Sequential ID Sequences & Audit Triggers     │
│  - Logical Replication (wal2json / CDC Realtime)       │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTPS REST / WSS Realtime)
                            ▼
┌────────────────────────────────────────────────────────┐
│             FLUTTER CLIENT MOBILE APPLICATION          │
│                Dart 3.x / Flutter 3.22+                │
│                   (Android & iOS)                      │
└────────────────────────────────────────────────────────┘
```

---

## 2. CLIENT APPLICATIONS SEPARATION

### A. Admin Web Portal (Control Plane)
- **Target Platform**: Desktop Web / Modern Responsive Browsers (Chrome, Safari, Edge, Firefox).
- **Core Purpose**: Authoritative control plane for enterprise operations, customer lifecycle management, quote reviews, pricing adjustments, sales orders, invoice generation, payment ledger reconciliation, CMS publishing, and dynamic RBAC administration.
- **Technology Choice**: Next.js 14+ (App Router) / TypeScript, TanStack Query v5, TanStack Table v8, Tailwind CSS, Lucide React, and Recharts.

### B. Client Mobile Application (Client Experience Plane)
- **Target Platform**: iOS (15.0+) & Android (API Level 26+).
- **Core Purpose**: High-touch, luxury client experience for browsing service tiers, configuring add-ons, submitting bespoke quote briefs, reviewing interactive proposals, tracking project progress, processing payments via native UPI/Cards/NetBanking, and chatting with support.
- **Technology Choice**: **Flutter + Dart (Flutter 3.22+ / Dart 3.4+)** utilizing BLoC / Riverpod state management, Dio network client with token refresh interceptors, flutter_secure_storage, and local SQLite/Hive caching.

---

## 3. BACKEND & DOMAIN LOGIC ARCHITECTURE

To eliminate business logic duplication between Web and Flutter clients, all critical domain rules are enforced at the backend layer:

1. **API & Data Access Layer (PostgREST)**: Automatically exposes high-performance, strictly typed REST endpoints from the PostgreSQL schema, filtered by PostgreSQL Row Level Security (RLS).
2. **Serverless Edge Function Layer (Deno Runtime)**:
   - `create-payment-order`: Fetches authoritative `amount_due` from database and creates cryptographic orders with Razorpay / Cashfree.
   - `verify-payment-webhook`: Validates incoming HMAC-SHA256 signatures, applies idempotency locks, updates invoice/order states, and emits Realtime notifications.
   - `generate-invoice-pdf`: Renders branded tax invoice PDFs and archives them in Supabase Storage with signed URL delivery.
   - `dispatch-notification`: Routes push payloads to Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs).
3. **Core Database Engine (PostgreSQL 15+)**:
   - Manages state machine transitions, monetary precision (`NUMERIC(14, 4)` and `NUMERIC(12, 2)`), immutable audit logging triggers, and sequence generators.

---

## 4. MULTI-TENANT & CLIENT DATA ISOLATION

HENU OS CLM enforces logical and cryptographic tenant isolation:
- **Client Isolation**: Client A is mathematically barred from accessing Client B's profile, quotes, orders, invoices, payments, or private files via PostgreSQL Row Level Security:
  ```sql
  CREATE POLICY "client_quote_isolation" ON public.quotes
  FOR SELECT USING (auth.uid() = user_id OR public.has_permission('quotes.quote.view_all'));
  ```
- **Storage Isolation**: Private attachments in `client-attachments` and invoices in `system-invoices` enforce path-based RLS:
  ```sql
  CREATE POLICY "client_storage_isolation" ON storage.objects
  FOR SELECT USING ((storage.foldername(name))[1] = auth.uid()::text OR public.has_permission('quotes.quote.view_all'));
  ```

---

## 5. REALTIME SYNCHRONIZATION TOPOLOGY

PostgreSQL Change Data Capture (CDC) events stream across Phoenix WebSocket channels directly to connected Web and Mobile subscribers:
- `public:catalog` -> Service tiers, add-ons, and pricing updates.
- `public:cms` -> Dynamic Home Quick Actions, hero banners, and FAQs.
- `user:{user_id}:quotes` -> Instant proposal approval and status notifications.
- `user:{user_id}:orders` -> Live milestone and progress percentage animations.
- `user:{user_id}:payments` -> Payment capture confirmations and invoice reconciliation.
- `conv:{conv_id}` -> Real-time bidirectional support and negotiation chat.

---

## 6. SHARED CONTRACT STRATEGY

To ensure synchronization across Next.js Web and Flutter Mobile:
- **Single Source Schema**: Supabase CLI generates TypeScript definitions (`packages/shared/src/types/database.ts`).
- **OpenAPI 3.1 Spec**: Exported from PostgREST, defining request/response models, status enums, and error contracts.
- **Dart Code Generation**: `openapi-generator` or `freezed` transforms shared models into Dart data classes in `apps/mobile/lib/core/models/`.

---

### ARCHITECTURE APPROVAL
- **Status:** Complete & Implementation-Ready
- **Platform:** Next.js Admin + Flutter Mobile + Supabase Backend
- **Authority:** Approved for Phase 1 Master Architecture.
