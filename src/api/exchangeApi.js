import { STORAGE_KEYS, EXCHANGE_STATUS, DEFAULT_CONSULTATION_MODAL_CONTENT, DELIVERY_STATUS, ADULT_VERIFICATION_STATUS } from '../constants/exchangeConstants';

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
    'admin@rubyround.net': {
      email: 'admin@rubyround.net',
      password: 'admin1234',
      name: '임시윤',
      role: 'ceo',
    },
    'cs@rubyround.net': {
      email: 'cs@rubyround.net',
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

// 사용자 로그인
export const loginUser = async (email, password) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' };
  }

  if (user.status !== 'active') {
    return { success: false, error: '비활성화된 계정입니다. 관리자에게 문의하세요.' };
  }

  return { success: true, data: user };
};

// 비밀번호 변경
export const changePassword = async (email, currentPassword, newPassword) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  if (users[userIndex].password !== currentPassword) {
    return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
  }

  users[userIndex].password = newPassword;
  users[userIndex].updatedAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.USERS, users);

  return { success: true };
};

// 사용자 삭제 (회원탈퇴)
export const deleteUser = async (email) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  // 사용자 삭제
  users.splice(userIndex, 1);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // 교환금 잔액 삭제
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  delete balances[email];
  saveToStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, balances);

  // 성인인증 기록 삭제
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);
  const filteredVerifications = verifications.filter(v => v.userEmail !== email);
  saveToStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, filteredVerifications);

  return { success: true };
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
        adultVerified: true,
        adultVerifiedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
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
        adultVerified: false,
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
        adultVerified: false,
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

// ========== 배송 관리 API ==========

// 배송 대기 목록 조회 (승인된 교환 신청 중 배송 필요한 건)
export const getDeliveryList = async (filters = {}) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);

  // 승인 완료 이후 상태인 신청 건만 필터링
  const deliveryStatuses = ['approved', 'in_production', 'ready_to_ship', 'shipping', 'delivered', 'completed'];
  let deliveries = applications.filter(app => deliveryStatuses.includes(app.status));

  // 필터링
  if (filters.status) {
    deliveries = deliveries.filter(app => app.status === filters.status);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    deliveries = deliveries.filter(app =>
      app.id.toLowerCase().includes(searchLower) ||
      app.userName.toLowerCase().includes(searchLower) ||
      app.delivery?.recipientName?.toLowerCase().includes(searchLower) ||
      app.delivery?.trackingNumber?.includes(searchLower)
    );
  }
  if (filters.courier) {
    deliveries = deliveries.filter(app => app.delivery?.courier === filters.courier);
  }

  // 정렬 (최신순)
  deliveries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return { success: true, data: deliveries };
};

// 배송 정보 상세 조회
export const getDeliveryDetail = async (applicationId) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const application = applications.find(app => app.id === applicationId);

  if (!application) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  return { success: true, data: application };
};

// 배송 정보 일괄 업데이트 (송장 등록)
export const registerTrackingNumber = async (applicationId, trackingData, adminName) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];

  // 출고 준비 상태 이상만 송장 등록 가능
  const allowedStatuses = ['ready_to_ship', 'in_production'];
  if (!allowedStatuses.includes(application.status)) {
    return { success: false, error: '현재 상태에서는 송장을 등록할 수 없습니다.' };
  }

  application.delivery = {
    ...application.delivery,
    trackingNumber: trackingData.trackingNumber,
    courier: trackingData.courier,
    shippedAt: new Date().toISOString(),
  };

  application.status = 'shipping';
  application.statusHistory.push({
    status: 'shipping',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: `배송 시작 - ${trackingData.courier} / ${trackingData.trackingNumber}`,
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 배송 완료 처리
export const markAsDelivered = async (applicationId, adminName) => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);

  if (index === -1) {
    return { success: false, error: '신청 정보를 찾을 수 없습니다.' };
  }

  const application = applications[index];

  if (application.status !== 'shipping') {
    return { success: false, error: '배송중 상태에서만 배송완료 처리가 가능합니다.' };
  }

  application.delivery = {
    ...application.delivery,
    deliveredAt: new Date().toISOString(),
  };

  application.status = 'delivered';
  application.statusHistory.push({
    status: 'delivered',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: '배송 완료',
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 배송 상태 변경
export const updateDeliveryStatus = async (applicationId, newStatus, adminName, note = '') => {
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
    note: note || `배송 상태 변경: ${newStatus}`,
  });
  application.updatedAt = new Date().toISOString();

  applications[index] = application;
  saveToStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, applications);

  return { success: true, data: application };
};

