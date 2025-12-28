# Healthcare Application - Complete API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 User Registration
```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "patient|doctor|diagnostic|medical_shop",
  "address": "123 Street, City",
  "dateOfBirth": "1990-01-01",
  "gender": "male|female|other",
  
  // For Doctor only
  "specialization": "Cardiologist",
  "qualification": "MBBS, MD",
  "experience": 10,
  "consultationFee": 500,
  "licenseNumber": "MED12345",
  
  // For Diagnostic Centre only
  "centreName": "DiagnoLab",
  "licenseNumber": "DIAG12345",
  
  // For Medical Shop only
  "shopName": "MediCare Pharmacy",
  "licenseNumber": "DRUG12345"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "email": "john@example.com",
    "role": "patient",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 User Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profileComplete": true
  }
}
```

### 1.3 Get Current User
```
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "9876543210",
    "address": "123 Street, City",
    "profilePicture": "/uploads/profiles/user1.jpg"
  }
}
```

### 1.4 Update Password
```
PUT /auth/change-password
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

## 2. PATIENT ENDPOINTS

### 2.1 Get Patient Profile
```
GET /patients/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "patientId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "bloodGroup": "O+",
    "address": "123 Street, City",
    "emergencyContact": "9876543211",
    "medicalHistory": "No major illnesses",
    "allergies": "Penicillin"
  }
}
```

### 2.2 Update Patient Profile
```
PUT /patients/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phone": "9876543210",
  "address": "456 New Street, City",
  "bloodGroup": "O+",
  "emergencyContact": "9876543211",
  "medicalHistory": "Diabetes",
  "allergies": "None"
}
```

### 2.3 Get Available Doctors
```
GET /patients/doctors?specialization=Cardiologist&search=Dr.&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "doctorId": 1,
        "name": "Dr. Smith",
        "specialization": "Cardiologist",
        "qualification": "MBBS, MD",
        "experience": 15,
        "consultationFee": 500,
        "rating": 4.5,
        "totalReviews": 120,
        "profilePicture": "/uploads/doctors/doc1.jpg",
        "availableSlots": ["10:00 AM", "11:00 AM", "2:00 PM"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalDoctors": 48,
      "limit": 10
    }
  }
}
```

### 2.4 Book Appointment with Doctor
```
POST /patients/appointments/book
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "doctorId": 1,
  "appointmentDate": "2025-12-05",
  "appointmentTime": "10:00 AM",
  "consultationType": "video|in-person",
  "symptoms": "Chest pain and breathing difficulty",
  "paymentMethod": "razorpay"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Appointment booking initiated",
  "data": {
    "appointmentId": 101,
    "doctorName": "Dr. Smith",
    "appointmentDate": "2025-12-05",
    "appointmentTime": "10:00 AM",
    "consultationFee": 500,
    "razorpayOrderId": "order_NXYZabcd1234",
    "amount": 500,
    "currency": "INR"
  }
}
```

### 2.5 Get Patient Appointments
```
GET /patients/appointments?status=upcoming|completed|cancelled&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "appointmentId": 101,
        "doctorId": 1,
        "doctorName": "Dr. Smith",
        "specialization": "Cardiologist",
        "appointmentDate": "2025-12-05",
        "appointmentTime": "10:00 AM",
        "status": "confirmed",
        "consultationType": "video",
        "consultationFee": 500,
        "paymentStatus": "paid",
        "meetingLink": "https://meet.example.com/abc123"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalAppointments": 25,
      "limit": 10
    }
  }
}
```

### 2.6 Cancel Appointment
```
PUT /patients/appointments/:appointmentId/cancel
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cancellationReason": "Personal emergency"
}
```

### 2.7 Get Prescriptions
```
GET /patients/prescriptions?page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "prescriptions": [
      {
        "prescriptionId": 1,
        "appointmentId": 101,
        "doctorName": "Dr. Smith",
        "date": "2025-12-05",
        "diagnosis": "Hypertension",
        "medicines": [
          {
            "medicineName": "Amlodipine",
            "dosage": "5mg",
            "frequency": "Once daily",
            "duration": "30 days",
            "instructions": "Take after breakfast"
          }
        ],
        "tests": ["ECG", "Blood Pressure Monitoring"],
        "notes": "Avoid high sodium foods",
        "prescriptionFile": "/uploads/prescriptions/pres1.pdf"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalPrescriptions": 15,
      "limit": 10
    }
  }
}
```

### 2.8 Get Diagnostic Centers
```
GET /patients/diagnostic-centers?search=&city=Mumbai&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "centers": [
      {
        "centerId": 1,
        "centreName": "DiagnoLab",
        "address": "789 Health Street, Mumbai",
        "phone": "9876543210",
        "rating": 4.7,
        "services": ["Blood Test", "X-Ray", "MRI", "CT Scan"],
        "operatingHours": "8:00 AM - 8:00 PM"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 4,
      "totalCenters": 35,
      "limit": 10
    }
  }
}
```

### 2.9 Get Diagnostic Tests
```
GET /patients/diagnostic-centers/:centerId/tests
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tests": [
      {
        "testId": 1,
        "testName": "Complete Blood Count (CBC)",
        "description": "Comprehensive blood analysis",
        "price": 300,
        "preparationInstructions": "Fasting for 8-12 hours required",
        "reportDelivery": "24 hours"
      },
      {
        "testId": 2,
        "testName": "Lipid Profile",
        "description": "Cholesterol and triglycerides test",
        "price": 500,
        "preparationInstructions": "Fasting for 12 hours required",
        "reportDelivery": "24 hours"
      }
    ]
  }
}
```

### 2.10 Book Diagnostic Test
```
POST /patients/diagnostic-tests/book
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "centerId": 1,
  "tests": [
    {
      "testId": 1,
      "testName": "Complete Blood Count (CBC)",
      "price": 300
    },
    {
      "testId": 2,
      "testName": "Lipid Profile",
      "price": 500
    }
  ],
  "preferredDate": "2025-12-06",
  "preferredTime": "9:00 AM",
  "prescriptionFile": "base64_encoded_file_or_url",
  "paymentMethod": "razorpay"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Diagnostic test booking initiated",
  "data": {
    "bookingId": 201,
    "centreName": "DiagnoLab",
    "tests": ["CBC", "Lipid Profile"],
    "totalAmount": 800,
    "razorpayOrderId": "order_XYZ123abc",
    "currency": "INR"
  }
}
```

### 2.11 Get Diagnostic Test Bookings
```
GET /patients/diagnostic-tests?status=pending|completed|cancelled&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "bookingId": 201,
        "centerId": 1,
        "centreName": "DiagnoLab",
        "tests": ["CBC", "Lipid Profile"],
        "bookingDate": "2025-12-06",
        "bookingTime": "9:00 AM",
        "status": "confirmed",
        "totalAmount": 800,
        "paymentStatus": "paid",
        "reportStatus": "pending",
        "reportFile": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalBookings": 12,
      "limit": 10
    }
  }
}
```

### 2.12 Get Medical Shops
```
GET /patients/medical-shops?search=&city=Mumbai&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "shops": [
      {
        "shopId": 1,
        "shopName": "MediCare Pharmacy",
        "address": "456 Medicine Lane, Mumbai",
        "phone": "9876543210",
        "rating": 4.6,
        "operatingHours": "24/7",
        "deliveryAvailable": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalShops": 28,
      "limit": 10
    }
  }
}
```

### 2.13 Search Medicines
```
GET /patients/medicines/search?query=amlodipine&shopId=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "medicines": [
      {
        "medicineId": 1,
        "medicineName": "Amlodipine 5mg",
        "manufacturer": "Sun Pharma",
        "price": 120,
        "stock": 50,
        "prescription_required": true,
        "description": "Anti-hypertensive medication"
      }
    ]
  }
}
```

### 2.14 Place Medicine Order
```
POST /patients/medicine-orders
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shopId": 1,
  "medicines": [
    {
      "medicineId": 1,
      "medicineName": "Amlodipine 5mg",
      "quantity": 2,
      "price": 120
    }
  ],
  "deliveryAddress": "123 Street, City, PIN-400001",
  "prescriptionFile": "base64_encoded_file_or_url",
  "paymentMethod": "razorpay"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Medicine order initiated",
  "data": {
    "orderId": 301,
    "shopName": "MediCare Pharmacy",
    "totalAmount": 240,
    "deliveryCharges": 50,
    "finalAmount": 290,
    "razorpayOrderId": "order_ABC789xyz",
    "currency": "INR"
  }
}
```

### 2.15 Get Medicine Orders
```
GET /patients/medicine-orders?status=pending|confirmed|delivered|cancelled&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": 301,
        "shopId": 1,
        "shopName": "MediCare Pharmacy",
        "orderDate": "2025-12-05",
        "medicines": [
          {
            "medicineName": "Amlodipine 5mg",
            "quantity": 2,
            "price": 120
          }
        ],
        "totalAmount": 290,
        "status": "confirmed",
        "paymentStatus": "paid",
        "deliveryAddress": "123 Street, City",
        "estimatedDelivery": "2025-12-07"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalOrders": 18,
      "limit": 10
    }
  }
}
```

---

## 3. DOCTOR ENDPOINTS

### 3.1 Get Doctor Profile
```
GET /doctors/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "doctorId": 1,
    "name": "Dr. Smith",
    "email": "smith@example.com",
    "phone": "9876543210",
    "specialization": "Cardiologist",
    "qualification": "MBBS, MD",
    "experience": 15,
    "licenseNumber": "MED12345",
    "consultationFee": 500,
    "about": "Experienced cardiologist",
    "clinicAddress": "123 Medical Street, Mumbai",
    "rating": 4.5,
    "totalReviews": 120
  }
}
```

### 3.2 Update Doctor Profile
```
PUT /doctors/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "consultationFee": 600,
  "about": "Specialized in cardiac care",
  "clinicAddress": "456 New Clinic, Mumbai"
}
```

### 3.3 Set Availability Schedule
```
POST /doctors/availability
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "schedule": [
    {
      "dayOfWeek": "Monday",
      "slots": [
        { "startTime": "09:00", "endTime": "12:00" },
        { "startTime": "14:00", "endTime": "18:00" }
      ]
    },
    {
      "dayOfWeek": "Tuesday",
      "slots": [
        { "startTime": "09:00", "endTime": "12:00" }
      ]
    }
  ]
}
```

### 3.4 Get Doctor Appointments
```
GET /doctors/appointments?status=pending|confirmed|completed|cancelled&date=2025-12-05&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "appointmentId": 101,
        "patientId": 1,
        "patientName": "John Doe",
        "patientAge": 35,
        "patientGender": "male",
        "appointmentDate": "2025-12-05",
        "appointmentTime": "10:00 AM",
        "consultationType": "video",
        "symptoms": "Chest pain",
        "status": "confirmed",
        "paymentStatus": "paid",
        "meetingLink": "https://meet.example.com/abc123"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalAppointments": 45,
      "limit": 10
    }
  }
}
```

### 3.5 Update Appointment Status
```
PUT /doctors/appointments/:appointmentId/status
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed|completed|cancelled",
  "notes": "Appointment rescheduled"
}
```

### 3.6 Create Prescription
```
POST /doctors/prescriptions
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "appointmentId": 101,
  "patientId": 1,
  "diagnosis": "Hypertension",
  "medicines": [
    {
      "medicineName": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take after breakfast"
    }
  ],
  "tests": ["ECG", "Blood Pressure Monitoring"],
  "notes": "Avoid high sodium foods. Follow up after 1 month.",
  "followUpDate": "2026-01-05"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Prescription created successfully",
  "data": {
    "prescriptionId": 1,
    "patientName": "John Doe",
    "prescriptionFile": "/uploads/prescriptions/pres1.pdf"
  }
}
```

### 3.7 Get Doctor's Prescriptions
```
GET /doctors/prescriptions?patientId=&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

