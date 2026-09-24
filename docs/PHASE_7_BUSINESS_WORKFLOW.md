# HENU OS CLM — PHASE 7: END-TO-END BUSINESS WORKFLOW

## 1. 24-Step End-to-End Business Flow

```text
Admin Portal (Management)                Supabase PostgreSQL & Realtime           Client Mobile (Action)
          │                                            │                                     │
1. Admin creates Customer ─────────────────────────► Customers Table                         │
2. Admin creates Item ─────────────────────────────► Items Table                             │
3. Admin creates Quote ────────────────────────────► Quotes Table                            │
4. Admin sends Quote ──────────────────────────────► Status: SENT                            │
                                                       │ ──── Realtime CDC Notification ───► 5. Mobile receives Quote
                                                       │                                     6. Client opens Quote
                                                       │ <─── Approve with Signature ─────── 7. Client accepts Quote
8. Admin sees ACCEPTED in Realtime ◄───────────────── Status: APPROVED
9. Admin converts Quote to Order ──────────────────► Orders Table (ORD-2026-0042)
                                                       │ ──── Realtime CDC Update ─────────► 10. Mobile sees Order Active
11. Admin generates Invoice ───────────────────────► Invoices Table (INV-2026-089)
                                                       │ ──── Realtime CDC Notification ───► 12. Mobile receives Invoice
                                                       │                                     13. Client opens Invoice
                                                       │ <─── Initiate "Pay Now" ─────────── 14. Client initiates Payment
                                                       ▼
                                          15. Server Payment Order Created
                                              (Razorpay / Cashfree)
                                                       │
                                          16. Sandbox Test Payment Succeeded
                                                       ▼
                                          17. Webhook Signature Verified
                                          18. Payment Record Created (PAY-2026-041)
                                          19. Invoice Status: PAID (Balance: $0)
                                          20. Order Payment Status: PAID
                                                       │
21. Admin sees Paid in Realtime ◄──────────────────────┴───── Realtime CDC Broadcast ─────► 20. Mobile sees Payment Success
                                                                                             22. Receipt PDF Downloadable
23. Admin creates Credit Note ─────────────────────► Credit Notes Table (CN-2026-0001)
                                                       │ ──── Realtime Sync ───────────────► 24. Mobile sees Credit Applied
```

---

## 2. Realtime Event Synchronizations
- **Quotes**: Instant state transition upon customer signature or rejection note.
- **Invoices & Payments**: Immediate balance decrement upon webhook verification without page reload.
- **Support Messages**: Bidirectional concierge chat between Client Mobile and Admin Web support inbox.
- **Notifications**: In-app alert badges and multi-channel notification dispatcher.
