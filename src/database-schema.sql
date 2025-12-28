-- Healthcare+ Database Schema
-- MySQL/MariaDB

-- Drop existing tables (if any)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS medicine_orders;
DROP TABLE IF EXISTS tests_orders;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS medical_shops;
DROP TABLE IF EXISTS diagnostics;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS patients;

-- Patients Table
CREATE TABLE patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_deleted (is_deleted)
);

-- Doctors Table
CREATE TABLE doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  qualifications TEXT NOT NULL,
  certificate_path VARCHAR(500),
  consultation_fee DECIMAL(10,2) DEFAULT 50.00,
  password_hash VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_specialization (specialization),
  INDEX idx_deleted (is_deleted)
);

-- Diagnostics Centers Table
CREATE TABLE diagnostics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  centre_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  operator_name VARCHAR(255) NOT NULL,
  age INT,
  gender ENUM('male', 'female', 'other'),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  qualifications TEXT,
  certificate_path VARCHAR(500),
  password_hash VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_deleted (is_deleted)
);

-- Medical Shops Table
CREATE TABLE medical_shops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shop_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  license_path VARCHAR(500),
  password_hash VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_deleted (is_deleted)
);

-- Appointments Table
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  symptoms TEXT NOT NULL,
  date_time DATETIME NOT NULL,
  status ENUM('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'REQUESTED',
  consultation_notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_date (date_time),
  INDEX idx_status (status),
  INDEX idx_deleted (is_deleted)
);

-- Test Orders Table
CREATE TABLE tests_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  diagnostics_id INT NOT NULL,
  test_list JSON NOT NULL,
  scheduled_at DATETIME NOT NULL,
  status ENUM('REQUESTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'REQUESTED',
  report_path VARCHAR(500),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (diagnostics_id) REFERENCES diagnostics(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_diagnostics (diagnostics_id),
  INDEX idx_status (status),
  INDEX idx_deleted (is_deleted)
);

-- Medicine Orders Table
CREATE TABLE medicine_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  shop_id INT NOT NULL,
  items_json JSON NOT NULL,
  prescription_path VARCHAR(500),
  delivery_address TEXT NOT NULL,
  total_amount DECIMAL(10,2),
  status ENUM('REQUESTED', 'ACCEPTED', 'DISPATCHED', 'DELIVERED', 'CANCELLED') DEFAULT 'REQUESTED',
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (shop_id) REFERENCES medical_shops(id) ON DELETE CASCADE,
  INDEX idx_patient (patient_id),
  INDEX idx_shop (shop_id),
  INDEX idx_status (status),
  INDEX idx_deleted (is_deleted)
);

-- Prescriptions Table
CREATE TABLE prescriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  diagnosis TEXT NOT NULL,
  medicines_json JSON NOT NULL,
  notes TEXT,
  prescription_file_path VARCHAR(500),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_appointment (appointment_id),
  INDEX idx_deleted (is_deleted)
);

-- Payments Table
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bill_id VARCHAR(100) UNIQUE NOT NULL,
  user_type ENUM('PATIENT', 'DOCTOR', 'DIAGNOSTICS', 'SHOP') NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  purpose ENUM('APPOINTMENT', 'TEST', 'MEDICINE_ORDER') NOT NULL,
  reference_id VARCHAR(100),  -- Links to appointment_id, test_order_id, or medicine_order_id
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(500),
  payment_method VARCHAR(50),
  status ENUM('PENDING', 'SUCCESS', 'FAILED', 'TIMEOUT') DEFAULT 'PENDING',
  expires_at DATETIME NULL,
  paid_at DATETIME NULL,
  metadata_json JSON NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_bill_id (bill_id),
  INDEX idx_razorpay_order (razorpay_order_id),
  INDEX idx_razorpay_payment (razorpay_payment_id),
  INDEX idx_status (status),
  INDEX idx_user (user_type, user_id),
  INDEX idx_reference (reference_id),
  INDEX idx_deleted (is_deleted)
);

-- Reviews Table
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewer_id INT NOT NULL,  -- Patient ID
  reviewer_type ENUM('PATIENT') DEFAULT 'PATIENT',
  target_type ENUM('DOCTOR', 'DIAGNOSTICS', 'SHOP') NOT NULL,
  target_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_target (target_type, target_id),
  INDEX idx_reviewer (reviewer_id),
  INDEX idx_rating (rating),
  INDEX idx_deleted (is_deleted),
  UNIQUE KEY unique_review (reviewer_id, target_type, target_id)  -- One review per service
);

-- Consultation Videos Table (Optional)
CREATE TABLE consultation_videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  video_path VARCHAR(500),
  duration_minutes INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_appointment (appointment_id),
  INDEX idx_doctor (doctor_id),
  INDEX idx_patient (patient_id),
  INDEX idx_deleted (is_deleted)
);

-- Sample seed data (passwords are 'password123' hashed with bcrypt)
-- Note: In production, use proper bcrypt hashing

