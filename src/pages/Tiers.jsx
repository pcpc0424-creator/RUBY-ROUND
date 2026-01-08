const tiers = [
  {
    id: 'ss',
    name: 'Tier SS',
    title: 'Luxury Brand Jewel Line',
    description: '명품 브랜드 정품 보석 제공',
    details: '세계적인 명품 브랜드의 프리미엄 보석 컬렉션. 최고급 루비와 다이아몬드가 세팅된 하이엔드 주얼리가 제공됩니다.',
    color: 'from-amber-400 to-yellow-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    features: [
      '명품 브랜드 정품 보증서',
      '최고급 버마산 루비',
      'GIA 인증 다이아몬드',
      '화이트 골드 또는 플래티넘 세팅',
      '프리미엄 패키지 & 케이스',
    ],
  },
  {
    id: 's',
    name: 'Tier S',
    title: 'Ultimate Ruby Collection',
    description: '하이엔드 루비 보석 컬렉션',
    details: '엄선된 최상급 루비로 구성된 프리미엄 컬렉션. 희소성 높은 피전 블러드 루비가 포함됩니다.',
    color: 'from-ruby-400 to-ruby-600',
    bgColor: 'bg-ruby-500/10',
    borderColor: 'border-ruby-500/30',
    textColor: 'text-ruby-400',
    features: [
      '피전 블러드 루비 포함',
      '18K 골드 세팅',
      '국제 감정서 발급',
      '프리미엄 주얼리 케이스',
      '1년 무상 A/S',
    ],
  },
  {
    id: 'a',
    name: 'Tier A',
    title: 'Premium Ruby Series',
    description: '프리미엄 루비 주얼리 라인',
    details: '고품질 천연 루비를 사용한 프리미엄 주얼리 시리즈. 세련된 디자인과 뛰어난 품질을 자랑합니다.',
    color: 'from-rose-400 to-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    features: [
      'AA등급 천연 루비',
      '14K 골드 세팅',
      '국내 감정서 발급',
      '주얼리 케이스 포함',
      '6개월 무상 A/S',
    ],
  },
  {
    id: 'b',
    name: 'Tier B',
    title: 'Standard Ruby Package',
    description: '스탠다드 루비 주얼리 구성',
    details: '일상에서 착용하기 좋은 스탠다드 루비 주얼리 패키지. 합리적인 가격대의 천연 루비 제품입니다.',
    color: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    features: [
      'A등급 천연 루비',
      '10K 골드 또는 실버 세팅',
      '품질 보증서 발급',
      '기본 케이스 포함',
      '3개월 무상 A/S',
    ],
  },
];

function TierCard({ tier, index }) {
  return (
    <div
      className={`relative animate-fade-in-up opacity-0 ${index === 0 ? 'lg:-mt-4' : ''}`}
      style={{ animationDelay: `${0.2 + index * 0.15}s`, animationFillMode: 'forwards' }}
    >
      {index === 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 sm:px-4 sm:py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-dark-900 text-[10px] sm:text-xs font-bold rounded-full animate-pulse z-10">
          HIGHEST TIER
        </div>
      )}

      <div className={`card p-4 sm:p-6 hover-lift transition-all duration-500 ${tier.borderColor} ${index === 0 ? 'ring-2 ring-amber-500/20 animate-border-glow' : 'hover-glow'}`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${tier.bgColor}`}>
            <span className={`font-bold text-xs sm:text-sm ${tier.textColor}`}>{tier.name}</span>
          </div>
          <div className="flex gap-0.5 sm:gap-1">
            {[...Array(4 - index)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 sm:w-3 sm:h-3 rotate-45 bg-gradient-to-br ${tier.color} ${index === 0 ? 'animate-ruby-rotate' : ''}`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{tier.title}</h3>
        <p className={`${tier.textColor} font-medium text-sm sm:text-base mb-2 sm:mb-4`}>{tier.description}</p>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{tier.details}</p>

        <div className="border-t border-dark-600 pt-4 sm:pt-6">
          <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">포함 사항</p>
          <ul className="space-y-1.5 sm:space-y-2">
            {tier.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300"
              >
                <svg className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${tier.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Tiers() {
  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[10%] w-5 h-5 bg-gradient-to-br from-amber-400 to-yellow-600 rotate-45 animate-ruby-rotate opacity-40" />
      <div className="absolute top-60 left-[5%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-[20%] w-3 h-3 bg-gradient-to-br from-rose-400 to-rose-600 rotate-45 animate-ruby-rotate opacity-35" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 left-[30%] w-2 h-2 bg-amber-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-60 left-[15%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            보상 <span className="text-shimmer">티어</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 mb-2 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            시즌 종료 시 충족된 조건에 따라 단 하나의 보상 티어가 확정됩니다.
          </p>
          <p className="text-gray-400 text-xs sm:text-base max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            참여한 라운드와 누적 예약금에 따라 더 높은 티어의 보상을 받을 기회가 열립니다.
            모든 참여자는 최소 Tier B 이상의 실물 보석을 보장받습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>

        {/* Notice */}
        <div className="mt-6 sm:mt-12 bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ruby-600/20 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">보상 확정 안내</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                보상 티어는 시즌 종료 시점에 최종 확정됩니다. 당첨 시 해당 티어의 보석이 제공되며,
                미당첨 시에도 누적 참여금에 해당하는 실물 보석 또는 보석 적립금으로 전환됩니다.
                어떠한 경우에도 참여금이 손실되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
