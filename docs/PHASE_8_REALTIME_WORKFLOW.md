# HENU OS CLM — PHASE 8 REALTIME BUSINESS WORKFLOW SPECIFICATION

## 1. Overview
The HENU OS CLM platform maintains seamless real-time synchronization between the Admin Web portal and Client Mobile application through Supabase Realtime channels.

---

## 2. 33-Step End-to-End Realtime Business Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant AdminWeb as Admin Web Portal
    participant Supabase as Supabase Backend (DB + Realtime)
    participant Mobile as Client Mobile App
    actor Client

    Admin->>AdminWeb: 1. Create Customer & Enable Client Portal
    AdminWeb->>Supabase: 2. Provision Supabase Auth User + Link Customer
    Admin->>AdminWeb: 3. Create Item in Catalog
    Admin->>AdminWeb: 4. Create Quote & Select Template
    AdminWeb->>AdminWeb: 5. Live Preview Quote
    Admin->>AdminWeb: 6. Save & Send Quote
    AdminWeb->>Supabase: 7. Insert Quote (Status: SENT)
    Supabase-->>Mobile: 8. Realtime Notification Event (New Quote)
    Client->>Mobile: 9. Open Quote Details & Review Terms
    Client->>Mobile: 10. Tap "Accept Quote"
    Mobile->>Supabase: 11. Update Quote (Status: ACCEPTED)
    Supabase-->>AdminWeb: 12. Realtime Event -> Status Updates to ACCEPTED
    Admin->>AdminWeb: 13. Convert Quote to Order
    AdminWeb->>Supabase: 14. Insert Order with Milestones
    Supabase-->>Mobile: 15. Realtime Event -> Order Appears on Mobile
    Admin->>AdminWeb: 16. Update Milestone (e.g. 50% Complete)
    Supabase-->>Mobile: 17. Milestone Progress Updated in Realtime
    Admin->>AdminWeb: 18. Generate Invoice & Select Template
    AdminWeb->>Supabase: 19. Insert Invoice (Status: ISSUED)
    Supabase-->>Mobile: 20. Realtime Notification -> Invoice Issued
    Client->>Mobile: 21. Tap "Pay Now"
    Mobile->>Supabase: 22. Create Payment Intent (Razorpay/Cashfree Sandbox)
    Client->>Mobile: 23. Complete Payment Authorization
    Supabase->>Supabase: 24. Webhook Verifies Signature & Records Payment
    Supabase->>Supabase: 25. Recalculate Invoice Balance (Status: PAID)
    Supabase-->>Mobile: 26. Realtime Event -> Payment Receipt Available
    Supabase-->>AdminWeb: 27. Realtime Event -> Payment Recorded & Dashboard Updated
    Admin->>AdminWeb: 28. Issue Credit Note for Adjustment
    Supabase-->>Mobile: 29. Realtime Event -> Credit Note Appears in Wallet
    Admin->>AdminWeb: 30. Recurring Schedule triggers next billing cycle
    Supabase->>Supabase: 31. Idempotent cron creates new Invoice
    Supabase-->>Mobile: 32. Realtime Event -> New Cycle Invoice Delivered
    Supabase-->>AdminWeb: 33. All financial metrics reconciled in Realtime
```

---

## 3. Subscription Management Rules
- **No Polling**: `setInterval()` and page refresh loops are prohibited.
- **Centralized Channels**: Logical channel manager per entity (`quotes`, `orders`, `invoices`, `payments`, `templates`).
- **Foreground / Reconnection**: Client Mobile auto-reconnects and resynchronizes state upon app resume without full-page reloads.
