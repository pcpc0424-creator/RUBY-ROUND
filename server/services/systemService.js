const { query, queryOne } = require('../config/database');
const { generateAuditId } = require('../utils/helpers');

// ==================== SYSTEM SETTINGS ====================

// Get all system settings
const getSystemSettings = async () => {
  const settings = await query('SELECT setting_key, setting_value FROM system_settings');

  const result = {};
  for (const setting of settings) {
    try {
      result[setting.setting_key] = JSON.parse(setting.setting_value);
    } catch {
      result[setting.setting_key] = setting.setting_value;
    }
  }

  return result;
};

// Get single setting
const getSetting = async (key) => {
  const setting = await queryOne('SELECT setting_value FROM system_settings WHERE setting_key = ?', [key]);
  if (!setting) return null;

  try {
    return JSON.parse(setting.setting_value);
  } catch {
    return setting.setting_value;
  }
};

// Save system settings
const saveSystemSettings = async (settings, adminName) => {
  for (const [key, value] of Object.entries(settings)) {
    const jsonValue = JSON.stringify(value);
    await query(
      `INSERT INTO system_settings (setting_key, setting_value, updated_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?`,
      [key, jsonValue, adminName, jsonValue, adminName]
    );
  }

  return await getSystemSettings();
};

// Update single setting
const updateSetting = async (key, value, adminName) => {
  const jsonValue = JSON.stringify(value);
  await query(
    `INSERT INTO system_settings (setting_key, setting_value, updated_by)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?`,
    [key, jsonValue, adminName, jsonValue, adminName]
  );

  return await getSetting(key);
};

// ==================== CONSULTATION MODAL ====================

// Get consultation modal content
const getConsultationModalContent = async () => {
  const content = await queryOne('SELECT content FROM consultation_modal_content ORDER BY id DESC LIMIT 1');
  if (!content) {
    return getDefaultModalContent();
  }

  try {
    return JSON.parse(content.content);
  } catch {
    return getDefaultModalContent();
  }
};

// Save consultation modal content
const saveConsultationModalContent = async (content, adminName) => {
  // Delete existing and insert new
  await query('DELETE FROM consultation_modal_content');
  await query(
    'INSERT INTO consultation_modal_content (content, updated_by) VALUES (?, ?)',
    [JSON.stringify(content), adminName]
  );

  return await getConsultationModalContent();
};

// Reset consultation modal content to default
const resetConsultationModalContent = async (adminName) => {
  const defaultContent = getDefaultModalContent();
  return await saveConsultationModalContent(defaultContent, adminName);
};

// Default modal content
const getDefaultModalContent = () => ({
  title: '상담 접수 안내',
  subtitle: '접수 전 확인해주세요',
  items: [
    { id: 1, icon: '📋', title: '상담 접수', description: '본 신청은 상담 접수이며, 교환금이 즉시 차감되지 않습니다.' },
    { id: 2, icon: '💬', title: '전문 상담사 확인', description: '전문 상담사가 연락드려 상세 내용을 확인하고 최종 사양을 협의합니다.' },
    { id: 3, icon: '✅', title: '내부 승인 후 차감', description: '내부 승인 완료 시 교환금이 차감되고 제작이 시작됩니다.' },
    { id: 4, icon: '⚠️', title: '취소 안내', description: '내부 승인 전까지는 취소가 가능하지만, 승인 이후에는 취소가 불가합니다.' },
  ],
  confirmButtonText: '확인하고 접수하기',
  cancelButtonText: '다시 확인하기',
});

// ==================== AUDIT LOGS ====================

