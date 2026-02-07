const { query, queryOne, insert } = require('../config/database');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

// Admin login
const adminLogin = async (email, password) => {
  const admin = await queryOne(
    'SELECT id, email, password_hash, name, role, status FROM admins WHERE email = ?',
    [email]
  );

  if (!admin) {
    throw { statusCode: 401, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  if (admin.status !== 'active') {
    throw { statusCode: 403, message: '비활성화된 관리자 계정입니다.' };
  }

  const isValid = await comparePassword(password, admin.password_hash);
  if (!isValid) {
    throw { statusCode: 401, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  await query('UPDATE admins SET last_login_at = NOW() WHERE id = ?', [admin.id]);

  delete admin.password_hash;
  const token = generateToken({ adminId: admin.id, email: admin.email, role: admin.role, isAdmin: true });

  return { admin, token };
};

// Get admin by ID
const getAdminById = async (adminId) => {
  const admin = await queryOne(
    'SELECT id, email, name, role, status, last_login_at, created_at FROM admins WHERE id = ?',
    [adminId]
  );

  if (!admin) {
    throw { statusCode: 404, message: '관리자를 찾을 수 없습니다.' };
  }

  return admin;
};

// Create admin (for initial setup)
const createAdmin = async (adminData) => {
  const { email, password, name, role = 'cs_staff' } = adminData;

  const existing = await queryOne('SELECT id FROM admins WHERE email = ?', [email]);
  if (existing) {
    throw { statusCode: 409, message: '이미 등록된 관리자 이메일입니다.' };
  }

  const passwordHash = await hashPassword(password);
  const id = await insert(
    'INSERT INTO admins (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
    [email, passwordHash, name, role]
  );

  return await getAdminById(id);
};

// Get all admins
const getAdmins = async () => {
  return await query(
    'SELECT id, email, name, role, status, last_login_at, created_at FROM admins ORDER BY id'
  );
};

// Update admin
const updateAdmin = async (adminId, updateData) => {
  const { name, role, status } = updateData;
  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (role) {
    updates.push('role = ?');
    values.push(role);
  }
  if (status) {
    updates.push('status = ?');
    values.push(status);
  }

  if (updates.length === 0) {
    throw { statusCode: 400, message: '수정할 데이터가 없습니다.' };
  }

  values.push(adminId);
  await query(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`, values);

  return await getAdminById(adminId);
};

// Change admin password
const changeAdminPassword = async (adminId, currentPassword, newPassword) => {
  const admin = await queryOne('SELECT password_hash FROM admins WHERE id = ?', [adminId]);

  if (!admin) {
    throw { statusCode: 404, message: '관리자를 찾을 수 없습니다.' };
  }

  const isValid = await comparePassword(currentPassword, admin.password_hash);
  if (!isValid) {
    throw { statusCode: 401, message: '현재 비밀번호가 올바르지 않습니다.' };
  }

  const newHash = await hashPassword(newPassword);
  await query('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, adminId]);

  return { success: true };
};

// Initialize default admins (run once)
const initializeDefaultAdmins = async () => {
  const defaultAdmins = [
    { email: 'cjsql4159@rubyround.net', password: 'ja04051010!', name: '대표', role: 'ceo' },
    { email: 'lbj0134@rubyround.net', password: '0p9o8i7u6y@', name: 'CS 관리자 1', role: 'cs_manager' },
    { email: 'dmswls5547@rubyround.net', password: 'wjdehd312#', name: 'CS 관리자 2', role: 'cs_manager' },
    { email: 'nxwxn1007@rubyround.net', password: 'aa5016015', name: 'CS 관리자 3', role: 'cs_manager' },
  ];

  for (const admin of defaultAdmins) {
    const existing = await queryOne('SELECT id FROM admins WHERE email = ?', [admin.email]);
    if (!existing) {
      await createAdmin(admin);
      console.log(`Created admin: ${admin.email}`);
    }
  }
};

module.exports = {
  adminLogin,
  getAdminById,
  createAdmin,
  getAdmins,
  updateAdmin,
  changeAdminPassword,
  initializeDefaultAdmins,
};
