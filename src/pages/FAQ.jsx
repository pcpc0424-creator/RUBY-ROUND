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

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-dark-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-ruby-400 transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-400 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            자주 묻는 <span className="text-ruby-500">질문</span>
          </h1>
          <p className="text-gray-400">
            Ruby Round 서비스에 대해 궁금한 점을 확인하세요.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category) => (
            <div key={category.category} className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-ruby-500 rotate-45" />
                {category.category}
              </h2>
              <div>
                {category.questions.map((item, index) => (
                  <FAQItem key={index} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50">
            <h3 className="text-xl font-bold mb-3">더 궁금한 점이 있으신가요?</h3>
            <p className="text-gray-400 mb-6">
              고객센터로 문의해주시면 친절히 안내해드리겠습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@rubyround.com"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일 문의
              </a>
              <a
                href="tel:1588-0000"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
