const db = require('../config/database');

class Appointment {
  /**
   * Create new appointment
   */
  static async create(appointmentData) {
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      consultationFee
    } = appointmentData;

    const [result] = await db.query(
      `INSERT INTO appointments 
       (patient_id, doctor_id, appointment_date, appointment_time, 
        consultation_type, symptoms, consultation_fee, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [patientId, doctorId, appointmentDate, appointmentTime, 
       consultationType, symptoms, consultationFee]
    );

    return result.insertId;
  }

  /**
   * Get appointment by ID
   */
  static async findById(appointmentId) {
    const [appointments] = await db.query(
      `SELECT a.*, 
              p.name as patient_name, p.phone as patient_phone,
              d.name as doctor_name, d.specialization
       FROM appointments a
       JOIN patients p ON a.patient_id = p.patient_id
       JOIN doctors d ON a.doctor_id = d.doctor_id
       WHERE a.appointment_id = ?`,
      [appointmentId]
    );

    return appointments[0];
  }

  /**
   * Get appointments for patient
   */
  static async getPatientAppointments(patientId, filters = {}) {
    let query = `
      SELECT a.*, 
             d.name as doctor_name, 
             d.specialization,
             d.profile_picture as doctor_picture
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      WHERE a.patient_id = ?
    `;

    const params = [patientId];

    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const [appointments] = await db.query(query, params);
    return appointments;
  }

  /**
   * Get appointments for doctor
   */
  static async getDoctorAppointments(doctorId, filters = {}) {
    let query = `
      SELECT a.*, 
             p.name as patient_name, 
             p.phone as patient_phone,
             p.date_of_birth,
             p.gender
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.doctor_id = ?
    `;

    const params = [doctorId];

    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      query += ' AND a.appointment_date = ?';
      params.push(filters.date);
    }

    query += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';

    const [appointments] = await db.query(query, params);
    return appointments;
  }

  /**
   * Update appointment status
   */
  static async updateStatus(appointmentId, status, notes = null) {
    await db.query(
      `UPDATE appointments 
       SET status = ?, doctor_notes = ?, updated_at = NOW()
       WHERE appointment_id = ?`,
      [status, notes, appointmentId]
    );
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(appointmentId, paymentStatus) {
    await db.query(
      'UPDATE appointments SET payment_status = ? WHERE appointment_id = ?',
      [paymentStatus, appointmentId]
    );
  }

  /**
   * Cancel appointment
   */
  static async cancel(appointmentId, cancelledBy, reason) {
    await db.query(
      `UPDATE appointments 
       SET status = 'cancelled', 
           cancellation_reason = ?, 
           cancelled_by = ?,
           updated_at = NOW()
       WHERE appointment_id = ?`,
      [reason, cancelledBy, appointmentId]
    );
  }

  /**
   * Check slot availability
   */
  static async isSlotAvailable(doctorId, appointmentDate, appointmentTime) {
    const [appointments] = await db.query(
      `SELECT appointment_id FROM appointments 
       WHERE doctor_id = ? 
       AND appointment_date = ? 
       AND appointment_time = ? 
       AND status != 'cancelled'`,
      [doctorId, appointmentDate, appointmentTime]
    );

    return appointments.length === 0;
  }
}

module.exports = Appointment;
