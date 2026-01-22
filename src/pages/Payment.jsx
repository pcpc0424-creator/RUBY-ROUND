import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// 토스페이먼츠 클라이언트 키
const TOSS_CLIENT_KEY = 'live_gck_E92LAa5PVbPzPdypLX9B87YmpXyJ';

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

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [round, setRound] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToPayment, setAgreedToPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('userName') || '사용자';
  const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';

  useEffect(() => {
    const foundRound = roundsData.find(r => r.id === id || r.id === `R${id}`);
    if (foundRound) {
      setRound(foundRound);
    }
  }, [id]);

  const handleTossPayment = async () => {
    if (!agreedToPayment) {
      alert('결제 진행에 동의해주세요.');
      return;
    }

    if (!round || round.price === 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      const orderId = `RUBY-${round.id}-${Date.now()}`;

      await tossPayments.requestPayment(paymentMethod, {
        amount: round.price,
        orderId: orderId,
        orderName: `${round.number} - ${round.title} 참여비`,
        customerName: userName,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        console.error('결제 오류:', error);
        alert('결제 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-400 mb-6">결제를 진행하려면 로그인해주세요.</p>
          <Link to="/login" className="btn-primary inline-block">로그인하기</Link>
        </div>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400">라운드 정보를 찾을 수 없습니다.</p>
        <Link to="/rounds" className="text-ruby-400 hover:underline mt-4 inline-block">
          라운드 목록으로 돌아가기
        </Link>
      </div>
    );
  }


  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back button */}
        <Link
          to={`/rounds/${id}/join`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8 animate-fade-in-up"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          이전으로 돌아가기
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">
            <span className="text-shimmer">결제하기</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {round.number} - {round.title} 참여를 위한 결제를 진행합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Info */}
            <div className="card p-5 sm:p-6 hover-glow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-ruby-500 rotate-45" />
                주문 정보
              </h2>
              <div className="bg-dark-700 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">{round.number}</p>
                    <p className="font-bold text-lg">{round.title}</p>
                    <p className="text-gray-500 text-xs mt-1">시즌 1 참여비 (보석 구매 예약금)</p>
                  </div>
                  <p className="text-xl font-bold text-ruby-400">
                    ₩{round.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-5 sm:p-6 hover-glow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-ruby-500 rotate-45" />
                결제 수단
              </h2>
              <div className="p-4 rounded-xl border-2 border-ruby-500 bg-ruby-950/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-ruby-600/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-ruby-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">신용/체크카드</p>
                    <p className="text-xs text-gray-500">모든 카드사 결제 가능</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Toss Payments Info */}
            <div className="card p-5 sm:p-6 bg-gradient-to-r from-blue-950/30 to-dark-800 border-blue-900/50 hover-glow animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blue-400">토스페이먼츠 안전결제</p>
                  <p className="text-xs text-gray-400">SSL 암호화로 안전하게 결제됩니다</p>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="card bg-dark-800/50 border-yellow-900/30 p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                결제 안내
              </h2>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  결제 완료 후 라운드 참여가 즉시 확정됩니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  시즌 종료 후 실물 루비 보석 또는 적립금으로 귀속됩니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  결제 취소는 환불정책에 따라 진행됩니다.
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Payment Summary */}
          <div className="lg:col-span-2">
            <div className="card bg-gradient-to-b from-ruby-950/30 to-dark-800 border-ruby-900/50 p-5 sm:p-6 sticky top-32 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-lg font-bold mb-4">결제 금액</h2>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">상품</span>
                  <span>{round.number} - {round.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">참여비</span>
                  <span>₩{round.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">결제 수단</span>
                  <span>신용/체크카드</span>
                </div>
                <div className="border-t border-dark-600 pt-3 flex justify-between font-bold text-lg">
                  <span>총 결제금액</span>
                  <span className="text-ruby-400">
                    ₩{round.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mb-6">
                <input
                  type="checkbox"
                  checked={agreedToPayment}
                  onChange={(e) => setAgreedToPayment(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-700 text-ruby-500 focus:ring-ruby-500 focus:ring-offset-dark-800"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  <Link to="/terms" className="text-ruby-400 hover:underline">이용약관</Link>,{' '}
                  <Link to="/refund" className="text-ruby-400 hover:underline">환불정책</Link>에 동의하며 결제를 진행합니다.
                </span>
              </label>

              {/* Payment Button */}
              <button
                onClick={handleTossPayment}
                disabled={isProcessing || !agreedToPayment}
                className={`w-full btn-primary text-base py-4 relative overflow-hidden group ${
                  (isProcessing || !agreedToPayment) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="relative z-10">
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      결제 진행중...
                    </span>
                  ) : (
                    `₩${round.price.toLocaleString()} 결제하기`
                  )}
                </span>
                {!isProcessing && agreedToPayment && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 animate-shimmer opacity-30" />
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-xs mt-4">
                토스페이먼츠를 통해 안전하게 결제됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
