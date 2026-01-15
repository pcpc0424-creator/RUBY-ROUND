import { EXCHANGE_CATEGORIES, getStatusByKey } from '../../constants/exchangeConstants';
import { formatAmount, formatDate } from '../../utils/localStorage';

export default function ExchangeComplete({ application, onViewHistory, onNewApplication }) {
  const category = EXCHANGE_CATEGORIES[application.category];
  const statusInfo = getStatusByKey(application.status);

  return (
    <div className="space-y-8">
      {/* 완료 아이콘 및 메시지 */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">교환 신청이 접수되었습니다</h2>
        <p className="text-gray-400">
          교환금은 아직 차감되지 않았습니다
        </p>
      </div>

      {/* 미차감 안내 배너 */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-blue-400 font-medium mb-1">교환금 미차감 상태</p>
            <p className="text-gray-400 text-sm">
              CS 상담으로 최종 구성/금액 확정 후 대표 승인 시 교환금이 차감되고 제작이 시작됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 신청 요약 */}
      <div className="bg-dark-700/50 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-dark-700 border-b border-dark-600">
          <h3 className="font-semibold text-white">신청 요약</h3>
        </div>
        <div className="p-4 space-y-4">
          {/* 신청번호 및 상태 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-dark-600">
            <div>
              <p className="text-gray-500 text-sm">신청번호</p>
              <p className="text-white font-mono">{application.id}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo?.bgClass || 'bg-gray-500/20 text-gray-400'}`}>
              {statusInfo?.labelDetail || statusInfo?.label || application.status}
            </span>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">카테고리</p>
              <p className="text-white">
                {category?.icon} {category?.label}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">사용 예정 교환금</p>
              <p className="text-ruby-400 font-semibold">
                {formatAmount(application.requestedAmount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">신청일시</p>
              <p className="text-white">{formatDate(application.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">수령인</p>
              <p className="text-white">{application.delivery?.recipientName}</p>
            </div>
          </div>

          {/* 사양 정보 */}
          {application.specifications && Object.keys(application.specifications).length > 0 && (
            <div className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm mb-2">선택 사양</p>
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
          )}

          {/* 요청사항 */}
          {application.styleRequest && (
            <div className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm mb-2">스타일/요청사항</p>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">
                {application.styleRequest}
              </p>
            </div>
          )}

          {/* 배송지 */}
          <div className="pt-4 border-t border-dark-600">
            <p className="text-gray-500 text-sm mb-2">배송지</p>
            <p className="text-gray-300 text-sm">
              {application.delivery?.address} {application.delivery?.addressDetail}
              <br />
              ({application.delivery?.postalCode})
            </p>
          </div>
        </div>
      </div>

      {/* 다음 단계 안내 */}
      <div className="bg-dark-700/30 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">다음 단계</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm text-ruby-400 font-medium">
              1
            </div>
            <div>
              <p className="text-gray-300 text-sm">CS 담당자가 접수 내용을 확인합니다.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm text-ruby-400 font-medium">
              2
            </div>
            <div>
              <p className="text-gray-300 text-sm">상담을 통해 최종 구성 및 금액을 확정합니다.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0 text-sm text-ruby-400 font-medium">
              3
            </div>
            <div>
              <p className="text-gray-300 text-sm">대표 승인 시 교환금이 차감되고 제작이 시작됩니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onViewHistory}
          className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-700 text-white font-semibold rounded-lg
            transition-all duration-300"
        >
          신청 내역 확인
        </button>
        <button
          onClick={onNewApplication}
          className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg
            transition-all duration-300"
        >
          새 신청하기
        </button>
      </div>
    </div>
  );
}
