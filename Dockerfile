# ===========================
# Stage 1: Builder
# ===========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy only the necessary source code
COPY src ./src

# ===========================
# Stage 2: Runner
# ===========================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built app and production node_modules from builder
COPY --from=builder /app /app

# Create and use a non-root user
RUN addgroup -g 1001 nodejs \
    && adduser -S -u 1001 nodeuser -G nodejs \
    && chown -R nodeuser:nodejs /app

USER nodeuser

ENV NODE_ENV=production
EXPOSE 3000

# Container-level health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
