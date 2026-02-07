const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const userService = require('../services/userService');
const adminService = require('../services/adminService');
const verificationService = require('../services/verificationService');
const { authUser, authAdmin } = require('../middleware/auth');

// ==================== USER AUTH ====================

// Register user
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: '필수 정보를 입력해주세요.' });
  }

  const result = await userService.registerUser({ email, password, name, phone });
  res.json({ success: true, data: result });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: '이메일과 비밀번호를 입력해주세요.' });
  }

  const result = await userService.loginUser(email, password);
  res.json({ success: true, data: result });
}));

// Social login (Kakao/Google - store user after OAuth)
router.post('/social', asyncHandler(async (req, res) => {
  const { email, name, socialProvider, socialId, profileImage, phone } = req.body;

  if (!email || !socialProvider || !socialId) {
    return res.status(400).json({ success: false, error: '필수 정보가 누락되었습니다.' });
  }

  const result = await userService.registerOrGetSocialUser({
    email, name, socialProvider, socialId, profileImage, phone
  });

  res.json({ success: true, data: result });
}));

// Get current user
router.get('/me', authUser, asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.json({ success: true, data: user });
}));

// Update user profile
router.put('/me', authUser, asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await userService.updateUser(req.user.id, { name, phone });
  res.json({ success: true, data: user });
}));

// Change password
router.put('/password', authUser, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: '현재 비밀번호와 새 비밀번호를 입력해주세요.' });
  }

  await userService.changePassword(req.user.id, currentPassword, newPassword);
  res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
}));

// Delete account
router.delete('/me', authUser, asyncHandler(async (req, res) => {
  await userService.deleteUser(req.user.id);
  res.json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });
}));

// ==================== ADULT VERIFICATION ====================

// Check adult verification status
router.get('/verification/status', authUser, asyncHandler(async (req, res) => {
  const status = await verificationService.checkAdultVerification(req.user.id);
  res.json({ success: true, data: status });
}));

// Complete PASS verification
router.post('/verification/pass', authUser, asyncHandler(async (req, res) => {
  const { name, birthDate, gender, ci, di, isAdult } = req.body;

  const result = await verificationService.completePassVerification(req.user.id, {
    name, birthDate, gender, ci, di, isAdult, method: 'pass'
  });

  res.json({ success: true, data: result });
}));

// ==================== ADMIN AUTH ====================

// Admin login
router.post('/admin/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: '이메일과 비밀번호를 입력해주세요.' });
  }

  const result = await adminService.adminLogin(email, password);
  res.json({ success: true, data: result });
}));

// Get current admin
router.get('/admin/me', authAdmin, asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
}));

// Admin logout (just return success, token is cleared on frontend)
router.post('/admin/logout', authAdmin, asyncHandler(async (req, res) => {
  res.json({ success: true, message: '로그아웃되었습니다.' });
}));

module.exports = router;
