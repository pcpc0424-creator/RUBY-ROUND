import { useState, useEffect } from 'react';
import { getSeasons, getRoundsBySeason, getPaymentsBySeason, refundPayment } from '../../api/seasonApi';
import { formatAmount } from '../../utils/localStorage';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
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
  const [allPayments, setAllPayments] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [rounds, setRounds] = useState([]);
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
  const [refundModal, setRefundModal] = useState({ open: false, payment: null });
  const [refundReason, setRefundReason] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allPayments]);

  useEffect(() => {
    if (filters.seasonId) {
      loadRounds(filters.seasonId);
    } else {
      setRounds([]);
    }
  }, [filters.seasonId]);

  const loadData = async () => {
    setLoading(true);

    // 시즌 목록 로드
    const seasonsResult = await getSeasons();
    if (seasonsResult.success) {
      setSeasons(seasonsResult.data);

      // 모든 시즌의 결제 내역 로드
      const allPaymentsData = [];
      for (const season of seasonsResult.data) {
        const paymentsResult = await getPaymentsBySeason(season.id);
        if (paymentsResult.success) {
          allPaymentsData.push(...paymentsResult.data.map(p => ({
            ...p,
            seasonName: season.name,
          })));
        }
      }
      // 최신순 정렬
      allPaymentsData.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at));
      setAllPayments(allPaymentsData);
    }

    setLoading(false);
  };

  const loadRounds = async (seasonId) => {
    const result = await getRoundsBySeason(seasonId);
    if (result.success) {
      setRounds(result.data);
    }
  };

  const applyFilters = () => {
    let filtered = [...allPayments];

    // 필터 적용
    if (filters.seasonId) {
      filtered = filtered.filter(p => p.season_id === filters.seasonId);
    }
    if (filters.roundId) {
      filtered = filtered.filter(p => p.round_id === filters.roundId);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.user_name?.toLowerCase().includes(searchLower) ||
        p.user_email?.toLowerCase().includes(searchLower) ||
        p.id?.toLowerCase().includes(searchLower)
      );
    }

    setPayments(filtered);

    // 통계 계산
    const uniqueUsers = new Set(filtered.map(p => p.user_email));
    setStats({
      totalCount: filtered.length,
      totalAmount: filtered.reduce((sum, p) => sum + (p.amount || 0), 0),
      uniqueUsers: uniqueUsers.size,
    });
  };

  const getStatusBadge = (status) => {
    const configs = {
      success: { label: '완료', className: 'bg-green-500/20 text-green-400' },
      pending: { label: '대기', className: 'bg-yellow-500/20 text-yellow-400' },
      failed: { label: '실패', className: 'bg-red-500/20 text-red-400' },
      cancelled: { label: '취소', className: 'bg-gray-500/20 text-gray-400' },
      refunded: { label: '환불', className: 'bg-orange-500/20 text-orange-400' },
    };
    const config = configs[status] || configs.success;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleRefund = async () => {
    if (!refundModal.payment) return;

    setRefundLoading(true);
    try {
      const result = await refundPayment(
        refundModal.payment.id,
        refundModal.payment.payment_key,
        refundReason || '관리자 요청에 의한 환불'
      );

      if (result.success) {
        alert('환불이 완료되었습니다.');
        setRefundModal({ open: false, payment: null });
        setRefundReason('');
        loadData();
      } else {
        alert(result.error || '환불 처리에 실패했습니다.');
      }
    } catch (error) {
      alert('환불 처리 중 오류가 발생했습니다.');
    } finally {
      setRefundLoading(false);
    }
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
              disabled={!filters.seasonId}
            >
              <option value="">전체 라운드</option>
              {rounds.map((round) => (
                <option key={round.id} value={round.id}>{round.round_number}회차 - {round.name}</option>
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
                    <p className="text-white font-medium">{payment.user_name}</p>
                    <p className="text-gray-400 text-sm truncate">{payment.user_email}</p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">라운드</span>
                    <span className="text-white">{payment.round_name || payment.round_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제금액</span>
                    <span className="text-ruby-400 font-medium">
                      {payment.amount === 0 ? '무료' : formatAmount(payment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">결제일시</span>
                    <span className="text-gray-300">{formatDate(payment.paid_at)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-dark-600 flex items-center justify-between">
                  <p className="text-gray-500 text-xs font-mono">{payment.id}</p>
                  {payment.status === 'success' && payment.payment_key && payment.amount > 0 && (
                    <button
                      onClick={() => setRefundModal({ open: true, payment })}
                      className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg text-xs transition-colors"
                    >
                      환불
                    </button>
                  )}
                  {payment.status === 'refunded' && (
                    <span className="text-gray-500 text-xs">환불완료</span>
                  )}
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
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">관리</th>
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
                          <p className="text-white font-medium">{payment.user_name}</p>
                          <p className="text-gray-400 text-sm">{payment.user_email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-gray-400 text-xs">{payment.seasonName}</p>
                          <p className="text-white">{payment.round_name || payment.round_id}</p>
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
                        <span className="text-gray-300 text-sm">{formatDate(payment.paid_at)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {payment.status === 'success' && payment.payment_key && payment.amount > 0 && (
                          <button
                            onClick={() => setRefundModal({ open: true, payment })}
                            className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg text-xs transition-colors"
                          >
                            환불
                          </button>
                        )}
                        {payment.status === 'refunded' && (
                          <span className="text-gray-500 text-xs">환불완료</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 환불 모달 */}
      {refundModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-600 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-dark-600">
              <h3 className="text-lg font-semibold text-white">결제 환불</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-dark-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">주문번호</span>
                  <span className="text-white font-mono">{refundModal.payment?.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">고객</span>
                  <span className="text-white">{refundModal.payment?.user_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">환불 금액</span>
                  <span className="text-ruby-400 font-medium">{formatAmount(refundModal.payment?.amount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">환불 사유</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="환불 사유를 입력하세요"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 text-sm">
                  환불 처리 시 토스페이먼츠를 통해 즉시 환불됩니다. 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-dark-600 flex gap-3">
              <button
                onClick={() => {
                  setRefundModal({ open: false, payment: null });
                  setRefundReason('');
                }}
                className="flex-1 px-4 py-2.5 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRefund}
                disabled={refundLoading}
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refundLoading ? '처리 중...' : '환불 처리'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
