const tiers = [
  {
    id: 'ss',
    name: 'Tier SS',
    title: '럭셔리 그랜드 라인',
    subtitle: '골드바 구성 기준',
    description: '총 700돈 구성',
    details: '50돈 × 10개 + 20돈 × 10개',
    notice: '골드바는 국제 금 시세에 따라 가치가 변동될 수 있습니다. 당사는 중량/구성 기준으로 제공합니다.',
    deliveryNotice: '고가 귀금속은 일반 택배가 아닌 전문 운송/보험/수령 확인 절차를 적용할 수 있으며, 상세는 "교환/배송 안내"에서 확인합니다.',
    color: 'from-amber-400 to-yellow-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    isGoldBar: true,
  },
  {
    id: 's',
    name: 'Tier S',
    title: '얼티밋 골드 컬렉션',
    subtitle: '골드바 구성 기준',
    description: '총 140돈 구성',
    details: '10돈 × 10개 + 5돈 × 8개',
    notice: '골드바는 국제 금 시세에 따라 가치가 변동될 수 있습니다. 당사는 중량/구성 기준으로 제공합니다.',
    deliveryNotice: '고가 귀금속은 일반 택배가 아닌 전문 운송/보험/수령 확인 절차를 적용할 수 있으며, 상세는 "교환/배송 안내"에서 확인합니다.',
    color: 'from-ruby-400 to-ruby-600',
    bgColor: 'bg-ruby-500/10',
    borderColor: 'border-ruby-500/30',
    textColor: 'text-ruby-400',
    isGoldBar: true,
  },
  {
    id: 'a',
    name: 'Tier A',
    title: '프리미엄 악세사리 시리즈',
    subtitle: '기준 링크 + 동급(상위) 제공',
    description: '기준 상품 링크와 동일 사양(동급) 또는 상위 사양의 실물 상품으로 제공',
    notice: '기준 상품이 품절·단종 등으로 제공이 어려운 경우에도, 동급(상위) 기준을 충족하는 대체 상품으로 제공됩니다.',
    specs: [
      '스톤 구성: 루비/다이아 구성(제품 표기 기준)',
      '총 중량(ct): 메인 스톤 및 서브 스톤의 총 캐럿(ct) 기준',
      '금속 소재: 14K/18K/PT 등 소재 등급 기준(동급 이상)',
      '제품 형태: 반지/목걸이/팔찌/귀걸이 등 동일 카테고리',
      '문서 제공: 제품 사양서 및 제공 문서(감정/확인서 등)',
      '완제품 제공: 세팅된 완제품 제공(디자인은 시즌 구성에 따라 상이)',
    ],
    links: [
      { label: 'Tier A 기준 링크 1', url: '#' },
      { label: 'Tier A 기준 링크 2', url: '#' },
    ],
    color: 'from-rose-400 to-rose-600',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    isGoldBar: false,
    isUpdating: true,
  },
  {
    id: 'b',
    name: 'Tier B',
    title: '스탠다드 악세사리 시리즈',
    subtitle: '기준 링크 + 동급(상위) 제공',
    description: '기준 상품 링크와 동일 사양(동급) 또는 상위 사양의 실물 상품으로 제공',
    notice: '기준 상품이 품절·단종 등으로 제공이 어려운 경우에도, 동급(상위) 기준을 충족하는 대체 상품으로 제공됩니다.',
    specs: [
      '스톤 구성: 루비/다이아 구성(제품 표기 기준)',
      '총 중량(ct): 메인 스톤 및 서브 스톤의 총 캐럿(ct) 기준',
      '금속 소재: 14K/18K/PT 등 소재 등급 기준(동급 이상)',
      '제품 형태: 반지/목걸이/팔찌/귀걸이 등 동일 카테고리',
      '문서 제공: 제품 사양서 및 제공 문서(감정/확인서 등)',
      '완제품 제공: 세팅된 완제품 제공(디자인은 시즌 구성에 따라 상이)',
    ],
    links: [
      { label: 'Tier B 기준 링크 1', url: '#' },
      { label: 'Tier B 기준 링크 2', url: '#' },
    ],
    color: 'from-pink-400 to-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    isGoldBar: false,
    isUpdating: true,
  },
];

const deliverySteps = [
  '시즌 결과(티어) 공지',
  '수령 정보 확인(배송지/연락처/수령자 확인 등)',
  '상품 제공 또는 교환 신청 절차 진행(해당 시)',
  '출고 및 수령 확인',
];

const checklist = [
  '티어는 최고 티어 1개만 적용됩니다(중복 제공 없음).',
  'SS/S 티어는 중량(돈)·구성 기준으로 제공됩니다.',
  'A/B 티어는 기준 링크 + 동급(상위) 기준으로 제공됩니다.',
  '배송/수령 절차(고가 상품) 및 필요 확인 사항을 확인해 주세요.',
  '환불·청약철회 및 예외 절차는 정책 페이지를 참고해 주세요.',
];

