const { query, queryOne, insert, withTransaction, queryWithConnection } = require('../config/database');
const { hashPassword, comparePassword, generateToken, generateUserId, generateLedgerId } = require('../utils/helpers');

// Register new user
const registerUser = async (userData) => {
  const { email, password, name, phone, socialProvider = 'email', socialId = null } = userData;

  // Check if email exists
  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    throw { statusCode: 409, message: '이미 가입된 이메일입니다.' };
  }

  const userId = generateUserId();
  const passwordHash = password ? await hashPassword(password) : null;

  await withTransaction(async (conn) => {
    // Create user
    await queryWithConnection(conn,
      `INSERT INTO users (id, email, password_hash, name, phone, social_provider, social_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, passwordHash, name, phone, socialProvider, socialId]
    );

    // Create balance record
    await queryWithConnection(conn,
      `INSERT INTO exchange_balances (user_id, total_balance, available_balance)
       VALUES (?, 0, 0)`,
      [userId]
    );
  });

  const user = await queryOne('SELECT id, email, name, phone, status FROM users WHERE id = ?', [userId]);
  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token, isNewUser: true };
};

// Register or get social user
const registerOrGetSocialUser = async (userData) => {
  const { email, name, socialProvider, socialId, profileImage, phone } = userData;

  // Check if user exists
  let user = await queryOne(
    'SELECT id, email, name, phone, profile_image, status, is_adult_verified FROM users WHERE email = ? OR (social_provider = ? AND social_id = ?)',
    [email, socialProvider, socialId]
  );

  let isNewUser = false;

  if (!user) {
    // Register new user
    const userId = generateUserId();
    await withTransaction(async (conn) => {
      await queryWithConnection(conn,
        `INSERT INTO users (id, email, name, phone, profile_image, social_provider, social_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, name, phone, profileImage, socialProvider, socialId]
      );

      await queryWithConnection(conn,
        `INSERT INTO exchange_balances (user_id, total_balance, available_balance)
         VALUES (?, 0, 0)`,
        [userId]
      );
    });

    user = await queryOne('SELECT id, email, name, phone, profile_image, status, is_adult_verified FROM users WHERE id = ?', [userId]);
    isNewUser = true;
  } else {
    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  }

  const token = generateToken({ userId: user.id, email: user.email });
  return { user, token, isNewUser };
};

// Login user
const loginUser = async (email, password) => {
  const user = await queryOne(
    'SELECT id, email, password_hash, name, phone, status, is_adult_verified FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    throw { statusCode: 401, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  if (user.status !== 'active') {
    throw { statusCode: 403, message: '비활성화된 계정입니다.' };
  }

  if (!user.password_hash) {
    throw { statusCode: 401, message: '소셜 로그인으로 가입된 계정입니다.' };
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw { statusCode: 401, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

  delete user.password_hash;
  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
};

// Get user by ID
const getUserById = async (userId) => {
  const user = await queryOne(
    `SELECT u.id, u.email, u.name, u.phone, u.profile_image, u.social_provider,
            u.is_adult_verified, u.adult_verified_at, u.status, u.created_at,
            eb.total_balance, eb.available_balance, eb.hold_balance, eb.used_balance
     FROM users u
     LEFT JOIN exchange_balances eb ON u.id = eb.user_id
     WHERE u.id = ?`,
    [userId]
  );

  if (!user) {
    throw { statusCode: 404, message: '사용자를 찾을 수 없습니다.' };
  }

  return user;
};

// Get user by email
const getUserByEmail = async (email) => {
  const user = await queryOne(
    `SELECT u.id, u.email, u.name, u.phone, u.profile_image, u.social_provider,
            u.is_adult_verified, u.adult_verified_at, u.status, u.created_at,
            eb.total_balance, eb.available_balance, eb.hold_balance, eb.used_balance
     FROM users u
     LEFT JOIN exchange_balances eb ON u.id = eb.user_id
     WHERE u.email = ?`,
    [email]
  );

  return user;
};

// Update user
const updateUser = async (userId, updateData) => {
  const { name, phone } = updateData;
  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (phone) {
    updates.push('phone = ?');
    values.push(phone);
  }

  if (updates.length === 0) {
    throw { statusCode: 400, message: '수정할 데이터가 없습니다.' };
  }

  values.push(userId);
  await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

  return await getUserById(userId);
};

// Change password
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await queryOne('SELECT password_hash FROM users WHERE id = ?', [userId]);

  if (!user || !user.password_hash) {
    throw { statusCode: 400, message: '비밀번호를 변경할 수 없습니다.' };
  }

  const isValid = await comparePassword(currentPassword, user.password_hash);
  if (!isValid) {
    throw { statusCode: 401, message: '현재 비밀번호가 올바르지 않습니다.' };
  }

  const newHash = await hashPassword(newPassword);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);

  return { success: true };
};

