# HENU OS CLM — Product Requirements Document

> **Simple systems. Real progress.**

---

## 1. Document Control

| Field | Value |
|---|---|
| **Document Title** | HENU OS CLM — Product Requirements Document |
| **Version** | 1.0.0 |
| **Status** | Draft — Pending Stakeholder Approval |
| **Created** | 2026-09-24 |
| **Author** | HENU OS Product Engineering |
| **Classification** | Internal — Confidential |
| **Review Cycle** | Quarterly |

### Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0.0 | 2026-09-24 | HENU OS Product Engineering | Initial PRD derived from completed Stitch UI reference |

### Document References

| Reference | Location |
|---|---|
| Admin Portal Stitch UI | `stich_henu_os_clm_portal/` |
| Mobile App Design System | `stitch_henu_os_clm_mobile_app_design_system/` |
| Admin Portal Design Spec | `stich_henu_os_clm_portal/DESIGN.md` |
| Mobile Design Spec | `porcelain_architectural_clm/DESIGN.md` |

---

## 2. Product Vision

HENU OS CLM is a **premium Client Lifecycle Management platform** that unifies sales management, service catalogue delivery, financial operations, and client experience into a single cohesive operating system.

The platform replaces fragmented spreadsheets, disconnected invoicing tools, manual quote processes, and siloed communication channels with an integrated two-product ecosystem:

1. An **Admin Web Portal** — the administrative control plane where HENU OS operators manage every aspect of client relationships, sales pipelines, service catalogues, financial instruments, communications, content, and analytics.

2. A **Client Mobile Application** — the client-facing advisory folio where clients view their services, manage financial obligations, communicate with assigned architects, browse portfolio work, purchase products, and interact with the HENU OS ecosystem through a premium, architecturally composed experience.

**HENU OS CLM is NOT a generic CRM.** It does not include lead scoring, email marketing automation, sales team gamification, contact database management, or any traditional CRM functionality unless explicitly specified in this document. It is purpose-built for managing the **full lifecycle of an existing client relationship** — from initial service quotation through ongoing invoice settlement, product delivery, and continuous advisory communication.

---

## 3. Product Goals

| # | Goal | Success Metric |
|---|---|---|
| G-01 | Centralize all client lifecycle operations into a single platform | 100% of quotes, invoices, payments, and communications flow through HENU OS CLM |
| G-02 | Provide clients with a self-service financial and service management experience | Clients can view, download, and pay invoices without admin intervention |
| G-03 | Reduce quote-to-payment cycle time | Quote conversion rate ≥ 60%; average settlement within 15 days of invoice issue |
| G-04 | Deliver a premium, trust-building client experience | Client satisfaction score ≥ 4.5/5.0; zero credential exposure incidents |
| G-05 | Enable real-time operational visibility for administrators | All KPI dashboards update within 30 seconds of data change |
| G-06 | Support multi-gateway payment processing | Integrate Razorpay, Cashfree, Stripe, and Bank NEFT/Wire channels |
| G-07 | Deliver a branded 3D immersive splash experience for the client mobile app | 60fps rendering with reduced-motion accessibility fallback |

---

## 4. Product Scope

### 4.1 In Scope

- Sales Management (Quotes, Sales Orders, Invoices, Recurring Invoices, Payments, Credit Notes, Statements)
- Customer Management (Client records, Client IDs, Client lifecycle tracking)
- Service Catalogue (Services, Service Categories, Service Add-ons)
- Portfolio Management (Project showcases viewable by clients)
- Product Catalogue (Digital Products, Source Code, Software Products)
- Offers and Promotions
- Client Communication (In-app support chat, file sharing, document references)
- Notification System (Push notifications, in-app notifications, notification preferences)
- App CMS (Company Information, FAQs, Legal Pages, Social Links)
- Analytics and Reporting (Revenue, pipeline, quote conversion, service performance)
- Payment Gateway Integration (Razorpay, Cashfree, Stripe, Bank NEFT/Wire)
- In-App Browser (Secure document viewer within the client mobile application)
- Authentication System (Sign in, registration, forgot/reset password, Client ID generation)
- 3D Dragon Splash Experience (Cinematic WebGL splash screen)
- Client Profile and Settings Management
- Admin Settings, Users, Roles and Permissions
- Dark Mode support (both products)
- Real-time data synchronization

### 4.2 Out of Scope

- Lead generation and prospecting tools
- Email marketing automation
- Sales team performance gamification
- Contact database management (beyond client records)
- Social media management
- Website builder functionality
- Project management / task tracking (beyond milestone progress visibility)
- Time tracking
- Inventory management
- Shipping / logistics
- HR / employee management
- Multi-tenancy (multiple organizations within one deployment) — future extensibility only
- Native desktop applications
- Offline-first mobile functionality — future extensibility only

---

## 5. Target Users

### 5.1 Primary Users

| User Type | Description | Platform |
|---|---|---|
| **HENU OS Administrator** | Super Admin with full platform access. Manages all customers, sales, services, products, CMS, analytics, settings, users, and roles. | Admin Web Portal |
| **HENU OS Sales Executive** | Creates and manages quotes, sales orders, invoices. Requests discount approvals. Limited administrative access. | Admin Web Portal |
| **HENU OS Finance Operator** | Manages payments, credit notes, statements, payment gateway reconciliation. Approves vendor payouts. | Admin Web Portal |
| **HENU OS Client** | External client who views services, manages invoices, makes payments, communicates with HENU OS, and browses portfolio/products. | Client Mobile Application |

### 5.2 Secondary Users

| User Type | Description | Platform |
|---|---|---|
| **HENU OS Content Manager** | Manages App CMS content: FAQs, legal pages, company information, social links. | Admin Web Portal |
| **HENU OS Support Agent** | Responds to client support chats, manages support tickets, shares documents. | Admin Web Portal |

---

## 6. User Roles

### 6.1 Admin Web Portal Roles

| Role | Description | Permissions Summary |
|---|---|---|
| **Super Admin** | Full unrestricted access to all modules | All CRUD operations, user management, role assignment, settings, payment gateway configuration, analytics, CMS, approvals |
| **Sales Admin** | Manages sales pipeline | CRUD on Quotes, Sales Orders, Invoices. Read on Customers, Services, Products. Cannot manage Users, Roles, or Settings. |
| **Finance Admin** | Manages financial operations | CRUD on Invoices, Payments, Credit Notes, Statements, Recurring Invoices. Read on Customers, Quotes, Sales Orders. Approve vendor payouts. |
| **Content Admin** | Manages CMS and communication | CRUD on FAQs, Legal Pages, Company Info, Social Links, Offers, Notifications. Read on Customers. |
| **Support Agent** | Manages client communication | Read/Write on Support Chat, Notifications. Read on Customers, Invoices, Quotes. |
| **Viewer** | Read-only access | Read on all modules. No create, update, or delete permissions. |

### 6.2 Client Mobile Application Roles

| Role | Description |
|---|---|
| **Authenticated Client** | Full access to all client-facing features (dashboard, finance, services, portfolio, products, support, settings, profile) |
| **Unauthenticated Visitor** | Access to splash screen, sign-in, registration, and forgot password flows only |

---

## 7. Product Architecture Overview

### Architecture Diagram

```
HENU OS CLM PLATFORM
├── ADMIN WEB PORTAL (Desktop-first)
│   ├── Dashboard
│   ├── Sales (Customers, Quotes, Sales Orders, Invoices,
│   │         Recurring Invoices, Payments, Credit Notes, Statements)
│   ├── Catalogue (Services, Categories, Add-ons)
│   ├── Portfolio
│   ├── Products (Digital, Source Code, Software)
│   ├── Offers (Promotions)
│   ├── Communication (Support Chat, Announcements)
│   ├── Analytics
│   ├── App CMS (Company Info, FAQs, Legal, Social Links)
│   └── Settings (General, Users, Roles, Payment Gateways, Notifications)
│
├── CLIENT MOBILE APPLICATION (Mobile-first, iOS and Android)
│   ├── 3D Splash Screen
│   ├── Authentication (Sign In, Register, Forgot/Reset Password)
│   ├── Home Dashboard
│   ├── Services and Quote Builder
│   ├── Finance Hub (Invoices, Payments, Statements, Sales Orders)
│   ├── Portfolio Browser
│   ├── Support Chat
│   ├── In-App Browser
│   ├── Client Profile
│   └── Settings
│
├── SHARED SERVICES
│   ├── Authentication and Session Management
│   ├── Payment Gateways (Razorpay, Cashfree, Stripe, Bank NEFT)
│   ├── Notification Engine (Push, In-App, Email)
│   ├── Real-time WebSocket Layer
│   ├── API Layer
│   └── File/Object Storage
│
└── DATA LAYER
    ├── Supabase PostgreSQL
    └── File/Object Storage
```

### 7.1 Admin Web Portal Layout Architecture

- **Fixed sidebar** (240px, collapsible to 64px icon rail) with navigation spine
- **Dynamic analytical canvas** using fluid 12-column grid
- **Top navigation bar** with global search (Cmd+K command palette), quick actions, notifications, admin profile
- **Desktop-first** with responsive breakpoints at 1280px, 1024px, and 768px

### 7.2 Client Mobile Application Layout Architecture

- **Top App Bar** with HENU OS branding, notification icon, and client monogram avatar
- **Bottom Navigation Bar** with 5 tabs: Home, Portfolio, Services, Finance, Hub
- **Mobile-first** with 4-column portrait layout, scaling to 8-column on tablets
- **8pt base grid** with 16px outer margins

---

## 8. Admin Web Portal Requirements

### 8.1 Admin Dashboard

- **Purpose**: Provide administrators with a real-time operational overview of the entire CLM platform.
- **Actor**: Super Admin, Sales Admin, Finance Admin
- **Preconditions**: Admin is authenticated and has dashboard access permission.
- **Inputs**: None (data is auto-populated).
- **Processing**: System aggregates and displays KPIs, revenue trends, recent transactions, quote funnels, service performance, activity feeds, and pending approvals in real-time.
- **Outputs**:
  - **Welcome Header**: Personalized greeting with admin name, CLM version badge, real-time sync status indicator.
  - **Quick Action Pills**: Buttons to create New Customer, New Quote, New Sales Order, New Invoice, New Service, New Offer, New Product.
  - **KPI Metric Tiles** (8 cards in 4-column grid):
    1. Total Sales (currency value, percentage change vs. prior period, sparkline)
    2. Outstanding Invoices (currency value, count of overdue, sparkline)
    3. Payments Received (currency value, gateway settlement percentage, sparkline)
    4. Quote Conversion Rate (percentage, pending quotes count, sparkline)
    5. Active Clients (count, weekly change, retention percentage)
    6. Active Services (count, category label)
    7. Products Sold (count, type label: Digital and Source)
    8. Orders in Pipeline (count, pipeline value)
  - **Revenue and Sales Performance Chart**: Line chart with current vs. target comparison, time range selector (7D/30D/90D/1Y), Y-axis revenue scale, X-axis date labels.
  - **Recent Transactions and Invoices Table**: Sortable table with Invoice number, Client, Date, Amount, Gateway, Status, Action. Pagination (Previous/Next). Filter and Export buttons.
  - **Quote Funnel Performance**: Progress bars showing Draft to Review, Sent to Client Approval, Order and Payment Confirmation conversion rates.
  - **Top Service Lines**: Progress bars showing revenue breakdown by service category.
  - **Live CLM Activity Feed**: Real-time timeline of events (payments received, quotes accepted, orders confirmed, new clients onboarded, support tickets opened) with timestamps and auto-reconciliation status.
  - **Pending Approvals Widget**: Cards for items requiring admin action (vendor payouts, discount requests, tax certificate verifications) with Approve/Decline/Inspect/Verify action buttons.
  - **System Health Bar**: Operational status of database and payment gateway APIs with uptime percentage.
