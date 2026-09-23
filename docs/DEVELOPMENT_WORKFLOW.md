# HENU OS CLM — DEVELOPMENT WORKFLOW & STANDARDS

**Document Version:** 1.0.0  
**Phase:** Phase 1 — Project Foundation & Master Architecture  
**Authoritative References:** [HENU_OS_CLM_FEATURE_TICKETS.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_FEATURE_TICKETS.md), [HENU_OS_CLM_FRONTEND_SPECIFICATION.md](file:///j:/CLM%20HENU%20A%26M/HENU_OS_CLM_FRONTEND_SPECIFICATION.md)

---

## 1. WORKFLOW OVERVIEW

The development lifecycle for **HENU OS CLM** follows a strict trunk-based git branching model with automated continuous integration checks.

```mermaid
graph LR
    FEATURE[feature/TICKET-ID-description] -->|Pull Request| PR_REVIEW[Code Review & Automated CI]
    PR_REVIEW -->|Squash & Merge| STAGING[staging branch]
    STAGING -->|Staging E2E & QA Signoff| MAIN[main branch (Production)]
```

---

## 2. BRANCHING & COMMIT CONVENTIONS

### Branch Naming Standard
- Features: `feature/TICKET-XXXX-brief-title` (e.g., `feature/TICKET-0902-admin-quotes-workbench`)
- Bug Fixes: `fix/TICKET-XXXX-issue-summary` (e.g., `fix/TICKET-1202-webhook-signature-padding`)
- Refactoring: `refactor/subsystem-name`
- Documentation: `docs/spec-update`

### Commit Message Format (Conventional Commits)
```text
<type>(<scope>): <short description>

[optional body describing technical context or ticket reference]

[optional footer with Closes #TICKET-XXXX]
```
- **Allowed Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- **Examples**:
  - `feat(quotes): implement margin calculation modal in admin workbench`
  - `fix(payments): add idempotency lock on gateway_payment_id webhook ingress`
  - `docs(api): update OpenAPI spec for recurring invoice creation`

---

## 3. LOCAL DEVELOPMENT PREREQUISITES & SETUP

### Required Tooling
1. **Node.js**: v20.12+ LTS
2. **Package Manager**: `pnpm` v9+
3. **Flutter SDK**: v3.22.x+ (Dart 3.4+)
4. **Docker Desktop**: v26+ (Required for local Supabase emulation)
5. **Supabase CLI**: v1.165+

### Initial Setup Procedure
```bash
# 1. Clone repository & checkout feature branch
git clone https://github.com/henu-os/henu-clm.git
cd henu-clm

# 2. Install workspace dependencies
pnpm install

# 3. Start local Supabase development containers
supabase start

# 4. Run database migrations and seed fixtures
supabase db reset

# 5. Start development servers concurrently
pnpm dev
```

---

## 4. CODE QUALITY & QUALITY GATES

Prior to committing or opening a pull request, the developer must ensure all quality gates pass:

```bash
# Run TypeScript compilation and ESLint across monorepo
pnpm lint
pnpm typecheck

# Run unit and integration tests
pnpm test

# Run Flutter analyzer and unit tests
cd apps/mobile && flutter analyze && flutter test
```

---

### WORKFLOW APPROVAL
- **Status:** Approved Standard for Phase 1.
