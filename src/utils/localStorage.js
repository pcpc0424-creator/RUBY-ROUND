import { STORAGE_KEYS } from '../constants/exchangeConstants';

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