### 3.8 Get Earnings & Statistics
```
GET /doctors/earnings?startDate=2025-12-01&endDate=2025-12-31
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 45000,
    "totalAppointments": 90,
    "completedAppointments": 85,
    "cancelledAppointments": 5,
    "upcomingAppointments": 12,
    "monthlyEarnings": [
      { "month": "December", "earnings": 45000, "appointments": 90 }
    ]
  }
}
```

---

## 4. DIAGNOSTIC CENTER ENDPOINTS

### 4.1 Get Diagnostic Center Profile
```
GET /diagnostic-centers/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "centerId": 1,
    "centreName": "DiagnoLab",
    "email": "info@diagnolab.com",
    "phone": "9876543210",
    "licenseNumber": "DIAG12345",
    "address": "789 Health Street, Mumbai",
    "operatingHours": "8:00 AM - 8:00 PM",
    "rating": 4.7,
    "totalReviews": 85
  }
}
```

### 4.2 Update Diagnostic Center Profile
```
PUT /diagnostic-centers/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "operatingHours": "24/7",
  "address": "New Address, Mumbai"
}
```

### 4.3 Manage Tests/Services
```
POST /diagnostic-centers/tests
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "testName": "Complete Blood Count (CBC)",
  "description": "Comprehensive blood analysis",
  "price": 300,
  "preparationInstructions": "Fasting for 8-12 hours",
  "reportDelivery": "24 hours",
  "category": "Blood Test"
}
```

