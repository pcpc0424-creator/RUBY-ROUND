const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const exchangeService = require('../services/exchangeService');
const { authUser } = require('../middleware/auth');

// Create exchange application
router.post('/', authUser, asyncHandler(async (req, res) => {
  const { category, specifications, requestedAmount, requestNote, delivery } = req.body;

  if (!category || !requestedAmount) {
    return res.status(400).json({ success: false, error: '필수 정보를 입력해주세요.' });
  }

  const application = await exchangeService.createApplication({
    userId: req.user.id,
    userEmail: req.user.email,
    userName: req.user.name,
    userPhone: req.user.phone,
    category,
    specifications,
    requestedAmount,
    requestNote,
    delivery
  });

  res.json({ success: true, data: application });
}));

// Get my applications
router.get('/my', authUser, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await exchangeService.getMyApplications(req.user.id, parseInt(page), parseInt(limit));
  res.json({ success: true, data: result });
}));

// Get application detail
router.get('/:id', authUser, asyncHandler(async (req, res) => {
  const application = await exchangeService.getApplicationById(req.params.id);

  // Verify ownership
  if (application.user_id !== req.user.id) {
    return res.status(403).json({ success: false, error: '접근 권한이 없습니다.' });
  }

  res.json({ success: true, data: application });
}));

// Cancel application
router.post('/:id/cancel', authUser, asyncHandler(async (req, res) => {
  const { reason } = req.body;

  // Verify ownership
  const application = await exchangeService.getApplicationById(req.params.id);
  if (application.user_id !== req.user.id) {
    return res.status(403).json({ success: false, error: '접근 권한이 없습니다.' });
  }

  const result = await exchangeService.cancelApplication(req.params.id, req.user.name, reason || '고객 취소 요청');
  res.json({ success: true, data: result });
}));

module.exports = router;
