import { STORAGE_KEYS, EXCHANGE_STATUS, DEFAULT_CONSULTATION_MODAL_CONTENT } from '../constants/exchangeConstants';

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

// ========== 고객용 API ==========

// 교환 신청 생성
export const createApplication = async (applicationData) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);

  const newApplication = {
    id: generateId('EX'),
    ...applicationData,
    status: 'received',
    statusHistory: [
      {
        status: 'received',
        timestamp: new Date().toISOString(),
        actor: 'customer',
        note: '고객 상담 접수',
      },
    ],
    consultation: {
      finalSpecification: '',
      finalAmount: 0,
      csNote: '',
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
    delivery: {
      ...applicationData.delivery,
      trackingNumber: '',
      courier: '',
      shippedAt: null,
      deliveredAt: null,
      receivedConfirmed: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  applications.unshift(newApplication);
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: newApplication };
};

// 내 신청 목록 조회
export const getMyApplications = async (userEmail) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const myApplications = applications.filter(app => app.userEmail === userEmail);
  return { success: true, data: myApplications };
};

// 신청 상세 조회
export const getApplicationDetail = async (applicationId) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const application = applications.find(app => app.id === applicationId);

  if (!application) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  return { success: true, data: application };
};

// 신청 취소 (승인 전만 가능)
export const cancelApplication = async (applicationId, reason = '') => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];
  const statusInfo = Object.values(EXCHANGE_STATUS).find(s => s.key === application.status);

  if (!statusInfo?.canCancel) {
    return { success: false, error: '취소할 수 없는 상태입니다.' };
  }

  application.status = 'cancelled';
  application.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date().toISOString(),
    actor: 'customer',
    note: reason || '고객 요청 취소',
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 내 교환금 잔액 조회
export const getMyBalance = async (userEmail) => {
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const balance = balances[userEmail] || {
    userId: userEmail,
    totalBalance: 1500000, // 샘플 잔액
    availableBalance: 1500000,
    holdBalance: 0,
    usedBalance: 0,
    ledger: [
      {
        id: 'LED-INIT',
        type: 'credit',
        amount: 1500000,
        balance: 1500000,
        description: '시즌 보상 교환금 전환',
        relatedId: 'SEASON-1',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  return { success: true, data: balance };
};

// ========== 관리자용 API ==========

// 신청 목록 조회 (필터/페이지네이션)
export const getApplications = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  let applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);

  // 필터링
  if (filters.status) {
    applications = applications.filter(app => app.status === filters.status);
  }
  if (filters.category) {
    applications = applications.filter(app => app.category === filters.category);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    applications = applications.filter(app =>
      app.id.toLowerCase().includes(searchLower) ||
      app.userName.toLowerCase().includes(searchLower) ||
      app.userEmail.toLowerCase().includes(searchLower)
    );
  }
  if (filters.startDate) {
    applications = applications.filter(app =>
      new Date(app.createdAt) >= new Date(filters.startDate)
    );
  }
  if (filters.endDate) {
    applications = applications.filter(app =>
      new Date(app.createdAt) <= new Date(filters.endDate)
    );
  }

  // 정렬 (최신순)
  applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 페이지네이션
  const total = applications.length;
  const start = (pagination.page - 1) * pagination.limit;
  const paginatedData = applications.slice(start, start + pagination.limit);

  return {
    success: true,
    data: paginatedData,
    pagination: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

// 상태 변경
export const updateStatus = async (applicationId, newStatus, adminName, note = '') => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];
  application.status = newStatus;
  application.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: note || `상태 변경: ${newStatus}`,
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 상담 확정
export const confirmConsultation = async (applicationId, consultationData, adminName) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];
  application.consultation = {
    ...application.consultation,
    ...consultationData,
    consultedAt: new Date().toISOString(),
    consultedBy: adminName,
  };
  application.status = 'consultation_confirmed';
  application.statusHistory.push({
    status: 'consultation_confirmed',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: `상담 확정 - 최종 금액: ${consultationData.finalAmount?.toLocaleString()}원`,
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 대표 승인 (교환금 차감 트리거)
export const approveApplication = async (applicationId, adminName) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];

  if (application.status !== 'consultation_confirmed') {
    return { success: false, error: '상담 확정된 신청만 승인할 수 있습니다.' };
  }

  const deductAmount = application.consultation.finalAmount;

  if (!deductAmount || deductAmount <= 0) {
    return { success: false, error: '차감할 금액이 설정되지 않았습니다.' };
  }

  // 잔액 확인 및 차감
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const userBalance = balances[application.userEmail] || {
    totalBalance: 1500000,
    availableBalance: 1500000,
    holdBalance: 0,
    usedBalance: 0,
    ledger: [],
  };

  if (userBalance.availableBalance < deductAmount) {
    return { success: false, error: '교환금 잔액이 부족합니다.' };
  }

  // 원장 항목 생성
  const ledgerEntryId = generateId('LED');
  const ledgerEntry = {
    id: ledgerEntryId,
    type: 'debit',
    amount: deductAmount,
    balanceBefore: userBalance.totalBalance,
    balanceAfter: userBalance.totalBalance - deductAmount,
    description: `교환 신청 대표 승인 (${applicationId})`,
    relatedId: applicationId,
    createdAt: new Date().toISOString(),
  };

  // 잔액 업데이트
  userBalance.totalBalance -= deductAmount;
  userBalance.availableBalance -= deductAmount;
  userBalance.usedBalance += deductAmount;
  userBalance.ledger = userBalance.ledger || [];
  userBalance.ledger.unshift(ledgerEntry);

  balances[application.userEmail] = userBalance;
  saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);

  // 신청 상태 업데이트
  application.status = 'approved';
  application.approval = {
    approvedAt: new Date().toISOString(),
    approvedBy: adminName,
    deductedAmount: deductAmount,
    ledgerEntryId: ledgerEntryId,
  };
  application.statusHistory.push({
    status: 'approved',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: `대표 승인 완료 - 교환금 ${deductAmount.toLocaleString()}원 차감`,
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application, ledgerEntry };
};

// 배송 정보 업데이트
export const updateDelivery = async (applicationId, deliveryData, adminName) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];
  application.delivery = {
    ...application.delivery,
    ...deliveryData,
  };

  // 배송 상태에 따른 상태 변경
  if (deliveryData.trackingNumber && application.status === 'ready_to_ship') {
    application.status = 'shipping';
    application.statusHistory.push({
      status: 'shipping',
      timestamp: new Date().toISOString(),
      actor: adminName,
      note: `배송 시작 - 송장번호: ${deliveryData.trackingNumber}`,
    });
  }

  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 관리자 취소 처리