// 배송 통계
export const getDeliveryStatistics = async () => {
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS);
  const deliveryStatuses = ['approved', 'in_production', 'ready_to_ship', 'shipping', 'delivered', 'completed'];
  const deliveries = applications.filter(app => deliveryStatuses.includes(app.status));

  const stats = {
    total: deliveries.length,
    byStatus: {},
    pendingShipment: 0,  // 출고 대기
    shipping: 0,          // 배송 중
    delivered: 0,         // 배송 완료
    completed: 0,         // 완료
  };

  deliveries.forEach(app => {
    stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;

    if (['approved', 'in_production', 'ready_to_ship'].includes(app.status)) {
      stats.pendingShipment++;
    } else if (app.status === 'shipping') {
      stats.shipping++;
    } else if (app.status === 'delivered') {
      stats.delivered++;
    } else if (app.status === 'completed') {
      stats.completed++;
    }
  });

  return { success: true, data: stats };
};

// ========== 성인 인증 API ==========

// 성인 인증 요청 목록 조회
export const getAdultVerificationRequests = async (filters = {}) => {
  let verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);

  // 필터링
  if (filters.status) {
    verifications = verifications.filter(v => v.status === filters.status);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    verifications = verifications.filter(v =>
      v.userName.toLowerCase().includes(searchLower) ||
      v.userEmail.toLowerCase().includes(searchLower)
    );
  }

  // 정렬 (최신순)
  verifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, data: verifications };
};

// 성인 인증 요청 생성 (사용자가 인증 요청)
export const createAdultVerificationRequest = async (userData) => {
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);

  // 이미 대기 중인 요청이 있는지 확인
  const existing = verifications.find(v =>
    v.userEmail === userData.userEmail && v.status === 'pending'
  );
  if (existing) {
    return { success: false, error: '이미 대기 중인 인증 요청이 있습니다.' };
  }

  const newRequest = {
    id: generateId('AV'),
    ...userData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  verifications.unshift(newRequest);
  saveToStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, verifications);

  return { success: true, data: newRequest };
};

// 성인 인증 승인 (대표만 가능)
export const approveAdultVerification = async (verificationId, adminName) => {
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);
  const index = verifications.findIndex(v => v.id === verificationId);

  if (index === -1) {
    return { success: false, error: '인증 요청을 찾을 수 없습니다.' };
  }

  const verification = verifications[index];

  if (verification.status !== 'pending') {
    return { success: false, error: '대기 중인 요청만 승인할 수 있습니다.' };
  }

  verification.status = 'approved';
  verification.approvedAt = new Date().toISOString();
  verification.approvedBy = adminName;
  verification.updatedAt = new Date().toISOString();

  verifications[index] = verification;
  saveToStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, verifications);

  // 사용자 정보 업데이트
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.email === verification.userEmail);
  if (userIndex !== -1) {
    users[userIndex].adultVerified = true;
    users[userIndex].adultVerifiedAt = verification.approvedAt;
    users[userIndex].updatedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.USERS, users);
  }

  return { success: true, data: verification };
};

