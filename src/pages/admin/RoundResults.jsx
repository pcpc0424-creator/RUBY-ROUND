import { useState, useEffect } from 'react';
import {
  getRoundResults,
  confirmRoundResult,
  lockRoundResult,
  getAdminAuth,
  createAuditLog,
} from '../../api/exchangeApi';
import { ROUND_RESULT_STATUS } from '../../constants/exchangeConstants';
import { formatAmount } from '../../utils/localStorage';

export default function RoundResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ seasonId: '', status: '', search: '' });
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'detail' | 'confirm' | 'lock'
  const [confirmData, setConfirmData] = useState({
    winnerId: '',
    winnerName: '',
    evidence: '',
    notes: '',
  });
  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';

  useEffect(() => {
    loadResults();
  }, [filters]);

  const loadResults = async () => {
    setLoading(true);
    const result = await getRoundResults(filters);
    if (result.success) {
      setResults(result.data);
    }
    setLoading(false);
  };

  const handleViewDetail = (result) => {
    setSelectedResult(result);
    setModalType('detail');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!confirmData.winnerId || !confirmData.winnerName) {
      alert('당첨자 정보를 입력해주세요.');
      return;
    }

    const result = await confirmRoundResult(
      selectedResult.roundId,
      {
        winnerId: confirmData.winnerId,
        winnerName: confirmData.winnerName,
        evidence: confirmData.evidence,
        notes: confirmData.notes,
      },
      auth?.name || 'Admin'
    );

    if (result.success) {
      await createAuditLog({
        action: 'update',
        targetType: 'round_result',
        targetId: selectedResult.roundId,
        details: `라운드 결과 확정: 당첨자 ${confirmData.winnerName}`,
        adminName: auth?.name || 'Admin',
      });
      alert('라운드 결과가 확정되었습니다.');
      closeModal();
      loadResults();
    } else {
      alert(result.error || '결과 확정에 실패했습니다.');
    }
  };

  const handleLock = async () => {
    if (!isCeo) {
      alert('대표 계정만 결과를 잠글 수 있습니다.');
      return;
    }

    if (!confirm('결과를 잠그면 더 이상 수정할 수 없습니다. 계속하시겠습니까?')) {
      return;
    }

    const result = await lockRoundResult(selectedResult.id, auth?.name || 'Admin');

    if (result.success) {
      await createAuditLog({
        action: 'lock',
        targetType: 'round_result',
        targetId: selectedResult.id,
        details: `라운드 결과 잠금: ${selectedResult.roundName}`,
        adminName: auth?.name || 'Admin',
      });
      alert('결과가 잠겼습니다.');
      closeModal();
      loadResults();
    } else {
      alert(result.error || '결과 잠금에 실패했습니다.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResult(null);
    setModalType('');
    setConfirmData({ winnerId: '', winnerName: '', evidence: '', notes: '' });
  };

  const getStatusBadge = (status) => {
    const statusInfo = ROUND_RESULT_STATUS[status] || { label: status, color: 'gray' };
    const colorMap = {
      yellow: 'bg-yellow-500/20 text-yellow-400',
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      gray: 'bg-gray-500/20 text-gray-400',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorMap[statusInfo.color] || colorMap.gray}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">라운드 결과/증빙</h1>
          <p className="text-gray-400 text-sm mt-1">전체 {results.length}건</p>
        </div>
        <button
          onClick={loadResults}
          className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="라운드명, 당첨자"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">상태</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {Object.entries(ROUND_RESULT_STATUS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={() => setFilters({ seasonId: '', status: '', search: '' })}
              className="w-full sm:w-auto px-4 py-2.5 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
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
      ) : results.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400">라운드 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 */}
          <div className="sm:hidden space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleViewDetail(result)}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4 active:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">{result.roundName}</p>
                    <p className="text-gray-400 text-sm">{result.seasonName}</p>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    당첨자: {result.winnerName || '-'}
                  </span>
                  {result.isLocked && (
                    <span className="text-red-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      잠김
                    </span>
                  )}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">라운드</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">시즌</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">당첨자</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">잠금</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">확정일</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-white font-medium">{result.roundName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-300 text-sm">{result.seasonName}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(result.status)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-300 text-sm">{result.winnerName || '-'}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {result.isLocked ? (
                          <span className="text-red-400">
                            <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-400 text-sm">
                          {result.confirmedAt
                            ? new Date(result.confirmedAt).toLocaleDateString('ko-KR')
                            : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleViewDetail(result)}
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
        </>
      )}

      {/* 상세 모달 */}
      {showModal && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold text-white">
                {modalType === 'detail' && '라운드 결과 상세'}
                {modalType === 'confirm' && '결과 확정'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {modalType === 'detail' && (
                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">라운드</span>
                      <span className="text-white font-medium">{selectedResult.roundName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">시즌</span>
                      <span className="text-white">{selectedResult.seasonName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">상태</span>
                      {getStatusBadge(selectedResult.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">당첨자</span>
                      <span className="text-white">{selectedResult.winnerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">당첨 금액</span>
                      <span className="text-ruby-400">{formatAmount(selectedResult.prizeAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">잠금 상태</span>
                      <span className={selectedResult.isLocked ? 'text-red-400' : 'text-gray-500'}>
                        {selectedResult.isLocked ? '잠김' : '미잠금'}
                      </span>
                    </div>
                  </div>

                  {/* 증빙 자료 */}
                  {selectedResult.evidence && (
                    <div className="bg-dark-700/50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">증빙 자료</h3>
                      <p className="text-white text-sm whitespace-pre-wrap">{selectedResult.evidence}</p>
                    </div>
                  )}

                  {/* 메모 */}
                  {selectedResult.notes && (
                    <div className="bg-dark-700/50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">메모</h3>
                      <p className="text-white text-sm whitespace-pre-wrap">{selectedResult.notes}</p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  {!selectedResult.isLocked && (
                    <div className="flex gap-2">
                      {selectedResult.status === 'pending' && (
                        <button
                          onClick={() => setModalType('confirm')}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                        >
                          결과 확정
                        </button>
                      )}
                      {selectedResult.status === 'confirmed' && isCeo && (
                        <button
                          onClick={handleLock}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          결과 잠금 (대표만)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {modalType === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-dark-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400">라운드</p>
                    <p className="text-lg font-bold text-white">{selectedResult.roundName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">당첨자 ID *</label>
                    <input
                      type="text"
                      value={confirmData.winnerId}
                      onChange={(e) => setConfirmData({ ...confirmData, winnerId: e.target.value })}
                      placeholder="당첨자 ID/이메일"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">당첨자 이름 *</label>
                    <input
                      type="text"
                      value={confirmData.winnerName}
                      onChange={(e) => setConfirmData({ ...confirmData, winnerName: e.target.value })}
                      placeholder="당첨자 이름"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">증빙 자료</label>
                    <textarea
                      value={confirmData.evidence}
                      onChange={(e) => setConfirmData({ ...confirmData, evidence: e.target.value })}
                      placeholder="증빙 자료 URL 또는 설명"
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">메모</label>
                    <textarea
                      value={confirmData.notes}
                      onChange={(e) => setConfirmData({ ...confirmData, notes: e.target.value })}
                      placeholder="추가 메모"
                      rows={2}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setModalType('detail')}
                      className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      확정하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
