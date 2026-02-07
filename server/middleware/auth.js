const { verifyToken } = require('../utils/helpers');
const { queryOne } = require('../config/database');

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, error: '유효하지 않은 토큰입니다.' });
    }

    // Verify user exists in database
    const user = await queryOne(
      'SELECT id, email, name, phone, status FROM users WHERE id = ? AND status = ?',
      [decoded.userId, 'active']
    );

    if (!user) {
      return res.status(401).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, error: '인증 처리 중 오류가 발생했습니다.' });
  }
};

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: '관리자 인증이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.isAdmin) {
      return res.status(401).json({ success: false, error: '유효하지 않은 관리자 토큰입니다.' });
    }

    // Verify admin exists in database
    const admin = await queryOne(
      'SELECT id, email, name, role, status FROM admins WHERE id = ? AND status = ?',
      [decoded.adminId, 'active']
    );

    if (!admin) {
      return res.status(401).json({ success: false, error: '관리자를 찾을 수 없습니다.' });
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(401).json({ success: false, error: '관리자 인증 처리 중 오류가 발생했습니다.' });
  }
};

// Optional user authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded && decoded.userId) {
      const user = await queryOne(
        'SELECT id, email, name, phone, status FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'active']
      );
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Permission check middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, error: '관리자 인증이 필요합니다.' });
    }

    const rolePermissions = {
      ceo: [
        'view', 'consult', 'approve', 'cancel', 'manage_users', 'manage_delivery',
        'manage_adult_verification', 'approve_adult_verification', 'manage_seasons',
        'manage_rounds', 'manage_settlement', 'manage_modal', 'manage_coupons',
        'manage_rewards', 'view_audit_logs', 'manage_system'
      ],
      cs_manager: [
        'view', 'consult', 'cancel', 'manage_users', 'manage_delivery',
        'manage_adult_verification', 'manage_seasons', 'manage_rounds',
        'manage_settlement', 'manage_coupons', 'manage_rewards'
      ],
      cs_staff: ['view', 'consult']
    };

    const permissions = rolePermissions[req.admin.role] || [];
    if (!permissions.includes(permission)) {
      return res.status(403).json({ success: false, error: '해당 권한이 없습니다.' });
    }

    next();
  };
};

module.exports = {
  authUser,
  authAdmin,
  optionalAuth,
  requirePermission,
};
