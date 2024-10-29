# web/Dockerfile
FROM node:21-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc6-compat \
    py3-pip \
    build-base \
    linux-headers

# Enable corepack for better yarn/pnpm support
RUN corepack enable

# Set Python path
ENV PYTHON=/usr/bin/python3

# Copy package files
COPY package*.json ./
COPY ../shared ../shared

# Install dependencies with cache optimization
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:21-alpine AS runner

WORKDIR /app

# Install production dependencies
RUN apk add --no-cache \
    libc6-compat \
    curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Set proper permissions
RUN mkdir .next \
    && chown nextjs:nodejs .next

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json


# Use non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]