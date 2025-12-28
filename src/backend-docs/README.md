# Healthcare Application - Backend Documentation

Complete backend implementation guide for a comprehensive Healthcare Web Application with ReactJS frontend, Node/Express backend, MySQL database, and Razorpay payment integration.

---

## 📋 Overview

This backend system powers a multi-role healthcare platform serving:
- **Patients**: Book appointments, order medicines, request diagnostic tests
- **Doctors**: Manage appointments, create prescriptions, track earnings
- **Diagnostic Centers**: Manage tests, bookings, upload reports
- **Medical Shops**: Manage inventory, process medicine orders

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │ HTTPS/REST API
         ▼
┌─────────────────┐
│ Express Backend │──────► Razorpay Payment Gateway
└────────┬────────┘
         │
         ├──► MySQL Database
         ├──► File Storage (Local/S3)
         └──► Email Service (Optional)
```

---

## 📚 Documentation Structure

This documentation package includes:

### 1. **API_DOCUMENTATION.md**
Complete API specification with all endpoints:
- Authentication (Register, Login, JWT)
- Patient APIs (Appointments, Prescriptions, Orders)
- Doctor APIs (Appointments, Prescriptions, Earnings)
- Diagnostic Center APIs (Tests, Bookings, Reports)
- Medical Shop APIs (Inventory, Orders)
- Payment APIs (Razorpay Integration)
- File Upload APIs

### 2. **DATABASE_SCHEMA.md**
Complete MySQL database design:
- 22 tables with relationships
- Indexes for performance
- Sample data
- Backup scripts
- Maintenance queries

### 3. **BACKEND_IMPLEMENTATION_GUIDE.md**
Step-by-step backend development:
- Project setup
- Folder structure
- Authentication system (JWT, bcrypt)
- Middleware (Auth, Validation, Error Handling)
- Controllers and Routes
- Best practices

### 4. **RAZORPAY_INTEGRATION.md**
Complete payment integration:
- Razorpay setup
- Payment flow (Orders API + Checkout)
- Webhook implementation
- Signature verification
- Refund handling
- Testing guide

### 5. **FILE_UPLOAD_GUIDE.md**
File upload implementation with Multer:
- Profile pictures
- License certificates
- Prescriptions
- Test reports
- Image optimization (Sharp)
- Security & validation

### 6. **DEPLOYMENT_GUIDE.md**
Production deployment:
- Hostinger VPS setup
- AWS EC2 setup
- MySQL configuration
- SSL certificates (Let's Encrypt)
- Nginx reverse proxy
- PM2 process manager
- Security hardening
- Monitoring

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- MySQL 8.0 or higher
- npm or yarn
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/healthcare-backend.git
cd healthcare-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your configuration

# 4. Create database
mysql -u root -p
CREATE DATABASE healthcare_db;

# 5. Import schema
mysql -u root -p healthcare_db < DATABASE_SCHEMA.sql

# 6. Start development server
npm run dev
```

---

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Payment**: Razorpay SDK
- **Validation**: express-validator

### DevOps
- **Process Manager**: PM2
- **Web Server**: Nginx
- **SSL**: Let's Encrypt
- **Monitoring**: PM2 Plus (optional)

---

## 📁 Project Structure

```
healthcare-backend/
│
├── config/
│   ├── database.js          # MySQL connection
│   ├── razorpay.js          # Razorpay configuration
│   └── multer.js            # File upload config
│
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── roleCheck.js         # Role-based access
│   ├── errorHandler.js      # Global error handler
│   ├── validator.js         # Input validation
│   └── rateLimiter.js       # Rate limiting
│
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   ├── patient.routes.js    # Patient endpoints
│   ├── doctor.routes.js     # Doctor endpoints
│   ├── diagnostic.routes.js # Diagnostic endpoints
│   ├── medicalShop.routes.js# Medical shop endpoints
│   ├── payment.routes.js    # Payment endpoints
│   └── upload.routes.js     # File upload endpoints
│
├── controllers/
│   ├── auth.controller.js
│   ├── patient.controller.js
│   ├── doctor.controller.js
│   ├── diagnostic.controller.js
│   ├── medicalShop.controller.js
│   ├── payment.controller.js
│   └── upload.controller.js
│
├── utils/
│   ├── responseHandler.js   # API response formatting
│   ├── emailService.js      # Email notifications
│   └── helpers.js           # Helper functions
│
├── uploads/                 # File storage
│   ├── profiles/
│   ├── licenses/
│   ├── prescriptions/
│   └── reports/
│
├── .env                     # Environment variables
├── .gitignore
├── server.js                # Entry point
├── ecosystem.config.js      # PM2 configuration
└── package.json
```

---

## 🔐 Environment Variables

Required environment variables:

