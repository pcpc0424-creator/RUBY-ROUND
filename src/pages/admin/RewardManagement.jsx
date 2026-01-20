import { useState, useEffect } from 'react';
import {
  getRewards,
  createReward,
  updateRewardStatus,
  confirmRewardConfiguration,
  handleRewardException,
  getAdminAuth,
  createAuditLog,
} from '../../api/exchangeApi';
import { REWARD_STATUS, REWARD_TYPE } from '../../constants/exchangeConstants';
import { formatAmount } from '../../utils/localStorage';

export default function RewardManagement() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'detail' | 'create' | 'status' | 'config' | 'exception'
  const [newReward, setNewReward] = useState({
    userId: '',
    userName: '',
    type: 'cash',
    amount: '',
    description: '',
    roundId: '',
  });
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '' });
  const [configData, setConfigData] = useState({ configuration: '', note: '' });
  const [exceptionData, setExceptionData] = useState({ type: '', description: '', resolution: '' });
  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';

  useEffect(() => {
    loadRewards();
  }, [filters]);

  const loadRewards = async () => {
    setLoading(true);
    const result = await getRewards(filters);
    if (result.success) {
      setRewards(result.data);
    }
    setLoading(false);
  };

  const handleViewDetail = (reward) => {
    setSelectedReward(reward);
    setModalType('detail');
    setShowModal(true);
  };

  const handleCreateReward = async () => {
    if (!newReward.userId || !newReward.amount) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    const result = await createReward(
      {
        ...newReward,
        amount: parseInt(newReward.amount),
      },
      auth?.name || 'Admin'
    );

    if (result.success) {
      await createAuditLog({
        action: 'create',
        targetType: 'reward',
        targetId: result.data.id,
        details: `보상 생성: ${newReward.userName} - ${formatAmount(newReward.amount)}`,
        adminName: auth?.name || 'Admin',
      });
      alert('보상이 생성되었습니다.');
      closeModal();
      loadRewards();
    } else {
      alert(result.error || '보상 생성에 실패했습니다.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusUpdate.status) {
      alert('상태를 선택해주세요.');
      return;
    }

    const result = await updateRewardStatus(
      selectedReward.id,
      statusUpdate.status,
      auth?.name || 'Admin',
      statusUpdate.note
    );

    if (result.success) {
      await createAuditLog({
        action: 'update',
        targetType: 'reward',
        targetId: selectedReward.id,
        details: `보상 상태 변경: ${REWARD_STATUS[statusUpdate.status]?.label}`,
        adminName: auth?.name || 'Admin',
      });
      alert('상태가 변경되었습니다.');
      closeModal();
      loadRewards();
    } else {
      alert(result.error || '상태 변경에 실패했습니다.');
    }
  };

  const handleConfirmConfig = async () => {
    if (!configData.configuration) {
      alert('구성 정보를 입력해주세요.');
      return;
    }

    const result = await confirmRewardConfiguration(
      selectedReward.id,
      configData.configuration,
      auth?.name || 'Admin'
    );

    if (result.success) {
      await createAuditLog({
        action: 'update',
        targetType: 'reward',
        targetId: selectedReward.id,
        details: '보상 구성 확정',
        adminName: auth?.name || 'Admin',
      });
      alert('구성이 확정되었습니다.');
      closeModal();
      loadRewards();
    } else {
      alert(result.error || '구성 확정에 실패했습니다.');
    }
  };

  const handleException = async () => {
    if (!exceptionData.type || !exceptionData.description) {
      alert('예외 정보를 입력해주세요.');
      return;
    }

    const result = await handleRewardException(
      selectedReward.id,
      exceptionData,
      auth?.name || 'Admin'
    );

    if (result.success) {
      await createAuditLog({
        action: 'exception',
        targetType: 'reward',
        targetId: selectedReward.id,
        details: `예외 처리: ${exceptionData.type}`,
        adminName: auth?.name || 'Admin',
      });
      alert('예외가 처리되었습니다.');
      closeModal();
      loadRewards();
    } else {
      alert(result.error || '예외 처리에 실패했습니다.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReward(null);
    setModalType('');
    setNewReward({
      userId: '',
      userName: '',
      type: 'cash',
      amount: '',
      description: '',
      roundId: '',
    });
    setStatusUpdate({ status: '', note: '' });
    setConfigData({ configuration: '', note: '' });
    setExceptionData({ type: '', description: '', resolution: '' });
  };

  const getStatusBadge = (status) => {
    const statusInfo = REWARD_STATUS[status] || { label: status, color: 'gray' };
    const colorMap = {
      yellow: 'bg-yellow-500/20 text-yellow-400',
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      red: 'bg-red-500/20 text-red-400',
      gray: 'bg-gray-500/20 text-gray-400',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorMap[statusInfo.color] || colorMap.gray}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeInfo = REWARD_TYPE[type] || { label: type };
    const colorMap = {
      cash: 'bg-green-500/20 text-green-400',
      product: 'bg-blue-500/20 text-blue-400',
      coupon: 'bg-purple-500/20 text-purple-400',
      point: 'bg-yellow-500/20 text-yellow-400',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorMap[type] || 'bg-gray-500/20 text-gray-400'}`}>
        {typeInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">당첨 상품/보상 지급</h1>
          <p className="text-gray-400 text-sm mt-1">전체 {rewards.length}건</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setModalType('create');
              setShowModal(true);
            }}
            className="px-3 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">보상 생성</span>
          </button>
          <button
            onClick={loadRewards}
            className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
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
              placeholder="사용자명, 설명"
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
              {Object.entries(REWARD_STATUS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">유형</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {Object.entries(REWARD_TYPE).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', type: '', search: '' })}
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
      ) : rewards.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <p className="text-gray-400">보상 기록이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 */}
          <div className="sm:hidden space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                onClick={() => handleViewDetail(reward)}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4 active:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">{reward.userName}</p>
                    <p className="text-ruby-400 font-bold">{formatAmount(reward.amount)}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getStatusBadge(reward.status)}
                    {getTypeBadge(reward.type)}
                  </div>
                </div>
                <p className="text-gray-500 text-sm truncate">{reward.description || '-'}</p>
              </div>
            ))}
          </div>

          {/* PC 테이블 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">수령자</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">유형</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">금액</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">설명</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">생성일</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {rewards.map((reward) => (
                    <tr key={reward.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <span className="text-white font-medium">{reward.userName}</span>
                          <p className="text-gray-500 text-xs">{reward.userId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getTypeBadge(reward.type)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-ruby-400 font-medium">{formatAmount(reward.amount)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(reward.status)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-sm truncate max-w-xs block">
                          {reward.description || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-400 text-sm">
                          {new Date(reward.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleViewDetail(reward)}
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

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold text-white">
                {modalType === 'detail' && '보상 상세'}
                {modalType === 'create' && '보상 생성'}
                {modalType === 'status' && '상태 변경'}
                {modalType === 'config' && '구성 확정'}
                {modalType === 'exception' && '예외 처리'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {/* 보상 상세 */}
              {modalType === 'detail' && selectedReward && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">수령자</span>
                      <span className="text-white font-medium">{selectedReward.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">유형</span>
                      {getTypeBadge(selectedReward.type)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">금액</span>
                      <span className="text-ruby-400 font-bold">{formatAmount(selectedReward.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">상태</span>
                      {getStatusBadge(selectedReward.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">생성일</span>
                      <span className="text-white">{new Date(selectedReward.createdAt).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>

                  {selectedReward.description && (
                    <div className="bg-dark-700/50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">설명</h3>
                      <p className="text-white text-sm">{selectedReward.description}</p>
                    </div>
                  )}

                  {selectedReward.configuration && (
                    <div className="bg-dark-700/50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">구성 정보</h3>
                      <p className="text-white text-sm whitespace-pre-wrap">{selectedReward.configuration}</p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex flex-wrap gap-2">
                    {selectedReward.status !== 'completed' && selectedReward.status !== 'cancelled' && (
                      <button
                        onClick={() => setModalType('status')}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        상태 변경
                      </button>
                    )}
                    {selectedReward.status === 'pending' && (
                      <button
                        onClick={() => setModalType('config')}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        구성 확정
                      </button>
                    )}
                    <button
                      onClick={() => setModalType('exception')}
                      className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm"
                    >
                      예외 처리
                    </button>
                  </div>
                </div>
              )}

              {/* 보상 생성 */}
              {modalType === 'create' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">수령자 ID/이메일 *</label>
                    <input
                      type="text"
                      value={newReward.userId}
                      onChange={(e) => setNewReward({ ...newReward, userId: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">수령자 이름</label>
                    <input
                      type="text"
                      value={newReward.userName}
                      onChange={(e) => setNewReward({ ...newReward, userName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">유형</label>
                    <select
                      value={newReward.type}
                      onChange={(e) => setNewReward({ ...newReward, type: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    >
                      {Object.entries(REWARD_TYPE).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">금액 *</label>
                    <input
                      type="number"
                      value={newReward.amount}
                      onChange={(e) => setNewReward({ ...newReward, amount: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
                    <textarea
                      value={newReward.description}
                      onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleCreateReward}
                      className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
                    >
                      생성하기
                    </button>
                  </div>
                </div>
              )}

              {/* 상태 변경 */}
              {modalType === 'status' && selectedReward && (
                <div className="space-y-4">
                  <div className="bg-dark-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400">현재 상태</p>
                    <div className="mt-1">{getStatusBadge(selectedReward.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">변경할 상태</label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    >
                      <option value="">선택하세요</option>
                      {Object.entries(REWARD_STATUS).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">메모</label>
                    <textarea
                      value={statusUpdate.note}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
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
                      onClick={handleUpdateStatus}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      변경하기
                    </button>
                  </div>
                </div>
              )}

              {/* 구성 확정 */}
              {modalType === 'config' && selectedReward && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">구성 정보 *</label>
                    <textarea
                      value={configData.configuration}
                      onChange={(e) => setConfigData({ ...configData, configuration: e.target.value })}
                      placeholder="보상 구성 상세 (예: 루비 1캐럿, 배송 옵션 등)"
                      rows={4}
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
                      onClick={handleConfirmConfig}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      확정하기
                    </button>
                  </div>
                </div>
              )}

              {/* 예외 처리 */}
              {modalType === 'exception' && selectedReward && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">예외 유형 *</label>
                    <select
                      value={exceptionData.type}
                      onChange={(e) => setExceptionData({ ...exceptionData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    >
                      <option value="">선택하세요</option>
                      <option value="refund">환불 요청</option>
                      <option value="change">변경 요청</option>
                      <option value="delay">지연 사유</option>
                      <option value="cancel">취소 요청</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">상세 설명 *</label>
                    <textarea
                      value={exceptionData.description}
                      onChange={(e) => setExceptionData({ ...exceptionData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">해결 방안</label>
                    <textarea
                      value={exceptionData.resolution}
                      onChange={(e) => setExceptionData({ ...exceptionData, resolution: e.target.value })}
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
                      onClick={handleException}
                      className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                      처리하기
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
