import { useState } from 'react';

const faqs = [
  {
    category: '서비스 일반',
    questions: [
      {
        q: 'Ruby Round는 어떤 서비스인가요?',
        a: 'Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다. 참여자는 라운드별로 예약금을 결제하고, 시즌 종료 시 당첨 여부와 관계없이 실물 보석을 받게 됩니다.',
      },
      {
        q: '도박이나 베팅인가요?',
        a: '아닙니다. Ruby Round는 사행성 서비스가 아닙니다. 모든 참여비는 보석 구매를 위한 예약금이며, 시즌 종료 시 반드시 실물 보석 또는 보석 적립금으로 전환됩니다. 도박과 달리 원금 손실이 발생하지 않습니다.',
      },
    ],
  },
  {
    category: '참여 및 결제',
    questions: [
      {
        q: '어떻게 참여하나요?',
        a: '회원 가입 후 현재 진행 중인 시즌의 라운드에 참여할 수 있습니다. Round 1은 무료 체험 라운드이며, Round 2부터는 예약금을 결제하고 참여합니다.',
      },
      {
        q: '참여비는 무엇인가요?',
        a: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다. 이 금액은 시즌 종료 시 실물 보석 구매 또는 보석 적립금으로 사용됩니다.',
      },
      {
        q: '모든 라운드에 참여해야 하나요?',
        a: '아니요. 원하는 라운드에만 선택적으로 참여할 수 있습니다. 다만, 더 많은 라운드에 참여할수록 더 높은 보상 티어의 기회가 열립니다.',
      },
    ],
  },
  {
    category: '보상 및 정산',
    questions: [
      {
        q: '당첨이 안 되면 손해인가요?',
        a: '아닙니다. 미당첨 시에도 시즌 동안 누적된 참여비 전액에 해당하는 실물 루비 보석 악세사리가 제공됩니다. 어떠한 경우에도 참여금이 손실되지 않습니다.',
      },
      {
        q: '보상은 어떻게 받나요?',
        a: '시즌 종료 후 확정된 보상 티어에 따라 실물 보석이 배송됩니다. 당첨 시 해당 티어의 프리미엄 보석이, 미당첨 시 누적 예약금 상당의 보석이 제공됩니다.',
      },
      {
        q: '보석 적립금은 무엇인가요?',
        a: '보석 적립금은 초과 예약금이나 특별 보상으로 적립되는 금액입니다. 향후 보석 구매나 커스텀 주얼리 제작에 사용할 수 있습니다.',
      },
    ],
  },
  {
    category: '환불 및 취소',
    questions: [
      {
        q: '환불이 가능한가요?',
        a: '시즌 진행 단계에 따라 환불 정책이 적용됩니다. 라운드 참여 전에는 전액 환불이 가능하며, 참여 후에는 약관에 따라 처리됩니다. 자세한 내용은 이용약관을 확인해주세요.',
      },
      {
        q: '시즌 중간에 탈퇴할 수 있나요?',
        a: '시즌 중간 탈퇴 시 기 참여한 라운드의 예약금은 시즌 종료 시 보석 또는 적립금으로 정산됩니다. 탈퇴 후에도 정산 권리는 유지됩니다.',
      },
    ],
  },
];

function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-dark-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 sm:py-5 flex items-center justify-between text-left hover:text-ruby-400 transition-colors group"
      >
        <span className="font-medium pr-4 text-sm sm:text-base">{question}</span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-ruby-500' : 'text-gray-500 group-hover:text-ruby-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? 'max-h-96 opacity-100 pb-4 sm:pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[15%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" />
      <div className="absolute bottom-60 left-[10%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-60 left-[20%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            자주 묻는 <span className="text-shimmer">질문</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ruby Round 서비스에 대해 궁금한 점을 확인하세요.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4 sm:space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div
              key={category.category}
              className="card p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0"
              style={{ animationDelay: `${0.3 + categoryIndex * 0.15}s`, animationFillMode: 'forwards' }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-ruby-500 rotate-45 animate-ruby-rotate" />
                {category.category}
              </h2>
              <div>
                {category.questions.map((item, index) => (
                  <FAQItem key={index} question={item.q} answer={item.a} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 sm:mt-12 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 hover-glow">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">더 궁금한 점이 있으신가요?</h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              고객센터로 문의해주시면 친절히 안내해드리겠습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="mailto:support@rubyround.net"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm sm:text-base hover-glow"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일 문의
              </a>
              <a
                href="tel:1588-0000"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm sm:text-base hover-glow"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