// Delete user (soft delete)
const deleteUser = async (userId) => {
  await query('UPDATE users SET status = ? WHERE id = ?', ['deleted', userId]);
  return { success: true };
};

// Get user balance
const getUserBalance = async (userId) => {
  const balance = await queryOne(
    'SELECT total_balance, available_balance, hold_balance, used_balance FROM exchange_balances WHERE user_id = ?',
    [userId]
  );

  if (!balance) {
    return { total_balance: 0, available_balance: 0, hold_balance: 0, used_balance: 0 };
  }

  return balance;
};

// Charge user balance (관리자 충전)
const chargeUserBalance = async (userId, amount, description, adminName) => {
  const ledgerId = generateLedgerId();

  return await withTransaction(async (conn) => {
    // Lock the balance record
    const [balanceRows] = await conn.execute(
      'SELECT available_balance FROM exchange_balances WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    const currentBalance = balanceRows[0]?.available_balance || 0;
    const newBalance = currentBalance + amount;

    // Create ledger entry
    await queryWithConnection(conn,
      `INSERT INTO exchange_ledgers (id, user_id, type, amount, balance_before, balance_after, reason, description, created_by)
       VALUES (?, ?, 'credit', ?, ?, ?, 'ADMIN_CHARGE', ?, ?)`,
      [ledgerId, userId, amount, currentBalance, newBalance, description, adminName]
    );

    // Update balance
    await queryWithConnection(conn,
      `UPDATE exchange_balances SET
        total_balance = total_balance + ?,
        available_balance = available_balance + ?
       WHERE user_id = ?`,
      [amount, amount, userId]
    );

    return { ledgerId, balance: newBalance };
  });
};

// Deduct user balance (관리자 차감)
const deductUserBalance = async (userId, amount, description, adminName) => {
  const ledgerId = generateLedgerId();

  return await withTransaction(async (conn) => {
    // Lock the balance record
    const [balanceRows] = await conn.execute(
      'SELECT available_balance FROM exchange_balances WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    const currentBalance = balanceRows[0]?.available_balance || 0;
    if (currentBalance < amount) {
      throw { statusCode: 400, message: '잔액이 부족합니다.' };
    }

    const newBalance = currentBalance - amount;

    // Create ledger entry
    await queryWithConnection(conn,
      `INSERT INTO exchange_ledgers (id, user_id, type, amount, balance_before, balance_after, reason, description, created_by)
       VALUES (?, ?, 'debit', ?, ?, ?, 'ADMIN_DEDUCT', ?, ?)`,
      [ledgerId, userId, amount, currentBalance, newBalance, description, adminName]
    );

    // Update balance
    await queryWithConnection(conn,
      `UPDATE exchange_balances SET
        available_balance = available_balance - ?,
        used_balance = used_balance + ?
       WHERE user_id = ?`,
      [amount, amount, userId]
    );

    return { ledgerId, balance: newBalance };
  });
};

// Get user ledger
const getUserLedger = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const [entries, [countResult]] = await Promise.all([
    query(
      `SELECT * FROM exchange_ledgers WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    ),
    query('SELECT COUNT(*) as total FROM exchange_ledgers WHERE user_id = ?', [userId])
  ]);

  return {
    entries,
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// Get all ledger entries (admin)
const getAllLedgerEntries = async (filters = {}, page = 1, limit = 1000) => {
  const { userEmail, type, startDate, endDate } = filters;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (userEmail) {
    whereClause += ' AND u.email LIKE ?';
    params.push(`%${userEmail}%`);
  }
  if (type) {
    whereClause += ' AND el.type = ?';
    params.push(type);
  }
  if (startDate) {
    whereClause += ' AND el.created_at >= ?';
    params.push(startDate);
  }
  if (endDate) {
    whereClause += ' AND el.created_at <= ?';
    params.push(endDate + ' 23:59:59');
  }

  const [entries, [countResult]] = await Promise.all([
    query(
      `SELECT el.id, el.user_id, el.type, el.amount, el.balance_before, el.balance_after,
              el.reason, el.description, el.created_at, el.created_by,
              u.email as userEmail, u.name as userName
       FROM exchange_ledgers el
       JOIN users u ON el.user_id = u.id
       ${whereClause}
       ORDER BY el.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
    query(
      `SELECT COUNT(*) as total FROM exchange_ledgers el JOIN users u ON el.user_id = u.id ${whereClause}`,
      params
    )
  ]);

  // Transform field names for frontend compatibility
  const transformedEntries = entries.map(entry => ({
    id: entry.id,
    userId: entry.user_id,
    userEmail: entry.userEmail,
    userName: entry.userName,
    type: entry.type,
    amount: entry.amount,
    balanceBefore: entry.balance_before,
    balanceAfter: entry.balance_after,
    reason: entry.reason,
    description: entry.description,
    createdAt: entry.created_at,
    createdBy: entry.created_by
  }));

  return {
    entries: transformedEntries,
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// Get users list (admin)
const getUsers = async (filters = {}, page = 1, limit = 20) => {
  const { status, search, isAdultVerified } = filters;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const offset = (pageNum - 1) * limitNum;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (status) {
    whereClause += ' AND u.status = ?';
    params.push(status);
  }

  if (search) {
    whereClause += ' AND (u.email LIKE ? OR u.name LIKE ? OR u.phone LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (isAdultVerified !== undefined) {
    whereClause += ' AND u.is_adult_verified = ?';
    params.push(isAdultVerified ? 1 : 0);
  }

  const [users, [countResult]] = await Promise.all([
    query(
      `SELECT u.id, u.email, u.name, u.phone, u.social_provider, u.is_adult_verified,
              u.status, u.created_at, u.last_login_at,
              eb.available_balance
       FROM users u
       LEFT JOIN exchange_balances eb ON u.id = eb.user_id
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    ),
    query(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      params
    )
  ]);

  return {
    users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limitNum)
    }
  };
};

// Get user statistics
const getUserStatistics = async () => {
  const [stats] = await query(`
    SELECT
      COUNT(*) as total_users,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
      SUM(CASE WHEN is_adult_verified = 1 THEN 1 ELSE 0 END) as verified_users,
      SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_users_7d,
      SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users_30d
    FROM users
  `);

  const [balanceStats] = await query(`
    SELECT
      SUM(total_balance) as total_balance_all,
      SUM(available_balance) as available_balance_all,
      SUM(used_balance) as used_balance_all
    FROM exchange_balances
  `);

  return {
    totalUsers: parseInt(stats.total_users) || 0,
    activeUsers: parseInt(stats.active_users) || 0,
    adultVerifiedUsers: parseInt(stats.verified_users) || 0,
    newUsers7d: parseInt(stats.new_users_7d) || 0,
    newUsers30d: parseInt(stats.new_users_30d) || 0,
    totalBalanceAll: parseInt(balanceStats.total_balance_all) || 0,
    availableBalanceAll: parseInt(balanceStats.available_balance_all) || 0,
    usedBalanceAll: parseInt(balanceStats.used_balance_all) || 0,
  };
};

// Update user status (admin)
const updateUserStatus = async (userId, status) => {
  await query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
  return await getUserById(userId);
};

// Complete adult verification
const completeAdultVerification = async (userId, verificationData) => {
  const { method, name, birthDate, gender, ci, di, isAdult } = verificationData;

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
      throw { statusCode: 409, message: '이미 다른 계정에서 인증된 본인입니다.' };
    }
  }

  await query(
    `UPDATE users SET
      is_adult_verified = 1,
      adult_verified_at = NOW(),
      adult_verification_method = ?,
      verification_ci = ?
     WHERE id = ?`,
    [method, ci, userId]
  );

  return await getUserById(userId);
};

module.exports = {
  registerUser,
  registerOrGetSocialUser,
  loginUser,
  getUserById,
  getUserByEmail,
  updateUser,
  changePassword,
  deleteUser,
  getUserBalance,
  chargeUserBalance,
  deductUserBalance,
  getUserLedger,
  getAllLedgerEntries,
  getUsers,
  getUserStatistics,
  updateUserStatus,
  completeAdultVerification,
};
