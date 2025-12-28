const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const { generateBillId } = require('../utils/generateBillId');

/**
 * Create Razorpay order
 */
exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { type, referenceId, amount } = req.body;

    // Validate payment type
    const validTypes = ['appointment', 'diagnostic-test', 'medicine-order'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: generateBillId(),
      notes: {
        userId,
        type,
        referenceId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment record
    await Payment.create({
      userId,
      paymentType: type,
      referenceId,
      amount,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: amount,
        currency: 'INR',
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

/**
 * Verify payment
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get payment record
    const payment = await Payment.findByRazorpayOrderId(razorpay_order_id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Update payment status
    await Payment.updateStatus(razorpay_order_id, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentMethod: 'razorpay',
      status: 'success'
    });

    // Update reference status
    if (payment.payment_type === 'appointment') {
      await Appointment.updatePaymentStatus(payment.reference_id, 'paid');
      await Appointment.updateStatus(payment.reference_id, 'confirmed');
    } else if (payment.payment_type === 'medicine-order') {
      await Order.updatePaymentStatus(payment.reference_id, 'paid');
      await Order.updateStatus(payment.reference_id, 'confirmed');
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
        status: 'success'
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * Get payment history
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { type = 'all', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const payments = await Payment.getUserPayments(userId, { type, limit, offset });
    const total = await Payment.countUserPayments(userId, type);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalPayments: total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      error: error.message
    });
  }
};

/**
 * Razorpay webhook handler
 */
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ success: false });
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    console.log('Webhook received:', event);

    if (event === 'payment.captured') {
      const { order_id, id: payment_id, method } = payload;

      await Payment.updateStatus(order_id, {
        razorpayPaymentId: payment_id,
        paymentMethod: method,
        status: 'success'
      });

      const payment = await Payment.findByRazorpayOrderId(order_id);
      if (payment) {
        if (payment.payment_type === 'appointment') {
          await Appointment.updatePaymentStatus(payment.reference_id, 'paid');
        } else if (payment.payment_type === 'medicine-order') {
          await Order.updatePaymentStatus(payment.reference_id, 'paid');
        }
      }
    } else if (event === 'payment.failed') {
      const { order_id, error_description } = payload;
      await Payment.markFailed(order_id, error_description);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};
