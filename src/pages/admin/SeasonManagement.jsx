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

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

const generateId = (prefix) => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
};

export default function SeasonManagement() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'detail'
  const [editingSeason, setEditingSeason] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadSeasons();
  }, []);

  const loadSeasons = () => {
    setLoading(true);
    const data = getFromStorage(STORAGE_KEYS.SEASONS, []);
    setSeasons(data);
    setLoading(false);
  };

  const getSeasonStats = (seasonId) => {
    const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
    const seasonPayments = payments.filter(p => p.seasonId === seasonId && p.status === 'success');
    const uniqueUsers = new Set(seasonPayments.map(p => p.userEmail));
    return {
      participants: uniqueUsers.size,
      totalPayments: seasonPayments.length,
      totalAmount: seasonPayments.reduce((sum, p) => sum + p.amount, 0),
    };
  };

  const getRoundCount = (seasonId) => {
    const rounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
    return rounds.filter(r => r.seasonId === seasonId).length;
  };

  const handleAddSeason = () => {
    setModalType('add');
    setEditingSeason(null);
    const nextNum = seasons.length + 1;
    setFormData({
      name: `Season ${nextNum}`,
      title: '',
      description: '',
      startDate: '',
      endDate: '',
    });
    setShowModal(true);
  };

  const handleEditSeason = (season) => {
    setModalType('edit');
    setEditingSeason(season);
    setFormData({
      name: season.name,
      title: season.title,
      description: season.description || '',
      startDate: season.startDate || '',
      endDate: season.endDate || '',
    });
    setShowModal(true);
  };

  const handleViewDetail = (season) => {
    setModalType('detail');
    setEditingSeason(season);
    setShowModal(true);
  };

  const handleSaveSeason = () => {
    const allSeasons = getFromStorage(STORAGE_KEYS.SEASONS, []);

    if (modalType === 'add') {
      const newSeason = {
        id: generateId('SEASON'),
        name: formData.name,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'active',
        isSettled: false,
        createdAt: new Date().toISOString(),
      };
      allSeasons.unshift(newSeason);
    } else {
      const index = allSeasons.findIndex(s => s.id === editingSeason.id);
      if (index !== -1) {
        allSeasons[index] = {
          ...allSeasons[index],
          name: formData.name,
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    saveToStorage(STORAGE_KEYS.SEASONS, allSeasons);
    setShowModal(false);
    loadSeasons();
  };

  const handleStatusChange = (seasonId, newStatus) => {
    const allSeasons = getFromStorage(STORAGE_KEYS.SEASONS, []);
    const index = allSeasons.findIndex(s => s.id === seasonId);
    if (index !== -1) {
      allSeasons[index].status = newStatus;
      saveToStorage(STORAGE_KEYS.SEASONS, allSeasons);
      loadSeasons();
    }
  };

  const getStatusBadge = (season) => {
    if (season.isSettled) {
      return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">정산완료</span>;
    }
    const configs = {
      active: { label: '진행중', className: 'bg-green-500/20 text-green-400' },
      ended: { label: '종료', className: 'bg-gray-500/20 text-gray-400' },
      upcoming: { label: '예정', className: 'bg-blue-500/20 text-blue-400' },
    };
    const config = configs[season.status] || configs.active;
    return <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">시즌 관리</h1>
          <p className="text-gray-400 text-sm mt-1">시즌을 생성하고 관리합니다.</p>
        </div>
        <button
          onClick={handleAddSeason}
          className="px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          시즌 추가
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">전체 시즌</p>
          <p className="text-2xl font-bold text-white mt-1">{seasons.length}개</p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">진행중</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {seasons.filter(s => s.status === 'active' && !s.isSettled).length}개
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">정산 완료</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {seasons.filter(s => s.isSettled).length}개
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">총 매출</p>
          <p className="text-2xl font-bold text-ruby-400 mt-1">
            {formatAmount(seasons.reduce((sum, s) => sum + getSeasonStats(s.id).totalAmount, 0))}
          </p>
        </div>
      </div>

      {/* 시즌 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : seasons.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">등록된 시즌이 없습니다.</p>
          <button
            onClick={handleAddSeason}
            className="mt-4 px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
          >
            첫 시즌 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {seasons.map((season) => {
            const stats = getSeasonStats(season.id);
            const roundCount = getRoundCount(season.id);
            return (
              <div
                key={season.id}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ruby-600/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-ruby-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{season.name}</h3>
                        {getStatusBadge(season)}
                      </div>
                      <p className="text-gray-400 text-sm">{season.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetail(season)}
                      className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg text-sm"
                    >
                      상세
                    </button>
                    <button
                      onClick={() => handleEditSeason(season)}
                      className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg text-sm"
                    >
                      수정
                    </button>
                    {!season.isSettled && (
                      <select
                        value={season.status}
                        onChange={(e) => handleStatusChange(season.id, e.target.value)}
                        className="px-2 py-2 bg-dark-700 border border-dark-600 text-gray-300 text-sm rounded-lg"
                      >
                        <option value="upcoming">예정</option>
                        <option value="active">진행중</option>
                        <option value="ended">종료</option>
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs">라운드</p>
                    <p className="text-white font-medium">{roundCount}개</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">참여자</p>
                    <p className="text-white font-medium">{stats.participants}명</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">결제 건수</p>
                    <p className="text-white font-medium">{stats.totalPayments}건</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">총 매출</p>
                    <p className="text-ruby-400 font-medium">{formatAmount(stats.totalAmount)}</p>
                  </div>
                </div>
                {season.startDate && season.endDate && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <p className="text-gray-500 text-sm">
                      기간: {season.startDate} ~ {season.endDate}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 추가/수정/상세 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold text-white">
                {modalType === 'add' && '시즌 추가'}
                {modalType === 'edit' && '시즌 수정'}
                {modalType === 'detail' && '시즌 상세'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {modalType === 'detail' ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">시즌 ID</span>
                    <span className="text-white font-mono text-sm">{editingSeason.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">이름</span>
                    <span className="text-white">{editingSeason.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">제목</span>
                    <span className="text-white">{editingSeason.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">상태</span>
                    {getStatusBadge(editingSeason)}
                  </div>
                  {editingSeason.description && (
                    <div>
                      <span className="text-gray-400 block mb-1">설명</span>
                      <p className="text-white text-sm">{editingSeason.description}</p>
                    </div>
                  )}
                  {editingSeason.settlementInfo && (
                    <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4 mt-4">
                      <h4 className="text-purple-400 font-medium mb-2">정산 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">정산 유형</span>
                          <span className="text-white">
                            {editingSeason.settlementInfo.settlementType === 'no_winner' ? '당첨자 없음' : '당첨자 있음'}
                          </span>
                        </div>
                        {editingSeason.settlementInfo.winningRoundId && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">당첨 라운드</span>
                            <span className="text-white">{editingSeason.settlementInfo.winningRoundId}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">정산 일시</span>
                          <span className="text-white">
                            {new Date(editingSeason.settlementInfo.settledAt).toLocaleString('ko-KR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors mt-4"
                  >
                    닫기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">시즌 이름</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="예: Season 1"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">제목</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 루비의 시작"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">시작일</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">종료일</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">설명 (선택)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="시즌 설명"
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveSeason}
                      className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
                    >
                      저장
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
