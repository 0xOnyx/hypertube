#!/bin/sh

# Script to generate self-signed SSL certificates for hypertube.com
# Used for local development

echo "Generating SSL certificates for hypertube.com..."

# Verify we have the necessary tools
if ! command -v openssl >/dev/null 2>&1; then
    echo "Error: openssl is not installed"
    exit 1
fi

# Create ssl directory if it doesn't exist
mkdir -p /etc/nginx/ssl

# Generate private key
echo "Generating private key..."
openssl genrsa -out /etc/nginx/ssl/hypertube.key 2048

# Create certificate with Subject Alternative Names for multiple domains
echo "Creating certificate configuration..."
cat > /tmp/hypertube.conf << 'EOF'
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = CA
L = SF
O = Hypertube
CN = hypertube.com

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = hypertube.com
DNS.2 = www.hypertube.com
DNS.3 = localhost
DNS.4 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate certificate with SAN
echo "Generating certificate..."
openssl req -new -x509 -key /etc/nginx/ssl/hypertube.key -out /etc/nginx/ssl/hypertube.crt -days 365 -config /tmp/hypertube.conf -extensions v3_req

# Verify files were created
if [ ! -f /etc/nginx/ssl/hypertube.key ] || [ ! -f /etc/nginx/ssl/hypertube.crt ]; then
    echo "Error: SSL certificate files were not created"
    exit 1
fi

# Set appropriate permissions
chmod 600 /etc/nginx/ssl/hypertube.key
chmod 644 /etc/nginx/ssl/hypertube.crt

# Clean up
rm /tmp/hypertube.conf

echo "SSL certificates generated successfully:"
echo "  - Private key: /etc/nginx/ssl/hypertube.key"
echo "  - Certificate: /etc/nginx/ssl/hypertube.crt"
echo "  - Validity: 365 days"
echo ""
echo "To trust the certificate on your system:"
echo "  - Chrome/Edge: Import certificate into 'Trusted Root Certification Authorities'"
echo "  - Firefox: Settings > Certificates > Import"
echo "  - Linux: sudo cp /etc/nginx/ssl/hypertube.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates"
echo ""
echo "Also add '127.0.0.1 hypertube.com' to your /etc/hosts file" 