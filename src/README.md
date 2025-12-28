# Healthcare Web Application

A comprehensive healthcare platform built with React, Node.js, MySQL, and Razorpay payment integration. Supports multiple user roles including Patients, Doctors, Diagnostic Centers, and Medical Shops.

## 🎯 Features

### For Patients
- 👤 User registration and authentication
- 📅 Book appointments with doctors
- 💊 Order medicines online
- 📋 View prescriptions and medical history
- 💳 Secure payments via Razorpay
- 📱 Responsive mobile-first design

### For Doctors
- 🩺 Manage appointments
- 📝 Create digital prescriptions
- 💰 Track earnings and payments
- 👥 View patient history

### For Diagnostic Centers
- 🔬 Manage diagnostic tests and services
- 📊 Track bookings and revenue
- 📄 Upload test reports

### For Medical Shops
- 💊 Manage medicine inventory
- 📦 Process medicine orders
- 🚚 Track order status and deliveries
- 💵 Payment management

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- TailwindCSS for styling
- shadcn/ui component library
- React Router for navigation
- Fetch API for backend communication

**Backend:**
- Node.js + Express
- MySQL database
- JWT authentication
- Bcrypt password hashing
- Razorpay payment integration
- Multer for file uploads

**Payment:**
- Razorpay (Cards, UPI, Net Banking, Wallets)
- Webhook verification
- Indian Rupees (₹) currency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### Installation

**1. Clone the repository:**
```bash
git clone your-repo-url
cd healthcare-app
```

**2. Set up Database:**
```bash
mysql -u root -p
CREATE DATABASE healthcare_db;
EXIT;
mysql -u root -p healthcare_db < database-schema.sql
```

**3. Set up Backend:**
```bash
cd healthcare-backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

**4. Set up Frontend:**
```bash
cd ..
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

**5. Open in Browser:**
```
http://localhost:3000
```

## 📖 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete installation and setup instructions
- **[Deployment Guide](DEPLOYMENT_INSTRUCTIONS.md)** - Production deployment instructions
- **[Backend API Docs](healthcare-backend/README.md)** - API endpoint documentation
- **[Backend Implementation](backend-docs/)** - Detailed backend guides

## 🔐 Authentication

The application uses JWT-based authentication. After login, the token is stored in localStorage and sent with all API requests.

**Registration Flow:**
1. User registers with email, password, and role
2. Backend hashes password and creates user
3. JWT token is generated and returned
4. User is redirected to their role-specific dashboard

**Login Flow:**
1. User enters email and password
2. Backend validates credentials
3. Returns JWT token and user data
4. Frontend stores token and redirects to dashboard

## 💳 Payment Integration

Payments are processed through Razorpay:

1. User initiates payment (appointment booking, medicine order)
2. Frontend calls backend to create Razorpay order
3. Backend creates order and returns order details
4. Frontend opens Razorpay checkout modal
5. User completes payment
6. Payment verified via webhook
7. Order/appointment status updated

**Supported Payment Methods:**
- Credit/Debit Cards
- UPI
- Net Banking
- Wallets

## 📁 Project Structure

```
healthcare-app/
├── healthcare-backend/         # Node.js backend
│   ├── config/                # Database & Razorpay config
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Auth, upload, validation
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Helper functions
│   └── server.js              # Entry point
│
├── src/                       # React frontend
│   ├── components/
│   │   ├── auth/             # Login/Register
│   │   ├── portals/          # Role-specific dashboards
│   │   └── ui/               # Reusable UI components
│   ├── utils/                # API utilities
│   └── App.tsx               # Main application
│
└── database-schema.sql        # MySQL database schema
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments` - Get appointments
- `PUT /api/appointments/:id/status` - Update status
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/prescriptions/:id` - Get prescription details

### Orders
- `POST /api/orders` - Create medicine order
- `GET /api/orders` - Get orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Payment history
- `POST /api/payments/webhook` - Razorpay webhook

## 🌐 Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

## 🧪 Testing

### Manual Testing

1. **Register Account:**
   - Navigate to registration page
   - Fill in details and submit
   - Verify redirect to dashboard

2. **Login:**
   - Use registered credentials
   - Verify "Invalid username or password" for wrong credentials
   - Verify successful login with correct credentials

3. **Book Appointment:**
   - Login as patient
   - Search for doctor
   - Book appointment
   - Test payment flow

### API Testing

Use cURL, Postman, or similar tools:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"PATIENT","name":"Test User","phone":"1234567890"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist folder
```

### Backend (VPS/AWS EC2)

```bash
# Install dependencies
npm install --production

# Set environment variables
# Configure MySQL
# Start with PM2
pm2 start server.js --name healthcare-api
```

See [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) for detailed deployment guide.

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ SQL injection prevention
- ✅ Secure file upload validation
- ✅ Razorpay signature verification

## 📊 Database Schema

The application uses 22 MySQL tables including:
- Users and role-specific profiles
- Appointments and prescriptions
- Medicine orders and inventory
- Payments and transactions
- Diagnostic tests and reports

See [database-schema.sql](database-schema.sql) for complete schema.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For issues or questions:
- Check the [Setup Guide](SETUP_GUIDE.md)
- Review [API Documentation](healthcare-backend/README.md)
- Check backend logs for errors

## ✨ Credits

Built with modern web technologies:
- React + TypeScript
- TailwindCSS + shadcn/ui
- Node.js + Express
- MySQL
- Razorpay

---

**Made with ❤️ for healthcare**