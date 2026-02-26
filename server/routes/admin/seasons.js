const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/errorHandler');
const seasonService = require('../../services/seasonService');
const { authAdmin, requirePermission } = require('../../middleware/auth');

// All routes require admin auth
router.use(authAdmin);

// ==================== SETTLEMENTS (must be before /:id) ====================

// Get all settlements
router.get('/settlements/all', requirePermission('view'), asyncHandler(async (req, res) => {
  const settlements = await seasonService.getSettlements();
  res.json({ success: true, data: settlements });
}));

// Get settlement detail
router.get('/settlements/:id', requirePermission('view'), asyncHandler(async (req, res) => {
  const settlement = await seasonService.getSettlementById(req.params.id);
  res.json({ success: true, data: settlement });
}));

// ==================== SEASONS ====================

// Get all seasons
router.get('/', requirePermission('view'), asyncHandler(async (req, res) => {
  const seasons = await seasonService.getSeasons();
  res.json({ success: true, data: seasons });
}));

// Create season
router.post('/', requirePermission('manage_seasons'), asyncHandler(async (req, res) => {
  const { name, description, totalAmount, roundAmount, startDate, endDate } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ success: false, error: '필수 정보를 입력해주세요.' });
  }

  const season = await seasonService.createSeason({
    name, description, totalAmount, roundAmount, startDate, endDate
  });

  res.json({ success: true, data: season });
}));

// Get season detail
router.get('/:id', requirePermission('view'), asyncHandler(async (req, res) => {
  const season = await seasonService.getSeasonById(req.params.id);
  res.json({ success: true, data: season });
}));

// Update season
router.put('/:id', requirePermission('manage_seasons'), asyncHandler(async (req, res) => {
  const { name, description, totalAmount, roundAmount, startDate, endDate, status } = req.body;

  const season = await seasonService.updateSeason(req.params.id, {
    name, description, totalAmount, roundAmount, startDate, endDate, status
  });

  res.json({ success: true, data: season });
}));

// Delete season
router.delete('/:id', requirePermission('manage_seasons'), asyncHandler(async (req, res) => {
  await seasonService.deleteSeason(req.params.id);
  res.json({ success: true, message: '시즌이 삭제되었습니다.' });
}));

// ==================== ROUNDS ====================

// Get rounds by season
router.get('/:seasonId/rounds', requirePermission('view'), asyncHandler(async (req, res) => {
  const rounds = await seasonService.getRoundsBySeason(req.params.seasonId);
  res.json({ success: true, data: rounds });
}));

// Create round
router.post('/:seasonId/rounds', requirePermission('manage_rounds'), asyncHandler(async (req, res) => {
  const { roundNumber, name, title, description, roundValue, price, startDate, endDate } = req.body;
  const actualName = name || title || `${roundNumber}회차`;
  const actualRoundValue = roundValue || price || 0;

  if (!roundNumber) {
    return res.status(400).json({ success: false, error: '라운드 번호를 입력해주세요.' });
  }

  const round = await seasonService.createRound({
    seasonId: req.params.seasonId,
    roundNumber,
    name: actualName,
    description,
    roundValue: actualRoundValue,
    startDate,
    endDate
  });

  res.json({ success: true, data: round });
}));

// Update round
router.put('/rounds/:id', requirePermission('manage_rounds'), asyncHandler(async (req, res) => {
  const { name, title, description, roundValue, price, startDate, endDate, status, isWinner, winningValue } = req.body;

  const round = await seasonService.updateRound(req.params.id, {
    name: name || title,
    description,
    roundValue: roundValue !== undefined ? roundValue : price,
    startDate,
    endDate,
    status,
    isWinner,
    winningValue
  });

  res.json({ success: true, data: round });
}));

// Delete round
router.delete('/rounds/:id', requirePermission('manage_rounds'), asyncHandler(async (req, res) => {
  await seasonService.deleteRound(req.params.id);
  res.json({ success: true, message: '라운드가 삭제되었습니다.' });
}));

// ==================== PAYMENTS ====================

// Get payments by season
router.get('/:seasonId/payments', requirePermission('view'), asyncHandler(async (req, res) => {
  const payments = await seasonService.getPaymentsBySeason(req.params.seasonId);
  res.json({ success: true, data: payments });
}));

// Delete payment
router.delete('/payments/:paymentId', requirePermission('manage_rounds'), asyncHandler(async (req, res) => {
  await seasonService.deletePayment(req.params.paymentId);
  res.json({ success: true, message: '결제 내역이 삭제되었습니다.' });
}));

// ==================== SETTLEMENT ====================

// Get settlement preview
router.post('/:seasonId/settlement/preview', requirePermission('manage_settlement'), asyncHandler(async (req, res) => {
  const { settlementType, winningRoundId, winningValue } = req.body;

  if (!settlementType) {
    return res.status(400).json({ success: false, error: '정산 유형을 선택해주세요.' });
  }

  const preview = await seasonService.getSettlementPreview(
    req.params.seasonId,
    settlementType,
    winningRoundId,
    winningValue
  );

  res.json({ success: true, data: preview });
}));

// Execute settlement
router.post('/:seasonId/settlement/execute', requirePermission('manage_settlement'), asyncHandler(async (req, res) => {
  const { settlementType, winningRoundId, winningValue } = req.body;

  if (!settlementType) {
    return res.status(400).json({ success: false, error: '정산 유형을 선택해주세요.' });
  }

  const settlement = await seasonService.executeSettlement(
    req.params.seasonId,
    settlementType,
    winningRoundId,
    winningValue,
    req.admin.name
  );

  res.json({ success: true, data: settlement });
}));

module.exports = router;
