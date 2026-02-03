import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

export default function SeasonDetail() {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const [season, setSeason] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRounds, setEditingRounds] = useState({});
  const [seasonStatus, setSeasonStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSeasonData();
  }, [seasonId]);

  const loadSeasonData = () => {
    setLoading(true);

    const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
    const foundSeason = seasons.find(s => s.id === seasonId);

    if (!foundSeason) {
      setLoading(false);
      return;
    }

    setSeason(foundSeason);
    setSeasonStatus(foundSeason.status || 'active');

    const allRounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
    const seasonRounds = allRounds.filter(r => r.seasonId === seasonId);

    // Sort by round number
    seasonRounds.sort((a, b) => {
      const numA = parseInt(a.number?.replace(/[^0-9]/g, '') || a.id?.replace(/[^0-9]/g, '') || '0');
      const numB = parseInt(b.number?.replace(/[^0-9]/g, '') || b.id?.replace(/[^0-9]/g, '') || '0');
      return numA - numB;
    });

    setRounds(seasonRounds);

    // Initialize editing state
    const initialEditing = {};
    seasonRounds.forEach(r => {
      initialEditing[r.id] = {
        title: r.title || '',
        price: r.price || 0,
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
      const seasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
      const seasonIndex = seasons.findIndex(s => s.id === seasonId);
      if (seasonIndex !== -1) {
        seasons[seasonIndex] = {
          ...seasons[seasonIndex],
          status: seasonStatus,
          updatedAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.SEASONS, seasons);
      }

      // Update rounds
      const allRounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
      Object.keys(editingRounds).forEach(roundId => {
        const roundIndex = allRounds.findIndex(r => r.id === roundId);
        if (roundIndex !== -1) {
          allRounds[roundIndex] = {
            ...allRounds[roundIndex],
            title: editingRounds[roundId].title,
            price: editingRounds[roundId].price,
            status: editingRounds[roundId].status,
            updatedAt: new Date().toISOString(),
          };
        }
      });
      saveToStorage(STORAGE_KEYS.ROUNDS, allRounds);

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
    const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
    const roundPayments = payments.filter(p =>
      p.roundId === roundId &&
      p.seasonId === seasonId &&
      p.status === 'success'
    );
    return {
      participants: roundPayments.length,
      totalAmount: roundPayments.reduce((sum, p) => sum + p.amount, 0),
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
            <p className="text-gray-400 text-sm mt-1">{season.title || '시즌 상세 관리'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-yellow-400 text-sm">변경사항 있음</span>
          )}
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
            <p className="text-white font-mono text-sm">{season.id}</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">라운드 수</p>
            <p className="text-white font-medium">{rounds.length}개</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">시작일</p>
            <p className="text-white font-medium">{season.startDate || '-'}</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">종료일</p>
            <p className="text-white font-medium">{season.endDate || '-'}</p>
          </div>
        </div>
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
              onClick={() => navigate('/admin/rounds')}
              className="mt-4 px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
            >
              라운드 관리로 이동
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

                  return (
                    <tr key={round.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{round.number || round.id}</span>
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
                          {formatAmount(round.price || 0)}
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
              {Object.values(editingRounds).filter(r => r.status === 'active').length}개
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
    </div>
  );
}
