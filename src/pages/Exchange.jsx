const processSteps = [
  {
    step: 1,
    title: '고객 교환 신청',
    description: '마이페이지 > 상품 교환 신청하기에서 신청',
    details: '희망 상품/예산/선호(반지·목걸이 등)/사이즈/배송지 입력',
  },
  {
    step: 2,
    title: '1차 CS 확인(주문요청/상담)',
    description: 'CS가 신청 내용을 확인하고, 필요 시 상담(옵션/사양/납기/유의사항)을 진행합니다.',
    details: '처리 목표(SLA): 영업일 기준 24시간 이내 \'CS 주문요청 완료\' 상태까지 처리',
  },
  {
    step: 3,
    title: '2차 대표 승인(최종 확정)',
    description: '대표 승인 완료 시 주문이 확정되며, 제작/출고 단계로 전환됩니다.',
    details: '',
  },
  {
    step: 4,
    title: '제작/출고/배송 진행',
    description: '제작 또는 출고가 진행되며, 단계별 상태가 마이페이지에 표시됩니다.',
    details: '',
  },
];

const faqItems = [
  {
    question: '교환금은 현금으로 돌려받을 수 있나요?',
    answer: '교환금은 상품 교환을 위한 잔액으로 운영되며, 현금 환급은 원칙적으로 불가합니다(법정 예외 제외).',
  },
  {
    question: '주문제작도 가능한가요?',
    answer: '가능합니다. 교환 신청 후 CS 상담을 통해 예산/선호/사양을 확정하고 대표 승인 후 진행됩니다.',
  },
  {
    question: '교환 신청을 취소/변경할 수 있나요?',
    answer: '대표 승인 전까지 가능합니다. 승인 이후에는 제작/출고가 진행될 수 있어 제한될 수 있습니다.',
  },
];