// 성인 인증 거부
export const rejectAdultVerification = async (verificationId, adminName, reason = '') => {
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);
  const index = verifications.findIndex(v => v.id === verificationId);

  if (index === -1) {
    return { success: false, error: '인증 요청을 찾을 수 없습니다.' };
  }

  const verification = verifications[index];

  if (verification.status !== 'pending') {
    return { success: false, error: '대기 중인 요청만 거부할 수 있습니다.' };
  }

  verification.status = 'rejected';
  verification.rejectedAt = new Date().toISOString();
  verification.rejectedBy = adminName;
  verification.rejectionReason = reason;
  verification.updatedAt = new Date().toISOString();

  verifications[index] = verification;
  saveToStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, verifications);

  return { success: true, data: verification };
};

// 성인 인증 요청 삭제
export const deleteAdultVerification = async (verificationId) => {
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);
  const index = verifications.findIndex(v => v.id === verificationId);

  if (index === -1) {
    return { success: false, error: '인증 요청을 찾을 수 없습니다.' };
  }

  verifications.splice(index, 1);
  saveToStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, verifications);

  return { success: true };
};

// 관리자 수동 성인 인증 (대표만 가능)
export const manualAdultVerification = async (userEmail, adminName) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  users[userIndex].adultVerified = true;
  users[userIndex].adultVerifiedAt = new Date().toISOString();
  users[userIndex].adultVerifiedBy = adminName;
  users[userIndex].adultVerificationMethod = 'manual';
  users[userIndex].updatedAt = new Date().toISOString();

  saveToStorage(STORAGE_KEYS.USERS, users);

  // 인증 기록 추가
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);
  const record = {
    id: generateId('AV'),
    userEmail,
    userName: users[userIndex].name,
    method: 'manual',
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy: adminName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  verifications.unshift(record);
  saveToStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, verifications);

  return { success: true, data: users[userIndex] };
};

// 성인 인증 취소 (대표만 가능)
export const revokeAdultVerification = async (userEmail, adminName, reason = '') => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.email === userEmail);

  if (userIndex === -1) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  users[userIndex].adultVerified = false;
  users[userIndex].adultVerificationRevokedAt = new Date().toISOString();
  users[userIndex].adultVerificationRevokedBy = adminName;
  users[userIndex].adultVerificationRevokeReason = reason;
  users[userIndex].updatedAt = new Date().toISOString();

  saveToStorage(STORAGE_KEYS.USERS, users);

  return { success: true, data: users[userIndex] };
};

// 성인 인증 통계
export const getAdultVerificationStatistics = async () => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);

  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter(u => u.adultVerified).length,
    unverifiedUsers: users.filter(u => !u.adultVerified).length,
    pendingRequests: verifications.filter(v => v.status === 'pending').length,
    approvedRequests: verifications.filter(v => v.status === 'approved').length,
    rejectedRequests: verifications.filter(v => v.status === 'rejected').length,
  };

  return { success: true, data: stats };
};

// 사용자의 성인 인증 상태 확인
export const checkAdultVerification = async (userEmail) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email === userEmail);

  if (!user) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  return {
    success: true,
    data: {
      isVerified: user.adultVerified || false,
      verifiedAt: user.adultVerifiedAt || null,
      method: user.adultVerificationMethod || null,
    },
  };
};

// ========== 교환금 원장 API ==========

// 전체 원장 조회
export const getAllLedgerEntries = async (filters = {}) => {
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  let allEntries = [];

  Object.entries(balances).forEach(([userEmail, balance]) => {
    if (balance.ledger) {
      balance.ledger.forEach(entry => {
        allEntries.push({
          ...entry,
          userEmail,
        });
      });
    }
  });

  // 필터링
  if (filters.type) {
    allEntries = allEntries.filter(e => e.type === filters.type);
  }
  if (filters.userEmail) {
    allEntries = allEntries.filter(e => e.userEmail.includes(filters.userEmail));
  }
  if (filters.startDate) {
    allEntries = allEntries.filter(e => new Date(e.createdAt) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    allEntries = allEntries.filter(e => new Date(e.createdAt) <= new Date(filters.endDate));
  }

  // 정렬 (최신순)
  allEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 통계
  const stats = {
    totalCredit: allEntries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0),
    totalDebit: allEntries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0),
    totalEntries: allEntries.length,
  };

  return { success: true, data: allEntries, stats };
};

