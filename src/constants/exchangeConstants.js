// 교환 신청 상태 정의
export const EXCHANGE_STATUS = {
  RECEIVED: {
    key: 'received',
    label: '접수완료',
    labelDetail: '접수완료(미차감)',
    color: 'blue',
    bgClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: '고객 신청이 접수되었습니다. 교환금은 아직 차감되지 않았습니다.',
    canCancel: true,
  },
  CS_CONSULTING: {
    key: 'cs_consulting',
    label: '전문 상담사 확인중',
    labelDetail: '전문 상담사 확인중(미차감)',
    color: 'yellow',
    bgClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: '전문 상담사가 확인을 진행 중입니다.',
    canCancel: true,
  },
  CONSULTATION_CONFIRMED: {
    key: 'consultation_confirmed',
    label: '상담확정',
    labelDetail: '상담확정(미차감)',
    color: 'orange',
    bgClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: '상담이 완료되어 내부 승인을 대기 중입니다.',
    canCancel: true,
  },
  APPROVED: {
    key: 'approved',
    label: '승인완료',
    labelDetail: '승인완료(차감됨)',
    color: 'green',
    bgClass: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: '내부 승인 완료. 교환금이 차감되고 제작이 시작됩니다.',
    canCancel: false,
  },
  IN_PRODUCTION: {
    key: 'in_production',
    label: '제작중',
    color: 'purple',
    bgClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: '주문제작이 진행 중입니다.',
    canCancel: false,
  },
  READY_TO_SHIP: {
    key: 'ready_to_ship',
    label: '출고준비',
    color: 'indigo',
    bgClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    description: '출고 준비 중입니다.',
    canCancel: false,
  },
  SHIPPING: {
    key: 'shipping',
    label: '배송중',
    color: 'cyan',
    bgClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: '배송이 진행 중입니다.',
    canCancel: false,
  },
  DELIVERED: {
    key: 'delivered',
    label: '배송완료',
    color: 'teal',
    bgClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    description: '배송이 완료되었습니다. 수령 확인을 진행해주세요.',
    canCancel: false,
  },
  COMPLETED: {
    key: 'completed',
    label: '완료',
    color: 'gray',
    bgClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    description: '교환이 완료되었습니다.',
    canCancel: false,
  },
  CANCELLED: {
    key: 'cancelled',
    label: '취소됨',
    color: 'red',
    bgClass: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: '신청이 취소되었습니다.',
    canCancel: false,
  },
};

// 상태 키로 상태 정보 가져오기
export const getStatusByKey = (key) => {
  return Object.values(EXCHANGE_STATUS).find(status => status.key === key);
};

// 카테고리 정의
export const EXCHANGE_CATEGORIES = {
  ring: {
    key: 'ring',
    label: '반지',
    icon: '💍',
    requiredFields: ['ringSize'],
    specifications: {
      ringSize: {
        key: 'ringSize',
        label: '반지 호수',
        type: 'select',
        options: ['7호', '8호', '9호', '10호', '11호', '12호', '13호', '14호', '15호', '16호', '17호', '18호', '19호', '20호', '직접입력'],
        required: true,
        placeholder: '호수를 선택해주세요',
      },
    },
  },
  necklace: {
    key: 'necklace',
    label: '목걸이',
    icon: '📿',
    requiredFields: ['chainLength'],
    specifications: {
      chainLength: {
        key: 'chainLength',
        label: '체인 길이 (cm)',
        type: 'select',
        options: ['40cm', '42cm', '45cm', '50cm', '55cm', '60cm', '직접입력'],
        required: true,
        placeholder: '체인 길이를 선택해주세요',
      },
    },
  },
  bracelet: {
    key: 'bracelet',
    label: '팔찌',
    icon: '📎',
    requiredFields: ['braceletLength'],
    specifications: {
      braceletLength: {
        key: 'braceletLength',
        label: '팔찌 길이 (cm)',
        type: 'select',
        options: ['14cm', '15cm', '16cm', '17cm', '18cm', '19cm', '20cm', '직접입력'],
        required: true,
        placeholder: '팔찌 길이를 선택해주세요',
      },
    },
  },
  earring: {
    key: 'earring',
    label: '귀걸이',
    icon: '✨',
    requiredFields: ['earringStyle', 'earringSet'],
    specifications: {
      earringStyle: {
        key: 'earringStyle',
        label: '형태',
        type: 'select',
        options: ['스터드', '드롭', '후프'],
        required: true,
        placeholder: '형태를 선택해주세요',
      },
      earringSet: {
        key: 'earringSet',
        label: '구성',
        type: 'select',
        options: ['한 쌍', '단품'],
        required: true,
        placeholder: '구성을 선택해주세요',
      },
    },
  },
  other: {
    key: 'other',
    label: '기타',
    icon: '💎',
    requiredFields: ['otherDescription'],
    specifications: {
      otherDescription: {
        key: 'otherDescription',
        label: '요청사항 상세',
        type: 'textarea',
        required: true,
        placeholder: '원하시는 악세사리 종류와 상세 요청사항을 입력해주세요',
      },
    },
  },
};

