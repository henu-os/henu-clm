FROM node:20-alpine AS deps

WORKDIR /app

RUN npm install -g pnpm@10.15.0

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/admin-web/package.json ./apps/admin-web/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN pnpm install --frozen-lockfile


FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.15.0

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin-web/node_modules ./apps/admin-web/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_LOCALE
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_APP_VERSION

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_LOCALE=$NEXT_PUBLIC_APP_LOCALE
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter admin-web build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/apps/admin-web/public ./apps/admin-web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-web/.next/static ./apps/admin-web/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/admin-web/server.js"]
