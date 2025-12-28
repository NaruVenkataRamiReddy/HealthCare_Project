# Healthcare Application - Complete Setup Guide

This guide will help you set up and run both frontend and backend of the Healthcare Application.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## 🚀 Quick Start (Development)

### Step 1: Clone the Repository

```bash
git clone your-repository-url
cd healthcare-app
```

### Step 2: Set Up Database

1. **Start MySQL:**
```bash
# On macOS
mysql.server start

# On Windows
net start MySQL80

# On Linux
sudo service mysql start
```

2. **Create Database:**
```bash
mysql -u root -p
```

Enter your MySQL password, then:
```sql
CREATE DATABASE healthcare_db;
EXIT;
```

3. **Import Schema:**
```bash
mysql -u root -p healthcare_db < database-schema.sql
```

### Step 3: Set Up Backend

```bash
cd healthcare-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file:**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=healthcare_db

JWT_SECRET=your_secret_key_min_32_characters_long_please_change_this
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret
```

**Start Backend:**
```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### Step 4: Set Up Frontend

Open a **new terminal** window:

```bash
cd healthcare-app  # Go back to root

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start frontend
npm run dev
```

Frontend will open at: `http://localhost:3000`

---

## 🎯 Testing the Application

### 1. Create a Test Account

Open your browser to `http://localhost:3000`

1. Click "Get Started"
2. Choose "Patient" or any other role
3. Click "Register"
4. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Phone: 1234567890
   - Additional fields as needed
5. Click "Register"

You should be logged in and redirected to your dashboard!

### 2. Test Login

1. Logout
2. Go to Login page
3. Enter credentials:
   - Email: john@example.com
   - Password: password123
4. Click "Sign In"

### 3. Test Features

**Patient Portal:**
- ✅ View Dashboard
- ✅ Book Appointment
- ✅ View Prescriptions
- ✅ Order Medicines

**Doctor Portal:**
- ✅ View Appointments
- ✅ Create Prescriptions
- ✅ View Earnings

---

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development / production |
| `PORT` | Server port | 5000 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | your_password |
| `DB_NAME` | Database name | healthcare_db |
| `JWT_SECRET` | Secret for JWT tokens | min 32 characters |
| `JWT_EXPIRE` | Token expiration | 7d |
| `RAZORPAY_KEY_ID` | Razorpay API key | rzp_test_xxx |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | your_secret |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key for checkout | rzp_test_xxx |

---

## 💳 Setting Up Razorpay (For Payments)

### 1. Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up"
3. Complete registration

### 2. Get API Keys

1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy **Key Id** and **Key Secret**

### 3. Configure Keys

**Backend `.env`:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**Frontend `.env.local`:**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### 4. Test Payment

Use Razorpay test cards:
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date

---

## 📂 Project Structure

```
healthcare-app/
├── healthcare-backend/         # Backend API
│   ├── config/                # Database, Razorpay config
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth, validation
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Helper functions
│   ├── uploads/               # File storage
│   ├── .env                   # Environment variables
│   ├── server.js              # Entry point
│   └── package.json
│
├── src/                       # Frontend React app
│   ├── components/
│   │   ├── auth/             # Login/Register
│   │   ├── portals/          # Role-specific portals
│   │   ├── pages/            # Static pages
│   │   └── ui/               # UI components
│   ├── utils/                # API calls
│   └── App.tsx               # Main app
│
├── database-schema.sql        # MySQL schema
└── package.json              # Frontend dependencies
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Database connection failed"**
```bash
# Check if MySQL is running
mysql -u root -p

# Check credentials in .env
# Make sure database exists
```

**Error: "Port 5000 already in use"**
```bash
# Change PORT in .env to 5001 or any available port
# Update VITE_API_URL in frontend .env.local
```

**Error: "Invalid token"**
```bash
# Make sure JWT_SECRET in .env is at least 32 characters
# Clear browser localStorage and login again
```

### Frontend Issues

**Error: "Network request failed"**
```bash
# Make sure backend is running on http://localhost:5000
# Check VITE_API_URL in .env.local
# Check browser console for CORS errors
```

**Error: "Login not working"**
```bash
# Make sure you registered an account first
# Check backend logs for errors
# Verify email and password are correct
```

### Database Issues

**Error: "Table doesn't exist"**
```bash
# Re-import the schema
mysql -u root -p healthcare_db < database-schema.sql
```

**Error: "Access denied for user"**
```bash
# Check DB_USER and DB_PASSWORD in backend .env
# Make sure MySQL user has proper permissions
```

---

## 🌐 API Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "PATIENT",
    "name": "Test User",
    "phone": "1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Import these endpoints
2. Set base URL: `http://localhost:5000/api`
3. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`

---

## 📊 Database Tables

The application uses 22 tables:
- `users` - User accounts
- `patients` - Patient profiles
- `doctors` - Doctor profiles
- `diagnostic_centers` - Diagnostic center profiles
- `medical_shops` - Medical shop profiles
- `appointments` - Appointment bookings
- `prescriptions` - Medical prescriptions
- `medicine_orders` - Medicine orders
- `payments` - Payment records
- And more...

See `database-schema.sql` for complete schema.

---

## 🔐 Security Best Practices

### Development
- ✅ Use test Razorpay keys
- ✅ Don't commit `.env` files
- ✅ Use strong JWT secrets

### Production
- ✅ Use environment variables
- ✅ Enable HTTPS/SSL
- ✅ Use production Razorpay keys
- ✅ Set strong database passwords
- ✅ Enable rate limiting
- ✅ Regular backups

---

## 📱 Next Steps

1. **Set up Email** (Optional):
   - Configure SMTP in backend `.env`
   - Test appointment confirmations

2. **Customize**:
   - Update branding/colors
   - Add more features
   - Customize email templates

3. **Deploy**:
   - Frontend: Vercel/Netlify
   - Backend: AWS EC2/Hostinger VPS
   - Database: AWS RDS/VPS MySQL

See `DEPLOYMENT_INSTRUCTIONS.md` for production deployment.

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Database connected (check backend logs)
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can access dashboard
- [ ] Login shows "Invalid username or password" for wrong credentials

---

## 📞 Support

If you encounter issues:

1. Check error messages in browser console
2. Check backend terminal for error logs
3. Verify all environment variables are set
4. Make sure MySQL is running
5. Review this guide carefully

---

## 🎉 Success!

If everything is working:
- ✅ Backend API is running
- ✅ Frontend is connected
- ✅ Database is set up
- ✅ You can register and login
- ✅ All portals are accessible

You're ready to develop and customize your Healthcare Application!

---

**Happy Coding! 🚀**
