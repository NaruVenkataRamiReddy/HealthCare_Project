# Example Controller Implementations

Complete example implementations for Patient, Doctor, Diagnostic Center, and Medical Shop controllers.

---

## Table of Contents

1. [Patient Controller](#patient-controller)
2. [Doctor Controller](#doctor-controller)
3. [Diagnostic Center Controller](#diagnostic-center-controller)
4. [Medical Shop Controller](#medical-shop-controller)

---

## Patient Controller

### controllers/patient.controller.js

```javascript
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

class PatientController {
  /**
   * Get Patient Profile
   * GET /api/patients/profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const [patients] = await db.query(
        `SELECT p.*, u.email FROM patients p 
         JOIN users u ON p.user_id = u.user_id 
         WHERE p.user_id = ?`,
        [userId]
      );

      if (patients.length === 0) {
        return ResponseHandler.error(res, 'Patient not found', 404);
      }

      return ResponseHandler.success(res, patients[0]);
    } catch (error) {
      console.error('Get profile error:', error);
      return ResponseHandler.error(res, 'Failed to get profile', 500);
    }
  }

  /**
   * Update Patient Profile
   * PUT /api/patients/profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const {
        phone,
        address,
        city,
        state,
        pincode,
        bloodGroup,
        emergencyContact,
        medicalHistory,
        allergies
      } = req.body;

      await db.query(
        `UPDATE patients 
         SET phone = ?, address = ?, city = ?, state = ?, pincode = ?,
             blood_group = ?, emergency_contact = ?, medical_history = ?, 
             allergies = ?, updated_at = NOW()
         WHERE user_id = ?`,
        [phone, address, city, state, pincode, bloodGroup, emergencyContact, 
         medicalHistory, allergies, userId]
      );

      return ResponseHandler.success(res, null, 'Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      return ResponseHandler.error(res, 'Failed to update profile', 500);
    }
  }

  /**
   * Get Available Doctors
   * GET /api/patients/doctors
   */
  static async getDoctors(req, res) {
    try {
      const { specialization, search, city, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE d.is_verified = TRUE AND u.is_active = TRUE';
      let queryParams = [];

      if (specialization) {
        whereClause += ' AND d.specialization = ?';
        queryParams.push(specialization);
      }

      if (search) {
        whereClause += ' AND d.name LIKE ?';
        queryParams.push(`%${search}%`);
      }

      if (city) {
        whereClause += ' AND d.city = ?';
        queryParams.push(city);
      }

      const [doctors] = await db.query(
        `SELECT d.doctor_id, d.name, d.specialization, d.qualification, 
         d.experience, d.consultation_fee, d.rating, d.total_reviews, 
         d.profile_picture, d.city
         FROM doctors d
         JOIN users u ON d.user_id = u.user_id
         ${whereClause}
         ORDER BY d.rating DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM doctors d 
         JOIN users u ON d.user_id = u.user_id ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalDoctors: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get doctors error:', error);
      return ResponseHandler.error(res, 'Failed to get doctors', 500);
    }
  }

  /**
   * Book Appointment with Doctor
   * POST /api/patients/appointments/book
   */
  static async bookAppointment(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = req.user.userId;
      const {
        doctorId,
        appointmentDate,
        appointmentTime,
        consultationType,
        symptoms
      } = req.body;

      // Get patient ID
      const [patients] = await connection.query(
        'SELECT patient_id FROM patients WHERE user_id = ?',
        [userId]
      );

      if (patients.length === 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'Patient not found', 404);
      }

      const patientId = patients[0].patient_id;

      // Get doctor details and consultation fee
      const [doctors] = await connection.query(
        `SELECT doctor_id, consultation_fee FROM doctors 
         WHERE doctor_id = ? AND is_verified = TRUE`,
        [doctorId]
      );

      if (doctors.length === 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'Doctor not found', 404);
      }

      const consultationFee = doctors[0].consultation_fee;

      // Check if slot is available
      const [existingAppointments] = await connection.query(
        `SELECT appointment_id FROM appointments 
         WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? 
         AND status NOT IN ('cancelled')`,
        [doctorId, appointmentDate, appointmentTime]
      );

      if (existingAppointments.length > 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'This time slot is already booked', 409);
      }

      // Create appointment
      const [appointmentResult] = await connection.query(
        `INSERT INTO appointments 
         (patient_id, doctor_id, appointment_date, appointment_time, 
          consultation_type, symptoms, consultation_fee, status, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
        [patientId, doctorId, appointmentDate, appointmentTime, 
         consultationType, symptoms, consultationFee]
      );

      const appointmentId = appointmentResult.insertId;

      // Get doctor name for response
      const [doctorInfo] = await connection.query(
        'SELECT name FROM doctors WHERE doctor_id = ?',
        [doctorId]
      );

      await connection.commit();

      return ResponseHandler.success(res, {
        appointmentId,
        doctorName: doctorInfo[0].name,
        appointmentDate,
        appointmentTime,
        consultationFee,
        message: 'Appointment created. Please complete payment.'
      }, 'Appointment booking initiated', 201);
    } catch (error) {
      await connection.rollback();
      console.error('Book appointment error:', error);
      return ResponseHandler.error(res, 'Failed to book appointment', 500);
    } finally {
      connection.release();
    }
  }

  /**
   * Get Patient Appointments
   * GET /api/patients/appointments
   */
  static async getAppointments(req, res) {
    try {
      const userId = req.user.userId;
      const { status, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Get patient ID
      const [patients] = await db.query(
        'SELECT patient_id FROM patients WHERE user_id = ?',
        [userId]
      );

      if (patients.length === 0) {
        return ResponseHandler.error(res, 'Patient not found', 404);
      }

      const patientId = patients[0].patient_id;

      let whereClause = 'WHERE a.patient_id = ?';
      let queryParams = [patientId];

      if (status) {
        whereClause += ' AND a.status = ?';
        queryParams.push(status);
      }

      const [appointments] = await db.query(
        `SELECT a.appointment_id, a.doctor_id, d.name as doctor_name, 
         d.specialization, a.appointment_date, a.appointment_time, 
         a.consultation_type, a.symptoms, a.status, a.payment_status, 
         a.consultation_fee, a.meeting_link, a.created_at
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.doctor_id
         ${whereClause}
         ORDER BY a.appointment_date DESC, a.appointment_time DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM appointments ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalAppointments: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get appointments error:', error);
      return ResponseHandler.error(res, 'Failed to get appointments', 500);
    }
  }

  /**
   * Cancel Appointment
   * PUT /api/patients/appointments/:appointmentId/cancel
   */
  static async cancelAppointment(req, res) {
    try {
      const userId = req.user.userId;
      const { appointmentId } = req.params;
      const { cancellationReason } = req.body;

      // Get patient ID
      const [patients] = await db.query(
        'SELECT patient_id FROM patients WHERE user_id = ?',
        [userId]
      );

      if (patients.length === 0) {
        return ResponseHandler.error(res, 'Patient not found', 404);
      }

      const patientId = patients[0].patient_id;

      // Verify appointment belongs to patient
      const [appointments] = await db.query(
        `SELECT appointment_id, status, payment_status FROM appointments 
         WHERE appointment_id = ? AND patient_id = ?`,
        [appointmentId, patientId]
      );

      if (appointments.length === 0) {
        return ResponseHandler.error(res, 'Appointment not found', 404);
      }

      if (appointments[0].status === 'cancelled') {
        return ResponseHandler.error(res, 'Appointment already cancelled', 400);
      }

      if (appointments[0].status === 'completed') {
        return ResponseHandler.error(res, 'Cannot cancel completed appointment', 400);
      }

      // Update appointment
      await db.query(
        `UPDATE appointments 
         SET status = 'cancelled', cancellation_reason = ?, 
             cancelled_by = 'patient', updated_at = NOW()
         WHERE appointment_id = ?`,
        [cancellationReason, appointmentId]
      );

      // If payment was made, initiate refund (handled separately)
      if (appointments[0].payment_status === 'paid') {
        // TODO: Initiate refund process
      }

      return ResponseHandler.success(res, null, 'Appointment cancelled successfully');
    } catch (error) {
      console.error('Cancel appointment error:', error);
      return ResponseHandler.error(res, 'Failed to cancel appointment', 500);
    }
  }

  /**
   * Get Prescriptions
   * GET /api/patients/prescriptions
   */
  static async getPrescriptions(req, res) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Get patient ID
      const [patients] = await db.query(
        'SELECT patient_id FROM patients WHERE user_id = ?',
        [userId]
      );

      if (patients.length === 0) {
        return ResponseHandler.error(res, 'Patient not found', 404);
      }

      const patientId = patients[0].patient_id;

      // Get prescriptions with medicines and tests
      const [prescriptions] = await db.query(
        `SELECT p.prescription_id, p.appointment_id, d.name as doctor_name, 
         p.diagnosis, p.notes, p.follow_up_date, p.prescription_file, 
         p.created_at,
         (SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
             'medicineName', pm.medicine_name,
             'dosage', pm.dosage,
             'frequency', pm.frequency,
             'duration', pm.duration,
             'instructions', pm.instructions
           )
         ) FROM prescription_medicines pm 
          WHERE pm.prescription_id = p.prescription_id) as medicines,
         (SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
             'testName', pt.test_name,
             'instructions', pt.test_instructions
           )
         ) FROM prescription_tests pt 
          WHERE pt.prescription_id = p.prescription_id) as tests
         FROM prescriptions p
         JOIN doctors d ON p.doctor_id = d.doctor_id
         WHERE p.patient_id = ?
         ORDER BY p.created_at DESC
         LIMIT ? OFFSET ?`,
        [patientId, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM prescriptions WHERE patient_id = ?`,
        [patientId]
      );

      return ResponseHandler.success(res, {
        prescriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalPrescriptions: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get prescriptions error:', error);
      return ResponseHandler.error(res, 'Failed to get prescriptions', 500);
    }
  }

  /**
   * Search Medicines
   * GET /api/patients/medicines/search
   */
  static async searchMedicines(req, res) {
    try {
      const { query, shopId } = req.query;

      let whereClause = 'WHERE m.is_active = TRUE';
      let queryParams = [];

      if (shopId) {
        whereClause += ' AND m.shop_id = ?';
        queryParams.push(shopId);
      }

      if (query) {
        whereClause += ' AND m.medicine_name LIKE ?';
        queryParams.push(`%${query}%`);
      }

      const [medicines] = await db.query(
        `SELECT m.medicine_id, m.medicine_name, m.manufacturer, m.price, 
         m.stock, m.prescription_required, m.description, m.category,
         ms.shop_name
         FROM medicines m
         JOIN medical_shops ms ON m.shop_id = ms.shop_id
         ${whereClause}
         LIMIT 50`,
        queryParams
      );

      return ResponseHandler.success(res, { medicines });
    } catch (error) {
      console.error('Search medicines error:', error);
      return ResponseHandler.error(res, 'Failed to search medicines', 500);
    }
  }

  /**
   * Place Medicine Order
   * POST /api/patients/medicine-orders
   */
  static async placeMedicineOrder(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = req.user.userId;
      const { shopId, medicines, deliveryAddress, prescriptionFile } = req.body;

      // Get patient ID
      const [patients] = await connection.query(
        'SELECT patient_id FROM patients WHERE user_id = ?',
        [userId]
      );

      if (patients.length === 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'Patient not found', 404);
      }

      const patientId = patients[0].patient_id;

      // Get shop delivery charges
      const [shops] = await connection.query(
        'SELECT delivery_charges FROM medical_shops WHERE shop_id = ?',
        [shopId]
      );

      if (shops.length === 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'Medical shop not found', 404);
      }

      const deliveryCharges = shops[0].delivery_charges;

      // Calculate total amount
      let totalAmount = 0;
      for (const medicine of medicines) {
        totalAmount += medicine.price * medicine.quantity;
      }

      const finalAmount = totalAmount + deliveryCharges;

      // Create order
      const [orderResult] = await connection.query(
        `INSERT INTO medicine_orders 
         (patient_id, shop_id, total_amount, delivery_charges, final_amount, 
          delivery_address, prescription_file, status, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
        [patientId, shopId, totalAmount, deliveryCharges, finalAmount, 
         deliveryAddress, prescriptionFile]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const medicine of medicines) {
        const subtotal = medicine.price * medicine.quantity;
        
        await connection.query(
          `INSERT INTO medicine_order_items 
           (order_id, medicine_id, medicine_name, quantity, price, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, medicine.medicineId, medicine.medicineName, 
           medicine.quantity, medicine.price, subtotal]
        );

        // Update medicine stock
        await connection.query(
          'UPDATE medicines SET stock = stock - ? WHERE medicine_id = ?',
          [medicine.quantity, medicine.medicineId]
        );
      }

      await connection.commit();

      return ResponseHandler.success(res, {
        orderId,
        totalAmount,
        deliveryCharges,
        finalAmount,
        message: 'Order created. Please complete payment.'
      }, 'Medicine order initiated', 201);
    } catch (error) {
      await connection.rollback();
      console.error('Place medicine order error:', error);
      return ResponseHandler.error(res, 'Failed to place order', 500);
    } finally {
      connection.release();
    }
  }
}

module.exports = PatientController;
```

---

## Doctor Controller

### controllers/doctor.controller.js

```javascript
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

class DoctorController {
  /**
   * Get Doctor Appointments
   * GET /api/doctors/appointments
   */
  static async getAppointments(req, res) {
    try {
      const userId = req.user.userId;
      const { status, date, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Get doctor ID
      const [doctors] = await db.query(
        'SELECT doctor_id FROM doctors WHERE user_id = ?',
        [userId]
      );

      if (doctors.length === 0) {
        return ResponseHandler.error(res, 'Doctor not found', 404);
      }

      const doctorId = doctors[0].doctor_id;

      let whereClause = 'WHERE a.doctor_id = ?';
      let queryParams = [doctorId];

      if (status) {
        whereClause += ' AND a.status = ?';
        queryParams.push(status);
      }

      if (date) {
        whereClause += ' AND a.appointment_date = ?';
        queryParams.push(date);
      }

      const [appointments] = await db.query(
        `SELECT a.appointment_id, a.patient_id, p.name as patient_name, 
         p.date_of_birth, p.gender, p.phone, a.appointment_date, 
         a.appointment_time, a.consultation_type, a.symptoms, a.status, 
         a.payment_status, a.meeting_link, a.created_at
         FROM appointments a
         JOIN patients p ON a.patient_id = p.patient_id
         ${whereClause}
         ORDER BY a.appointment_date ASC, a.appointment_time ASC
         LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM appointments ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalAppointments: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get appointments error:', error);
      return ResponseHandler.error(res, 'Failed to get appointments', 500);
    }
  }

  /**
   * Create Prescription
   * POST /api/doctors/prescriptions
   */
  static async createPrescription(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = req.user.userId;
      const {
        appointmentId,
        patientId,
        diagnosis,
        medicines,
        tests,
        notes,
        followUpDate
      } = req.body;

      // Get doctor ID
      const [doctors] = await connection.query(
        'SELECT doctor_id FROM doctors WHERE user_id = ?',
        [userId]
      );

      if (doctors.length === 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'Doctor not found', 404);
      }

      const doctorId = doctors[0].doctor_id;

      // Verify appointment belongs to doctor
      const [appointments] = await connection.query(
        `SELECT appointment_id FROM appointments 
         WHERE appointment_id = ? AND doctor_id = ? AND patient_id = ?`,
        [appointmentId, doctorId, patientId]
      );

      if (appointments.length === 0) {
        await connection.rollback();
        return ResponseHandler.error(res, 'Appointment not found', 404);
      }

      // Create prescription
      const [prescriptionResult] = await connection.query(
        `INSERT INTO prescriptions 
         (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [appointmentId, patientId, doctorId, diagnosis, notes, followUpDate]
      );

      const prescriptionId = prescriptionResult.insertId;

      // Insert medicines
      if (medicines && medicines.length > 0) {
        for (const medicine of medicines) {
          await connection.query(
            `INSERT INTO prescription_medicines 
             (prescription_id, medicine_name, dosage, frequency, duration, instructions)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [prescriptionId, medicine.medicineName, medicine.dosage, 
             medicine.frequency, medicine.duration, medicine.instructions]
          );
        }
      }

      // Insert tests
      if (tests && tests.length > 0) {
        for (const test of tests) {
          await connection.query(
            `INSERT INTO prescription_tests 
             (prescription_id, test_name, test_instructions)
             VALUES (?, ?, ?)`,
            [prescriptionId, test, null]
          );
        }
      }

      // Update appointment status
      await connection.query(
        `UPDATE appointments SET status = 'completed', updated_at = NOW() 
         WHERE appointment_id = ?`,
        [appointmentId]
      );

      await connection.commit();

      return ResponseHandler.success(res, {
        prescriptionId
      }, 'Prescription created successfully', 201);
    } catch (error) {
      await connection.rollback();
      console.error('Create prescription error:', error);
      return ResponseHandler.error(res, 'Failed to create prescription', 500);
    } finally {
      connection.release();
    }
  }

  /**
   * Get Doctor Earnings
   * GET /api/doctors/earnings
   */
  static async getEarnings(req, res) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate } = req.query;

      // Get doctor ID
      const [doctors] = await db.query(
        'SELECT doctor_id FROM doctors WHERE user_id = ?',
        [userId]
      );

      if (doctors.length === 0) {
        return ResponseHandler.error(res, 'Doctor not found', 404);
      }

      const doctorId = doctors[0].doctor_id;

      let whereClause = 'WHERE a.doctor_id = ? AND a.payment_status = "paid"';
      let queryParams = [doctorId];

      if (startDate && endDate) {
        whereClause += ' AND a.appointment_date BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
      }

      // Total earnings
      const [earnings] = await db.query(
        `SELECT 
         SUM(a.consultation_fee) as total_earnings,
         COUNT(*) as total_appointments,
         SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_appointments,
         SUM(CASE WHEN a.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_appointments
         FROM appointments a
         ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        totalEarnings: earnings[0].total_earnings || 0,
        totalAppointments: earnings[0].total_appointments || 0,
        completedAppointments: earnings[0].completed_appointments || 0,
        cancelledAppointments: earnings[0].cancelled_appointments || 0
      });
    } catch (error) {
      console.error('Get earnings error:', error);
      return ResponseHandler.error(res, 'Failed to get earnings', 500);
    }
  }
}

module.exports = DoctorController;
```

---

## Diagnostic Center Controller

### controllers/diagnostic.controller.js

```javascript
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

class DiagnosticController {
  /**
   * Add Diagnostic Test
   * POST /api/diagnostic-centers/tests
   */
  static async addTest(req, res) {
    try {
      const userId = req.user.userId;
      const {
        testName,
        description,
        price,
        preparationInstructions,
        reportDelivery,
        category
      } = req.body;

      // Get center ID
      const [centers] = await db.query(
        'SELECT center_id FROM diagnostic_centers WHERE user_id = ?',
        [userId]
      );

      if (centers.length === 0) {
        return ResponseHandler.error(res, 'Diagnostic center not found', 404);
      }

      const centerId = centers[0].center_id;

      // Insert test
      const [result] = await db.query(
        `INSERT INTO diagnostic_tests 
         (center_id, test_name, description, price, preparation_instructions, 
          report_delivery, category)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [centerId, testName, description, price, preparationInstructions, 
         reportDelivery, category]
      );

      return ResponseHandler.success(res, {
        testId: result.insertId
      }, 'Test added successfully', 201);
    } catch (error) {
      console.error('Add test error:', error);
      return ResponseHandler.error(res, 'Failed to add test', 500);
    }
  }

  /**
   * Get Bookings
   * GET /api/diagnostic-centers/bookings
   */
  static async getBookings(req, res) {
    try {
      const userId = req.user.userId;
      const { status, date, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Get center ID
      const [centers] = await db.query(
        'SELECT center_id FROM diagnostic_centers WHERE user_id = ?',
        [userId]
      );

      if (centers.length === 0) {
        return ResponseHandler.error(res, 'Diagnostic center not found', 404);
      }

      const centerId = centers[0].center_id;

      let whereClause = 'WHERE db.center_id = ?';
      let queryParams = [centerId];

      if (status) {
        whereClause += ' AND db.status = ?';
        queryParams.push(status);
      }

      if (date) {
        whereClause += ' AND db.booking_date = ?';
        queryParams.push(date);
      }

      const [bookings] = await db.query(
        `SELECT db.booking_id, db.patient_id, p.name as patient_name, 
         p.phone, db.booking_date, db.booking_time, db.status, 
         db.payment_status, db.total_amount, db.prescription_file,
         db.report_status, db.report_file,
         (SELECT JSON_ARRAYAGG(test_name) FROM diagnostic_booking_tests 
          WHERE booking_id = db.booking_id) as tests
         FROM diagnostic_bookings db
         JOIN patients p ON db.patient_id = p.patient_id
         ${whereClause}
         ORDER BY db.booking_date ASC, db.booking_time ASC
         LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM diagnostic_bookings ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalBookings: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      return ResponseHandler.error(res, 'Failed to get bookings', 500);
    }
  }
}

module.exports = DiagnosticController;
```

---

## Medical Shop Controller

### controllers/medicalShop.controller.js

```javascript
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

class MedicalShopController {
  /**
   * Add Medicine
   * POST /api/medical-shops/medicines
   */
  static async addMedicine(req, res) {
    try {
      const userId = req.user.userId;
      const {
        medicineName,
        manufacturer,
        price,
        stock,
        prescriptionRequired,
        description,
        expiryDate,
        category
      } = req.body;

      // Get shop ID
      const [shops] = await db.query(
        'SELECT shop_id FROM medical_shops WHERE user_id = ?',
        [userId]
      );

      if (shops.length === 0) {
        return ResponseHandler.error(res, 'Medical shop not found', 404);
      }

      const shopId = shops[0].shop_id;

      // Insert medicine
      const [result] = await db.query(
        `INSERT INTO medicines 
         (shop_id, medicine_name, manufacturer, price, stock, 
          prescription_required, description, expiry_date, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [shopId, medicineName, manufacturer, price, stock, 
         prescriptionRequired, description, expiryDate, category]
      );

      return ResponseHandler.success(res, {
        medicineId: result.insertId
      }, 'Medicine added successfully', 201);
    } catch (error) {
      console.error('Add medicine error:', error);
      return ResponseHandler.error(res, 'Failed to add medicine', 500);
    }
  }

  /**
   * Get Orders
   * GET /api/medical-shops/orders
   */
  static async getOrders(req, res) {
    try {
      const userId = req.user.userId;
      const { status, date, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      // Get shop ID
      const [shops] = await db.query(
        'SELECT shop_id FROM medical_shops WHERE user_id = ?',
        [userId]
      );

      if (shops.length === 0) {
        return ResponseHandler.error(res, 'Medical shop not found', 404);
      }

      const shopId = shops[0].shop_id;

      let whereClause = 'WHERE mo.shop_id = ?';
      let queryParams = [shopId];

      if (status) {
        whereClause += ' AND mo.status = ?';
        queryParams.push(status);
      }

      if (date) {
        whereClause += ' AND DATE(mo.order_date) = ?';
        queryParams.push(date);
      }

      const [orders] = await db.query(
        `SELECT mo.order_id, mo.patient_id, p.name as patient_name, 
         p.phone, mo.order_date, mo.total_amount, mo.delivery_charges, 
         mo.final_amount, mo.status, mo.payment_status, mo.delivery_address,
         mo.prescription_file, mo.tracking_number,
         (SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
             'medicineName', moi.medicine_name,
             'quantity', moi.quantity,
             'price', moi.price,
             'subtotal', moi.subtotal
           )
         ) FROM medicine_order_items moi 
          WHERE moi.order_id = mo.order_id) as medicines
         FROM medicine_orders mo
         JOIN patients p ON mo.patient_id = p.patient_id
         ${whereClause}
         ORDER BY mo.order_date DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM medicine_orders ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalOrders: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      return ResponseHandler.error(res, 'Failed to get orders', 500);
    }
  }

  /**
   * Update Order Status
   * PUT /api/medical-shops/orders/:orderId/status
   */
  static async updateOrderStatus(req, res) {
    try {
      const userId = req.user.userId;
      const { orderId } = req.params;
      const { status, notes, trackingNumber } = req.body;

      // Get shop ID
      const [shops] = await db.query(
        'SELECT shop_id FROM medical_shops WHERE user_id = ?',
        [userId]
      );

      if (shops.length === 0) {
        return ResponseHandler.error(res, 'Medical shop not found', 404);
      }

      const shopId = shops[0].shop_id;

      // Verify order belongs to shop
      const [orders] = await db.query(
        'SELECT order_id FROM medicine_orders WHERE order_id = ? AND shop_id = ?',
        [orderId, shopId]
      );

      if (orders.length === 0) {
        return ResponseHandler.error(res, 'Order not found', 404);
      }

      // Update order
      await db.query(
        `UPDATE medicine_orders 
         SET status = ?, tracking_number = ?, updated_at = NOW()
         WHERE order_id = ?`,
        [status, trackingNumber || null, orderId]
      );

      return ResponseHandler.success(res, null, 'Order status updated successfully');
    } catch (error) {
      console.error('Update order status error:', error);
      return ResponseHandler.error(res, 'Failed to update order status', 500);
    }
  }
}

module.exports = MedicalShopController;
```

---

## Usage Notes

1. **Import these controllers** in your routes files
2. **Add error handling** as needed for your specific use case
3. **Implement additional validations** based on business rules
4. **Add logging** for debugging and monitoring
5. **Optimize queries** with proper indexing
6. **Use transactions** for data integrity
7. **Add caching** for frequently accessed data
8. **Implement pagination** for all list endpoints

---

These controllers provide the core functionality needed for each user role. Customize them based on your specific requirements and business logic.
