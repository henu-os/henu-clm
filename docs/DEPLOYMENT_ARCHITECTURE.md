# HENU OS CLM — DEPLOYMENT & CI/CD ARCHITECTURE

**Document Version:** 1.0.0  
**Phase:** Phase 1 — Project Foundation & Master Architecture  
**Authoritative References:** [HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_TECHNICAL_ARCHITECTURE.md)

---

## 1. CONTINUOUS INTEGRATION & DEPLOYMENT TOPOLOGY

The automated deployment pipeline coordinates frontend web deployment, serverless function releases, database schema migrations, and mobile binary packaging.

```mermaid
graph LR
    subgraph "Git Repository (GitHub)"
        BRANCH_MAIN[main branch]
        BRANCH_STAGING[staging branch]
    end

    subgraph "GitHub Actions Automation"
        JOB_LINT[Lint & Typecheck]
        JOB_TEST[Unit & RLS Tests]
        JOB_DB[Supabase DB Push]
        JOB_EDGE[Edge Functions Deploy]
        JOB_WEB[Next.js Build & Deploy]
        JOB_MOBILE[Flutter Fastlane / EAS]
    end

    subgraph "Target Hosting Infrastructure"
        VERCEL[Vercel / Cloudflare Pages<br/>(Admin Web Portal)]
        SUPA_PROD[Supabase Managed Cloud<br/>(DB + Storage + Functions)]
        STORES[Apple TestFlight & Google Play<br/>(Mobile App Release)]
    end

    BRANCH_MAIN --> JOB_LINT --> JOB_TEST
    JOB_TEST --> JOB_DB --> SUPA_PROD
    JOB_TEST --> JOB_EDGE --> SUPA_PROD
    JOB_TEST --> JOB_WEB --> VERCEL
    JOB_TEST --> JOB_MOBILE --> STORES
```

---

## 2. CI/CD WORKFLOW MATRIX

| Workflow File | Trigger Event | Tasks Executed | Deployment Target |
| :--- | :--- | :--- | :--- |
| `ci.yml` | Pull Request to `main` / `staging` | Linting, TypeScript checks, Vitest, Flutter test, pgTAP RLS tests. | Ephemeral CI Runner |
| `deploy-admin.yml` | Push to `main` (Production) | Next.js production bundle build, edge asset compression. | Vercel (`admin.henuos.com`) |
| `deploy-backend.yml`| Push to `main` (Production) | Executes `supabase db push` migrations, deploys Deno Edge Functions. | Supabase Production Cloud |
| `build-mobile.yml` | Git Tag (`v*.*.*`) | Flutter release compilation, code signing, IPA/AAB generation. | TestFlight & Google Play |

---

## 3. ZERO-DOWNTIME DATABASE MIGRATION STRATEGY

- **Backward Compatibility**: Migrations must always be backward-compatible with running client versions (e.g., add nullable columns or default values before making mandatory).
- **Automated Rollback Safeguard**: Pre-migration point-in-time recovery snapshot triggered prior to production migration push.

---

### DEPLOYMENT ARCHITECTURE APPROVAL
- **Status:** Approved for Phase 1 Master Architecture.
