# Healthcare Backend API

Complete backend implementation for the Healthcare Web Application.

## Features

- ✅ User authentication (JWT)
- ✅ Role-based access control (Patient, Doctor, Diagnostics, Shop)
- ✅ Appointment booking and management
- ✅ Prescription creation and management
- ✅ Medicine order processing
- ✅ Razorpay payment integration
- ✅ File uploads (certificates, prescriptions, licenses)
- ✅ Email notifications
- ✅ Rate limiting and security

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database credentials
- JWT secret
- Razorpay keys
- Email settings (optional)

### 3. Set Up Database

Create MySQL database and import schema:

```bash
mysql -u root -p
CREATE DATABASE healthcare_db;
exit

# Import schema from parent folder
mysql -u root -p healthcare_db < ../database-schema.sql
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Appointments
- `POST /api/appointments/book` - Book appointment (Patient)
- `GET /api/appointments` - Get appointments
- `PUT /api/appointments/:id/status` - Update status (Doctor)
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Prescriptions
- `POST /api/prescriptions` - Create prescription (Doctor)
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID

### Orders
- `POST /api/orders` - Create medicine order (Patient)
- `GET /api/orders` - Get orders
- `PUT /api/orders/:id/status` - Update order status (Shop)
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Razorpay webhook

## Project Structure

```
healthcare-backend/
├── config/
│   ├── database.js         # MySQL connection
│   └── razorpay.js         # Razorpay configuration
├── controllers/
│   ├── authController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   ├── orderController.js
│   └── paymentController.js
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── upload.js           # File upload (Multer)
│   └── validate.js         # Input validation
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
├── uploads/                # File storage
├── .env                    # Environment variables
└── server.js               # Entry point
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=healthcare_db
DB_PORT=3306

# JWT
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123",
    "role": "PATIENT",
    "name": "John Doe",
    "phone": "1234567890"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import API collection
2. Set base URL: `http://localhost:5000/api`
3. Add token to Authorization header
4. Test endpoints

## Security

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ File upload validation
- ✅ SQL injection prevention

## Deployment

See `/backend-docs/DEPLOYMENT_GUIDE.md` for complete deployment instructions.

### Quick Deployment

```bash
# On your server
git clone your-repo
cd healthcare-backend
npm install --production
cp .env.example .env
# Edit .env with production settings

# Start with PM2
npm install -g pm2
pm2 start server.js --name healthcare-api
pm2 save
pm2 startup
```

## Troubleshooting

### Database Connection Error
```
Check DB credentials in .env
Ensure MySQL is running
```

### Port Already in Use
```
Change PORT in .env
Or kill process: lsof -ti:5000 | xargs kill
```

### JWT Token Invalid
```
Check JWT_SECRET in .env
Token may have expired
```

## Support

For detailed API documentation, see `/backend-docs/API_DOCUMENTATION.md`

## License

MIT
