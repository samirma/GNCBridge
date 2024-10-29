FROM node:22-alpine

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
COPY web/package*.json ./
COPY shared/ ../shared/
COPY web/ ./

# Install dependencies with cache optimization
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

# Build the application
RUN npm run build

CMD ["npm", "start"]
