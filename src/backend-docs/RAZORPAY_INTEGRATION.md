# Razorpay Payment Integration Guide

Complete guide for integrating Razorpay payment gateway with support for Cards, UPI, NetBanking, and Wallets.

---

## Table of Contents

1. [Razorpay Setup](#1-razorpay-setup)
2. [Backend Configuration](#2-backend-configuration)
3. [Payment Flow](#3-payment-flow)
4. [Backend Implementation](#4-backend-implementation)
5. [Webhook Implementation](#5-webhook-implementation)
6. [Frontend Integration](#6-frontend-integration)
7. [Testing](#7-testing)
8. [Error Handling](#8-error-handling)
9. [Security Best Practices](#9-security-best-practices)

---

## 1. Razorpay Setup

### Create Razorpay Account

1. **Sign up** at [https://razorpay.com](https://razorpay.com)
2. **Verify your account** with business details
3. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Test Mode keys for development
   - Generate Live Mode keys for production

### API Keys

```
Test Mode:
Key ID: rzp_test_xxxxxxxxxxxxx
Key Secret: your_test_secret_key

Live Mode:
Key ID: rzp_live_xxxxxxxxxxxxx
Key Secret: your_live_secret_key
```

### Webhook Configuration

1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`, `payment.refunded`
4. Save webhook secret for verification

---

## 2. Backend Configuration

### Install Razorpay SDK

```bash
npm install razorpay crypto
```

### Environment Variables

Add to `.env`:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_key

# Currency
RAZORPAY_CURRENCY=INR
```

### config/razorpay.js

```javascript
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpayInstance;
```

---

## 3. Payment Flow

### Complete Payment Workflow

```
1. User initiates payment (book appointment/order)
   ↓
2. Backend creates Razorpay order
   ↓
3. Backend returns order details to frontend
   ↓
4. Frontend displays Razorpay Checkout
   ↓
5. User completes payment (Card/UPI/NetBanking/Wallet)
   ↓
6. Razorpay sends webhook to backend
   ↓
7. Backend verifies payment signature
   ↓
8. Backend updates database (payment status, appointment/order status)
   ↓
9. User receives confirmation
```

---

## 4. Backend Implementation

### controllers/payment.controller.js

```javascript
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const db = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');

class PaymentController {
  /**
   * Create Razorpay Order
   * POST /api/payments/create-order
   */
  static async createOrder(req, res) {
    try {
      const { type, referenceId, amount } = req.body;
      const userId = req.user.userId;

      // Validate payment type
      const validTypes = ['appointment', 'diagnostic-test', 'medicine-order'];
      if (!validTypes.includes(type)) {
        return ResponseHandler.error(res, 'Invalid payment type', 400);
      }

      // Validate amount
      if (!amount || amount <= 0) {
        return ResponseHandler.error(res, 'Invalid amount', 400);
      }

      // Verify reference exists based on type
      let referenceQuery, tableName;
      if (type === 'appointment') {
        tableName = 'appointments';
        referenceQuery = 'SELECT appointment_id, patient_id FROM appointments WHERE appointment_id = ?';
      } else if (type === 'diagnostic-test') {
        tableName = 'diagnostic_bookings';
        referenceQuery = 'SELECT booking_id, patient_id FROM diagnostic_bookings WHERE booking_id = ?';
      } else if (type === 'medicine-order') {
        tableName = 'medicine_orders';
        referenceQuery = 'SELECT order_id, patient_id FROM medicine_orders WHERE order_id = ?';
      }

      const [reference] = await db.query(referenceQuery, [referenceId]);
      if (reference.length === 0) {
        return ResponseHandler.error(res, 'Reference not found', 404);
      }

      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Amount in paise (₹500 = 50000 paise)
        currency: process.env.RAZORPAY_CURRENCY || 'INR',
        receipt: `${type}_${referenceId}_${Date.now()}`,
        notes: {
          userId,
          type,
          referenceId
        }
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Save payment record in database
      await db.query(
        `INSERT INTO payments (user_id, payment_type, reference_id, amount, currency, 
         razorpay_order_id, status) VALUES (?, ?, ?, ?, ?, ?, 'created')`,
        [userId, type, referenceId, amount, options.currency, razorpayOrder.id]
      );

      return ResponseHandler.success(res, {
        orderId: razorpayOrder.id,
        amount: amount,
        currency: options.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      }, 'Order created successfully');
    } catch (error) {
      console.error('Create order error:', error);
      return ResponseHandler.error(res, 'Failed to create payment order', 500);
    }
  }

  /**
   * Verify Payment (Called from Frontend after payment)
   * POST /api/payments/verify
   */
  static async verifyPayment(req, res) {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature 
      } = req.body;

      // Verify signature
      const isValid = PaymentController.verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return ResponseHandler.error(res, 'Invalid payment signature', 400);
      }

      // Get payment record
      const [payments] = await db.query(
        'SELECT * FROM payments WHERE razorpay_order_id = ?',
        [razorpay_order_id]
      );

      if (payments.length === 0) {
        return ResponseHandler.error(res, 'Payment record not found', 404);
      }

      const payment = payments[0];

      // Update payment record
      await db.query(
        `UPDATE payments SET razorpay_payment_id = ?, razorpay_signature = ?, 
         status = 'success', updated_at = NOW() WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      // Update reference status based on payment type
      await PaymentController.updateReferenceStatus(
        payment.payment_type, 
        payment.reference_id, 
        'paid'
      );

      return ResponseHandler.success(res, {
        paymentId: razorpay_payment_id,
        status: 'success'
      }, 'Payment verified successfully');
    } catch (error) {
      console.error('Verify payment error:', error);
      return ResponseHandler.error(res, 'Payment verification failed', 500);
    }
  }

  /**
   * Razorpay Webhook Handler
   * POST /api/payments/webhook
   */
  static async handleWebhook(req, res) {
    try {
      // Verify webhook signature
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
        await PaymentController.handlePaymentCaptured(payload);
      } else if (event === 'payment.failed') {
        await PaymentController.handlePaymentFailed(payload);
      } else if (event === 'refund.processed') {
        await PaymentController.handleRefundProcessed(payload);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ success: false });
    }
  }

  /**
   * Get Payment History
   * GET /api/payments/history
   */
  static async getPaymentHistory(req, res) {
    try {
      const userId = req.user.userId;
      const { type, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE user_id = ?';
      let queryParams = [userId];

      if (type && type !== 'all') {
        whereClause += ' AND payment_type = ?';
        queryParams.push(type);
      }

      const [payments] = await db.query(
        `SELECT payment_id, payment_type, reference_id, amount, currency, 
         razorpay_order_id, razorpay_payment_id, payment_method, status, 
         created_at FROM payments ${whereClause} 
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM payments ${whereClause}`,
        queryParams
      );

      return ResponseHandler.success(res, {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(countResult[0].total / limit),
          totalPayments: countResult[0].total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      return ResponseHandler.error(res, 'Failed to get payment history', 500);
    }
  }

  /**
   * Retry Failed Payment
   * POST /api/payments/retry/:paymentId
   */
  static async retryPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const userId = req.user.userId;

      // Get failed payment
      const [payments] = await db.query(
        `SELECT * FROM payments WHERE payment_id = ? AND user_id = ? 
         AND status = 'failed'`,
        [paymentId, userId]
      );

      if (payments.length === 0) {
        return ResponseHandler.error(res, 'Payment not found or not failed', 404);
      }

      const payment = payments[0];

      // Create new Razorpay order
      const options = {
        amount: Math.round(payment.amount * 100),
        currency: payment.currency,
        receipt: `retry_${payment.payment_type}_${payment.reference_id}_${Date.now()}`,
        notes: {
          userId: payment.user_id,
          type: payment.payment_type,
          referenceId: payment.reference_id,
          retryOf: paymentId
        }
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Create new payment record
      await db.query(
        `INSERT INTO payments (user_id, payment_type, reference_id, amount, currency, 
         razorpay_order_id, status, metadata) 
         VALUES (?, ?, ?, ?, ?, ?, 'created', ?)`,
        [
          payment.user_id, 
          payment.payment_type, 
          payment.reference_id, 
          payment.amount, 
          payment.currency, 
          razorpayOrder.id,
          JSON.stringify({ retryOf: paymentId })
        ]
      );

      return ResponseHandler.success(res, {
        orderId: razorpayOrder.id,
        amount: payment.amount,
        currency: payment.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      }, 'Retry order created successfully');
    } catch (error) {
      console.error('Retry payment error:', error);
      return ResponseHandler.error(res, 'Failed to retry payment', 500);
    }
  }

  /**
   * Initiate Refund
   * POST /api/payments/refund
   */
  static async initiateRefund(req, res) {
    try {
      const { paymentId, amount, reason } = req.body;
      const userId = req.user.userId;

      // Get payment record
      const [payments] = await db.query(
        `SELECT * FROM payments WHERE payment_id = ? AND user_id = ? 
         AND status = 'success'`,
        [paymentId, userId]
      );

      if (payments.length === 0) {
        return ResponseHandler.error(res, 'Payment not found or cannot be refunded', 404);
      }

      const payment = payments[0];

      // Create refund
      const refundOptions = {
        payment_id: payment.razorpay_payment_id,
        amount: Math.round(amount * 100), // Amount in paise
        notes: {
          reason,
          userId
        }
      };

      const refund = await razorpay.payments.refund(refundOptions);

      // Update payment record
      await db.query(
        `UPDATE payments SET refund_id = ?, refund_amount = ?, 
         refund_status = 'pending', status = 'refunded' 
         WHERE payment_id = ?`,
        [refund.id, amount, paymentId]
      );

      // Update reference status
      await PaymentController.updateReferenceStatus(
        payment.payment_type, 
        payment.reference_id, 
        'refunded'
      );

      return ResponseHandler.success(res, {
        refundId: refund.id,
        amount: amount,
        status: refund.status
      }, 'Refund initiated successfully');
    } catch (error) {
      console.error('Refund error:', error);
      return ResponseHandler.error(res, 'Failed to initiate refund', 500);
    }
  }

  // ============ Helper Methods ============

  /**
   * Verify Razorpay signature
   */
  static verifySignature(orderId, paymentId, signature) {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    
    return expectedSignature === signature;
  }

  /**
   * Update reference status (appointment/booking/order)
   */
  static async updateReferenceStatus(type, referenceId, paymentStatus) {
    try {
      let updateQuery;
      if (type === 'appointment') {
        updateQuery = `UPDATE appointments SET payment_status = ?, 
                       status = 'confirmed' WHERE appointment_id = ?`;
      } else if (type === 'diagnostic-test') {
        updateQuery = `UPDATE diagnostic_bookings SET payment_status = ?, 
                       status = 'confirmed' WHERE booking_id = ?`;
      } else if (type === 'medicine-order') {
        updateQuery = `UPDATE medicine_orders SET payment_status = ?, 
                       status = 'confirmed' WHERE order_id = ?`;
      }

      await db.query(updateQuery, [paymentStatus, referenceId]);
    } catch (error) {
      console.error('Update reference status error:', error);
    }
  }

  /**
   * Handle payment captured webhook
   */
  static async handlePaymentCaptured(payload) {
    try {
      const { order_id, id: payment_id, method, status } = payload;

      await db.query(
        `UPDATE payments SET razorpay_payment_id = ?, payment_method = ?, 
         status = 'success', updated_at = NOW() WHERE razorpay_order_id = ?`,
        [payment_id, method, order_id]
      );

      // Get payment to update reference
      const [payments] = await db.query(
        'SELECT payment_type, reference_id FROM payments WHERE razorpay_order_id = ?',
        [order_id]
      );

      if (payments.length > 0) {
        await PaymentController.updateReferenceStatus(
          payments[0].payment_type,
          payments[0].reference_id,
          'paid'
        );
      }

      console.log('Payment captured:', payment_id);
    } catch (error) {
      console.error('Handle payment captured error:', error);
    }
  }

  /**
   * Handle payment failed webhook
   */
  static async handlePaymentFailed(payload) {
    try {
      const { order_id, id: payment_id, error_description } = payload;

      await db.query(
        `UPDATE payments SET razorpay_payment_id = ?, status = 'failed', 
         failure_reason = ?, updated_at = NOW() WHERE razorpay_order_id = ?`,
        [payment_id, error_description, order_id]
      );

      // Get payment to update reference
      const [payments] = await db.query(
        'SELECT payment_type, reference_id FROM payments WHERE razorpay_order_id = ?',
        [order_id]
      );

      if (payments.length > 0) {
        await PaymentController.updateReferenceStatus(
          payments[0].payment_type,
          payments[0].reference_id,
          'failed'
        );
      }

      console.log('Payment failed:', payment_id);
    } catch (error) {
      console.error('Handle payment failed error:', error);
    }
  }

  /**
   * Handle refund processed webhook
   */
  static async handleRefundProcessed(payload) {
    try {
      const { id: refund_id, payment_id } = payload;

      await db.query(
        `UPDATE payments SET refund_status = 'processed' 
         WHERE razorpay_payment_id = ?`,
        [payment_id]
      );

      console.log('Refund processed:', refund_id);
    } catch (error) {
      console.error('Handle refund processed error:', error);
    }
  }
}

module.exports = PaymentController;
```

### routes/payment.routes.js

```javascript
const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const authenticateToken = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

// Protected routes
router.post('/create-order', authenticateToken, paymentLimiter, PaymentController.createOrder);
router.post('/verify', authenticateToken, PaymentController.verifyPayment);
router.get('/history', authenticateToken, PaymentController.getPaymentHistory);
router.post('/retry/:paymentId', authenticateToken, PaymentController.retryPayment);
router.post('/refund', authenticateToken, PaymentController.initiateRefund);

// Webhook (no auth - verified by signature)
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook);

module.exports = router;
```

---

## 5. Webhook Implementation

### Webhook URL Setup

**Development (using ngrok for local testing):**
```bash
ngrok http 5000
# Use the HTTPS URL: https://xyz123.ngrok.io/api/payments/webhook
```

**Production:**
```
https://yourdomain.com/api/payments/webhook
```

### Webhook Events to Handle

1. **payment.captured** - Payment successful
2. **payment.failed** - Payment failed
3. **refund.processed** - Refund completed

---

## 6. Frontend Integration

### Example Frontend Implementation (React)

```javascript
import axios from 'axios';

const handlePayment = async (appointmentData) => {
  try {
    // Step 1: Create Razorpay order
    const orderResponse = await axios.post('/api/payments/create-order', {
      type: 'appointment',
      referenceId: appointmentData.appointmentId,
      amount: appointmentData.consultationFee
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { orderId, amount, currency, razorpayKeyId } = orderResponse.data.data;

    // Step 2: Configure Razorpay options
    const options = {
      key: razorpayKeyId,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      name: 'Healthcare App',
      description: 'Appointment Booking',
      order_id: orderId,
      handler: async function (response) {
        // Step 3: Verify payment on backend
        try {
          await axios.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          alert('Payment successful!');
          // Redirect to success page
        } catch (error) {
          alert('Payment verification failed');
        }
      },
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.phone
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
        }
      }
    };

    // Step 4: Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to initiate payment');
  }
};
```

### Load Razorpay Script

Add to your HTML:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## 7. Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card Number: `4000 0000 0000 0002`

### Test UPI

- UPI ID: `success@razorpay`
- UPI ID (Failure): `failure@razorpay`

### Test Netbanking

Select any bank from the list in test mode.

### Testing Webhooks Locally

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm run dev

# In another terminal, start ngrok
ngrok http 5000

# Use the HTTPS URL in Razorpay webhook settings
```

---

## 8. Error Handling

### Common Error Scenarios

```javascript
// Error handling in payment flow
try {
  const razorpayOrder = await razorpay.orders.create(options);
} catch (error) {
  if (error.error && error.error.code === 'BAD_REQUEST_ERROR') {
    // Invalid amount or parameters
    return ResponseHandler.error(res, 'Invalid payment parameters', 400);
  } else if (error.error && error.error.code === 'GATEWAY_ERROR') {
    // Razorpay service down
    return ResponseHandler.error(res, 'Payment gateway unavailable', 503);
  } else {
    // Generic error
    return ResponseHandler.error(res, 'Payment initiation failed', 500);
  }
}
```

---

## 9. Security Best Practices

### 1. Always Verify Signatures

```javascript
// Never trust frontend data without verification
const isValid = verifySignature(orderId, paymentId, signature);
if (!isValid) {
  throw new Error('Invalid signature');
}
```

### 2. Use HTTPS Only

```javascript
// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production' && req.protocol === 'http') {
  return res.redirect('https://' + req.get('host') + req.url);
}
```

### 3. Secure Webhook Endpoint

```javascript
// Verify webhook signature
const webhookSignature = req.headers['x-razorpay-signature'];
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (webhookSignature !== expectedSignature) {
  return res.status(400).json({ success: false });
}
```

### 4. Never Expose Secret Keys

```javascript
// ✅ Correct - Key ID only
res.json({ razorpayKeyId: process.env.RAZORPAY_KEY_ID });

// ❌ Wrong - Never send secret
// res.json({ razorpaySecret: process.env.RAZORPAY_KEY_SECRET });
```

### 5. Implement Rate Limiting

```javascript
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many payment requests'
});
```

### 6. Log All Transactions

```javascript
// Log payment attempts
await db.query(
  `INSERT INTO activity_logs (user_id, action, entity_type, metadata) 
   VALUES (?, 'payment_initiated', 'payment', ?)`,
  [userId, JSON.stringify({ orderId, amount })]
);
```

---

## Production Checklist

- [ ] Switch to Live Mode API keys
- [ ] Update webhook URL to production domain
- [ ] Enable HTTPS (SSL certificate)
- [ ] Test all payment methods in production
- [ ] Set up proper error logging
- [ ] Implement transaction reconciliation
- [ ] Add payment notifications (email/SMS)
- [ ] Monitor failed payments
- [ ] Set up refund policy
- [ ] Compliance with PCI DSS standards

---

## Currency Conversion

All amounts in this application use **Indian Rupees (₹)**:

```javascript
// Frontend displays: ₹500
// Backend stores: 500 (as DECIMAL)
// Razorpay receives: 50000 (paise = amount * 100)
```

---

## Support & Documentation

- **Razorpay Docs**: https://razorpay.com/docs/
- **API Reference**: https://razorpay.com/docs/api/
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Support**: support@razorpay.com
