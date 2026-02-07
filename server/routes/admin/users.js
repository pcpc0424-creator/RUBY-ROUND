const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/errorHandler');
const userService = require('../../services/userService');
const { authAdmin, requirePermission } = require('../../middleware/auth');

// All routes require admin auth
router.use(authAdmin);

// Get all ledger entries (must be before /:id route)
router.get('/ledgers', requirePermission('view'), asyncHandler(async (req, res) => {
  const { userEmail, type, startDate, endDate, page = 1, limit = 1000 } = req.query;
  const result = await userService.getAllLedgerEntries(
    { userEmail, type, startDate, endDate },
    parseInt(page),
    parseInt(limit)
  );
  res.json({ success: true, data: result });
}));

// Get user statistics (must be before /:id route)
router.get('/stats/overview', requirePermission('view'), asyncHandler(async (req, res) => {
  const stats = await userService.getUserStatistics();
  res.json({ success: true, data: stats });
}));

// Get all users
router.get('/', requirePermission('view'), asyncHandler(async (req, res) => {
  const { status, search, isAdultVerified, page = 1, limit = 20 } = req.query;

  const result = await userService.getUsers(
    { status, search, isAdultVerified: isAdultVerified === 'true' ? true : isAdultVerified === 'false' ? false : undefined },
    parseInt(page),
    parseInt(limit)
  );

  res.json({ success: true, data: result });
}));

// Get user detail
router.get('/:id', requirePermission('view'), asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
}));

// Get user by email
router.get('/email/:email', requirePermission('view'), asyncHandler(async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);
  if (!user) {
    return res.status(404).json({ success: false, error: '사용자를 찾을 수 없습니다.' });
  }
  res.json({ success: true, data: user });
}));

// Update user status
router.put('/:id/status', requirePermission('manage_users'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: '상태를 입력해주세요.' });
  }

  const user = await userService.updateUserStatus(req.params.id, status);
  res.json({ success: true, data: user });
}));

// Charge user balance
router.post('/:id/balance/charge', requirePermission('manage_users'), asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: '올바른 금액을 입력해주세요.' });
  }

  const result = await userService.chargeUserBalance(
    req.params.id,
    amount,
    description || '관리자 충전',
    req.admin.name
  );

  res.json({ success: true, data: result });
}));

// Deduct user balance
router.post('/:id/balance/deduct', requirePermission('manage_users'), asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: '올바른 금액을 입력해주세요.' });
  }

  const result = await userService.deductUserBalance(
    req.params.id,
    amount,
    description || '관리자 차감',
    req.admin.name
  );

  res.json({ success: true, data: result });
}));

// Get user ledger
router.get('/:id/ledger', requirePermission('view'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await userService.getUserLedger(req.params.id, parseInt(page), parseInt(limit));
  res.json({ success: true, data: result });
}));

module.exports = router;
