import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeasonDetail, getRoundsBySeason, updateSeason, updateRound, createRound, getPaymentsBySeason } from '../../api/seasonApi';

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount || 0);
};

export default function SeasonDetail() {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const [season, setSeason] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRounds, setEditingRounds] = useState({});
  const [seasonStatus, setSeasonStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddRoundModal, setShowAddRoundModal] = useState(false);
  const [newRound, setNewRound] = useState({ number: '', title: '', price: '' });

  useEffect(() => {
    loadSeasonData();
  }, [seasonId]);

  const loadSeasonData = async () => {
    setLoading(true);

    // Load season
    const seasonResult = await getSeasonDetail(seasonId);
    if (!seasonResult.success || !seasonResult.data) {
      setLoading(false);
      return;
    }

    setSeason(seasonResult.data);
    setSeasonStatus(seasonResult.data.status || 'upcoming');

    // Load rounds
    const roundsResult = await getRoundsBySeason(seasonId);
    const seasonRounds = roundsResult.success ? (roundsResult.data || []) : [];

    // Sort by round number
    seasonRounds.sort((a, b) => {
      const numA = parseInt(a.round_number || a.number || '0');
      const numB = parseInt(b.round_number || b.number || '0');
      return numA - numB;
    });

    setRounds(seasonRounds);

    // Load payments for stats
    const paymentsResult = await getPaymentsBySeason(seasonId);
    setPayments(paymentsResult.success ? (paymentsResult.data || []) : []);

    // Initialize editing state
    const initialEditing = {};
    seasonRounds.forEach(r => {
      initialEditing[r.id] = {
        title: r.title || '',
        price: r.price || r.amount || 0,
        status: r.status || 'upcoming',
      };
    });
    setEditingRounds(initialEditing);
    setHasChanges(false);
    setLoading(false);
  };

  const handleRoundChange = (roundId, field, value) => {
    setEditingRounds(prev => ({
      ...prev,
      [roundId]: {
        ...prev[roundId],
        [field]: field === 'price' ? parseInt(value) || 0 : value,
      }
    }));
    setHasChanges(true);
  };

  const handleSeasonStatusChange = (newStatus) => {
    setSeasonStatus(newStatus);
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      // Update season status
      const seasonResult = await updateSeason(seasonId, { status: seasonStatus });
      if (!seasonResult.success) {
        alert(seasonResult.error || '시즌 저장 실패');
        setIsSaving(false);
        return;
      }

      // Update rounds
      for (const roundId of Object.keys(editingRounds)) {
        const editing = editingRounds[roundId];
        const result = await updateRound(roundId, {
          title: editing.title,
          price: editing.price,
          status: editing.status,
        });
        if (!result.success) {
          console.error(`라운드 ${roundId} 저장 실패:`, result.error);
        }
      }

      setHasChanges(false);
      alert('저장되었습니다.');
      loadSeasonData();
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRound = async () => {
    if (!newRound.number) {
      alert('라운드 번호를 입력해주세요.');
      return;
    }

    const result = await createRound(seasonId, {
      roundNumber: parseInt(newRound.number),
      title: newRound.title || `${newRound.number}회차`,
      price: parseInt(newRound.price) || 0,
      status: 'upcoming',
    });

    if (result.success) {
      setShowAddRoundModal(false);
      setNewRound({ number: '', title: '', price: '' });
      loadSeasonData();
    } else {
      alert(result.error || '라운드 추가 실패');
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      active: { label: '진행중', className: 'bg-green-500/20 text-green-400' },
      ended: { label: '종료', className: 'bg-gray-500/20 text-gray-400' },
      completed: { label: '종료', className: 'bg-gray-500/20 text-gray-400' },
      upcoming: { label: '예정', className: 'bg-blue-500/20 text-blue-400' },
    };
    const config = configs[status] || configs.upcoming;
    return <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>{config.label}</span>;
  };

  const getRoundStats = (roundId) => {
    const roundPayments = payments.filter(p =>
      (p.round_id === roundId || p.roundId === roundId) &&
      p.status === 'success'
    );
    return {
      participants: roundPayments.length,
      totalAmount: roundPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="space-y-4">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 text-center">
          <p className="text-gray-400">시즌 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/admin/seasons')}
            className="mt-4 px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
          >
            시즌 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/seasons')}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{season.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{season.description || '시즌 상세 관리'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-yellow-400 text-sm">변경사항 있음</span>
          )}
          <button
            onClick={() => setShowAddRoundModal(true)}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            라운드 추가
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving || !hasChanges}
            className={`px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center gap-2 ${
              (isSaving || !hasChanges) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                저장 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                일괄 저장
              </>
            )}
          </button>
        </div>
      </div>

      {/* 시즌 기본 정보 카드 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-ruby-500 rotate-45" />
            시즌 기본 정보
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">시즌 상태:</span>
            <select
              value={seasonStatus}
              onChange={(e) => handleSeasonStatusChange(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 text-white text-sm rounded-lg focus:border-ruby-500 focus:outline-none"
            >
              <option value="upcoming">예정</option>
              <option value="active">진행중</option>
              <option value="ended">종료</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">시즌 ID</p>
            <p className="text-white font-mono text-sm truncate">{season.id}</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">라운드 수</p>
            <p className="text-white font-medium">{rounds.length}개</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">시작일</p>
            <p className="text-white font-medium">{season.start_date ? season.start_date.split('T')[0] : '-'}</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">종료일</p>
            <p className="text-white font-medium">{season.end_date ? season.end_date.split('T')[0] : '-'}</p>
          </div>
        </div>
        {(season.total_amount || season.round_amount) && (
          <div className="mt-4 pt-4 border-t border-dark-600 flex gap-6">
            {season.total_amount && (
              <div>
                <span className="text-gray-500 text-sm">총액: </span>
                <span className="text-white font-medium">{formatAmount(season.total_amount)}</span>
              </div>
            )}
            {season.round_amount && (
              <div>
                <span className="text-gray-500 text-sm">회차당: </span>
                <span className="text-white font-medium">{formatAmount(season.round_amount)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 라운드 관리 테이블 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-dark-600">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-ruby-500 rotate-45" />
            라운드별 금액/상태 관리
          </h2>
          <p className="text-gray-400 text-sm mt-1">각 라운드의 제목, 금액, 상태를 수정하고 일괄 저장할 수 있습니다.</p>
        </div>

        {rounds.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-400">등록된 라운드가 없습니다.</p>
            <button
              onClick={() => setShowAddRoundModal(true)}
              className="mt-4 px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
            >
              첫 라운드 추가하기
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">라운드</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">제목</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">현재금액</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">금액수정</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">참여자</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">매출</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-600">
                {rounds.map((round) => {
                  const stats = getRoundStats(round.id);
                  const editing = editingRounds[round.id] || {};
                  const roundNumber = round.round_number || round.number || round.id;

                  return (
                    <tr key={round.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{roundNumber}회차</span>
                          {getStatusBadge(round.status)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          value={editing.title || ''}
                          onChange={(e) => handleRoundChange(round.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:border-ruby-500 focus:outline-none"
                          placeholder="라운드 제목"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-sm">
                          {formatAmount(round.price || round.amount || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 text-sm">₩</span>
                          <input
                            type="number"
                            value={editing.price || 0}
                            onChange={(e) => handleRoundChange(round.id, 'price', e.target.value)}
                            className="w-28 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:border-ruby-500 focus:outline-none"
                            min="0"
                            step="10000"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={editing.status || 'upcoming'}
                          onChange={(e) => handleRoundChange(round.id, 'status', e.target.value)}
                          className="px-3 py-2 bg-dark-700 border border-dark-600 text-white text-sm rounded-lg focus:border-ruby-500 focus:outline-none"
                        >
                          <option value="upcoming">예정</option>
                          <option value="active">진행중</option>
                          <option value="completed">종료</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-white text-sm">{stats.participants}명</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-ruby-400 text-sm font-medium">
                          {formatAmount(stats.totalAmount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 시즌 통계 요약 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-ruby-500 rotate-45" />
          시즌 통계 요약
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">총 라운드</p>
            <p className="text-2xl font-bold text-white">{rounds.length}개</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">진행중 라운드</p>
            <p className="text-2xl font-bold text-green-400">
              {rounds.filter(r => r.status === 'active').length}개
            </p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">총 참여자</p>
            <p className="text-2xl font-bold text-white">
              {rounds.reduce((sum, r) => sum + getRoundStats(r.id).participants, 0)}명
            </p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">총 매출</p>
            <p className="text-2xl font-bold text-ruby-400">
              {formatAmount(rounds.reduce((sum, r) => sum + getRoundStats(r.id).totalAmount, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 고정 저장 버튼 (모바일) */}
      {hasChanges && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                저장 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                변경사항 저장
              </>
            )}
          </button>
        </div>
      )}

      {/* 라운드 추가 모달 */}
      {showAddRoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddRoundModal(false)} />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">라운드 추가</h2>
              <button onClick={() => setShowAddRoundModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">라운드 번호 *</label>
                <input
                  type="number"
                  value={newRound.number}
                  onChange={(e) => setNewRound({ ...newRound, number: e.target.value })}
                  placeholder="예: 1"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">제목 (선택)</label>
                <input
                  type="text"
                  value={newRound.title}
                  onChange={(e) => setNewRound({ ...newRound, title: e.target.value })}
                  placeholder="예: 1회차"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">금액 (원)</label>
                <input
                  type="number"
                  value={newRound.price}
                  onChange={(e) => setNewRound({ ...newRound, price: e.target.value })}
                  placeholder="예: 50000"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddRoundModal(false)}
                  className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddRound}
                  className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