export const adminCancelApplication = async (applicationId, adminName, reason) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];
  const statusInfo = Object.values(EXCHANGE_STATUS).find(s => s.key === application.status);

  if (!statusInfo?.canCancel) {
    return { success: false, error: '취소할 수 없는 상태입니다. (대표 승인 이후 취소 불가)' };
  }

  application.status = 'cancelled';
  application.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: reason || '관리자 취소 처리',
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// ========== 관리자 인증 API ==========

// 관리자 로그인
export const adminLogin = async (email, password) => {
  // 샘플 관리자 계정
  const adminUsers = {
    'admin@rubyround.co.kr': {
      email: 'admin@rubyround.co.kr',
      password: 'admin1234',
      name: '임시윤',
      role: 'ceo',
    },
    'cs@rubyround.co.kr': {
      email: 'cs@rubyround.co.kr',
      password: 'cs1234',
      name: 'CS관리자',
      role: 'cs_manager',
    },
  };

  const user = adminUsers[email];

  if (!user || user.password !== password) {
    return { success: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' };
  }

  const authData = {
    email: user.email,
    name: user.name,
    role: user.role,
    loginAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.ADMIN_AUTH, authData);

  return { success: true, data: authData };
};

// 관리자 로그아웃
export const adminLogout = async () => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  return { success: true };
};

// 관리자 인증 확인
export const getAdminAuth = () => {
  return getFromStorage(STORAGE_KEYS.ADMIN_AUTH, null);
};

// 통계 조회 (대시보드용)
export const getStatistics = async () => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);

  const stats = {
    total: applications.length,
    byStatus: {},
    byCategory: {},
    totalAmount: 0,
    approvedAmount: 0,
  };

  applications.forEach(app => {
    // 상태별 집계
    stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;

    // 카테고리별 집계
    stats.byCategory[app.category] = (stats.byCategory[app.category] || 0) + 1;

    // 금액 집계
    stats.totalAmount += app.requestedAmount || 0;
    if (app.approval?.deductedAmount) {
      stats.approvedAmount += app.approval.deductedAmount;
    }
  });

  return { success: true, data: stats };
};

// ========== 상담 접수 모달 콘텐츠 관리 API ==========

// 모달 콘텐츠 조회
export const getConsultationModalContent = () => {
  const content = getFromStorage(STORAGE_KEYS.CONSULTATION_MODAL_CONTENT, null);
  return content || DEFAULT_CONSULTATION_MODAL_CONTENT;
};

// 모달 콘텐츠 저장
export const saveConsultationModalContent = async (content) => {
  try {
    const updatedContent = {
      ...content,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.CONSULTATION_MODAL_CONTENT, updatedContent);
    return { success: true, data: updatedContent };
  } catch (error) {
    return { success: false, error: '저장 중 오류가 발생했습니다.' };
  }
};

// 모달 콘텐츠 초기화 (기본값으로)
export const resetConsultationModalContent = async () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONSULTATION_MODAL_CONTENT);
    return { success: true, data: DEFAULT_CONSULTATION_MODAL_CONTENT };
  } catch (error) {
    return { success: false, error: '초기화 중 오류가 발생했습니다.' };
  }
};

// ========== 사용자 관리 API ==========

// 사용자 목록 조회
export const getUsers = async (filters = {}) => {
  let users = getFromStorage(STORAGE_KEYS.USERS, []);

  // 필터링
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    users = users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchLower))
    );
  }
  if (filters.status) {
    users = users.filter(user => user.status === filters.status);
  }

  // 정렬 (최신순)
  users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, data: users };
};

