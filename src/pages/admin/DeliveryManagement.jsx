import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExchangeStatusBadge from '../../components/exchange/ExchangeStatusBadge';
import { COURIER_LIST, EXCHANGE_STATUS } from '../../constants/exchangeConstants';
import {
  getDeliveryList,
  getDeliveryStatistics,
  registerTrackingNumber,
  markAsDelivered,
  updateDeliveryStatus,
  getAdminAuth,
} from '../../api/exchangeApi';
import { formatAmount, getRelativeTime } from '../../utils/localStorage';

export default function DeliveryManagement() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    courier: '',
    search: '',
  });

  // 모달 상태
  const [trackingModal, setTrackingModal] = useState({ open: false, delivery: null });
  const [trackingForm, setTrackingForm] = useState({ courier: '', trackingNumber: '' });
  const [saving, setSaving] = useState(false);

  const auth = getAdminAuth();

  // 데이터 로드
  const loadData = async () => {
    setLoading(true);
    const [deliveryResult, statsResult] = await Promise.all([
      getDeliveryList(filters),
      getDeliveryStatistics(),
    ]);

    if (deliveryResult.success) {
      setDeliveries(deliveryResult.data);
    }
    if (statsResult.success) {
      setStatistics(statsResult.data);
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

  // 송장 등록 모달 열기
  const openTrackingModal = (delivery) => {
    setTrackingModal({ open: true, delivery });
    setTrackingForm({
      courier: delivery.delivery?.courier || '',
      trackingNumber: delivery.delivery?.trackingNumber || '',
    });
  };

  // 송장 등록
  const handleRegisterTracking = async () => {
    if (!trackingForm.courier || !trackingForm.trackingNumber) {
      alert('택배사와 송장번호를 입력해주세요.');
      return;
    }

    setSaving(true);
    const result = await registerTrackingNumber(
      trackingModal.delivery.id,
      trackingForm,
      auth?.name
    );

    if (result.success) {
      alert('송장이 등록되었습니다.');
      setTrackingModal({ open: false, delivery: null });
      loadData();
    } else {
      alert(result.error || '송장 등록에 실패했습니다.');
    }
    setSaving(false);
  };

  // 배송 완료 처리
  const handleMarkDelivered = async (deliveryId) => {
    if (!window.confirm('배송 완료 처리하시겠습니까?')) return;

    const result = await markAsDelivered(deliveryId, auth?.name);
    if (result.success) {
      alert('배송 완료 처리되었습니다.');
      loadData();
    } else {
      alert(result.error || '처리에 실패했습니다.');
    }
  };

  // 상태 변경
  const handleStatusChange = async (deliveryId, newStatus) => {
    const statusLabel = Object.values(EXCHANGE_STATUS).find((s) => s.key === newStatus)?.label;
    if (!window.confirm(`상태를 '${statusLabel}'(으)로 변경하시겠습니까?`)) return;

    const result = await updateDeliveryStatus(deliveryId, newStatus, auth?.name);
    if (result.success) {
      alert('상태가 변경되었습니다.');
      loadData();
    } else {
      alert(result.error || '상태 변경에 실패했습니다.');
    }
  };

  // 배송 조회 URL
  const getTrackingUrl = (courier, trackingNumber) => {
    const courierInfo = COURIER_LIST.find((c) => c.key === courier);
    if (courierInfo?.trackingUrl && trackingNumber) {
      return courierInfo.trackingUrl + trackingNumber;
    }
    return null;
  };

  // 배송 상태별 필터 옵션
  const deliveryStatusOptions = [
    { key: '', label: '전체' },
    { key: 'approved', label: '승인완료' },
    { key: 'in_production', label: '제작중' },
    { key: 'ready_to_ship', label: '출고준비' },
    { key: 'shipping', label: '배송중' },
    { key: 'delivered', label: '배송완료' },
    { key: 'completed', label: '완료' },
  ];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">배송 관리</h1>
          <p className="text-gray-400 text-sm mt-1">교환 신청 건의 배송 현황을 관리합니다.</p>
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
            <div className="text-gray-400 text-sm">출고 대기</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">
              {statistics.pendingShipment}건
            </div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">배송 중</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{statistics.shipping}건</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">배송 완료</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{statistics.delivered}건</div>
          </div>
          <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
            <div className="text-gray-400 text-sm">전체 완료</div>
            <div className="text-2xl font-bold text-gray-400 mt-1">{statistics.completed}건</div>
          </div>
        </div>
      )}

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 상태 필터 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">배송 상태</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                text-white focus:outline-none focus:border-ruby-500"
            >
              {deliveryStatusOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 택배사 필터 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">택배사</label>
            <select
              value={filters.courier}
              onChange={(e) => handleFilterChange('courier', e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {COURIER_LIST.map((courier) => (
                <option key={courier.key} value={courier.key}>
                  {courier.label}
                </option>
              ))}
            </select>
          </div>

          {/* 검색 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="신청번호, 고객명, 송장번호"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
            />
          </div>
        </div>
      </div>

      {/* 배송 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : deliveries.length === 0 ? (
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-400">배송 대기 중인 건이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    신청번호
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">고객</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    배송지 정보
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                    배송 정보
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {deliveries.map((delivery) => {
                  const courierInfo = COURIER_LIST.find(
                    (c) => c.key === delivery.delivery?.courier
                  );
                  const trackingUrl = getTrackingUrl(
                    delivery.delivery?.courier,
                    delivery.delivery?.trackingNumber
                  );

                  return (
                    <tr key={delivery.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/admin/exchange/${delivery.id}`)}
                          className="text-ruby-400 hover:text-ruby-300 font-mono text-sm"
                        >
                          {delivery.id}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-white text-sm">{delivery.userName}</p>
                          <p className="text-gray-500 text-xs">{delivery.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-white">{delivery.delivery?.recipientName}</p>
                          <p className="text-gray-500 text-xs">
                            {delivery.delivery?.recipientPhone}
                          </p>
                          <p className="text-gray-500 text-xs mt-1 max-w-[200px] truncate">
                            {delivery.delivery?.address}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <ExchangeStatusBadge status={delivery.status} size="small" />
                      </td>
                      <td className="px-4 py-4">
                        {delivery.delivery?.trackingNumber ? (
                          <div className="text-sm">
                            <p className="text-gray-300">{courierInfo?.label || '택배사'}</p>
                            {trackingUrl ? (
                              <a
                                href={trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ruby-400 hover:text-ruby-300 font-mono"
                              >
                                {delivery.delivery.trackingNumber}
                              </a>
                            ) : (
                              <p className="text-gray-400 font-mono">
                                {delivery.delivery.trackingNumber}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">미등록</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 송장 등록 버튼 */}
                          {['in_production', 'ready_to_ship'].includes(delivery.status) && (
                            <button
                              onClick={() => openTrackingModal(delivery)}
                              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded transition-colors"
                            >
                              송장등록
                            </button>
                          )}

                          {/* 배송완료 버튼 */}
                          {delivery.status === 'shipping' && (
                            <button
                              onClick={() => handleMarkDelivered(delivery.id)}
                              className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm rounded transition-colors"
                            >
                              배송완료
                            </button>
                          )}

                          {/* 상태 변경 드롭다운 */}
                          {['approved', 'in_production'].includes(delivery.status) && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleStatusChange(delivery.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="px-2 py-1.5 bg-dark-700 border border-dark-600 rounded text-sm text-gray-300 focus:outline-none"
                              defaultValue=""
                            >
                              <option value="">상태변경</option>
                              {delivery.status === 'approved' && (
                                <option value="in_production">제작중</option>
                              )}
                              {['approved', 'in_production'].includes(delivery.status) && (
                                <option value="ready_to_ship">출고준비</option>
                              )}
                            </select>
                          )}
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

      {/* 송장 등록 모달 */}
      {trackingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setTrackingModal({ open: false, delivery: null })}
          />
          <div className="relative w-full max-w-md bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-bold text-white">송장 등록</h2>
              <p className="text-gray-400 text-sm mt-1">{trackingModal.delivery?.id}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* 배송지 정보 */}
              <div className="bg-dark-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">배송지 정보</h3>
                <div className="text-white">
                  <p>{trackingModal.delivery?.delivery?.recipientName}</p>
                  <p className="text-gray-400 text-sm">
                    {trackingModal.delivery?.delivery?.recipientPhone}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {trackingModal.delivery?.delivery?.address}
                    {trackingModal.delivery?.delivery?.addressDetail &&
                      ` ${trackingModal.delivery.delivery.addressDetail}`}
                  </p>
                </div>
              </div>

              {/* 택배사 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">택배사</label>
                <select
                  value={trackingForm.courier}
                  onChange={(e) => setTrackingForm((prev) => ({ ...prev, courier: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                    text-white focus:outline-none focus:border-ruby-500"
                >
                  <option value="">택배사 선택</option>
                  {COURIER_LIST.map((courier) => (
                    <option key={courier.key} value={courier.key}>
                      {courier.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 송장번호 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">송장번호</label>
                <input
                  type="text"
                  value={trackingForm.trackingNumber}
                  onChange={(e) =>
                    setTrackingForm((prev) => ({ ...prev, trackingNumber: e.target.value }))
                  }
                  placeholder="송장번호를 입력하세요"
                  className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-dark-900/50 border-t border-dark-600 flex gap-3">
              <button
                onClick={() => setTrackingModal({ open: false, delivery: null })}
                className="flex-1 py-2.5 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRegisterTracking}
                disabled={saving}
                className="flex-1 py-2.5 bg-ruby-600 hover:bg-ruby-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? '등록 중...' : '송장 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
