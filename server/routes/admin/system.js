const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../middleware/errorHandler');
const systemService = require('../../services/systemService');
const { authAdmin, requirePermission } = require('../../middleware/auth');

// All routes require admin auth
router.use(authAdmin);

// ==================== SYSTEM SETTINGS ====================

// Get all system settings
router.get('/settings', requirePermission('view'), asyncHandler(async (req, res) => {
  const settings = await systemService.getSystemSettings();
  res.json({ success: true, data: settings });
}));

// Save system settings (CEO only)
router.put('/settings', requirePermission('manage_system'), asyncHandler(async (req, res) => {
  const settings = req.body;
  const result = await systemService.saveSystemSettings(settings, req.admin.name);
  res.json({ success: true, data: result });
}));

// ==================== CONSULTATION MODAL ====================

// Get consultation modal content
router.get('/modal/consultation', requirePermission('view'), asyncHandler(async (req, res) => {
  const content = await systemService.getConsultationModalContent();
  res.json({ success: true, data: content });
}));

// Save consultation modal content (CEO only)
router.put('/modal/consultation', requirePermission('manage_modal'), asyncHandler(async (req, res) => {
  const content = req.body;
  const result = await systemService.saveConsultationModalContent(content, req.admin.name);
  res.json({ success: true, data: result });
}));

// Reset consultation modal to default (CEO only)
router.post('/modal/consultation/reset', requirePermission('manage_modal'), asyncHandler(async (req, res) => {
  const result = await systemService.resetConsultationModalContent(req.admin.name);
  res.json({ success: true, data: result });
}));

// ==================== AUDIT LOGS ====================

// Get audit logs
router.get('/audit-logs', requirePermission('view_audit_logs'), asyncHandler(async (req, res) => {
  const { actorType, action, targetType, startDate, endDate, search, page = 1, limit = 50 } = req.query;

  const result = await systemService.getAuditLogs(
    { actorType, action, targetType, startDate, endDate, search },
    parseInt(page),
    parseInt(limit)
  );

  res.json({ success: true, data: result });
}));

// ==================== CONTACT INQUIRIES ====================

// Get contact inquiries
router.get('/inquiries', requirePermission('view'), asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const result = await systemService.getContactInquiries(
    { status, search },
    parseInt(page),
    parseInt(limit)
  );

  res.json({ success: true, data: result });
}));

// Respond to inquiry
router.post('/inquiries/:id/respond', requirePermission('view'), asyncHandler(async (req, res) => {
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ success: false, error: '답변 내용을 입력해주세요.' });
  }

  const result = await systemService.respondToInquiry(req.params.id, response, req.admin.name);
  res.json({ success: true, data: result });
}));

// Update inquiry status
router.put('/inquiries/:id/status', requirePermission('view'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: '상태를 선택해주세요.' });
  }

  const result = await systemService.updateInquiryStatus(req.params.id, status);
  res.json({ success: true, data: result });
}));

// Delete inquiry
router.delete('/inquiries/:id', requirePermission('manage_system'), asyncHandler(async (req, res) => {
  const result = await systemService.deleteInquiry(req.params.id);
  res.json({ success: true, data: result });
}));

module.exports = router;
