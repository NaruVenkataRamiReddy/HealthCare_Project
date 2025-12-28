# Deployment Guide - Hostinger & AWS EC2

Complete deployment guide for deploying your Healthcare Backend to Hostinger VPS or AWS EC2.

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Hostinger VPS Deployment](#2-hostinger-vps-deployment)
3. [AWS EC2 Deployment](#3-aws-ec2-deployment)
4. [MySQL Database Setup](#4-mysql-database-setup)
5. [SSL Certificate Setup](#5-ssl-certificate-setup)
6. [Nginx Configuration](#6-nginx-configuration)
7. [PM2 Process Manager](#7-pm2-process-manager)
8. [Environment Configuration](#8-environment-configuration)
9. [Security Hardening](#9-security-hardening)
10. [Monitoring & Maintenance](#10-monitoring--maintenance)

---

## 1. Pre-Deployment Checklist

### ✅ Code Preparation

- [ ] All environment variables configured
- [ ] Database schema created
- [ ] API endpoints tested locally
- [ ] Razorpay integration tested
- [ ] File uploads working
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] CORS settings updated
- [ ] Production dependencies installed
- [ ] Git repository up to date

### ✅ Server Requirements

- **OS**: Ubuntu 20.04 or 22.04 LTS
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB
- **Node.js**: Version 16.x or higher
- **MySQL**: Version 8.0 or higher
- **Domain**: Registered domain with DNS access

---

## 2. Hostinger VPS Deployment

### Step 1: Purchase Hostinger VPS

1. Go to [Hostinger VPS](https://www.hostinger.com/vps-hosting)
2. Choose a plan (KVM 2 or higher recommended)
3. Select Ubuntu 20.04 or 22.04
4. Complete purchase and get SSH credentials

### Step 2: Initial Server Setup

```bash
# Connect to your VPS
ssh root@your-server-ip

# Update system packages
apt update && apt upgrade -y

# Create a new user (don't use root)
adduser healthcare
usermod -aG sudo healthcare

# Switch to new user
su - healthcare
```

### Step 3: Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 4: Install MySQL

```bash
# Install MySQL
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation

# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE healthcare_db;
CREATE USER 'healthcare_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON healthcare_db.* TO 'healthcare_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Clone Your Repository

```bash
# Install Git
sudo apt install git -y

# Clone your repository
cd /home/healthcare
git clone https://github.com/yourusername/healthcare-backend.git
cd healthcare-backend

# Install dependencies
npm install --production
```

### Step 6: Configure Environment

```bash
# Create .env file
nano .env
```

```env
NODE_ENV=production
PORT=5000
API_URL=https://api.yourdomain.com

FRONTEND_URL=https://yourdomain.com

DB_HOST=localhost
DB_USER=healthcare_user
DB_PASSWORD=strong_password_here
DB_NAME=healthcare_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_production
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Step 7: Import Database Schema

```bash
# Upload your SQL schema file
scp DATABASE_SCHEMA.sql healthcare@your-server-ip:/home/healthcare/

# Import schema
mysql -u healthcare_user -p healthcare_db < /home/healthcare/DATABASE_SCHEMA.sql
```

### Step 8: Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your application
pm2 start server.js --name healthcare-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

### Step 9: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/healthcare-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase file upload size
    client_max_body_size 10M;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/healthcare-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 10: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Step 11: Configure Firewall

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## 3. AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
2. **Navigate to EC2**
3. **Click "Launch Instance"**
4. **Configure Instance**:
   - Name: healthcare-backend
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t2.medium or t3.medium
   - Key pair: Create new or use existing
   - Security group: Create with ports 22, 80, 443, 3306 (MySQL)
   - Storage: 20GB or more
5. **Launch Instance**

### Step 2: Configure Security Group

**Inbound Rules:**

| Type  | Protocol | Port Range | Source      | Description       |
|-------|----------|------------|-------------|-------------------|
| SSH   | TCP      | 22         | My IP       | SSH access        |
| HTTP  | TCP      | 80         | 0.0.0.0/0   | HTTP traffic      |
| HTTPS | TCP      | 443        | 0.0.0.0/0   | HTTPS traffic     |
| MySQL | TCP      | 3306       | VPC CIDR    | Database (if RDS) |

### Step 3: Connect to EC2 Instance

```bash
# Change key permissions
chmod 400 your-key.pem

# Connect via SSH
ssh -i "your-key.pem" ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com
```

### Step 4: Follow Hostinger Steps 2-11

The rest of the deployment process is identical to Hostinger (Steps 2-11).

### Step 5: Configure Elastic IP (Optional)

1. **Allocate Elastic IP** in EC2 Console
2. **Associate with your instance**
3. **Update DNS records** to point to Elastic IP

### Step 6: Use RDS for MySQL (Recommended)

**Create RDS Instance:**

1. **Go to RDS** in AWS Console
2. **Create database**:
   - Engine: MySQL 8.0
   - Template: Production
   - DB instance: db.t3.micro or larger
   - Storage: 20GB
   - VPC: Same as EC2
   - Security group: Allow MySQL from EC2 security group
3. **Update .env** with RDS endpoint:

```env
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_rds_password
DB_NAME=healthcare_db
DB_PORT=3306
```

---

## 4. MySQL Database Setup

### Create Database Schema

```bash
# Connect to MySQL
mysql -u healthcare_user -p

# Run your schema file
source /path/to/DATABASE_SCHEMA.sql

# Verify tables
USE healthcare_db;
SHOW TABLES;
```

### Import Sample Data (Optional)

```sql
-- Insert sample data for testing
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('admin@healthcare.com', '$2b$10$hashedpassword', 'admin', TRUE);
```

### Database Backup Script

```bash
# Create backup script
nano /home/healthcare/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/healthcare/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u healthcare_user -p'your_password' healthcare_db > $BACKUP_DIR/backup_$DATE.sql

# Delete backups older than 7 days
find $BACKUP_DIR -name "backup_*.sql" -type f -mtime +7 -delete
```

```bash
# Make executable
chmod +x /home/healthcare/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/healthcare/backup-db.sh
```

---

## 5. SSL Certificate Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Certificate will auto-renew
# Test renewal
sudo certbot renew --dry-run
```

### Manual SSL Certificate

If you have a purchased SSL certificate:

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/ssl/certs/your_certificate.crt;
    ssl_certificate_key /etc/ssl/private/your_private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rest of configuration...
}
```

---

## 6. Nginx Configuration

### Complete Production Nginx Config

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

# Upstream
upstream healthcare_api {
    server localhost:5000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # File upload size
    client_max_body_size 10M;

    # API Routes with rate limiting
    location /api/auth {
        limit_req zone=auth_limit burst=5 nodelay;
        proxy_pass http://healthcare_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://healthcare_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (uploads)
    location /uploads {
        alias /home/healthcare/healthcare-backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logging
    access_log /var/log/nginx/healthcare-api-access.log;
    error_log /var/log/nginx/healthcare-api-error.log;
}
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. PM2 Process Manager

### PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'healthcare-api',
    script: './server.js',
    instances: 2, // Use 2 instances for load balancing
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
```

### PM2 Commands

```bash
# Start with ecosystem file
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs healthcare-api

# Restart
pm2 restart healthcare-api

# Reload (zero-downtime)
pm2 reload healthcare-api

# Stop
pm2 stop healthcare-api

# Delete
pm2 delete healthcare-api

# List all processes
pm2 list

# Save current processes
pm2 save

# Startup script
pm2 startup
```

---

## 8. Environment Configuration

### Production .env Template

```env
# Server
NODE_ENV=production
PORT=5000
API_URL=https://api.yourdomain.com

# Frontend
FRONTEND_URL=https://yourdomain.com

# Database
DB_HOST=localhost
DB_USER=healthcare_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=healthcare_db
DB_PORT=3306

# JWT
JWT_SECRET=GENERATE_RANDOM_64_CHAR_STRING
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=GENERATE_ANOTHER_RANDOM_STRING
JWT_REFRESH_EXPIRE=30d

# Razorpay (LIVE)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Healthcare App <noreply@yourdomain.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Generate Secure Secrets

```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 9. Security Hardening

### 1. Fail2Ban (Prevent brute force)

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure
sudo nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
maxretry = 5
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban
```

### 2. Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart sshd
```

### 3. Enable Automatic Security Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 4. MySQL Security

```bash
# Disable remote root access
mysql -u root -p
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
FLUSH PRIVILEGES;
```

### 5. File Permissions

```bash
# Set proper permissions
chmod 700 /home/healthcare/healthcare-backend/.env
chmod 755 /home/healthcare/healthcare-backend/uploads
```

---

## 10. Monitoring & Maintenance

### Setup Monitoring with PM2 Plus (Optional)

```bash
# Link to PM2 Plus
pm2 link YOUR_PM2_PLUS_PUBLIC_KEY YOUR_PM2_PLUS_SECRET_KEY
```

### Log Rotation

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/healthcare-api
```

```
/home/healthcare/healthcare-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 healthcare healthcare
    sharedscripts
}
```

### Server Monitoring Script

Create `/home/healthcare/monitor.sh`:

```bash
#!/bin/bash

# Check if API is running
if ! curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "API is down! Restarting..."
    pm2 restart healthcare-api
    
    # Send alert email (if configured)
    echo "API was down and restarted at $(date)" | mail -s "Healthcare API Alert" admin@yourdomain.com
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is at ${DISK_USAGE}%!" | mail -s "Disk Space Alert" admin@yourdomain.com
fi
```

```bash
chmod +x /home/healthcare/monitor.sh

# Add to crontab (every 5 minutes)
*/5 * * * * /home/healthcare/monitor.sh
```

### Useful Commands

```bash
# Check API status
curl http://localhost:5000/api/health

# View Nginx logs
sudo tail -f /var/log/nginx/healthcare-api-access.log
sudo tail -f /var/log/nginx/healthcare-api-error.log

# View PM2 logs
pm2 logs healthcare-api

# Check server resources
htop
df -h
free -m

# Check MySQL status
sudo systemctl status mysql
mysqladmin -u root -p status

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Reload Nginx without downtime
sudo nginx -s reload
```

---

## Deployment Checklist

### Pre-Launch

- [ ] Database schema imported
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] PM2 running and saved
- [ ] Nginx configured and tested
- [ ] File uploads directory created
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] DNS records updated

### Post-Launch

- [ ] Test all API endpoints
- [ ] Test payment flow with Razorpay
- [ ] Test file uploads
- [ ] Verify SSL certificate
- [ ] Check logs for errors
- [ ] Test from multiple devices
- [ ] Monitor server resources
- [ ] Setup alerts
- [ ] Document credentials securely

---

## Troubleshooting

### Issue: API not responding

```bash
# Check if Node.js is running
pm2 status

# Check logs
pm2 logs healthcare-api

# Restart
pm2 restart healthcare-api
```

### Issue: Database connection failed

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u healthcare_user -p healthcare_db

# Check .env credentials
```

### Issue: SSL certificate error

```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates
```

### Issue: High memory usage

```bash
# Check memory
free -m

# Restart PM2
pm2 restart all

# Add swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Support & Resources

- **Node.js Documentation**: https://nodejs.org/docs/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **AWS EC2**: https://docs.aws.amazon.com/ec2/
- **Hostinger**: https://www.hostinger.com/tutorials/

---

## Maintenance Schedule

**Daily:**
- Monitor logs
- Check API health
- Review error reports

**Weekly:**
- Review server resources
- Check security logs
- Test backups

**Monthly:**
- Update dependencies
- Security patches
- Performance optimization
- Backup verification

**Quarterly:**
- Security audit
- Performance review
- Cost optimization
- Disaster recovery test
