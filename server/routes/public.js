const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const systemService = require('../services/systemService');

// Get consultation modal content (public)
router.get('/modal/consultation', asyncHandler(async (req, res) => {
  const content = await systemService.getConsultationModalContent();
  res.json({ success: true, data: content });
}));

// Get public system settings
router.get('/settings', asyncHandler(async (req, res) => {
  const allSettings = await systemService.getSystemSettings();

  // Only expose public settings
  const publicSettings = {
    siteName: allSettings.site_name,
    siteDescription: allSettings.site_description,
    minimumExchangeAmount: allSettings.minimum_exchange_amount,
    contactEmail: allSettings.contact_email,
    contactPhone: allSettings.contact_phone,
  };

  res.json({ success: true, data: publicSettings });
}));

// Submit contact inquiry
router.post('/inquiries', asyncHandler(async (req, res) => {
  const { category, name, email, phone, title, content } = req.body;

  if (!name || !email || !title || !content) {
    return res.status(400).json({ success: false, error: '필수 정보를 입력해주세요.' });
  }

  const result = await systemService.createContactInquiry({ category, name, email, phone, title, content });
  res.json({ success: true, data: result });
}));

module.exports = router;
