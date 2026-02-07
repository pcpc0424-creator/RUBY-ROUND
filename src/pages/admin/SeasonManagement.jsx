import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSeasons, createSeason, updateSeason, getPaymentsBySeason, getRoundsBySeason } from '../../api/seasonApi';

const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount || 0);
};

export default function SeasonManagement() {
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState([]);
  const [seasonStats, setSeasonStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' | 'edit' | 'detail'
  const [editingSeason, setEditingSeason] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    totalAmount: '',
    roundAmount: '',
  });

  // Get unique dates from seasons for filter dropdown
  const availableDates = useMemo(() => {
    const dates = new Set();
    seasons.forEach(s => {
      if (s.start_date) dates.add(s.start_date.split('T')[0]);
    });
    return Array.from(dates).sort((a, b) => new Date(b) - new Date(a));
  }, [seasons]);

  // Filter seasons by selected date
  const filteredSeasons = useMemo(() => {
    if (dateFilter === 'all') return seasons;
    return seasons.filter(s => s.start_date && s.start_date.split('T')[0] === dateFilter);
  }, [seasons, dateFilter]);

  // Group seasons by date for display
  const groupedSeasons = useMemo(() => {
    const groups = {};
    filteredSeasons.forEach(season => {
      const date = season.start_date ? season.start_date.split('T')[0] : '날짜 미지정';
      if (!groups[date]) groups[date] = [];
      groups[date].push(season);
    });
    const sortedDates = Object.keys(groups).sort((a, b) => {
      if (a === '날짜 미지정') return 1;
      if (b === '날짜 미지정') return -1;
      return new Date(b) - new Date(a);
    });
    return sortedDates.map(date => ({ date, seasons: groups[date] }));
  }, [filteredSeasons]);

  useEffect(() => {
    loadSeasons();
  }, []);

  const loadSeasons = async () => {
    setLoading(true);
    const result = await getSeasons();
    if (result.success) {
      setSeasons(result.data || []);
      // Load stats for each season
      const stats = {};
      for (const season of (result.data || [])) {
        const paymentsResult = await getPaymentsBySeason(season.id);
        const roundsResult = await getRoundsBySeason(season.id);
        const payments = paymentsResult.success ? (paymentsResult.data || []) : [];
        const rounds = roundsResult.success ? (roundsResult.data || []) : [];
        const successPayments = payments.filter(p => p.status === 'success');
        const uniqueUsers = new Set(successPayments.map(p => p.user_email || p.userEmail));
        stats[season.id] = {
          participants: uniqueUsers.size,
          totalPayments: successPayments.length,
          totalAmount: successPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
          roundCount: rounds.length,
        };
      }
      setSeasonStats(stats);
    }
    setLoading(false);
  };

  const getSeasonStat = (seasonId) => {
    return seasonStats[seasonId] || { participants: 0, totalPayments: 0, totalAmount: 0, roundCount: 0 };
  };

  const handleAddSeason = () => {
    setModalType('add');
    setEditingSeason(null);
    const nextNum = seasons.length + 1;
    setFormData({
      name: `Season ${nextNum}`,
      description: '',
      startDate: '',
      endDate: '',
      totalAmount: '',
      roundAmount: '',
    });
    setShowModal(true);
  };

  const handleEditSeason = (season) => {
    setModalType('edit');
    setEditingSeason(season);
    setFormData({
      name: season.name,
      description: season.description || '',
      startDate: season.start_date ? season.start_date.split('T')[0] : '',
      endDate: season.end_date ? season.end_date.split('T')[0] : '',
      totalAmount: season.total_amount || '',
      roundAmount: season.round_amount || '',
    });
    setShowModal(true);
  };

  const handleViewDetail = (season) => {
    setModalType('detail');
    setEditingSeason(season);
    setShowModal(true);
  };

  const handleSaveSeason = async () => {
    const seasonData = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalAmount: formData.totalAmount ? parseInt(formData.totalAmount) : null,
      roundAmount: formData.roundAmount ? parseInt(formData.roundAmount) : null,
    };

    if (modalType === 'add') {
      const result = await createSeason(seasonData);
      if (!result.success) {
        alert(result.error || '시즌 생성에 실패했습니다.');
        return;
      }
    } else {
      const result = await updateSeason(editingSeason.id, seasonData);
      if (!result.success) {
        alert(result.error || '시즌 수정에 실패했습니다.');
        return;
      }
    }

    setShowModal(false);
    loadSeasons();
  };

  const handleStatusChange = async (seasonId, newStatus) => {
    const result = await updateSeason(seasonId, { status: newStatus });
    if (result.success) {
      loadSeasons();
    } else {
      alert(result.error || '상태 변경에 실패했습니다.');
    }
  };

  const getStatusBadge = (season) => {
    if (season.is_settled) {
      return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">정산완료</span>;
    }
    const configs = {
      active: { label: '진행중', className: 'bg-green-500/20 text-green-400' },
      ended: { label: '종료', className: 'bg-gray-500/20 text-gray-400' },
      upcoming: { label: '예정', className: 'bg-blue-500/20 text-blue-400' },
    };
    const config = configs[season.status] || configs.upcoming;
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
        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-dark-700 border border-dark-600 text-white text-sm rounded-lg focus:border-ruby-500 focus:outline-none"
          >
            <option value="all">전체 날짜</option>
            {availableDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
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
            {seasons.filter(s => s.status === 'active' && !s.is_settled).length}개
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">정산 완료</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {seasons.filter(s => s.is_settled).length}개
          </p>
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
          <p className="text-gray-400 text-sm">총 매출</p>
          <p className="text-2xl font-bold text-ruby-400 mt-1">
            {formatAmount(seasons.reduce((sum, s) => sum + getSeasonStat(s.id).totalAmount, 0))}
          </p>
        </div>
      </div>

      {/* 시즌 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : filteredSeasons.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">
            {dateFilter === 'all' ? '등록된 시즌이 없습니다.' : `${dateFilter}에 해당하는 시즌이 없습니다.`}
          </p>
          <button
            onClick={handleAddSeason}
            className="mt-4 px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
          >
            첫 시즌 만들기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSeasons.map((group) => (
            <div key={group.date} className="space-y-4">
              {dateFilter === 'all' && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-dark-600" />
                  <span className="text-gray-400 text-sm font-medium px-3 py-1 bg-dark-700 rounded-full">
                    {group.date}
                  </span>
                  <div className="h-px flex-1 bg-dark-600" />
                </div>
              )}

              {group.seasons.map((season) => {
                const stats = getSeasonStat(season.id);
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
                          <p className="text-gray-400 text-sm">{season.description || '설명 없음'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => navigate(`/admin/seasons/${season.id}`)}
                          className="px-3 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg text-sm flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          상세 관리
                        </button>
                        <button
                          onClick={() => handleViewDetail(season)}
                          className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg text-sm"
                        >
                          정보
                        </button>
                        <button
                          onClick={() => handleEditSeason(season)}
                          className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg text-sm"
                        >
                          수정
                        </button>
                        {!season.is_settled && (
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
                        <p className="text-white font-medium">{stats.roundCount}개</p>
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
                    {season.start_date && season.end_date && (
                      <div className="mt-4 pt-4 border-t border-dark-600">
                        <p className="text-gray-500 text-sm">
                          기간: {season.start_date.split('T')[0]} ~ {season.end_date.split('T')[0]}
                        </p>
                      </div>
                    )}
                    {(season.total_amount || season.round_amount) && (
                      <div className="mt-2 flex gap-4 text-sm">
                        {season.total_amount && (
                          <span className="text-gray-400">총액: {formatAmount(season.total_amount)}</span>
                        )}
                        {season.round_amount && (
                          <span className="text-gray-400">회차당: {formatAmount(season.round_amount)}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
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
                    <span className="text-gray-400">상태</span>
                    {getStatusBadge(editingSeason)}
                  </div>
                  {editingSeason.description && (
                    <div>
                      <span className="text-gray-400 block mb-1">설명</span>
                      <p className="text-white text-sm">{editingSeason.description}</p>
                    </div>
                  )}
                  {editingSeason.total_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">총액</span>
                      <span className="text-white">{formatAmount(editingSeason.total_amount)}</span>
                    </div>
                  )}
                  {editingSeason.round_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">회차당 금액</span>
                      <span className="text-white">{formatAmount(editingSeason.round_amount)}</span>
                    </div>
                  )}
                  {editingSeason.is_settled && (
                    <div className="bg-purple-900/20 border border-purple-900/50 rounded-lg p-4 mt-4">
                      <h4 className="text-purple-400 font-medium mb-2">정산 완료</h4>
                      <p className="text-gray-400 text-sm">
                        정산일: {editingSeason.settled_at ? new Date(editingSeason.settled_at).toLocaleString('ko-KR') : '-'}
                      </p>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">총액 (원)</label>
                      <input
                        type="number"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        placeholder="예: 10000000"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">회차당 금액 (원)</label>
                      <input
                        type="number"
                        value={formData.roundAmount}
                        onChange={(e) => setFormData({ ...formData, roundAmount: e.target.value })}
                        placeholder="예: 50000"
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
