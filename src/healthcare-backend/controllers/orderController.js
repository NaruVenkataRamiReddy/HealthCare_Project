const Order = require('../models/Order');
const db = require('../config/database');

/**
 * Create medicine order
 */
exports.createOrder = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { shopId, medicines, deliveryAddress, prescriptionFile } = req.body;

    if (role !== 'PATIENT') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can place orders'
      });
    }

    // Get patient ID
    const [patients] = await db.query('SELECT patient_id FROM patients WHERE user_id = ?', [userId]);
    if (patients.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    const patientId = patients[0].patient_id;

    // Create order
    const orderResult = await Order.create({
      patientId,
      shopId,
      medicines,
      deliveryAddress,
      prescriptionFile
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: orderResult
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Get orders
 */
exports.getOrders = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { status, date } = req.query;

    let orders;

    if (role === 'PATIENT') {
      const [patients] = await db.query('SELECT patient_id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
      orders = await Order.getPatientOrders(patients[0].patient_id, { status });
    } else if (role === 'SHOP') {
      const [shops] = await db.query('SELECT shop_id FROM medical_shops WHERE user_id = ?', [userId]);
      if (shops.length === 0) {
        return res.status(404).json({ success: false, message: 'Shop not found' });
      }
      orders = await Order.getShopOrders(shops[0].shop_id, { status, date });
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    if (role !== 'SHOP') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify shop owns the order
    const [shops] = await db.query('SELECT shop_id FROM medical_shops WHERE user_id = ?', [userId]);
    if (shops[0].shop_id !== order.shop_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Order.updateStatus(orderId, status, trackingNumber);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

/**
 * Cancel order
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel delivered order' });
    }

    await Order.cancel(orderId, cancellationReason);

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};
