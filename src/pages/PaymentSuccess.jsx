import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createRoundPayment } from '../api/seasonApi';

const CURRENT_SEASON_ID = 'SEASON-1';

const roundsData = [
  { id: 'R1', number: 'Round 1', title: '체험 라운드', price: 0, seasonId: CURRENT_SEASON_ID },
  { id: 'R2', number: 'Round 2', title: '탐사 라운드', price: 500000, seasonId: CURRENT_SEASON_ID },
  { id: 'R3', number: 'Round 3', title: '발굴 라운드', price: 1000000, seasonId: CURRENT_SEASON_ID },
  { id: 'R4', number: 'Round 4', title: 'Deep Cargo', price: 1800000, seasonId: CURRENT_SEASON_ID },
  { id: 'R5', number: 'Round 5', title: 'Core Mining', price: 2500000, seasonId: CURRENT_SEASON_ID },
  { id: 'R6', number: 'Round 6', title: 'Ruby Vein', price: 3500000, seasonId: CURRENT_SEASON_ID },
  { id: 'R7', number: 'Round 7', title: 'Final Extraction', price: 5000000, seasonId: CURRENT_SEASON_ID },
];

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);

  // URL 파라미터에서 결제 정보 추출
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!paymentKey || !orderId || !amount) {
          throw new Error('결제 정보가 올바르지 않습니다.');
        }

        // orderId에서 라운드 정보 추출 (RUBY-{roundId}-{timestamp})
        const parts = orderId.split('-');
        const roundId = parts[1]; // 'R3' 형태

        const round = roundsData.find(r => r.id === roundId);
        if (!round) {
          throw new Error('라운드 정보를 찾을 수 없습니다.');
        }

        // 금액 검증
        if (parseInt(amount) !== round.price) {
          throw new Error('결제 금액이 일치하지 않습니다.');
        }

        // 사용자 정보
        const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';
        const userName = localStorage.getItem('userName') || '사용자';

        // 결제 정보 저장 (실제로는 서버에서 토스페이먼츠 결제 승인 API를 호출해야 함)
        // 서버에서 다음 API를 호출:
        // POST https://api.tosspayments.com/v1/payments/confirm
        // Body: { paymentKey, orderId, amount }
        // Headers: Authorization: Basic {base64(secretKey:)}

        await createRoundPayment({
          userEmail,
          userName,
          seasonId: round.seasonId,
          roundId: round.id,
          roundTitle: round.title,
          amount: parseInt(amount),
          paymentKey: paymentKey,
          orderId: orderId,
        });

        setPaymentInfo({
          orderId,
          amount: parseInt(amount),
          roundId,
          roundTitle: round.title,
          roundNumber: round.number,
          paymentKey,
        });

        setIsVerifying(false);
      } catch (err) {
        console.error('결제 승인 실패:', err);
        setError(err.message || '결제 확인 중 오류가 발생했습니다.');
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentKey, orderId, amount]);

  if (isVerifying) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-ruby-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="animate-spin h-8 w-8 text-ruby-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">결제 확인 중...</h2>
          <p className="text-gray-400">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-glow" />
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="card p-6 sm:p-10 text-center animate-fade-in-scale">
            <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              결제 확인 <span className="text-red-400">실패</span>
            </h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link
              to="/rounds"
              className="w-full btn-primary text-base py-4 relative overflow-hidden group block"
            >
              <span className="relative z-10">다시 시도하기</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-green-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="card p-6 sm:p-10 text-center animate-fade-in-scale">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            결제가 <span className="text-green-400">완료</span>되었습니다
          </h1>

          <p className="text-gray-400 mb-8">
            라운드 참여가 확정되었습니다. 마이페이지에서 참여 현황을 확인하세요.
          </p>

          {/* Payment Info */}
          {paymentInfo && (
            <div className="bg-dark-700 rounded-xl p-5 mb-8 text-left">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rotate-45" />
                결제 정보
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">상품</span>
                  <span className="font-medium">{paymentInfo.roundNumber} - {paymentInfo.roundTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">주문번호</span>
                  <span className="font-mono text-xs">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">결제금액</span>
                  <span className="text-green-400 font-bold">
                    ₩{paymentInfo.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">결제일시</span>
                  <span>{new Date().toLocaleString('ko-KR')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/mypage"
              className="w-full btn-primary text-base py-4 relative overflow-hidden group block"
            >
              <span className="relative z-10">마이페이지로 이동</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-shimmer opacity-30" />
            </Link>

            <Link
              to="/rounds"
              className="w-full px-6 py-4 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors block"
            >
              다른 라운드 둘러보기
            </Link>
          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            결제 관련 문의는{' '}
            <Link to="/contact" className="text-ruby-400 hover:underline">고객센터</Link>로 연락해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
