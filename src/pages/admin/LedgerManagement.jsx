import { useState, useEffect } from 'react';
import { getAllLedgerEntries, getAdminAuth } from '../../api/exchangeApi';
import { formatAmount } from '../../utils/localStorage';

export default function LedgerManagement() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userEmail: '',
    type: '',
    startDate: '',
    endDate: '',
  });
  const [summary, setSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    netBalance: 0,
    entryCount: 0,
  });
  const auth = getAdminAuth();

  useEffect(() => {
    loadEntries();
  }, [filters]);

  const loadEntries = async () => {
    setLoading(true);
    const result = await getAllLedgerEntries(filters);
    if (result.success) {
      setEntries(result.data);
      // 요약 계산
      const totalCredit = result.data
        .filter((e) => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0);
      const totalDebit = result.data
        .filter((e) => e.type === 'debit')
        .reduce((sum, e) => sum + e.amount, 0);
      setSummary({
        totalCredit,
        totalDebit,
        netBalance: totalCredit - totalDebit,
        entryCount: result.data.length,
      });
    }
    setLoading(false);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'credit':
        return { label: '입금', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'debit':
        return { label: '출금', color: 'text-red-400', bg: 'bg-red-500/20' };
      default:
        return { label: type, color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const getReasonLabel = (reason) => {
    const reasons = {
      charge: '충전',
      deduct: '차감',
      exchange: '교환 신청',
      refund: '환불',
      prize: '당첨금',
      coupon: '쿠폰 적용',
      admin: '관리자 조정',
    };
    return reasons[reason] || reason || '-';
  };

  const exportToCSV = () => {
    const headers = ['일시', '사용자', '유형', '금액', '잔액', '사유', '설명'];
    const rows = entries.map((e) => [
      new Date(e.createdAt).toLocaleString('ko-KR'),
      e.userEmail,
      getTypeLabel(e.type).label,
      e.amount,
      e.balanceAfter,
      getReasonLabel(e.reason),
      e.description || '',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `교환금원장_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">교환금 원장</h1>
          <p className="text-gray-400 text-sm mt-1">전체 {entries.length}건</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">CSV 내보내기</span>
          </button>
          <button
            onClick={loadEntries}
            className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">총 입금</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatAmount(summary.totalCredit)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">총 출금</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{formatAmount(summary.totalDebit)}</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">순 잔액</p>
          <p className={`text-2xl font-bold mt-1 ${summary.netBalance >= 0 ? 'text-ruby-400' : 'text-red-400'}`}>
            {formatAmount(summary.netBalance)}
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">거래 건수</p>
          <p className="text-2xl font-bold text-white mt-1">{summary.entryCount}건</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">사용자 검색</label>
            <input
              type="text"
              value={filters.userEmail}
              onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
              placeholder="이메일"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">유형</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              <option value="credit">입금</option>
              <option value="debit">출금</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">시작일</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">종료일</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ userEmail: '', type: '', startDate: '', endDate: '' })}
              className="w-full px-4 py-2.5 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">원장 기록이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 */}
          <div className="sm:hidden space-y-3">
            {entries.map((entry) => {
              const typeInfo = getTypeLabel(entry.type);
              return (
                <div
                  key={entry.id}
                  className="bg-dark-800 border border-dark-600 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-300 text-sm truncate">{entry.userEmail}</p>
                      <p className={`text-lg font-bold ${typeInfo.color}`}>
                        {entry.type === 'credit' ? '+' : '-'}{formatAmount(entry.amount)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.bg} ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{getReasonLabel(entry.reason)}</span>
                    <span className="text-gray-500">잔액: {formatAmount(entry.balanceAfter)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(entry.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* PC 테이블 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">일시</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">사용자</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">유형</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">금액</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">잔액</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">사유</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {entries.map((entry) => {
                    const typeInfo = getTypeLabel(entry.type);
                    return (
                      <tr key={entry.id} className="hover:bg-dark-700/50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-gray-400 text-sm">
                            {new Date(entry.createdAt).toLocaleString('ko-KR')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-white text-sm">{entry.userEmail}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${typeInfo.bg} ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`font-medium ${typeInfo.color}`}>
                            {entry.type === 'credit' ? '+' : '-'}{formatAmount(entry.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-gray-300">{formatAmount(entry.balanceAfter)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-400 text-sm">{getReasonLabel(entry.reason)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-400 text-sm truncate max-w-xs block">
                            {entry.description || '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
