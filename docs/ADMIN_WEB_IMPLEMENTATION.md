# HENU OS CLM — ADMIN WEB PORTAL IMPLEMENTATION DOCUMENT

**Document Version:** 1.0.0  
**Phase:** Phase 2 — Admin Web Portal Implementation  
**Target Platform:** Next.js 14+ (App Router) / TypeScript / Tailwind CSS  
**Visual Reference:** [stich_henu_os_clm_portal/code.html](file:///j:/CLM%20HENU%20A%26M/stich_henu_os_clm_portal/code.html) and [DESIGN.md](file:///j:/CLM%20HENU%20A%26M/stich_henu_os_clm_portal/DESIGN.md)  
**Authoritative References:** [HENU_OS_CLM_FRONTEND_SPECIFICATION.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_FRONTEND_SPECIFICATION.md), [HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md), [HENU_OS_CLM_SECURITY_ACCESS.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_SECURITY_ACCESS.md)

---

## 1. IMPLEMENTATION OVERVIEW

The **HENU OS CLM Admin Web Portal** (`apps/admin-web/`) has been implemented as a production-grade, responsive Next.js 14 application conforming strictly to the Google Stitch UI design reference.

```text
apps/admin-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx               # Secure Administrative Login
│   │   │   ├── forgot-password/page.tsx     # Password Recovery Link Dispatch
│   │   │   ├── reset-password/page.tsx      # Secure Password Update
│   │   │   └── layout.tsx                   # Auth Card Layout & Branding
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx           # Executive KPI Dashboard & Revenue Chart
│   │   │   ├── customers/page.tsx           # CRM Table, VIP Tiers & Customer 360 Drawer
│   │   │   ├── catalog/page.tsx             # Services & Add-on Tier Configurator
│   │   │   ├── quotes/page.tsx              # Quotes Workbench & Margin Calculator
│   │   │   ├── orders/page.tsx              # Sales Orders & Delivery Milestones
│   │   │   ├── invoices/page.tsx            # Tax Invoices & PDF Action
│   │   │   ├── payments/page.tsx            # Payments Ledger & Reconciliation
│   │   │   ├── support/page.tsx             # Two-Pane Support Desk & Realtime Chat
│   │   │   ├── cms/page.tsx                 # Mobile App Dynamic Quick Actions
│   │   │   ├── notifications/page.tsx       # Notifications Queue & Broadcast Center
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx                 # Settings Directory Hub
│   │   │   │   ├── payments/page.tsx        # Razorpay/Cashfree Masked Secret Config
│   │   │   │   ├── ai/page.tsx              # AI Assistant Masked Provider Config
│   │   │   │   └── roles/page.tsx           # RBAC Roles & Permissions Matrix
│   │   │   └── layout.tsx                   # Global Admin Shell & Collapsible Sidebar
│   │   ├── layout.tsx                       # Root Layout & Plus Jakarta Sans Font
│   │   └── page.tsx                         # Direct redirect to /dashboard
│   ├── components/
│   │   ├── ui/                              # Reusable Primitives (Button, Input, Card, Badge, Modal, Drawer, Table)
│   │   ├── navigation/                      # Sidebar, Header, Breadcrumbs
│   │   ├── feedback/                        # Toast Provider & Notification Alerts
│   │   └── command-palette/                 # Global Cmd+K / Ctrl+K Command Palette
│   ├── features/                            # Typed Services & Development Fixtures
│   ├── lib/                                 # Utils, Formatters, RBAC Matrix, Supabase Client
│   ├── providers/                           # TanStack Query & Toast Context
│   └── styles/globals.css                   # Stitch UI Design Tokens & Theme Variables
└── tests/                                   # Vitest Unit & Validation Test Suite
```

---

## 2. IMPLEMENTED ROUTES & MODULES

| Route Path | Module Name | Core Capabilities |
| :--- | :--- | :--- |
| `/login` | Administrative Login | Email/Password auth, session persistence, input validation. |
| `/forgot-password` | Password Recovery | Password reset link dispatch with instant toast feedback. |
| `/reset-password` | Password Update | Password confirmation check and security policy validation. |
| `/dashboard` | Executive Dashboard | 8 KPI Metric Tiles, Revenue vs Target Area Chart, Quick Approvals drawer, Live activity feed. |
| `/customers` | Customer Management | TanStack Table, search, VIP tier filtering, Customer 360 flyout drawer, new customer enrollment. |
| `/catalog` | Services & Add-ons | Tiered service cards, add-on accordion list, service creation modal with Zod validation. |
| `/quotes` | Quotes Workbench | Quotes pipeline table, line items breakdown, margin calculator, proposal review drawer, approval/rejection modals. |
| `/orders` | Sales Orders | Order status grid, progress bar animations, linked invoice deep links, milestone completion tags. |
| `/invoices` | Tax Invoices | Invoices table, tax breakdown, financial KPI summary, PDF generation action. |
| `/payments` | Payments Ledger | Transaction ledger, gateway filtering (Razorpay vs Cashfree), cryptographic signature modal. |
| `/support` | Support Desk | Two-pane conversation interface, real-time message composer, ticket priority indicators. |
| `/cms` | Mobile App CMS | Dynamic Home Quick Actions grid, active/disabled toggles live on mobile clients. |
| `/notifications` | Notifications Center | System alert feed, category badges, mark-all-read action. |
| `/settings` | Settings Overview | Navigation hub for payments, AI, roles, and team administration. |
| `/settings/payments`| Payment Config | Masked secret management for Razorpay & Cashfree (`rzp_test_************`, Test Connection, Enabled toggle). |
| `/settings/ai` | AI Assistant Config | Masked API key management for OpenAI / Anthropic / Gemini, temperature, context limit, and request timeout. |
| `/settings/roles` | RBAC Matrix | Permissions matrix inspector verifying role bindings against `public.has_permission()`. |

---

## 3. DESIGN SYSTEM & TOKEN FIDELITY

The Admin Web Portal strictly codifies the **Stitch UI** design tokens:
- **Surfaces**: `bg-surface` (`#fdf9f2`), `bg-surface-container-low` (`#f7f3ec`), `bg-surface-container-lowest` (`#ffffff`), `bg-surface-container-high` (`#ece8e1`).
- **Primary Accent**: `bg-primary` (`#5e548c`), `text-primary` (Royal Iris).
- **Secondary & Tertiary**: `bg-secondary` (`#22676f` Deep Teal), `bg-tertiary` (`#7a5500` Saffron Gold).
- **Status Accents**: `bg-error` (`#ba1a1a`), `bg-tertiary-fixed` (`#ffdeaa`), `bg-primary-fixed` (`#e6deff`).
- **Typography**: `Plus Jakarta Sans` across all font weights (Regular 400, Medium 500, SemiBold 600, Bold 700).

---

## 4. SECURITY & CONFIGURATION ISOLATION

### Environment Variable Classification

| Variable Name | Exposure Classification | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **PUBLIC (Client Bundle)** | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **PUBLIC (Client Bundle)** | Public anonymous key constrained by RLS. |
| `NEXT_PUBLIC_APP_ENV` | **PUBLIC (Client Bundle)** | Environment indicator (`development`, `staging`, `production`). |
| `SUPABASE_SERVICE_ROLE_KEY` | **PROTECTED (Server Only)** | Superuser backend token — **NEVER exposed to browser**. |
| `RAZORPAY_KEY_SECRET` | **SECRET (Supabase Vault)** | Payment secret — **NEVER exposed to browser**. |
| `CASHFREE_SECRET_KEY` | **SECRET (Supabase Vault)** | Payment secret — **NEVER exposed to browser**. |
| `AI_PROVIDER_API_KEY` | **SECRET (Supabase Vault)** | Model key — **NEVER exposed to browser**. |

---

## 5. DEVELOPMENT & VERIFICATION COMMANDS

```bash
# Run Admin Web Portal locally on port 3000
pnpm --filter admin-web dev

# Execute TypeScript typecheck
pnpm --filter admin-web typecheck

# Execute Vitest unit and validation test suite
pnpm --filter admin-web test

# Execute Next.js production build
pnpm --filter admin-web build
```

---

### IMPLEMENTATION APPROVAL
- **Status:** Complete, Tested & Verified
- **Target:** Next.js 14 Admin Web Portal (`apps/admin-web/`)
- **Ready for:** Phase 3 (Flutter Mobile Application).
