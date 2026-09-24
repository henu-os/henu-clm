# HENU OS CLM — MANUAL QA CHECKLIST

## 1. Overview
This checklist documents manual test procedures, execution paths, expected results, and verification statuses for HENU OS CLM.

---

## 2. Comprehensive Test Execution Matrix

| Test ID | Category | Action / Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **AUTH-01** | Authentication | Admin Web: Submit valid admin credentials | Authenticated session created; redirects to `/dashboard` | Login successful, dashboard renders | **PASS** |
| **AUTH-02** | Authentication | Admin Web: Submit invalid email / password | Safe error toast displayed; user remains on login page | "Invalid credentials" displayed; no unhandled crash | **PASS** |
| **AUTH-03** | Authentication | Client Mobile: Submit valid client credentials | Session saved to secure storage; navigates to Home screen | Session valid, home dashboard loaded | **PASS** |
| **AUTH-04** | Authentication | Session Restoration: Refresh browser on protected route | Session token restored; dashboard persists without logout | Dashboard state preserved | **PASS** |
| **AUTH-05** | Authentication | Logout: Trigger logout from Admin / Mobile | Session cleared; protected routes redirect to login | Clean redirect to `/login`; storage purged | **PASS** |
| **QT-01** | Quotes | Admin creates quote with line items & taxes | Quote saved to database with status `PENDING_APPROVAL` | Quote record created with calculations | **PASS** |
| **QT-02** | Quotes | Client reviews and signs approval for quote | Quote transitions to `APPROVED`; triggers Order creation | Status changed to `APPROVED`, order created | **PASS** |
| **QT-03** | Quotes | Client rejects quote with reason note | Quote status transitions to `REJECTED`; admin notified | Status changed to `REJECTED`, reason recorded | **PASS** |
| **ORD-01** | Orders | Order milestones progression update | Milestone toggled to completed; progress % recalculates | Milestone completed, progress % updated | **PASS** |
| **INV-01** | Invoices | Invoice generation & tax calculation | Subtotal, GST/tax, and total match server math | Exact totals rendered | **PASS** |
| **PAY-01** | Payments | Initiate server payment order (Razorpay/Cashfree) | Server/Edge function returns checkout payload | Order created with pending status | **PASS** |
| **PAY-02** | Payments | Gateway webhook delivery with HMAC verification | Status transitions to `SUCCESSFUL`; invoice marked `PAID` | Signature verified, status updated | **PASS** |
| **PAY-03** | Payments | Duplicate webhook delivery (Idempotency) | Returns `already_processed`; no duplicate payment credited | Duplicate suppressed cleanly | **PASS** |
| **PAY-04** | Payments | Client spoofed payment attempt | Rejected by database RLS and server validation | Untrusted status rejected | **PASS** |
| **SUP-01** | Support | Client sends message to concierge thread | Message stored; instant Realtime delivery to Admin Web | Message delivered without page refresh | **PASS** |
| **SUP-02** | Support | Admin replies to client thread | Message stored; instant Realtime delivery to Client Mobile | Client receives reply in real time | **PASS** |
| **NOTIF-01**| Notifications | Event triggered (Payment / Quote approval) | In-app notification created; unread badge increments | Notification badge updated | **PASS** |
| **RLS-01** | Security | Client A attempts to query Client B records | Database RLS blocks query; returns empty / unauthorized | 0 cross-tenant rows accessible | **PASS** |
| **XSS-01** | Security | User inputs `<script>` in support / company name | Escaped and rendered as plain text; no script execution | Text safely neutralized | **PASS** |
| **IDOR-01**| Security | Direct URL access to another client's invoice ID | Access denied (403 / 404) | Access blocked | **PASS** |
| **OFF-01** | Offline/Resilience | Temporary network disconnection during navigation | Friendly offline error banner with retry button | Safe error state, retry recovers state | **PASS** |
| **PERF-01**| Performance | Rapid navigation across tabs / screens | No duplicate WebSocket channels; queries debounced | Single subscription per channel maintained | **PASS** |
| **DOC-01** | Docker | Build and run `docker compose -p wacrm up -d` | Container starts, health check queries `/api/health` | Container status healthy, HTTP 200 | **PASS** |
| **IOS-01** | iOS Release | Build and run iOS native bundle on Windows | Compilation requires macOS + Xcode toolchain | Compilation blocked by host OS (Windows) | **BLOCKED** |
