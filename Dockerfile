# Simplified single-stage RUN npm run buildild for TechPartner Platform
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code and public files
COPY . .

# Create public directory if it doesn't exist and copy SEO files
RUN mkdir -p public && \
    touch public/sitemap.xml && \
    touch public/sitemap.html && \
    touch public/robots.txt

# Build the application (run from root directory where vite.config.ts is located)
WORKDIR /app
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application with tsx
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
