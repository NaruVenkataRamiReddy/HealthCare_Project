# Healthcare Application - MySQL Database Schema

## Database Design Overview

This database schema supports a multi-role healthcare platform with:
- **4 User Roles**: Patients, Doctors, Diagnostic Centers, Medical Shops
- **Core Features**: Appointments, Prescriptions, Diagnostic Tests, Medicine Orders, Payments
- **Payment Integration**: Razorpay with order tracking and webhooks

---

## Complete SQL Schema

```sql
-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'diagnostic', 'medical_shop', 'admin') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ============================================
-- 2. PATIENT DETAILS
-- ============================================

CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    emergency_contact VARCHAR(15),
    medical_history TEXT,
    allergies TEXT,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_name (name)
);

-- ============================================
-- 3. DOCTOR DETAILS
-- ============================================

CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    qualification VARCHAR(500) NOT NULL,
    experience INT NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_certificate VARCHAR(500),
    consultation_fee DECIMAL(10, 2) NOT NULL,
    about TEXT,
    clinic_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    profile_picture VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_specialization (specialization),
    INDEX idx_city (city),
    INDEX idx_rating (rating)
);

-- ============================================
-- 4. DOCTOR AVAILABILITY SCHEDULE
-- ============================================

CREATE TABLE doctor_availability (
    availability_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    INDEX idx_doctor_day (doctor_id, day_of_week)
);

-- ============================================
-- 5. DIAGNOSTIC CENTERS
-- ============================================

CREATE TABLE diagnostic_centers (
    center_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    center_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_certificate VARCHAR(500),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10),
    operating_hours VARCHAR(100),
    profile_picture VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_rating (rating)
);

-- ============================================
-- 6. DIAGNOSTIC TESTS/SERVICES
-- ============================================

CREATE TABLE diagnostic_tests (
    test_id INT PRIMARY KEY AUTO_INCREMENT,
    center_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    preparation_instructions TEXT,
    report_delivery VARCHAR(100),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(center_id) ON DELETE CASCADE,
    INDEX idx_center_category (center_id, category),
    INDEX idx_test_name (test_name)
);

-- ============================================
-- 7. MEDICAL SHOPS
-- ============================================

CREATE TABLE medical_shops (
    shop_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    license_certificate VARCHAR(500),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10),
    operating_hours VARCHAR(100),
    delivery_available BOOLEAN DEFAULT FALSE,
    delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
    profile_picture VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_city (city),
    INDEX idx_rating (rating)
);

-- ============================================
-- 8. MEDICINE INVENTORY
-- ============================================

CREATE TABLE medicines (
    medicine_id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    prescription_required BOOLEAN DEFAULT FALSE,
    description TEXT,
    expiry_date DATE,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES medical_shops(shop_id) ON DELETE CASCADE,
    INDEX idx_shop_medicine (shop_id, medicine_name),
    INDEX idx_category (category)
);

-- ============================================
-- 9. APPOINTMENTS
-- ============================================

CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    consultation_type ENUM('video', 'in-person') NOT NULL,
    symptoms TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
    consultation_fee DECIMAL(10, 2) NOT NULL,
    meeting_link VARCHAR(500),
    doctor_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by ENUM('patient', 'doctor', 'system'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    INDEX idx_patient_appointments (patient_id, appointment_date),
    INDEX idx_doctor_appointments (doctor_id, appointment_date),
    INDEX idx_status (status)
);

-- ============================================
-- 10. PRESCRIPTIONS
-- ============================================

CREATE TABLE prescriptions (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis TEXT,
    notes TEXT,
    follow_up_date DATE,
    prescription_file VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    INDEX idx_patient_prescriptions (patient_id),
    INDEX idx_doctor_prescriptions (doctor_id)
);

-- ============================================
-- 11. PRESCRIPTION MEDICINES
-- ============================================

CREATE TABLE prescription_medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    INDEX idx_prescription (prescription_id)
);

-- ============================================
-- 12. PRESCRIPTION TESTS
-- ============================================

CREATE TABLE prescription_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    test_instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    INDEX idx_prescription (prescription_id)
);

-- ============================================
-- 13. DIAGNOSTIC TEST BOOKINGS
-- ============================================

CREATE TABLE diagnostic_bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    center_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'sample-collected', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    prescription_file VARCHAR(500),
    report_status ENUM('pending', 'ready') DEFAULT 'pending',
    report_file VARCHAR(500),
    report_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(center_id) ON DELETE CASCADE,
    INDEX idx_patient_bookings (patient_id, booking_date),
    INDEX idx_center_bookings (center_id, booking_date),
    INDEX idx_status (status)
);

-- ============================================
-- 14. DIAGNOSTIC BOOKING TESTS (Junction Table)
-- ============================================

CREATE TABLE diagnostic_booking_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    test_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES diagnostic_bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES diagnostic_tests(test_id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id)
);

-- ============================================
-- 15. MEDICINE ORDERS
-- ============================================

CREATE TABLE medicine_orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    shop_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'out-for-delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    prescription_file VARCHAR(500),
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES medical_shops(shop_id) ON DELETE CASCADE,
    INDEX idx_patient_orders (patient_id, order_date),
    INDEX idx_shop_orders (shop_id, order_date),
    INDEX idx_status (status)
);

-- ============================================
-- 16. MEDICINE ORDER ITEMS
-- ============================================

CREATE TABLE medicine_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    medicine_id INT NOT NULL,
    medicine_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES medicine_orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
);

-- ============================================
-- 17. PAYMENTS (RAZORPAY INTEGRATION)
-- ============================================

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    payment_type ENUM('appointment', 'diagnostic-test', 'medicine-order') NOT NULL,
    reference_id INT NOT NULL, -- appointment_id, booking_id, or order_id
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(500),
    payment_method VARCHAR(50),
    status ENUM('created', 'pending', 'success', 'failed', 'refunded') DEFAULT 'created',
    failure_reason TEXT,
    refund_id VARCHAR(100),
    refund_amount DECIMAL(10, 2),
    refund_status ENUM('pending', 'processed', 'failed'),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_payments (user_id, payment_type),
    INDEX idx_razorpay_order (razorpay_order_id),
    INDEX idx_reference (payment_type, reference_id),
    INDEX idx_status (status)
);

-- ============================================
-- 18. REVIEWS & RATINGS
-- ============================================

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    review_type ENUM('doctor', 'diagnostic-center', 'medical-shop') NOT NULL,
    reference_id INT NOT NULL, -- doctor_id, center_id, or shop_id
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    INDEX idx_reference (review_type, reference_id),
    INDEX idx_patient (patient_id)
);

-- ============================================
-- 19. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('appointment', 'payment', 'prescription', 'order', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    reference_type VARCHAR(50),
    reference_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id, is_read),
    INDEX idx_created (created_at)
);

-- ============================================
-- 20. SYSTEM LOGS (Optional but Recommended)
-- ============================================

CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_activity (user_id, created_at),
    INDEX idx_entity (entity_type, entity_id)
);

-- ============================================
-- 21. PASSWORD RESET TOKENS
-- ============================================

CREATE TABLE password_reset_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id)
);

-- ============================================
-- 22. EMAIL VERIFICATION TOKENS
-- ============================================

CREATE TABLE email_verification_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id)
);
```

