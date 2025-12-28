const Appointment = require('../models/Appointment');
const db = require('../config/database');

/**
 * Book appointment
 */
exports.bookAppointment = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { doctorId, appointmentDate, appointmentTime, consultationType, symptoms } = req.body;

    if (role !== 'PATIENT') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can book appointments'
      });
    }

    // Get patient ID
    const [patients] = await db.query('SELECT patient_id FROM patients WHERE user_id = ?', [userId]);
    if (patients.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    const patientId = patients[0].patient_id;

    // Get doctor and consultation fee
    const [doctors] = await db.query(
      'SELECT doctor_id, name, consultation_fee FROM doctors WHERE doctor_id = ?',
      [doctorId]
    );
    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const doctor = doctors[0];

    // Check slot availability
    const isAvailable = await Appointment.isSlotAvailable(doctorId, appointmentDate, appointmentTime);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointmentId = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      consultationFee: doctor.consultation_fee
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointmentId,
        doctorName: doctor.name,
        appointmentDate,
        appointmentTime,
        consultationFee: doctor.consultation_fee
      }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
};

/**
 * Get appointments
 */
exports.getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { status, date } = req.query;

    let appointments;

    if (role === 'PATIENT') {
      const [patients] = await db.query('SELECT patient_id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
      appointments = await Appointment.getPatientAppointments(patients[0].patient_id, { status });
    } else if (role === 'DOCTOR') {
      const [doctors] = await db.query('SELECT doctor_id FROM doctors WHERE user_id = ?', [userId]);
      if (doctors.length === 0) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      appointments = await Appointment.getDoctorAppointments(doctors[0].doctor_id, { status, date });
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: error.message
    });
  }
};

/**
 * Update appointment status
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Authorization check
    if (role === 'DOCTOR') {
      const [doctors] = await db.query('SELECT doctor_id FROM doctors WHERE user_id = ?', [userId]);
      if (doctors[0].doctor_id !== appointment.doctor_id) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    }

    await Appointment.updateStatus(appointmentId, status, notes);

    res.json({
      success: true,
      message: 'Appointment status updated successfully'
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

/**
 * Cancel appointment
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { appointmentId } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
    }

    await Appointment.cancel(appointmentId, role.toLowerCase(), cancellationReason);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};
