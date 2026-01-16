import { STORAGE_KEYS } from '../constants/exchangeConstants';

// ID 생성 함수
const generateId = (prefix) => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
};

// localStorage 헬퍼
const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ========== 시즌 관리 API ==========

// 시즌 목록 조회
export const getSeasons = async () => {
  const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
  return { success: true, data: seasons };
};

// 시즌 상세 조회
export const getSeasonDetail = async (seasonId) => {
  const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
  const season = seasons.find(s => s.id === seasonId);
  if (!season) {
    return { success: false, error: '시즌을 찾을 수 없습니다.' };
  }
  return { success: true, data: season };
};

// 시즌 생성
export const createSeason = async (seasonData) => {
  const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
  const newSeason = {
    id: generateId('SEASON'),
    ...seasonData,
    status: 'active',
    isSettled: false,
    createdAt: new Date().toISOString(),
  };
  seasons.unshift(newSeason);
  saveToStorage(STORAGE_KEYS.SEASONS, seasons);
  return { success: true, data: newSeason };
};

// ========== 라운드 관리 API ==========

// 시즌별 라운드 목록 조회
export const getRoundsBySeason = async (seasonId) => {
  const rounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
  const seasonRounds = rounds.filter(r => r.seasonId === seasonId);
  return { success: true, data: seasonRounds };
};

// ========== 결제 데이터 API ==========

