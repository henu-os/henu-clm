# HENU OS CLM — ENVIRONMENT & CONFIGURATION SPECIFICATION

**Document Version:** 1.0.0  
**Phase:** Phase 1 — Project Foundation & Master Architecture  
**Authoritative References:** [HENU_OS_CLM_SECURITY_ACCESS.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_SECURITY_ACCESS.md), [HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md)

---

## 1. ENVIRONMENT ISOLATION TIERS

HENU OS CLM operates across three strictly partitioned environments:

| Attribute | Development (`dev`) | Staging (`staging`) | Production (`prod`) |
| :--- | :--- | :--- | :--- |
| **Backend Host** | Local Docker (`127.0.0.1:54321`) | Supabase Staging Project | Supabase Production High-Availability Cluster |
| **Admin Web Host** | `http://localhost:3000` | `https://staging-admin.henuos.com` | `https://admin.henuos.com` |
| **Mobile API URL** | `http://10.0.2.2:54321` (Android Emul) | `https://staging-api.henuos.com` | `https://api.henuos.com` |
| **Razorpay Mode** | Test Mode (`rzp_test_...`) | Test Mode (`rzp_test_...`) | Live Mode (`rzp_live_...`) |
| **Cashfree Mode** | Sandbox (`TEST...`) | Sandbox (`TEST...`) | Production (`PROD...`) |
| **Push Notifications** | Mock / Firebase Sandbox | Firebase Staging Project | Firebase Production Project (APNs Live) |
| **CORS Whitelist** | `*` | `https://staging-admin.henuos.com` | `https://admin.henuos.com` |

---

## 2. CONFIGURATION & SECRET ISOLATION MATRIX

```mermaid
graph TD
    subgraph "Public Client Configurations (Bundled into App)"
        PUB1[NEXT_PUBLIC_SUPABASE_URL]
        PUB2[NEXT_PUBLIC_SUPABASE_ANON_KEY]
        PUB3[FLUTTER_SUPABASE_URL]
        PUB4[FLUTTER_SUPABASE_ANON_KEY]
    end

    subgraph "Protected Server Secrets (Supabase Vault & Edge Functions Only)"
        SEC1[SUPABASE_SERVICE_ROLE_KEY<br/>*NEVER on Web/Mobile*]
        SEC2[RAZORPAY_KEY_SECRET<br/>*NEVER on Web/Mobile*]
        SEC3[CASHFREE_SECRET_KEY<br/>*NEVER on Web/Mobile*]
        SEC4[FIREBASE_SERVICE_ACCOUNT_JSON<br/>*NEVER on Web/Mobile*]
        SEC5[RESEND_API_KEY<br/>*NEVER on Web/Mobile*]
    end

    PUB1 & PUB2 --> ADMIN_BUNDLE[Next.js Client Bundle]
    PUB3 & PUB4 --> FLUTTER_BUNDLE[Flutter Binary Build]
    
    SEC1 & SEC2 & SEC3 & SEC4 & SEC5 --> EDGE_RUNTIME[Supabase Edge Runtime<br/>(Deno Isolation)]
```

---

## 3. SANITIZED `.env.example` TEMPLATE

```ini
# ==============================================================================
# HENU OS CLM — ENVIRONMENT CONFIGURATION TEMPLATE
# Copy to .env.local (Admin Web), apps/mobile/.env, or backend/.env
# ==============================================================================

# --- SUPABASE INFRASTRUCTURE (PUBLIC) ---
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# --- SUPABASE INFRASTRUCTURE (PROTECTED SERVER/EDGE ONLY) ---
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# --- PAYMENT GATEWAYS (PROTECTED EDGE ONLY) ---
RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXXXX"
RAZORPAY_KEY_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX"
RAZORPAY_WEBHOOK_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX"

CASHFREE_APP_ID="TESTXXXXXXXXXXXXXX"
CASHFREE_SECRET_KEY="cfsk_ma_test_XXXXXXXXXXXXXXXXXXXXXXXX"
CASHFREE_WEBHOOK_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX"

# --- NOTIFICATIONS & COMMUNICATIONS (PROTECTED EDGE ONLY) ---
FIREBASE_PROJECT_ID="henu-os-clm-dev"
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
RESEND_API_KEY="re_XXXXXXXXXXXXXXXXXXXXXXXX"
TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
TWILIO_AUTH_TOKEN="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# --- TELEMETRY & OBSERVABILITY ---
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""
LOG_LEVEL="debug"
```

---

### CONFIGURATION APPROVAL
- **Status:** Approved for Phase 1 Master Architecture.
