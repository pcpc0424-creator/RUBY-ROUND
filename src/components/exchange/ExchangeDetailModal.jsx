import ExchangeStatusBadge from './ExchangeStatusBadge';
import { EXCHANGE_CATEGORIES, getStatusByKey } from '../../constants/exchangeConstants';
import { formatAmount, formatDate } from '../../utils/localStorage';

export default function ExchangeDetailModal({ application, onClose, onCancel }) {
  const category = EXCHANGE_CATEGORIES[application.category];
  const statusInfo = getStatusByKey(application.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-4 bg-dark-700 border-b border-dark-600 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">신청 상세</h3>
            <p className="text-gray-400 text-sm font-mono">{application.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
          {/* 상태 및 기본 정보 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-ruby-600/20 rounded-lg flex items-center justify-center text-3xl">
                {category?.icon}
              </div>
              <div>
                <p className="text-white font-medium text-lg">{category?.label}</p>
                <p className="text-ruby-400 font-semibold">
                  {formatAmount(application.requestedAmount)}
                </p>
              </div>
            </div>
            <ExchangeStatusBadge status={application.status} showDetail />
          </div>

          {/* 상태 안내 */}
          <div className={`rounded-lg p-4 ${
            statusInfo?.canCancel
              ? 'bg-blue-500/10 border border-blue-500/30'
              : 'bg-green-500/10 border border-green-500/30'
          }`}>
            <p className={statusInfo?.canCancel ? 'text-blue-400' : 'text-green-400'}>
              {statusInfo?.canCancel
                ? '취소 요청 가능 (운영정책 기준)'
                : '주문제작 특성상 취소/환불 제한 (예외 사유 제외)'
              }
            </p>
          </div>

          {/* 사양 정보 */}
          {application.specifications && Object.keys(application.specifications).length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">선택 사양</h4>
              <div className="bg-dark-700/50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(application.specifications).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-3 py-1 bg-dark-600 rounded-full text-sm text-gray-300"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 스타일/요청사항 */}
          {application.styleRequest && (
            <div>
              <h4 className="text-white font-medium mb-3">스타일/요청사항</h4>
              <div className="bg-dark-700/50 rounded-lg p-4">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {application.styleRequest}
                </p>
              </div>
            </div>
          )}

          {/* 상담 확정 정보 */}
          {application.consultation?.finalSpecification && (
            <div>
              <h4 className="text-white font-medium mb-3">상담 확정 내용</h4>
              <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">최종 구성/사양</p>
                  <p className="text-white">{application.consultation.finalSpecification}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">최종 차감 금액</p>
                  <p className="text-ruby-400 font-semibold">
                    {formatAmount(application.consultation.finalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">상담 확정일</p>
                  <p className="text-gray-300">{formatDate(application.consultation.consultedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* 배송 정보 */}
          <div>
            <h4 className="text-white font-medium mb-3">배송 정보</h4>
            <div className="bg-dark-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">수령인</span>
                <span className="text-white">{application.delivery?.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">연락처</span>
                <span className="text-white">{application.delivery?.recipientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">주소</span>
                <span className="text-white text-right">
                  {application.delivery?.address} {application.delivery?.addressDetail}
                  <br />
                  <span className="text-gray-400">({application.delivery?.postalCode})</span>
                </span>
              </div>
              {application.delivery?.trackingNumber && (
                <div className="flex justify-between pt-2 border-t border-dark-600">
                  <span className="text-gray-500">송장번호</span>
                  <span className="text-ruby-400">{application.delivery.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* 상태 변경 이력 */}
          {application.statusHistory && application.statusHistory.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">진행 이력</h4>
              <div className="bg-dark-700/50 rounded-lg p-4">
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
                            {formatDate(history.timestamp)} · {history.actor}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-dark-700 border-t border-dark-600 flex gap-3">
          {statusInfo?.canCancel && (
            <button
              onClick={() => onCancel(application.id)}
              className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors"
            >
              신청 취소
            </button>
          )}
          <button
            onClick={onClose}
            className={`${statusInfo?.canCancel ? 'flex-1' : 'w-full'} py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 font-medium rounded-lg transition-colors`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