INSERT INTO patients (name, username, email, phone, address, password_hash) VALUES
('John Doe', 'johndoe', 'john@example.com', '+1234567890', '123 Main St, New York, NY 10001', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('Jane Smith', 'janesmith', 'jane@example.com', '+1234567891', '456 Oak Ave, Los Angeles, CA 90001', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('Mike Johnson', 'mikejohnson', 'mike@example.com', '+1234567892', '789 Pine Rd, Chicago, IL 60601', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS');

INSERT INTO doctors (name, age, gender, phone, email, specialization, qualifications, consultation_fee, password_hash) VALUES
('Dr. Sarah Johnson', 42, 'female', '+1234567893', 'sarah.johnson@healthcareplus.com', 'Cardiologist', 'MBBS, MD Cardiology, Fellowship in Interventional Cardiology', 50.00, '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('Dr. Michael Chen', 38, 'male', '+1234567894', 'michael.chen@healthcareplus.com', 'General Physician', 'MBBS, MD Internal Medicine', 40.00, '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('Dr. Emily Rodriguez', 35, 'female', '+1234567895', 'emily.rodriguez@healthcareplus.com', 'Dermatologist', 'MBBS, MD Dermatology', 45.00, '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('Dr. David Miller', 45, 'male', '+1234567896', 'david.miller@healthcareplus.com', 'Pediatrician', 'MBBS, MD Pediatrics, DCH', 55.00, '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS');

INSERT INTO diagnostics (centre_name, address, operator_name, age, gender, phone, email, qualifications, password_hash) VALUES
('MediScan Diagnostics', '456 Health Ave, Medical District, NY 10002', 'John Manager', 40, 'male', '+1234567897', 'mediscan@healthcareplus.com', 'BSc Medical Technology, Certified Lab Technician', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('HealthCheck Labs', '789 Diagnostic Blvd, Central Area, LA 90002', 'Lisa Operator', 37, 'female', '+1234567898', 'healthcheck@healthcareplus.com', 'BSc Clinical Laboratory Science', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS');

INSERT INTO medical_shops (shop_name, owner_name, address, phone, email, password_hash) VALUES
('HealthPlus Pharmacy', 'Mike Wilson', '789 Pharmacy Lane, Medical District, NY 10003', '+1234567899', 'healthplus@healthcareplus.com', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('MediCare Pharmacy', 'Lisa Anderson', '456 Health Street, Central Area, LA 90003', '+1234567800', 'medicare@healthcareplus.com', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS'),
('QuickMed Pharmacy', 'Tom Brown', '123 Medical Ave, East Side, Chicago 60602', '+1234567801', 'quickmed@healthcareplus.com', '$2b$10$rBV2qNvLxPqHqMQwVLl1P.Pp1XZl0sWAGzFnRzGcPGPz8VPQvHfqS');

-- Sample appointments
INSERT INTO appointments (patient_id, doctor_id, symptoms, date_time, status) VALUES
(1, 1, 'Chest pain and irregular heartbeat', '2025-11-23 10:00:00', 'CONFIRMED'),
(1, 2, 'Fever and cough for 3 days', '2025-11-25 14:30:00', 'CONFIRMED'),
(2, 3, 'Skin rash on arms', '2025-11-20 11:00:00', 'COMPLETED');

-- Sample payments
INSERT INTO payments (bill_id, user_type, user_id, amount, currency, purpose, reference_id, razorpay_order_id, razorpay_payment_id, status, payment_method, paid_at) VALUES
('BILL-2024-001', 'PATIENT', 1, 50.00, 'USD', 'APPOINTMENT', '1', 'order_M3K8hL9Qz2P4F1', 'pay_N5J9kM2Rz3Q5G2', 'SUCCESS', 'card', NOW()),
('BILL-2024-002', 'PATIENT', 1, 40.00, 'USD', 'APPOINTMENT', '2', 'order_N4L9iM3Sz4R6H3', 'pay_O6K0lN4Tz5S7I4', 'SUCCESS', 'upi', NOW()),
('BILL-2024-003', 'PATIENT', 2, 45.00, 'USD', 'APPOINTMENT', '3', 'order_O5M0jN4Tz5S7I4', 'pay_P7L1mO5Uz6T8J5', 'SUCCESS', 'netbanking', NOW());

-- Sample prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, diagnosis, medicines_json, notes) VALUES
(1, 1, 1, 'Hypertension management', '[{"name":"Aspirin 75mg","dosage":"1 tablet daily"},{"name":"Atorvastatin 10mg","dosage":"1 tablet at night"}]', 'Take medicines after meals. Follow up in 2 weeks.'),
(2, 3, 3, 'Allergic dermatitis', '[{"name":"Hydrocortisone cream","dosage":"Apply twice daily"},{"name":"Antihistamine tablets","dosage":"1 tablet at night"}]', 'Avoid known allergens. Use moisturizer regularly.');

-- Sample reviews
INSERT INTO reviews (reviewer_id, target_type, target_id, rating, comment) VALUES
(1, 'DOCTOR', 1, 5, 'Excellent doctor! Very thorough examination and clear explanation.'),
(2, 'DOCTOR', 3, 5, 'Great dermatologist. Skin cleared up within days!'),
(1, 'SHOP', 1, 5, 'Fast delivery and genuine medicines.');