// ========== 라운드 결과 API ==========

// 라운드 결과 목록 조회
export const getRoundResults = async (filters = {}) => {
  let results = getFromStorage(STORAGE_KEYS.ROUND_RESULTS, []);

  if (filters.roundId) {
    results = results.filter(r => r.roundId === filters.roundId);
  }
  if (filters.status) {
    results = results.filter(r => r.status === filters.status);
  }

  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, data: results };
};

// 라운드 결과 확정
export const confirmRoundResult = async (roundId, resultData, adminName) => {
  const results = getFromStorage(STORAGE_KEYS.ROUND_RESULTS, []);

  const newResult = {
    id: generateId('RR'),
    roundId,
    ...resultData,
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
    confirmedBy: adminName,
    createdAt: new Date().toISOString(),
  };

  results.unshift(newResult);
  saveToStorage(STORAGE_KEYS.ROUND_RESULTS, results);

  // 감사 로그 기록
  await createAuditLog({
    action: 'approve',
    targetType: 'round',
    targetId: roundId,
    adminName,
    description: `라운드 결과 확정`,
    details: resultData,
  });

  return { success: true, data: newResult };
};

// 라운드 결과 잠금 (수정 불가)
export const lockRoundResult = async (resultId, adminName) => {
  const results = getFromStorage(STORAGE_KEYS.ROUND_RESULTS, []);
  const index = results.findIndex(r => r.id === resultId);

  if (index === -1) {
    return { success: false, error: '결과를 찾을 수 없습니다.' };
  }

  results[index].status = 'locked';
  results[index].lockedAt = new Date().toISOString();
  results[index].lockedBy = adminName;

  saveToStorage(STORAGE_KEYS.ROUND_RESULTS, results);

  await createAuditLog({
    action: 'status_change',
    targetType: 'round',
    targetId: resultId,
    adminName,
    description: '라운드 결과 잠금',
  });

  return { success: true, data: results[index] };
};

// ========== 보상/당첨 지급 API ==========

// 보상 목록 조회
export const getRewards = async (filters = {}) => {
  let rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);

  if (filters.status) {
    rewards = rewards.filter(r => r.status === filters.status);
  }
  if (filters.userEmail) {
    rewards = rewards.filter(r => r.userEmail.includes(filters.userEmail));
  }
  if (filters.type) {
    rewards = rewards.filter(r => r.type === filters.type);
  }

  rewards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, data: rewards };
};

// 보상 생성
export const createReward = async (rewardData, adminName) => {
  const rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);

  const newReward = {
    id: generateId('RWD'),
    ...rewardData,
    status: 'pending',
    statusHistory: [
      { status: 'pending', timestamp: new Date().toISOString(), actor: adminName, note: '보상 생성' }
    ],
    createdAt: new Date().toISOString(),
    createdBy: adminName,
  };

  rewards.unshift(newReward);
  saveToStorage(STORAGE_KEYS.REWARDS, rewards);

  await createAuditLog({
    action: 'create',
    targetType: 'reward',
    targetId: newReward.id,
    adminName,
    description: `보상 생성: ${rewardData.userName}`,
  });

  return { success: true, data: newReward };
};

