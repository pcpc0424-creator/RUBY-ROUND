// Exchange API - MySQL Database Version
// This file provides backward-compatible wrappers around the new REST API

import { authApi, exchangeApi as exchangeClient, adminApi, userApi, publicApi } from './apiClient';
import { STORAGE_KEYS } from '../constants/exchangeConstants';

// ========== 고객용 API ==========

// 교환 신청 생성
export const createApplication = async (applicationData) => {
  try {
    const data = await exchangeClient.create(applicationData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 내 신청 목록 조회
export const getMyApplications = async (userEmail) => {
  try {
    const result = await exchangeClient.getMyApplications();
    return { success: true, data: result.applications || result };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 신청 상세 조회
export const getApplicationDetail = async (applicationId) => {
  try {
    const data = await exchangeClient.getDetail(applicationId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 신청 취소 (승인 전만 가능)
export const cancelApplication = async (applicationId, reason = '') => {
  try {
    const data = await exchangeClient.cancel(applicationId, reason);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 교환금 잔액 조회
export const getMyBalance = async (userEmail) => {
  try {
    const data = await userApi.getBalance();
    return {
      success: true,
      data: {
        userId: userEmail,
        totalBalance: data.total_balance || 0,
        availableBalance: data.available_balance || 0,
        holdBalance: data.hold_balance || 0,
        usedBalance: data.used_balance || 0,
      },
    };
  } catch (error) {
    return {
      success: true,
      data: {
        userId: userEmail,
        totalBalance: 0,
        availableBalance: 0,
        holdBalance: 0,
        usedBalance: 0,
      },
    };
  }
};

// ========== 관리자용 API ==========

// 신청 목록 조회 (필터링, 페이지네이션)
export const getApplications = async (filters = {}, pagination = {}) => {
  try {
    const params = {
      ...filters,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    };
    const result = await adminApi.applications.getAll(params);
    return {
      success: true,
      data: result.applications || result,
      pagination: result.pagination,
    };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 상태 변경
export const updateStatus = async (applicationId, newStatus, adminName, note = '') => {
  try {
    const data = await adminApi.applications.updateStatus(applicationId, newStatus, note);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 상담 확정
export const confirmConsultation = async (applicationId, consultationData, adminName) => {
  try {
    const data = await adminApi.applications.confirmConsultation(applicationId, consultationData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 승인 (교환금 차감)
export const approveApplication = async (applicationId, adminName) => {
  try {
    const data = await adminApi.applications.approve(applicationId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 배송 정보 업데이트
export const updateDelivery = async (applicationId, deliveryData, adminName) => {
  try {
    const data = await adminApi.applications.updateDelivery(applicationId, deliveryData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 관리자 취소
export const adminCancelApplication = async (applicationId, adminName, reason = '') => {
  try {
    const data = await adminApi.applications.cancel(applicationId, reason);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 통계 조회
export const getStatistics = async () => {
  try {
    const data = await adminApi.applications.getStatistics();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 관리자 인증 ==========

// 관리자 로그인
export const adminLogin = async (email, password) => {
  try {
    const result = await authApi.adminLogin(email, password);
    return {
      success: true,
      data: {
        admin: result.admin,
        token: result.token,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 관리자 로그아웃
export const adminLogout = async () => {
  authApi.adminLogout();
  return { success: true };
};

// 관리자 인증 확인 (동기 - 토큰 및 저장된 정보 확인)
export const getAdminAuth = () => {
  if (!authApi.isAdminLoggedIn()) {
    return null;
  }
  // 저장된 관리자 정보 반환 (role 포함)
  const adminInfo = authApi.getStoredAdminInfo();
  return {
    isAuthenticated: true,
    ...adminInfo,
  };
};

// 관리자 인증 확인 (비동기 - 서버 검증)
export const getAdminAuthAsync = async () => {
  try {
    if (!authApi.isAdminLoggedIn()) {
      return { success: false, data: null };
    }
    const admin = await authApi.getAdminMe();
    return {
      success: true,
      data: {
        isAuthenticated: true,
        admin,
      },
    };
  } catch (error) {
    return { success: false, data: null };
  }
};

// ========== 사용자 관리 ==========

// 사용자 목록 조회
export const getUsers = async (filters = {}) => {
  try {
    const result = await adminApi.users.getAll(filters);
    return { success: true, data: result.users || result };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 사용자 상세 조회 (본인 정보는 authApi 사용)
export const getUserDetail = async (userIdOrEmail) => {
  try {
    // 현재 로그인한 사용자의 이메일과 같으면 authApi 사용
    const currentUserEmail = localStorage.getItem('userEmail');
    if (currentUserEmail && userIdOrEmail === currentUserEmail) {
      const data = await authApi.getMe();
      return { success: true, data };
    }
    // 관리자가 다른 사용자 조회하는 경우
    let data;
    if (userIdOrEmail.includes('@')) {
      data = await adminApi.users.getByEmail(userIdOrEmail);
    } else {
      data = await adminApi.users.getDetail(userIdOrEmail);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 사용자 등록
export const registerUser = async (userData) => {
  try {
    const result = await authApi.register(
      userData.email,
      userData.password,
      userData.name,
      userData.phone
    );
    return { success: true, data: result.user, isNewUser: result.isNewUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 소셜 로그인 사용자 등록/조회
export const registerOrGetSocialUser = async (userData) => {
  try {
    const result = await authApi.socialLogin(userData);
    return { success: true, data: result.user, isNewUser: result.isNewUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 사용자 로그인
export const loginUser = async (email, password) => {
  try {
    const result = await authApi.login(email, password);
    return { success: true, data: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 비밀번호 변경
export const changePassword = async (email, currentPassword, newPassword) => {
  try {
    await authApi.changePassword(currentPassword, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 회원탈퇴
export const deleteUser = async (email) => {
  try {
    await authApi.deleteAccount();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 사용자 정보 수정 (관리자)
export const updateUser = async (userId, updateData) => {
  try {
    const data = await adminApi.users.updateStatus(userId, updateData.status);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 사용자 상태 변경
export const updateUserStatus = async (userId, status) => {
  try {
    const data = await adminApi.users.updateStatus(userId, status);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 교환금 충전 (관리자)
export const chargeUserBalance = async (userEmail, amount, description = '') => {
  try {
    // First get user ID from email
    const userResult = await adminApi.users.getByEmail(userEmail);
    const data = await adminApi.users.chargeBalance(userResult.id, amount, description);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 교환금 차감 (관리자)
export const deductUserBalance = async (userEmail, amount, description = '') => {
  try {
    const userResult = await adminApi.users.getByEmail(userEmail);
    const data = await adminApi.users.deductBalance(userResult.id, amount, description);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 사용자 통계
export const getUserStatistics = async () => {
  try {
    const data = await adminApi.users.getStatistics();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 배송 관리 ==========

// 배송 대기 목록
export const getDeliveryList = async (filters = {}) => {
  try {
    const result = await adminApi.applications.getAll({
      ...filters,
      status: 'ready_to_ship',
    });
    return { success: true, data: result.applications || result };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 배송 상세 조회
export const getDeliveryDetail = async (applicationId) => {
  try {
    const data = await adminApi.applications.getDetail(applicationId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 송장 등록
export const registerTrackingNumber = async (applicationId, trackingData, adminName) => {
  try {
    const data = await adminApi.applications.updateDelivery(applicationId, trackingData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 배송 완료 처리
export const markAsDelivered = async (applicationId, adminName) => {
  try {
    const data = await adminApi.applications.markDelivered(applicationId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 배송 상태 변경
export const updateDeliveryStatus = async (applicationId, newStatus, adminName, note = '') => {
  try {
    const data = await adminApi.applications.updateStatus(applicationId, newStatus, note);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 배송 통계
export const getDeliveryStatistics = async () => {
  try {
    const data = await adminApi.applications.getStatistics();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 성인 인증 ==========

// 성인 인증 요청 목록
export const getAdultVerificationRequests = async (filters = {}) => {
  try {
    const result = await adminApi.verification.getAll(filters);
    return { success: true, data: result.verifications || result };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 성인 인증 요청 생성
export const createAdultVerificationRequest = async (userData) => {
  // This is handled during user registration/login flow
  return { success: true, data: { id: 'pending' } };
};

// 성인 인증 승인
export const approveAdultVerification = async (verificationId, adminName) => {
  try {
    const data = await adminApi.verification.approve(verificationId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 성인 인증 거부
export const rejectAdultVerification = async (verificationId, adminName, reason) => {
  try {
    const data = await adminApi.verification.reject(verificationId, reason);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 인증 요청 삭제
export const deleteAdultVerification = async (verificationId) => {
  // Not directly supported, but can reject
  try {
    const data = await adminApi.verification.reject(verificationId, '삭제됨');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 수동 성인 인증
export const manualAdultVerification = async (userEmail, adminName) => {
  try {
    const userResult = await adminApi.users.getByEmail(userEmail);
    const data = await adminApi.verification.manualVerify(userResult.id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 성인 인증 취소
export const revokeAdultVerification = async (userEmail, adminName, reason) => {
  try {
    const userResult = await adminApi.users.getByEmail(userEmail);
    const data = await adminApi.verification.revoke(userResult.id, reason);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// PASS 본인인증 결과 처리
export const completePassVerification = async (userEmail, verificationData) => {
  try {
    const data = await authApi.completePassVerification(verificationData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// CI 중복 확인
export const checkDuplicateCI = async (ci, currentUserEmail) => {
  // This is checked on the server side during verification
  return { success: true, data: { isDuplicate: false } };
};

// 성인 인증 상태 확인
export const checkAdultVerification = async (userEmail) => {
  try {
    const data = await authApi.getVerificationStatus();
    return { success: true, data };
  } catch (error) {
    return { success: true, data: { isVerified: false } };
  }
};

// 성인 인증 통계
export const getAdultVerificationStatistics = async () => {
  try {
    const data = await adminApi.verification.getStatistics();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 원장 조회 ==========

// 전체 원장 조회
export const getAllLedgerEntries = async (filters = {}) => {
  try {
    const result = await adminApi.users.getAllLedgers(filters);
    return { success: true, data: result.entries || result };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// ========== 라운드 결과 ==========

// 라운드 결과 목록
export const getRoundResults = async (filters = {}) => {
  try {
    const seasons = await adminApi.seasons.getAll();
    const results = [];
    for (const season of seasons) {
      const rounds = await adminApi.seasons.getRounds(season.id);
      results.push(...rounds);
    }
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 라운드 결과 확정
export const confirmRoundResult = async (roundId, resultData, adminName) => {
  try {
    const data = await adminApi.seasons.updateRound(roundId, {
      isWinner: resultData.isWinner,
      winningValue: resultData.winningValue,
      status: 'completed',
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 라운드 결과 잠금
export const lockRoundResult = async (resultId, adminName) => {
  try {
    const data = await adminApi.seasons.updateRound(resultId, { status: 'completed' });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 보상 관리 (Stub - to be implemented) ==========

export const getRewards = async (filters = {}) => {
  return { success: true, data: [] };
};

export const createReward = async (rewardData, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const updateRewardStatus = async (rewardId, newStatus, adminName, note = '') => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const confirmRewardConfiguration = async (rewardId, configuration, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const handleRewardException = async (rewardId, exceptionData, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const getRewardStatistics = async () => {
  return { success: true, data: {} };
};

// ========== 쿠폰 관리 (Stub - to be implemented) ==========

export const getCoupons = async (filters = {}) => {
  return { success: true, data: [] };
};

export const createCoupon = async (couponData, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const updateCoupon = async (couponId, updateData, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const updateCouponStatus = async (couponId, status, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const issueCouponToUser = async (couponId, userEmail, adminName) => {
  return { success: false, error: '준비 중인 기능입니다.' };
};

export const getCouponUsages = async (filters = {}) => {
  return { success: true, data: [] };
};

export const getCouponStatistics = async () => {
  return { success: true, data: {} };
};

// ========== 감사 로그 ==========

export const createAuditLog = async (logData) => {
  // Audit logs are created automatically by the server
  return { success: true };
};

export const getAuditLogs = async (filters = {}, pagination = {}) => {
  try {
    const result = await adminApi.system.getAuditLogs({
      ...filters,
      page: pagination.page || 1,
      limit: pagination.limit || 50,
    });
    return { success: true, data: result.logs || result, pagination: result.pagination };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// ========== 시스템 설정 ==========

export const getSystemSettings = async () => {
  try {
    const data = await adminApi.system.getSettings();
    return { success: true, data };
  } catch (error) {
    // Return default settings
    return {
      success: true,
      data: {
        minimumExchangeAmount: 300000,
        siteName: '루비라운드',
        siteDescription: '프리미엄 보석 교환 서비스',
      },
    };
  }
};

export const saveSystemSettings = async (settings, adminName) => {
  try {
    const data = await adminApi.system.saveSettings(settings);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 고객 상세 정보 ==========

export const getCustomerDetail = async (userEmail) => {
  try {
    const userData = await adminApi.users.getByEmail(userEmail);
    const applicationsResult = await adminApi.applications.getAll({ userEmail });
    const ledgerResult = await adminApi.users.getLedger(userData.id, 1, 100);

    return {
      success: true,
      data: {
        user: userData,
        applications: applicationsResult.applications || [],
        balance: {
          totalBalance: userData.total_balance || 0,
          availableBalance: userData.available_balance || 0,
          holdBalance: userData.hold_balance || 0,
          usedBalance: userData.used_balance || 0,
        },
        ledger: ledgerResult.entries || [],
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 상담 모달 ==========

export const getConsultationModalContent = async () => {
  try {
    const data = await publicApi.getConsultationModal();
    return { success: true, data };
  } catch (error) {
    // Return default content
    return {
      success: true,
      data: {
        title: '상담 접수 안내',
        subtitle: '접수 전 확인해주세요',
        items: [
          { id: 1, icon: '📋', title: '상담 접수', description: '본 신청은 상담 접수이며, 교환금이 즉시 차감되지 않습니다.' },
          { id: 2, icon: '💬', title: '전문 상담사 확인', description: '전문 상담사가 연락드려 상세 내용을 확인하고 최종 사양을 협의합니다.' },
          { id: 3, icon: '✅', title: '내부 승인 후 차감', description: '내부 승인 완료 시 교환금이 차감되고 제작이 시작됩니다.' },
          { id: 4, icon: '⚠️', title: '취소 안내', description: '내부 승인 전까지는 취소가 가능하지만, 승인 이후에는 취소가 불가합니다.' },
        ],
        confirmButtonText: '확인하고 접수하기',
        cancelButtonText: '다시 확인하기',
      },
    };
  }
};

export const saveConsultationModalContent = async (content) => {
  try {
    const data = await adminApi.system.saveConsultationModal(content);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resetConsultationModalContent = async () => {
  try {
    const data = await adminApi.system.resetConsultationModal();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
