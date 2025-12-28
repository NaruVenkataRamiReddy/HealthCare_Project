const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   */
  static async create(userData) {
    const { email, password, role, name, phone } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, role, is_active) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, role, true]
    );

    return result.insertId;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  }

  /**
   * Find user by ID
   */
  static async findById(userId) {
    const [users] = await db.query(
      'SELECT user_id, email, role, is_active FROM users WHERE user_id = ?',
      [userId]
    );
    return users[0];
  }

  /**
   * Validate password
   */
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user
   */
  static async update(userId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    await db.query(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      [...values, userId]
    );
  }

  /**
   * Get user profile based on role
   */
  static async getProfile(userId, role) {
    let query, table;

    switch(role) {
      case 'PATIENT':
        table = 'patients';
        query = `
          SELECT p.*, u.email 
          FROM patients p 
          JOIN users u ON p.user_id = u.user_id 
          WHERE p.user_id = ?
        `;
        break;
      case 'DOCTOR':
        table = 'doctors';
        query = `
          SELECT d.*, u.email 
          FROM doctors d 
          JOIN users u ON d.user_id = u.user_id 
          WHERE d.user_id = ?
        `;
        break;
      case 'DIAGNOSTICS':
        table = 'diagnostic_centers';
        query = `
          SELECT dc.*, u.email 
          FROM diagnostic_centers dc 
          JOIN users u ON dc.user_id = u.user_id 
          WHERE dc.user_id = ?
        `;
        break;
      case 'SHOP':
        table = 'medical_shops';
        query = `
          SELECT ms.*, u.email 
          FROM medical_shops ms 
          JOIN users u ON ms.user_id = u.user_id 
          WHERE ms.user_id = ?
        `;
        break;
      default:
        return null;
    }

    const [profiles] = await db.query(query, [userId]);
    return profiles[0];
  }
}

module.exports = User;
