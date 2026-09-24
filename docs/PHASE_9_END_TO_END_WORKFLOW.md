# HENU OS CLM — PHASE 9: END-TO-END BUSINESS WORKFLOW AUDIT

## 1. Lifecycle Verification Matrix

```
[ Organization ] 
       │
       ▼
 [ Customer ] ──────────► [ Catalog / Items ]
       │                         │
       ▼                         ▼
   [ Quote ] ───────────► [ Quote Line Items ]
       │
       ├─────────────────────────┐
       ▼ (Approval)              ▼ (Rejection)
   [ Order ]                 [ Archived ]
       │
       ├─────────────────────────┐
       ▼ (Milestones)            ▼
[ Invoice Generated ]     [ Progress Tracking ]
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼ (Full / Partial)        ▼ (Credit Adjustment)     ▼ (Overdue)
  [ Payment ]              [ Credit Note ]           [ Reminder / Dunning ]
       │                         │
       ▼                         ▼
[ Receipt Issued ]        [ Balance Offset ]
       │
       ▼
[ Realtime Sync to Client Mobile ]
```

---

## 2. Step-by-Step Workflow Validation

### Step 1: Customer & Catalog Setup
- **Action**: Create new customer with primary contact and tax profile; create catalog item with category, unit rate, and GST slab (e.g. 18%).
- **Verification**: Persistence in `customers` and `items` tables with audit logging.

### Step 2: Quote Generation & Client Approval
- **Action**: Admin drafts Quote `QT-2026-0042` with 2 items and 10% discount.
- **Client Mobile Flow**: Client receives instant notification, views quote details, and clicks "Approve Quote".
- **Outcome**: Status transitions from `sent` -> `approved`. Trigger initiates order conversion.

### Step 3: Order & Delivery Milestones
- **Action**: Order `ORD-2026-0018` is auto-created with 3 delivery milestones (e.g. Design 30%, Development 40%, Deployment 30%).
- **Outcome**: Realtime update propagates to Admin `/delivery` and Mobile Orders screen.

### Step 4: Milestone Invoicing
- **Action**: Milestone 1 (30%) completed; invoice `INV-2026-0089` generated with calculated GST and TDS deduction.
- **Outcome**: Invoice balance marked unpaid; payment gateway order generated via `create-payment-order`.

### Step 5: Payment Processing & Reconciliation
- **Action**: Client completes payment through Razorpay/Cashfree gateway; webhook triggers `razorpay-webhook`.
- **Outcome**: Idempotent signature verified, `payments` row inserted, `invoices.paid_amount` updated, balance set to `0.00`, client receipt generated and pushed via Realtime to mobile client.

### Step 6: Credit Note & Recurring Automation
- **Action**: Credit Note `CN-2026-0005` allocated against an open invoice or retained as customer credit balance.
- **Recurring Engine**: `recurring_invoices` evaluates schedule (monthly/quarterly) to generate child invoice on trigger date.
