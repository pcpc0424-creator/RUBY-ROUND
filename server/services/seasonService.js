const { query, queryOne, withTransaction, queryWithConnection } = require('../config/database');
const { generateSeasonId, generateRoundId, generatePaymentId, generateSettlementId, generateLedgerId } = require('../utils/helpers');

// ==================== SEASONS ====================

// Create season
const createSeason = async (seasonData) => {
  const { name, description, totalAmount, roundAmount, startDate, endDate } = seasonData;
  const seasonId = generateSeasonId();

  await query(
    `INSERT INTO seasons (id, name, description, total_amount, round_amount, start_date, end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [seasonId, name, description, totalAmount, roundAmount, startDate, endDate]
  );

  return await getSeasonById(seasonId);
};

// Get season by ID
const getSeasonById = async (seasonId) => {
  const season = await queryOne('SELECT * FROM seasons WHERE id = ?', [seasonId]);
  if (!season) {
    throw { statusCode: 404, message: '시즌을 찾을 수 없습니다.' };
  }

  // Get rounds for this season
  const rounds = await query(
    'SELECT * FROM rounds WHERE season_id = ? ORDER BY round_number',
    [seasonId]
  );

  season.rounds = rounds;
  return season;
};

// Get all seasons
const getSeasons = async () => {
  const seasons = await query('SELECT * FROM seasons ORDER BY start_date DESC');

  // Get round counts for each season
  for (const season of seasons) {
    const [countResult] = await query(
      'SELECT COUNT(*) as count FROM rounds WHERE season_id = ?',
      [season.id]
    );
    season.roundCount = countResult?.count || 0;
  }

  return seasons;
};

// Update season
const updateSeason = async (seasonId, updateData) => {
  const { name, description, totalAmount, roundAmount, startDate, endDate, status } = updateData;
  const updates = [];
  const values = [];

  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (totalAmount !== undefined) { updates.push('total_amount = ?'); values.push(totalAmount); }
  if (roundAmount !== undefined) { updates.push('round_amount = ?'); values.push(roundAmount); }
  if (startDate !== undefined) { updates.push('start_date = ?'); values.push(startDate); }
  if (endDate !== undefined) { updates.push('end_date = ?'); values.push(endDate); }
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }

  if (updates.length === 0) {
    throw { statusCode: 400, message: '수정할 데이터가 없습니다.' };
  }

  values.push(seasonId);
  await query(`UPDATE seasons SET ${updates.join(', ')} WHERE id = ?`, values);

  return await getSeasonById(seasonId);
};

// Delete season
const deleteSeason = async (seasonId) => {
  // Check if season has rounds
  const rounds = await query(
    'SELECT COUNT(*) as count FROM rounds WHERE season_id = ?',
    [seasonId]
  );

  if (rounds[0]?.count > 0) {
    throw { statusCode: 400, message: '라운드가 있는 시즌은 삭제할 수 없습니다. 먼저 라운드를 삭제해주세요.' };
  }

  // Check if season has payments
  const payments = await query(
    'SELECT COUNT(*) as count FROM round_payments WHERE season_id = ?',
    [seasonId]
  );

  if (payments[0]?.count > 0) {
    throw { statusCode: 400, message: '결제 내역이 있는 시즌은 삭제할 수 없습니다.' };
  }

  await query('DELETE FROM seasons WHERE id = ?', [seasonId]);
  return true;
};

// ==================== ROUNDS ====================

// Create round
const createRound = async (roundData) => {
  const { seasonId, roundNumber, name, description, roundValue, startDate, endDate } = roundData;
  const roundId = generateRoundId();

  // Use current date as default for start_date and end_date if not provided
  const today = new Date().toISOString().split('T')[0];
  const actualStartDate = startDate || today;
  const actualEndDate = endDate || today;

  await query(
    `INSERT INTO rounds (id, season_id, round_number, name, description, round_value, start_date, end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [roundId, seasonId, roundNumber, name, description || null, roundValue, actualStartDate, actualEndDate]
  );

  return await getRoundById(roundId);
};

// Get round by ID
const getRoundById = async (roundId) => {
  const round = await queryOne('SELECT * FROM rounds WHERE id = ?', [roundId]);
  if (!round) {
    throw { statusCode: 404, message: '라운드를 찾을 수 없습니다.' };
  }
  return round;
};

// Get rounds by season
const getRoundsBySeason = async (seasonId) => {
  return await query(
    'SELECT * FROM rounds WHERE season_id = ? ORDER BY round_number',
    [seasonId]
  );
};

// Update round
const updateRound = async (roundId, updateData) => {
  const { name, description, roundValue, startDate, endDate, status, isWinner, winningValue } = updateData;
  const updates = [];
  const values = [];

  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (roundValue !== undefined) { updates.push('round_value = ?'); values.push(roundValue); }
  if (startDate !== undefined) { updates.push('start_date = ?'); values.push(startDate); }
  if (endDate !== undefined) { updates.push('end_date = ?'); values.push(endDate); }
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }
  if (isWinner !== undefined) { updates.push('is_winner = ?'); values.push(isWinner); }
  if (winningValue !== undefined) { updates.push('winning_value = ?'); values.push(winningValue); }

  if (updates.length === 0) {
    throw { statusCode: 400, message: '수정할 데이터가 없습니다.' };
  }

  values.push(roundId);
  await query(`UPDATE rounds SET ${updates.join(', ')} WHERE id = ?`, values);

  return await getRoundById(roundId);
};

