const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/database');

/**
 * Register new user
 */
exports.register = async (req, res) => {
  try {
    const { email, password, role, name, phone, ...additionalData } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const userId = await User.create({ email, password, role, name, phone });

    // Create role-specific profile
    if (role === 'PATIENT') {
      await db.query(
        `INSERT INTO patients (user_id, name, phone, date_of_birth, gender, address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, phone, additionalData.dateOfBirth || null, 
         additionalData.gender || null, additionalData.address || null]
      );
    } else if (role === 'DOCTOR') {
      await db.query(
        `INSERT INTO doctors (user_id, name, phone, specialization, qualification, 
         experience, license_number, consultation_fee)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, name, phone, additionalData.specialization, additionalData.qualification,
         additionalData.experience, additionalData.licenseNumber, additionalData.consultationFee]
      );
    } else if (role === 'DIAGNOSTICS') {
      await db.query(
        `INSERT INTO diagnostic_centers (user_id, center_name, phone, email, 
         license_number, address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, additionalData.centerName || name, phone, email, 
         additionalData.licenseNumber, additionalData.address]
      );
    } else if (role === 'SHOP') {
      await db.query(
        `INSERT INTO medical_shops (user_id, shop_name, phone, email, 
         license_number, address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, additionalData.shopName || name, phone, email, 
         additionalData.licenseNumber, additionalData.address]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId,
        email,
        role,
        name,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Verify password
    const isValidPassword = await User.validatePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE user_id = ?',
      [user.user_id]
    );

    // Get profile data
    const profile = await User.getProfile(user.user_id, user.role);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        name: profile?.name || profile?.center_name || profile?.shop_name,
        token,
        profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get current user
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const profile = await User.getProfile(userId, role);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get password hash
    const [userWithPassword] = await db.query(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [userId]
    );

    // Verify current password
    const isValidPassword = await User.validatePassword(
      currentPassword, 
      userWithPassword[0].password_hash
    );
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};
