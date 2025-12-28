const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const db = require('../config/database');

/**
 * Create prescription
 */
exports.createPrescription = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { appointmentId, diagnosis, medicines, tests, notes, followUpDate } = req.body;

    if (role !== 'DOCTOR') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create prescriptions'
      });
    }

    // Get doctor ID
    const [doctors] = await db.query('SELECT doctor_id FROM doctors WHERE user_id = ?', [userId]);
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    const doctorId = doctors[0].doctor_id;

    // Verify appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor_id !== doctorId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Get patient ID from appointment
    const [patientData] = await db.query(
      'SELECT patient_id FROM appointments WHERE appointment_id = ?',
      [appointmentId]
    );
    const patientId = patientData[0].patient_id;

    // Create prescription
    const prescriptionId = await Prescription.create({
      appointmentId,
      patientId,
      doctorId,
      diagnosis,
      medicines,
      tests,
      notes,
      followUpDate
    });

    // Update appointment status
    await Appointment.updateStatus(appointmentId, 'completed');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescriptionId }
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prescription',
      error: error.message
    });
  }
};

/**
 * Get prescriptions
 */
exports.getPrescriptions = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let prescriptions, total;

    if (role === 'PATIENT') {
      const [patients] = await db.query('SELECT patient_id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
      prescriptions = await Prescription.getPatientPrescriptions(patients[0].patient_id, parseInt(limit), parseInt(offset));
      total = await Prescription.countPatientPrescriptions(patients[0].patient_id);
    } else if (role === 'DOCTOR') {
      const [doctors] = await db.query('SELECT doctor_id FROM doctors WHERE user_id = ?', [userId]);
      if (doctors.length === 0) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      prescriptions = await Prescription.getDoctorPrescriptions(doctors[0].doctor_id, parseInt(limit), parseInt(offset));
      total = prescriptions.length; // Simplified
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalPrescriptions: total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptions',
      error: error.message
    });
  }
};

/**
 * Get prescription by ID
 */
exports.getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription',
      error: error.message
    });
  }
};
