# HENU OS CLM — Customer Lifecycle Management Platform

[![CI/CD Pipeline](https://github.com/henu-os/henu-clm/actions/workflows/ci.yml/badge.svg)](https://github.com/henu-os/henu-clm/actions)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-cyan.svg)](https://github.com/henu-os/henu-clm)

**HENU OS CLM** is an enterprise customer lifecycle management and bespoke estimation platform connecting operations executives with high-touch creative enterprise clients.

---

## 🏛️ System Architecture

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

## 📚 Master Documentation Suite

| Document | Purpose |
| :--- | :--- |
| [HENU_OS_CLM_PRD.md](./HENU_OS_CLM_PRD.md) | Authoritative Product Requirements Document (PRD). |
| [HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md](./HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md) | Technical Architecture & Cloud Topology. |
| [HENU_OS_CLM_SECURITY_ACCESS.md](./HENU_OS_CLM_SECURITY_ACCESS.md) | Security Model, Dynamic RBAC & Threat Matrix. |
| [HENU_OS_CLM_FRONTEND_SPECIFICATION.md](./HENU_OS_CLM_FRONTEND_SPECIFICATION.md) | Visual System, Design Tokens & Screen Specifications. |
| [HENU_OS_CLM_FEATURE_TICKETS.md](./HENU_OS_CLM_FEATURE_TICKETS.md) | 22-Attribute Standardized Feature Backlog (21 Epics). |
| [HENU_OS_CLM_DATABASE_REALTIME_WEBHOOKS.md](./HENU_OS_CLM_DATABASE_REALTIME_WEBHOOKS.md) | Normalized 34-Table Database, Realtime & Webhook Spec. |
| [docs/SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md) | Master System Overview & Single Source of Truth Principle. |
| [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) | Monorepo Structure & Package Boundaries. |
| [docs/DEVELOPMENT_WORKFLOW.md](./docs/DEVELOPMENT_WORKFLOW.md) | Git Branching Model & Quality Standards. |
| [docs/ENVIRONMENT_CONFIGURATION.md](./docs/ENVIRONMENT_CONFIGURATION.md) | Environment Tiers & Secret Isolation. |
| [docs/API_ARCHITECTURE.md](./docs/API_ARCHITECTURE.md) | API Endpoints & Uniform Error Envelopes. |
| [docs/MOBILE_ARCHITECTURE.md](./docs/MOBILE_ARCHITECTURE.md) | Flutter Clean Architecture & BLoC State Patterns. |
| [docs/TESTING_ARCHITECTURE.md](./docs/TESTING_ARCHITECTURE.md) | Testing Pyramid & Automated Test Strategies. |
| [docs/DEPLOYMENT_ARCHITECTURE.md](./docs/DEPLOYMENT_ARCHITECTURE.md) | CI/CD Workflows & Cloud Infrastructure. |
| [docs/IMPLEMENTATION_PHASES.md](./docs/IMPLEMENTATION_PHASES.md) | 8-Phase Step-by-Step Delivery Roadmap. |

---

## 🚀 Sequential Implementation Phases

1. **PHASE 1: Master Architecture & Project Foundation** *(Current Phase - Complete)*
2. **PHASE 2: Admin Web Portal** *(Next.js 14 / TypeScript)*
3. **PHASE 3: Flutter / Dart Mobile Application** *(iOS & Android)*
4. **PHASE 4: Backend & API** *(Supabase Edge Functions)*
5. **PHASE 5: Configuration & Integrations** *(Razorpay, Cashfree, FCM, Resend)*
6. **PHASE 6: Database & Realtime** *(PostgreSQL Migrations & CDC Publications)*
7. **PHASE 7: Security & Access Control** *(Row Level Security & Dynamic RBAC)*
8. **PHASE 8: Final Integration, Testing & Production Readiness**

---

## 🎨 Approved Stitch Design References

- **Admin Web Portal**: `stich_henu_os_clm_portal/`
- **Client Mobile App Ecosystem**: `stitch_henu_os_clm_mobile_app_design_system/`
  - 3D Dragon Splash Experience
  - Authentication & Client Registration
  - Home Dashboard & Quick Actions
  - Services & Quote Builder
  - Finance, Invoices & Checkout
  - In-App Browser & Realtime Support
  - Client Profile & Security Settings

---

## 🔒 Security & Tenant Isolation

- **Client Data Isolation**: Guaranteed by PostgreSQL Row Level Security (`auth.uid() = user_id`).
- **Dynamic RBAC**: Dynamic database permissions validated via `public.has_permission()` stored procedure.
- **Payment Security**: Zero-trust client model; order amounts locked server-side and incoming webhooks verified with HMAC-SHA256 signatures.

---

© 2026 HENU OS. All rights reserved. Proprietary & Confidential.
