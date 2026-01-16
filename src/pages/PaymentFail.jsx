import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 에러 정보 추출
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  // 에러 코드별 메시지
  const getErrorDescription = (code) => {
    const errorMessages = {
      'PAY_PROCESS_CANCELED': '결제가 취소되었습니다.',
      'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
      'INSUFFICIENT_BALANCE': '잔액이 부족합니다.',
      'INVALID_CARD_NUMBER': '카드 번호가 올바르지 않습니다.',
      'EXCEED_MAX_DAILY_PAYMENT_COUNT': '일일 결제 횟수를 초과했습니다.',
      'EXCEED_MAX_PAYMENT_AMOUNT': '결제 한도를 초과했습니다.',
    };
    return errorMessages[code] || '결제 처리 중 오류가 발생했습니다.';
  };

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="card p-6 sm:p-10 text-center animate-fade-in-scale">
          {/* Fail Icon */}
          <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            결제에 <span className="text-red-400">실패</span>했습니다
          </h1>

          <p className="text-gray-400 mb-8">
            {getErrorDescription(errorCode)}
          </p>

          {/* Error Info */}
          <div className="bg-dark-700 rounded-xl p-5 mb-8 text-left">
            <h3 className="font-medium mb-4 flex items-center gap-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              오류 정보
            </h3>
            <div className="space-y-3 text-sm">
              {errorCode && (
                <div className="flex justify-between">
                  <span className="text-gray-400">오류 코드</span>
                  <span className="font-mono text-xs text-red-400">{errorCode}</span>
                </div>
              )}
              {errorMessage && (
                <div className="flex justify-between">
                  <span className="text-gray-400">상세 메시지</span>
                  <span className="text-xs">{decodeURIComponent(errorMessage)}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">주문번호</span>
                  <span className="font-mono text-xs">{orderId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-yellow-900/20 border border-yellow-900/30 rounded-xl p-4 mb-8 text-left">
            <h4 className="text-yellow-500 text-sm font-medium mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              문제 해결 방법
            </h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>- 카드 정보가 올바른지 확인해주세요.</li>
              <li>- 결제 한도를 확인해주세요.</li>
              <li>- 다른 결제 수단을 이용해보세요.</li>
              <li>- 문제가 지속되면 카드사에 문의해주세요.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/rounds"
              className="w-full btn-primary text-base py-4 relative overflow-hidden group block"
            >
              <span className="relative z-10">다시 시도하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-shimmer opacity-30" />
            </Link>

            <Link
              to="/contact"
              className="w-full px-6 py-4 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors block"
            >
              고객센터 문의하기
            </Link>
          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            결제 관련 문의: <span className="text-ruby-400">1234-5678</span>
          </p>
        </div>
      </div>
    </div>
  );
}
