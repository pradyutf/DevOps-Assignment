# ============================================
# STAGE 1: Builder
# Purpose: Install dependencies and compile TypeScript
# ============================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
# Docker caches layers - if package.json hasn't changed,
# npm install is skipped on rebuild (faster builds!)
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
# We need TypeScript, ts-jest, etc. to build
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# ============================================
# STAGE 2: Production
# Purpose: Run the compiled application
# ============================================
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
# --omit=dev skips devDependencies (TypeScript, Jest, etc.)
RUN npm ci --omit=dev

# Copy compiled JavaScript from builder stage
# We DON'T copy TypeScript source - not needed at runtime
COPY --from=builder /app/dist ./dist

# Create non-root user for security
# Running as root in containers is a security risk
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Switch to non-root user
USER nodejs

# Expose port (documentation - doesn't actually publish)
EXPOSE 3001

# Health check - Kubernetes/Docker can verify container health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
