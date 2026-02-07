import { useState, useEffect } from 'react';
import { getSeasons, getRoundsBySeason, updateRound } from '../../api/seasonApi';
import { formatAmount } from '../../utils/localStorage';

export default function SeasonPriceManagement() {
  const [seasons, setSeasons] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [loading, setLoading] = useState(true);
  const [editedPrices, setEditedPrices] = useState({});
  const [editedTitles, setEditedTitles] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

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
    const result = await getSeasons();
    if (result.success && result.data.length > 0) {
      setSeasons(result.data);
      setSelectedSeason(result.data[0].id);
    }
    setLoading(false);
  };

  const loadRounds = async () => {
    const result = await getRoundsBySeason(selectedSeason);
    if (result.success) {
      // Sort by round number
      const sortedRounds = [...result.data].sort((a, b) => {
        return (a.round_number || 0) - (b.round_number || 0);
      });
      setRounds(sortedRounds);

      // Initialize edited values with current values
      const prices = {};
      const titles = {};
      sortedRounds.forEach(r => {
        prices[r.id] = (r.round_value || 0).toString();
        titles[r.id] = r.name || '';
      });
      setEditedPrices(prices);
      setEditedTitles(titles);
      setSaveSuccess(false);
    }
  };

  const handlePriceChange = (roundId, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setEditedPrices(prev => ({ ...prev, [roundId]: numericValue }));
    setSaveSuccess(false);
  };

  const handleTitleChange = (roundId, value) => {
    setEditedTitles(prev => ({ ...prev, [roundId]: value }));
    setSaveSuccess(false);
  };

  const handleSingleSave = async (roundId) => {
    setSaving(true);
    const result = await updateRound(roundId, {
      roundValue: parseInt(editedPrices[roundId]) || 0,
      name: editedTitles[roundId],
    });

    if (result.success) {
      loadRounds();
    } else {
      alert(result.error || '저장에 실패했습니다.');
    }
    setSaving(false);
  };

  const handleBulkSave = async () => {
    setSaving(true);
    let hasError = false;

    for (const round of rounds) {
      if (isRoundChanged(round)) {
        const result = await updateRound(round.id, {
          roundValue: parseInt(editedPrices[round.id]) || 0,
          name: editedTitles[round.id],
        });
        if (!result.success) {
          hasError = true;
        }
      }
    }

    if (hasError) {
      alert('일부 항목 저장에 실패했습니다.');
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    await loadRounds();
    setSaving(false);
  };

  const isRoundChanged = (round) => {
    const editedPrice = parseInt(editedPrices[round.id]) || 0;
    const editedTitle = editedTitles[round.id] || '';
    return editedPrice !== (round.round_value || 0) || editedTitle !== round.name;
  };

  const hasChanges = () => {
    return rounds.some(isRoundChanged);
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

  const selectedSeasonData = seasons.find(s => s.id === selectedSeason);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">시즌 금액 관리</h1>
          <p className="text-gray-400 text-sm mt-1">시즌별 라운드 제목과 참여비를 한눈에 관리합니다.</p>
        </div>
        <button
          onClick={handleBulkSave}
          disabled={(!hasChanges() && !saveSuccess) || saving}
          className={`px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium ${
            saveSuccess
              ? 'bg-green-600 text-white'
              : hasChanges()
                ? 'bg-ruby-600 hover:bg-ruby-700 text-white'
                : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              저장 중...
            </>
          ) : saveSuccess ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              저장 완료
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              일괄 저장
            </>
          )}
        </button>
      </div>

      {/* Season selector */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <label className="block text-sm text-gray-400 mb-2">시즌 선택</label>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="w-full sm:w-64 px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
        {selectedSeasonData && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className={`px-2 py-1 text-xs rounded-full ${
              selectedSeasonData.status === 'active' ? 'bg-green-500/20 text-green-400' :
              selectedSeasonData.status === 'ended' ? 'bg-gray-500/20 text-gray-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {selectedSeasonData.status === 'active' ? '진행중' : selectedSeasonData.status === 'ended' ? '종료' : '예정'}
            </span>
            <span className="text-gray-500">라운드 {rounds.length}개</span>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {rounds.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">전체 라운드</p>
            <p className="text-2xl font-bold text-white mt-1">{rounds.length}개</p>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">무료 라운드</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {rounds.filter(r => (r.round_value || 0) === 0).length}개
            </p>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">유료 라운드</p>
            <p className="text-2xl font-bold text-ruby-400 mt-1">
              {rounds.filter(r => (r.round_value || 0) > 0).length}개
            </p>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">전체 참여비 합계</p>
            <p className="text-2xl font-bold text-ruby-400 mt-1">
              {formatAmount(rounds.reduce((sum, r) => sum + (r.round_value || 0), 0))}
            </p>
          </div>
        </div>
      )}

      {/* Round price list */}
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
          <p className="text-gray-500 text-sm mt-2">시즌 관리 페이지에서 시즌을 먼저 생성해주세요.</p>
        </div>
      ) : rounds.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400">선택된 시즌에 등록된 라운드가 없습니다.</p>
          <p className="text-gray-500 text-sm mt-2">라운드 관리 페이지에서 라운드를 먼저 생성해주세요.</p>
        </div>
      ) : (
        <>
          {/* Mobile card layout */}
          <div className="sm:hidden space-y-3">
            {rounds.map((round) => {
              const editedPrice = parseInt(editedPrices[round.id]) || 0;
              const isChanged = isRoundChanged(round);
              return (
                <div
                  key={round.id}
                  className={`bg-dark-800 border rounded-xl p-4 ${
                    isChanged ? 'border-ruby-500/50' : 'border-dark-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-gray-400 text-sm">{round.round_number}회차</p>
                    {getStatusBadge(round.status)}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">제목</label>
                      <input
                        type="text"
                        value={editedTitles[round.id] || ''}
                        onChange={(e) => handleTitleChange(round.id, e.target.value)}
                        placeholder="라운드 제목"
                        className={`w-full px-3 py-2 bg-dark-700 border rounded-lg text-white text-sm focus:outline-none ${
                          (editedTitles[round.id] || '') !== round.name ? 'border-ruby-500/50 focus:border-ruby-500' : 'border-dark-600 focus:border-ruby-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">현재 금액</span>
                      <span className={`font-medium ${(round.round_value || 0) === 0 ? 'text-green-400' : 'text-ruby-400'}`}>
                        {(round.round_value || 0) === 0 ? '무료' : formatAmount(round.round_value)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">금액 수정 (원)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editedPrices[round.id] || ''}
                          onChange={(e) => handlePriceChange(round.id, e.target.value)}
                          placeholder="0"
                          className={`flex-1 px-3 py-2 bg-dark-700 border rounded-lg text-white text-sm focus:outline-none ${
                            editedPrice !== (round.round_value || 0) ? 'border-ruby-500/50 focus:border-ruby-500' : 'border-dark-600 focus:border-ruby-500'
                          }`}
                        />
                        <button
                          onClick={() => handleSingleSave(round.id)}
                          disabled={!isChanged || saving}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            isChanged
                              ? 'bg-ruby-600 hover:bg-ruby-700 text-white'
                              : 'bg-dark-700 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          저장
                        </button>
                      </div>
                      {editedPrice !== (round.round_value || 0) && (
                        <p className="text-ruby-400 text-xs mt-1">
                          {formatAmount(round.round_value || 0)} → {formatAmount(editedPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table layout */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">라운드</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">제목 수정</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">현재 금액</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">금액 수정</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {rounds.map((round) => {
                    const editedPrice = parseInt(editedPrices[round.id]) || 0;
                    const isChanged = isRoundChanged(round);
                    const isTitleChanged = (editedTitles[round.id] || '') !== round.name;
                    return (
                      <tr
                        key={round.id}
                        className={`transition-colors ${
                          isChanged ? 'bg-ruby-950/20' : 'hover:bg-dark-700/50'
                        }`}
                      >
                        <td className="px-4 py-4">
                          <span className="text-gray-400 text-sm">{round.round_number}회차</span>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="text"
                            value={editedTitles[round.id] || ''}
                            onChange={(e) => handleTitleChange(round.id, e.target.value)}
                            placeholder="라운드 제목"
                            className={`w-full px-3 py-1.5 bg-dark-700 border rounded-lg text-white text-sm font-medium focus:outline-none ${
                              isTitleChanged ? 'border-ruby-500/50 focus:border-ruby-500' : 'border-dark-600 focus:border-ruby-500'
                            }`}
                          />
                          {round.description && (
                            <p className="text-gray-500 text-xs mt-0.5 pl-1">{round.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {getStatusBadge(round.status)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`font-medium ${(round.round_value || 0) === 0 ? 'text-green-400' : 'text-ruby-400'}`}>
                            {(round.round_value || 0) === 0 ? '무료' : formatAmount(round.round_value)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editedPrices[round.id] || ''}
                              onChange={(e) => handlePriceChange(round.id, e.target.value)}
                              placeholder="0"
                              className={`w-32 px-3 py-1.5 bg-dark-700 border rounded-lg text-white text-sm text-right focus:outline-none ${
                                isChanged ? 'border-ruby-500/50 focus:border-ruby-500' : 'border-dark-600 focus:border-ruby-500'
                              }`}
                            />
                            {isChanged && (
                              <span className="text-ruby-400 text-xs">
                                → {formatAmount(editedPrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleSingleSave(round.id)}
                            disabled={!isChanged || saving}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              isChanged
                                ? 'bg-ruby-600 hover:bg-ruby-700 text-white'
                                : 'bg-dark-700 text-gray-600 cursor-not-allowed'
                            }`}
                          >
                            저장
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Change summary */}
          {hasChanges() && (
            <div className="bg-ruby-950/30 border border-ruby-900/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-ruby-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-ruby-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-ruby-400 text-sm font-medium">변경사항이 있습니다</p>
                  <p className="text-gray-500 text-xs">
                    {rounds.filter(isRoundChanged).length}개 라운드가 변경되었습니다.
                  </p>
                </div>
              </div>
              <button
                onClick={handleBulkSave}
                disabled={saving}
                className="px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '일괄 저장'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
