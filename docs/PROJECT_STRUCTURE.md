# HENU OS CLM — PROJECT & REPOSITORY STRUCTURE

**Document Version:** 1.0.0  
**Phase:** Phase 1 — Project Foundation & Master Architecture  
**Authoritative References:** [HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md), [HENU_OS_CLM_FRONTEND_SPECIFICATION.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_FRONTEND_SPECIFICATION.md)

---

## 1. REPOSITORY REORGANIZATION PHILOSOPHY

The repository adopts an enterprise monorepo layout that strictly isolates the **Admin Web Portal**, the **Flutter Mobile Client**, the **Supabase Backend Services**, the **Database Migrations**, and **Shared Type Contracts** while preserving all approved Stitch design references.

---

## 2. DIRECTORY TREE SPECIFICATION

```text
henu-clm/
├── .github/                              # GitHub Actions CI/CD Workflows
│   └── workflows/
│       ├── ci.yml                        # Monorepo lint, typecheck & test
│       ├── deploy-admin.yml              # Next.js deployment to Vercel/Cloudflare
│       ├── deploy-backend.yml            # Supabase Edge Functions & DB migrations
│       └── build-mobile.yml              # Flutter iOS/Android build & release
│
├── apps/                                 # Client Applications
│   ├── admin-web/                        # Phase 2: Next.js 14 Admin Web Portal
│   │   ├── src/
│   │   │   ├── app/                      # Next.js App Router Pages
│   │   │   │   ├── (auth)/               # Admin Login, Reset Password
│   │   │   │   └── (dashboard)/          # Dashboard, Customers, Quotes, Invoices, CMS
│   │   │   ├── components/               # UI Primitives, Tables, Modals, Drawers
│   │   │   ├── hooks/                    # TanStack Query & Supabase Hooks
│   │   │   ├── lib/                      # Supabase Client, Auth Helpers, Utilities
│   │   │   └── styles/                   # Tailwind CSS, Global Theme Variables
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/                           # Phase 3: Flutter / Dart Mobile Client
│       ├── android/                      # Native Android Platform Config
│       ├── ios/                          # Native iOS Platform Config
│       ├── lib/                          # Flutter Application Source
│       │   ├── core/                     # Theme, Constants, Network, Security
│       │   │   ├── network/              # Dio Client, Token Interceptors
│       │   │   ├── security/             # Biometrics, SecureStorage, Sandbox
│       │   │   ├── theme/                # HENU OS Visual System & Design Tokens
│       │   │   └── utils/                # Formatters, Currency, Error Handlers
│       │   ├── features/                 # Modular Feature Slices (Domain + Data + UI)
│       │   │   ├── auth/                 # Splash, Login, Register, Biometrics
│       │   │   ├── home/                 # Home Ecosystem, 3D Sphere, Quick Actions
│       │   │   ├── catalog/              # Services, Add-ons, Tier Configurator
│       │   │   ├── quotes/               # Quote Wizard, Proposals, Orders
│       │   │   ├── billing/              # Invoices, Razorpay/Cashfree Checkout
│       │   │   ├── browser/              # HENU OS In-App Browser Sandbox
│       │   │   ├── support/              # Realtime Chat & Help Desk
│       │   │   └── profile/              # User Profile, Security, Settings
│       │   └── main.dart                 # Application Entry Point & Dependency Injection
│       └── pubspec.yaml                  # Flutter Dependencies & Asset Declarations
│
├── backend/                              # Phase 4: Supabase Edge Functions & Webhooks
│   ├── functions/                        # Deno Serverless Edge Functions
│   │   ├── create-payment-order/         # Razorpay & Cashfree Order Generator
│   │   ├── verify-payment-webhook/       # HMAC-SHA256 Signature Validator
│   │   ├── generate-invoice-pdf/         # Tax Invoice PDF Renderer
│   │   ├── dispatch-notification/        # FCM & APNs Push Dispatcher
│   │   └── ingest-telemetry/             # Asynchronous Telemetry Ingester
│   └── deno.json                         # Deno Configuration & Import Maps
│
├── database/                             # Phase 6: Supabase PostgreSQL Database
│   ├── migrations/                       # Sequential Versioned SQL Migrations
│   │   ├── 00_extensions.sql
│   │   ├── 01_enums.sql
│   │   ├── 02_sequences.sql
│   │   ├── 03_identity_and_rbac.sql
│   │   ├── 04_customer_management.sql
│   │   ├── 05_catalog_services.sql
│   │   ├── 06_portfolio_showcase.sql
│   │   ├── 07_digital_products.sql
│   │   ├── 08_special_offers.sql
│   │   ├── 09_commercial_quotes.sql
│   │   ├── 10_sales_orders.sql
│   │   ├── 11_invoicing_billing.sql
│   │   ├── 12_payment_ledgers.sql
│   │   ├── 13_credit_notes.sql
│   │   ├── 14_communication_support.sql
│   │   ├── 15_notifications_queue.sql
│   │   ├── 16_cms_and_settings.sql
│   │   ├── 17_storage_buckets.sql
│   │   ├── 18_audit_logging.sql
│   │   ├── 19_rls_security_policies.sql
│   │   ├── 20_realtime_publications.sql
│   │   └── 21_seed_initial_data.sql
│   ├── seeds/                            # Development & Staging Seed Fixtures
│   └── config.toml                       # Supabase Local Development Config
│
├── packages/                             # Shared Monorepo Packages
│   ├── shared/                           # Shared Data Contracts & Utilities
│   │   ├── src/
│   │   │   ├── types/                    # Database Types, DTOs, Enums
│   │   │   ├── validation/               # Zod Schemas for API Payloads
│   │   │   └── constants/                # Error Codes, Route Names, Currencies
│   │   └── package.json
│   │
│   └── config/                           # Shared Tooling Configurations
│       ├── eslint-config/
│       ├── tailwind-config/
│       └── tsconfig/
│
├── docs/                                 # Comprehensive System Documentation
│   ├── SYSTEM_ARCHITECTURE.md            # Master Architecture Overview
│   ├── PROJECT_STRUCTURE.md              # Monorepo Folder Tree
│   ├── DEVELOPMENT_WORKFLOW.md           # Local Dev, Linting & Branch Strategy
│   ├── ENVIRONMENT_CONFIGURATION.md      # Config, Variables & Secret Isolation
│   ├── API_ARCHITECTURE.md               # API Endpoints, PostgREST & Error Handling
│   ├── MOBILE_ARCHITECTURE.md            # Flutter Architectural Specification
│   ├── TESTING_ARCHITECTURE.md           # Test Strategies (Unit, Integration, E2E)
│   ├── DEPLOYMENT_ARCHITECTURE.md        # CI/CD, Cloud Infrastructure & Hosting
│   └── IMPLEMENTATION_PHASES.md          # 8-Phase Step-by-Step Delivery Roadmap
│
├── stich_henu_os_clm_portal/             # Preserved Approved Admin Stitch UI Reference
│   ├── DESIGN.md
│   ├── code.html
│   └── screen.png
│
├── stitch_henu_os_clm_mobile_app_design_system/ # Preserved Approved Mobile Stitch UI
│   ├── henu_os_clm_3d_dragon_splash_experience/
│   ├── henu_os_clm_client_profile/
│   ├── henu_os_clm_finance_invoices/
│   ├── henu_os_clm_home_dashboard/
│   ├── henu_os_clm_registration_client_id/
│   ├── henu_os_clm_services_quote_builder/
│   ├── henu_os_clm_settings_preferences/
│   ├── henu_os_clm_sign_in_auth_entry/
│   ├── henu_os_clm_support_chat_in_app_browser/
│   └── porcelain_architectural_clm/
│
├── scripts/                              # Workspace Utility Scripts
│   ├── generate-types.sh                 # Supabase TypeScript Generator
│   ├── setup-local-env.sh                # Local Docker & Supabase Setup
│   └── seed-database.sh                  # Seed Runner for Test Environments
│
├── .env.example                          # Sanitized Environment Variable Template
├── .gitignore                            # Standard Multi-Stack Git Ignore Rules
├── README.md                             # Repository Master Documentation
├── HENU_OS_CLM_PRD.md                    # Primary Business Requirements Document
├── HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md # Master Technical Architecture
├── HENU_OS_CLM_SECURITY_ACCESS.md        # Security & RBAC Specification
├── HENU_OS_CLM_FRONTEND_SPECIFICATION.md # Visual System & Front-End Spec
├── HENU_OS_CLM_FEATURE_TICKETS.md        # Feature Tickets & Backlog
└── HENU_OS_CLM_DATABASE_REALTIME_WEBHOOKS.md # Database & Webhook Master Spec
```

---

### REPOSITORY STRUCTURE APPROVAL
- **Status:** Finalized & Validated
- **Preservation:** 100% of approved Stitch UI folders and specification markdown files retained intact.
