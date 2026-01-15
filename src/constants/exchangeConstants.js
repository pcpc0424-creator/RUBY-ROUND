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
    label: 'CS상담중',
    labelDetail: 'CS상담중(미차감)',
    color: 'yellow',
    bgClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'CS 담당자가 상담을 진행 중입니다.',
    canCancel: true,
  },
  CONSULTATION_CONFIRMED: {
    key: 'consultation_confirmed',
    label: '상담확정',
    labelDetail: '상담확정(미차감)',
    color: 'orange',
    bgClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: '상담이 완료되어 대표 승인을 대기 중입니다.',
    canCancel: true,
  },
  APPROVED: {
    key: 'approved',
    label: '대표승인',
    labelDetail: '승인완료(차감됨)',
    color: 'green',
    bgClass: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: '대표 승인 완료. 교환금이 차감되고 제작이 시작됩니다.',
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
    description: '본 신청은 \'상담 접수\'이며, 제출 시 교환금이 차감되지 않고 대표 승인 시 교환금이 차감됨을 확인합니다.',
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
    description: '대표 승인(제작 착수/발주 착수) 이후에는 주문제작 특성상 취소/환불이 제한됨에 동의합니다.',
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
      title: 'CS 상담 진행',
      description: 'CS 담당자가 연락드려 상세 내용을 확인하고 최종 사양을 협의합니다.',
    },
    {
      id: 3,
      icon: '✅',
      title: '대표 승인 후 차감',
      description: '최종 확정 후 대표 승인 시 교환금이 차감되고 제작이 시작됩니다.',
    },
    {
      id: 4,
      icon: '⚠️',
      title: '취소 안내',
      description: '대표 승인 전까지는 취소가 가능하지만, 승인 이후에는 취소가 불가합니다.',
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
    permissions: ['view', 'consult', 'approve', 'cancel', 'manage_users'],
  },
  CS_MANAGER: {
    key: 'cs_manager',
    label: 'CS 관리자',
    permissions: ['view', 'consult', 'cancel'],
  },
  CS_STAFF: {
    key: 'cs_staff',
    label: 'CS 담당자',
    permissions: ['view', 'consult'],
  },
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
