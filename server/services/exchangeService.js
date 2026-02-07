const { query, queryOne, withTransaction, queryWithConnection } = require('../config/database');
const { generateApplicationId, generateLedgerId, generateDeliveryId } = require('../utils/helpers');

// Status transitions allowed
const STATUS_TRANSITIONS = {
  received: ['cs_consulting', 'cancelled'],
  cs_consulting: ['consultation_confirmed', 'received', 'cancelled'],
  consultation_confirmed: ['approved', 'cs_consulting', 'cancelled'],
  approved: ['in_production'],
  in_production: ['ready_to_ship'],
  ready_to_ship: ['shipping'],
  shipping: ['delivered'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};

// Create exchange application
const createApplication = async (applicationData) => {
  const {
    userId, userEmail, userName, userPhone,
    category, specifications, requestedAmount, requestNote,
    delivery
  } = applicationData;

  const applicationId = generateApplicationId();
  const deliveryId = generateDeliveryId();

  await withTransaction(async (conn) => {
    // Create application
    await queryWithConnection(conn,
      `INSERT INTO exchange_applications
        (id, user_id, user_email, user_name, user_phone, category, specifications, requested_amount, request_note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [applicationId, userId, userEmail, userName, userPhone, category, JSON.stringify(specifications), requestedAmount, requestNote]
    );

    // Create delivery record
    if (delivery) {
      await queryWithConnection(conn,
        `INSERT INTO deliveries
          (id, application_id, recipient_name, recipient_phone, postal_code, address, address_detail, delivery_memo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [deliveryId, applicationId, delivery.recipientName, delivery.recipientPhone, delivery.postalCode, delivery.address, delivery.addressDetail, delivery.deliveryMemo]
      );
    }

    // Create status history
    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, NULL, 'received', ?, '신청 접수')`,
      [applicationId, userName]
    );
  });

  return await getApplicationById(applicationId);
};

// Get application by ID
const getApplicationById = async (applicationId) => {
  const application = await queryOne(
    `SELECT ea.*, d.recipient_name, d.recipient_phone, d.postal_code, d.address, d.address_detail,
            d.delivery_memo, d.courier, d.tracking_number, d.status as delivery_status,
            d.shipped_at, d.delivered_at
     FROM exchange_applications ea
     LEFT JOIN deliveries d ON ea.id = d.application_id
     WHERE ea.id = ?`,
    [applicationId]
  );

  if (!application) {
    throw { statusCode: 404, message: '신청을 찾을 수 없습니다.' };
  }

  // Get status history
  const history = await query(
    'SELECT * FROM exchange_status_history WHERE application_id = ? ORDER BY created_at DESC',
    [applicationId]
  );

  application.statusHistory = history;
  // MySQL2 JSON columns are automatically parsed, so only parse if it's a string
  if (application.specifications && typeof application.specifications === 'string') {
    application.specifications = JSON.parse(application.specifications);
  }

  return application;
};

// Get applications with filters
const getApplications = async (filters = {}, page = 1, limit = 20) => {
  const { status, category, userEmail, search, startDate, endDate } = filters;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (status) {
    whereClause += ' AND ea.status = ?';
    params.push(status);
  }
  if (category) {
    whereClause += ' AND ea.category = ?';
    params.push(category);
  }
  if (userEmail) {
    whereClause += ' AND ea.user_email = ?';
    params.push(userEmail);
  }
  if (search) {
    whereClause += ' AND (ea.id LIKE ? OR ea.user_name LIKE ? OR ea.user_email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  if (startDate) {
    whereClause += ' AND ea.created_at >= ?';
    params.push(startDate);
  }
  if (endDate) {
    whereClause += ' AND ea.created_at <= ?';
    params.push(endDate + ' 23:59:59');
  }

  const [applications, [countResult]] = await Promise.all([
    query(
      `SELECT ea.*, d.tracking_number, d.status as delivery_status
       FROM exchange_applications ea
       LEFT JOIN deliveries d ON ea.id = d.application_id
       ${whereClause}
       ORDER BY ea.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
    query(`SELECT COUNT(*) as total FROM exchange_applications ea ${whereClause}`, params)
  ]);

  return {
    applications: applications.map(app => {
      // MySQL2 JSON columns are automatically parsed, so only parse if it's a string
      if (app.specifications && typeof app.specifications === 'string') {
        app.specifications = JSON.parse(app.specifications);
      }
      return app;
    }),
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// Get user's applications
const getMyApplications = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const [applications, [countResult]] = await Promise.all([
    query(
      `SELECT ea.*, d.tracking_number, d.courier, d.status as delivery_status
       FROM exchange_applications ea
       LEFT JOIN deliveries d ON ea.id = d.application_id
       WHERE ea.user_id = ?
       ORDER BY ea.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    ),
    query('SELECT COUNT(*) as total FROM exchange_applications WHERE user_id = ?', [userId])
  ]);

  return {
    applications: applications.map(app => {
      // MySQL2 JSON columns are automatically parsed, so only parse if it's a string
      if (app.specifications && typeof app.specifications === 'string') {
        app.specifications = JSON.parse(app.specifications);
      }
      return app;
    }),
    pagination: {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit)
    }
  };
};

// Update application status
const updateStatus = async (applicationId, newStatus, adminName, note = '') => {
  const application = await queryOne('SELECT status FROM exchange_applications WHERE id = ?', [applicationId]);

  if (!application) {
    throw { statusCode: 404, message: '신청을 찾을 수 없습니다.' };
  }

  const allowedTransitions = STATUS_TRANSITIONS[application.status] || [];
  if (!allowedTransitions.includes(newStatus)) {
    throw { statusCode: 400, message: `현재 상태에서 ${newStatus}로 변경할 수 없습니다.` };
  }

  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      'UPDATE exchange_applications SET status = ? WHERE id = ?',
      [newStatus, applicationId]
    );

    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, ?, ?, ?, ?)`,
      [applicationId, application.status, newStatus, adminName, note]
    );
  });

  return await getApplicationById(applicationId);
};

// Confirm consultation
const confirmConsultation = async (applicationId, consultationData, adminName) => {
  const { finalSpecification, finalAmount, csNote, customerConfirmed } = consultationData;

  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      `UPDATE exchange_applications SET
        status = 'consultation_confirmed',
        consultation_final_spec = ?,
        consultation_final_amount = ?,
        consultation_note = ?,
        consultation_customer_confirmed = ?,
        consulted_at = NOW(),
        consulted_by = ?
       WHERE id = ?`,
      [finalSpecification, finalAmount, csNote, customerConfirmed ? 1 : 0, adminName, applicationId]
    );

    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, 'cs_consulting', 'consultation_confirmed', ?, ?)`,
      [applicationId, adminName, '상담 확정']
    );
  });

  return await getApplicationById(applicationId);
};

// Approve application (deduct balance)
const approveApplication = async (applicationId, adminName) => {
  const application = await queryOne(
    `SELECT ea.*, eb.available_balance
     FROM exchange_applications ea
     JOIN exchange_balances eb ON ea.user_id = eb.user_id
     WHERE ea.id = ?`,
    [applicationId]
  );

  if (!application) {
    throw { statusCode: 404, message: '신청을 찾을 수 없습니다.' };
  }

  if (application.status !== 'consultation_confirmed') {
    throw { statusCode: 400, message: '상담 확정 상태에서만 승인할 수 있습니다.' };
  }

  const deductAmount = application.consultation_final_amount || application.requested_amount;

  if (application.available_balance < deductAmount) {
    throw { statusCode: 400, message: '교환금 잔액이 부족합니다.' };
  }

  const ledgerId = generateLedgerId();

  await withTransaction(async (conn) => {
    // Lock balance
    const [balanceRows] = await conn.execute(
      'SELECT available_balance FROM exchange_balances WHERE user_id = ? FOR UPDATE',
      [application.user_id]
    );

    const currentBalance = balanceRows[0]?.available_balance || 0;
    if (currentBalance < deductAmount) {
      throw { statusCode: 400, message: '교환금 잔액이 부족합니다.' };
    }

    const newBalance = currentBalance - deductAmount;

    // Create ledger entry
    await queryWithConnection(conn,
      `INSERT INTO exchange_ledgers
        (id, user_id, type, amount, balance_before, balance_after, reason, description, related_type, related_id, created_by)
       VALUES (?, ?, 'debit', ?, ?, ?, 'EXCHANGE_REQUEST_APPROVED', ?, 'exchange_application', ?, ?)`,
      [ledgerId, application.user_id, deductAmount, currentBalance, newBalance, `교환 신청 승인 (${applicationId})`, applicationId, adminName]
    );

    // Update balance
    await queryWithConnection(conn,
      `UPDATE exchange_balances SET
        available_balance = available_balance - ?,
        used_balance = used_balance + ?
       WHERE user_id = ?`,
      [deductAmount, deductAmount, application.user_id]
    );

    // Update application
    await queryWithConnection(conn,
      `UPDATE exchange_applications SET
        status = 'approved',
        approved_at = NOW(),
        approved_by = ?,
        deducted_amount = ?,
        ledger_entry_id = ?
       WHERE id = ?`,
      [adminName, deductAmount, ledgerId, applicationId]
    );

    // Status history
    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, 'consultation_confirmed', 'approved', ?, ?)`,
      [applicationId, adminName, `승인 완료 - ${deductAmount.toLocaleString()}원 차감`]
    );
  });

  return await getApplicationById(applicationId);
};

