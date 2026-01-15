import { useState, useEffect } from 'react';
import {
  getUsers,
  getUserDetail,
  updateUserStatus,
  chargeUserBalance,
  deductUserBalance,
  getUserStatistics,
  initializeSampleUsers,
} from '../../api/exchangeApi';
import { formatAmount, getRelativeTime } from '../../utils/localStorage';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'detail' | 'charge' | 'deduct'
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceDescription, setBalanceDescription] = useState('');

  useEffect(() => {
    initializeSampleUsers();
    loadUsers();
    loadStats();
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getUsers(filters);
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const result = await getUserStatistics();
    if (result.success) {
      setStats(result.data);
    }
  };

  const handleViewDetail = async (user) => {
    const result = await getUserDetail(user.email);
    if (result.success) {
      setSelectedUser(result.data);
      setModalType('detail');
      setShowModal(true);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    const result = await updateUserStatus(userId, newStatus);
    if (result.success) {
      loadUsers();
      loadStats();
      if (selectedUser) {
        const updated = await getUserDetail(selectedUser.email);
        if (updated.success) setSelectedUser(updated.data);
      }
    }
  };

  const handleChargeBalance = async () => {
    const amount = parseInt(balanceAmount);
    if (!amount || amount <= 0) {
      alert('충전 금액을 입력해주세요.');
      return;
    }
    const result = await chargeUserBalance(selectedUser.email, amount, balanceDescription);
    if (result.success) {
      alert(`${formatAmount(amount)} 충전 완료`);
      const updated = await getUserDetail(selectedUser.email);
      if (updated.success) setSelectedUser(updated.data);
      setBalanceAmount('');
      setBalanceDescription('');
      setModalType('detail');
      loadStats();
    } else {
      alert(result.error);
    }
  };

  const handleDeductBalance = async () => {
    const amount = parseInt(balanceAmount);
    if (!amount || amount <= 0) {
      alert('차감 금액을 입력해주세요.');
      return;
    }
    const result = await deductUserBalance(selectedUser.email, amount, balanceDescription);
    if (result.success) {
      alert(`${formatAmount(amount)} 차감 완료`);
      const updated = await getUserDetail(selectedUser.email);
      if (updated.success) setSelectedUser(updated.data);
      setBalanceAmount('');
      setBalanceDescription('');
      setModalType('detail');
      loadStats();
    } else {
      alert(result.error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType('');
    setBalanceAmount('');
    setBalanceDescription('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">사용자 관리</h1>
          <p className="text-gray-400 text-sm mt-1">전체 {users.length}명</p>
        </div>
        <button
          onClick={loadUsers}
          className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">새로고침</span>
        </button>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">전체 회원</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}명</p>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">활성 회원</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.activeUsers}명</p>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">비활성 회원</p>
            <p className="text-2xl font-bold text-gray-500 mt-1">{stats.inactiveUsers}명</p>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">총 교환금</p>
            <p className="text-2xl font-bold text-ruby-400 mt-1">{formatAmount(stats.totalBalance)}</p>
          </div>
        </div>
      )}

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="이름, 이메일, 연락처"
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
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: '', status: '' })}
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
      ) : users.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1" />
          </svg>
          <p className="text-gray-400">등록된 사용자가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 레이아웃 */}
          <div className="sm:hidden space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleViewDetail(user)}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4 active:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{user.phone || '-'}</span>
                  <span className="text-gray-500">{getRelativeTime(user.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* PC 테이블 레이아웃 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">이름</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">이메일</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">연락처</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">가입일</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-white font-medium">{user.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-300 text-sm">{user.email}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-sm">{user.phone || '-'}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-400 text-sm">{getRelativeTime(user.createdAt)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleViewDetail(user)}
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
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold text-white">
                {modalType === 'detail' && '사용자 상세'}
                {modalType === 'charge' && '교환금 충전'}
                {modalType === 'deduct' && '교환금 차감'}
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
                      <span className="text-gray-400">이름</span>
                      <span className="text-white font-medium">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">이메일</span>
                      <span className="text-white">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">연락처</span>
                      <span className="text-white">{selectedUser.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">상태</span>
                      <span className={selectedUser.status === 'active' ? 'text-green-400' : 'text-gray-400'}>
                        {selectedUser.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">가입일</span>
                      <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>

                  {/* 교환금 정보 */}
                  <div className="bg-dark-700/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">교환금 잔액</h3>
                    <p className="text-3xl font-bold text-ruby-400">
                      {formatAmount(selectedUser.balance?.availableBalance || 0)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setModalType('charge')}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        충전
                      </button>
                      <button
                        onClick={() => setModalType('deduct')}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                      >
                        차감
                      </button>
                    </div>
                  </div>

                  {/* 상태 변경 */}
                  <div className="flex gap-2">
                    {selectedUser.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(selectedUser.id, 'inactive')}
                        className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                      >
                        비활성화
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(selectedUser.id, 'active')}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                      >
                        활성화
                      </button>
                    )}
                  </div>
                </div>
              )}

              {(modalType === 'charge' || modalType === 'deduct') && (
                <div className="space-y-4">
                  <div className="bg-dark-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400">현재 잔액</p>
                    <p className="text-2xl font-bold text-ruby-400">
                      {formatAmount(selectedUser.balance?.availableBalance || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {modalType === 'charge' ? '충전' : '차감'} 금액
                    </label>
                    <input
                      type="number"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder="금액을 입력하세요"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">사유 (선택)</label>
                    <input
                      type="text"
                      value={balanceDescription}
                      onChange={(e) => setBalanceDescription(e.target.value)}
                      placeholder="사유를 입력하세요"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
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
                      onClick={modalType === 'charge' ? handleChargeBalance : handleDeductBalance}
                      className={`flex-1 py-3 text-white rounded-lg transition-colors ${
                        modalType === 'charge'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {modalType === 'charge' ? '충전하기' : '차감하기'}
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