// 보상 상태 변경
export const updateRewardStatus = async (rewardId, newStatus, adminName, note = '') => {
  const rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);
  const index = rewards.findIndex(r => r.id === rewardId);

  if (index === -1) {
    return { success: false, error: '보상을 찾을 수 없습니다.' };
  }

  rewards[index].status = newStatus;
  rewards[index].statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    actor: adminName,
    note,
  });
  rewards[index].updatedAt = new Date().toISOString();

  saveToStorage(STORAGE_KEYS.REWARDS, rewards);

  await createAuditLog({
    action: 'status_change',
    targetType: 'reward',
    targetId: rewardId,
    adminName,
    description: `보상 상태 변경: ${newStatus}`,
  });

  return { success: true, data: rewards[index] };
};

// 보상 구성 확정
export const confirmRewardConfiguration = async (rewardId, configuration, adminName) => {
  const rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);
  const index = rewards.findIndex(r => r.id === rewardId);

  if (index === -1) {
    return { success: false, error: '보상을 찾을 수 없습니다.' };
  }

  rewards[index].configuration = configuration;
  rewards[index].status = 'confirmed';
  rewards[index].statusHistory.push({
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: '구성 확정',
  });
  rewards[index].confirmedAt = new Date().toISOString();
  rewards[index].confirmedBy = adminName;

  saveToStorage(STORAGE_KEYS.REWARDS, rewards);

  return { success: true, data: rewards[index] };
};

// 보상 예외 처리
export const handleRewardException = async (rewardId, exceptionData, adminName) => {
  const rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);
  const index = rewards.findIndex(r => r.id === rewardId);

  if (index === -1) {
    return { success: false, error: '보상을 찾을 수 없습니다.' };
  }

  rewards[index].status = 'exception';
  rewards[index].exception = {
    ...exceptionData,
    handledAt: new Date().toISOString(),
    handledBy: adminName,
  };
  rewards[index].statusHistory.push({
    status: 'exception',
    timestamp: new Date().toISOString(),
    actor: adminName,
    note: exceptionData.reason,
  });

  saveToStorage(STORAGE_KEYS.REWARDS, rewards);

  return { success: true, data: rewards[index] };
};

// 보상 통계
export const getRewardStatistics = async () => {
  const rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);

  const stats = {
    total: rewards.length,
    pending: rewards.filter(r => r.status === 'pending').length,
    confirmed: rewards.filter(r => r.status === 'confirmed').length,
    processing: rewards.filter(r => r.status === 'processing').length,
    completed: rewards.filter(r => r.status === 'completed').length,
    exception: rewards.filter(r => r.status === 'exception').length,
  };

  return { success: true, data: stats };
};

// ========== 쿠폰/프로모션 API ==========

// 쿠폰 목록 조회
export const getCoupons = async (filters = {}) => {
  let coupons = getFromStorage(STORAGE_KEYS.COUPONS, []);

  if (filters.status) {
    coupons = coupons.filter(c => c.status === filters.status);
  }
  if (filters.type) {
    coupons = coupons.filter(c => c.type === filters.type);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    coupons = coupons.filter(c =>
      c.code.toLowerCase().includes(searchLower) ||
      c.name.toLowerCase().includes(searchLower)
    );
  }

  coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, data: coupons };
};

// 쿠폰 생성
export const createCoupon = async (couponData, adminName) => {
  const coupons = getFromStorage(STORAGE_KEYS.COUPONS, []);

  // 코드 중복 확인
  if (coupons.some(c => c.code === couponData.code)) {
    return { success: false, error: '이미 존재하는 쿠폰 코드입니다.' };
  }

  const newCoupon = {
    id: generateId('CPN'),
    ...couponData,
    status: 'active',
    usedCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: adminName,
  };

  coupons.unshift(newCoupon);
  saveToStorage(STORAGE_KEYS.COUPONS, coupons);

  await createAuditLog({
    action: 'create',
    targetType: 'coupon',
    targetId: newCoupon.id,
    adminName,
    description: `쿠폰 생성: ${couponData.name}`,
  });

  return { success: true, data: newCoupon };
};