- **Permissions**: Dashboard content filtered by role. Finance Admin sees financial KPIs prominently. Sales Admin sees pipeline metrics prominently.
- **States**: Loading, Populated, Error (API failure), Empty (no data for time range).
- **Errors**: Display inline error banners if data aggregation fails for specific widgets.
- **Notifications**: None (dashboard is pull-based).
- **Dependencies**: All data modules (Sales, Payments, Customers, Services, Products, Analytics).
- **Acceptance Criteria**:
  - All 8 KPI tiles display accurate, real-time data.
  - Revenue chart renders with current and target lines.
  - Transactions table supports pagination and displays correct status badges.
  - Activity feed updates in real-time via WebSocket.
  - Pending approvals show actionable buttons that trigger approval workflows.
  - System health shows live gateway status.

### 8.2 Admin Navigation Structure

The sidebar navigation contains:
- **Dashboard** (active state: left border accent in Royal Iris)
- **Sales** (sub-items: Customers, Quotes, Sales Orders, Invoices, Recurring Invoices, Payments, Credit Notes, Statements)
- **Catalogue** (sub-items: Services, Service Categories, Service Add-ons)
- **Portfolio**
- **Products** (sub-items: Digital Products, Source Code, Software Products)
- **Offers** (sub-items: Promotions)
- **Communication** (sub-items: Support Chat, Announcements)
- **Analytics**
- **App CMS** (sub-items: Company Info, FAQs, Legal Pages, Social Links)
- **Settings** (sub-items: General, Users, Roles and Permissions, Payment Gateways, Notifications, Company Information)

Footer section:
- **Settings** link
- **Collapse** toggle (sidebar to icon rail)

### 8.3 Admin Top Navigation Bar

- **Global Search**: Full-width search input with placeholder "Search clients, quotes, invoices... [Cmd+K]". Keyboard shortcut badge. Searches across all entities.
- **Navigation Links**: All Clients, Invoices, Pipeline, Reports.
- **Quick Actions Button**: Opens command palette for rapid entity creation.
- **New Transaction Button**: Primary CTA for creating a new financial transaction.
- **Notification Bell**: With unread count badge (red dot).
- **Help Icon**: Opens contextual help/documentation.
- **Admin Profile**: Avatar with initials, full name, and role label.

### 8.4 Command Palette (Cmd+K)

- **Purpose**: Provide keyboard-driven rapid navigation and entity creation.
- **Actor**: Any authenticated admin user.
- **Preconditions**: Admin is on any page of the portal.
- **Inputs**: Keyboard shortcut Cmd+K (Mac) or Ctrl+K (Windows). Text query.
- **Processing**: Fuzzy search across client records, quotes, invoices, sales orders, services, products, and navigation destinations.
- **Outputs**: Centered 560px modal with search input, categorized results (Quick Actions, Client Records, Jump Links), keyboard navigation (up/down/enter).
- **Permissions**: Results filtered by user role permissions.
- **States**: Empty (no query), Results, No Results.
- **Acceptance Criteria**:
  - Opens on Cmd+K / Ctrl+K.
  - Displays results within 200ms of keystroke.
  - Supports full keyboard navigation without mouse.
  - Closes on Escape or clicking outside.

---

## 9. Client Mobile Application Requirements

### 9.1 Bottom Navigation Bar

The client application uses a persistent bottom navigation bar with 5 tabs:

| Tab | Icon | Destination | Description |
|---|---|---|---|
| **Home** | dashboard | Client Dashboard | Default landing screen after authentication |
| **Portfolio** | folder_managed | Portfolio Browser | Browse HENU OS project portfolio |
| **Services** | inventory_2 | Services and Quote Builder | Browse services, configure quotes |
| **Finance** | receipt_long | Financial Hub | Invoices, payments, statements, sales orders |
| **Hub** | widgets | Hub / More | Profile, settings, support, products, offers, company info, legal, in-app browser |

**Active tab styling**: Background pill in primary-fixed color, filled icon variant, semibold label.
**Inactive tab styling**: on-surface-variant text, outline icon, normal weight label.

### 9.2 Top App Bar

- **Leading**: HENU OS brand monogram avatar (circular, primary-colored, initial letters) + "HENU OS" title + "Client Lifecycle Management" subtitle.
- **Trailing**: Notification bell icon with unread badge.
- **Behavior**: Sticky at top, blur backdrop on scroll, hairline bottom border.

### 9.3 Client Dashboard (Home Tab)

- **Purpose**: Provide the client with a personalized overview of their engagement with HENU OS.
- **Actor**: Authenticated Client.
- **Preconditions**: Client is signed in.
- **Inputs**: None.
- **Processing**: System retrieves client active engagements, financial snapshot, recent activity, and priority milestones.
- **Outputs**:
  - **Greeting and Identity Strip**: "Good morning, {FirstName}" + tagline "Simple systems. Real progress." + Client ID pill (HENU-CL-YYYY-NNNNNN) with copy-to-clipboard button.
  - **Editorial Hero Card**: Priority milestone card with milestone title, description, "Review Deliverables" CTA, and Q-period label.
  - **Active Work / Project Progress**: Current milestone progress bar (percentage), milestone X of Y counter, next milestone date, "Specs" link.
  - **Operational Portals Grid** (4x2 grid, 8 actions): Quotes, Invoices, Payments, Services, Portfolio, Support, Software (Buy), Request (Quote).
  - **Financial Snapshot**: Two metric cards (Total Invoiced with fiscal year label; Pending Balance with action required count) + Recent Invoice card with invoice number, status badge, amount, description, due date, "View PDF" link, and "Pay Now" button.
  - **Audit and Activity Log**: Timeline of recent events (quote accepted, payment received, milestone updates) with timestamps and event details. "Full Log" link.
- **Permissions**: Client sees only their own data.
- **States**: Loading, Populated, Empty (new client with no activity).
- **Errors**: Network error banner, retry option.
- **Notifications**: None (pull-based).
- **Dependencies**: Authentication, Customer, Sales, Services, Payments APIs.
- **Acceptance Criteria**:
  - Displays personalized greeting with correct client name.
  - Client ID is copyable to clipboard with visual feedback.
  - Financial snapshot shows accurate totals.
  - Activity log displays chronologically ordered events.
  - All operational portal buttons navigate to correct screens.

---

## 10. Authentication Requirements

### 10.1 Splash Experience (3D Dragon)