// Delete round
const deleteRound = async (roundId) => {
  // Check if round has payments
  const payments = await query(
    'SELECT COUNT(*) as count FROM round_payments WHERE round_id = ?',
    [roundId]
  );

  if (payments[0]?.count > 0) {
    throw { statusCode: 400, message: '결제 내역이 있는 라운드는 삭제할 수 없습니다.' };
  }

  await query('DELETE FROM rounds WHERE id = ?', [roundId]);
  return true;
};

// ==================== PAYMENTS ====================

// Create round payment
const createRoundPayment = async (paymentData) => {
  const { userId, seasonId, roundId, amount, paymentKey, orderId, paymentDataJson } = paymentData;
  const paymentId = generatePaymentId();

  await query(
    `INSERT INTO round_payments (id, user_id, season_id, round_id, amount, payment_key, order_id, payment_data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [paymentId, userId, seasonId, roundId, amount, paymentKey, orderId, JSON.stringify(paymentDataJson || {})]
  );

  return await getPaymentById(paymentId);
};

// Get payment by ID
const getPaymentById = async (paymentId) => {
  const payment = await queryOne('SELECT * FROM round_payments WHERE id = ?', [paymentId]);
  if (!payment) {
    throw { statusCode: 404, message: '결제를 찾을 수 없습니다.' };
  }
  if (payment.payment_data) {
    payment.payment_data = JSON.parse(payment.payment_data);
  }
  return payment;
};

// Get payments by season
const getPaymentsBySeason = async (seasonId) => {
  const payments = await query(
    `SELECT rp.*, u.name as user_name, u.email as user_email, r.name as round_name
     FROM round_payments rp
     JOIN users u ON rp.user_id = u.id
     JOIN rounds r ON rp.round_id = r.id
     WHERE rp.season_id = ?
     ORDER BY rp.paid_at DESC`,
    [seasonId]
  );

  return payments.map(p => {
    if (p.payment_data && typeof p.payment_data === 'string') {
      try {
        p.payment_data = JSON.parse(p.payment_data);
      } catch (e) {
        // If parsing fails, keep it as is
      }
    }
    return p;
  });
};

// Get payments by user
const getPaymentsByUser = async (userId) => {
  const payments = await query(
    `SELECT rp.*, s.name as season_name, r.name as round_name
     FROM round_payments rp
     JOIN seasons s ON rp.season_id = s.id
     JOIN rounds r ON rp.round_id = r.id
     WHERE rp.user_id = ?
     ORDER BY rp.paid_at DESC`,
    [userId]
  );

  return payments.map(p => {
    if (p.payment_data && typeof p.payment_data === 'string') {
      try {
        p.payment_data = JSON.parse(p.payment_data);
      } catch (e) {
        // If parsing fails, keep it as is
      }
    }
    return p;
  });
};

// Delete payment
const deletePayment = async (paymentId) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw { statusCode: 404, message: '결제를 찾을 수 없습니다.' };
  }

  await query('DELETE FROM round_payments WHERE id = ?', [paymentId]);
  return { success: true };
};

// ==================== SETTLEMENT ====================

// Get settlement preview
const getSettlementPreview = async (seasonId, settlementType, winningRoundId, winningValue) => {
  const season = await getSeasonById(seasonId);
  if (!season) {
    throw { statusCode: 404, message: '시즌을 찾을 수 없습니다.' };
  }

  if (season.is_settled) {
    throw { statusCode: 400, message: '이미 정산된 시즌입니다.' };
  }

  // Get all payments for this season with user info
  const payments = await query(
    `SELECT rp.user_id, u.email as user_email, u.name as user_name, rp.round_id, rp.amount
     FROM round_payments rp
     JOIN users u ON rp.user_id = u.id
     WHERE rp.season_id = ? AND rp.status = 'success'`,
    [seasonId]
  );

  // Group by user
  const userPayments = {};
  for (const payment of payments) {
    if (!userPayments[payment.user_id]) {
      userPayments[payment.user_id] = {
        userId: payment.user_id,
        userEmail: payment.user_email,
        userName: payment.user_name,
        payments: [],
        totalPaid: 0,
        participatedRounds: new Set()
      };
    }
    userPayments[payment.user_id].payments.push(payment);
    userPayments[payment.user_id].totalPaid += payment.amount;
    userPayments[payment.user_id].participatedRounds.add(payment.round_id);
  }

  // Calculate credits
  const customerResults = [];
  let totalCreditAmount = 0;
  let winnerCount = 0;
  let nonWinnerCount = 0;
  let zeroAmountCount = 0;

  for (const userId in userPayments) {
    const userInfo = userPayments[userId];
    let creditAmount = 0;
    let isWinnerRoundParticipant = false;

    if (settlementType === 'no_winner') {
      // 전액 적립
      creditAmount = userInfo.totalPaid;
    } else {
      // 당첨 라운드 참여자 확인
      if (winningRoundId && userInfo.participatedRounds.has(winningRoundId)) {
        isWinnerRoundParticipant = true;
        winnerCount++;
        // 당첨 라운드 참여자는 해당 금액 차감
        const winningPayment = userInfo.payments.find(p => p.round_id === winningRoundId);
        creditAmount = userInfo.totalPaid - (winningPayment?.amount || 0);
      } else {
        nonWinnerCount++;
        creditAmount = userInfo.totalPaid;
      }
    }

    if (creditAmount === 0) {
      zeroAmountCount++;
    }

    customerResults.push({
      userId: userInfo.userId,
      userEmail: userInfo.userEmail,
      userName: userInfo.userName,
      totalPaid: userInfo.totalPaid,
      creditAmount,
      isWinnerRoundParticipant
    });

    totalCreditAmount += creditAmount;
  }

  return {
    seasonId,
    seasonName: season.name,
    settlementType,
    winningRoundId,
    winningValue,
    totalCustomers: Object.keys(userPayments).length,
    winnerCount,
    nonWinnerCount,
    zeroAmountCount,
    totalPaidAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    totalCreditAmount,
    customerResults
  };
};

// Execute settlement
const executeSettlement = async (seasonId, settlementType, winningRoundId, winningValue, adminName) => {
  const preview = await getSettlementPreview(seasonId, settlementType, winningRoundId, winningValue);
  const settlementId = generateSettlementId();

  await withTransaction(async (conn) => {
    // Lock season
    const [seasonRows] = await conn.execute(
      'SELECT is_settled FROM seasons WHERE id = ? FOR UPDATE',
      [seasonId]
    );

    if (seasonRows[0]?.is_settled) {
      throw { statusCode: 400, message: '이미 정산된 시즌입니다.' };
    }

    // Process each customer
    const ledgerEntries = [];
    for (const customer of preview.customerResults) {
      if (customer.creditAmount > 0) {
        const ledgerId = generateLedgerId();

        // Get current balance
        const [balanceRows] = await conn.execute(
          'SELECT available_balance FROM exchange_balances WHERE user_id = ? FOR UPDATE',
          [customer.userId]
        );

        const currentBalance = balanceRows[0]?.available_balance || 0;
        const newBalance = currentBalance + customer.creditAmount;

        // Create ledger entry
        await queryWithConnection(conn,
          `INSERT INTO exchange_ledgers
            (id, user_id, type, amount, balance_before, balance_after, reason, description, related_type, related_id, created_by)
           VALUES (?, ?, 'credit', ?, ?, ?, 'SEASON_SETTLEMENT', ?, 'season_settlement', ?, ?)`,
          [ledgerId, customer.userId, customer.creditAmount, currentBalance, newBalance,
           `시즌 정산 적립 (${preview.seasonName})`, settlementId, adminName]
        );

        // Update balance
        await queryWithConnection(conn,
          `UPDATE exchange_balances SET
            total_balance = total_balance + ?,
            available_balance = available_balance + ?
           WHERE user_id = ?`,
          [customer.creditAmount, customer.creditAmount, customer.userId]
        );

        ledgerEntries.push({
          ledgerId,
          userId: customer.userId,
          amount: customer.creditAmount
        });
      }
    }

    // Create settlement record
    await queryWithConnection(conn,
      `INSERT INTO season_settlements
        (id, season_id, settlement_type, winning_round_id, winning_value,
         total_customers, winner_count, non_winner_count, zero_amount_count,
         total_paid_amount, total_credit_amount, customer_results, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [settlementId, seasonId, settlementType, winningRoundId, winningValue,
       preview.totalCustomers, preview.winnerCount, preview.nonWinnerCount, preview.zeroAmountCount,
       preview.totalPaidAmount, preview.totalCreditAmount, JSON.stringify(preview.customerResults), adminName]
    );

    // Update season
    await queryWithConnection(conn,
      `UPDATE seasons SET
        is_settled = 1,
        settled_at = NOW(),
        settlement_id = ?,
        status = 'settled'
       WHERE id = ?`,
      [settlementId, seasonId]
    );

    // Update winning round if applicable
    if (winningRoundId) {
      await queryWithConnection(conn,
        `UPDATE rounds SET
          is_winner = 1,
          winning_value = ?,
          result_confirmed_at = NOW(),
          result_confirmed_by = ?
         WHERE id = ?`,
        [winningValue, adminName, winningRoundId]
      );
    }
  });

  return await getSettlementById(settlementId);
};

