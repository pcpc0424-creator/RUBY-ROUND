const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const seasonService = require('../services/seasonService');
const { authUser, optionalAuth } = require('../middleware/auth');

// Get all seasons (public)
router.get('/', asyncHandler(async (req, res) => {
  const seasons = await seasonService.getSeasons();
  res.json({ success: true, data: seasons });
}));

// Get season detail (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const season = await seasonService.getSeasonById(req.params.id);
  res.json({ success: true, data: season });
}));

// Get rounds by season (public)
router.get('/:id/rounds', asyncHandler(async (req, res) => {
  const rounds = await seasonService.getRoundsBySeason(req.params.id);
  res.json({ success: true, data: rounds });
}));

// Get payments by season (for current user)
router.get('/:id/payments', authUser, asyncHandler(async (req, res) => {
  // This returns only the current user's payments for the season
  const allPayments = await seasonService.getPaymentsBySeason(req.params.id);
  const userPayments = allPayments.filter(p => p.user_id === req.user.id);
  res.json({ success: true, data: userPayments });
}));

// Create round payment (supports both auth token and email lookup)
router.post('/payments', optionalAuth, asyncHandler(async (req, res) => {
  const { seasonId, roundId, amount, paymentKey, orderId, paymentData, userEmail } = req.body;

  if (!seasonId || !roundId || !amount || !orderId) {
    return res.status(400).json({ success: false, error: '필수 정보가 누락되었습니다.' });
  }

  // Get userId from auth token or lookup by email
  let userId = req.user?.id;

  if (!userId && userEmail) {
    const userService = require('../services/userService');
    const user = await userService.getUserByEmail(userEmail);
    if (user) {
      userId = user.id;
    }
  }

  if (!userId) {
    return res.status(400).json({ success: false, error: '사용자 정보를 찾을 수 없습니다.' });
  }

  const payment = await seasonService.createRoundPayment({
    userId,
    seasonId,
    roundId,
    amount,
    paymentKey,
    orderId,
    paymentDataJson: paymentData
  });

  res.json({ success: true, data: payment });
}));

// Get my payments
router.get('/my/payments', authUser, asyncHandler(async (req, res) => {
  const payments = await seasonService.getPaymentsByUser(req.user.id);
  res.json({ success: true, data: payments });
}));

// Get my ledger
router.get('/my/ledger', authUser, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await seasonService.getUserLedger(req.user.id, parseInt(page), parseInt(limit));
  res.json({ success: true, data: result });
}));

module.exports = router;