export default function Exchange() {
  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[15%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" />
      <div className="absolute bottom-60 left-[10%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '0.7s' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            교환/<span className="text-shimmer">배송</span> 안내
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            시즌 종료 후 교환금(적립금) 사용, 상품 교환 신청, 배송/수령 절차를 투명하게 안내합니다.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            본 서비스 안내는 '예약금 기반 거래' 관점으로 제공되며, 사행성 표현은 사용하지 않습니다.
          </p>
        </div>

        {/* 용어 정의 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">2) 용어 정의</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ruby-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">참여비 = 예약금(선불금)</p>
                  <p className="text-gray-400 text-xs sm:text-sm">라운드 참여를 위한 보석 상품 제공 예약금입니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ruby-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">교환금(적립금)</p>
                  <p className="text-gray-400 text-xs sm:text-sm">시즌 종료 정산 후 발생하는 교환 전용 잔액입니다. 교환금은 상품 교환에만 사용되며, 현금 환급은 원칙적으로 불가합니다(법정 예외 제외).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-ruby-400 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">교환 상품</p>
                  <p className="text-gray-400 text-xs sm:text-sm">교환금으로 신청 가능한 보석/귀금속 상품(완제품 또는 주문제작 포함)입니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 교환금 발생 및 정산 원칙 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="card p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">3) 교환금 발생 및 정산 원칙</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-ruby-400 mb-3">3-1) 기본 원칙</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3">시즌 종료 후 회원의 예약금은 아래 방식으로 정산됩니다.</p>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  티어 보상 제공(SS/S/A/B) 및
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  정산 결과에 따라 발생하는 교환금(잔액) 전환
                </li>
              </ul>
              <p className="text-gray-500 text-xs mt-3">
                교환금은 <strong className="text-white">원화(KRW) 기준으로 표시되는 '교환 전용 잔액'</strong>이며, 서비스 내 안내 기준에 따라 상품 교환에 사용됩니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ruby-400 mb-3">3-2) 교환금 산정 개요(이해를 돕는 설명)</h3>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span><strong className="text-white">티어 보상이 제공되는 경우:</strong> 예약금 중 일부가 티어 보상 제공에 반영되고, 남는 잔액이 교환금으로 전환될 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span><strong className="text-white">티어 보상이 제공되지 않는 경우:</strong> 정산 기준에 따라 예약금 전액이 교환금으로 전환될 수 있습니다.</span>
                </li>
              </ul>
              <p className="text-gray-500 text-xs mt-3">
                교환금의 상세 산정 방식 및 적용 기준은 시즌 공지 및 정책에 따릅니다.
              </p>
            </div>
          </div>
        </section>

        {/* 교환 신청 기준 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-amber-950/30 to-dark-800 border-amber-900/50 p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">4) 교환 신청 기준 <span className="text-amber-400">(필수)</span></h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-dark-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">교환 신청 최소 금액</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">300,000원</p>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs mb-1">교환 신청 최대 금액</p>
                <p className="text-xl sm:text-2xl font-bold text-white">제한 없음</p>
                <p className="text-gray-500 text-xs">(단, 주문제작/재고/운송 가능 범위 내)</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              교환 상품은 고정 구성(정해진 목록)만 운영하지 않을 수 있으며, 고객 요청 금액·견적 기반 <strong className="text-white">주문제작 방식(상담 필수)</strong>으로 진행될 수 있습니다.
            </p>
          </div>
        </section>

        {/* 교환 신청 프로세스 */}
        <section className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            5) 교환 신청 <span className="text-shimmer">프로세스</span>
          </h2>
          <p className="text-center text-gray-400 text-xs sm:text-sm mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.42s', animationFillMode: 'forwards' }}>
            교환 신청은 아래 절차로 진행됩니다.
          </p>

          <div className="space-y-4">
            {processSteps.map((item, index) => (
              <div
                key={item.step}
                className="card p-4 sm:p-6 hover-lift animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.45 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ruby-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-ruby-400 font-bold text-lg sm:text-xl">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-300 text-sm sm:text-base mb-1">{item.description}</p>
                    {item.details && (
                      <p className="text-gray-500 text-xs sm:text-sm">{item.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 취소/변경 규정 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.85s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-800 border border-red-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-red-400">6) 취소/변경 규정(중요)</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-2">
                  주문제작/구성 확정 후에는 제작이 시작될 수 있으므로, <strong className="text-white">취소/변경은 '대표 승인 전'까지만 가능</strong>합니다.
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  대표 승인 이후 취소/변경은 원칙적으로 제한될 수 있으며, 불가피한 사유는 CS를 통해 별도 안내됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 배송 안내 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="card p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">7) 배송 안내</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">7-1) 배송 방식</h3>
                <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    일반 상품은 일반 택배로 발송될 수 있습니다.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    고가 귀금속/골드바 등 고가품은 안전한 전달을 위해 전문 운송, 보험, 수령 확인 절차가 적용될 수 있습니다.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">7-2) 배송지/수령 정보</h3>
                <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    배송지, 수령자 성명, 연락처는 정확히 입력해 주세요.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    고가품의 경우 분실 방지 및 안전 배송을 위해 <strong className="text-white">수령 확인(서명/본인 확인)</strong>이 요구될 수 있습니다.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">7-3) 배송 추적 및 안내</h3>
                <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    출고 이후 운송장 정보(또는 배송 진행 상태)는 마이페이지에서 확인할 수 있습니다.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    배송 일정은 제작 여부, 운송 방식, 지역 및 택배사 사정에 따라 달라질 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 수령/검수 안내 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.95s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-green-950/30 to-dark-800 border-green-900/50 p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">8) 수령/검수 안내 <span className="text-green-400">(권장)</span></h2>
            <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                상품 수령 즉시 <strong className="text-white">외관 및 구성품(보증서/사양서 포함)</strong>을 확인해 주세요.
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                파손/오배송/구성 누락이 확인되면, 수령 후 가능한 빠르게 고객센터로 접수해 주세요(사진/영상 첨부 권장).
              </li>
            </ul>
          </div>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            9) 자주 묻는 <span className="text-shimmer">질문</span>
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="card p-4 sm:p-6 hover-glow">
                <h3 className="text-ruby-400 font-semibold text-sm sm:text-base mb-2">
                  Q. {item.question}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  A. {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 고정 문구 */}
        <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-900/50 border border-dark-600 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              본 안내는 '예약금 기반 거래' 관점으로 제공되며, 사행성 표현을 사용하지 않습니다.
              <br />
              <span className="text-ruby-400 font-semibold">현금 환급은 원칙적으로 불가하며, 법정 예외는 별도 절차로 처리됩니다.</span>
              <br />
              <span className="text-ruby-400 font-semibold">만 19세 이상만 이용 가능합니다.</span>
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <div className="mt-8 sm:mt-12 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '1.15s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 hover-glow">
            <h3 className="text-lg sm:text-xl font-bold mb-2">교환/배송 문의</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              추가 문의사항은 고객센터로 연락해주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:support@rubyround.com"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일 문의
              </a>
              <a
                href="tel:1588-0000"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화 문의 (1588-0000)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
