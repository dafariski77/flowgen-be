# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

# ============================================
# Stage 3: Production image
# ============================================
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

# Security: run as non-root user
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

WORKDIR /app

# Copy only production dependencies and built output
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R nestjs:nestjs /app

USER nestjs

# Default port — can be overridden via env
ENV PORT=3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/docs || exit 1

CMD ["node", "dist/src/main.js"]