### 4.4 Get All Tests
```
GET /diagnostic-centers/tests
```
**Headers:** `Authorization: Bearer <token>`

### 4.5 Update Test
```
PUT /diagnostic-centers/tests/:testId
```
**Headers:** `Authorization: Bearer <token>`

### 4.6 Delete Test
```
DELETE /diagnostic-centers/tests/:testId
```
**Headers:** `Authorization: Bearer <token>`

### 4.7 Get Test Bookings
```
GET /diagnostic-centers/bookings?status=pending|confirmed|completed|cancelled&date=2025-12-05&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "bookingId": 201,
        "patientId": 1,
        "patientName": "John Doe",
        "patientPhone": "9876543210",
        "tests": ["CBC", "Lipid Profile"],
        "bookingDate": "2025-12-06",
        "bookingTime": "9:00 AM",
        "totalAmount": 800,
        "status": "confirmed",
        "paymentStatus": "paid",
        "prescriptionFile": "/uploads/prescriptions/pres1.pdf",
        "reportStatus": "pending"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalBookings": 28,
      "limit": 10
    }
  }
}
```

### 4.8 Update Booking Status
```
PUT /diagnostic-centers/bookings/:bookingId/status
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed|sample-collected|processing|completed|cancelled",
  "notes": "Sample collected successfully"
}
```