// 사용자 상세 조회
export const getUserDetail = async (userId) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.id === userId || u.email === userId);

  if (!user) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  // 사용자의 교환금 잔액 조회
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const balance = balances[user.email] || {
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
    usedBalance: 0,
  };

  return { success: true, data: { ...user, balance } };
};

// 사용자 등록 (회원가입)
export const registerUser = async (userData) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);

  // 이메일 중복 체크
  if (users.some(u => u.email === userData.email)) {
    return { success: false, error: '이미 가입된 이메일입니다.' };
  }

  const newUser = {
    id: generateId('USR'),
    ...userData,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.unshift(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // 기본 교환금 잔액 설정
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  balances[newUser.email] = {
    userId: newUser.email,
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
    usedBalance: 0,
    ledger: [],
  };
  saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);

  return { success: true, data: newUser };
};

// 사용자 정보 수정
export const updateUser = async (userId, updateData) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const index = users.findIndex(u => u.id === userId || u.email === userId);

  if (index === -1) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  users[index] = {
    ...users[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.USERS, users);
  return { success: true, data: users[index] };
};

// 사용자 상태 변경 (활성/비활성)
export const updateUserStatus = async (userId, status) => {
  return updateUser(userId, { status });
};

// 사용자 교환금 충전
export const chargeUserBalance = async (userEmail, amount, description = '') => {
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});

  if (!balances[userEmail]) {
    balances[userEmail] = {
      userId: userEmail,
      totalBalance: 0,
      availableBalance: 0,
      holdBalance: 0,
      usedBalance: 0,
      ledger: [],
    };
  }

  const balance = balances[userEmail];
  const ledgerEntry = {
    id: generateId('LED'),
    type: 'credit',
    amount: amount,
    balanceBefore: balance.totalBalance,
    balanceAfter: balance.totalBalance + amount,
    description: description || '관리자 충전',
    createdAt: new Date().toISOString(),
  };

  balance.totalBalance += amount;
  balance.availableBalance += amount;
  balance.ledger = balance.ledger || [];
  balance.ledger.unshift(ledgerEntry);

  balances[userEmail] = balance;
  saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);

  return { success: true, data: balance, ledgerEntry };
};

// 사용자 교환금 차감
export const deductUserBalance = async (userEmail, amount, description = '') => {
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const balance = balances[userEmail];

  if (!balance || balance.availableBalance < amount) {
    return { success: false, error: '잔액이 부족합니다.' };
  }

  const ledgerEntry = {
    id: generateId('LED'),
    type: 'debit',
    amount: amount,
    balanceBefore: balance.totalBalance,
    balanceAfter: balance.totalBalance - amount,
    description: description || '관리자 차감',
    createdAt: new Date().toISOString(),
  };

  balance.totalBalance -= amount;
  balance.availableBalance -= amount;
  balance.ledger = balance.ledger || [];
  balance.ledger.unshift(ledgerEntry);

  balances[userEmail] = balance;
  saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);

  return { success: true, data: balance, ledgerEntry };
};

// 사용자 통계
export const getUserStatistics = async () => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});

  let totalBalance = 0;
  Object.values(balances).forEach(b => {
    totalBalance += b.totalBalance || 0;
  });

  return {
    success: true,
    data: {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length,
      totalBalance,
    },
  };
};

// 샘플 사용자 초기화
export const initializeSampleUsers = () => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);

  if (users.length === 0) {
    const sampleUsers = [
      {
        id: 'USR-20260101-TEST',
        name: '김루비',
        email: 'test@ruby.com',
        password: '1234',
        phone: '010-1234-5678',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'USR-20260105-DEMO',
        name: '박다이아',
        email: 'diamond@ruby.com',
        password: '1234',
        phone: '010-5678-1234',
        status: 'active',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'USR-20260110-SAMP',
        name: '이사파이어',
        email: 'sapphire@ruby.com',
        password: '1234',
        phone: '010-9999-8888',
        status: 'active',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    saveToStorage(STORAGE_KEYS.USERS, sampleUsers);

    // 샘플 사용자 잔액 설정
    const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
    balances['test@ruby.com'] = {
      userId: 'test@ruby.com',
      totalBalance: 1500000,
      availableBalance: 1500000,
      holdBalance: 0,
      usedBalance: 0,
      ledger: [
        {
          id: 'LED-INIT-1',
          type: 'credit',
          amount: 1500000,
          balanceBefore: 0,
          balanceAfter: 1500000,
          description: '시즌 보상 교환금 전환',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
    balances['diamond@ruby.com'] = {
      userId: 'diamond@ruby.com',
      totalBalance: 800000,
      availableBalance: 800000,
      holdBalance: 0,
      usedBalance: 0,
      ledger: [],
    };
    balances['sapphire@ruby.com'] = {
      userId: 'sapphire@ruby.com',
      totalBalance: 350000,
      availableBalance: 350000,
      holdBalance: 0,
      usedBalance: 0,
      ledger: [],
    };
    saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);
  }
};
