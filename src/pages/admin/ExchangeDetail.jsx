import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExchangeStatusBadge from '../../components/exchange/ExchangeStatusBadge';
import { EXCHANGE_CATEGORIES, EXCHANGE_STATUS, getStatusByKey } from '../../constants/exchangeConstants';
import {
  getApplicationDetail,
  updateStatus,
  confirmConsultation,
  approveApplication,
  updateDelivery,
  adminCancelApplication,
  getAdminAuth,
} from '../../api/exchangeApi';
import { formatAmount, formatDate } from '../../utils/localStorage';

export default function ExchangeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAdminAuth();
  const isCEO = auth?.role === 'ceo';

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 상담 확정 모달
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({
    finalSpecification: '',
    finalAmount: '',
  });

  // 배송 정보 수정 모달
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    trackingNumber: '',
  });

  // 데이터 로드
  const loadApplication = async () => {
    setLoading(true);
    const result = await getApplicationDetail(id);
    if (result.success) {
      setApplication(result.data);
    } else {
      alert('신청 정보를 찾을 수 없습니다.');
      navigate('/admin/exchange');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  // 상태 변경
  const handleStatusChange = async (newStatus) => {
    if (!window.confirm('상태를 변경하시겠습니까?')) return;

    setActionLoading(true);
    const result = await updateStatus(id, newStatus, `상태 변경: ${newStatus}`);
    if (result.success) {
      loadApplication();
    } else {
      alert(result.error || '상태 변경에 실패했습니다.');
    }
    setActionLoading(false);
  };

  // 상담 확정
  const handleConfirmConsultation = async () => {
    if (!confirmData.finalSpecification || !confirmData.finalAmount) {
      alert('최종 구성 및 금액을 입력해주세요.');
      return;
    }

    setActionLoading(true);
    const result = await confirmConsultation(
      id,
      confirmData.finalSpecification,
      parseInt(confirmData.finalAmount)
    );
    if (result.success) {
      setShowConfirmModal(false);
      setConfirmData({ finalSpecification: '', finalAmount: '' });
      loadApplication();
      alert('상담이 확정되었습니다.');
    } else {
      alert(result.error || '상담 확정에 실패했습니다.');
    }
    setActionLoading(false);
  };

  // 대표 승인 (차감)
  const handleApprove = async () => {
    if (!window.confirm('승인하시겠습니까? 승인 시 교환금이 차감됩니다.')) return;

    setActionLoading(true);
    const result = await approveApplication(id);
    if (result.success) {
      loadApplication();
      alert('승인되었습니다. 교환금이 차감되었습니다.');
    } else {
      alert(result.error || '승인에 실패했습니다.');
    }
    setActionLoading(false);
  };

  // 배송 정보 업데이트
  const handleUpdateDelivery = async () => {
    setActionLoading(true);
    const result = await updateDelivery(id, { trackingNumber: deliveryData.trackingNumber });
    if (result.success) {
      setShowDeliveryModal(false);
      setDeliveryData({ trackingNumber: '' });
      loadApplication();
      alert('배송 정보가 업데이트되었습니다.');
    } else {
      alert(result.error || '배송 정보 업데이트에 실패했습니다.');
    }
    setActionLoading(false);
  };

  // 관리자 취소
  const handleCancel = async () => {
    const reason = window.prompt('취소 사유를 입력해주세요.');
    if (!reason) return;

    setActionLoading(true);
    const result = await adminCancelApplication(id, reason);
    if (result.success) {
      loadApplication();
      alert('취소되었습니다.');
    } else {
      alert(result.error || '취소에 실패했습니다.');
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const category = EXCHANGE_CATEGORIES[application.category];
  const statusInfo = getStatusByKey(application.status);

  // 가능한 액션 버튼 결정
  const renderActions = () => {
    const actions = [];

    switch (application.status) {
      case 'received':
        actions.push(
          <button
            key="start-consulting"
            onClick={() => handleStatusChange('cs_consulting')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            상담 시작
          </button>
        );
        break;

      case 'cs_consulting':
        actions.push(
          <button
            key="confirm-consultation"
            onClick={() => {
              setConfirmData({
                finalSpecification: '',
                finalAmount: application.requestedAmount.toString(),
              });
              setShowConfirmModal(true);
            }}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            상담 확정
          </button>
        );
        break;

      case 'consultation_confirmed':
        if (isCEO) {
          actions.push(
            <button
              key="approve"
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              승인 (차감)
            </button>
          );
        } else {
          actions.push(
            <span key="waiting" className="px-4 py-2 bg-dark-600 text-gray-400 rounded-lg">
              대표 승인 대기 중
            </span>
          );
        }
        break;

      case 'approved':
        actions.push(
          <button
            key="start-production"
            onClick={() => handleStatusChange('in_production')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            제작 시작
          </button>
        );
        break;

      case 'in_production':
        actions.push(
          <button
            key="ready-to-ship"
            onClick={() => handleStatusChange('ready_to_ship')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            출고 준비 완료
          </button>
        );
        break;

      case 'ready_to_ship':
        actions.push(
          <button
            key="shipping"
            onClick={() => setShowDeliveryModal(true)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            배송 시작
          </button>
        );
        break;

      case 'shipping':
        actions.push(
          <button
            key="delivered"
            onClick={() => handleStatusChange('delivered')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            배송 완료
          </button>
        );
        break;

      case 'delivered':
        actions.push(
          <button
            key="complete"
            onClick={() => handleStatusChange('completed')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            완료 처리
          </button>
        );
        break;
    }

    // 취소 가능 상태면 취소 버튼 추가
    if (statusInfo?.canCancel && isCEO) {
      actions.push(
        <button
          key="cancel"
          onClick={handleCancel}
          className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
        >
          취소 처리
        </button>
      );
    }

    return actions;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/admin/exchange')}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-dark-700 hover:bg-dark-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-white">신청 상세</h1>
          <p className="text-gray-400 font-mono text-sm truncate">{application.id}</p>
        </div>
      </div>

      {/* 상태 및 액션 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <ExchangeStatusBadge status={application.status} showDetail size="default" />
            <span className="text-gray-400 text-sm">
              {statusInfo?.description}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderActions()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 신청 정보 */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-600">
            <h3 className="font-semibold text-white">신청 정보</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">카테고리</span>
              <span className="text-white">{category?.icon} {category?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">신청 금액</span>
              <span className="text-ruby-400 font-semibold">{formatAmount(application.requestedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">신청일시</span>
              <span className="text-white">{formatDate(application.createdAt)}</span>
            </div>

            {/* 선택 사양 */}
            {application.specifications && Object.keys(application.specifications).length > 0 && (
              <div className="pt-4 border-t border-dark-600">
                <p className="text-gray-500 text-sm mb-2">선택 사양</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(application.specifications).map(([key, value]) => (
                    <span key={key} className="px-3 py-1 bg-dark-600 rounded-full text-sm text-gray-300">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 요청사항 */}
            {application.styleRequest && (
              <div className="pt-4 border-t border-dark-600">
                <p className="text-gray-500 text-sm mb-2">스타일/요청사항</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{application.styleRequest}</p>
              </div>
            )}
          </div>
        </div>

        {/* 고객 정보 */}
        <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-600">
            <h3 className="font-semibold text-white">고객 정보</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">고객명</span>
              <span className="text-white">{application.userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">이메일</span>
              <span className="text-white">{application.userEmail}</span>
            </div>

            <div className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm mb-2">배송지</p>
              <div className="space-y-1">
                <p className="text-white">{application.delivery?.recipientName} / {application.delivery?.recipientPhone}</p>
                <p className="text-gray-300 text-sm">
                  {application.delivery?.address} {application.delivery?.addressDetail}
                </p>
                <p className="text-gray-500 text-sm">({application.delivery?.postalCode})</p>
              </div>
            </div>

            {application.delivery?.trackingNumber && (
              <div className="pt-4 border-t border-dark-600">
                <p className="text-gray-500 text-sm mb-1">송장번호</p>
                <p className="text-ruby-400 font-mono">{application.delivery.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* 상담 확정 정보 */}
        {application.consultation?.finalSpecification && (
          <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-ruby-600/30">
              <h3 className="font-semibold text-ruby-400">상담 확정 내용</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">최종 구성/사양</p>
                <p className="text-white">{application.consultation.finalSpecification}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">최종 차감 금액</p>
                <p className="text-ruby-400 font-semibold text-xl">{formatAmount(application.consultation.finalAmount)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">확정일시</p>
                <p className="text-gray-300">{formatDate(application.consultation.consultedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">확정 담당자</p>
                <p className="text-gray-300">{application.consultation.consultedBy}</p>
              </div>
            </div>
          </div>
        )}

        {/* 승인 정보 */}
        {application.approvedAt && (
          <div className="bg-green-600/10 border border-green-600/30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-green-600/30">
              <h3 className="font-semibold text-green-400">승인 정보</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">승인일시</p>
                <p className="text-white">{formatDate(application.approvedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">승인자</p>
                <p className="text-gray-300">{application.approvedBy}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">차감 금액</p>
                <p className="text-green-400 font-semibold text-xl">{formatAmount(application.deductedAmount)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 상태 변경 이력 */}
      {application.statusHistory && application.statusHistory.length > 0 && (
        <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-600">
            <h3 className="font-semibold text-white">진행 이력</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {application.statusHistory.map((history, idx) => {
                const historyStatus = getStatusByKey(history.status);
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        idx === application.statusHistory.length - 1
                          ? 'bg-ruby-500'
                          : 'bg-dark-500'
                      }`} />
                      {idx < application.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-dark-600 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">
                          {historyStatus?.label || history.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{history.note}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {formatDate(history.timestamp)} / {history.actor}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 상담 확정 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">상담 확정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">최종 구성/사양</label>
                <textarea
                  value={confirmData.finalSpecification}
                  onChange={(e) => setConfirmData(prev => ({ ...prev, finalSpecification: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
                  rows={3}
                  placeholder="최종 확정된 구성 및 사양을 입력해주세요."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">최종 차감 금액</label>
                <input
                  type="number"
                  value={confirmData.finalAmount}
                  onChange={(e) => setConfirmData(prev => ({ ...prev, finalAmount: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
                  placeholder="최종 차감될 금액"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmConsultation}
                disabled={actionLoading}
                className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading ? '처리 중...' : '상담 확정'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배송 시작 모달 */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeliveryModal(false)} />
          <div className="relative bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">배송 시작</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">송장번호</label>
                <input
                  type="text"
                  value={deliveryData.trackingNumber}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
                  placeholder="택배 송장번호를 입력해주세요."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateDelivery}
                disabled={actionLoading || !deliveryData.trackingNumber}
                className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading ? '처리 중...' : '배송 시작'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