// Cancel application
const cancelApplication = async (applicationId, cancelledBy, reason, isAdmin = false) => {
  const application = await queryOne('SELECT status, user_id FROM exchange_applications WHERE id = ?', [applicationId]);

  if (!application) {
    throw { statusCode: 404, message: '신청을 찾을 수 없습니다.' };
  }

  const cancellableStatuses = ['received', 'cs_consulting', 'consultation_confirmed'];
  if (!cancellableStatuses.includes(application.status)) {
    throw { statusCode: 400, message: '취소할 수 없는 상태입니다.' };
  }

  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      `UPDATE exchange_applications SET
        status = 'cancelled',
        cancelled_at = NOW(),
        cancelled_by = ?,
        cancel_reason = ?
       WHERE id = ?`,
      [cancelledBy, reason, applicationId]
    );

    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, ?, 'cancelled', ?, ?)`,
      [applicationId, application.status, cancelledBy, reason]
    );
  });

  return await getApplicationById(applicationId);
};

// Update delivery info
const updateDeliveryInfo = async (applicationId, deliveryData, adminName) => {
  const { trackingNumber, courier } = deliveryData;

  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      `UPDATE deliveries SET
        tracking_number = ?,
        courier = ?,
        status = 'shipped',
        shipped_at = NOW()
       WHERE application_id = ?`,
      [trackingNumber, courier, applicationId]
    );

    await queryWithConnection(conn,
      'UPDATE exchange_applications SET status = ? WHERE id = ?',
      ['shipping', applicationId]
    );

    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, 'ready_to_ship', 'shipping', ?, ?)`,
      [applicationId, adminName, `송장번호: ${trackingNumber}`]
    );
  });

  return await getApplicationById(applicationId);
};

