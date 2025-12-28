# Healthcare Application - Deployment Instructions

## Overview

This is a comprehensive Healthcare Web Application with:
- **Frontend**: ReactJS with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Node.js + Express (documentation provided in `/backend-docs`)
- **Database**: MySQL
- **Payment**: Razorpay Integration
- **Features**: Multi-role system (Patient, Doctor, Diagnostics, Medical Shop)

---

## Demo Credentials

The application is currently running with **mock authentication**. Use these credentials to test:

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient@demo.com | demo123 |
| **Doctor** | doctor@demo.com | demo123 |
| **Diagnostics** | diagnostics@demo.com | demo123 |
| **Medical Shop** | shop@demo.com | demo123 |

---

## Current Status

### ✅ Completed - Frontend
- [x] Complete UI/UX for all 4 user roles
- [x] Authentication pages (Login/Register)
- [x] Patient Portal (Dashboard, Book Appointment, Orders, Payments, etc.)
- [x] Doctor Portal (Dashboard, Appointments, Prescriptions, Payments)
- [x] Diagnostics Portal (Dashboard, Services, Appointments, Payments)
- [x] Medical Shop Portal (Dashboard, Medicines, Orders, Payments)
- [x] Mock authentication with demo credentials
- [x] Error handling with proper messages
- [x] Currency set to Indian Rupees (₹)
- [x] Responsive design

### 📝 Documentation Provided - Backend
- [x] Complete API Documentation (210+ endpoints)
- [x] MySQL Database Schema (22 tables)
- [x] Backend Implementation Guide
- [x] Razorpay Integration Guide
- [x] File Upload Guide
- [x] Deployment Guide (Hostinger/AWS EC2)
- [x] Example Controller Code

### 🔄 Next Steps
1. Set up backend server
2. Connect frontend to backend API
3. Configure Razorpay payment gateway
4. Deploy to production

---

## Deployment Options

### Option 1: Frontend Only (Current Demo)

**What it does:**
- Runs the React frontend with mock data
- No backend required
- Perfect for testing UI/UX

**How to deploy:**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Deploy to:**
- **Vercel**: Push to GitHub, connect to Vercel
- **Netlify**: Drag and drop build folder
- **GitHub Pages**: Use gh-pages npm package

---

### Option 2: Full Stack Deployment (Recommended for Production)

**What you need:**
1. Frontend (React) - Deploy to Vercel/Netlify
2. Backend (Node.js) - Deploy to Hostinger VPS or AWS EC2
3. Database (MySQL) - On VPS or AWS RDS
4. Razorpay Account - For payment processing

#### Step 1: Deploy Backend

Follow the comprehensive guide in `/backend-docs/DEPLOYMENT_GUIDE.md`

**Quick Summary:**

```bash
# On your server (Ubuntu)
# 1. Install Node.js and MySQL
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs mysql-server

# 2. Clone backend code
git clone your-backend-repo
cd healthcare-backend
npm install --production

# 3. Configure environment (.env)
cp .env.example .env
nano .env  # Add your configurations

# 4. Import database schema
mysql -u root -p healthcare_db < database-schema.sql

# 5. Start with PM2
npm install -g pm2
pm2 start server.js --name healthcare-api
pm2 save
pm2 startup

# 6. Configure Nginx reverse proxy
sudo apt install nginx
# Copy nginx config from deployment guide
sudo nginx -t
sudo systemctl restart nginx

# 7. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Step 2: Update Frontend to Use Real API

Create `/src/config/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Authentication
  login: (credentials: any) => 
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(res => res.json()),

  // Add other API calls here
};

export default API_URL;
```

Replace mock authentication in login components with real API calls.

#### Step 3: Deploy Frontend

```bash
# Update environment variable
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or Netlify
netlify deploy --prod
```

#### Step 4: Configure Razorpay

1. Sign up at https://razorpay.com
2. Get API keys (Test & Live)
3. Add to backend `.env`:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret
```
4. Update frontend payment components with Razorpay key

---

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
API_URL=https://api.yourdomain.com

FRONTEND_URL=https://yourdomain.com

DB_HOST=localhost
DB_USER=healthcare_user
DB_PASSWORD=strong_password
DB_NAME=healthcare_db
DB_PORT=3306

JWT_SECRET=your_super_secret_key_64_chars
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret

MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## File Structure