// 라운드 참여 결제 저장
export const createRoundPayment = async (paymentData) => {
  const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
  const newPayment = {
    id: generateId('PAY'),
    ...paymentData,
    status: 'success',
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  payments.unshift(newPayment);
  saveToStorage(STORAGE_KEYS.ROUND_PAYMENTS, payments);
  return { success: true, data: newPayment };
};

// 시즌별 결제 목록 조회
export const getPaymentsBySeason = async (seasonId) => {
  const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
  const seasonPayments = payments.filter(p => p.seasonId === seasonId && p.status === 'success');
  return { success: true, data: seasonPayments };
};

// 사용자별 결제 목록 조회
export const getPaymentsByUser = async (userEmail) => {
  const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
  const userPayments = payments.filter(p => p.userEmail === userEmail);
  return { success: true, data: userPayments };
};

// ========== 시즌 정산 API (핵심) ==========

// 정산 미리보기 (실제 정산 전 시뮬레이션)
export const getSettlementPreview = async (seasonId, settlementType, winningRoundId = null, winningValue = 0) => {
  const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
  const seasonPayments = payments.filter(p => p.seasonId === seasonId && p.status === 'success');

  if (seasonPayments.length === 0) {
    return { success: false, error: '해당 시즌에 결제 데이터가 없습니다.' };
  }

  // 고객별 누적 참여비 계산
  const customerData = {};
  seasonPayments.forEach(payment => {
    const email = payment.userEmail;
    if (!customerData[email]) {
      customerData[email] = {
        userEmail: email,
        userName: payment.userName,
        totalPaid: 0,
        payments: [],
        participatedRounds: new Set(),
      };
    }
    customerData[email].totalPaid += payment.amount;
    customerData[email].payments.push(payment);
    customerData[email].participatedRounds.add(payment.roundId);
  });

  // 정산 결과 계산
  const results = [];
  let totalCreditAmount = 0;
  let winnerCount = 0;
  let nonWinnerCount = 0;
  let zeroAmountCount = 0;

  Object.values(customerData).forEach(customer => {
    let creditAmount = 0;
    let isWinnerRoundParticipant = false;

    if (settlementType === 'no_winner') {
      // 당첨 라운드 없음: 전액 적립
      creditAmount = customer.totalPaid;
      nonWinnerCount++;
    } else {
      // 당첨 라운드 있음
      isWinnerRoundParticipant = customer.participatedRounds.has(winningRoundId);

      if (isWinnerRoundParticipant) {
        // 당첨 라운드 참여자
        winnerCount++;
        if (customer.totalPaid > winningValue) {
          creditAmount = customer.totalPaid - winningValue;
        } else {
          creditAmount = 0;
          zeroAmountCount++;
        }
      } else {
        // 미참여자: 전액 적립
        nonWinnerCount++;
        creditAmount = customer.totalPaid;
      }
    }

    results.push({
      userEmail: customer.userEmail,
      userName: customer.userName,
      totalPaid: customer.totalPaid,
      isWinnerRoundParticipant,
      creditAmount,
      participatedRounds: Array.from(customer.participatedRounds),
    });

    totalCreditAmount += creditAmount;
  });

  return {
    success: true,
    data: {
      seasonId,
      settlementType,
      winningRoundId,
      winningValue,
      totalCustomers: results.length,
      winnerCount,
      nonWinnerCount,
      zeroAmountCount,
      totalPaidAmount: Object.values(customerData).reduce((sum, c) => sum + c.totalPaid, 0),
      totalCreditAmount,
      customerResults: results,
    },
  };
};

// 시즌 정산 확정 (실제 실행)
export const executeSettlement = async (seasonId, settlementType, winningRoundId = null, winningValue = 0, adminName = 'system') => {
  // 시즌 확인
  const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
  const seasonIndex = seasons.findIndex(s => s.id === seasonId);

  if (seasonIndex === -1) {
    return { success: false, error: '시즌을 찾을 수 없습니다.' };
  }

  if (seasons[seasonIndex].isSettled) {
    return { success: false, error: '이미 정산이 완료된 시즌입니다.' };
  }

  // 정산 미리보기로 데이터 계산
  const previewResult = await getSettlementPreview(seasonId, settlementType, winningRoundId, winningValue);
  if (!previewResult.success) {
    return previewResult;
  }

  const { customerResults } = previewResult.data;
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const ledgerEntries = [];
  const settlements = getFromStorage(STORAGE_KEYS.SEASON_SETTLEMENTS, []);

  // 각 고객별 교환금 적립 처리
  customerResults.forEach(customer => {
    if (customer.creditAmount <= 0) return; // 적립액이 0이면 스킵

    // 기존 잔액 확인
    if (!balances[customer.userEmail]) {
      balances[customer.userEmail] = {
        userId: customer.userEmail,
        totalBalance: 0,
        availableBalance: 0,
        holdBalance: 0,
        usedBalance: 0,
        ledger: [],
      };
    }

    const balance = balances[customer.userEmail];
    const balanceBefore = balance.totalBalance;
    const balanceAfter = balanceBefore + customer.creditAmount;

    // 원장 항목 생성
    const ledgerEntry = {
      id: generateId('LED'),
      type: 'credit',
      reason: 'SEASON_SETTLEMENT',
      userEmail: customer.userEmail,
      userName: customer.userName,
      seasonId,
      winningRoundId: winningRoundId || null,
      isWinnerRoundParticipant: customer.isWinnerRoundParticipant,
      totalPaidInSeason: customer.totalPaid,
      winningValue: settlementType === 'with_winner' ? winningValue : null,
      amount: customer.creditAmount,
      balanceBefore,
      balanceAfter,
      createdAt: new Date().toISOString(),
      createdBy: adminName,
    };

    // 잔액 업데이트
    balance.totalBalance = balanceAfter;
    balance.availableBalance += customer.creditAmount;
    balance.ledger = balance.ledger || [];
    balance.ledger.unshift(ledgerEntry);

    balances[customer.userEmail] = balance;
    ledgerEntries.push(ledgerEntry);
  });

  // 시즌 상태 업데이트
  seasons[seasonIndex].isSettled = true;
  seasons[seasonIndex].status = 'settled';
  seasons[seasonIndex].settlementInfo = {
    settlementType,
    winningRoundId,
    winningValue,
    settledAt: new Date().toISOString(),
    settledBy: adminName,
    totalCustomers: customerResults.length,
    totalCreditAmount: previewResult.data.totalCreditAmount,
  };

  // 정산 기록 저장
  const settlementRecord = {
    id: generateId('STL'),
    seasonId,
    settlementType,
    winningRoundId,
    winningValue,
    totalCustomers: previewResult.data.totalCustomers,
    winnerCount: previewResult.data.winnerCount,
    nonWinnerCount: previewResult.data.nonWinnerCount,
    zeroAmountCount: previewResult.data.zeroAmountCount,
    totalPaidAmount: previewResult.data.totalPaidAmount,
    totalCreditAmount: previewResult.data.totalCreditAmount,
    customerResults,
    ledgerEntries,
    createdAt: new Date().toISOString(),
    createdBy: adminName,
  };
  settlements.unshift(settlementRecord);

  // 저장
  saveToStorage(STORAGE_KEYS.SEASONS, seasons);
  saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);
  saveToStorage(STORAGE_KEYS.SEASON_SETTLEMENTS, settlements);

  return {
    success: true,
    data: {
      settlement: settlementRecord,
      summary: previewResult.data,
    },
  };
};

