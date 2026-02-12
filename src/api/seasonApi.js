// Season API - MySQL Database Version
// This file provides backward-compatible wrappers around the new REST API

import { seasonApi as seasonClient, adminApi, userApi } from './apiClient';

// ========== 시즌 관리 API ==========

// 시즌 목록 조회
export const getSeasons = async () => {
  try {
    const data = await seasonClient.getSeasons();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 시즌 상세 조회
export const getSeasonDetail = async (seasonId) => {
  try {
    const data = await seasonClient.getSeasonDetail(seasonId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 시즌 생성 (관리자)
export const createSeason = async (seasonData) => {
  try {
    const data = await adminApi.seasons.create(seasonData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 시즌 수정 (관리자)
export const updateSeason = async (seasonId, updateData) => {
  try {
    const data = await adminApi.seasons.update(seasonId, updateData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 시즌 삭제 (관리자)
export const deleteSeason = async (seasonId) => {
  try {
    await adminApi.seasons.delete(seasonId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 라운드 관리 API ==========

// 시즌별 라운드 목록 조회
export const getRoundsBySeason = async (seasonId) => {
  try {
    const data = await seasonClient.getRounds(seasonId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 라운드 생성 (관리자)
export const createRound = async (seasonId, roundData) => {
  try {
    const data = await adminApi.seasons.createRound(seasonId, roundData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 라운드 수정 (관리자)
export const updateRound = async (roundId, updateData) => {
  try {
    const data = await adminApi.seasons.updateRound(roundId, updateData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 라운드 삭제 (관리자)
export const deleteRound = async (roundId) => {
  try {
    await adminApi.seasons.deleteRound(roundId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 결제 데이터 API ==========

// 라운드 참여 결제 저장
export const createRoundPayment = async (paymentData) => {
  try {
    const data = await seasonClient.createPayment(paymentData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 시즌별 결제 목록 조회 (관리자)
export const getPaymentsBySeason = async (seasonId) => {
  try {
    const data = await adminApi.seasons.getPayments(seasonId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 사용자별 결제 목록 조회
export const getPaymentsByUser = async (userEmail) => {
  try {
    const data = await seasonClient.getMyPayments();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// ========== 시즌 정산 API (핵심) ==========

// 정산 미리보기 (실제 정산 전 시뮬레이션)
export const getSettlementPreview = async (seasonId, settlementType, winningRoundId = null, winningValue = 0) => {
  try {
    const data = await adminApi.seasons.getSettlementPreview(seasonId, settlementType, winningRoundId, winningValue);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 시즌 정산 확정 (실제 실행)
export const executeSettlement = async (seasonId, settlementType, winningRoundId = null, winningValue = 0, adminName = 'system') => {
  try {
    const data = await adminApi.seasons.executeSettlement(seasonId, settlementType, winningRoundId, winningValue);
    return {
      success: true,
      data: {
        settlement: data,
        summary: data,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 정산 내역 조회
export const getSettlements = async () => {
  try {
    const data = await adminApi.seasons.getAllSettlements();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// 정산 상세 조회
export const getSettlementDetail = async (settlementId) => {
  try {
    const data = await adminApi.seasons.getSettlementDetail(settlementId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ========== 고객용 교환금 내역 조회 ==========

// 사용자 교환금 원장 조회
export const getUserLedger = async (userEmail) => {
  try {
    const result = await seasonClient.getMyLedger(1, 100);
    return {
      success: true,
      data: {
        ledger: result.entries || [],
      },
    };
  } catch (error) {
    return {
      success: true,
      data: {
        totalBalance: 0,
        availableBalance: 0,
        ledger: [],
      },
    };
  }
};

// 관리자: 사용자 원장 조회
export const getAdminUserLedger = async (userId, page = 1, limit = 20) => {
  try {
    const data = await adminApi.users.getLedger(userId, page, limit);
    return { success: true, data: data.entries || data, pagination: data.pagination };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};
