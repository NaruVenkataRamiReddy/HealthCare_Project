const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create order (patients only)
router.post('/', authorize('PATIENT'), orderController.createOrder);

// Get orders (patients and shops)
router.get('/', authorize('PATIENT', 'SHOP'), orderController.getOrders);

// Update order status (shops only)
router.put('/:orderId/status', authorize('SHOP'), orderController.updateOrderStatus);

// Cancel order (patients and shops)
router.put('/:orderId/cancel', authorize('PATIENT', 'SHOP'), orderController.cancelOrder);

module.exports = router;
