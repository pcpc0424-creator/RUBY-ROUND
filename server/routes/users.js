const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const userService = require('../services/userService');
const { authUser } = require('../middleware/auth');

// Get my balance
router.get('/balance', authUser, asyncHandler(async (req, res) => {
  const balance = await userService.getUserBalance(req.user.id);
  res.json({ success: true, data: balance });
}));

// Get my ledger
router.get('/ledger', authUser, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await userService.getUserLedger(req.user.id, parseInt(page), parseInt(limit));
  res.json({ success: true, data: result });
}));

// Get user profile
router.get('/profile', authUser, asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.json({ success: true, data: user });
}));

module.exports = router;
