const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SALT_ROUNDS = 12;

// Password hashing
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// JWT token generation
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ID generation with prefix (e.g., USR-20250207-A1B2)
const generateId = (prefix = '') => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}${prefix ? '-' : ''}${dateStr}-${randomStr}`;
};

// Application-specific ID generators
const generateUserId = () => generateId('USR');
const generateApplicationId = () => generateId('EX');
const generateLedgerId = () => generateId('LED');
const generateSeasonId = () => generateId('SSN');
const generateRoundId = () => generateId('RND');
const generatePaymentId = () => generateId('PAY');
const generateSettlementId = () => generateId('STL');
const generateDeliveryId = () => generateId('DLV');
const generateVerificationId = () => generateId('AV');
const generateRewardId = () => generateId('RWD');
const generateCouponId = () => generateId('CPN');
const generateAuditId = () => generateId('AUD');

// Format Korean phone number
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

// Mask name (김루비 → 김*비)
const maskName = (name) => {
  if (!name || name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

// Mask email (user@domain.com → u***@domain.com)
const maskEmail = (email) => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return local[0] + '***@' + domain;
  return local[0] + '***@' + domain;
};

// Mask phone (010-1234-5678 → 010-****-5678)
const maskPhone = (phone) => {
  if (!phone) return '';
  const parts = phone.split('-');
  if (parts.length !== 3) return phone;
  return `${parts[0]}-****-${parts[2]}`;
};

// Calculate age from birth date
const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Pagination helper
const paginate = (page = 1, limit = 20) => {
  const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
  return {
    limit: parseInt(limit),
    offset,
  };
};

// Build pagination response
const paginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateId,
  generateUserId,
  generateApplicationId,
  generateLedgerId,
  generateSeasonId,
  generateRoundId,
  generatePaymentId,
  generateSettlementId,
  generateDeliveryId,
  generateVerificationId,
  generateRewardId,
  generateCouponId,
  generateAuditId,
  formatPhoneNumber,
  formatCurrency,
  maskName,
  maskEmail,
  maskPhone,
  calculateAge,
  paginate,
  paginationResponse,
};
