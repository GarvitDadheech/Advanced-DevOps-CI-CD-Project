# Stage 1: Build dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY src/ ./src/

# Stage 2: Runtime image
FROM node:18-alpine

WORKDIR /app

# Copy node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Set production environment
ENV NODE_ENV=production

# Use non-root user provided by Node image
USER node

# Expose app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the app
CMD ["node", "src/index.js"]