---

## Indexes Summary

### Performance-Critical Indexes:
1. **Users**: email, role
2. **Patients**: city, name
3. **Doctors**: specialization, city, rating
4. **Appointments**: patient_id + date, doctor_id + date, status
5. **Payments**: user_id + type, razorpay_order_id, reference
6. **Orders**: patient_id + date, shop_id + date, status

---

## Relationships Overview

```
users (1) -----> (1) patients
users (1) -----> (1) doctors
users (1) -----> (1) diagnostic_centers
users (1) -----> (1) medical_shops

patients (1) -----> (M) appointments
doctors (1) -----> (M) appointments
appointments (1) -----> (1) prescriptions

patients (1) -----> (M) diagnostic_bookings
diagnostic_centers (1) -----> (M) diagnostic_bookings
diagnostic_bookings (M) -----> (M) diagnostic_tests [via diagnostic_booking_tests]

patients (1) -----> (M) medicine_orders
medical_shops (1) -----> (M) medicine_orders
medicine_orders (1) -----> (M) medicines [via medicine_order_items]

users (1) -----> (M) payments
patients (1) -----> (M) reviews
```

---

## Sample Data Insertion

```sql
-- Insert Admin User
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('admin@healthcare.com', '$2b$10$hashedpassword', 'admin', TRUE);

-- Insert Sample Patient
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('patient@example.com', '$2b$10$hashedpassword', 'patient', TRUE);

INSERT INTO patients (user_id, name, phone, date_of_birth, gender, blood_group, address, city) VALUES
(2, 'John Doe', '9876543210', '1990-01-15', 'male', 'O+', '123 Street, Mumbai', 'Mumbai');

-- Insert Sample Doctor
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('doctor@example.com', '$2b$10$hashedpassword', 'doctor', TRUE);

INSERT INTO doctors (user_id, name, phone, specialization, qualification, experience, license_number, consultation_fee, city, is_verified) VALUES
(3, 'Dr. Rajesh Kumar', '9876543211', 'Cardiologist', 'MBBS, MD (Cardiology)', 15, 'MED123456', 500.00, 'Mumbai', TRUE);

-- Insert Doctor Availability
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES
(1, 'Monday', '09:00:00', '12:00:00'),
(1, 'Monday', '14:00:00', '18:00:00'),
(1, 'Tuesday', '09:00:00', '12:00:00');

-- Insert Sample Diagnostic Center
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('diagnostic@example.com', '$2b$10$hashedpassword', 'diagnostic', TRUE);

INSERT INTO diagnostic_centers (user_id, center_name, phone, email, license_number, address, city, operating_hours, is_verified) VALUES
(4, 'DiagnoLab', '9876543212', 'info@diagnolab.com', 'DIAG123456', '789 Health Street, Mumbai', 'Mumbai', '8:00 AM - 8:00 PM', TRUE);

-- Insert Sample Tests
INSERT INTO diagnostic_tests (center_id, test_name, description, price, preparation_instructions, report_delivery, category) VALUES
(1, 'Complete Blood Count (CBC)', 'Comprehensive blood analysis', 300.00, 'Fasting for 8-12 hours', '24 hours', 'Blood Test'),
(1, 'Lipid Profile', 'Cholesterol and triglycerides', 500.00, 'Fasting for 12 hours', '24 hours', 'Blood Test'),
(1, 'Chest X-Ray', 'Thoracic radiography', 400.00, 'No special preparation', '2 hours', 'Radiology');

-- Insert Sample Medical Shop
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('medshop@example.com', '$2b$10$hashedpassword', 'medical_shop', TRUE);

INSERT INTO medical_shops (user_id, shop_name, phone, email, license_number, address, city, operating_hours, delivery_available, delivery_charges, is_verified) VALUES
(5, 'MediCare Pharmacy', '9876543213', 'info@medicare.com', 'DRUG123456', '456 Medicine Lane, Mumbai', 'Mumbai', '24/7', TRUE, 50.00, TRUE);

-- Insert Sample Medicines
INSERT INTO medicines (shop_id, medicine_name, manufacturer, price, stock, prescription_required, category) VALUES
(1, 'Amlodipine 5mg', 'Sun Pharma', 120.00, 100, TRUE, 'Cardiovascular'),
(1, 'Paracetamol 500mg', 'Cipla', 30.00, 200, FALSE, 'Pain Relief'),
(1, 'Metformin 500mg', 'Dr. Reddy\'s', 80.00, 150, TRUE, 'Diabetes');
```

