# Healthcare Application - Complete Backend Implementation Guide

This guide provides step-by-step instructions to build the Node.js + Express.js backend from scratch.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Folder Structure](#2-folder-structure)
3. [Environment Configuration](#3-environment-configuration)
4. [Database Connection](#4-database-connection)
5. [Authentication System](#5-authentication-system)
6. [Middleware](#6-middleware)
7. [API Routes](#7-api-routes)
8. [Controllers](#8-controllers)
9. [File Upload System](#9-file-upload-system)
10. [Error Handling](#10-error-handling)
11. [Testing](#11-testing)

---

## 1. Project Setup

### Initialize Node.js Project

```bash
mkdir healthcare-backend
cd healthcare-backend
npm init -y
```

### Install Dependencies

```bash
# Core dependencies
npm install express mysql2 dotenv bcryptjs jsonwebtoken cors helmet

# File upload
npm install multer

# Razorpay
npm install razorpay crypto

# Validation
npm install joi express-validator

# Utilities
npm install morgan compression

# Development dependencies
npm install --save-dev nodemon
```

### Package.json Scripts

```json
{
  "name": "healthcare-backend",
  "version": "1.0.0",
  "description": "Healthcare Application Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["healthcare", "api", "razorpay"],
  "author": "",
  "license": "ISC"
}
```

---

## 2. Folder Structure

```
healthcare-backend/
│
├── config/
│   ├── database.js          # MySQL connection configuration
│   ├── razorpay.js          # Razorpay configuration
│   └── multer.js            # File upload configuration
│
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── roleCheck.js         # Role-based access control
│   ├── errorHandler.js      # Global error handler
│   ├── validator.js         # Input validation
│   └── rateLimiter.js       # Rate limiting
│
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── patient.routes.js    # Patient routes
│   ├── doctor.routes.js     # Doctor routes
│   ├── diagnostic.routes.js # Diagnostic center routes
│   ├── medicalShop.routes.js# Medical shop routes
│   ├── payment.routes.js    # Payment routes
│   └── upload.routes.js     # File upload routes
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
├── models/                  # Database models (optional ORM)
│   └── queries.js           # SQL queries
│
├── utils/
│   ├── responseHandler.js   # Standardized API responses
│   ├── emailService.js      # Email notifications
│   └── helpers.js           # Helper functions
│
├── uploads/                 # File storage directory
│   ├── profiles/
│   ├── licenses/
│   ├── prescriptions/
│   └── reports/
│
├── .env                     # Environment variables
├── .gitignore
├── server.js                # Entry point
└── package.json
```

---

## 3. Environment Configuration

### Create `.env` file

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=healthcare_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Healthcare App <noreply@healthcare.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Create `.gitignore`

```
node_modules/
.env
uploads/
*.log
.DS_Store
```

---

## 4. Database Connection

### config/database.js

```javascript
const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Promisify for async/await
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

module.exports = promisePool;
```

---

## 5. Authentication System

### utils/responseHandler.js

```javascript
class ResponseHandler {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Error occurred', statusCode = 500, details = null) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: this.getErrorCode(statusCode),
        details
      }
    });
  }

  static getErrorCode(statusCode) {
    const codes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR'
    };
    return codes[statusCode] || 'UNKNOWN_ERROR';
  }
}

module.exports = ResponseHandler;
```

### controllers/auth.controller.js

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

class AuthController {
  // User Registration
  static async register(req, res) {
    try {
      const { 
        name, email, password, phone, role, address, 
        dateOfBirth, gender,
        // Doctor fields
        specialization, qualification, experience, consultationFee, licenseNumber,
        // Diagnostic/Medical Shop fields
        centreName, shopName 
      } = req.body;

      // Check if user already exists
      const [existingUser] = await db.query(
        'SELECT user_id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return ResponseHandler.error(res, 'Email already registered', 409);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user
      const [userResult] = await db.query(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role]
      );

      const userId = userResult.insertId;

      // Insert role-specific data
      if (role === 'patient') {
        await db.query(
          `INSERT INTO patients (user_id, name, phone, date_of_birth, gender, address) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, name, phone, dateOfBirth || null, gender || null, address || null]
        );
      } else if (role === 'doctor') {
        await db.query(
          `INSERT INTO doctors (user_id, name, phone, specialization, qualification, 
           experience, license_number, consultation_fee) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, name, phone, specialization, qualification, experience, licenseNumber, consultationFee]
        );
      } else if (role === 'diagnostic') {
        await db.query(
          `INSERT INTO diagnostic_centers (user_id, center_name, phone, email, license_number, address) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, centreName, phone, email, licenseNumber, address]
        );
      } else if (role === 'medical_shop') {
        await db.query(
          `INSERT INTO medical_shops (user_id, shop_name, phone, email, license_number, address) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, shopName, phone, email, licenseNumber, address]
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return ResponseHandler.success(
        res,
        { userId, email, role, token },
        'User registered successfully',
        201
      );
    } catch (error) {
      console.error('Registration error:', error);
      return ResponseHandler.error(res, 'Registration failed', 500);
    }
  }

  // User Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const [users] = await db.query(
        'SELECT user_id, email, password_hash, role, is_active FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return ResponseHandler.error(res, 'Invalid email or password', 401);
      }

      const user = users[0];

      // Check if account is active
      if (!user.is_active) {
        return ResponseHandler.error(res, 'Account is deactivated', 403);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return ResponseHandler.error(res, 'Invalid email or password', 401);
      }

      // Update last login
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE user_id = ?',
        [user.user_id]
      );

      // Get user profile
      let profileData = {};
      if (user.role === 'patient') {
        const [patient] = await db.query('SELECT name FROM patients WHERE user_id = ?', [user.user_id]);
        profileData = patient[0];
      } else if (user.role === 'doctor') {
        const [doctor] = await db.query('SELECT name FROM doctors WHERE user_id = ?', [user.user_id]);
        profileData = doctor[0];
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return ResponseHandler.success(res, {
        userId: user.user_id,
        name: profileData.name || '',
        email: user.email,
        role: user.role,
        token,
        profileComplete: true
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      return ResponseHandler.error(res, 'Login failed', 500);
    }
  }

  // Get Current User
  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.userId;
      const role = req.user.role;

      let query, tableName;
      if (role === 'patient') {
        tableName = 'patients';
        query = `SELECT p.*, u.email FROM patients p 
                 JOIN users u ON p.user_id = u.user_id 
                 WHERE p.user_id = ?`;
      } else if (role === 'doctor') {
        tableName = 'doctors';
        query = `SELECT d.*, u.email FROM doctors d 
                 JOIN users u ON d.user_id = u.user_id 
                 WHERE d.user_id = ?`;
      } else if (role === 'diagnostic') {
        tableName = 'diagnostic_centers';
        query = `SELECT dc.*, u.email FROM diagnostic_centers dc 
                 JOIN users u ON dc.user_id = u.user_id 
                 WHERE dc.user_id = ?`;
      } else if (role === 'medical_shop') {
        tableName = 'medical_shops';
        query = `SELECT ms.*, u.email FROM medical_shops ms 
                 JOIN users u ON ms.user_id = u.user_id 
                 WHERE ms.user_id = ?`;
      }

      const [userData] = await db.query(query, [userId]);

      if (userData.length === 0) {
        return ResponseHandler.error(res, 'User not found', 404);
      }

      return ResponseHandler.success(res, userData[0]);
    } catch (error) {
      console.error('Get user error:', error);
      return ResponseHandler.error(res, 'Failed to get user data', 500);
    }
  }

  // Change Password
  static async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      // Get current password hash
      const [users] = await db.query(
        'SELECT password_hash FROM users WHERE user_id = ?',
        [userId]
      );

      if (users.length === 0) {
        return ResponseHandler.error(res, 'User not found', 404);
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!isPasswordValid) {
        return ResponseHandler.error(res, 'Current password is incorrect', 401);
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await db.query(
        'UPDATE users SET password_hash = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );

      return ResponseHandler.success(res, null, 'Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      return ResponseHandler.error(res, 'Failed to change password', 500);
    }
  }
}

module.exports = AuthController;
```

---

## 6. Middleware

### middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/responseHandler');

const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return ResponseHandler.error(res, 'Access token required', 401);
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return ResponseHandler.error(res, 'Token expired', 401);
        }
        return ResponseHandler.error(res, 'Invalid token', 403);
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return ResponseHandler.error(res, 'Authentication failed', 500);
  }
};

module.exports = authenticateToken;
```

### middleware/roleCheck.js

```javascript
const ResponseHandler = require('../utils/responseHandler');

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return ResponseHandler.error(res, 'User role not found', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ResponseHandler.error(
        res, 
        'You do not have permission to access this resource', 
        403
      );
    }

    next();
  };
};

module.exports = roleCheck;
```

### middleware/errorHandler.js

```javascript
const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return ResponseHandler.error(res, 'Duplicate entry found', 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ResponseHandler.error(res, 'Referenced resource not found', 404);
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ResponseHandler.error(res, 'File size too large (max 10MB)', 400);
    }
    return ResponseHandler.error(res, 'File upload error', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseHandler.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseHandler.error(res, 'Token expired', 401);
  }

  // Default error
  return ResponseHandler.error(
    res, 
    err.message || 'Internal server error', 
    err.statusCode || 500
  );
};

module.exports = errorHandler;
```

### middleware/validator.js

```javascript
const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach(error => {
      formattedErrors[error.param] = error.msg;
    });

    return ResponseHandler.error(
      res,
      'Validation failed',
      422,
      formattedErrors
    );
  }

  next();
};

module.exports = validate;
```

### middleware/rateLimiter.js

```javascript
const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Payment rate limiter
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many payment requests, please try again later.',
});

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter
};
```

---

## 7. API Routes

### routes/auth.routes.js

```javascript
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Invalid phone number'),
  body('role').isIn(['patient', 'doctor', 'diagnostic', 'medical_shop']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', authLimiter, loginValidation, validate, AuthController.login);
router.get('/me', authenticateToken, AuthController.getCurrentUser);
router.put('/change-password', authenticateToken, AuthController.changePassword);

module.exports = router;
```

### routes/patient.routes.js

```javascript
const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patient.controller');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication and patient role
router.use(authenticateToken, roleCheck('patient'));

// Profile
router.get('/profile', PatientController.getProfile);
router.put('/profile', PatientController.updateProfile);

// Doctors
router.get('/doctors', PatientController.getDoctors);

// Appointments
router.post('/appointments/book', PatientController.bookAppointment);
router.get('/appointments', PatientController.getAppointments);
router.put('/appointments/:appointmentId/cancel', PatientController.cancelAppointment);

// Prescriptions
router.get('/prescriptions', PatientController.getPrescriptions);

// Diagnostic Centers & Tests
router.get('/diagnostic-centers', PatientController.getDiagnosticCenters);
router.get('/diagnostic-centers/:centerId/tests', PatientController.getDiagnosticTests);
router.post('/diagnostic-tests/book', PatientController.bookDiagnosticTest);
router.get('/diagnostic-tests', PatientController.getDiagnosticBookings);

// Medical Shops & Medicines
router.get('/medical-shops', PatientController.getMedicalShops);
router.get('/medicines/search', PatientController.searchMedicines);
router.post('/medicine-orders', PatientController.placeMedicineOrder);
router.get('/medicine-orders', PatientController.getMedicineOrders);

module.exports = router;
```

### server.js (Entry Point)

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const diagnosticRoutes = require('./routes/diagnostic.routes');
const medicalShopRoutes = require('./routes/medicalShop.routes');
const paymentRoutes = require('./routes/payment.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // Logging
app.use(generalLimiter); // Rate limiting

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/diagnostic-centers', diagnosticRoutes);
app.use('/api/medical-shops', medicalShopRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND'
    }
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
```

---

## 8. Controllers

See the auth.controller.js example above. Similar structure for:

- **patient.controller.js**: Appointments, prescriptions, bookings, orders
- **doctor.controller.js**: Appointments, prescriptions, earnings
- **diagnostic.controller.js**: Test management, bookings, reports
- **medicalShop.controller.js**: Medicine inventory, orders
- **payment.controller.js**: Razorpay integration (see separate guide)
- **upload.controller.js**: File uploads (see section 9)

---

## 9. File Upload System

See the **FILE_UPLOAD_GUIDE.md** document for complete implementation.

---

## 10. Error Handling

Already covered in middleware/errorHandler.js above.

---

## 11. Testing

### Manual Testing with Postman

1. **Import Collection**: Create Postman collection with all API endpoints
2. **Environment Variables**: Set up base URL, tokens
3. **Test Scenarios**:
   - User registration & login
   - Protected routes with/without token
   - CRUD operations
   - Payment flow
   - File uploads

### Unit Testing (Optional)

```bash
npm install --save-dev jest supertest
```

### Example Test

```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'patient'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
  });
});
```

---

## Next Steps

1. ✅ Set up project structure
2. ✅ Configure database connection
3. ✅ Implement authentication
4. ✅ Create middleware
5. ✅ Build API routes
6. 📝 Implement controllers (see individual guides)
7. 📝 Set up file uploads (see FILE_UPLOAD_GUIDE.md)
8. 📝 Integrate Razorpay (see RAZORPAY_INTEGRATION.md)
9. 📝 Deploy to server (see DEPLOYMENT_GUIDE.md)

---

## Common Issues & Solutions

### Issue 1: MySQL Connection Error
```
Solution: Check DB credentials in .env, ensure MySQL is running
```

### Issue 2: JWT Token Invalid
```
Solution: Verify JWT_SECRET in .env, check token expiry
```

### Issue 3: CORS Error
```
Solution: Update FRONTEND_URL in .env, check cors configuration
```

### Issue 4: File Upload Fails
```
Solution: Check uploads directory permissions, verify file size limits
```

---

## Best Practices

1. **Always use environment variables** for sensitive data
2. **Validate all inputs** before processing
3. **Use prepared statements** to prevent SQL injection
4. **Hash passwords** with bcrypt (never store plain text)
5. **Implement rate limiting** to prevent abuse
6. **Log all errors** for debugging
7. **Use transactions** for critical operations
8. **Keep dependencies updated** regularly
9. **Write meaningful commit messages**
10. **Test thoroughly** before deployment