function TierCard({ tier, index }) {
  return (
    <div
      className={`relative animate-fade-in-up opacity-0 ${index === 0 ? 'lg:-mt-4' : ''}`}
      style={{ animationDelay: `${0.3 + index * 0.15}s`, animationFillMode: 'forwards' }}
    >
      {index === 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 sm:px-4 sm:py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-dark-900 text-[10px] sm:text-xs font-bold rounded-full animate-pulse z-10">
          HIGHEST TIER
        </div>
      )}

      {tier.isUpdating && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 sm:px-4 sm:py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-dark-900 text-[10px] sm:text-xs font-bold rounded-full z-10">
          수정 예정
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
        <p className={`${tier.textColor} font-medium text-sm sm:text-base mb-2`}>{tier.subtitle}</p>

        {tier.isGoldBar ? (
          <>
            <div className="bg-dark-700/50 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-white font-semibold text-sm sm:text-base mb-1">{tier.description}</p>
              <p className="text-gray-300 text-xs sm:text-sm">{tier.details}</p>
            </div>
            <div className="border-t border-dark-600 pt-4">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">{tier.notice}</p>
              <p className="text-gray-500 text-xs">{tier.deliveryNotice}</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">{tier.description}</p>
            <div className="border-t border-dark-600 pt-4">
              <p className="text-gray-500 text-xs sm:text-sm mb-3">동급(상위) 판단 기준</p>
              <ul className="space-y-1.5 sm:space-y-2 mb-4">
                {tier.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300">
                    <svg className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 ${tier.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {spec}
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-xs mb-3">
                천연 보석 특성상 색상/내포물/컷/디자인은 개체 차이가 있을 수 있으나, 동급(상위) 기준은 반드시 충족합니다.
              </p>
              <div className="space-y-2">
                <p className="text-gray-500 text-xs">기준 상품 링크(예시)</p>
                {tier.links.map((link, i) => (
                  <a key={i} href={link.url} className={`block text-xs ${tier.textColor} hover:underline`}>
                    {link.label}: [여기에 링크 삽입]
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
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
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            보상 <span className="text-shimmer">티어</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 mb-2 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            시즌 종료 시 제공되는 '실물 상품 라인(등급)'을 구분하는 기준입니다.
          </p>
          <p className="text-gray-400 text-xs sm:text-base max-w-3xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            참여비는 판돈이 아닌 <span className="text-ruby-400 font-semibold">보석 상품 제공을 위한 예약금(선불금)</span>입니다.
            <br />
            본 안내는 '예약금 기반 거래' 관점으로만 제공되며, 사행성 표현은 사용하지 않습니다.
          </p>
        </div>

        {/* 티어 확정 원칙 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">2) 티어 확정 원칙 <span className="text-ruby-400">(중요)</span></h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-ruby-400 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">최고 티어 1개만 적용</p>
                  <p className="text-gray-400 text-xs sm:text-sm">한 시즌에서 여러 조건이 동시에 충족되더라도 가장 높은 티어 1개만 적용됩니다(중복 제공 없음).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-ruby-400 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">티어는 시즌 결과로 확정</p>
                  <p className="text-gray-400 text-xs sm:text-sm">티어는 라운드 운영을 통해 시즌 종료 시 확정되며, 결과 및 절차는 공지된 방식에 따라 안내됩니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-ruby-400 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">티어별 제공 방식은 사전 고지</p>
                  <p className="text-gray-400 text-xs sm:text-sm">티어별 보상 구성, 제공 방식(직접 제공/교환 신청/대체 제공 규칙 등)은 시즌 공지 및 본 페이지 기준을 따릅니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 티어 구성 안내 */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.28s', animationFillMode: 'forwards' }}>
            3) 티어 구성 <span className="text-shimmer">(브랜드 라인업)</span>
          </h2>
          <p className="text-center text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.29s', animationFillMode: 'forwards' }}>
            루비라운드는 시즌 결과에 따라 아래 4개 티어 중 1개가 확정됩니다.
          </p>
        </section>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          {tiers.map((tier, index) => (
            <TierCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>

        {/* 제공/수령 방식 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="card p-4 sm:p-6 hover-glow">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">8) 제공/수령 방식(티어 확정 후)</h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">시즌 종료 후 티어가 확정되면, 보상은 아래 절차에 따라 제공됩니다.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {deliverySteps.map((step, index) => (
                <div key={index} className="bg-dark-700/50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="w-8 h-8 bg-ruby-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-ruby-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-4">
              고가 귀금속/골드바 등은 안전한 전달을 위해 수령 확인 절차가 강화될 수 있습니다.
            </p>
          </div>
        </section>

        {/* 참여 전 확인사항 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '1.0s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-800 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">9) 참여 전 확인사항(체크리스트)</h3>
                <ul className="space-y-2">
                  {checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                      <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 고정 문구 */}
        <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-900/50 border border-dark-600 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              본 안내는 '예약금 기반 거래' 관점으로 제공되며, 사행성 표현을 사용하지 않습니다.
              <br />
              한 시즌에서 여러 조건이 충족되더라도, <span className="text-ruby-400 font-semibold">최고 티어 1개만 적용됩니다(중복 제공 없음)</span>.
              <br />
              <span className="text-ruby-400 font-semibold">만 19세 이상만 이용 가능합니다.</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