// 필수 동의 항목
export const REQUIRED_AGREEMENTS = [
  {
    key: 'consultationProcess',
    title: '상담 접수 및 차감 시점 확인',
    description: '본 신청은 \'상담 접수\'이며, 제출 시 교환금이 차감되지 않고 내부 승인 시 교환금이 차감됨을 확인합니다.',
    required: true,
  },
  {
    key: 'budgetBasedProposal',
    title: '예산 기반 제안 방식 확인',
    description: '본 신청은 특정 상품 지정이 아닌, 예산(사용 예정 교환금) 범위 내 제안/확정 방식임을 확인합니다.',
    required: true,
  },
  {
    key: 'cancelRestriction',
    title: '취소/환불 제한 동의',
    description: '내부 승인(제작 착수/발주 착수) 이후에는 주문제작 특성상 취소/환불이 제한됨에 동의합니다.',
    required: true,
  },
  {
    key: 'exceptionHandling',
    title: '예외 조치 가능 확인',
    description: '하자/오배송/고지와 현저히 상이한 경우 조치 가능함을 확인합니다.',
    required: true,
  },
  {
    key: 'privacyConsent',
    title: '배송 관련 개인정보 수집·이용 및 위탁 동의',
    description: '배송을 위해 수령인 정보(성명, 연락처, 주소)를 수집하고, 배송사에 위탁하는 것에 동의합니다.',
    required: true,
  },
];

// 최소 교환 신청 금액
export const MIN_EXCHANGE_AMOUNT = 300000;

// localStorage 키
export const STORAGE_KEYS = {
  EXCHANGE_APPLICATIONS: 'rubyround_exchange_applications',
  USER_EXCHANGE_BALANCE: 'rubyround_user_exchange_balance',
  EXCHANGE_LEDGER: 'rubyround_exchange_ledger',
  ADMIN_USERS: 'rubyround_admin_users',
  ADMIN_AUTH: 'rubyround_admin_auth',
  CONSULTATION_MODAL_CONTENT: 'rubyround_consultation_modal_content',
  USERS: 'rubyround_users',
  // 시즌 정산 관련
  SEASONS: 'rubyround_seasons',
  ROUNDS: 'rubyround_rounds',
  ROUND_PAYMENTS: 'rubyround_round_payments',
  SEASON_SETTLEMENTS: 'rubyround_season_settlements',
  // 배송 관리
  DELIVERIES: 'rubyround_deliveries',
  // 성인 인증
  ADULT_VERIFICATIONS: 'rubyround_adult_verifications',
  // 본인인증 증빙 (CI/DI 등)
  VERIFICATION_EVIDENCE: 'rubyround_verification_evidence',
  // 라운드 결과
  ROUND_RESULTS: 'rubyround_round_results',
  // 보상/당첨
  REWARDS: 'rubyround_rewards',
  // 쿠폰
  COUPONS: 'rubyround_coupons',
  COUPON_USAGES: 'rubyround_coupon_usages',
  // 감사 로그
  AUDIT_LOGS: 'rubyround_audit_logs',
  // 시스템 설정
  SYSTEM_SETTINGS: 'rubyround_system_settings',
  // 웹 문의
  CONTACT_INQUIRIES: 'rubyround_contact_inquiries',
};

