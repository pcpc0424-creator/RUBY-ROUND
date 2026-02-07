const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/errorHandler');
const exchangeService = require('../../services/exchangeService');
const { authAdmin, requirePermission } = require('../../middleware/auth');

// All routes require admin auth
router.use(authAdmin);

// Get all applications
router.get('/', requirePermission('view'), asyncHandler(async (req, res) => {
  const { status, category, userEmail, search, startDate, endDate, page = 1, limit = 20 } = req.query;

  const result = await exchangeService.getApplications(
    { status, category, userEmail, search, startDate, endDate },
    parseInt(page),
    parseInt(limit)
  );

  res.json({ success: true, data: result });
}));

// Get statistics (must be before /:id route)
router.get('/stats/overview', requirePermission('view'), asyncHandler(async (req, res) => {
  const stats = await exchangeService.getStatistics();
  res.json({ success: true, data: stats });
}));

// Get application detail
router.get('/:id', requirePermission('view'), asyncHandler(async (req, res) => {
  const application = await exchangeService.getApplicationById(req.params.id);
  res.json({ success: true, data: application });
}));

// Update application status
router.put('/:id/status', requirePermission('consult'), asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: '변경할 상태를 입력해주세요.' });
  }

  const application = await exchangeService.updateStatus(req.params.id, status, req.admin.name, note);
  res.json({ success: true, data: application });
}));

// Confirm consultation
router.post('/:id/consultation', requirePermission('consult'), asyncHandler(async (req, res) => {
  const { finalSpecification, finalAmount, csNote, customerConfirmed } = req.body;

  const application = await exchangeService.confirmConsultation(req.params.id, {
    finalSpecification,
    finalAmount,
    csNote,
    customerConfirmed
  }, req.admin.name);

  res.json({ success: true, data: application });
}));

// Approve application (CEO only)
router.post('/:id/approve', requirePermission('approve'), asyncHandler(async (req, res) => {
  const application = await exchangeService.approveApplication(req.params.id, req.admin.name);
  res.json({ success: true, data: application });
}));

// Cancel application
router.post('/:id/cancel', requirePermission('cancel'), asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const application = await exchangeService.cancelApplication(
    req.params.id,
    req.admin.name,
    reason || '관리자 취소',
    true
  );

  res.json({ success: true, data: application });
}));

// Update delivery info
router.put('/:id/delivery', requirePermission('manage_delivery'), asyncHandler(async (req, res) => {
  const { trackingNumber, courier } = req.body;

  if (!trackingNumber || !courier) {
    return res.status(400).json({ success: false, error: '송장번호와 택배사를 입력해주세요.' });
  }

  const application = await exchangeService.updateDeliveryInfo(req.params.id, {
    trackingNumber,
    courier
  }, req.admin.name);

  res.json({ success: true, data: application });
}));

// Mark as delivered
router.post('/:id/delivered', requirePermission('manage_delivery'), asyncHandler(async (req, res) => {
  const application = await exchangeService.markAsDelivered(req.params.id, req.admin.name);
  res.json({ success: true, data: application });
}));

module.exports = router;