// 정산 내역 조회
export const getSettlements = async () => {
  const settlements = getFromStorage(STORAGE_KEYS.SEASON_SETTLEMENTS, []);
  return { success: true, data: settlements };
};

// 정산 상세 조회
export const getSettlementDetail = async (settlementId) => {
  const settlements = getFromStorage(STORAGE_KEYS.SEASON_SETTLEMENTS, []);
  const settlement = settlements.find(s => s.id === settlementId);
  if (!settlement) {
    return { success: false, error: '정산 내역을 찾을 수 없습니다.' };
  }
  return { success: true, data: settlement };
};

// ========== 고객용 교환금 내역 조회 ==========

// 사용자 교환금 원장 조회
export const getUserLedger = async (userEmail) => {
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const balance = balances[userEmail];

  if (!balance) {
    return {
      success: true,
      data: {
        totalBalance: 0,
        availableBalance: 0,
        ledger: [],
      },
    };
  }

  return { success: true, data: balance };
};

// ========== 샘플 데이터 초기화 ==========

export const initializeSampleSeasonData = () => {
  const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
  const rounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
  const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);

  if (seasons.length === 0) {
    // 샘플 시즌 생성
    const sampleSeasons = [
      {
        id: 'SEASON-1',
        name: 'Season 1',
        title: '루비의 시작',
        description: '첫 번째 시즌입니다.',
        status: 'active',
        isSettled: false,
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.SEASONS, sampleSeasons);

    // 샘플 라운드 생성
    const sampleRounds = [
      { id: 'R1', seasonId: 'SEASON-1', number: 'Round 1', title: '체험 라운드', price: 0, status: 'completed' },
      { id: 'R2', seasonId: 'SEASON-1', number: 'Round 2', title: '탐사 라운드', price: 500000, status: 'completed' },
      { id: 'R3', seasonId: 'SEASON-1', number: 'Round 3', title: '발굴 라운드', price: 1000000, status: 'active' },
      { id: 'R4', seasonId: 'SEASON-1', number: 'Round 4', title: 'Deep Cargo', price: 1800000, status: 'upcoming' },
      { id: 'R5', seasonId: 'SEASON-1', number: 'Round 5', title: 'Core Mining', price: 2500000, status: 'upcoming' },
      { id: 'R6', seasonId: 'SEASON-1', number: 'Round 6', title: 'Ruby Vein', price: 3500000, status: 'upcoming' },
      { id: 'R7', seasonId: 'SEASON-1', number: 'Round 7', title: 'Final Extraction', price: 5000000, status: 'upcoming' },
    ];
    saveToStorage(STORAGE_KEYS.ROUNDS, sampleRounds);

    // 샘플 결제 데이터 생성
    const samplePayments = [
      // 고객 A: R2 + R3 참여
      {
        id: 'PAY-001',
        userEmail: 'test@ruby.com',
        userName: '김루비',
        seasonId: 'SEASON-1',
        roundId: 'R2',
        roundTitle: '탐사 라운드',
        amount: 500000,
        status: 'success',
        paidAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'PAY-002',
        userEmail: 'test@ruby.com',
        userName: '김루비',
        seasonId: 'SEASON-1',
        roundId: 'R3',
        roundTitle: '발굴 라운드',
        amount: 1000000,
        status: 'success',
        paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // 고객 B: R2만 참여
      {
        id: 'PAY-003',
        userEmail: 'diamond@ruby.com',
        userName: '박다이아',
        seasonId: 'SEASON-1',
        roundId: 'R2',
        roundTitle: '탐사 라운드',
        amount: 500000,
        status: 'success',
        paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // 고객 C: R3만 참여 (600,000원 - 당첨가액보다 낮음)
      {
        id: 'PAY-004',
        userEmail: 'sapphire@ruby.com',
        userName: '이사파이어',
        seasonId: 'SEASON-1',
        roundId: 'R3',
        roundTitle: '발굴 라운드',
        amount: 1000000,
        status: 'success',
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.ROUND_PAYMENTS, samplePayments);
  }
};

// 초기화 실행
initializeSampleSeasonData();
