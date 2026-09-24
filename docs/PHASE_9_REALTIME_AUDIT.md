# HENU OS CLM — PHASE 9: REALTIME SUBSCRIPTIONS & SYNCHRONIZATION AUDIT

## 1. Realtime Infrastructure
- **Provider**: Supabase Realtime (PostgreSQL Replication via WebSocket channel).
- **Client Implementation**: `apps/admin-web/src/lib/realtime/index.ts` and `apps/client-mobile/lib/core/network/`.

---

## 2. Channel Matrix & Scopes
| Channel Name | Monitored Table | Events | Handlers / Actions |
|---|---|---|---|
| `admin-invoices-channel` | `public.invoices` | `INSERT`, `UPDATE` | Refreshes invoice list, updates badge counts, triggers payment reconciliation |
| `admin-quotes-channel` | `public.quotes` | `INSERT`, `UPDATE` | Updates proposal status on client approval/rejection |
| `admin-orders-channel` | `public.orders` | `INSERT`, `UPDATE` | Updates milestone progress and active order lists |
| `admin-support-channel` | `public.support_messages` | `INSERT` | Appends real-time chat messages to active support threads |
| `client-notifications-:userId` | `public.notifications` | `INSERT` | Pushes real-time toast and in-app bell notification to specific user |

---

## 3. Lifecycle & Cleanup Verification
- **Mount**: Channel is created on React hook invocation (`useEffect` / `subscribeToTenantEvents`).
- **Unmount**: `supabase.removeChannel(channel)` is invoked in cleanup return function to prevent memory leaks and orphaned subscriptions.
- **Reconnect Handling**: Backed by auto-reconnect semantics in `@supabase/supabase-js`.