```env
# Server
NODE_ENV=development|production
PORT=5000
API_URL=http://localhost:5000

# Frontend
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=healthcare_user
DB_PASSWORD=your_password
DB_NAME=healthcare_db
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

See `.env.example` for complete configuration.

---

## 🔌 API Endpoints Overview

### Authentication
```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login
GET    /api/auth/me              # Get current user
PUT    /api/auth/change-password # Change password
```

### Patients
```
GET    /api/patients/profile
PUT    /api/patients/profile
GET    /api/patients/doctors
POST   /api/patients/appointments/book
GET    /api/patients/appointments
GET    /api/patients/prescriptions
POST   /api/patients/diagnostic-tests/book
POST   /api/patients/medicine-orders
```

### Doctors
```
GET    /api/doctors/profile
PUT    /api/doctors/profile
POST   /api/doctors/availability
GET    /api/doctors/appointments
POST   /api/doctors/prescriptions
GET    /api/doctors/earnings
```

### Diagnostic Centers
```
GET    /api/diagnostic-centers/profile
POST   /api/diagnostic-centers/tests
GET    /api/diagnostic-centers/bookings
POST   /api/diagnostic-centers/bookings/:id/report
```

### Medical Shops
```
GET    /api/medical-shops/profile
POST   /api/medical-shops/medicines
GET    /api/medical-shops/orders
PUT    /api/medical-shops/orders/:id/status
```

### Payments
```
POST   /api/payments/create-order
POST   /api/payments/verify
POST   /api/payments/webhook
GET    /api/payments/history
POST   /api/payments/retry/:id
```

### File Uploads
```
POST   /api/uploads/profile-picture
POST   /api/uploads/license
POST   /api/uploads/prescription
POST   /api/uploads/test-report
```

Complete API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 💳 Payment Flow

### Razorpay Integration

1. **User initiates payment** (book appointment/order)
2. **Backend creates Razorpay order** with amount
3. **Frontend displays Razorpay Checkout**
4. **User completes payment** (Card/UPI/NetBanking/Wallet)
5. **Razorpay sends webhook** to backend
6. **Backend verifies signature** and updates status
7. **User receives confirmation**

**Supported Payment Methods:**
- Credit/Debit Cards
- UPI (Google Pay, PhonePe, Paytm)
- Net Banking
- Wallets (Paytm, Mobikwik, etc.)

**Currency:** Indian Rupees (₹)

Complete guide: [RAZORPAY_INTEGRATION.md](./RAZORPAY_INTEGRATION.md)

---

## 🗄️ Database Schema

### Core Tables

- **users** - Authentication and user accounts
- **patients** - Patient profiles
- **doctors** - Doctor profiles and credentials
- **diagnostic_centers** - Diagnostic center details
- **medical_shops** - Medical shop information
- **appointments** - Doctor appointments
- **prescriptions** - Medical prescriptions
- **diagnostic_bookings** - Diagnostic test bookings
- **medicine_orders** - Medicine orders
- **payments** - Payment records
- **reviews** - Ratings and reviews

**Total: 22 tables** with complete relationships and indexes.

Database design: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## 🔒 Security Features

### Implemented Security

✅ **JWT Authentication** - Secure token-based auth  
✅ **bcrypt Password Hashing** - Industry-standard encryption  
✅ **Rate Limiting** - Prevent abuse and DDoS  
✅ **Input Validation** - Prevent SQL injection  
✅ **CORS Configuration** - Cross-origin security  
✅ **Helmet.js** - Security headers  
✅ **File Type Validation** - Prevent malicious uploads  
✅ **Razorpay Signature Verification** - Payment security  
✅ **HTTPS/SSL** - Encrypted communication  
✅ **Role-Based Access Control** - Authorization  

### Best Practices

- Never store plain text passwords
- Always use prepared statements
- Validate all user inputs
- Sanitize file uploads
- Use environment variables
- Enable HTTPS in production
- Regular security audits
- Keep dependencies updated

---

## 📦 Deployment

### Supported Platforms

- ✅ **Hostinger VPS** (Ubuntu 20.04/22.04)
- ✅ **AWS EC2** (Ubuntu 20.04/22.04)
- ✅ **DigitalOcean Droplets**
- ✅ **Google Cloud Compute Engine**
- ✅ **Azure Virtual Machines**

### Deployment Stack

- **OS**: Ubuntu 20.04 LTS or 22.04 LTS
- **Web Server**: Nginx (reverse proxy)
- **Process Manager**: PM2
- **Database**: MySQL 8.0
- **SSL**: Let's Encrypt (free)

### Quick Deployment

```bash
# 1. Setup server (Ubuntu)
ssh user@your-server

# 2. Install Node.js, MySQL, Nginx
apt update && apt upgrade -y
# ... (see DEPLOYMENT_GUIDE.md)