// Get settlement by ID
const getSettlementById = async (settlementId) => {
  const settlement = await queryOne('SELECT * FROM season_settlements WHERE id = ?', [settlementId]);
  if (!settlement) {
    throw { statusCode: 404, message: '정산 내역을 찾을 수 없습니다.' };
  }
  if (settlement.customer_results) {
    settlement.customer_results = JSON.parse(settlement.customer_results);
  }
  return settlement;
};

// Get all settlements
const getSettlements = async () => {
  const settlements = await query(
    `SELECT ss.*, s.name as season_name
     FROM season_settlements ss
     JOIN seasons s ON ss.season_id = s.id
     ORDER BY ss.created_at DESC`
  );

  return settlements.map(s => {
    if (s.customer_results) s.customer_results = JSON.parse(s.customer_results);
    return s;
  });
};

// Get user's ledger entries
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

module.exports = {
  // Seasons
  createSeason,
  getSeasonById,
  getSeasons,
  updateSeason,
  deleteSeason,
  // Rounds
  createRound,
  getRoundById,
  getRoundsBySeason,
  updateRound,
  deleteRound,
  // Payments
  createRoundPayment,
  getPaymentById,
  getPaymentsBySeason,
  getPaymentsByUser,
  deletePayment,
  // Settlement
  getSettlementPreview,
  executeSettlement,
  getSettlementById,
  getSettlements,
  getUserLedger,
};
