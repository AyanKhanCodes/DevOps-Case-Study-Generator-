# ─── Stage 1: Dependencies ─────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# ─── Stage 2: Build ────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set a build-time DATABASE_URL so Prisma can resolve the datasource
ENV DATABASE_URL="file:./dev.db"

# Create & seed the database, then build Next.js
RUN npx prisma migrate dev --name init --skip-generate 2>/dev/null || npx prisma db push --skip-generate
RUN node prisma/seed.js
RUN npm run build

# ─── Stage 3: Production runner ───────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATABASE_URL="file:./prisma/dev.db"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Ensure the SQLite database directory is writable
RUN chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
