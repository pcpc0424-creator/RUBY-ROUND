import { Link } from 'react-router-dom';

// Floating Ruby Particles Component
function FloatingParticles() {
  return (
    <div className="particles-container">
      {/* Large decorative rubies */}
      <div className="absolute top-20 left-[10%] w-5 h-5 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-60" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-[15%] w-7 h-7 bg-gradient-to-br from-ruby-500 to-ruby-700 rotate-45 animate-ruby-rotate opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-[20%] w-4 h-4 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-50" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-60 left-[5%] w-3 h-3 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-40 right-[10%] w-6 h-6 bg-gradient-to-br from-ruby-500 to-ruby-700 rotate-45 animate-ruby-rotate opacity-35" style={{ animationDelay: '2s' }} />

      {/* Sparkle effects */}
      <div className="absolute top-32 left-[30%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-56 right-[25%] w-2 h-2 bg-ruby-300 rounded-full animate-sparkle" style={{ animationDelay: '0.8s' }} />
      <div className="absolute bottom-48 left-[40%] w-1.5 h-1.5 bg-ruby-500 rounded-full animate-sparkle" style={{ animationDelay: '1.3s' }} />
      <div className="absolute top-72 left-[60%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '1.8s' }} />
      <div className="absolute bottom-60 right-[35%] w-1.5 h-1.5 bg-ruby-300 rounded-full animate-sparkle" style={{ animationDelay: '2.3s' }} />

      {/* Floating particles */}
      <div className="particle top-[15%] left-[25%]" style={{ animationDelay: '0s', animationDuration: '7s' }} />
      <div className="particle top-[45%] left-[75%]" style={{ animationDelay: '2s', animationDuration: '9s' }} />
      <div className="particle top-[65%] left-[15%]" style={{ animationDelay: '4s', animationDuration: '8s' }} />
      <div className="particle top-[25%] left-[85%]" style={{ animationDelay: '1s', animationDuration: '6s' }} />
      <div className="particle top-[75%] left-[55%]" style={{ animationDelay: '3s', animationDuration: '10s' }} />
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-ruby-950/20 via-dark-900 to-dark-900" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-ruby-700/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '3s' }} />

      {/* Floating ruby particles */}
      <FloatingParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl">
          {/* Season badge with pulse ring */}
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-ruby-600/10 border border-ruby-600/30 rounded-full mb-4 sm:mb-8 animate-fade-in-down glass">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ruby-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ruby-500" />
            </span>
            <span className="text-ruby-400 text-xs sm:text-sm font-medium">Season 01 진행 중</span>
          </div>

          {/* Main heading with staggered animation */}
          <div className="overflow-hidden mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                실물 루비를
              </span>
              <span className="block animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <span className="text-shimmer">발굴하다</span>
              </span>
            </h1>
          </div>

          {/* Subheading with animation */}
          <p className="text-lg sm:text-2xl text-gray-300 font-light mb-3 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            라이브로 진행되는 보석 프로젝트
          </p>

          <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mb-3 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다.
          </p>

          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mb-6 sm:mb-10 animate-fade-in-up opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            모든 참여비는 루비 등 보석류 악세사리/귀금속 상품 구매를 위한 예약금(선불금)이며, 시즌 종료시 반드시 실물 상품 또는 보석 교환금(적립금)으로 제공됩니다.
          </p>

          {/* CTA buttons with animation */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            <Link
              to="/season"
              className="btn-primary text-center text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 relative overflow-hidden group"
            >
              <span className="relative z-10">현재 시즌 참여하기</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-shimmer opacity-30" />
            </Link>
            <Link
              to="/about"
              className="btn-secondary text-center text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 hover-glow"
            >
              서비스 구조 알아보기
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-ruby-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// 시즌/라운드 안내 섹션
function SeasonRoundGuide() {
  const guideItems = [
    {
      number: '1',
      title: '시즌(Season)이란?',
      highlight: '시즌은 루비라운드의 하나의 운영 단위(프로젝트 단위)',
      description: '각 시즌은 정해진 기간 동안 진행되며, 시즌 안에는 여러 개의 라운드(Round)가 순서대로 운영됩니다. 시즌이 종료되면, 해당 시즌의 운영 결과에 따라 보상(티어)이 확정되고, 회원이 납부한 참여비(예약금)는 안내된 방식에 따라 실물 상품 제공 또는 교환금 전환으로 정산됩니다.',
      color: 'ruby',
    },
    {
      number: '2',
      title: '라운드(Round)란?',
      highlight: '라운드는 시즌을 구성하는 \'참여 단위\'',
      description: '회원은 원하는 라운드를 선택하여 참여할 수 있으며, 라운드별로 참여비(예약금), 정원(선착순 마감), 방송 진행 일정이 사전에 고지됩니다. 라운드 참여는 결제 완료 시점에 확정됩니다.',
      color: 'blue',
    },
    {
      number: '3',
      title: '참여비는 \'예약금(선불금)\'입니다',
      highlight: '판돈이나 배팅이 아니라, 보석 상품 제공을 위한 \'예약금(선불금)\'',
      description: '참여비는 시즌 종료 시 실물 보석/상품 제공 또는 교환금 전환으로 귀속됩니다. 현금 환급은 원칙적으로 제공하지 않으며, 법령상 예외(과오납/회사 귀책 등)는 별도 절차로 처리됩니다.',
      color: 'green',
    },
    {
      number: '4',
      title: '라운드는 "독립 참여"가 기본입니다',
      highlight: '"내가 참여한 라운드의 결과만" 정산 대상',
      description: '회원은 모든 라운드에 참여할 의무가 없습니다. 원하는 라운드만 선택하여 참여할 수 있으며, 참여하지 않은 라운드의 결과는 해당 회원에게 적용되지 않습니다.',
      color: 'purple',
    },
    {
      number: '5',
      title: '라운드 참여 → 시즌 결과 반영 방식',
      highlight: '시즌 결과(보상 티어)가 확정되는 핵심 구조',
      description: '특정 라운드에서 시즌 결과가 확정되는 경우, 그 라운드 참여자가 해당 시즌 정산의 대상이 됩니다. 참여자 모집은 라운드별로 진행되므로, 라운드마다 참여자 풀은 달라질 수 있습니다.',
      color: 'amber',
    },
  ];

  const colorMap = {
    ruby: { bg: 'bg-ruby-600/20', text: 'text-ruby-400', border: 'border-ruby-500/30' },
    blue: { bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    green: { bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-500/30' },
    purple: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    amber: { bg: 'bg-amber-600/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  };

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            시즌/라운드 <span className="text-shimmer">안내</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-300 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ruby Round의 시즌 및 라운드 운영 방식을 안내합니다.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {guideItems.map((item, index) => {
            const colors = colorMap[item.color];
            return (
              <div
                key={item.number}
                className={`card p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0 ${colors.border}`}
                style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={`${colors.text} font-bold text-lg sm:text-xl`}>{item.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                    <p className={`${colors.text} font-semibold text-sm sm:text-base mb-2`}>{item.highlight}</p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 라운드 안내 카드 */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-8">
          <div className="card p-4 sm:p-6 border-cyan-500/30 hover-lift animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-cyan-500/20 text-cyan-400">
                Round 1
              </div>
              <span className="font-semibold text-cyan-400">0원</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">무료 체험</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">서비스 소개 및 체험을 위한 무료 라운드</p>
            <ul className="space-y-2">
              {['서비스 진행 방식(방송 흐름/운영 규칙) 안내', '화물 구성 및 결과 집계 방식 소개', '신규 회원의 이해도 향상'].map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4 sm:p-6 border-ruby-500/30 hover-lift animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-ruby-500/20 text-ruby-400">
                Round 2~9
              </div>
              <span className="font-semibold text-ruby-400">유료</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">유료 참여</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4">예약금(선불금)으로 누적되는 유료 참여 라운드</p>
            <ul className="space-y-2">
              {['라운드별 참여비, 정원(선착순), 방송 일정(예정) 확인', '참여 확정은 결제 완료 기준', '시즌 종료 시 실물 상품 또는 교환금 전환으로 정산'].map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-ruby-400 rounded-full mt-2 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// 보상(티어) 안내 섹션
function TierGuide() {
  const tiers = [
    {
      name: 'Tier SS',
      title: '럭셔리 그랜드 라인',
      subtitle: '골드바 구성 기준',
      description: '총 700돈 구성',
      details: '50돈 × 10개 + 20돈 × 10개',
      color: 'amber',
      isHighest: true,
    },
    {
      name: 'Tier S',
      title: '얼티밋 골드 컬렉션',
      subtitle: '골드바 구성 기준',
      description: '총 140돈 구성',
      details: '10돈 × 10개 + 5돈 × 8개',
      color: 'ruby',
      isHighest: false,
    },
    {
      name: 'Tier A',
      title: '프리미엄 악세사리 시리즈',
      subtitle: '기준 링크 + 동급(상위) 제공',
      description: '기준 상품 링크와 동일 사양(동급) 또는 상위 사양의 실물 상품으로 제공',
      color: 'rose',
      isHighest: false,
      isUpdating: true,
    },
    {
      name: 'Tier B',
      title: '스탠다드 악세사리 시리즈',
      subtitle: '기준 링크 + 동급(상위) 제공',
      description: '기준 상품 링크와 동일 사양(동급) 또는 상위 사양의 실물 상품으로 제공',
      color: 'pink',
      isHighest: false,
      isUpdating: true,
    },
  ];

  const colorMap = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', gradient: 'from-amber-400 to-yellow-600' },
    ruby: { bg: 'bg-ruby-500/10', text: 'text-ruby-400', border: 'border-ruby-500/30', gradient: 'from-ruby-400 to-ruby-600' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', gradient: 'from-rose-400 to-rose-600' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', gradient: 'from-pink-400 to-pink-600' },
  };

  return (
    <section className="py-12 sm:py-20 bg-dark-800/50 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            보상 <span className="text-shimmer">티어</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-300 mb-2 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            시즌 종료 시 제공되는 '실물 상품 라인(등급)'을 구분하는 기준입니다.
          </p>
          <p className="text-gray-400 text-xs sm:text-base max-w-3xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            참여비는 판돈이 아닌 <span className="text-ruby-400 font-semibold">보석 상품 제공을 위한 예약금(선불금)</span>입니다.
          </p>
        </div>

        {/* 티어 확정 원칙 */}
        <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 mb-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
          <h3 className="text-lg sm:text-xl font-bold mb-4">티어 확정 원칙 <span className="text-ruby-400">(중요)</span></h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-ruby-400 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">최고 티어 1개만 적용</p>
                <p className="text-gray-400 text-xs">중복 제공 없음</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-ruby-400 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">티어는 시즌 결과로 확정</p>
                <p className="text-gray-400 text-xs">시즌 종료 시 확정</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-ruby-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-ruby-400 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">제공 방식은 사전 고지</p>
                <p className="text-gray-400 text-xs">시즌 공지 기준</p>
              </div>
            </div>
          </div>
        </div>

        {/* 티어 카드 */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {tiers.map((tier, index) => {
            const colors = colorMap[tier.color];
            return (
              <div
                key={tier.name}
                className={`relative card p-4 sm:p-6 hover-lift animate-fade-in-up opacity-0 ${colors.border} ${tier.isHighest ? 'ring-2 ring-amber-500/20' : ''}`}
                style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {tier.isHighest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-dark-900 text-[10px] sm:text-xs font-bold rounded-full">
                    HIGHEST TIER
                  </div>
                )}
                {tier.isUpdating && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-orange-400 to-orange-500 text-dark-900 text-[10px] sm:text-xs font-bold rounded-full">
                    수정 예정
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${colors.bg}`}>
                    <span className={`font-bold text-xs sm:text-sm ${colors.text}`}>{tier.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(4 - index)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 sm:w-3 sm:h-3 rotate-45 bg-gradient-to-br ${colors.gradient}`} />
                    ))}
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-1">{tier.title}</h4>
                <p className={`${colors.text} font-medium text-sm mb-2`}>{tier.subtitle}</p>
                <p className="text-gray-300 text-sm sm:text-base font-semibold">{tier.description}</p>
                {tier.details && <p className="text-gray-400 text-xs sm:text-sm mt-1">{tier.details}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 교환/배송 안내 섹션
function ExchangeGuide() {
  const processSteps = [
    { step: 1, title: '고객 교환 신청', description: '마이페이지 > 상품 교환 신청하기에서 신청' },
    { step: 2, title: '1차 CS 확인', description: 'CS가 신청 내용을 확인하고, 필요 시 상담을 진행합니다.' },
    { step: 3, title: '2차 대표 승인', description: '대표 승인 완료 시 주문이 확정됩니다.' },
    { step: 4, title: '제작/출고/배송', description: '제작 또는 출고가 진행됩니다.' },
  ];

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            교환/<span className="text-shimmer">배송</span> 안내
          </h2>
          <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            시즌 종료 후 교환금(적립금) 사용, 상품 교환 신청, 배송/수령 절차를 투명하게 안내합니다.
          </p>
        </div>

        {/* 용어 정의 */}
        <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 mb-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h3 className="text-lg sm:text-xl font-bold mb-4">용어 정의</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-white font-medium text-sm">참여비 = 예약금(선불금)</p>
              <p className="text-gray-400 text-xs">라운드 참여를 위한 보석 상품 제공 예약금</p>
            </div>
            <div>
              <p className="text-white font-medium text-sm">교환금(적립금)</p>
              <p className="text-gray-400 text-xs">시즌 종료 정산 후 발생하는 교환 전용 잔액</p>
            </div>
            <div>
              <p className="text-white font-medium text-sm">교환 상품</p>
              <p className="text-gray-400 text-xs">교환금으로 신청 가능한 보석/귀금속 상품</p>
            </div>
          </div>
        </div>

        {/* 교환 신청 기준 */}
        <div className="card bg-gradient-to-r from-amber-950/30 to-dark-800 border-amber-900/50 p-4 sm:p-6 mb-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <h3 className="text-lg sm:text-xl font-bold mb-4">교환 신청 기준 <span className="text-amber-400">(필수)</span></h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-dark-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">교환 신청 최소 금액</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">300,000원</p>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">교환 신청 최대 금액</p>
              <p className="text-xl sm:text-2xl font-bold text-white">제한 없음</p>
              <p className="text-gray-500 text-xs">(주문제작/재고/운송 가능 범위 내)</p>
            </div>
          </div>
        </div>

        {/* 교환 신청 프로세스 */}
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          교환 신청 <span className="text-shimmer">프로세스</span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {processSteps.map((item, index) => (
            <div
              key={item.step}
              className="card p-4 sm:p-6 hover-lift text-center animate-fade-in-up opacity-0"
              style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ruby-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-ruby-400 font-bold text-lg sm:text-xl">{item.step}</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base mb-1">{item.title}</h4>
              <p className="text-gray-400 text-xs sm:text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* 취소/변경 규정 */}
        <div className="bg-dark-800 border border-red-500/30 rounded-xl p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-2 text-red-400">취소/변경 규정(중요)</h4>
              <p className="text-gray-300 text-sm sm:text-base">
                주문제작/구성 확정 후에는 제작이 시작될 수 있으므로, <strong className="text-white">취소/변경은 '대표 승인 전'까지만 가능</strong>합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 하단 고정 안내 문구
function BottomNotice() {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-900/50 border border-dark-600 rounded-xl p-4 sm:p-6 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            본 안내는 '예약금 기반 거래' 관점으로 제공되며, 사행성 표현을 사용하지 않습니다.
            <br />
            한 시즌에서 여러 조건이 충족되더라도, <span className="text-ruby-400 font-semibold">최고 티어 1개만 적용됩니다(중복 제공 없음)</span>.
            <br />
            <span className="text-ruby-400 font-semibold">현금 환급은 원칙적으로 불가하며, 법정 예외는 별도 절차로 처리됩니다.</span>
            <br />
            <span className="text-ruby-400 font-semibold">만 19세 이상만 이용 가능합니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-ruby-950 to-dark-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16 overflow-hidden group animate-fade-in-scale opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {/* Animated background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-pulse" />

          {/* Floating rubies in CTA */}
          <div className="absolute top-10 right-20 w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-40" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-16 left-16 w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-30" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-10 w-5 h-5 bg-gradient-to-br from-ruby-500 to-ruby-700 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '1.5s' }} />

          <div className="relative text-center">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              지금 바로 시즌에 참여하세요
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-5 sm:mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              Round 1 체험 라운드는 무료로 참여할 수 있습니다.
              시즌의 세계관과 보석 채굴 구조를 직접 경험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <Link
                to="/rounds"
                className="btn-primary text-sm sm:text-lg px-6 py-3 sm:px-10 sm:py-4 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">무료 체험 시작하기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 animate-shimmer opacity-30" />
              </Link>
              <Link to="/faq" className="btn-secondary text-sm sm:text-lg px-6 py-3 sm:px-10 sm:py-4 hover-glow">
                자주 묻는 질문
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <SeasonRoundGuide />
      <TierGuide />
      <ExchangeGuide />
      <BottomNotice />
      <CTASection />
    </>
  );
}
