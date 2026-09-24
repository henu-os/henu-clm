# HENU OS CLM — PHASE 8 MANAGEMENT MODULES SPECIFICATION

## 1. Overview
The HENU OS CLM administrative portal features 7 comprehensive accounting and business management modules integrated with Supabase backend and Flutter Client Mobile application.

---

## 2. Items & Catalog (`/catalog`)
- **Main Details**: Goods / Services, SKU, Unit of Measurement, HSN/SAC Codes, Tax Preferences (Taxable, Non-Taxable, Out of Scope, Non-GST) with Exemption Reasons.
- **Sales & Purchase Info**: Selling Price, Sales Account, Cost Price, Purchase Account, Preferred Vendor.
- **Tax Rates**: Intra-State GST (CGST/SGST 5%, 12%, 18%, 28%) and Inter-State IGST (5%, 12%, 18%, 28%).
- **Inventory Tracking**: Opening stock, opening rate per unit, reorder points, and stock valuation.
- **Usage Tracking**: Associated Quotes, Orders, and Invoices.

---

## 3. Customers & 360° View (`/customers`, `/customers/[id]`)
- **Customer Identity**: Business vs Individual, Salutations (Mr., Mrs., Ms., Dr.), Company details, primary contact.
- **Tax / Financials**: GST Treatment (Regular, Composition, Unregistered, Consumer, Overseas, SEZ), GSTIN, PAN, Place of Supply, Currency, Payment Terms (Due on Receipt, Net 7/15/30/45/60, Custom).
- **Multiple Contacts**: Contact persons with Name, Email, Phone, Designation.
- **Addresses**: Dual Billing and Shipping address structures with "Copy Billing to Shipping" action.
- **Customer 360° View**: Financial metrics (Total Quoted, Invoiced, Paid, Outstanding, Credits) + Activity Timeline.
- **Automatic Client Provisioning**: Creates corresponding Supabase Auth user and links customer profile.

---

## 4. Quotes & Estimates (`/quotes`, `/quotes/[id]`)
- **Header**: Customer selector (with inline `+ New Customer`), Quote #, Reference #, Expiry Date, Salesperson, Subject.
- **Line Items**: Auto-fill item rates, HSN/SAC, discounts, and GST breakdown.
- **Decimal-Safe Calculations**: Subtotal, line discounts, global discounts, shipping, adjustments, TDS/TCS, and GST totals.
- **Approval Flow**: Admin "Save & Send" -> Client receives notification -> Client views on mobile -> Client Accepts/Rejects (with reason) -> Admin receives realtime update.

---

## 5. Orders & Project Milestones (`/orders`, `/orders/[id]`)
- **Bridge between Quote and Invoice**: Converts accepted quotes into execution orders while maintaining financial line items.
- **Milestone Tracking**: Tracks progress percentages, phase deliveries, and team assignments.
- **Mobile Synchronization**: Real-time push of milestone updates to client mobile dashboard.

---

## 6. Invoices (`/invoices`, `/invoices/[id]`)
- **Features**: Order references, terms, due dates, multi-rate tax calculations, balance tracking.
- **Payment Methods**: Configured UPI, Cards, Net Banking, and Bank Transfer options.
- **Actions**: Save Draft, Save & Send, Live Preview, PDF Export, Print, Duplicate, Record Payment, Void.

---

## 7. Recurring Invoices (`/recurring-invoices`, `/invoices/recurring`)
- **Automation**: Frequency intervals (Week, Month, Year), End conditions (Never, Specific Date, After X Occurrences).
- **Idempotency**: Scheduled server-side generation preventing duplicate invoices on retry.
- **Mobile Integration**: Generates new invoices directly into customer's mobile invoice list without exposing billing configuration.

---

## 8. Payments Received (`/payments`)
- **Payment Recording**: Payment Modes (Cash, Cheque, Credit Card, Bank Transfer, UPI), Deposit accounts (Petty Cash, Bank Account).
- **Payment Allocation**: Smart allocation across unpaid invoices with over-allocation guards.
- **Customer Advance**: Dedicated customer advance recording with tax treatment (GST on Advance, TDS).
- **Realtime Balance Updates**: Automatically recalculates invoice balance due and updates mobile payment history.

---

## 9. Credit Notes (`/credit-notes`)
- **Reasons**: Sales Return, Invoice Correction, Discount Granted, Other.
- **Actions**: Save Draft, Save as Open, Apply to Invoice, Download PDF.
- **Mobile Visibility**: Real-time visibility of available credit notes in client mobile wallet.
