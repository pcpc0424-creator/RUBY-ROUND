import { STORAGE_KEYS } from '../constants/exchangeConstants';

// 샘플 교환 신청 데이터
const sampleApplications = [
  {
    id: 'EX-20260115-A1B2',
    userId: 'test@ruby.com',
    userName: '김루비',
    userEmail: 'test@ruby.com',
    requestedAmount: 500000,
    category: 'ring',
    specifications: {
      ringSize: '12호',
    },
    styleRequest: '심플하고 우아한 디자인, 데일리로 착용 가능한 스타일 선호합니다.',
    delivery: {
      recipientName: '김루비',
      recipientPhone: '010-1234-5678',
      postalCode: '06123',
      address: '서울특별시 강남구 테헤란로 123',
      addressDetail: '루비타워 501호',
      trackingNumber: 'CJ1234567890',
      courier: 'CJ대한통운',
      shippedAt: '2026-01-14T10:00:00Z',
      deliveredAt: '2026-01-15T14:00:00Z',
      receivedConfirmed: true,
    },
    agreements: {
      consultationProcess: true,
      budgetBasedProposal: true,
      cancelRestriction: true,
      exceptionHandling: true,
      privacyConsent: true,
    },
    status: 'completed',
    statusHistory: [
      { status: 'received', timestamp: '2026-01-10T10:00:00Z', actor: 'customer', note: '고객 상담 접수' },
      { status: 'cs_consulting', timestamp: '2026-01-10T11:00:00Z', actor: 'CS관리자', note: 'CS 상담 시작' },
      { status: 'consultation_confirmed', timestamp: '2026-01-11T14:00:00Z', actor: 'CS관리자', note: '상담 확정 - 최종 금액: 480,000원' },
      { status: 'approved', timestamp: '2026-01-11T16:00:00Z', actor: '임시윤', note: '대표 승인 완료 - 교환금 480,000원 차감' },
      { status: 'in_production', timestamp: '2026-01-12T09:00:00Z', actor: 'CS관리자', note: '제작 착수' },
      { status: 'ready_to_ship', timestamp: '2026-01-14T09:00:00Z', actor: 'CS관리자', note: '출고 준비 완료' },
      { status: 'shipping', timestamp: '2026-01-14T10:00:00Z', actor: 'CS관리자', note: '배송 시작 - 송장번호: CJ1234567890' },
      { status: 'delivered', timestamp: '2026-01-15T14:00:00Z', actor: 'system', note: '배송 완료' },
      { status: 'completed', timestamp: '2026-01-15T15:00:00Z', actor: 'CS관리자', note: '수령 확인 완료' },
    ],
    consultation: {
      finalSpecification: '18K 로즈골드 반지, 0.3ct 루비 세팅, 12호',
      finalAmount: 480000,
      csNote: '고객 요청에 따라 체인 대신 로즈골드 소재로 변경',
      customerConfirmed: true,
      consultedAt: '2026-01-11T14:00:00Z',
      consultedBy: 'CS관리자',
    },
    approval: {
      approvedAt: '2026-01-11T16:00:00Z',
      approvedBy: '임시윤',
      deductedAmount: 480000,
      ledgerEntryId: 'LED-20260111-X1Y2',
    },
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-15T15:00:00Z',
  },
  {
    id: 'EX-20260114-C3D4',
    userId: 'test@ruby.com',
    userName: '김루비',
    userEmail: 'test@ruby.com',
    requestedAmount: 800000,
    category: 'necklace',
    specifications: {
      chainLength: '45cm',
    },
    styleRequest: '루비 펜던트가 포인트인 목걸이, 골드 체인으로 요청드립니다.',
    delivery: {
      recipientName: '김루비',
      recipientPhone: '010-1234-5678',
      postalCode: '06123',
      address: '서울특별시 강남구 테헤란로 123',
      addressDetail: '루비타워 501호',
      trackingNumber: '',
      courier: '',
      shippedAt: null,
      deliveredAt: null,
      receivedConfirmed: false,
    },
    agreements: {
      consultationProcess: true,
      budgetBasedProposal: true,
      cancelRestriction: true,
      exceptionHandling: true,
      privacyConsent: true,
    },
    status: 'in_production',
    statusHistory: [
      { status: 'received', timestamp: '2026-01-14T09:00:00Z', actor: 'customer', note: '고객 상담 접수' },
      { status: 'cs_consulting', timestamp: '2026-01-14T10:00:00Z', actor: 'CS관리자', note: 'CS 상담 시작' },
      { status: 'consultation_confirmed', timestamp: '2026-01-14T15:00:00Z', actor: 'CS관리자', note: '상담 확정 - 최종 금액: 750,000원' },
      { status: 'approved', timestamp: '2026-01-14T17:00:00Z', actor: '임시윤', note: '대표 승인 완료 - 교환금 750,000원 차감' },
      { status: 'in_production', timestamp: '2026-01-15T09:00:00Z', actor: 'CS관리자', note: '제작 착수' },
    ],
    consultation: {
      finalSpecification: '14K 옐로우골드 목걸이, 0.5ct 루비 펜던트, 45cm 체인',
      finalAmount: 750000,
      csNote: '루비 원석 선별 완료, 제작 진행 예정',
      customerConfirmed: true,
      consultedAt: '2026-01-14T15:00:00Z',
      consultedBy: 'CS관리자',
    },
    approval: {
      approvedAt: '2026-01-14T17:00:00Z',
      approvedBy: '임시윤',
      deductedAmount: 750000,
      ledgerEntryId: 'LED-20260114-E5F6',
    },
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'EX-20260116-G7H8',
    userId: 'test@ruby.com',
    userName: '김루비',
    userEmail: 'test@ruby.com',
    requestedAmount: 350000,
    category: 'earring',
    specifications: {
      earringStyle: '스터드',
      earringSet: '한 쌍',
    },
    styleRequest: '작은 루비 스터드 귀걸이, 데일리로 착용할 수 있는 심플한 디자인',
    delivery: {
      recipientName: '김루비',
      recipientPhone: '010-1234-5678',
      postalCode: '06123',
      address: '서울특별시 강남구 테헤란로 123',
      addressDetail: '루비타워 501호',
      trackingNumber: '',
      courier: '',
      shippedAt: null,
      deliveredAt: null,
      receivedConfirmed: false,
    },
    agreements: {
      consultationProcess: true,
      budgetBasedProposal: true,
      cancelRestriction: true,
      exceptionHandling: true,
      privacyConsent: true,
    },
    status: 'cs_consulting',
    statusHistory: [
      { status: 'received', timestamp: '2026-01-16T08:00:00Z', actor: 'customer', note: '고객 상담 접수' },
      { status: 'cs_consulting', timestamp: '2026-01-16T09:30:00Z', actor: 'CS관리자', note: 'CS 상담 시작' },
    ],
    consultation: {
      finalSpecification: '',
      finalAmount: 0,
      csNote: '디자인 협의 중',
      customerConfirmed: false,
      consultedAt: null,
      consultedBy: '',
    },
    approval: {
      approvedAt: null,
      approvedBy: '',
      deductedAmount: 0,
      ledgerEntryId: '',
    },
    createdAt: '2026-01-16T08:00:00Z',
    updatedAt: '2026-01-16T09:30:00Z',
  },
];

