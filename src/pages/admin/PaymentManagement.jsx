import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../constants/exchangeConstants';

// localStorage 헬퍼
const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    seasonId: '',
    roundId: '',
    search: '',
  });
  const [stats, setStats] = useState({
    totalCount: 0,
    totalAmount: 0,
    uniqueUsers: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const loadData = () => {
    setLoading(true);
    const seasonsData = getFromStorage(STORAGE_KEYS.SEASONS, []);
    setSeasons(seasonsData);
    applyFilters();
    setLoading(false);
  };

  const applyFilters = () => {
    let allPayments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);

    // 필터 적용
    if (filters.seasonId) {
      allPayments = allPayments.filter(p => p.seasonId === filters.seasonId);
    }
    if (filters.roundId) {
      allPayments = allPayments.filter(p => p.roundId === filters.roundId);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allPayments = allPayments.filter(p =>
        p.userName?.toLowerCase().includes(searchLower) ||
        p.userEmail?.toLowerCase().includes(searchLower) ||
        p.id?.toLowerCase().includes(searchLower)
      );
    }

    // 최신순 정렬
    allPayments.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

    setPayments(allPayments);

    // 통계 계산
    const uniqueUsers = new Set(allPayments.map(p => p.userEmail));
    setStats({
      totalCount: allPayments.length,
      totalAmount: allPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      uniqueUsers: uniqueUsers.size,
    });
  };

  const getRounds = () => {
    const rounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
    if (filters.seasonId) {
      return rounds.filter(r => r.seasonId === filters.seasonId);
    }
    return rounds;
  };

  const getStatusBadge = (status) => {
    const configs = {
      success: { label: '완료', className: 'bg-green-500/20 text-green-400' },
      pending: { label: '대기', className: 'bg-yellow-500/20 text-yellow-400' },
      failed: { label: '실패', className: 'bg-red-500/20 text-red-400' },
      cancelled: { label: '취소', className: 'bg-gray-500/20 text-gray-400' },
    };
    const config = configs[status] || configs.success;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">결제 내역</h1>
          <p className="text-gray-400 text-sm mt-1">전체 라운드 결제 내역을 조회합니다.</p>
        </div>
        <button
          onClick={loadData}
          className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">총 결제</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalCount}건</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">결제 금액</p>
          <p className="text-2xl font-bold text-ruby-400 mt-1">{formatAmount(stats.totalAmount)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">참여자</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.uniqueUsers}명</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">시즌</label>
            <select
              value={filters.seasonId}
              onChange={(e) => setFilters({ ...filters, seasonId: e.target.value, roundId: '' })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체 시즌</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>{season.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">라운드</label>
            <select
              value={filters.roundId}
              onChange={(e) => setFilters({ ...filters, roundId: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체 라운드</option>
              {getRounds().map((round) => (
                <option key={round.id} value={round.id}>{round.number} - {round.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="이름, 이메일, 주문번호"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ seasonId: '', roundId: '', search: '' })}
              className="w-full px-4 py-2.5 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결제 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="text-gray-400">결제 내역이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 레이아웃 */}
          <div className="sm:hidden space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">{payment.userName}</p>
                    <p className="text-gray-400 text-sm truncate">{payment.userEmail}</p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">라운드</span>
                    <span className="text-white">{payment.roundTitle || payment.roundId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제금액</span>
                    <span className="text-ruby-400 font-medium">
                      {payment.amount === 0 ? '무료' : formatAmount(payment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제일시</span>
                    <span className="text-gray-300">{formatDate(payment.paidAt)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-dark-600">
                  <p className="text-gray-500 text-xs font-mono">{payment.id}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PC 테이블 레이아웃 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">주문번호</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">고객</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">라운드</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">금액</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">결제일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-xs font-mono">{payment.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white font-medium">{payment.userName}</p>
                          <p className="text-gray-400 text-sm">{payment.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-gray-400 text-xs">{payment.seasonId}</p>
                          <p className="text-white">{payment.roundTitle || payment.roundId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`font-medium ${payment.amount === 0 ? 'text-green-400' : 'text-ruby-400'}`}>
                          {payment.amount === 0 ? '무료' : formatAmount(payment.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-300 text-sm">{formatDate(payment.paidAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
