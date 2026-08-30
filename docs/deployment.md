# Deployment Guide

## Overview

This guide covers deployment strategies for the SEO AI SaaS Platform across different environments: development, staging, and production.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd seo-saas-platform
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
DEBUG=True
LOG_LEVEL=DEBUG
EOF
```

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (if needed)
cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
EOF
```

#### 4. Run Services

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Docker Deployment

### Building Docker Images

#### Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: seo-backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DEBUG=${DEBUG:-False}
      - LOG_LEVEL=${LOG_LEVEL:-INFO}
    volumes:
      - ./backend:/app
    networks:
      - seo-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: seo-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
    networks:
      - seo-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  seo-network:
    driver: bridge

volumes:
  backend-data:
    driver: local
```

### Running with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Production Deployment

### Recommended Stack

- **Server:** AWS EC2, Azure VM, or DigitalOcean Droplet
- **Reverse Proxy:** Nginx
- **Process Manager:** PM2 or Supervisor
- **Database:** PostgreSQL (future)
- **Cache:** Redis (optional)
- **CDN:** CloudFront, Azure CDN

### Deployment Steps

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

#### 2. Clone Repository
```bash
cd /var/www
sudo git clone <repository-url> seo-saas-platform
cd seo-saas-platform
```

#### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create production .env
sudo nano .env
# Add:
# GEMINI_API_KEY=your_production_key
# DEBUG=False
# LOG_LEVEL=INFO

# Start with PM2
pm2 start "uvicorn app.main:app --host 127.0.0.1 --port 8000" --name "seo-backend"
pm2 startup
pm2 save
```

#### 4. Frontend Build & Deployment
```bash
cd ../frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Copy to Nginx directory
sudo cp -r dist/* /var/www/html/
```

#### 5. Nginx Configuration

Edit `/etc/nginx/sites-available/seo-saas`:
```nginx
upstream backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;
    
    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
        expires 24h;
        add_header Cache-Control "public, immutable";
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/seo-saas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Certificate (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
sudo certbot renew --dry-run  # Test renewal
```

#### 7. Firewall Configuration
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Environment Configuration

### Environment Variables

**Backend (.env)**
```env
# API
DEBUG=False
LOG_LEVEL=INFO

# AI Service
GEMINI_API_KEY=your_production_key

# Database (future)
DATABASE_URL=postgresql://user:password@localhost/seo_saas

# Cache (optional)
REDIS_URL=redis://localhost:6379

# Email (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Logging
LOG_FILE=/var/log/seo-saas/backend.log
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=SEO AI SaaS
VITE_DEBUG=false
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.11
    
    - name: Install dependencies
      run: |
        cd backend
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Lint with flake8
      run: |
        cd backend
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: 20
    
    - name: Install frontend deps
      run: |
        cd frontend
        npm ci
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/seo-saas-platform
          git pull origin main
          
          # Backend
          cd backend
          source venv/bin/activate
          pip install -r requirements.txt
          pm2 restart seo-backend
          
          # Frontend
          cd ../frontend
          npm ci
          npm run build
          sudo cp -r dist/* /var/www/html/
```

---

## Monitoring & Maintenance

### Log Monitoring
```bash
# Backend logs
sudo journalctl -u seo-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Check backend health
curl https://yourdomain.com/api/

# Check frontend
curl https://yourdomain.com/
```

### Performance Optimization

```bash
# Nginx cache warming
wget -r -p -E https://yourdomain.com

# Monitor resource usage
htop

# Disk usage
df -h

# Memory usage
free -h
```

### Backup Strategy

```bash
# Backup database (future)
pg_dump seo_saas > backup_$(date +%Y%m%d).sql

# Backup environment
cp .env .env.backup.$(date +%Y%m%d)

# Automated backup (crontab)
0 2 * * * pg_dump seo_saas | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Keep dependencies updated
- [ ] Use strong API keys
- [ ] Enable firewall
- [ ] Regular security audits
- [ ] Monitor failed login attempts
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular backups
- [ ] Monitor error logs
- [ ] Set up alerts for high traffic

---

## Troubleshooting

### Backend won't start
```bash
# Check port 8000 availability
lsof -i :8000

# Check Python version
python3 --version

# Check venv activation
source venv/bin/activate
```

### Frontend not loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log

# Clear browser cache (Ctrl+Shift+Delete)
```

### API connection issues
```bash
# Test API locally
curl http://127.0.0.1:8000/

# Check Nginx proxy
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### High CPU/Memory usage
```bash
# Check top processes
top -u www-data

# Check Node processes
pm2 monit

# Increase PM2 memory limit
pm2 start app.js --max-memory-restart 500M
```

---

## Scaling Strategies

### Horizontal Scaling
- Load balancer (HAProxy, AWS ELB)
- Multiple backend instances
- Sticky sessions for user state
- Shared cache layer (Redis)

### Vertical Scaling
- Upgrade server specs
- Optimize queries
- Add caching layer
- Use CDN for static assets

### Database Scaling
- Read replicas for reporting
- Connection pooling
- Query optimization
- Partitioning for large tables

---

## Post-Deployment

1. Verify all services running
2. Check health endpoints
3. Test API endpoints
4. Monitor logs for errors
5. Set up uptime monitoring
6. Configure backups
7. Document deployment process
8. Create runbooks for common issues

---

For more information, see [Architecture Documentation](architecture.md) and [API Documentation](api_docs.md).