// 샘플 사용자 교환금 잔액
const sampleUserBalance = {
  'test@ruby.com': {
    userId: 'test@ruby.com',
    totalBalance: 270000,
    availableBalance: 270000,
    holdBalance: 0,
    usedBalance: 1230000,
    ledger: [
      {
        id: 'LED-INIT',
        type: 'credit',
        amount: 1500000,
        balanceBefore: 0,
        balanceAfter: 1500000,
        description: 'Season 1 보상 교환금 전환',
        relatedId: 'SEASON-1',
        createdAt: '2026-01-05T00:00:00Z',
      },
      {
        id: 'LED-20260111-X1Y2',
        type: 'debit',
        amount: 480000,
        balanceBefore: 1500000,
        balanceAfter: 1020000,
        description: '교환 신청 대표 승인 (EX-20260115-A1B2)',
        relatedId: 'EX-20260115-A1B2',
        createdAt: '2026-01-11T16:00:00Z',
      },
      {
        id: 'LED-20260114-E5F6',
        type: 'debit',
        amount: 750000,
        balanceBefore: 1020000,
        balanceAfter: 270000,
        description: '교환 신청 대표 승인 (EX-20260114-C3D4)',
        relatedId: 'EX-20260114-C3D4',
        createdAt: '2026-01-14T17:00:00Z',
      },
    ],
  },
};

// 샘플 데이터 초기화
export const initializeSampleData = () => {
  // 기존 데이터가 없을 때만 초기화
  const existingApps = localStorage.getItem(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const existingBalance = localStorage.getItem(STORAGE_KEYS.USER_EXCHANGE_BALANCE);

  if (!existingApps) {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_APPLICATIONS, JSON.stringify(sampleApplications));
  }

  if (!existingBalance) {
    localStorage.setItem(STORAGE_KEYS.USER_EXCHANGE_BALANCE, JSON.stringify(sampleUserBalance));
  }
};

// 데이터 초기화 (테스트용)
export const resetSampleData = () => {
  localStorage.setItem(STORAGE_KEYS.EXCHANGE_APPLICATIONS, JSON.stringify(sampleApplications));
  localStorage.setItem(STORAGE_KEYS.USER_EXCHANGE_BALANCE, JSON.stringify(sampleUserBalance));
};

// 모든 교환 관련 데이터 삭제
export const clearAllExchangeData = () => {
  localStorage.removeItem(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  localStorage.removeItem(STORAGE_KEYS.USER_EXCHANGE_BALANCE);
  localStorage.removeItem(STORAGE_KEYS.EXCHANGE_LEDGER);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
};

// 금액 포맷팅
export const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

// 날짜 포맷팅
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(date);
};

// 날짜만 포맷팅
export const formatDateOnly = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// 시간 경과 표시
export const getRelativeTime = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDateOnly(dateString);
};