# 3. Clone and configure
git clone your-repo
npm install --production

# 4. Start with PM2
pm2 start server.js --name healthcare-api
pm2 save
pm2 startup

# 5. Configure Nginx
# ... (see DEPLOYMENT_GUIDE.md)

# 6. Setup SSL
certbot --nginx -d api.yourdomain.com
```

Complete deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🧪 Testing

### Test with Postman

1. Import API collection
2. Set environment variables (base URL, token)
3. Test each endpoint
4. Verify responses

### Test Payment Flow

**Test Mode Credentials:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- UPI: `success@razorpay`

### Manual Testing Checklist

- [ ] User registration and login
- [ ] JWT token generation
- [ ] Protected route access
- [ ] Appointment booking
- [ ] Payment processing
- [ ] Prescription creation
- [ ] File uploads
- [ ] Webhook handling

---

## 📊 Monitoring & Maintenance

### Health Check

```bash
# API health endpoint
curl http://localhost:5000/api/health
```

### Logs

```bash
# PM2 logs
pm2 logs healthcare-api

# Nginx logs
tail -f /var/log/nginx/healthcare-api-access.log
tail -f /var/log/nginx/healthcare-api-error.log
```

### Database Backup

```bash
# Daily backup (cron)
mysqldump -u user -p healthcare_db > backup_$(date +%Y%m%d).sql
```

### Performance Monitoring

- **PM2 Plus**: Real-time monitoring
- **Node.js Profiling**: Memory and CPU
- **MySQL Slow Query Log**: Database optimization
- **Nginx Access Logs**: Request analysis

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Port already in use**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**Issue: Database connection failed**
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u healthcare_user -p healthcare_db
```

**Issue: PM2 not starting**
```bash
# Check logs
pm2 logs healthcare-api

# Delete and restart
pm2 delete healthcare-api
pm2 start server.js --name healthcare-api
```

**Issue: Nginx 502 Bad Gateway**
```bash
# Check if Node.js is running
pm2 status

# Check Nginx config
sudo nginx -t

# Restart services
pm2 restart healthcare-api
sudo systemctl restart nginx
```

---

## 📝 Development Workflow

### 1. Local Development

```bash
# Start development server
npm run dev

# Watch for changes (nodemon)
nodemon server.js
```

### 2. Code Changes

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to repository
git push origin feature/new-feature
```

### 3. Testing

```bash
# Run tests (if configured)
npm test

# Test API endpoints manually
```

### 4. Deployment

```bash
# Pull latest code on server
git pull origin main

# Install dependencies
npm install --production

# Restart PM2
pm2 restart healthcare-api
```

---

## 🤝 Contributing

### Guidelines

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write meaningful commits
5. Test thoroughly
6. Submit pull request

### Code Style

- Use ES6+ syntax
- Follow ESLint rules
- Add comments for complex logic
- Use meaningful variable names
- Keep functions small and focused

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

### Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Implementation Guide](./BACKEND_IMPLEMENTATION_GUIDE.md)
- [Razorpay Integration](./RAZORPAY_INTEGRATION.md)
- [File Upload Guide](./FILE_UPLOAD_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

### Resources

- **Node.js**: https://nodejs.org/docs/
- **Express.js**: https://expressjs.com/
- **MySQL**: https://dev.mysql.com/doc/
- **Razorpay**: https://razorpay.com/docs/
- **JWT**: https://jwt.io/introduction

### Contact

For questions or support:
- Email: support@healthcare.com
- Documentation: https://docs.healthcare.com
- GitHub Issues: https://github.com/yourusername/healthcare-backend/issues

---

## 🎯 Roadmap

### Version 2.0 (Planned)

- [ ] WebSocket for real-time updates
- [ ] Video consultation integration
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] AI-powered recommendations
- [ ] Mobile app backend
- [ ] Telemedicine features

---

## ✅ Production Checklist

### Before Going Live

- [ ] Environment variables configured
- [ ] Database properly indexed
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Backups automated
- [ ] Monitoring setup
- [ ] Error logging enabled
- [ ] Rate limiting active
- [ ] Payment testing completed
- [ ] Security audit done
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] DNS configured
- [ ] Email service setup
- [ ] Support system ready

---

## 🌟 Features

### Core Features

✅ Multi-role authentication system  
✅ Doctor appointment booking  
✅ Digital prescription management  
✅ Diagnostic test booking  
✅ Medicine ordering system  
✅ Integrated payment gateway (Razorpay)  
✅ File upload system  
✅ Review and rating system  
✅ Real-time notifications  
✅ Payment history and retry  
✅ Refund management  
✅ Role-based access control  
✅ Comprehensive API  
✅ Production-ready deployment  

---

**Built with ❤️ for healthcare accessibility**

---

Last Updated: December 2025  
Version: 1.0.0