// 쿠폰 수정
export const updateCoupon = async (couponId, updateData, adminName) => {
  const coupons = getFromStorage(STORAGE_KEYS.COUPONS, []);
  const index = coupons.findIndex(c => c.id === couponId);

  if (index === -1) {
    return { success: false, error: '쿠폰을 찾을 수 없습니다.' };
  }

  coupons[index] = {
    ...coupons[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
    updatedBy: adminName,
  };

  saveToStorage(STORAGE_KEYS.COUPONS, coupons);

  return { success: true, data: coupons[index] };
};

// 쿠폰 상태 변경
export const updateCouponStatus = async (couponId, status, adminName) => {
  return updateCoupon(couponId, { status }, adminName);
};

// 쿠폰 발급 (특정 사용자에게)
export const issueCouponToUser = async (couponId, userEmail, adminName) => {
  const coupons = getFromStorage(STORAGE_KEYS.COUPONS, []);
  const coupon = coupons.find(c => c.id === couponId);

  if (!coupon) {
    return { success: false, error: '쿠폰을 찾을 수 없습니다.' };
  }

  if (coupon.status !== 'active') {
    return { success: false, error: '비활성 쿠폰은 발급할 수 없습니다.' };
  }

  const usages = getFromStorage(STORAGE_KEYS.COUPON_USAGES, []);

  // 이미 발급받았는지 확인
  if (usages.some(u => u.couponId === couponId && u.userEmail === userEmail)) {
    return { success: false, error: '이미 발급받은 쿠폰입니다.' };
  }

  const newUsage = {
    id: generateId('CU'),
    couponId,
    couponCode: coupon.code,
    couponName: coupon.name,
    userEmail,
    status: 'issued',
    issuedAt: new Date().toISOString(),
    issuedBy: adminName,
  };

  usages.unshift(newUsage);
  saveToStorage(STORAGE_KEYS.COUPON_USAGES, usages);

  // 쿠폰 발급 카운트 증가
  const couponIndex = coupons.findIndex(c => c.id === couponId);
  coupons[couponIndex].usedCount = (coupons[couponIndex].usedCount || 0) + 1;
  saveToStorage(STORAGE_KEYS.COUPONS, coupons);

  return { success: true, data: newUsage };
};

// 쿠폰 사용 이력 조회
export const getCouponUsages = async (filters = {}) => {
  let usages = getFromStorage(STORAGE_KEYS.COUPON_USAGES, []);

  if (filters.couponId) {
    usages = usages.filter(u => u.couponId === filters.couponId);
  }
  if (filters.userEmail) {
    usages = usages.filter(u => u.userEmail.includes(filters.userEmail));
  }
  if (filters.status) {
    usages = usages.filter(u => u.status === filters.status);
  }

  usages.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));

  return { success: true, data: usages };
};

// 쿠폰 통계
export const getCouponStatistics = async () => {
  const coupons = getFromStorage(STORAGE_KEYS.COUPONS, []);
  const usages = getFromStorage(STORAGE_KEYS.COUPON_USAGES, []);

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'active').length,
    totalIssued: usages.length,
    totalUsed: usages.filter(u => u.status === 'used').length,
  };

  return { success: true, data: stats };
};

// ========== 감사 로그 API ==========

// 감사 로그 생성
export const createAuditLog = async (logData) => {
  const logs = getFromStorage(STORAGE_KEYS.AUDIT_LOGS, []);

  const newLog = {
    id: generateId('LOG'),
    ...logData,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1', // 실제로는 클라이언트 IP
  };

  logs.unshift(newLog);

  // 최대 10000개 유지
  if (logs.length > 10000) {
    logs.splice(10000);
  }

  saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);

  return { success: true, data: newLog };
};

