# Stage 1: Build the Vite client
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Setup server and production container
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy server application code
COPY server/ ./

# Copy compiled client assets for static serving
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose server port
EXPOSE 8080

# Health check probe against observability endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start production server
CMD ["node", "index.js"]
