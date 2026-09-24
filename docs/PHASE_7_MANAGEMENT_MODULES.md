# HENU OS CLM — PHASE 7: MANAGEMENT MODULES REFERENCE

## 1. Complete Business Modules Overview

HENU OS CLM Phase 7 provides 7 fully connected enterprise business management modules in the Admin Web:

```text
                                  BUSINESS MODULES
                                         │
        ┌─────────────┬─────────────┬────┴────────┬─────────────┬─────────────┐
        ▼             ▼             ▼             ▼             ▼             ▼
    1. ITEMS    2. CUSTOMERS   3. QUOTES    4. INVOICES   5. RECURRING  6. PAYMENTS   7. CREDIT NOTES
    (Catalog)    (360° View)   (Workbench)  (Billing)     (Profiles)    (Ledger)      (Adjustments)
```

---

## 2. Module Specifications

### Module 1: Items & Catalog (`/catalog`)
- **Item Types**: Goods and Professional Services.
- **Attributes**: SKU, unit of measurement, HSN/SAC code, tax preferences (`TAXABLE`, `NON_TAXABLE`, `OUT_OF_SCOPE`, `NON_GST`).
- **Commercial Accounts**: Selling price, sales account, cost price, purchase account, preferred vendor.
- **Inventory Tracking**: Track inventory flag, opening stock quantity, reorder points, real-time stock levels.

### Module 2: Customers & 360° View (`/customers` and `/customers/[id]`)
- **Customer Profiles**: Business vs Individual, contact salutations, primary email, mobile/work phone.
- **GST & Compliance**: GST treatment (Regular, Composition, Unregistered, Consumer, Overseas, SEZ), GSTIN, place of supply, PAN, currency, opening balance, payment terms.
- **Addresses & Contacts**: Multiple contact persons, structured billing and shipping addresses with one-click copy.
- **Customer 360° View**: Unified customer dossier aggregating Quotes, Orders, Invoices, Payments, Recurring Profiles, Credit Notes, and Realtime Activity stream.

### Module 3: Quotes Workbench (`/quotes`)
- **Workflow**: Draft $\to$ Sent $\to$ Viewed $\to$ Accepted $\to$ Rejected $\to$ Expired $\to$ Converted to Order.
- **Line Items & Totals**: Quantity, unit rate, percentage/flat discounts, HSN tax calculation, shipping charges, TDS/TCS, grand total.
- **Customer Mobile Sync**: When quote is sent, client mobile receives instant notification; client accepts/rejects in real time.

### Module 4: Invoices (`/invoices`)
- **Billing Lifecycle**: Draft $\to$ Sent $\to$ Partially Paid $\to$ Paid $\to$ Overdue $\to$ Void.
- **Tax Calculations**: Precise subtotal, GST/tax, balance due, due dates, customer notes, terms & conditions.
- **Payment Linkage**: Direct integration with Razorpay, Cashfree, and banking channels.

### Module 5: Recurring Invoices (`/invoices/recurring`)
- **Schedules**: Weekly, Monthly, Yearly recurring intervals.
- **Automation**: Automatic scheduled invoice generation, auto-send via email & mobile portal, auto-charge support.

### Module 6: Payments Received & Customer Advance (`/payments`)
- **Invoice Payments**: Apply payments against specific outstanding invoices.
- **Customer Advances**: Record advance receipts with tax deduction options (No Tax, TDS, GST on Advance).
- **Payment Modes**: Cash, Cheque, Credit Card, Bank Transfer (NEFT/RTGS), UPI, Gateway.

### Module 7: Credit Notes (`/credit-notes`)
- **Reasons**: Sales Return, Invoice Correction, Discount Granted, Other.
- **Application**: Allocated against unpaid invoices or maintained as client credit balance.

---

## 3. Financial Calculation Engine
Centralized in `apps/admin-web/src/lib/finance/calculator.ts` and `@henu/shared`:
- Decimal-safe monetary arithmetic preventing floating-point rounding errors.
- Unified calculations across Quotes, Invoices, Recurring Invoices, and Credit Notes.
