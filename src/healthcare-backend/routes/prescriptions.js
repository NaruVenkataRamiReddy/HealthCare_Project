const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create prescription (doctors only)
router.post('/', authorize('DOCTOR'), prescriptionController.createPrescription);

// Get prescriptions (patients and doctors)
router.get('/', authorize('PATIENT', 'DOCTOR'), prescriptionController.getPrescriptions);

// Get prescription by ID
router.get('/:prescriptionId', prescriptionController.getPrescriptionById);

module.exports = router;
