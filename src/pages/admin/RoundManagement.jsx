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

export default function RoundManagement() {
  const [rounds, setRounds] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit'
  const [editingRound, setEditingRound] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    price: '',
    status: 'upcoming',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      loadRounds();
    }
  }, [selectedSeason]);

  const loadData = async () => {
    setLoading(true);
    const seasonsData = getFromStorage(STORAGE_KEYS.SEASONS, []);
    setSeasons(seasonsData);
    if (seasonsData.length > 0) {
      setSelectedSeason(seasonsData[0].id);
    }
    setLoading(false);
  };

  const loadRounds = () => {
    const allRounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
    const seasonRounds = allRounds.filter(r => r.seasonId === selectedSeason);
    // Sort by round number
    seasonRounds.sort((a, b) => {
      const numA = parseInt(a.id.replace('R', ''));
      const numB = parseInt(b.id.replace('R', ''));
      return numA - numB;
    });
    setRounds(seasonRounds);
  };

  const getPaymentStats = (roundId) => {
    const payments = getFromStorage(STORAGE_KEYS.ROUND_PAYMENTS, []);
    const roundPayments = payments.filter(p => p.roundId === roundId && p.status === 'success');
    return {
      count: roundPayments.length,
      total: roundPayments.reduce((sum, p) => sum + p.amount, 0),
    };
  };

  const handleStatusChange = (roundId, newStatus) => {
    const allRounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);
    const index = allRounds.findIndex(r => r.id === roundId);
    if (index !== -1) {
      allRounds[index].status = newStatus;
      saveToStorage(STORAGE_KEYS.ROUNDS, allRounds);
      loadRounds();
    }
  };

  const handleAddRound = () => {
    setModalType('add');
    setEditingRound(null);
    setFormData({
      number: `Round ${rounds.length + 1}`,
      title: '',
      price: '',
      status: 'upcoming',
      description: '',
    });
    setShowModal(true);
  };

  const handleEditRound = (round) => {
    setModalType('edit');
    setEditingRound(round);
    setFormData({
      number: round.number,
      title: round.title,
      price: round.price.toString(),
      status: round.status,
      description: round.description || '',
    });
    setShowModal(true);
  };

  const handleSaveRound = () => {
    const allRounds = getFromStorage(STORAGE_KEYS.ROUNDS, []);

    if (modalType === 'add') {
      const newRound = {
        id: `R${rounds.length + 1}`,
        seasonId: selectedSeason,
        number: formData.number,
        title: formData.title,
        price: parseInt(formData.price) || 0,
        status: formData.status,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };
      allRounds.push(newRound);
    } else {
      const index = allRounds.findIndex(r => r.id === editingRound.id);
      if (index !== -1) {
        allRounds[index] = {
          ...allRounds[index],
          number: formData.number,
          title: formData.title,
          price: parseInt(formData.price) || 0,
          status: formData.status,
          description: formData.description,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    saveToStorage(STORAGE_KEYS.ROUNDS, allRounds);
    setShowModal(false);
    loadRounds();
  };

  const getStatusBadge = (status) => {
    const configs = {
      completed: { label: '종료', className: 'bg-gray-500/20 text-gray-400' },
      active: { label: '진행중', className: 'bg-green-500/20 text-green-400' },
      upcoming: { label: '예정', className: 'bg-blue-500/20 text-blue-400' },
    };
    const config = configs[status] || configs.upcoming;
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
          <h1 className="text-xl sm:text-2xl font-bold text-white">라운드 관리</h1>
          <p className="text-gray-400 text-sm mt-1">시즌별 라운드를 관리합니다.</p>
        </div>
        <button
          onClick={handleAddRound}
          disabled={!selectedSeason}
          className="px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          라운드 추가
        </button>
      </div>

      {/* 시즌 선택 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <label className="block text-sm text-gray-400 mb-2">시즌 선택</label>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="w-full sm:w-64 px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name} - {season.title}
            </option>
          ))}
        </select>
      </div>

      {/* 라운드 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : rounds.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400">등록된 라운드가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 레이아웃 */}
          <div className="sm:hidden space-y-3">
            {rounds.map((round) => {
              const stats = getPaymentStats(round.id);
              return (
                <div
                  key={round.id}
                  className="bg-dark-800 border border-dark-600 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-gray-400 text-sm">{round.number}</p>
                      <p className="text-white font-medium">{round.title}</p>
                    </div>
                    {getStatusBadge(round.status)}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-500">참여비</span>
                    <span className="text-ruby-400 font-medium">
                      {round.price === 0 ? '무료' : formatAmount(round.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">참여자</span>
                    <span className="text-white">{stats.count}명 ({formatAmount(stats.total)})</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRound(round)}
                      className="flex-1 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg text-sm"
                    >
                      수정
                    </button>
                    <select
                      value={round.status}
                      onChange={(e) => handleStatusChange(round.id, e.target.value)}
                      className="flex-1 py-2 bg-dark-700 border border-dark-600 text-gray-300 rounded-lg text-sm"
                    >
                      <option value="upcoming">예정</option>
                      <option value="active">진행중</option>
                      <option value="completed">종료</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PC 테이블 레이아웃 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">라운드</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">제목</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">참여비</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">참여자</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">매출</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {rounds.map((round) => {
                    const stats = getPaymentStats(round.id);
                    return (
                      <tr key={round.id} className="hover:bg-dark-700/50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-gray-400 text-sm">{round.number}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-white font-medium">{round.title}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`font-medium ${round.price === 0 ? 'text-green-400' : 'text-ruby-400'}`}>
                            {round.price === 0 ? '무료' : formatAmount(round.price)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {getStatusBadge(round.status)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-white">{stats.count}명</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-ruby-400">{formatAmount(stats.total)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditRound(round)}
                              className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 text-sm rounded transition-colors"
                            >
                              수정
                            </button>
                            <select
                              value={round.status}
                              onChange={(e) => handleStatusChange(round.id, e.target.value)}
                              className="px-2 py-1 bg-dark-700 border border-dark-600 text-gray-300 text-sm rounded"
                            >
                              <option value="upcoming">예정</option>
                              <option value="active">진행중</option>
                              <option value="completed">종료</option>
                            </select>
                          </div>
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

      {/* 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {modalType === 'add' ? '라운드 추가' : '라운드 수정'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">라운드 번호</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="예: Round 1"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 체험 라운드"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">참여비 (원)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">상태</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                >
                  <option value="upcoming">예정</option>
                  <option value="active">진행중</option>
                  <option value="completed">종료</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">설명 (선택)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="라운드 설명"
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
                  onClick={handleSaveRound}
                  className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