// 감사 로그 조회
export const getAuditLogs = async (filters = {}, pagination = { page: 1, limit: 50 }) => {
  let logs = getFromStorage(STORAGE_KEYS.AUDIT_LOGS, []);

  // 필터링
  if (filters.action) {
    logs = logs.filter(l => l.action === filters.action);
  }
  if (filters.targetType) {
    logs = logs.filter(l => l.targetType === filters.targetType);
  }
  if (filters.adminName) {
    logs = logs.filter(l => l.adminName?.includes(filters.adminName));
  }
  if (filters.startDate) {
    logs = logs.filter(l => new Date(l.timestamp) >= new Date(filters.startDate));
  }
  if (filters.endDate) {
    logs = logs.filter(l => new Date(l.timestamp) <= new Date(filters.endDate));
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    logs = logs.filter(l =>
      l.description?.toLowerCase().includes(searchLower) ||
      l.targetId?.toLowerCase().includes(searchLower) ||
      l.adminName?.toLowerCase().includes(searchLower)
    );
  }

  // 정렬 (최신순)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // 페이지네이션
  const total = logs.length;
  const start = (pagination.page - 1) * pagination.limit;
  const paginatedData = logs.slice(start, start + pagination.limit);

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

// ========== 시스템 설정 API ==========

// 시스템 설정 조회
export const getSystemSettings = () => {
  const defaultSettings = {
    siteName: 'Ruby Round',
    siteDescription: '실물 루비 보석 라이브 커머스',
    minExchangeAmount: 300000,
    maxExchangeAmount: 10000000,
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
    maintenanceMode: false,
    allowNewRegistration: true,
    requireAdultVerification: false,
    defaultCouponExpireDays: 30,
    maxCouponPerUser: 5,
  };

  const settings = getFromStorage(STORAGE_KEYS.SYSTEM_SETTINGS, defaultSettings);
  return { ...defaultSettings, ...settings };
};

// 시스템 설정 저장
export const saveSystemSettings = async (settings, adminName) => {
  saveToStorage(STORAGE_KEYS.SYSTEM_SETTINGS, settings);

  await createAuditLog({
    action: 'update',
    targetType: 'system',
    targetId: 'settings',
    adminName,
    description: '시스템 설정 변경',
    details: settings,
  });

  return { success: true, data: settings };
};

// ========== 고객 관리 확장 API ==========

// 고객 상세 정보 (교환, 결제, 쿠폰 등 포함)
export const getCustomerDetail = async (userEmail) => {
  const users = getFromStorage(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email === userEmail);

  if (!user) {
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  }

  // 교환금 잔액
  const balances = getFromStorage(STORAGE_KEYS.USER_EXCHANGE_BALANCE, {});
  const balance = balances[userEmail] || { totalBalance: 0, availableBalance: 0 };

  // 교환 신청 내역
  const applications = getFromStorage(STORAGE_KEYS.EXCHANGE_APPLICATIONS, []);
  const userApplications = applications.filter(a => a.userEmail === userEmail);

  // 결제 내역
  const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
  const userPayments = payments.filter(p => p.userEmail === userEmail);

  // 쿠폰 내역
  const couponUsages = getFromStorage(STORAGE_KEYS.COUPON_USAGES, []);
  const userCoupons = couponUsages.filter(c => c.userEmail === userEmail);

  // 보상 내역
  const rewards = getFromStorage(STORAGE_KEYS.REWARDS, []);
  const userRewards = rewards.filter(r => r.userEmail === userEmail);

  // 성인 인증 내역
  const verifications = getFromStorage(STORAGE_KEYS.ADULT_VERIFICATIONS, []);
  const userVerifications = verifications.filter(v => v.userEmail === userEmail);

  return {
    success: true,
    data: {
      ...user,
      balance,
      applications: userApplications,
      payments: userPayments,
      coupons: userCoupons,
      rewards: userRewards,
      verifications: userVerifications,
      statistics: {
        totalPayments: userPayments.length,
        totalPaymentAmount: userPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
        totalExchanges: userApplications.length,
        completedExchanges: userApplications.filter(a => a.status === 'completed').length,
        totalRewards: userRewards.length,
      },
    },
  };
};