// Create audit log
const createAuditLog = async (logData) => {
  const {
    actorType, actorId, actorName, actorEmail,
    action, targetType, targetId, targetName,
    description, oldValue, newValue,
    ipAddress, userAgent
  } = logData;

  const auditId = generateAuditId();

  await query(
    `INSERT INTO audit_logs
      (id, actor_type, actor_id, actor_name, actor_email, action, target_type, target_id, target_name,
       description, old_value, new_value, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [auditId, actorType, actorId, actorName, actorEmail, action, targetType, targetId, targetName,
     description, oldValue ? JSON.stringify(oldValue) : null, newValue ? JSON.stringify(newValue) : null,
     ipAddress, userAgent]
  );

  return auditId;
};

// Get audit logs with filters
const getAuditLogs = async (filters = {}, page = 1, limit = 50) => {
  const { actorType, action, targetType, startDate, endDate, search } = filters;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (actorType) {
    whereClause += ' AND actor_type = ?';
    params.push(actorType);
  }
  if (action) {
    whereClause += ' AND action = ?';
    params.push(action);
  }
  if (targetType) {
    whereClause += ' AND target_type = ?';
    params.push(targetType);
  }
  if (startDate) {
    whereClause += ' AND created_at >= ?';
    params.push(startDate);
  }
  if (endDate) {
    whereClause += ' AND created_at <= ?';
    params.push(endDate + ' 23:59:59');
  }
  if (search) {
    whereClause += ' AND (actor_name LIKE ? OR actor_email LIKE ? OR target_name LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  const [logs, [countResult]] = await Promise.all([
    query(
      `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
    query(`SELECT COUNT(*) as total FROM audit_logs ${whereClause}`, params)
  ]);

  return {
    logs: logs.map(log => {
      if (log.old_value) log.old_value = JSON.parse(log.old_value);
      if (log.new_value) log.new_value = JSON.parse(log.new_value);
      return log;
    }),
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// ==================== CONTACT INQUIRIES ====================

// Create contact inquiry
const createContactInquiry = async (inquiryData) => {
  const { category, name, email, phone, title, content } = inquiryData;

  // Map frontend fields to database fields
  // subject = [category] title, message = content
  const subject = category ? `[${category}] ${title}` : title;
  const message = content;

  const result = await query(
    'INSERT INTO contact_inquiries (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message]
  );

  return { id: result.insertId };
};

// Get contact inquiries
const getContactInquiries = async (filters = {}, page = 1, limit = 20) => {
  const { status, search } = filters;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    whereClause += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const [inquiries, [countResult]] = await Promise.all([
    query(
      `SELECT * FROM contact_inquiries ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
    query(`SELECT COUNT(*) as total FROM contact_inquiries ${whereClause}`, params)
  ]);

  return {
    inquiries,
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// Respond to inquiry
const respondToInquiry = async (inquiryId, response, adminName) => {
  await query(
    `UPDATE contact_inquiries SET
      status = 'resolved',
      response = ?,
      responded_by = ?,
      responded_at = NOW()
     WHERE id = ?`,
    [response, adminName, inquiryId]
  );

  return await queryOne('SELECT * FROM contact_inquiries WHERE id = ?', [inquiryId]);
};

// Update inquiry status
const updateInquiryStatus = async (inquiryId, status) => {
  await query(
    'UPDATE contact_inquiries SET status = ? WHERE id = ?',
    [status, inquiryId]
  );

  return await queryOne('SELECT * FROM contact_inquiries WHERE id = ?', [inquiryId]);
};

// Delete inquiry
const deleteInquiry = async (inquiryId) => {
  const inquiry = await queryOne('SELECT * FROM contact_inquiries WHERE id = ?', [inquiryId]);
  if (!inquiry) {
    throw { statusCode: 404, message: '문의를 찾을 수 없습니다.' };
  }

  await query('DELETE FROM contact_inquiries WHERE id = ?', [inquiryId]);
  return { deleted: true };
};

module.exports = {
  // System settings
  getSystemSettings,
  getSetting,
  saveSystemSettings,
  updateSetting,
  // Consultation modal
  getConsultationModalContent,
  saveConsultationModalContent,
  resetConsultationModalContent,
  // Audit logs
  createAuditLog,
  getAuditLogs,
  // Contact inquiries
  createContactInquiry,
  getContactInquiries,
  respondToInquiry,
  updateInquiryStatus,
  deleteInquiry,
};
