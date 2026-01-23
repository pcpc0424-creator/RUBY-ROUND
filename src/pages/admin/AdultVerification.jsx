import { useState, useEffect } from 'react';
import { ADULT_VERIFICATION_STATUS, ADULT_VERIFICATION_METHODS, hasPermission } from '../../constants/exchangeConstants';
import {
  getAdultVerificationRequests,
  getAdultVerificationStatistics,
  approveAdultVerification,
  rejectAdultVerification,
  deleteAdultVerification,
  manualAdultVerification,
  revokeAdultVerification,
  getUsers,
  getAdminAuth,
} from '../../api/exchangeApi';
import { getRelativeTime } from '../../utils/localStorage';

export default function AdultVerification() {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'users'
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  // 모달 상태
  const [rejectModal, setRejectModal] = useState({ open: false, request: null });
  const [rejectReason, setRejectReason] = useState('');
  const [manualModal, setManualModal] = useState({ open: false, user: null });
  const [revokeModal, setRevokeModal] = useState({ open: false, user: null });
  const [revokeReason, setRevokeReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';
  const canApprove = hasPermission(auth?.role, 'approve_adult_verification');

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    const [requestsResult, statsResult, usersResult] = await Promise.all([
      getAdultVerificationRequests(filters),
      getAdultVerificationStatistics(),
      getUsers(),
    ]);

    if (requestsResult.success) {
      setRequests(requestsResult.data);
    }
    if (statsResult.success) {
      setStatistics(statsResult.data);
    }
    if (usersResult.success) {
      setUsers(usersResult.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // 필터 변경
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 인증 승인 (대표만)
  const handleApprove = async (request) => {
    if (!canApprove) {
      alert('승인 권한이 없습니다. 대표 계정으로 로그인해주세요.');
      return;
    }
    if (!window.confirm(`${request.userName}님의 성인 인증을 승인하시겠습니까?`)) return;

    setProcessing(true);
    const result = await approveAdultVerification(request.id, auth?.name);
    if (result.success) {
      alert('성인 인증이 승인되었습니다.');
      loadData();
    } else {
      alert(result.error || '승인 처리에 실패했습니다.');
    }
    setProcessing(false);
  };

  // 인증 거부
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }

    setProcessing(true);
    const result = await rejectAdultVerification(rejectModal.request.id, auth?.name, rejectReason);
    if (result.success) {
      alert('성인 인증이 거부되었습니다.');
      setRejectModal({ open: false, request: null });
      setRejectReason('');
      loadData();
    } else {
      alert(result.error || '거부 처리에 실패했습니다.');
    }
    setProcessing(false);
  };

  // 요청 삭제
  const handleDelete = async (request) => {
    if (!window.confirm(`${request.userName}님의 인증 요청을 삭제하시겠습니까?`)) return;

    setProcessing(true);
    const result = await deleteAdultVerification(request.id);
    if (result.success) {
      alert('인증 요청이 삭제되었습니다.');
      loadData();
    } else {
      alert(result.error || '삭제에 실패했습니다.');
    }
    setProcessing(false);
  };

  // 수동 인증 (대표만)
  const handleManualVerification = async () => {
    if (!canApprove) {
      alert('승인 권한이 없습니다. 대표 계정으로 로그인해주세요.');
      return;
    }

    setProcessing(true);
    const result = await manualAdultVerification(manualModal.user.email, auth?.name);
    if (result.success) {
      alert('성인 인증이 완료되었습니다.');
      setManualModal({ open: false, user: null });
      loadData();
    } else {
      alert(result.error || '인증 처리에 실패했습니다.');
    }
    setProcessing(false);
  };

  // 인증 취소 (대표만)
  const handleRevokeVerification = async () => {
    if (!canApprove) {
      alert('승인 권한이 없습니다. 대표 계정으로 로그인해주세요.');
      return;
    }

    setProcessing(true);
    const result = await revokeAdultVerification(revokeModal.user.email, auth?.name, revokeReason);
    if (result.success) {
      alert('성인 인증이 취소되었습니다.');
      setRevokeModal({ open: false, user: null });
      setRevokeReason('');
      loadData();
    } else {
      alert(result.error || '취소 처리에 실패했습니다.');
    }
    setProcessing(false);
  };

  // 상태 배지 렌더링
  const renderStatusBadge = (status) => {
    const statusInfo = Object.values(ADULT_VERIFICATION_STATUS).find((s) => s.key === status);
    if (!statusInfo) return null;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${statusInfo.bgClass}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  // 사용자 필터링
  const filteredUsers = users.filter((user) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">성인 인증 관리</h1>
          <p className="text-gray-400 text-sm mt-1">사용자의 성인 인증 요청을 관리합니다.</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          새로고침
        </button>
      </div>

      {/* 통계 카드 */}
      {statistics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">전체 사용자</div>
            <div className="text-2xl font-bold text-white mt-1">{statistics.totalUsers}명</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">인증 완료</div>
            <div className="text-2xl font-bold text-green-400 mt-1">
              {statistics.verifiedUsers}명
            </div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">미인증</div>
            <div className="text-2xl font-bold text-gray-400 mt-1">
              {statistics.unverifiedUsers}명
            </div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">대기 중</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">
              {statistics.pendingRequests}건
            </div>
          </div>
        </div>
      )}

      {/* 탭 */}
      <div className="flex gap-2 border-b border-dark-600 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-dark-700 text-ruby-400 border-b-2 border-ruby-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          인증 요청 ({requests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-dark-700 text-ruby-400 border-b-2 border-ruby-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          사용자 인증 현황
        </button>
      </div>

      {/* 인증 요청 탭 */}
      {activeTab === 'requests' && (
        <>
          {/* 필터 */}
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">상태</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                    text-white focus:outline-none focus:border-ruby-500"
                >
                  <option value="">전체</option>
                  {Object.values(ADULT_VERIFICATION_STATUS).map((status) => (
                    <option key={status.key} value={status.key}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">검색</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="이름, 이메일 검색"
                  className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
                />
              </div>
            </div>
          </div>

          {/* 요청 목록 */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-dark-800 border border-dark-600 rounded-xl p-12 text-center">
              <svg
                className="w-12 h-12 text-gray-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <p className="text-gray-400">인증 요청이 없습니다.</p>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                        요청 ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                        사용자
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                        인증 방법
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                        상태
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                        요청일
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {requests.map((request) => {
                      const methodInfo = ADULT_VERIFICATION_METHODS.find(
                        (m) => m.key === request.method
                      );

                      return (
                        <tr key={request.id} className="hover:bg-dark-700/50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-white font-mono text-sm">{request.id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-white text-sm">{request.userName}</p>
                              <p className="text-gray-500 text-xs">{request.userEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-gray-300 text-sm">
                              {methodInfo?.label || request.method || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {renderStatusBadge(request.status)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-gray-400 text-sm">
                              {getRelativeTime(request.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {request.status === 'pending' && (
                                <>
                                  {canApprove && (
                                    <button
                                      onClick={() => handleApprove(request)}
                                      disabled={processing}
                                      className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm rounded transition-colors disabled:opacity-50"
                                    >
                                      승인
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setRejectModal({ open: true, request })}
                                    disabled={processing}
                                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded transition-colors disabled:opacity-50"
                                  >
                                    거부
                                  </button>
                                </>
                              )}
                              {request.status === 'approved' && (
                                <span className="text-green-400 text-sm">
                                  {request.approvedBy && `${request.approvedBy} 승인`}
                                </span>
                              )}
                              {request.status === 'rejected' && (
                                <span className="text-red-400 text-sm mr-2">
                                  {request.rejectionReason && `사유: ${request.rejectionReason}`}
                                </span>
                              )}
                              <button
                                onClick={() => handleDelete(request)}
                                disabled={processing}
                                className="px-3 py-1.5 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 text-sm rounded transition-colors disabled:opacity-50"
                                title="삭제"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* 사용자 인증 현황 탭 */}
      {activeTab === 'users' && (
        <>
          {/* 검색 */}
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">검색</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="이름, 이메일 검색"
                className="w-full max-w-md px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                  text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
              />
            </div>
          </div>

          {/* 사용자 목록 */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                        사용자
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                        인증 상태
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">
                        인증 방법
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                        인증일
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-dark-700/50 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-white text-sm">{user.name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {user.adultVerified ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                              인증완료
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-500/20 text-gray-400 border-gray-500/30">
                              미인증
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-gray-300 text-sm">
                            {user.adultVerificationMethod
                              ? ADULT_VERIFICATION_METHODS.find(
                                  (m) => m.key === user.adultVerificationMethod
                                )?.label || user.adultVerificationMethod
                              : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-gray-400 text-sm">
                            {user.adultVerifiedAt ? getRelativeTime(user.adultVerifiedAt) : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {canApprove && (
                            <>
                              {!user.adultVerified ? (
                                <button
                                  onClick={() => setManualModal({ open: true, user })}
                                  className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm rounded transition-colors"
                                >
                                  수동 인증
                                </button>
                              ) : (
                                <button
                                  onClick={() => setRevokeModal({ open: true, user })}
                                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded transition-colors"
                                >
                                  인증 취소
                                </button>
                              )}
                            </>
                          )}
                          {!canApprove && (
                            <span className="text-gray-500 text-xs">
                              {user.adultVerified ? '인증됨' : '미인증'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* 권한 안내 (CS 계정용) */}
      {!canApprove && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-yellow-400 font-medium">성인 인증 승인/취소 권한이 필요합니다</p>
              <p className="text-yellow-400/70 text-sm mt-1">
                성인 인증의 승인, 수동 인증, 인증 취소는 대표 계정에서만 가능합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 거부 모달 */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setRejectModal({ open: false, request: null })}
          />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-bold text-white">인증 거부</h2>
              <p className="text-gray-400 text-sm mt-1">{rejectModal.request?.userName}님의 인증</p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">거부 사유</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="거부 사유를 입력해주세요"
                rows={3}
                className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                  text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 resize-none"
              />
            </div>

            <div className="px-6 py-4 bg-dark-900/50 border-t border-dark-600 flex gap-3">
              <button
                onClick={() => {
                  setRejectModal({ open: false, request: null });
                  setRejectReason('');
                }}
                className="flex-1 py-2.5 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {processing ? '처리 중...' : '거부'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수동 인증 모달 */}
      {manualModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setManualModal({ open: false, user: null })}
          />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-bold text-white">수동 성인 인증</h2>
            </div>

            <div className="p-6">
              <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                <p className="text-white font-medium">{manualModal.user?.name}</p>
                <p className="text-gray-400 text-sm">{manualModal.user?.email}</p>
              </div>
              <p className="text-gray-300 text-sm">
                이 사용자의 성인 인증을 수동으로 승인하시겠습니까?
                <br />
                <span className="text-yellow-400">
                  본인 확인 절차를 완료한 경우에만 승인해주세요.
                </span>
              </p>
            </div>

            <div className="px-6 py-4 bg-dark-900/50 border-t border-dark-600 flex gap-3">
              <button
                onClick={() => setManualModal({ open: false, user: null })}
                className="flex-1 py-2.5 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleManualVerification}
                disabled={processing}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {processing ? '처리 중...' : '인증 승인'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 인증 취소 모달 */}
      {revokeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setRevokeModal({ open: false, user: null });
              setRevokeReason('');
            }}
          />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-bold text-white">성인 인증 취소</h2>
              <p className="text-gray-400 text-sm mt-1">{revokeModal.user?.name}님의 인증</p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">취소 사유 (선택)</label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="취소 사유를 입력해주세요"
                rows={3}
                className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                  text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 resize-none"
              />
              <p className="text-red-400 text-sm mt-3">
                주의: 인증 취소 시 해당 사용자는 성인 인증이 필요한 서비스를 이용할 수 없습니다.
              </p>
            </div>

            <div className="px-6 py-4 bg-dark-900/50 border-t border-dark-600 flex gap-3">
              <button
                onClick={() => {
                  setRevokeModal({ open: false, user: null });
                  setRevokeReason('');
                }}
                className="flex-1 py-2.5 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRevokeVerification}
                disabled={processing}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {processing ? '처리 중...' : '인증 취소'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
