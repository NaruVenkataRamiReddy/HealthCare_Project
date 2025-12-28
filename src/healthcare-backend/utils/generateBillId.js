/**
 * Generate unique bill ID
 * Format: BILL-YYYYMMDD-XXXXX
 */
const generateBillId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 90000) + 10000;
  
  return `BILL-${year}${month}${day}-${random}`;
};

/**
 * Generate unique order ID
 * Format: ORD-YYYYMMDD-XXXXX
 */
const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 90000) + 10000;
  
  return `ORD-${year}${month}${day}-${random}`;
};

module.exports = { generateBillId, generateOrderId };
