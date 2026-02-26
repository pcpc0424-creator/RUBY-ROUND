const { query, queryOne, withTransaction, queryWithConnection } = require('../config/database');
const { generateVerificationId } = require('../utils/helpers');

// Create adult verification request
const createAdultVerificationRequest = async (userData) => {
  const { userId, userEmail, userName, method } = userData;

  const verificationId = generateVerificationId();

  await query(
    `INSERT INTO adult_verifications (id, user_id, user_email, user_name, method)
     VALUES (?, ?, ?, ?, ?)`,
    [verificationId, userId, userEmail, userName, method]
  );

  return await getVerificationById(verificationId);
};

// Get verification by ID
const getVerificationById = async (verificationId) => {
  const verification = await queryOne(
    'SELECT * FROM adult_verifications WHERE id = ?',
    [verificationId]
  );

  if (!verification) {
    throw { statusCode: 404, message: '인증 요청을 찾을 수 없습니다.' };
  }

  return verification;
};

// Get verification requests with filters
const getVerificationRequests = async (filters = {}, page = 1, limit = 20) => {
  const { status, method, search } = filters;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }
  if (method) {
    whereClause += ' AND method = ?';
    params.push(method);
  }
  if (search) {
    whereClause += ' AND (user_email LIKE ? OR user_name LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  const [verifications, [countResult]] = await Promise.all([
    query(
      `SELECT * FROM adult_verifications ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
    query(`SELECT COUNT(*) as total FROM adult_verifications ${whereClause}`, params)
  ]);

  return {
    verifications,
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// Complete PASS verification
const completePassVerification = async (userId, verificationData) => {
  const { name, birthDate, gender, ci, di, isAdult, method = 'pass' } = verificationData;

  if (!isAdult) {
    throw { statusCode: 400, message: '만 19세 이상만 인증 가능합니다.' };
  }

  // Check duplicate CI
  if (ci) {
    const existing = await queryOne(
      'SELECT id, email FROM users WHERE verification_ci = ? AND id != ?',
      [ci, userId]
    );
    if (existing) {
      throw { statusCode: 409, message: '이미 다른 계정에서 인증된 본인입니다.', existingEmail: existing.email };
    }
  }

  const verificationId = generateVerificationId();

  await withTransaction(async (conn) => {
    // Create verification record
    await queryWithConnection(conn,
      `INSERT INTO adult_verifications
        (id, user_id, user_email, user_name, method, status, verified_name, verified_birth_date, verified_gender, ci, di, processed_at)
       SELECT ?, id, email, name, ?, 'approved', ?, ?, ?, ?, ?, NOW()
       FROM users WHERE id = ?`,
      [verificationId, method, name, birthDate, gender, ci, di, userId]
    );

    // Update user
    await queryWithConnection(conn,
      `UPDATE users SET
        is_adult_verified = 1,
        adult_verified_at = NOW(),
        adult_verification_method = ?,
        verification_ci = ?
       WHERE id = ?`,
      [method, ci, userId]
    );
  });

  return await getVerificationById(verificationId);
};

// Approve verification (admin manual)
const approveVerification = async (verificationId, adminName) => {
  const verification = await getVerificationById(verificationId);

  if (verification.status !== 'pending') {
    throw { statusCode: 400, message: '대기 상태의 요청만 승인할 수 있습니다.' };
  }

  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      `UPDATE adult_verifications SET
        status = 'approved',
        processed_by = ?,
        processed_at = NOW()
       WHERE id = ?`,
      [adminName, verificationId]
    );

    await queryWithConnection(conn,
      `UPDATE users SET
        is_adult_verified = 1,
        adult_verified_at = NOW(),
        adult_verification_method = 'manual'
       WHERE id = ?`,
      [verification.user_id]
    );
  });

  return await getVerificationById(verificationId);
};

// Reject verification
const rejectVerification = async (verificationId, adminName, reason) => {
  const verification = await getVerificationById(verificationId);

  if (verification.status !== 'pending') {
    throw { statusCode: 400, message: '대기 상태의 요청만 거부할 수 있습니다.' };
  }

  await query(
    `UPDATE adult_verifications SET
      status = 'rejected',
      processed_by = ?,
      processed_at = NOW(),
      reject_reason = ?
     WHERE id = ?`,
    [adminName, reason, verificationId]
  );

  return await getVerificationById(verificationId);
};

// Manual adult verification (admin grants directly)
const manualAdultVerification = async (userId, adminName) => {
  const user = await queryOne('SELECT id, email, name FROM users WHERE id = ?', [userId]);
  if (!user) {
    throw { statusCode: 404, message: '사용자를 찾을 수 없습니다.' };
  }

  const verificationId = generateVerificationId();

  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      `INSERT INTO adult_verifications
        (id, user_id, user_email, user_name, method, status, processed_by, processed_at)
       VALUES (?, ?, ?, ?, 'manual', 'approved', ?, NOW())`,
      [verificationId, userId, user.email, user.name, adminName]
    );

    await queryWithConnection(conn,
      `UPDATE users SET
        is_adult_verified = 1,
        adult_verified_at = NOW(),
        adult_verification_method = 'manual'
       WHERE id = ?`,
      [userId]
    );
  });

  return await getVerificationById(verificationId);
};

// Revoke adult verification
const revokeAdultVerification = async (userId, adminName, reason) => {
  await query(
    `UPDATE users SET
      is_adult_verified = 0,
      adult_verified_at = NULL,
      adult_verification_method = NULL,
      verification_ci = NULL
     WHERE id = ?`,
    [userId]
  );

  // Update all verification records for this user
  await query(
    `UPDATE adult_verifications SET
      status = 'expired',
      processed_by = ?,
      reject_reason = ?
     WHERE user_id = ? AND status = 'approved'`,
    [adminName, reason, userId]
  );

  return { success: true };
};

// Check adult verification status
const checkAdultVerification = async (userId) => {
  const user = await queryOne(
    'SELECT is_adult_verified, adult_verified_at, adult_verification_method FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    throw { statusCode: 404, message: '사용자를 찾을 수 없습니다.' };
  }

  return {
    isVerified: !!user.is_adult_verified,
    verifiedAt: user.adult_verified_at,
    method: user.adult_verification_method
  };
};

// Check duplicate CI
const checkDuplicateCI = async (ci, currentUserId) => {
  const existing = await queryOne(
    'SELECT id, email FROM users WHERE verification_ci = ? AND id != ?',
    [ci, currentUserId]
  );

  return {
    isDuplicate: !!existing,
    existingEmail: existing?.email
  };
};

// Get verification statistics
const getVerificationStatistics = async () => {
  const [stats] = await query(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
    FROM adult_verifications
  `);

  const [methodStats] = await query(`
    SELECT method, COUNT(*) as count
    FROM adult_verifications
    WHERE status = 'approved'
    GROUP BY method
  `);

  return { ...stats, byMethod: methodStats };
};

module.exports = {
  createAdultVerificationRequest,
  getVerificationById,
  getVerificationRequests,
  completePassVerification,
  approveVerification,
  rejectVerification,
  manualAdultVerification,
  revokeAdultVerification,
  checkAdultVerification,
  checkDuplicateCI,
  getVerificationStatistics,
};
