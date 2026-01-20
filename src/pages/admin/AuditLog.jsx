import { useState, useEffect } from 'react';
import { getAuditLogs, getAdminAuth } from '../../api/exchangeApi';
import { AUDIT_ACTION_TYPE, AUDIT_TARGET_TYPE } from '../../constants/exchangeConstants';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    targetType: '',
    adminName: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';

  useEffect(() => {
    loadLogs();
  }, [filters, pagination.page]);

  const loadLogs = async () => {
    setLoading(true);
    const result = await getAuditLogs(filters, { page: pagination.page, limit: pagination.limit });
    if (result.success) {
      setLogs(result.data.logs || result.data);
      if (result.data.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        }));
      }
    }
    setLoading(false);
  };

  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  const getActionBadge = (action) => {
    const actionInfo = AUDIT_ACTION_TYPE[action] || { label: action, color: 'gray' };
    const colorMap = {
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      red: 'bg-red-500/20 text-red-400',
      purple: 'bg-purple-500/20 text-purple-400',
      orange: 'bg-orange-500/20 text-orange-400',
      gray: 'bg-gray-500/20 text-gray-400',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorMap[actionInfo.color] || colorMap.gray}`}>
        {actionInfo.label}
      </span>
    );
  };

  const getTargetTypeBadge = (targetType) => {
    const targetInfo = AUDIT_TARGET_TYPE[targetType] || { label: targetType };
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-dark-600 text-gray-300">
        {targetInfo.label}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['일시', '액션', '대상 유형', '대상 ID', '관리자', '상세 내용', 'IP 주소'];
    const rows = logs.map((log) => [
      new Date(log.createdAt).toLocaleString('ko-KR'),
      AUDIT_ACTION_TYPE[log.action]?.label || log.action,
      AUDIT_TARGET_TYPE[log.targetType]?.label || log.targetType,
      log.targetId || '',
      log.adminName || '',
      log.details || '',
      log.ipAddress || '',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `감사로그_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">감사 로그</h1>
          <p className="text-gray-400 text-sm mt-1">
            전체 {pagination.total || logs.length}건
          </p>
        </div>
        <div className="flex gap-2">
          {isCeo && (
            <button
              onClick={exportToCSV}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">CSV 내보내기</span>
            </button>
          )}
          <button
            onClick={loadLogs}
            className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">액션</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {Object.entries(AUDIT_ACTION_TYPE).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">대상 유형</label>
            <select
              value={filters.targetType}
              onChange={(e) => setFilters({ ...filters, targetType: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {Object.entries(AUDIT_TARGET_TYPE).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">관리자</label>
            <input
              type="text"
              value={filters.adminName}
              onChange={(e) => setFilters({ ...filters, adminName: e.target.value })}
              placeholder="관리자 이름"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
            />
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
              onClick={() => setFilters({ action: '', targetType: '', adminName: '', startDate: '', endDate: '' })}
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
      ) : logs.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400">감사 로그가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 */}
          <div className="sm:hidden space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => handleViewDetail(log)}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4 active:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex gap-2 flex-wrap">
                    {getActionBadge(log.action)}
                    {getTargetTypeBadge(log.targetType)}
                  </div>
                </div>
                <p className="text-white text-sm mb-2 line-clamp-2">{log.details || '-'}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{log.adminName}</span>
                  <span>{new Date(log.createdAt).toLocaleString('ko-KR')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* PC 테이블 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">일시</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">액션</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">대상</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">대상 ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">관리자</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">상세 내용</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-sm whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getTargetTypeBadge(log.targetType)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-300 text-sm font-mono">
                          {log.targetId ? log.targetId.substring(0, 8) + '...' : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-white text-sm">{log.adminName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-sm truncate max-w-xs block">
                          {log.details || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleViewDetail(log)}
                          className="px-3 py-1 bg-ruby-600/20 hover:bg-ruby-600/30 text-ruby-400 text-sm rounded transition-colors"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                이전
              </button>
              <span className="px-4 py-2 text-gray-400">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* 상세 모달 */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold text-white">감사 로그 상세</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">액션</span>
                  {getActionBadge(selectedLog.action)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">대상 유형</span>
                  {getTargetTypeBadge(selectedLog.targetType)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">대상 ID</span>
                  <span className="text-white font-mono text-sm">{selectedLog.targetId || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">관리자</span>
                  <span className="text-white">{selectedLog.adminName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">일시</span>
                  <span className="text-white">{new Date(selectedLog.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                {selectedLog.ipAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP 주소</span>
                    <span className="text-white font-mono">{selectedLog.ipAddress}</span>
                  </div>
                )}
              </div>

              {selectedLog.details && (
                <div className="bg-dark-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">상세 내용</h3>
                  <p className="text-white text-sm whitespace-pre-wrap">{selectedLog.details}</p>
                </div>
              )}

              {selectedLog.previousData && (
                <div className="bg-dark-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">이전 데이터</h3>
                  <pre className="text-white text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.previousData, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newData && (
                <div className="bg-dark-700/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">변경 데이터</h3>
                  <pre className="text-white text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.newData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
