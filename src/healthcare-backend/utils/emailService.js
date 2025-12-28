const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send appointment confirmation email
 */
const sendAppointmentConfirmation = async (appointmentData) => {
  const { patientEmail, patientName, doctorName, date, time, fee } = appointmentData;
  
  const html = `
    <h2>Appointment Confirmed</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment has been confirmed with the following details:</p>
    <ul>
      <li><strong>Doctor:</strong> ${doctorName}</li>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Consultation Fee:</strong> ₹${fee}</li>
    </ul>
    <p>Please arrive 10 minutes before your scheduled time.</p>
    <p>Thank you for choosing our healthcare services.</p>
  `;

  return sendEmail({
    to: patientEmail,
    subject: 'Appointment Confirmation',
    html,
    text: `Appointment confirmed with ${doctorName} on ${date} at ${time}`
  });
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmation = async (orderData) => {
  const { customerEmail, customerName, orderId, items, total } = orderData;
  
  const itemsList = items.map(item => 
    `<li>${item.name} x ${item.quantity} - ₹${item.price}</li>`
  ).join('');

  const html = `
    <h2>Order Confirmed</h2>
    <p>Dear ${customerName},</p>
    <p>Your order #${orderId} has been confirmed.</p>
    <h3>Order Details:</h3>
    <ul>${itemsList}</ul>
    <p><strong>Total Amount:</strong> ₹${total}</p>
    <p>Your order will be processed and delivered soon.</p>
    <p>Thank you for your order!</p>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmation - ${orderId}`,
    html,
    text: `Order ${orderId} confirmed. Total: ₹${total}`
  });
};

module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
  sendOrderConfirmation
};
