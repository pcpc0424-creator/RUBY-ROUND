const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/errorHandler');
const verificationService = require('../../services/verificationService');
const { authAdmin, requirePermission } = require('../../middleware/auth');

// All routes require admin auth
router.use(authAdmin);

// Get verification requests
router.get('/', requirePermission('manage_adult_verification'), asyncHandler(async (req, res) => {
  const { status, method, search, page = 1, limit = 20 } = req.query;

  const result = await verificationService.getVerificationRequests(
    { status, method, search },
    parseInt(page),
    parseInt(limit)
  );

  res.json({ success: true, data: result });
}));

// Get verification detail
router.get('/:id', requirePermission('manage_adult_verification'), asyncHandler(async (req, res) => {
  const verification = await verificationService.getVerificationById(req.params.id);
  res.json({ success: true, data: verification });
}));

// Approve verification (CEO only)
router.post('/:id/approve', requirePermission('approve_adult_verification'), asyncHandler(async (req, res) => {
  const verification = await verificationService.approveVerification(req.params.id, req.admin.name);
  res.json({ success: true, data: verification });
}));

// Reject verification
router.post('/:id/reject', requirePermission('manage_adult_verification'), asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ success: false, error: '거부 사유를 입력해주세요.' });
  }

  const verification = await verificationService.rejectVerification(req.params.id, req.admin.name, reason);
  res.json({ success: true, data: verification });
}));

// Manual adult verification for user (CEO only)
router.post('/user/:userId/manual', requirePermission('approve_adult_verification'), asyncHandler(async (req, res) => {
  const verification = await verificationService.manualAdultVerification(req.params.userId, req.admin.name);
  res.json({ success: true, data: verification });
}));

// Revoke adult verification (CEO only)
router.post('/user/:userId/revoke', requirePermission('approve_adult_verification'), asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const result = await verificationService.revokeAdultVerification(req.params.userId, req.admin.name, reason || '관리자 취소');
  res.json({ success: true, data: result });
}));

// Check user verification status
router.get('/user/:userId/status', requirePermission('view'), asyncHandler(async (req, res) => {
  const status = await verificationService.checkAdultVerification(req.params.userId);
  res.json({ success: true, data: status });
}));

// Get verification statistics
router.get('/stats/overview', requirePermission('view'), asyncHandler(async (req, res) => {
  const stats = await verificationService.getVerificationStatistics();
  res.json({ success: true, data: stats });
}));

module.exports = router;