---

## Database Maintenance Queries

### Clean up expired tokens
```sql
DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR is_used = TRUE;
DELETE FROM email_verification_tokens WHERE expires_at < NOW() OR is_used = TRUE;
```

### Update doctor ratings
```sql
UPDATE doctors d
SET rating = (
    SELECT AVG(rating) 
    FROM reviews 
    WHERE review_type = 'doctor' AND reference_id = d.doctor_id
),
total_reviews = (
    SELECT COUNT(*) 
    FROM reviews 
    WHERE review_type = 'doctor' AND reference_id = d.doctor_id
);
```

### Archive old appointments (Optional)
```sql
CREATE TABLE appointments_archive LIKE appointments;

INSERT INTO appointments_archive 
SELECT * FROM appointments 
WHERE appointment_date < DATE_SUB(NOW(), INTERVAL 1 YEAR);

DELETE FROM appointments 
WHERE appointment_date < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

---

## Backup & Recovery

### Daily Backup Script
```bash
#!/bin/bash
mysqldump -u root -p healthcare_db > backup_$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
mysql -u root -p healthcare_db < backup_20251205.sql
```

---

## Performance Optimization Tips

1. **Enable Query Cache** (if using MySQL 5.7 or earlier)
2. **Regular ANALYZE TABLE** for statistics updates
3. **Monitor slow queries** with slow query log
4. **Use connection pooling** in your application
5. **Index unused column removal** after monitoring
6. **Partitioning** for large tables (appointments, payments)

---

## Security Best Practices

1. **Never store plain passwords** - Always use bcrypt
2. **Use prepared statements** - Prevent SQL injection
3. **Limit user privileges** - Create separate DB users for app
4. **Enable SSL connections** - Encrypt data in transit
5. **Regular backups** - Automated daily backups
6. **Audit logs** - Track all sensitive operations

---

## Connection String Examples

### Node.js (mysql2)
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'healthcare_user',
  password: 'secure_password',
  database: 'healthcare_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### Environment Variables
```env
DB_HOST=localhost
DB_USER=healthcare_user
DB_PASSWORD=secure_password
DB_NAME=healthcare_db
DB_PORT=3306
```