```
healthcare-app/
├── frontend/                  # React application (this folder)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login/Register components
│   │   │   ├── portals/       # Patient/Doctor/Diagnostics/Shop portals
│   │   │   ├── pages/         # Static pages
│   │   │   └── ui/            # UI components
│   │   ├── utils/             # Utilities
│   │   └── App.tsx            # Main app
│   ├── public/
│   └── package.json
│
├── backend/                   # Node.js API (to be created)
│   ├── config/                # Database, Razorpay config
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth, validation
│   ├── routes/                # API routes
│   ├── uploads/               # File storage
│   └── server.js              # Entry point
│
└── backend-docs/              # Complete backend documentation
    ├── API_DOCUMENTATION.md
    ├── DATABASE_SCHEMA.md
    ├── BACKEND_IMPLEMENTATION_GUIDE.md
    ├── RAZORPAY_INTEGRATION.md
    ├── FILE_UPLOAD_GUIDE.md
    ├── DEPLOYMENT_GUIDE.md
    └── EXAMPLE_CONTROLLERS.md
```

---

## Testing the Application

### 1. Test Authentication
- Go to login page for any role
- Use demo credentials
- Should see "Invalid username or password" error for wrong credentials
- Should login successfully with correct credentials

### 2. Test Portals

**Patient Portal:**
- Dashboard: View health overview
- Book Appointment: Search doctors, book appointments
- Appointments: View booked appointments
- Orders: View medicine orders
- Payments: View payment history

**Doctor Portal:**
- Dashboard: View appointment statistics
- Appointments: Manage patient appointments
- Prescriptions: Create prescriptions
- Payments: View earnings

**Diagnostics Portal:**
- Dashboard: View booking statistics
- Services: Manage diagnostic tests
- Appointments: View test bookings
- Payments: Track revenue

**Medical Shop Portal:**
- Dashboard: View sales overview
- Medicines: Manage inventory
- Orders: Process medicine orders
- Payments: Track transactions

---

## Troubleshooting

### Issue: "Invalid username or password" not showing
**Solution:** ✅ Fixed! Updated all login components with proper error handling.

### Issue: Portals not working
**Solution:** ✅ All portals are functional with mock data. To use real data, connect to backend API.

### Issue: Payment not processing
**Solution:** Currently using mock payment. To enable real payments:
1. Set up backend with Razorpay integration
2. Update frontend with Razorpay checkout
3. Follow `/backend-docs/RAZORPAY_INTEGRATION.md`

### Issue: Cannot connect to backend
**Solution:** 
- Ensure backend server is running
- Check CORS settings in backend
- Verify API_URL in frontend .env
- Check browser console for errors

---

## Production Checklist

### Frontend
- [ ] Update API endpoints to production URLs
- [ ] Add Razorpay production keys
- [ ] Enable service worker for PWA
- [ ] Optimize images and assets
- [ ] Configure CDN for static files
- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics (Google Analytics)

### Backend
- [ ] Database properly indexed
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] File uploads directory created
- [ ] Backups automated
- [ ] Monitoring setup (PM2 Plus)
- [ ] Error logging enabled
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] API documentation accessible

### Payment (Razorpay)
- [ ] Switch to live mode keys
- [ ] Webhook URL configured
- [ ] Test all payment methods
- [ ] Refund policy documented
- [ ] Payment notifications setup
- [ ] Compliance verified

---

## Support & Documentation

### Frontend
- React Documentation: https://react.dev
- TailwindCSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

### Backend
- Complete documentation in `/backend-docs/`
- Node.js: https://nodejs.org/docs/
- Express: https://expressjs.com/
- MySQL: https://dev.mysql.com/doc/

### Deployment
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- AWS EC2: https://docs.aws.amazon.com/ec2/
- Hostinger: https://www.hostinger.com/tutorials/

### Payment
- Razorpay Docs: https://razorpay.com/docs/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

## Quick Start Commands

```bash
# Frontend Development
npm install
npm run dev                 # Start dev server
npm run build               # Build for production
npm run preview             # Preview production build

# Backend Development (once created)
cd backend
npm install
npm run dev                 # Start with nodemon
npm start                   # Start production server

# Database
mysql -u root -p
CREATE DATABASE healthcare_db;
source database-schema.sql;

# Deployment
vercel --prod               # Deploy frontend to Vercel
pm2 start server.js         # Start backend with PM2
pm2 logs                    # View logs
pm2 restart all             # Restart all processes
```

---

## Contact & Support

For implementation assistance or questions:
- Review documentation in `/backend-docs/`
- Check API specifications in `API_DOCUMENTATION.md`
- Follow step-by-step guide in `BACKEND_IMPLEMENTATION_GUIDE.md`

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Frontend Complete | Backend Documentation Ready