### 4.9 Upload Test Report
```
POST /diagnostic-centers/bookings/:bookingId/report
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Request Body:**
```
reportFile: <PDF file>
notes: "All parameters normal"
```

### 4.10 Get Earnings & Statistics
```
GET /diagnostic-centers/earnings?startDate=2025-12-01&endDate=2025-12-31
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 125000,
    "totalBookings": 156,
    "completedBookings": 145,
    "pendingBookings": 8,
    "cancelledBookings": 3,
    "popularTests": [
      { "testName": "CBC", "count": 45 },
      { "testName": "Lipid Profile", "count": 38 }
    ]
  }
}
```

---

## 5. MEDICAL SHOP ENDPOINTS

### 5.1 Get Medical Shop Profile
```
GET /medical-shops/profile
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "shopId": 1,
    "shopName": "MediCare Pharmacy",
    "email": "info@medicare.com",
    "phone": "9876543210",
    "licenseNumber": "DRUG12345",
    "address": "456 Medicine Lane, Mumbai",
    "operatingHours": "24/7",
    "deliveryAvailable": true,
    "deliveryCharges": 50,
    "rating": 4.6,
    "totalReviews": 92
  }
}
```

### 5.2 Update Medical Shop Profile
```
PUT /medical-shops/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "operatingHours": "8:00 AM - 10:00 PM",
  "deliveryAvailable": true,
  "deliveryCharges": 40
}
```

### 5.3 Manage Medicine Inventory
```
POST /medical-shops/medicines
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "medicineName": "Amlodipine 5mg",
  "manufacturer": "Sun Pharma",
  "price": 120,
  "stock": 100,
  "prescriptionRequired": true,
  "description": "Anti-hypertensive medication",
  "expiryDate": "2026-12-31",
  "category": "Cardiovascular"
}
```

### 5.4 Get All Medicines
```
GET /medical-shops/medicines?search=&category=&page=1&limit=20
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "medicines": [
      {
        "medicineId": 1,
        "medicineName": "Amlodipine 5mg",
        "manufacturer": "Sun Pharma",
        "price": 120,
        "stock": 100,
        "prescriptionRequired": true,
        "category": "Cardiovascular",
        "expiryDate": "2026-12-31"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalMedicines": 95,
      "limit": 20
    }
  }
}
```

### 5.5 Update Medicine
```
PUT /medical-shops/medicines/:medicineId
```
**Headers:** `Authorization: Bearer <token>`

### 5.6 Delete Medicine
```
DELETE /medical-shops/medicines/:medicineId
```
**Headers:** `Authorization: Bearer <token>`

### 5.7 Get Medicine Orders
```
GET /medical-shops/orders?status=pending|confirmed|processing|delivered|cancelled&date=2025-12-05&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": 301,
        "patientId": 1,
        "patientName": "John Doe",
        "patientPhone": "9876543210",
        "orderDate": "2025-12-05",
        "medicines": [
          {
            "medicineName": "Amlodipine 5mg",
            "quantity": 2,
            "price": 120
          }
        ],
        "totalAmount": 290,
        "status": "confirmed",
        "paymentStatus": "paid",
        "deliveryAddress": "123 Street, City",
        "prescriptionFile": "/uploads/prescriptions/pres1.pdf"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 4,
      "totalOrders": 38,
      "limit": 10
    }
  }
}
```

### 5.8 Update Order Status
```
PUT /medical-shops/orders/:orderId/status
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed|processing|out-for-delivery|delivered|cancelled",
  "notes": "Order dispatched",
  "trackingNumber": "TRACK123456"
}
```

### 5.9 Get Earnings & Statistics
```
GET /medical-shops/earnings?startDate=2025-12-01&endDate=2025-12-31
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 185000,
    "totalOrders": 245,
    "completedOrders": 230,
    "pendingOrders": 10,
    "cancelledOrders": 5,
    "topSellingMedicines": [
      { "medicineName": "Paracetamol", "soldQuantity": 150 },
      { "medicineName": "Amlodipine", "soldQuantity": 95 }
    ]
  }
}
```

---

## 6. PAYMENT ENDPOINTS (RAZORPAY)

### 6.1 Create Razorpay Order
```
POST /payments/create-order
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "appointment|diagnostic-test|medicine-order",
  "referenceId": 101,
  "amount": 500
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_NXYZabcd1234",
    "amount": 500,
    "currency": "INR",
    "razorpayKeyId": "rzp_test_xxxxx"
  }
}
```

### 6.2 Verify Payment (Webhook)
```
POST /payments/webhook
```
**Headers:** 
- `X-Razorpay-Signature: <signature>`

**Request Body:** (Sent by Razorpay)
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xyz123",
        "order_id": "order_NXYZabcd1234",
        "amount": 50000,
        "status": "captured"
      }
    }
  }
}
```