- **Purpose**: Provide a premium, cinematic first impression when the client mobile application launches.
- **Actor**: Any user launching the app.
- **Preconditions**: App is installed and launched.
- **Inputs**: None.
- **Processing**: Render a 3D cinematic dragon creature with atmospheric lighting, ambient depth effects, and a progress bar simulating system initialization.
- **Outputs**:
  - Dark canvas (#11131A) with ambient teal and iris gradient glow effects.
  - Dot-grid architectural reticle overlay.
  - System micro-header: "CLIENT LIFECYCLE OS" with live indicator + "PROD_RUNTIME" terminal badge.
  - 3D dragon visual asset with drift animation (8-second ease-in-out cycle), pulse glow aura rings.
  - Precision coordinate overlays ("LAT_SYM // 04.9928", "ORBIT // 48.20 degrees AZ", "RENDER: BIOMETRIC_MESH").
  - HENU OS geometric monogram emblem (H+E interlocked SVG) with underglow.
  - Brand title "HENU OS" + tagline "Simple systems. Real progress."
  - Progress bar with gradient fill (teal to iris to gold), animated from 4% to 92%, percentage counter.
  - Status labels: "CALIBRATING KERNEL", "Atmospheric 3D, 60fps, Reduced motion supported".
  - Security footer: "Initializing secure client runtime v2.4".
- **Permissions**: None required (pre-authentication).
- **States**: Loading (progress animation), Complete (transitions to authentication).
- **Errors**: If 3D rendering fails, display static fallback (2D brand screen).
- **Accessibility**: Reduced motion support — suppress camera drifts, spatial shifts, and particle flows when the user has enabled reduced motion in OS settings or app settings. Static fallback mode available in settings.
- **Performance**: Target 60fps rendering. GPU-accelerated. Battery-conscious fallback mode.
- **Acceptance Criteria**:
  - Dragon renders at 60fps on target devices.
  - Progress bar animates from 4% to 92% over approximately 4.2 seconds.
  - Reduced motion preference is respected.
  - Transitions smoothly to authentication screen on completion.

### 10.2 Sign In

- **Purpose**: Authenticate existing clients and admin users.
- **Actor**: Any registered user (client or admin).
- **Preconditions**: User has a registered account.
- **Inputs**:
  - Email address (required, validated format)
  - Password (required, masked by default with toggle visibility)
- **Processing**:
  1. Client-side validation (email format, password non-empty).
  2. Submit credentials to authentication API.
  3. On success: generate session token, redirect to dashboard.
  4. On failure: display inline error banner with specific message.
- **Outputs**:
  - Brand header: HENU OS pill badge + "CLM Enterprise" label + "256-bit Encrypted Session" security badge.
  - "Advisor Portal" context badge + "Welcome back" headline + subtext about advisory folios.
  - Email input field with "Work profile" label, verified_user icon on valid email.
  - Password field with visibility toggle, password strength meter (3-segment bar), "Standard Security" / "Strong" label.
  - "Forgot Password?" link.
  - "Sign In" primary button (full-width, pill-shaped, Royal Iris background).
  - "Create an Account" secondary button (outline style).
  - Enterprise provisioning link: "Need enterprise provisioning? Contact Concierge".
  - Trust indicators below card: "SOC2 Type II Attested" + "Hardware Key Ready" + "99.99% Node SLA".
  - Legal footer: Links to Terms of Service and Privacy Folio.
- **Error Handling**:
  - **Dismissible error banner**: "Incorrect email or password. Please verify your credentials or use the recovery flow." with close button.
  - **Field-level validation**: Red border on invalid fields.
  - **Rate limiting**: After 5 failed attempts, display lockout message with cooldown timer.
- **Notifications**: None.
- **Dependencies**: Authentication API, Session Management.
- **Acceptance Criteria**:
  - Valid credentials redirect to dashboard within 2 seconds.
  - Invalid credentials display dismissible error banner.
  - Password visibility toggle works correctly.
  - "Forgot Password?" navigates to reset flow.
  - "Create an Account" navigates to registration flow.

### 10.3 Registration and Client ID Generation

- **Purpose**: Allow new clients to create an account and receive a unique HENU OS Client ID.
- **Actor**: New client (unauthenticated).
- **Preconditions**: User does not have an existing account.
- **Inputs**:
  - Full legal / entity representative name (required)
  - Mobile number with country code (required, 2FA verified)
  - Enterprise email address (required, validated format)
  - Authentication passphrase / password (required, minimum 12 characters)
- **Processing**:
  1. Client-side validation (all fields, password strength).
  2. Submit registration data to API.
  3. Generate unique Client ID in format HENU-CL-YYYY-NNNNNN (e.g., HENU-CL-2026-000001).
  4. Display generated Client ID on success screen.
- **Outputs**:
  - **Left panel (Stage 01 - Master Record)**: Registration form with labeled input fields, leading Material icons, password strength meter (4-segment bar with pass/fail criteria for: length >= 12 chars, uppercase and lowercase, at least 1 number, special character), "Identity Ready" status.
  - **Right panel (Client ID Card)**:
    - "Provisioning Active" badge with animated ping indicator.
    - "HENU OS Client Identity Provisioned" heading.
    - Monospace Client ID display (HENU-CL-2026-000001) in a bordered container.
    - One-tap copy button with "Copied to clipboard" feedback pill.
    - Legal notice: "This system-generated identifier links all your invoices, quotes, and NDA-backed architectural deliverables. It cannot be manually altered."
    - Ledger Authority and Provision Date metadata tiles.
    - "Proceed to Executive Dashboard" primary CTA.
    - "Already registered? Sign in with your HENU OS ID" link.
  - Footer: "Encrypted Session: TLS 1.3" + "ISO/IEC 27001 Certified".
- **Password Strength Criteria**:
  - Length >= 12 characters
  - Contains uppercase and lowercase letters
  - Contains at least 1 number
  - Contains at least 1 special character
  - Visual: 4-segment progress bar, green segments for passed criteria
  - Label: "Strong (85%)" with shield icon when 3 of 4 criteria met
- **Permissions**: None required (public registration).
- **States**: Form (empty), Validating, Submitting, Success (Client ID generated), Error.
- **Errors**: Duplicate email error, invalid phone format, password too weak, network failure.
- **Notifications**: Send welcome email with Client ID after successful registration.
- **Dependencies**: Authentication API, Client ID generation service.
- **Acceptance Criteria**:
  - All 4 input fields validate correctly.
  - Password strength meter updates in real-time.
  - Client ID is generated in correct format on successful registration.
  - Copy button copies Client ID to clipboard with visual feedback.
  - "Proceed to Executive Dashboard" navigates to authenticated dashboard.

### 10.4 Forgot Password

- **Purpose**: Allow users to initiate a password reset flow.
- **Actor**: Any registered user.
- **Preconditions**: User has a registered email.
- **Inputs**: Email address.
- **Processing**: Validate email exists, send password reset link/OTP to email.
- **Outputs**: Confirmation message that reset instructions have been sent.
- **States**: Input, Sending, Sent, Error (email not found).
- **Errors**: "No account found with this email address."
- **Notifications**: Password reset email with secure link (time-limited, single-use).
- **Acceptance Criteria**:
  - Valid email results in reset email sent within 30 seconds.
  - Invalid email shows appropriate error message.
  - Reset link expires after 60 minutes.

### 10.5 Reset Password

- **Purpose**: Allow users to set a new password via the reset link.
- **Actor**: User with valid reset token.
- **Preconditions**: User has a valid, non-expired reset token.
- **Inputs**: New password (validated against strength criteria), Confirm password.
- **Processing**: Validate token, validate password strength, update password, invalidate token.
- **Outputs**: Success confirmation, redirect to sign-in.
- **States**: Input, Validating, Success, Error (expired/invalid token).
- **Acceptance Criteria**:
  - Password strength criteria enforced.
  - Token validated server-side.
  - Successful reset redirects to sign-in.

---

## 11. Client Account Requirements

### 11.1 Client ID System

- **Format**: HENU-CL-YYYY-NNNNNN (e.g., HENU-CL-2026-000001)
- **Generation**: Auto-generated at registration, sequential within year.
- **Immutability**: Client IDs cannot be manually altered after generation.
- **Visibility**: Displayed on client dashboard, profile, finance screens, and registration success. Copyable via one-tap button.
- **Purpose**: Links all invoices, quotes, NDA-backed deliverables, and architectural agreements.
- **Admin Visibility**: Displayed on admin customer records and all associated transactions.

### 11.2 Client Tiers

Based on the Stitch UI, clients are classified by tier:
- **Enterprise Tier**: High-value clients with dedicated lead architect assignments.
- Additional tier definitions to be determined by business requirements.

### 11.3 Client Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| client_id | String | Auto | System-generated HENU-CL-YYYY-NNNNNN |
| full_name | String | Yes | Full legal / entity representative name |
| email | String | Yes | Enterprise email address (verified) |
| mobile | String | Yes | Mobile number with country code (2FA verified) |
| organization | String | No | Company / entity name |
| title | String | No | Job title / role |
| tier | Enum | Auto | Enterprise, Standard, etc. |
| status | Enum | Auto | Active, Suspended, Archived |
| created_at | DateTime | Auto | Registration timestamp |
| preferred_channel | Enum | No | In-App Chat, WhatsApp, Email |
| assigned_architect | Reference | No | Lead architect / account manager |
| linked_gateways | Array | No | Payment gateways linked to client |
| total_settled_value | Decimal | Auto | Cumulative payment total |
| active_engagements | Integer | Auto | Count of active contracts |
| avatar_initials | String | Auto | Derived from full_name |

---

## 12. Customer Management Requirements

### 12.1 Admin: Create Customer

- **Purpose**: Register a new client in the system from the admin side.
- **Actor**: Super Admin, Sales Admin.
- **Preconditions**: Admin is authenticated with customer creation permission.
- **Inputs**: Full name, email, mobile, organization, title, tier assignment.
- **Processing**: Validate inputs, generate Client ID, create customer record, optionally send invitation email.
- **Outputs**: New customer record with generated Client ID.
- **Permissions**: customer:create.
- **States**: Form, Validating, Saving, Success, Error.
- **Errors**: Duplicate email, invalid phone format, required field missing.
- **Notifications**: Optional welcome email to client.
- **Acceptance Criteria**:
  - Customer record created with valid Client ID.
  - Duplicate email prevention works.

### 12.2 Admin: View Customer List

- **Purpose**: Display all customers in a searchable, filterable, paginated list.
- **Actor**: Any admin with customer read permission.
- **Preconditions**: At least one customer exists.
- **Inputs**: Search query, filter criteria (status, tier, date range), sort column, page number.
- **Processing**: Query customer database with filters, sort, and pagination.
- **Outputs**: Table with columns: Client ID, Name, Organization, Email, Tier, Status, Created Date, Total Value, Actions. Pagination controls.
- **Permissions**: customer:read.
- **States**: Loading, Populated, Empty, Error.
- **Acceptance Criteria**:
  - Search returns results within 500ms.
  - Filters correctly narrow results.
  - Pagination works with correct page size.

### 12.3 Admin: View Customer Detail

- **Purpose**: Display complete customer profile with all associated records.
- **Actor**: Any admin with customer read permission.
- **Inputs**: Customer ID.
- **Processing**: Retrieve customer record and all associated quotes, invoices, payments, support tickets, and activity history.
- **Outputs**: Profile card, contact info, financial summary, engagement history, associated documents, linked gateways.
- **Permissions**: customer:read.
- **Acceptance Criteria**:
  - All associated records display correctly.
  - Financial totals are accurate.

### 12.4 Admin: Update Customer

- **Purpose**: Edit customer details.
- **Actor**: Super Admin, Sales Admin.
- **Inputs**: Updated fields (name, email, mobile, organization, title, tier, status).
- **Processing**: Validate changes, update record, log audit trail.
- **Outputs**: Updated customer record.
- **Permissions**: customer:update.
- **Errors**: Validation failures, concurrent edit conflicts.
- **Acceptance Criteria**:
  - Changes are saved and reflected immediately.
  - Audit trail records who made the change and when.

### 12.5 Admin: Archive Customer

- **Purpose**: Soft-delete a customer (retain data, mark as archived).
- **Actor**: Super Admin.
- **Inputs**: Customer ID, confirmation.
- **Processing**: Set customer status to Archived. Retain all associated records. Prevent new transactions.
- **Outputs**: Customer marked as Archived.
- **Permissions**: customer:delete.
- **Acceptance Criteria**:
  - Archived customers do not appear in active lists.
  - All historical data is preserved.
  - Client can no longer sign in.

---

## 13. Services Requirements

### 13.1 Service Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| service_id | UUID | Auto | Unique service identifier |
| name | String | Yes | Service name (e.g., "AI Workflow Automation Engine") |
| description | Text | Yes | Detailed service description |
| category_id | Reference | Yes | Link to Service Category |
| starting_price | Decimal | Yes | Base price |
| price_type | Enum | Yes | Fixed, Starting From, Custom Quote |
| delivery_horizon | String | No | Estimated delivery time (e.g., "3-4 Weeks") |
| features | Array | No | List of feature descriptions |
| is_flagship | Boolean | No | Marks as featured / most requested |
| status | Enum | Yes | Active, Draft, Archived |
| icon | String | No | Material icon identifier |
| sort_order | Integer | No | Display order |

### 13.2 Admin: Create Service

- **Purpose**: Add a new service to the service catalogue.
- **Actor**: Super Admin.
- **Preconditions**: At least one service category exists.
- **Inputs**: Name, description, category, starting price, price type, delivery horizon, features list, flagship flag, icon, status.
- **Processing**: Validate inputs, save service record.
- **Outputs**: New service visible in admin catalogue and client-facing services screen.
- **Permissions**: service:create.
- **Acceptance Criteria**:
  - Service appears in catalogue.
  - Client app reflects new service after publish.

### 13.3 Admin: Update Service

- **Purpose**: Edit an existing service details.
- **Actor**: Super Admin.
- **Inputs**: Updated fields.
- **Processing**: Validate, update, log audit.
- **Outputs**: Updated service record.
- **Permissions**: service:update.

### 13.4 Admin: Delete Service

- **Purpose**: Remove a service from the catalogue (soft delete).
- **Actor**: Super Admin.
- **Inputs**: Service ID, confirmation.
- **Processing**: Set status to Archived. Existing quotes/invoices referencing this service are unaffected.
- **Permissions**: service:delete.

### 13.5 Admin: List Services

- **Purpose**: View all services with filtering and search.
- **Actor**: Any admin with service read permission.
- **Outputs**: Table/grid of services with name, category, price, status, actions.
- **Permissions**: service:read.

### 13.6 Client: Browse Services

- **Purpose**: Allow clients to browse the service catalogue, view service details, and initiate quote requests.
- **Actor**: Authenticated Client.
- **Preconditions**: Client is signed in.
- **Outputs** (from Stitch UI):
  - Page header: "Services and Custom Quotations" with folio badge.
  - Search bar: Full-width with "Search systems, capabilities, or SLAs..." placeholder.
  - Filter chips: All (active, primary fill), AI Automation, Custom Software, Web Development, Mobile Apps.
  - Flagship service card: Featured service with icon, name, description, Starting Capital price, Delivery Horizon, feature verification badges, "Configure and Request Quote" CTA.
  - Interactive Quote Builder (see section 18.7).
  - Secondary service list: Additional service cards with category badge, name, price, description, capabilities, "Review Specs" link.
  - Advisory consultation banner: "Schedule technical discovery with a lead architect" with "Book Call" link.
- **Permissions**: All active services visible to all authenticated clients.
- **States**: Loading, Populated, Empty (no services available), Search/Filter results.
- **Acceptance Criteria**:
  - All active services display with correct details.
  - Filter chips correctly narrow results.
  - Search returns relevant results.
  - "Configure and Request Quote" opens the quote builder.

### 13.7 Service Categories

- **Purpose**: Organize services into logical groups.
- **Data Model**: category_id, name, description, icon, sort_order, status.
- **Admin Operations**: CRUD on categories.
- **Client Visibility**: Category names displayed as filter chips and service labels.

---

## 14. Add-on Requirements

### 14.1 Add-on Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| addon_id | UUID | Auto | Unique add-on identifier |
| name | String | Yes | Add-on name (e.g., "SEO and Structured Data") |
| description | Text | Yes | Brief description |
| price | Decimal | Yes | Additional cost |
| price_type | Enum | Yes | One-time, Monthly Recurring |
| applicable_services | Array | No | Services this add-on can be combined with |
| status | Enum | Yes | Active, Draft, Archived |

### 14.2 Admin: CRUD Add-ons

- **Actor**: Super Admin.
- **Operations**: Create, read, update, archive add-ons.
- **Permissions**: addon:create, addon:read, addon:update, addon:delete.

### 14.3 Client: View and Select Add-ons

- **Purpose**: During quote building, clients can select add-ons to include in their quotation.
- **Actor**: Authenticated Client.
- **Outputs** (from Stitch UI):
  - Checklist of add-ons with checkbox, name, description, and price badge.
  - Price badges use semantic colors (tertiary for one-time, secondary for recurring).
  - Examples from Stitch UI:
    - SEO and Structured Data (+$800, one-time)
    - Analytics and Telemetry (+$650, one-time)
    - WhatsApp Business Integration (+$400, one-time)
    - Dedicated SLA Maintenance (+$1,200/mo, recurring)
- **Acceptance Criteria**:
  - Add-ons display with accurate prices.
  - Checking/unchecking updates the estimated total.
  - Recurring vs. one-time pricing is clearly distinguished.

---

## 15. Portfolio Requirements

### 15.1 Admin: Manage Portfolio

- **Purpose**: Showcase completed and ongoing projects to clients.
- **Actor**: Super Admin, Content Admin.
- **Operations**: Create portfolio entries with title, description, images/media, client attribution (optional), category, featured flag.
- **Permissions**: portfolio:create, portfolio:read, portfolio:update, portfolio:delete.

### 15.2 Client: Browse Portfolio

- **Purpose**: Allow clients to view HENU OS portfolio of work.
- **Actor**: Authenticated Client.
- **Navigation**: Portfolio tab in bottom navigation bar.
- **Outputs**: Grid/list of portfolio items with images, titles, categories.
- **Acceptance Criteria**:
  - Portfolio items display with images and descriptions.
  - Items are filterable by category.

---

## 16. Product Catalogue Requirements

### 16.1 Product Types

| Type | Description |
|---|---|
| **Digital Products** | Downloadable digital assets (design systems, templates, documentation) |
| **Source Code** | Purchasable codebases, libraries, micro-modules |
| **Software Products** | Licensed software applications |

### 16.2 Product Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| product_id | UUID | Auto | Unique product identifier |
| name | String | Yes | Product name |
| description | Text | Yes | Detailed description |
| type | Enum | Yes | Digital, Source Code, Software |
| price | Decimal | Yes | Purchase price |
| license_type | Enum | No | Single-use, Unlimited, Per-seat |
| download_url | String | No | Secure download link (generated on purchase) |
| preview_images | Array | No | Product preview images |
| status | Enum | Yes | Active, Draft, Archived |

### 16.3 Admin: CRUD Products

- **Actor**: Super Admin.
- **Permissions**: product:create, product:read, product:update, product:delete.

### 16.4 Client: Browse and Purchase Products

- **Purpose**: Allow clients to browse and purchase digital products, source code, and software.
- **Actor**: Authenticated Client.
- **Navigation**: Software quick action on home dashboard; Hub tab.
- **Processing**: Client selects product, proceeds to payment (via integrated payment gateway), on successful payment, receives download access or license key.
- **Acceptance Criteria**:
  - Products display with prices and descriptions.
  - Purchase flow integrates with payment gateways.
  - Download/access is granted immediately after successful payment.

---

## 17. Offers and Promotions

### 17.1 Offer Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| offer_id | UUID | Auto | Unique offer identifier |
| title | String | Yes | Offer title |
| description | Text | Yes | Offer details |
| discount_type | Enum | Yes | Percentage, Fixed Amount, Bundle |
| discount_value | Decimal | Yes | Discount amount or percentage |
| applicable_to | Enum | Yes | Services, Products, All |
| start_date | DateTime | Yes | Offer start date |
| end_date | DateTime | Yes | Offer expiry date |
| status | Enum | Yes | Active, Scheduled, Expired, Draft |
| promotional_image | String | No | Banner image |

### 17.2 Admin: CRUD Offers

- **Actor**: Super Admin, Content Admin.
- **Permissions**: offer:create, offer:read, offer:update, offer:delete.

### 17.3 Client: View Offers

- **Purpose**: Display active offers and promotions to clients.
- **Actor**: Authenticated Client.
- **Navigation**: Hub tab, Offers section.
- **Acceptance Criteria**:
  - Only active, non-expired offers are displayed.
  - Offer terms and conditions are clearly visible.

---

## 18. Quote Management

### 18.1 Quote Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| quote_id | String | Auto | Format: QUO-NNNN (e.g., QUO-0419) |
| client_id | Reference | Yes | Associated client |
| services | Array | Yes | Selected services with pricing |
| addons | Array | No | Selected add-ons with pricing |
| subtotal | Decimal | Auto | Sum of services + add-ons |
| discount | Decimal | No | Applied discount |
| tax | Decimal | Auto | Calculated tax |
| total | Decimal | Auto | Final total |
| recurring_charges | Decimal | Auto | Monthly recurring add-on total |
| status | Enum | Auto | Draft, Under Review, Sent, Accepted, Declined, Expired |
| valid_until | DateTime | Yes | Expiry date |
| notes | Text | No | Admin notes |
| created_by | Reference | Auto | Admin who created the quote |
| created_at | DateTime | Auto | Creation timestamp |

### 18.2 Quote Statuses

| Status | Description | Transition From | Transition To |
|---|---|---|---|
| Draft | Initial creation state | (none) | Under Review |
| Under Review | Internal admin review | Draft | Sent, Draft |
| Sent | Sent to client | Under Review | Accepted, Declined, Expired |
| Accepted | Client accepted | Sent | (generates Sales Order) |
| Declined | Client declined | Sent | Draft (for revision) |
| Expired | Past valid_until date | Sent | Draft (for revision) |

### 18.3 Admin: Create Quote

- **Purpose**: Create a new quotation for a client.
- **Actor**: Super Admin, Sales Admin.
- **Inputs**: Client selection, service selection (with pricing), add-on selection, discount (requires approval if greater than threshold), validity period, notes.
- **Processing**: Calculate totals, apply discounts (with approval workflow for large discounts), save as Draft.
- **Outputs**: Quote record in Draft status.
- **Permissions**: quote:create.
- **Discount Approval**: Discounts exceeding a configured threshold (e.g., 15%) require Super Admin authorization. Pending approval items appear in the Pending Approvals widget.

### 18.4 Admin: Send Quote to Client

- **Purpose**: Transmit a finalized quote to the client.
- **Actor**: Super Admin, Sales Admin.
- **Preconditions**: Quote is in "Under Review" status and fully validated.
- **Processing**: Update status to Sent, notify client via push notification and in-app notification.
- **Notifications**: Push notification to client: "New quote #(quote_id) is ready for review."

### 18.5 Client: View Quotes

- **Purpose**: Allow clients to view received quotes.
- **Actor**: Authenticated Client.
- **Navigation**: Quotes quick action on home dashboard.
- **Outputs**: List of quotes with ID, status, total, valid until date. Detail view with full breakdown.

### 18.6 Client: Accept or Decline Quote

- **Purpose**: Allow clients to respond to a received quote.
- **Actor**: Authenticated Client.
- **Processing**: On acceptance, system generates a Sales Order automatically. On decline, admin is notified.
- **Notifications**: Admin notified of acceptance/decline.

### 18.7 Client: Interactive Quote Builder

- **Purpose**: Allow clients to configure a custom service quotation directly from the services screen.
- **Actor**: Authenticated Client.
- **Outputs** (from Stitch UI):
  - "Interactive Quote Builder" card with "Active Draft" badge.
  - **Step 01 - Base Architecture**: Selected base service with icon, name, description, and price. "Change" link to switch service.
  - **Step 02 - System Add-ons and Modules**: Checkbox list of configurable add-ons with names, descriptions, and price badges. "Select specifications" label.
  - **Estimated Allocation Box**: Total one-time cost + recurring charges. Info notice: "Your final quotation will be reviewed by HENU OS engineers before confirmation."
  - **Action Buttons**: "Submit Quotation Request" (primary) + "Save Draft" (secondary).
- **Processing**: On submit, create a Quote in Draft status linked to the client. Notify admin of new quote request.
- **Acceptance Criteria**:
  - Base service selection works.
  - Add-on toggles correctly update the estimated total.
  - Submit creates a server-side quote.
  - Save Draft persists locally and/or server-side.

---

## 19. Sales Order Management

### 19.1 Sales Order Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| order_id | String | Auto | Format: SO-YYYY-NNNN |
| quote_id | Reference | Yes | Source quote |
| client_id | Reference | Yes | Associated client |
| line_items | Array | Yes | Services and add-ons with pricing |
| total | Decimal | Auto | Order total |
| status | Enum | Auto | Confirmed, In Progress, Fulfilled, Cancelled |
| created_at | DateTime | Auto | Creation timestamp |

### 19.2 Sales Order Statuses

| Status | Description |
|---|---|
| Confirmed | Order created from accepted quote |
| In Progress | Work has begun |
| Fulfilled | Delivery completed |
| Cancelled | Order cancelled |

### 19.3 Admin: CRUD Sales Orders

- **Actor**: Super Admin, Sales Admin.
- **Permissions**: salesorder:create, salesorder:read, salesorder:update, salesorder:delete.
- **Auto-Generation**: Sales Order is automatically created when a client accepts a Quote.

### 19.4 Client: View Sales Orders

- **Purpose**: Allow clients to view their sales orders and fulfillment status.
- **Actor**: Authenticated Client.
- **Navigation**: Finance tab, Sales Orders filter.

---

## 20. Invoice Management

### 20.1 Invoice Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| invoice_id | String | Auto | Format: INV-YYYY-NNN (e.g., INV-2025-084) |
| client_id | Reference | Yes | Associated client |
| order_id | Reference | No | Associated sales order |
| line_items | Array | Yes | Itemized services/products with pricing |
| subtotal | Decimal | Auto | Pre-tax total |
| tax | Decimal | Auto | Tax amount (e.g., GST, TDS) |
| total | Decimal | Auto | Final amount payable |
| amount_paid | Decimal | Auto | Amount received |
| balance_due | Decimal | Auto | Remaining balance |
| status | Enum | Auto | Draft, Sent, Pending, Paid, Overdue, Partially Paid, Cancelled, Void |
| payment_terms | Enum | Yes | Net 15, Net 30, Net 60, Due on Receipt |
| due_date | DateTime | Yes | Payment due date |
| gateway | String | No | Payment gateway used |
| issued_date | DateTime | Auto | Issue date |
| paid_date | DateTime | No | Settlement date |
| pdf_url | String | Auto | Generated PDF download link |
| notes | Text | No | Admin notes |

### 20.2 Invoice Statuses

| Status | Color (from Stitch UI) | Description |
|---|---|---|
| Draft | (none) | Internal, not sent to client |
| Sent | Tertiary (Saffron Gold) | Dispatched to client |
| Pending | Tertiary (Saffron Gold) | Awaiting payment |
| Paid | Secondary (Deep Teal) | Fully settled |
| Overdue | Error (Terracotta Rose) | Past due date, unpaid |
| Partially Paid | (none) | Partial payment received |
| Cancelled | (none) | Cancelled by admin |
| Void | (none) | Voided (accounting correction) |

### 20.3 Admin: Create Invoice

- **Purpose**: Generate an invoice for a client.
- **Actor**: Super Admin, Sales Admin, Finance Admin.
- **Inputs**: Client, line items, payment terms, due date, notes.
- **Processing**: Calculate subtotal, tax, total. Generate PDF. Save as Draft.
- **Permissions**: invoice:create.

### 20.4 Admin: Send Invoice

- **Processing**: Update status to Sent. Notify client via push notification.
- **Notifications**: Client receives "New invoice #(invoice_id) for (amount) is ready."

### 20.5 Admin: View Invoice List

- **Outputs** (from Stitch UI): Table with Invoice number, Client (name + contract description), Date, Amount, Gateway (with status dot), Status (badge), Action menu.

### 20.6 Client: View Invoices

- **Purpose**: Allow clients to view their invoices, download PDFs, and initiate payments.
- **Actor**: Authenticated Client.
- **Navigation**: Finance tab, Invoices filter (active by default).
- **Outputs** (from Stitch UI):
  - **Financial Summary**: Fiscal summary card with Total Settled, Pending Clearance, Opening Balance, Closing Projected.
  - **Invoice Records List**: Cards with invoice number, status badge (Pending/Paid/Archived), due date, amount, action buttons (Pay Now, Download PDF, View Receipt, Share).
  - **Statement Timeline**: Ledger breakdown with Invoices Billed, Payments Credited, TDS Withheld, Net Due Balance. "Export CSV" link.
- **Acceptance Criteria**:
  - Financial summary shows accurate totals.
  - Invoice cards display correct statuses.
  - "Pay Now" initiates payment flow.
  - "Download PDF" generates and downloads invoice PDF.

---

## 21. Recurring Invoice Management

### 21.1 Purpose

Manage invoices that recur on a defined schedule (e.g., monthly SLA maintenance charges).

### 21.2 Recurring Invoice Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| recurring_id | UUID | Auto | Unique recurring invoice identifier |
| client_id | Reference | Yes | Associated client |
| template_line_items | Array | Yes | Itemized services with pricing |
| frequency | Enum | Yes | Monthly, Quarterly, Annually |
| start_date | DateTime | Yes | First invoice date |
| end_date | DateTime | No | Termination date (null = indefinite) |
| next_invoice_date | DateTime | Auto | Next generation date |
| auto_send | Boolean | Yes | Automatically send on generation |
| status | Enum | Yes | Active, Paused, Completed, Cancelled |

### 21.3 Admin: CRUD Recurring Invoices

- **Actor**: Super Admin, Finance Admin.
- **Permissions**: recurring_invoice:create, recurring_invoice:read, recurring_invoice:update, recurring_invoice:delete.
- **Processing**: On next_invoice_date, system automatically generates a new Invoice from the template. If auto_send is true, invoice is immediately sent to client.

### 21.4 Client: View Recurring Invoices

- **Actor**: Authenticated Client (where applicable).
- **Outputs**: List of active recurring schedules with frequency, next date, amount.

---

## 22. Payment Management

### 22.1 Payment Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| payment_id | UUID | Auto | Unique payment identifier |
| invoice_id | Reference | Yes | Associated invoice |
| client_id | Reference | Yes | Associated client |
| amount | Decimal | Yes | Payment amount |
| gateway | Enum | Yes | Razorpay, Cashfree, Stripe, Bank NEFT/Wire |
| gateway_transaction_id | String | Auto | Gateway reference ID |
| status | Enum | Auto | Initiated, Processing, Completed, Failed, Refunded |
| paid_at | DateTime | Auto | Payment timestamp |
| reconciled | Boolean | Auto | Whether auto-reconciled |

### 22.2 Client: Make Payment

- **Purpose**: Allow clients to pay outstanding invoices directly through the app.
- **Actor**: Authenticated Client.
- **Outputs** (from Stitch UI):
  - **Direct Payment Gateway Action Card**:
    - "Immediate Settlement" badge.
    - Invoice reference with description and payable amount.
    - **Gateway Selector**: Radio button selection between gateways (e.g., Razorpay with "Corporate UPI / NEFT" label, Cashfree with "Virtual Escrow Account" label). Selected gateway has primary-colored border with check circle icon.
    - Trust badge: "256-Bit Bank Grade Encryption - Zero Credential Exposure".
    - "Proceed to Secure Payment" primary CTA with lock icon.
- **Processing**:
  1. Client selects gateway.
  2. Client taps "Proceed to Secure Payment".
  3. System initiates payment session with selected gateway.
  4. Gateway SDK/redirect handles payment capture.
  5. On success: update payment status to Completed, update invoice status to Paid, auto-reconcile.
  6. On failure: display error, allow retry.
- **Permissions**: Client can only pay their own invoices.
- **Notifications**: Admin notified of payment received. Activity feed updated.
- **Acceptance Criteria**:
  - Gateway selector allows switching between options.
  - Payment flow completes end-to-end.
  - Invoice status updates to Paid after successful payment.
  - Failed payments show clear error message and retry option.

### 22.3 Admin: View Payments

- **Outputs**: Table of payments with invoice reference, client, amount, gateway, status, date. Filter by gateway, status, date range. Export functionality.

### 22.4 Admin: Record Manual Payment

- **Purpose**: Record payments received outside the platform (e.g., bank transfer, check).
- **Actor**: Finance Admin, Super Admin.
- **Inputs**: Invoice, amount, payment method, reference number, date.
- **Permissions**: payment:create.

---

## 23. Credit Notes

### 23.1 Credit Note Data Model

| Field | Type | Required | Description |
|---|---|---|---|
| credit_note_id | String | Auto | Format: CN-YYYY-NNN |
| client_id | Reference | Yes | Associated client |
| invoice_id | Reference | No | Associated invoice (if applicable) |
| amount | Decimal | Yes | Credit amount |
| reason | Text | Yes | Reason for credit |
| status | Enum | Auto | Draft, Issued, Applied, Void |
| created_at | DateTime | Auto | Creation timestamp |

### 23.2 Admin: CRUD Credit Notes

- **Actor**: Super Admin, Finance Admin.
- **Permissions**: credit_note:create, credit_note:read, credit_note:update, credit_note:delete.
- **Processing**: Credit notes can be applied against outstanding invoices or refunded.

### 23.3 Client: View Credit Notes

- **Actor**: Authenticated Client.
- **Outputs**: List of issued credit notes with amount, reason, status, associated invoice.

---

## 24. Statements

### 24.1 Purpose

Provide clients with a consolidated view of their financial history — all invoices billed, payments credited, credits applied, and outstanding balances.

### 24.2 Admin: Generate Statements

- **Actor**: Super Admin, Finance Admin.
- **Inputs**: Client, date range.
- **Processing**: Aggregate all invoices, payments, credit notes within date range.
- **Outputs**: Statement document with line items, running balance, opening/closing balances.
- **Permissions**: statement:create.

### 24.3 Client: View Statements

- **Purpose**: Allow clients to review their financial statements.
- **Actor**: Authenticated Client.
- **Navigation**: Finance tab, Statements filter.
- **Outputs** (from Stitch UI):
  - Statement Timeline card with ledger line items:
    - Invoices Billed (primary dot)
    - Payments Credited (secondary dot)
    - TDS Withheld (tertiary dot)
    - Net Due Balance (highlighted row)
  - "Export CSV" button.
- **Acceptance Criteria**:
  - Statement totals are mathematically correct.
  - CSV export generates valid file.

---

## 25. Client Communication

### 25.1 In-App Support Chat

- **Purpose**: Provide real-time, encrypted communication between clients and their assigned HENU OS architect/support agent.
- **Actor**: Authenticated Client (client-side), Support Agent / Admin (admin-side).
- **Outputs** (from Stitch UI):
  - **Chat Header**: Assigned architect avatar (initials), name, role badge ("Sr. Architect"), online status with response time average ("Active - Average response < 10 mins"), support ticket ID (#HENU-SUP-NNN), priority label.
  - **Ticket Meta Bar**: Topic/subject, status ("Pending Client Sign-Off").
  - **Conversation Stream**:
    - Timestamp dividers ("Today, 2:42 PM").
    - Admin messages: Left-aligned, avatar initials, surface-container-low background, rounded bubbles.
    - Client messages: Right-aligned, primary-colored background, white text.
    - File attachments: Inline document preview card with file icon, filename, file size, "Cryptographically Verified" label, open-in-new button.
    - Inline payment cards: Quotation reference with amount and "Pay Now" button directly in chat.
    - Read receipts: "Delivered", "Read" with double-check icon.
    - Typing indicator: Animated bouncing dots with "Elena is preparing payment token..." label.
  - **Chat Input Bar**:
    - Attach file button.
    - Voice memo / mic button.
    - Text input with placeholder "Type a message to HENU OS...".
    - Send button (Royal Iris circular button).
    - Footer: "Zero-knowledge CLM transmission" + "Press Enter to send".
- **Permissions**: Client can only chat with their assigned support thread. Admin can view all threads.
- **States**: Loading, Active conversation, Empty (no messages), Offline (agent unavailable).
- **Errors**: Message send failure, retry option. File upload failure, error toast.
- **Notifications**: Push notification on new message received by either party.
- **Dependencies**: Real-time messaging service (WebSocket), file upload/storage.
- **Acceptance Criteria**:
  - Messages delivered in real-time (less than 2 second latency).
  - File attachments upload and display correctly.
  - Inline payment cards function correctly.
  - Read receipts update accurately.
  - Typing indicator shows when other party is typing.

---

## 26. Support

### 26.1 Support Ticket System

- **Purpose**: Track and manage client support requests.
- **Ticket ID Format**: HENU-SUP-NNN (e.g., HENU-SUP-482).
- **Data Model**:
  - ticket_id, client_id, assigned_agent_id, subject, topic, priority (Low/Medium/High), status (Open/In Progress/Pending Client/Resolved/Closed), created_at, updated_at.
- **Admin Operations**: View all tickets, assign agents, update status, close tickets.
- **Client Operations**: View own tickets, send messages, attach files.

---

## 27. Notifications

### 27.1 Notification Types

| Type | Trigger | Recipients |
|---|---|---|
| Invoice Sent | Admin sends invoice | Client |
| Payment Received | Client completes payment | Admin |
| Quote Ready | Admin sends quote | Client |
| Quote Accepted | Client accepts quote | Admin |
| Quote Declined | Client declines quote | Admin |
| New Message | Either party sends chat message | Opposite party |
| Milestone Update | Admin updates project milestone | Client |
| Support Ticket Update | Status change on support ticket | Client |
| Overdue Invoice | Invoice past due date | Client, Admin |
| New Offer | New promotion published | Client |

### 27.2 Notification Channels

- **In-App**: Badge on notification bell icon (unread count). Notification center with list of recent notifications.
- **Push Notification**: Mobile push for client app.
- **Email**: Optional for critical notifications (overdue invoices, payment confirmations).

### 27.3 Client: Notification Preferences (from Stitch UI)

The Settings screen provides toggles for:

| Setting | Default | Description |
|---|---|---|
| Invoices and Payment Reminders | ON | High-priority dispatch for escrow milestones and settlement tranches |
| Architecture Milestone Sprints | ON | Real-time updates when engineers approve technical stage gates |
| Quote Approvals and Revisions | ON | Instant alerts when executive partners publish project estimation revisions |
| Strategic Marketing and Offers | OFF | Seasonal advisory digests and ecosystem expansion packages |

### 27.4 Admin: Send Notifications

- **Purpose**: Admin can send targeted notifications to individual clients or broadcast to all.
- **Actor**: Super Admin, Content Admin.
- **Permissions**: notification:create.

---

## 28. App CMS

### 28.1 Purpose

Allow administrators to manage content displayed within the client mobile application without requiring app updates.

### 28.2 CMS Content Types

| Content Type | Admin Operations | Client Access |
|---|---|---|
| Company Information | CRUD | Read-only (Hub tab) |
| FAQs | CRUD with ordering | Read-only (Hub tab) |
| Legal Pages (Terms of Service, Privacy Policy) | CRUD | Read-only (opens in in-app browser) |
| Social Links | CRUD | Read-only (Hub tab, links open in in-app browser) |

### 28.3 Admin: Manage Company Information

- **Inputs**: Company name, description, logo, address, phone, email, website, operating hours.
- **Permissions**: cms:update.

### 28.4 Admin: Manage FAQs

- **Inputs**: Question, answer (rich text), category, sort order, status (published/draft).
- **Permissions**: cms:create, cms:update, cms:delete.

### 28.5 Admin: Manage Legal Pages

- **Inputs**: Page title, content (rich text / HTML), last updated date, version.
- **Pages**: Terms of Service, Privacy Policy (Privacy Folio), Cookie Policy, NDA Template.
- **Client Access**: Opens in in-app browser with secure SSL indicator.

### 28.6 Admin: Manage Social Links

- **Inputs**: Platform name, URL, icon, status.
- **Client Access**: Links open in in-app browser.

---

## 29. Company Information

Managed via App CMS (section 28.3). Displayed to clients in the Hub tab. Includes:
- Company name, registration details
- Address and contact information
- Operating hours
- Company description / about

---

## 30. Legal Content

Managed via App CMS (section 28.5). Accessible from:
- Sign-in screen footer ("Terms of Service" and "Privacy Folio" links)
- Settings screen ("Privacy Policy and Terms of Service" row with "Opens in HENU In-App Secure Browser" label and external link icon)
- Hub tab

---

## 31. Analytics

### 31.1 Admin Dashboard Analytics

Available on the admin dashboard and dedicated Analytics section:

| Metric | Description |
|---|---|
| Total Sales | Aggregate revenue with period-over-period comparison |
| Outstanding Invoices | Total unpaid amount with overdue count |
| Payments Received | Monthly collections with gateway breakdown |
| Quote Conversion Rate | Percentage of quotes converted to paid orders |
| Active Clients | Count with retention rate |
| Active Services | Services in catalogue |
| Products Sold | Digital and source code product sales count |
| Orders in Pipeline | In-progress sales orders with value |
| Revenue Trend | Line chart with current vs. target comparison |
| Quote Funnel | Conversion rates at each stage |
| Service Revenue Breakdown | Revenue by service line |

### 31.2 Admin: View Analytics

- **Actor**: Super Admin, Finance Admin.
- **Permissions**: analytics:read.
- **Time Ranges**: 7 Days, 30 Days, 90 Days, 1 Year.
- **Export**: CSV/PDF export of analytics data.

---

## 32. Payment Gateway Requirements

### 32.1 Supported Gateways

| Gateway | Use Case | Features |
|---|---|---|
| **Razorpay** | Corporate UPI, NEFT, Cards | Primary Indian gateway. UPI QR support. |
| **Cashfree** | Virtual Escrow Account | Escrow-based settlement. Virtual account numbers. |
| **Stripe** | International cards, ACH | International payment processing. |
| **Bank NEFT/Wire** | Manual bank transfers | Offline payment recording by admin. |

### 32.2 Admin: Configure Payment Gateways

- **Purpose**: Configure API keys, webhook URLs, and settings for each gateway.
- **Actor**: Super Admin.
- **Inputs**: API key, API secret, webhook URL, merchant ID, test/live mode toggle.
- **Permissions**: settings:payment_gateway.
- **Security**: API keys stored encrypted. Never exposed in client-side code.

### 32.3 Gateway Health Monitoring

- Displayed on admin dashboard system health bar.
- Real-time uptime percentage (e.g., "99.98% uptime").
- Status indicators: Operational, Degraded, Down.

### 32.4 Payment Reconciliation

- Automatic reconciliation via webhook callbacks from gateways.
- Admin dashboard activity feed shows "Auto-reconciled" label for automatic settlements.
- Manual reconciliation available for bank transfers.

---

## 33. In-App Browser

### 33.1 Purpose

Provide a secure, integrated web browsing experience within the client mobile application for viewing documents, legal pages, external links, and deliverables without leaving the HENU OS ecosystem.

### 33.2 Features (from Stitch UI)

- **Navigation Controls**: Back, Forward, Reload buttons.
- **Secure Address Bar**: SSL lock icon (filled, green/teal), "https://" prefix, URL display, "Verified TLS 1.3" badge, Bookmark button.
- **Trailing Actions**: Share, Download, Close buttons.
- **Document Viewer Canvas**:
  - PDF preview with page indicator ("Page 3 of 12").
  - Zoom controls (100% default).
  - Full document rendering with headers, tables, milestone boxes.
  - Highlighted sections (referenced from chat conversations).
  - Digital signature blocks with "Authorize Deliverable" CTA.
- **Status Bar**: "HENU OS Cryptographic Document Engine v4.2" + "Secure Browser Handshake Live" status.

### 33.3 Cross-Reference with Chat

- Documents opened from support chat automatically highlight the referenced section (e.g., "Referenced in Active Chat (Section 3.2)").
- Bidirectional link between chat message and browser content.

### 33.4 Acceptance Criteria

- Browser renders HTML, PDF, and image content correctly.
- SSL indicator shows for HTTPS URLs.
- Close button returns to the previous HENU OS screen.
- Bookmark functionality persists across sessions.
- Share button opens native share sheet.
- Download button saves file to device.

---

## 34. Splash / Authentication Experience

Fully detailed in section 10.1 (Splash), section 10.2 (Sign In), section 10.3 (Registration), section 10.4 (Forgot Password), section 10.5 (Reset Password).

---

## 35. 3D Experience

### 35.1 Visual Specification (from Stitch UI)

- **Scene**: Dark canvas (#11131A) with volumetric lighting.
- **Subject**: Majestic 3D cinematic dragon creature with sculpted metallic wings, iridescent Deep Teal and Royal Iris violet highlights on cybernetic scales.
- **Atmosphere**: Obsidian and indigo atmosphere with soft, high-craft scientific visualization aesthetics.
- **Mood**: Calm, executive, profoundly technologically advanced.
- **Animations**:
  - subtleDrift: 8-second ease-in-out translateY/rotate/scale cycle.
  - pulseGlow: 3-second opacity/drop-shadow cycle on aura rings.
  - streamProgress: 4.2-second progress bar fill.
- **Ambient Elements**: Radial gradient orbs (teal, iris), dot-grid reticle, precision coordinate overlays.

### 35.2 Performance Modes (from Settings screen)

| Mode | Description |
|---|---|
| **Full 3D** | GPU Accelerated, full animations, 60fps target |
| **Optimized** | Battery Conscious, reduced particle effects |
| **Static Fallback** | Zero Animation, 2D brand screen only |

### 35.3 Accessibility

- **Reduced Motion**: Toggle in settings to suppress camera drifts, spatial shifts, and micro-particle flows.
- **prefers-reduced-motion**: Respects OS-level accessibility setting.

---

## 36. Client Profile and Settings

### 36.1 Client Profile (from Stitch UI)

- **Purpose**: Display and manage the client identity, contact information, financial overview, and security status.
- **Actor**: Authenticated Client.
- **Navigation**: Hub tab, Profile (accessible via avatar tap or Hub menu).
- **Outputs**:
  - **Executive Profile Card**:
    - Large avatar (initials) with online status indicator.
    - Full name, verification badge ("Verified Enterprise"), organization, title.
    - "Client since (date)" + tier label ("Enterprise Tier").
    - Copyable Client ID capsule with fingerprint icon and copy button. "Copied to clipboard" feedback.
  - **Contact and Folio Information Card**:
    - Direct Email with "Verified" badge.
    - Secured Line (phone) with "2FA Active" badge.
    - Dispatch Channel preference (e.g., "Encrypted In-App Chat and WhatsApp") with lock icon.
    - "Edit Profile Information" button.
  - **Allocation Snapshot Card**:
    - Total Settled Value with currency.
    - "Full Escrow Discharged, 0 Delinquency" status.
    - Active Engagements count and contract names.
    - Assigned Lead Architect with avatar, name, and title.
  - **Account Status and Protocol Assurance Card**:
    - Security Architecture: "Tier-1 Cryptographic Escrow" with description.
    - Linked Settlement Gateways: List of gateways (e.g., "Razorpay Corporate, Synchronized", "Cashfree Virtual Escrow, Synchronized").
- **Acceptance Criteria**:
  - All profile fields display correct data.
  - Client ID copy works with visual feedback.
  - Edit profile navigates to editable form.

### 36.2 Client Settings (from Stitch UI)

- **Purpose**: Allow clients to manage their account security, notification preferences, visual experience, and payment preferences.
- **Actor**: Authenticated Client.
- **Navigation**: Hub tab, Settings.
- **Sections**:

#### 36.2.1 Account and Security
| Setting | Type | Description |
|---|---|---|
| Change Master Password | Navigation | Opens password change flow. Shows "Last updated N days ago". Rotation label: "Rotated Quarterly". |
| Two-Factor Authentication | Toggle | Enable/disable biometric 2FA (hardware biometric, Apple FaceID). |
| Active Sessions | Navigation | View and manage active sessions. Badge: "iOS and Admin Web". |
| Client ID and Verification Folio | Navigation | View KYC certificate. Badge: "Verified Active". |

#### 36.2.2 Notification Controls
Toggle switches for each notification type (see section 27.3).

#### 36.2.3 Visual and Performance Experience
| Setting | Type | Description |
|---|---|---|
| Theme Selection | Segmented control | Light (Active) / Dark / System |
| 3D Visual Experience | Segmented cards | Full 3D (GPU Accelerated) / Optimized (Battery Conscious) / Static Fallback (Zero Animation) |
| Reduced Motion | Toggle | Suppress camera drifts, spatial shifts, and micro-particle flows |

#### 36.2.4 Payment Preferences
| Setting | Type | Description |
|---|---|---|
| Default Settlement Gateway | Button group | Select default gateway (e.g., Cashfree Escrow, Razorpay UPI) |
| Folio Ledger Currency | Segmented control | USD ($) / INR (Rs) |

#### 36.2.5 Support and Legal
| Setting | Type | Description |
|---|---|---|
| In-App Support Chat | Navigation | Direct encrypted wire with Lead Partner. "Active" indicator with avg reply time. |
| Privacy Policy and Terms of Service | Navigation | Opens in HENU In-App Secure Browser. |
| HENU OS Antigravity Runtime | Info | Build number, kernel version, app version (e.g., v2.4.1). |

#### 36.2.6 Session Management
| Action | Description |
|---|---|
| Sign Out | Red destructive button. Opens confirmation modal: "Terminate Session?" with warning about cryptographic token invalidation and terminal unbinding. Cancel / Sign Out buttons. |

---

## 37. Admin Settings

### 37.1 General Settings

- Company name, logo, address, timezone, fiscal year, default currency.
- Invoice prefix format, quote prefix format.
- Tax configuration (GST, TDS rates).

### 37.2 User Management

- **Purpose**: Manage admin portal users.
- **Operations**: Create user, assign role, deactivate user, reset password.
- **Data Model**: user_id, name, email, role, status, last_login, created_at.
- **Permissions**: user:create, user:read, user:update, user:delete (Super Admin only).

### 37.3 Roles and Permissions

- **Purpose**: Define and manage role-based access control.
- **Operations**: Create custom roles, assign permissions to roles.
- **Permissions**: role:create, role:read, role:update, role:delete (Super Admin only).

### 37.4 Payment Gateway Configuration

See section 32.2.

### 37.5 Notification Settings

- Configure default notification templates.
- Set notification dispatch rules.

---

## 38. Real-Time Requirements

### 38.1 WebSocket Connections

- Admin dashboard: Real-time KPI updates, activity feed, pending approvals.
- Support chat: Real-time messaging, typing indicators, read receipts.
- Payment status: Real-time payment confirmation updates.

### 38.2 Live Sync Indicator

- Displayed on admin dashboard: "Real-time Sync Active, Last updated Ns ago" with animated green indicator.
- Chat: "Direct Protocol Active" session indicator.

### 38.3 Performance Targets

| Metric | Target |
|---|---|
| WebSocket message latency | Less than 2 seconds |
| Dashboard data refresh | Less than 30 seconds |
| Chat message delivery | Less than 2 seconds |
| Payment status update | Less than 10 seconds |

---

## 39. Error Handling

### 39.1 Error Categories

| Category | Handling |
|---|---|
| Network failure | Inline banner with retry option |
| Authentication failure | Redirect to sign-in with error message |
| Validation failure | Field-level error messages |
| Server error (5xx) | Generic error page with retry and support contact |
| Payment failure | Clear error message with retry option and alternative gateway suggestion |
| Rate limiting | Cooldown message with timer |

### 39.2 Error Message Style (from Stitch UI)

- **Dismissible error banner**: Background error-container/40, border error/20, error icon (filled), descriptive message, close button.
- **Field validation**: Red border on invalid field with helper text below.

---

## 40. Empty States

Every list, table, and data view must include a designed empty state:

| Screen | Empty State Message |
|---|---|
| Dashboard (no data) | "Welcome to HENU OS CLM. Start by adding your first customer." |
| Invoices (no invoices) | "No invoices yet. Create your first invoice to get started." |
| Quotes (no quotes) | "No quotes created. Start a conversation with a quote." |
| Payments (no payments) | "No payments recorded yet." |
| Services (no services) | "No services in the catalogue. Add your first service." |
| Support Chat (no messages) | "Start a conversation with your HENU OS architect." |
| Activity Feed (no activity) | "No recent activity. Your timeline will populate as you use HENU OS." |
| Portfolio (no items) | "Portfolio coming soon." |
| Notifications (empty) | "You are all caught up." |

---

## 41. Accessibility

### 41.1 Requirements

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA compliance | All interactive elements meet contrast ratios and target sizes |
| Keyboard navigation | All admin portal interactions accessible via keyboard (Tab, Enter, Escape, Arrow keys) |
| Screen reader support | Semantic HTML, ARIA labels on all interactive elements |
| Reduced motion | Configurable in client app settings; respects prefers-reduced-motion OS setting |
| Touch targets | Minimum 44x44px touch targets on mobile |
| Focus indicators | Visible focus rings (1.5px Royal Iris border with soft focus ring) |
| Color independence | Status information conveyed through text + icon + color (not color alone) |
| Text scaling | Support up to 200% text scaling without layout breakage |

---

## 42. Performance

### 42.1 Targets

| Metric | Target |
|---|---|
| Admin Portal initial load (LCP) | Less than 2 seconds |
| Client App cold start | Less than 3 seconds (including splash) |
| API response time (p95) | Less than 500ms |
| 3D splash rendering | 60fps on target devices |
| Image/PDF load time | Less than 3 seconds |
| Search results | Less than 500ms |
| Concurrent admin users | 50 or more |
| Concurrent client app users | 1,000 or more |

### 42.2 Optimization Strategies

- Edge caching for static assets.
- Lazy loading for images and below-fold content.
- Database query optimization with indexes.
- WebSocket connection pooling.
- GPU-accelerated 3D rendering with progressive fallback.

---

## 43. Functional Requirements Summary

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Admin can create, read, update, and archive customers | P0 |
| FR-02 | Admin can create, send, and manage quotes with line items and discounts | P0 |
| FR-03 | Admin can create, send, and manage invoices with PDF generation | P0 |
| FR-04 | Admin can create and manage recurring invoices on defined schedules | P1 |
| FR-05 | Admin can record and view payments from all gateway channels | P0 |
| FR-06 | Admin can create and issue credit notes | P1 |
| FR-07 | Admin can generate client statements with export | P1 |
| FR-08 | Admin can create, categorize, and manage services and add-ons | P0 |
| FR-09 | Admin can manage portfolio items | P1 |
| FR-10 | Admin can manage digital products, source code, and software | P1 |
| FR-11 | Admin can create and manage offers/promotions | P2 |
| FR-12 | Admin can manage users, roles, and permissions | P0 |
| FR-13 | Admin can configure payment gateways | P0 |
| FR-14 | Admin can manage CMS content (company info, FAQs, legal, social) | P1 |
| FR-15 | Admin can view analytics dashboards with real-time data | P0 |
| FR-16 | Admin can communicate with clients via support chat | P0 |
| FR-17 | Admin can send notifications to clients | P1 |
| FR-18 | Client can register, sign in, reset password | P0 |
| FR-19 | Client receives unique HENU OS Client ID on registration | P0 |
| FR-20 | Client can view personalized dashboard | P0 |
| FR-21 | Client can browse services and build custom quotes | P0 |
| FR-22 | Client can view and pay invoices via integrated payment gateways | P0 |
| FR-23 | Client can view quotes, sales orders, payments, and statements | P0 |
| FR-24 | Client can communicate with HENU OS via support chat | P0 |
| FR-25 | Client can view portfolio, products, and offers | P1 |
| FR-26 | Client can manage profile and settings | P0 |
| FR-27 | Client can use in-app browser for documents and legal pages | P1 |
| FR-28 | Client experiences 3D splash screen with performance modes | P1 |
| FR-29 | System auto-generates sales orders from accepted quotes | P0 |
| FR-30 | System auto-generates invoices from recurring invoice templates | P1 |
| FR-31 | System auto-reconciles payments via gateway webhooks | P0 |
| FR-32 | System delivers real-time notifications for key events | P0 |

---

## 44. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | **Availability**: System uptime | 99.9% SLA |
| NFR-02 | **Scalability**: Concurrent client sessions | 1,000 or more |
| NFR-03 | **Security**: Data encryption at rest | AES-256 |
| NFR-04 | **Security**: Data encryption in transit | TLS 1.3 |
| NFR-05 | **Security**: Authentication | JWT-based with refresh tokens; 2FA support (biometric, TOTP) |
| NFR-06 | **Security**: Password storage | bcrypt/argon2 hashing, minimum 12 character policy |
| NFR-07 | **Security**: API keys | Encrypted storage, never exposed client-side |
| NFR-08 | **Security**: Session management | Token expiry, revocation on sign-out, multi-device session tracking |
| NFR-09 | **Compliance**: SOC2 Type II attestation readiness | Design for audit trail, access logging |
| NFR-10 | **Compliance**: GDPR-ready data handling | Data export, deletion support |
| NFR-11 | **Performance**: API response time (p95) | Less than 500ms |
| NFR-12 | **Performance**: Client app cold start | Less than 3 seconds |
| NFR-13 | **Performance**: 3D rendering | 60fps on mid-range devices |
| NFR-14 | **Reliability**: Database backup | Daily automated backups with 30-day retention |
| NFR-15 | **Observability**: Logging | Structured logging for all API requests and errors |
| NFR-16 | **Observability**: Monitoring | Real-time health dashboards for all services |
| NFR-17 | **Browser Support**: Admin Portal | Chrome 100+, Firefox 100+, Safari 16+, Edge 100+ |
| NFR-18 | **Mobile Support**: Client App | iOS 16+, Android 12+ |
| NFR-19 | **Internationalization**: Currency | Multi-currency support (USD, INR at minimum) |
| NFR-20 | **Audit Trail**: All create/update/delete operations | Timestamped, user-attributed audit logs |

---

## 45. User Journeys

### 45.1 New Client Registration Journey

```
Client installs app
  -> 3D Splash screen (4.2s)
  -> Authentication screen
  -> Taps "Create an Account"
  -> Registration form (name, mobile, email, password)
  -> Password strength validation (real-time)
  -> Submit -> Client ID generated (HENU-CL-YYYY-NNNNNN)
  -> Client ID card displayed with copy functionality
  -> Taps "Proceed to Executive Dashboard"
  -> Home Dashboard
```

### 45.2 Client Invoice Payment Journey

```
Client receives push notification: "New invoice #INV-2026-092 for $12,500 is ready."
  -> Opens app -> Home Dashboard
  -> Sees invoice card in Financial Snapshot
  -> Taps "Pay Now" on invoice card
    OR navigates to Finance tab -> Invoices
  -> Views outstanding invoice with details
  -> Selects payment gateway (Razorpay / Cashfree)
  -> Taps "Proceed to Secure Payment"
  -> Gateway SDK handles payment capture
  -> On success: returns to Finance screen
  -> Invoice status updates to "Paid"
  -> Admin receives "Payment received" notification
  -> Activity feed updates for both parties
```

### 45.3 Client Quote Request Journey

```
Client navigates to Services tab
  -> Browses service catalogue
  -> Taps "Configure and Request Quote" on desired service
  -> Interactive Quote Builder opens with:
    -> Step 01: Base service pre-selected (changeable)
    -> Step 02: Add-on modules (checkboxes)
    -> Estimated allocation total updates live
  -> Taps "Submit Quotation Request"
  -> Quote created in Draft status
  -> Admin receives notification of new quote request
  -> Admin reviews, prices, and sends quote
  -> Client receives "New quote ready" notification
  -> Client reviews quote -> Accepts
  -> Sales Order auto-generated
  -> Admin creates invoice -> Client pays
```

### 45.4 Admin Approval Workflow

```
Sales Exec creates quote with 15% discount for client
  -> Discount exceeds threshold
  -> Pending approval item created
  -> Super Admin sees item in Pending Approvals widget
  -> Super Admin taps "Authorize" or "Decline"
  -> On authorize: discount applied, quote finalized
  -> On decline: Sales Exec notified, quote returned to Draft
```

### 45.5 Client Support Chat Journey

```
Client has question about quote Section 3.2
  -> Navigates to Hub tab -> Support
  -> Opens chat with assigned architect
  -> Types question
  -> Architect responds with explanation
  -> Architect shares document attachment (PDF)
  -> Client taps "Open" on document
  -> In-App Browser opens with PDF
  -> Section 3.2 is highlighted (cross-referenced from chat)
  -> Client reviews section
  -> Returns to chat
  -> Architect sends inline payment card for quotation
  -> Client taps "Pay Now" directly in chat
  -> Payment flow completes
```

---

## 46. Business Workflows

### 46.1 Quote-to-Cash Workflow

```
Quote (Draft) -> Quote (Under Review) -> Quote (Sent to Client)
  -> Client Accepts -> Sales Order (Confirmed) -> Invoice (Draft)
  -> Invoice (Sent) -> Client Pays -> Payment (Completed)
  -> Invoice (Paid) -> Statement Updated
```

### 46.2 Recurring Billing Workflow

```
Recurring Invoice Template (Active)
  -> System checks next_invoice_date daily
  -> On date match: Generate Invoice from template
  -> If auto_send: Send to client immediately
  -> Client receives notification
  -> Client pays -> Payment recorded
  -> next_invoice_date advanced by frequency
```

### 46.3 Credit Note Workflow

```
Client disputes charge or service scope changes
  -> Admin creates Credit Note (Draft) referencing invoice
  -> Admin reviews and issues Credit Note
  -> Credit Note applied to outstanding balance
  -> Statement updated with credit
```

---

## 47. Acceptance Criteria (Global)

| # | Criterion |
|---|---|
| AC-01 | All CRUD operations validate inputs and provide field-level error messages. |
| AC-02 | All lists support search, filtering, sorting, and pagination. |
| AC-03 | All financial calculations are accurate to 2 decimal places. |
| AC-04 | All status transitions follow defined state machines. |
| AC-05 | All user-facing timestamps display in the user local timezone. |
| AC-06 | All PDF documents generate with correct data and professional formatting. |
| AC-07 | All payment gateway integrations handle success, failure, and timeout scenarios. |
| AC-08 | All real-time features update within defined latency targets. |
| AC-09 | All destructive actions require confirmation modals. |
| AC-10 | All audit-sensitive operations are logged with user, timestamp, and change details. |
| AC-11 | The 3D splash experience degrades gracefully on low-end devices. |
| AC-12 | The system remains functional with all non-critical services degraded. |
| AC-13 | All client-facing screens render correctly on iOS 16+ and Android 12+. |
| AC-14 | The admin portal renders correctly on Chrome, Firefox, Safari, and Edge. |

---

## 48. Future Extensibility

| # | Feature | Description | Status |
|---|---|---|---|
| FE-01 | Multi-tenancy | Support multiple organizations under one deployment | Planned |
| FE-02 | Offline-first mobile | Local data caching with sync-on-reconnect | Planned |
| FE-03 | AI-powered insights | Predictive analytics for revenue forecasting and client churn | Planned |
| FE-04 | White-label client app | Allow custom branding per organization | Planned |
| FE-05 | API marketplace | Expose CLM APIs for third-party integrations | Planned |
| FE-06 | Advanced reporting | Custom report builder with scheduled exports | Planned |
| FE-07 | Contract management | NDA, SLA, and contract lifecycle tracking | Planned |
| FE-08 | Multi-language support | Internationalization of all UI strings | Planned |
| FE-09 | Client portal web version | Web-based client access in addition to mobile | Planned |
| FE-10 | Automated follow-ups | Schedule-based reminders for overdue actions | Planned |
| FE-11 | Project milestone tracking | Detailed Gantt/Kanban project management | Planned |
| FE-12 | Digital signatures | In-app document signing (e-signatures) | Planned |
| FE-13 | Advanced audit logging | Compliance-grade audit trail with tamper detection | Planned |

---

## 49. Open Questions / Decisions Required

| # | Question | Impact Area | Status |
|---|---|---|---|
| OQ-01 | What is the exact discount approval threshold percentage? (Stitch UI shows 15% example) | Quote Management | Pending Decision |
| OQ-02 | Should clients be able to request quotes without pre-selecting a service (free-form requests)? | Quote Management | Pending Decision |
| OQ-03 | What are the exact client tier definitions beyond "Enterprise"? | Customer Management | Pending Decision |
| OQ-04 | Should recurring invoices support variable amounts per cycle, or only fixed templates? | Recurring Invoices | Pending Decision |
| OQ-05 | What is the retention period for archived customer data? | Compliance | Pending Decision |
| OQ-06 | Should the in-app browser support external URLs or only HENU OS-hosted content? | In-App Browser | Pending Decision |
| OQ-07 | What tax jurisdictions need to be supported? (GST, TDS shown in Stitch UI) | Invoice Management | Pending Decision |
| OQ-08 | Should the mobile app support tablet-optimized layouts (beyond phone)? | Mobile App | Pending Decision |
| OQ-09 | What is the expected data migration strategy from existing systems? | Implementation | Pending Decision |
| OQ-10 | Should admin portal support dark mode at launch, or is it a future phase? | Admin Portal | Pending Decision |
| OQ-11 | What is the expected SLA for support chat response time? (UI shows "Avg reply: ~4 mins" / "< 10 mins") | Support | Pending Decision |
| OQ-12 | Should product purchases support subscription licensing (recurring payments) or one-time only? | Product Catalogue | Pending Decision |
| OQ-13 | What is the maximum file attachment size for support chat? | Communication | Pending Decision |
| OQ-14 | Should the system support partial payments on a single invoice? | Payment Management | Pending Decision |
| OQ-15 | What notification channels should be supported beyond push and in-app? (SMS, WhatsApp) | Notifications | Pending Decision |

---

## Appendix A: Design System Reference

### Admin Portal: "Scientific Clarity"

- **Font**: Plus Jakarta Sans (all weights)
- **Primary**: Royal Iris #887DB8 / #5e548c
- **Secondary**: Deep Teal #236870 / #22676f
- **Warning**: Terracotta Rose #C96F61
- **Finance**: Saffron Gold #D9A441 / #7a5500
- **Supporting**: Muted Sage #788F83
- **Background**: Soft Porcelain #F5F1EA / #fdf9f2
- **Surface**: Pure White #FFFFFF
- **Ink**: #20202B / #1c1c18
- **Border**: Stone Grey #E0DAD1 / #c9c4d0
- **Dark mode canvas**: #11131A, container: #181B24, elevated: #202431

### Client Mobile App: "Porcelain Architectural CLM"

- **Font**: Plus Jakarta Sans
- **Background**: #fcf8ff
- **Surface**: #ffffff
- **Primary**: #5e548c
- **Secondary**: #22676f
- **Tertiary**: #7a5500
- **Error**: #ba1a1a
- **Border radius**: Cards 16px, inputs 12px, pills 9999px
- **Elevation**: 3-tier system (base, elevated cards, floating overlays)
- **Grid**: 8pt base, 4-column mobile, 16px margins

### Shared Icon System

- Material Symbols Outlined
- 2px stroke weight
- Variable weight/fill settings

---

## Appendix B: Abbreviations

| Abbreviation | Definition |
|---|---|
| CLM | Client Lifecycle Management |
| CRM | Customer Relationship Management |
| CTA | Call to Action |
| CRUD | Create, Read, Update, Delete |
| 2FA | Two-Factor Authentication |
| JWT | JSON Web Token |
| SLA | Service Level Agreement |
| KPI | Key Performance Indicator |
| SDK | Software Development Kit |
| UPI | Unified Payments Interface |
| NEFT | National Electronic Funds Transfer |
| GST | Goods and Services Tax |
| TDS | Tax Deducted at Source |
| TLS | Transport Layer Security |
| PDF | Portable Document Format |
| CSV | Comma-Separated Values |
| API | Application Programming Interface |
| RBAC | Role-Based Access Control |
| WebGL | Web Graphics Library |
| FPS | Frames Per Second |
| LCP | Largest Contentful Paint |

---

*End of Document*

*HENU OS CLM — Simple systems. Real progress.*
