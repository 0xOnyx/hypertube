# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Install OpenSSL and wget for SSL certificates generation and health checks
RUN apk add --no-cache openssl wget

# Copy the built application from the build stage (Angular 17+ structure)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Create SSL directory first
RUN mkdir -p /etc/nginx/ssl

# Copy SSL generation script from the ssl directory
COPY ssl/generate-ssl.sh /usr/local/bin/generate-ssl.sh

# Make the SSL script executable
RUN chmod +x /usr/local/bin/generate-ssl.sh

# Generate SSL certificates for hypertube.com
RUN /usr/local/bin/generate-ssl.sh

# Generate Diffie-Hellman parameters for enhanced security (2048 bits)
RUN openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx \
    && chown -R nginx:nginx /etc/nginx/ssl \
    && chmod 600 /etc/nginx/ssl/hypertube.key \
    && chmod 644 /etc/nginx/ssl/hypertube.crt \
    && chmod 644 /etc/nginx/ssl/dhparam.pem

# Expose ports 80 (HTTP), 443 (HTTPS), and 8080 (monitoring)
EXPOSE 80 443 8080

# Health check to verify nginx is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 