### 6.3 Get Payment History
```
GET /payments/history?type=all|appointment|diagnostic-test|medicine-order&page=1&limit=10
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "paymentId": 1,
        "type": "appointment",
        "referenceId": 101,
        "amount": 500,
        "status": "success",
        "razorpayOrderId": "order_NXYZabcd1234",
        "razorpayPaymentId": "pay_xyz123",
        "paymentMethod": "card",
        "createdAt": "2025-12-05T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalPayments": 28,
      "limit": 10
    }
  }
}
```

### 6.4 Retry Failed Payment
```
POST /payments/retry/:paymentId
```
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_NEW_abc123",
    "amount": 500,
    "currency": "INR",
    "razorpayKeyId": "rzp_test_xxxxx"
  }
}
```

### 6.5 Initiate Refund
```
POST /payments/refund
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentId": "pay_xyz123",
  "amount": 500,
  "reason": "Appointment cancelled by doctor"
}
```

---

## 7. FILE UPLOAD ENDPOINTS

### 7.1 Upload Profile Picture
```
POST /uploads/profile-picture
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: <image file>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "fileUrl": "/uploads/profiles/user1_1733443200.jpg"
  }
}
```

### 7.2 Upload License Certificate
```
POST /uploads/license
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: <PDF/image file>
```

### 7.3 Upload Prescription
```
POST /uploads/prescription
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: <PDF/image file>
```

### 7.4 Upload Test Report
```
POST /uploads/test-report
```
**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Request Body:**
```
file: <PDF file>
bookingId: 201
```

---

## 8. ADMIN ENDPOINTS (Optional)

### 8.1 Get All Users
```
GET /admin/users?role=patient|doctor|diagnostic|medical_shop&page=1&limit=20
```
**Headers:** `Authorization: Bearer <admin-token>`

### 8.2 Verify Doctor/Diagnostic/Shop
```
PUT /admin/verify/:userId
```
**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "verified": true,
  "notes": "All documents verified"
}
```

### 8.3 Get Platform Statistics
```
GET /admin/statistics
```
**Headers:** `Authorization: Bearer <admin-token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5000,
    "totalPatients": 4000,
    "totalDoctors": 500,
    "totalDiagnosticCenters": 200,
    "totalMedicalShops": 300,
    "totalAppointments": 15000,
    "totalRevenue": 7500000,
    "monthlyGrowth": 15.5
  }
}
```

---

## ERROR RESPONSES

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes:

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Example Validation Error:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

## RATE LIMITING

- Public endpoints: 100 requests/15 minutes
- Authenticated endpoints: 1000 requests/15 minutes
- Payment endpoints: 50 requests/15 minutes

---

## NOTES

1. All monetary amounts are in Indian Rupees (₹)
2. All dates are in ISO 8601 format
3. File uploads limited to 10MB per file
4. Supported image formats: JPG, PNG, WEBP
5. Supported document formats: PDF
6. Pagination default: page=1, limit=10
7. Maximum limit per request: 100
