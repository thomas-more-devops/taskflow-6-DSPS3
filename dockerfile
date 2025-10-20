# ---------- Stage 1: Builder ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application (if applicable)
# RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built app or source from builder
COPY --from=builder /app ./

# Create and switch to non-root user
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
USER nodeuser

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
