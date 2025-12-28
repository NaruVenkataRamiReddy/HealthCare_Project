const db = require('../config/database');

class Payment {
  /**
   * Create payment record
   */
  static async create(paymentData) {
    const {
      userId,
      paymentType,
      referenceId,
      amount,
      currency = 'INR',
      razorpayOrderId
    } = paymentData;

    const [result] = await db.query(
      `INSERT INTO payments 
       (user_id, payment_type, reference_id, amount, currency, 
        razorpay_order_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'created')`,
      [userId, paymentType, referenceId, amount, currency, razorpayOrderId]
    );

    return result.insertId;
  }

  /**
   * Find payment by Razorpay order ID
   */
  static async findByRazorpayOrderId(razorpayOrderId) {
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE razorpay_order_id = ?',
      [razorpayOrderId]
    );
    return payments[0];
  }

  /**
   * Find payment by ID
   */
  static async findById(paymentId) {
    const [payments] = await db.query(
      'SELECT * FROM payments WHERE payment_id = ?',
      [paymentId]
    );
    return payments[0];
  }

  /**
   * Update payment status
   */
  static async updateStatus(razorpayOrderId, updateData) {
    const {
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod,
      status
    } = updateData;

    await db.query(
      `UPDATE payments 
       SET razorpay_payment_id = ?, 
           razorpay_signature = ?, 
           payment_method = ?,
           status = ?, 
           updated_at = NOW()
       WHERE razorpay_order_id = ?`,
      [razorpayPaymentId, razorpaySignature, paymentMethod, status, razorpayOrderId]
    );
  }

  /**
   * Mark payment as failed
   */
  static async markFailed(razorpayOrderId, reason) {
    await db.query(
      `UPDATE payments 
       SET status = 'failed', failure_reason = ?, updated_at = NOW()
       WHERE razorpay_order_id = ?`,
      [reason, razorpayOrderId]
    );
  }

  /**
   * Get payment history for user
   */
  static async getUserPayments(userId, filters = {}) {
    let query = `
      SELECT payment_id, payment_type, reference_id, amount, currency, 
             razorpay_order_id, razorpay_payment_id, payment_method, 
             status, created_at
      FROM payments
      WHERE user_id = ?
    `;

    const params = [userId];

    if (filters.type && filters.type !== 'all') {
      query += ' AND payment_type = ?';
      params.push(filters.type);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(filters.limit), parseInt(filters.offset || 0));
    }

    const [payments] = await db.query(query, params);
    return payments;
  }

  /**
   * Count user payments
   */
  static async countUserPayments(userId, type = null) {
    let query = 'SELECT COUNT(*) as total FROM payments WHERE user_id = ?';
    const params = [userId];

    if (type && type !== 'all') {
      query += ' AND payment_type = ?';
      params.push(type);
    }

    const [result] = await db.query(query, params);
    return result[0].total;
  }

  /**
   * Create refund record
   */
  static async createRefund(paymentId, refundData) {
    const { refundId, amount, status } = refundData;

    await db.query(
      `UPDATE payments 
       SET refund_id = ?, refund_amount = ?, refund_status = ?, 
           status = 'refunded', updated_at = NOW()
       WHERE payment_id = ?`,
      [refundId, amount, status, paymentId]
    );
  }

  /**
   * Get payments by reference
   */
  static async getByReference(paymentType, referenceId) {
    const [payments] = await db.query(
      `SELECT * FROM payments 
       WHERE payment_type = ? AND reference_id = ?
       ORDER BY created_at DESC`,
      [paymentType, referenceId]
    );
    return payments;
  }
}

module.exports = Payment;
