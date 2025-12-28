const db = require('../config/database');

class Prescription {
  /**
   * Create new prescription
   */
  static async create(prescriptionData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        appointmentId,
        patientId,
        doctorId,
        diagnosis,
        medicines,
        tests,
        notes,
        followUpDate
      } = prescriptionData;

      // Create prescription
      const [result] = await connection.query(
        `INSERT INTO prescriptions 
         (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [appointmentId, patientId, doctorId, diagnosis, notes, followUpDate]
      );

      const prescriptionId = result.insertId;

      // Add medicines
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

      // Add tests
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

      await connection.commit();
      return prescriptionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get prescription by ID
   */
  static async findById(prescriptionId) {
    const [prescriptions] = await db.query(
      `SELECT p.*, 
              d.name as doctor_name,
              pat.name as patient_name,
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
       JOIN patients pat ON p.patient_id = pat.patient_id
       WHERE p.prescription_id = ?`,
      [prescriptionId]
    );

    return prescriptions[0];
  }

  /**
   * Get prescriptions for patient
   */
  static async getPatientPrescriptions(patientId, limit = 10, offset = 0) {
    const [prescriptions] = await db.query(
      `SELECT p.prescription_id, p.appointment_id, p.diagnosis, p.notes, 
              p.follow_up_date, p.created_at,
              d.name as doctor_name, d.specialization,
              (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'medicineName', pm.medicine_name,
                  'dosage', pm.dosage,
                  'frequency', pm.frequency,
                  'duration', pm.duration
                )
              ) FROM prescription_medicines pm 
               WHERE pm.prescription_id = p.prescription_id) as medicines,
              (SELECT JSON_ARRAYAGG(pt.test_name) 
               FROM prescription_tests pt 
               WHERE pt.prescription_id = p.prescription_id) as tests
       FROM prescriptions p
       JOIN doctors d ON p.doctor_id = d.doctor_id
       WHERE p.patient_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [patientId, limit, offset]
    );

    return prescriptions;
  }

  /**
   * Get prescriptions for doctor
   */
  static async getDoctorPrescriptions(doctorId, limit = 10, offset = 0) {
    const [prescriptions] = await db.query(
      `SELECT p.prescription_id, p.appointment_id, p.diagnosis, p.notes, 
              p.created_at,
              pat.name as patient_name
       FROM prescriptions p
       JOIN patients pat ON p.patient_id = pat.patient_id
       WHERE p.doctor_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [doctorId, limit, offset]
    );

    return prescriptions;
  }

  /**
   * Count patient prescriptions
   */
  static async countPatientPrescriptions(patientId) {
    const [result] = await db.query(
      'SELECT COUNT(*) as total FROM prescriptions WHERE patient_id = ?',
      [patientId]
    );
    return result[0].total;
  }
}

module.exports = Prescription;