// Mark as delivered
const markAsDelivered = async (applicationId, adminName) => {
  await withTransaction(async (conn) => {
    await queryWithConnection(conn,
      `UPDATE deliveries SET status = 'delivered', delivered_at = NOW() WHERE application_id = ?`,
      [applicationId]
    );

    await queryWithConnection(conn,
      'UPDATE exchange_applications SET status = ? WHERE id = ?',
      ['delivered', applicationId]
    );

    await queryWithConnection(conn,
      `INSERT INTO exchange_status_history (application_id, from_status, to_status, actor, note)
       VALUES (?, 'shipping', 'delivered', ?, '배송 완료')`,
      [applicationId, adminName]
    );
  });

  return await getApplicationById(applicationId);
};

// Get exchange statistics
const getStatistics = async () => {
  // Get counts by status
  const statusStats = await query(`
    SELECT
      status,
      COUNT(*) as count,
      SUM(COALESCE(deducted_amount, requested_amount, 0)) as total_amount
    FROM exchange_applications
    GROUP BY status
  `);

  // Get total amounts
  const [totalStats] = await query(`
    SELECT
      COUNT(*) as total,
      SUM(requested_amount) as totalRequestedAmount,
      SUM(CASE WHEN deducted_amount > 0 THEN deducted_amount ELSE 0 END) as totalApprovedAmount
    FROM exchange_applications
  `);

  // Convert statusStats array to object format for dashboard
  const byStatus = {};
  for (const stat of statusStats) {
    byStatus[stat.status] = parseInt(stat.count) || 0;
  }

  return {
    total: parseInt(totalStats.total) || 0,
    byStatus,
    totalRequestedAmount: parseInt(totalStats.totalRequestedAmount) || 0,
    totalApprovedAmount: parseInt(totalStats.totalApprovedAmount) || 0,
  };
};

module.exports = {
  createApplication,
  getApplicationById,
  getApplications,
  getMyApplications,
  updateStatus,
  confirmConsultation,
  approveApplication,
  cancelApplication,
  updateDeliveryInfo,
  markAsDelivered,
  getStatistics,
};
