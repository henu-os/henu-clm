# HENU OS CLM — PHASE 7: REPOSITORY & ARCHITECTURE AUDIT

## 1. System Inventory

| Module / Component | Implementation Path | Framework / Toolchain | Real/Mock Status | Audit Findings & Next Steps |
|---|---|---|---|---|
| **Admin Web Portal** | `apps/admin-web/` | Next.js 14, React 18, Tailwind, TanStack Query | **REAL & INTEGRATED** | Core screens created; requires full expansion of business modules: Items, Customers 360, Quotes, Invoices, Recurring Invoices, Payments Received, Credit Notes. |
| **Client Mobile App** | `apps/client-mobile/` | Flutter 3.29, Riverpod, GoRouter, Stitch UI | **REAL & INTEGRATED** | All primary customer outcome views created; needs complete alignment with extended business workflows. |
| **Database & Schema** | `database/migrations/` | PostgreSQL 15+, Supabase CLI | **REAL & MIGRATED** | Master schema active; requires migration for Recurring Invoices, Credit Notes, Payment Allocations, and extended Item attributes. |
| **Edge Functions** | `backend/functions/` | Deno, TypeScript, Supabase Edge | **REAL & READY** | Webhook verification, payment creation, PDF generation, notification router active. |
| **Docker Engine** | `Dockerfile`, `docker-compose.yml` | Multi-stage Alpine, Node 20, Standalone | **FIXED & VERIFIED** | Repaired missing `public/` directory issue in Docker builder stage. |
| **CI/CD Pipeline** | `.github/workflows/ci.yml` | GitHub Actions | **ACTIVE** | Multi-job workflow running Admin tests, Mobile tests, and Docker container verification. |

---

## 2. Business Entity Integration Map

```text
                                  HENU OS CLM
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
         ADMIN WEB PORTAL                             CLIENT MOBILE APP
      (Full Management System)                      (Customer Action System)
                │                                             │
      ┌─────────┴─────────┐                         ┌─────────┴─────────┐
      │ 1. Items/Catalog  │                         │ 1. View Quotes    │
      │ 2. Customers 360  │                         │ 2. Accept/Reject  │
      │ 3. Quotes Engine  │ ──── Realtime Sync ───► │ 3. View Orders    │
      │ 4. Invoices       │                         │ 4. Pay Invoices   │
      │ 5. Recurring Inv  │                         │ 5. Payment Hist.  │
      │ 6. Payments Recv  │ ◄─── Pay & Action ────  │ 6. Credit Notes   │
      │ 7. Credit Notes   │                         │ 7. Support & Notif│
      └───────────────────┘                         └───────────────────┘
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       ▼
                             SUPABASE POSTGRESQL
                       Row Level Security + Realtime
```

---

## 3. Data Mode Classification

- **REAL**: PostgreSQL Database, Supabase Auth, Row Level Security, Realtime Publications, Next.js Standalone, Flutter App Routing & State Management.
- **WAITING_FOR_CREDENTIALS**: Live Razorpay Key Secret & Live Cashfree Secret (currently operating in secure sandbox mode with full signature verification).
- **WAITING_FOR_MACOS_XCODE**: iOS native IPA packaging (executed on Windows workstation; build tested on Android & Dart tests).
