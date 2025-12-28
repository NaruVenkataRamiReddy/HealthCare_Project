const db = require('../config/database');

class Order {
  /**
   * Create new medicine order
   */
  static async create(orderData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        patientId,
        shopId,
        medicines,
        deliveryAddress,
        prescriptionFile
      } = orderData;

      // Calculate totals
      let totalAmount = 0;
      for (const medicine of medicines) {
        totalAmount += medicine.price * medicine.quantity;
      }

      // Get delivery charges
      const [shops] = await connection.query(
        'SELECT delivery_charges FROM medical_shops WHERE shop_id = ?',
        [shopId]
      );
      
      const deliveryCharges = shops[0]?.delivery_charges || 0;
      const finalAmount = totalAmount + deliveryCharges;

      // Create order
      const [result] = await connection.query(
        `INSERT INTO medicine_orders 
         (patient_id, shop_id, total_amount, delivery_charges, final_amount, 
          delivery_address, prescription_file, status, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
        [patientId, shopId, totalAmount, deliveryCharges, finalAmount, 
         deliveryAddress, prescriptionFile]
      );

      const orderId = result.insertId;

      // Add order items
      for (const medicine of medicines) {
        const subtotal = medicine.price * medicine.quantity;
        
        await connection.query(
          `INSERT INTO medicine_order_items 
           (order_id, medicine_id, medicine_name, quantity, price, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, medicine.medicineId, medicine.medicineName, 
           medicine.quantity, medicine.price, subtotal]
        );

        // Update stock
        await connection.query(
          'UPDATE medicines SET stock = stock - ? WHERE medicine_id = ?',
          [medicine.quantity, medicine.medicineId]
        );
      }

      await connection.commit();
      return { orderId, totalAmount, deliveryCharges, finalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get order by ID
   */
  static async findById(orderId) {
    const [orders] = await db.query(
      `SELECT mo.*, 
              p.name as patient_name, p.phone as patient_phone,
              ms.shop_name,
              (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'medicineName', moi.medicine_name,
                  'quantity', moi.quantity,
                  'price', moi.price,
                  'subtotal', moi.subtotal
                )
              ) FROM medicine_order_items moi 
               WHERE moi.order_id = mo.order_id) as medicines
       FROM medicine_orders mo
       JOIN patients p ON mo.patient_id = p.patient_id
       JOIN medical_shops ms ON mo.shop_id = ms.shop_id
       WHERE mo.order_id = ?`,
      [orderId]
    );

    return orders[0];
  }

  /**
   * Get orders for patient
   */
  static async getPatientOrders(patientId, filters = {}) {
    let query = `
      SELECT mo.*, 
             ms.shop_name, ms.phone as shop_phone,
             (SELECT JSON_ARRAYAGG(
               JSON_OBJECT(
                 'medicineName', moi.medicine_name,
                 'quantity', moi.quantity,
                 'price', moi.price
               )
             ) FROM medicine_order_items moi 
              WHERE moi.order_id = mo.order_id) as medicines
      FROM medicine_orders mo
      JOIN medical_shops ms ON mo.shop_id = ms.shop_id
      WHERE mo.patient_id = ?
    `;

    const params = [patientId];

    if (filters.status) {
      query += ' AND mo.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY mo.order_date DESC';

    const [orders] = await db.query(query, params);
    return orders;
  }

  /**
   * Get orders for shop
   */
  static async getShopOrders(shopId, filters = {}) {
    let query = `
      SELECT mo.*, 
             p.name as patient_name, p.phone as patient_phone,
             (SELECT JSON_ARRAYAGG(
               JSON_OBJECT(
                 'medicineName', moi.medicine_name,
                 'quantity', moi.quantity,
                 'price', moi.price,
                 'subtotal', moi.subtotal
               )
             ) FROM medicine_order_items moi 
              WHERE moi.order_id = mo.order_id) as medicines
      FROM medicine_orders mo
      JOIN patients p ON mo.patient_id = p.patient_id
      WHERE mo.shop_id = ?
    `;

    const params = [shopId];

    if (filters.status) {
      query += ' AND mo.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      query += ' AND DATE(mo.order_date) = ?';
      params.push(filters.date);
    }

    query += ' ORDER BY mo.order_date DESC';

    const [orders] = await db.query(query, params);
    return orders;
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId, status, trackingNumber = null) {
    await db.query(
      `UPDATE medicine_orders 
       SET status = ?, tracking_number = ?, updated_at = NOW()
       WHERE order_id = ?`,
      [status, trackingNumber, orderId]
    );
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(orderId, paymentStatus) {
    await db.query(
      'UPDATE medicine_orders SET payment_status = ? WHERE order_id = ?',
      [paymentStatus, orderId]
    );
  }

  /**
   * Cancel order
   */
  static async cancel(orderId, reason) {
    await db.query(
      `UPDATE medicine_orders 
       SET status = 'cancelled', 
           cancellation_reason = ?,
           updated_at = NOW()
       WHERE order_id = ?`,
      [reason, orderId]
    );
  }
}

module.exports = Order;
