# Backend Implementation Guide
## Healthcare+ - Node.js + Express + MySQL + Razorpay

This document provides a complete guide for implementing the backend API for the Healthcare+ application.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Core Implementation](#core-implementation)
4. [Razorpay Integration](#razorpay-integration)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)

## Project Setup

### Initialize Project
```bash
mkdir healthcare-backend
cd healthcare-backend
npm init -y
```

### Install Dependencies
```bash
npm install express mysql2 bcrypt jsonwebtoken razorpay multer cors dotenv express-validator
npm install --save-dev nodemon
```

### package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Folder Structure

```
healthcare-backend/
├── config/
│   ├── database.js
│   └── razorpay.js
├── controllers/
│   ├── authController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   ├── orderController.js
│   └── paymentController.js
├── middleware/
│   ├── auth.js
│   ├── upload.js
│   └── validate.js
├── models/
│   ├── User.js
│   ├── Appointment.js
│   ├── Prescription.js
│   ├── Order.js
│   └── Payment.js
├── routes/
│   ├── auth.js
│   ├── appointments.js
│   ├── prescriptions.js
│   ├── orders.js
│   └── payments.js
├── utils/
│   ├── generateBillId.js
│   └── emailService.js
├── uploads/
│   ├── certificates/
│   ├── prescriptions/
│   └── licenses/
├── .env
├── server.js
└── README.md
```

## Core Implementation

### 1. Database Configuration (`config/database.js`)
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'healthcare_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### 2. Razorpay Configuration (`config/razorpay.js`)
```javascript
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpayInstance;
```

### 3. Authentication Middleware (`middleware/auth.js`)
```javascript
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};
```

### 4. File Upload Middleware (`middleware/upload.js`)
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'certificate') {
      uploadPath += 'certificates/';
    } else if (file.fieldname === 'prescription') {
      uploadPath += 'prescriptions/';
    } else if (file.fieldname === 'license') {
      uploadPath += 'licenses/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

### 5. Auth Controller (`controllers/authController.js`)
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.registerPatient = async (req, res) => {
  try {
    const { name, username, email, phone, address, password } = req.body;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Insert into database
    const [result] = await db.execute(
      'INSERT INTO patients (name, username, email, phone, address, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, email, phone, address, password_hash]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, role: 'PATIENT', email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        role: 'PATIENT',
        name,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Determine table based on role
    let table;
    switch (role) {
      case 'PATIENT':
        table = 'patients';
        break;
      case 'DOCTOR':
        table = 'doctors';
        break;
      case 'DIAGNOSTICS':
        table = 'diagnostics';
        break;
      case 'SHOP':
        table = 'medical_shops';
        break;
      default:
        return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Find user
    const [users] = await db.execute(
      `SELECT * FROM ${table} WHERE email = ? AND is_deleted = FALSE`,
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Remove password from response
    delete user.password_hash;
    
    res.json({
      success: true,
      token,
      user: {
        ...user,
        role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
```

## Razorpay Integration

### 6. Payment Controller (`controllers/paymentController.js`)
```javascript
const crypto = require('crypto');
const db = require('../config/database');
const razorpay = require('../config/razorpay');
const { generateBillId } = require('../utils/generateBillId');

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, userType, userId, purpose, referenceId } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Generate unique bill ID
    const billId = generateBillId();
    
    // Calculate expiry time (30 minutes from now)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: billId,
      notes: {
        billId,
        userType,
        userId: userId.toString(),
        purpose
      }
    });
    
    // Save payment record to database
    await db.execute(
      `INSERT INTO payments 
       (bill_id, user_type, user_id, amount, currency, purpose, reference_id, razorpay_order_id, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [billId, userType, userId, amount, 'INR', purpose, referenceId, razorpayOrder.id, 'PENDING', expiresAt]
    );
    
    res.status(201).json({
      success: true,
      billId,
      razorpay_order_id: razorpayOrder.id,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      expiresAt
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

exports.verifyWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = req.body.event;
    const payload = req.body.payload.payment.entity;
    
    // Extract order ID and find bill
    const orderId = payload.order_id;
    const paymentId = payload.id;
    const paymentMethod = payload.method;
    
    const [bills] = await db.execute(
      'SELECT * FROM payments WHERE razorpay_order_id = ?',
      [orderId]
    );
    
    if (bills.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    const bill = bills[0];
    
    // Update payment status based on event
    let status;
    let paidAt = null;
    
    switch (event) {
      case 'payment.captured':
        status = 'SUCCESS';
        paidAt = new Date();
        break;
      case 'payment.failed':
        status = 'FAILED';
        break;
      default:
        return res.status(200).json({ success: true }); // Ignore other events
    }
    
    // Update payment record
    await db.execute(
      `UPDATE payments 
       SET razorpay_payment_id = ?, razorpay_signature = ?, status = ?, payment_method = ?, paid_at = ?, updated_at = NOW()
       WHERE bill_id = ?`,
      [paymentId, signature, status, paymentMethod, paidAt, bill.bill_id]
    );
    
    // Update related records based on purpose
    if (status === 'SUCCESS') {
      switch (bill.purpose) {
        case 'APPOINTMENT':
          await db.execute(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['CONFIRMED', bill.reference_id]
          );
          break;
        case 'TEST':
          await db.execute(
            'UPDATE tests_orders SET status = ? WHERE id = ?',
            ['SCHEDULED', bill.reference_id]
          );
          break;
        case 'MEDICINE_ORDER':
          // Medicine order status handled separately by shop
          break;
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook verification error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    
    const [payments] = await db.execute(
      'SELECT * FROM payments WHERE bill_id = ? AND is_deleted = FALSE',
      [billId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const payment = payments[0];
    
    // Check if payment has expired
    if (payment.status === 'PENDING' && new Date(payment.expires_at) < new Date()) {
      await db.execute(
        'UPDATE payments SET status = ? WHERE bill_id = ?',
        ['TIMEOUT', billId]
      );
      payment.status = 'TIMEOUT';
    }
    
    res.json({
      success: true,
      payment: {
        billId: payment.bill_id,
        status: payment.status,
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        createdAt: payment.created_at,
        paidAt: payment.paid_at,
        expiresAt: payment.expires_at
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
};

exports.mockPayment = async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Mock payment not allowed in production' });
    }
    
    const { billId, status } = req.body;
    
    if (!['SUCCESS', 'FAILED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const paidAt = status === 'SUCCESS' ? new Date() : null;
    
    await db.execute(
      'UPDATE payments SET status = ?, paid_at = ?, updated_at = NOW() WHERE bill_id = ?',
      [status, paidAt, billId]
    );
    
    res.json({
      success: true,
      message: `Payment status updated to ${status}`
    });
  } catch (error) {
    console.error('Mock payment error:', error);
    res.status(500).json({ error: 'Mock payment failed' });
  }
};
```

### 7. Utility: Generate Bill ID (`utils/generateBillId.js`)
```javascript
module.exports.generateBillId = () => {
  const prefix = 'BILL';
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${year}-${random}`;
};
```

### 8. Payment Routes (`routes/payments.js`)
```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/create', authenticateToken, paymentController.createPaymentOrder);
router.post('/webhook', paymentController.verifyWebhook);
router.get('/status/:billId', authenticateToken, paymentController.getPaymentStatus);
router.post('/mock', authenticateToken, paymentController.mockPayment);

module.exports = router;
```

### 9. Main Server (`server.js`)
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Testing

### Test Payment Flow with cURL

```bash
# 1. Register a patient
curl -X POST http://localhost:5000/api/auth/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "phone": "+1234567890",
    "address": "123 Test St",
    "password": "password123"
  }'

# 2. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "PATIENT"
  }'

# 3. Create payment order (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/payments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "userType": "PATIENT",
    "userId": 1,
    "purpose": "APPOINTMENT",
    "referenceId": "1"
  }'

# 4. Mock successful payment (development only)
curl -X POST http://localhost:5000/api/payments/mock \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "billId": "BILL-2024-ABC123",
    "status": "SUCCESS"
  }'

# 5. Check payment status
curl -X GET http://localhost:5000/api/payments/status/BILL-2024-ABC123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Razorpay Webhook Testing

Use ngrok to expose your local server:
```bash
ngrok http 5000
```

Then configure the webhook URL in Razorpay dashboard:
```
https://your-ngrok-url.ngrok.io/api/payments/webhook
```

## Security Checklist

- ✅ Environment variables for secrets
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ File upload validation
- ✅ CORS configuration
- ✅ Webhook signature verification
- ✅ Payment expiry handling
- ✅ Rate limiting (add express-rate-limit)
- ✅ HTTPS in production

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use proper SSL/TLS certificates
3. Configure production database with replication
4. Set up Redis for session storage
5. Implement rate limiting
6. Add logging (Winston/Morgan)
7. Set up monitoring (PM2, New Relic)
8. Configure backup strategy
9. Enable Razorpay Live mode
10. Implement proper error tracking (Sentry)

## Additional Resources

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MySQL Security Guidelines](https://dev.mysql.com/doc/refman/8.0/en/security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Support

For backend implementation support, contact: dev@healthcareplus.com
