const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Book appointment (patients only)
router.post('/book', authorize('PATIENT'), appointmentController.bookAppointment);

// Get appointments (patients and doctors)
router.get('/', authorize('PATIENT', 'DOCTOR'), appointmentController.getAppointments);

// Update appointment status (doctors only)
router.put('/:appointmentId/status', authorize('DOCTOR'), appointmentController.updateAppointmentStatus);

// Cancel appointment (patients and doctors)
router.put('/:appointmentId/cancel', authorize('PATIENT', 'DOCTOR'), appointmentController.cancelAppointment);

module.exports = router;