// 배송 상태
export const DELIVERY_STATUS = {
  PENDING: {
    key: 'pending',
    label: '배송대기',
    color: 'gray',
    bgClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
  READY: {
    key: 'ready',
    label: '출고준비',
    color: 'blue',
    bgClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  SHIPPED: {
    key: 'shipped',
    label: '배송중',
    color: 'cyan',
    bgClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  DELIVERED: {
    key: 'delivered',
    label: '배송완료',
    color: 'green',
    bgClass: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  RETURNED: {
    key: 'returned',
    label: '반송',
    color: 'red',
    bgClass: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

// 택배사 목록
export const COURIER_LIST = [
  { key: 'cj', label: 'CJ대한통운', trackingUrl: 'https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=' },
  { key: 'hanjin', label: '한진택배', trackingUrl: 'https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mession-check=Y&wblnumText2=' },
  { key: 'lotte', label: '롯데택배', trackingUrl: 'https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=' },
  { key: 'logen', label: '로젠택배', trackingUrl: 'https://www.ilogen.com/web/personal/trace/' },
  { key: 'post', label: '우체국택배', trackingUrl: 'https://service.epost.go.kr/trace.RetrieveDomRi498.postal?sid1=' },
  { key: 'gs', label: 'GS Postbox', trackingUrl: 'https://www.cvsnet.co.kr/invoice/tracking.do?invoice_no=' },
  { key: 'kdexp', label: '경동택배', trackingUrl: 'https://kdexp.com/service/delivery/etc/delivery.do?barcode=' },
  { key: 'other', label: '기타', trackingUrl: '' },
];

// 성인 인증 상태
export const ADULT_VERIFICATION_STATUS = {
  PENDING: {
    key: 'pending',
    label: '인증대기',
    color: 'yellow',
    bgClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  APPROVED: {
    key: 'approved',
    label: '인증완료',
    color: 'green',
    bgClass: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  REJECTED: {
    key: 'rejected',
    label: '인증거부',
    color: 'red',
    bgClass: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  EXPIRED: {
    key: 'expired',
    label: '만료',
    color: 'gray',
    bgClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
};

// 성인 인증 방법
export const ADULT_VERIFICATION_METHODS = [
  { key: 'pass', label: 'PASS 본인인증' },
  { key: 'phone', label: '휴대폰 본인인증' },
  { key: 'ipin', label: 'I-PIN 인증' },
  { key: 'card', label: '신용카드 인증' },
  { key: 'manual', label: '관리자 수동 인증' },
];

// 라운드 결과 상태
export const ROUND_RESULT_STATUS = {
  PENDING: { key: 'pending', label: '대기중', color: 'gray' },
  PROCESSING: { key: 'processing', label: '추첨중', color: 'yellow' },
  CONFIRMED: { key: 'confirmed', label: '확정', color: 'green' },
  LOCKED: { key: 'locked', label: '잠금(확정완료)', color: 'blue' },
};

// 보상/당첨 지급 상태
export const REWARD_STATUS = {
  PENDING: { key: 'pending', label: '지급대기', color: 'gray', bgClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  CONFIRMED: { key: 'confirmed', label: '구성확정', color: 'blue', bgClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  PROCESSING: { key: 'processing', label: '지급진행중', color: 'yellow', bgClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  COMPLETED: { key: 'completed', label: '지급완료', color: 'green', bgClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
  EXCEPTION: { key: 'exception', label: '예외처리', color: 'red', bgClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
  CANCELLED: { key: 'cancelled', label: '취소', color: 'red', bgClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

// 보상 유형
export const REWARD_TYPE = {
  RUBY: { key: 'ruby', label: '루비 보석', icon: '💎' },
  EXCHANGE_CREDIT: { key: 'exchange_credit', label: '교환금', icon: '💰' },
  COUPON: { key: 'coupon', label: '쿠폰', icon: '🎟️' },
  GIFT: { key: 'gift', label: '사은품', icon: '🎁' },
};

// 쿠폰 상태
export const COUPON_STATUS = {
  ACTIVE: { key: 'active', label: '활성', color: 'green', bgClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
  INACTIVE: { key: 'inactive', label: '비활성', color: 'gray', bgClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  EXPIRED: { key: 'expired', label: '만료', color: 'red', bgClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

// 쿠폰 유형
export const COUPON_TYPE = {
  PERCENTAGE: { key: 'percentage', label: '정률 할인 (%)' },
  FIXED: { key: 'fixed', label: '정액 할인 (원)' },
  FREE_SHIPPING: { key: 'free_shipping', label: '무료 배송' },
  BONUS_CREDIT: { key: 'bonus_credit', label: '보너스 교환금' },
};

// 쿠폰 사용 상태
export const COUPON_USAGE_STATUS = {
  ISSUED: { key: 'issued', label: '발급됨', color: 'blue' },
  USED: { key: 'used', label: '사용완료', color: 'green' },
  EXPIRED: { key: 'expired', label: '만료', color: 'gray' },
  CANCELLED: { key: 'cancelled', label: '취소', color: 'red' },
};

// 감사 로그 액션 유형
export const AUDIT_ACTION_TYPE = {
  CREATE: { key: 'create', label: '생성', color: 'green' },
  UPDATE: { key: 'update', label: '수정', color: 'blue' },
  DELETE: { key: 'delete', label: '삭제', color: 'red' },
  APPROVE: { key: 'approve', label: '승인', color: 'green' },
  REJECT: { key: 'reject', label: '거부', color: 'red' },
  LOGIN: { key: 'login', label: '로그인', color: 'gray' },
  LOGOUT: { key: 'logout', label: '로그아웃', color: 'gray' },
  EXPORT: { key: 'export', label: '내보내기', color: 'yellow' },
  STATUS_CHANGE: { key: 'status_change', label: '상태변경', color: 'blue' },
};

// 감사 로그 대상 유형
export const AUDIT_TARGET_TYPE = {
  USER: { key: 'user', label: '사용자' },
  ADMIN: { key: 'admin', label: '관리자' },
  ROUND: { key: 'round', label: '라운드' },
  SEASON: { key: 'season', label: '시즌' },
  PAYMENT: { key: 'payment', label: '결제' },
  EXCHANGE: { key: 'exchange', label: '교환' },
  DELIVERY: { key: 'delivery', label: '배송' },
  REWARD: { key: 'reward', label: '보상' },
  COUPON: { key: 'coupon', label: '쿠폰' },
  VERIFICATION: { key: 'verification', label: '인증' },
  SYSTEM: { key: 'system', label: '시스템' },
};

// 시즌 상태
export const SEASON_STATUS = {
  UPCOMING: { key: 'upcoming', label: '예정', color: 'gray' },
  ACTIVE: { key: 'active', label: '진행중', color: 'green' },
  ENDED: { key: 'ended', label: '종료', color: 'yellow' },
  SETTLED: { key: 'settled', label: '정산완료', color: 'blue' },
};

// 라운드 상태
export const ROUND_STATUS = {
  UPCOMING: { key: 'upcoming', label: '예정', color: 'gray' },
  ACTIVE: { key: 'active', label: '참여가능', color: 'green' },
  COMPLETED: { key: 'completed', label: '종료', color: 'blue' },
};

// 결제 상태
export const PAYMENT_STATUS = {
  SUCCESS: { key: 'success', label: '결제완료', color: 'green' },
  CANCELLED: { key: 'cancelled', label: '취소', color: 'red' },
  REFUNDED: { key: 'refunded', label: '환불', color: 'orange' },
};

// 정산 유형
export const SETTLEMENT_TYPE = {
  WITH_WINNER: { key: 'with_winner', label: '당첨 라운드 있음' },
  NO_WINNER: { key: 'no_winner', label: '당첨 라운드 없음 (전체 미당첨)' },
};

// 원장 타입
export const LEDGER_TYPE = {
  CREDIT: { key: 'credit', label: '적립' },
  DEBIT: { key: 'debit', label: '차감' },
};

// 원장 사유
export const LEDGER_REASON = {
  SEASON_SETTLEMENT: { key: 'SEASON_SETTLEMENT', label: '시즌 정산 적립' },
  EXCHANGE_REQUEST_APPROVED: { key: 'EXCHANGE_REQUEST_APPROVED', label: '교환 신청 승인 차감' },
  ADMIN_CHARGE: { key: 'ADMIN_CHARGE', label: '관리자 충전' },
  ADMIN_DEDUCT: { key: 'ADMIN_DEDUCT', label: '관리자 차감' },
};

// 상담 접수 모달 기본 콘텐츠
export const DEFAULT_CONSULTATION_MODAL_CONTENT = {
  title: '상담 접수 안내',
  subtitle: '접수 전 확인해주세요',
  items: [
    {
      id: 1,
      icon: '📋',
      title: '상담 접수',
      description: '본 신청은 상담 접수이며, 교환금이 즉시 차감되지 않습니다.',
    },
    {
      id: 2,
      icon: '💬',
      title: '전문 상담사 확인',
      description: '전문 상담사가 연락드려 상세 내용을 확인하고 최종 사양을 협의합니다.',
    },
    {
      id: 3,
      icon: '✅',
      title: '내부 승인 후 차감',
      description: '내부 승인 완료 시 교환금이 차감되고 제작이 시작됩니다.',
    },
    {
      id: 4,
      icon: '⚠️',
      title: '취소 안내',
      description: '내부 승인 전까지는 취소가 가능하지만, 승인 이후에는 취소가 불가합니다.',
    },
  ],
  confirmButtonText: '확인하고 접수하기',
  cancelButtonText: '다시 확인하기',
};

// 관리자 권한
export const ADMIN_ROLES = {
  CEO: {
    key: 'ceo',
    label: '대표',
    permissions: [
      'view',                    // 조회
      'consult',                 // 상담
      'approve',                 // 승인 (대표만)
      'cancel',                  // 취소
      'manage_users',            // 사용자 관리
      'manage_delivery',         // 배송 관리
      'manage_adult_verification', // 성인 인증 관리
      'approve_adult_verification', // 성인 인증 승인 (대표만)
      'manage_seasons',          // 시즌 관리
      'manage_rounds',           // 라운드 관리
      'manage_settlement',       // 정산 관리
      'manage_modal',            // 모달 설정
    ],
  },
  CS_MANAGER: {
    key: 'cs_manager',
    label: 'CS 관리자',
    permissions: [
      'view',                    // 조회
      'consult',                 // 상담
      'cancel',                  // 취소
      'manage_users',            // 사용자 관리
      'manage_delivery',         // 배송 관리
      'manage_adult_verification', // 성인 인증 관리 (승인 제외)
      'manage_seasons',          // 시즌 관리
      'manage_rounds',           // 라운드 관리
      'manage_settlement',       // 정산 관리
      // 승인 권한 제외: approve, approve_adult_verification, manage_modal
    ],
  },
  CS_STAFF: {
    key: 'cs_staff',
    label: 'CS 담당자',
    permissions: ['view', 'consult'],
  },
};

// 권한 확인 함수
export const hasPermission = (role, permission) => {
  const roleConfig = Object.values(ADMIN_ROLES).find(r => r.key === role);
  return roleConfig?.permissions?.includes(permission) || false;
};

// 상태 변경 가능 목록 (현재 상태 -> 변경 가능 상태)
export const STATUS_TRANSITIONS = {
  received: ['cs_consulting', 'cancelled'],
  cs_consulting: ['consultation_confirmed', 'received', 'cancelled'],
  consultation_confirmed: ['approved', 'cs_consulting', 'cancelled'],
  approved: ['in_production'],
  in_production: ['ready_to_ship'],
  ready_to_ship: ['shipping'],
  shipping: ['delivered'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};
