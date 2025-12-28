const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Create Razorpay order (requires authentication)
router.post('/create-order', auth, paymentController.createOrder);

// Verify payment (requires authentication)
router.post('/verify', auth, paymentController.verifyPayment);

// Get payment history (requires authentication)
router.get('/history', auth, paymentController.getPaymentHistory);

// Webhook (no authentication - verified by signature)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
