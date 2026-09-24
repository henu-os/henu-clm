# HENU OS CLM — PHASE 6: REAL ENVIRONMENT SETUP & DEPLOYMENT GUIDE

## 1. Environment Architecture

The platform supports 3 deployment environments:
1. **Development**: Local Next.js dev server (`http://localhost:3000`) and Flutter debug run with local Supabase CLI or cloud dev instance.
2. **Staging**: Docker containerized Next.js standalone and Flutter profile mode connected to staging Supabase project.
3. **Production**: Multi-stage Docker container (`wacrm`) behind reverse proxy / CDN and production release APK/IPA connected to production Supabase cluster.

---

## 2. Supabase Project Setup & Database Deployment

### Step 1: Link Supabase Project
```bash
# Set project URL and anon key in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tefgaqtrltpsccqzesmy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Apply Database Migrations & Seeds
Run in SQL Editor or Supabase CLI:
1. `database/migrations/20260924000001_clm_master_schema.sql` (Master schema, indexes, RLS, Realtime publication).
2. `database/seeds/20260924000002_dev_seed_data.sql` (Roles, demo customers, services, quotes, invoices, support threads).

### Step 3: Deploy Edge Functions
Deploy server-side functions using Supabase CLI:
```bash
supabase functions deploy razorpay-webhook
supabase functions deploy cashfree-webhook
supabase functions deploy create-payment-order
supabase functions deploy generate-invoice-pdf
supabase functions deploy notification-dispatcher
```

### Step 4: Configure Edge Function Secrets
```bash
supabase secrets set RAZORPAY_KEY_ID="rzp_test_..." RAZORPAY_KEY_SECRET="..." RAZORPAY_WEBHOOK_SECRET="..."
supabase secrets set CASHFREE_APP_ID="..." CASHFREE_SECRET_KEY="..." CASHFREE_WEBHOOK_SECRET="..."
supabase secrets set RESEND_API_KEY="..." TWILIO_AUTH_TOKEN="..."
```

---

## 3. Admin Web Setup & Execution

```bash
# 1. Install dependencies
pnpm install

# 2. Run local development server
pnpm --filter admin-web dev

# 3. Access in browser
http://localhost:3000
```

---

## 4. Flutter Client Mobile Setup

### Android Setup:
```bash
cd apps/client-mobile
flutter pub get

# Debug run on connected Android emulator / device:
flutter run -d android --dart-define=SUPABASE_URL=https://tefgaqtrltpsccqzesmy.supabase.co --dart-define=SUPABASE_ANON_KEY=eyJ...
```

### iOS Setup (macOS Requirement):
- **Requirement**: macOS with Xcode 15+ and CocoaPods.
- **Bundle ID**: `com.henuos.clm`
- **Signing**: Requires Apple Developer Team profile.
- **Note**: Development on Windows host OS cannot compile iOS native binaries directly; build via macOS CI runner or local Mac workstation.

---

## 5. Docker Container Deployment

```bash
# Build and run Docker container (project name: wacrm)
docker compose -p wacrm build
docker compose -p wacrm up -d

# Verify health status
docker compose -p wacrm ps
curl http://localhost:3000/api/health
```
