import { Link } from 'react-router-dom';

// Floating Particles for background
function FloatingGems() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[10%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-40" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-[15%] w-6 h-6 bg-gradient-to-br from-ruby-500 to-ruby-700 rotate-45 animate-ruby-rotate opacity-30" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-[20%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-35" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-32 left-[30%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-48 right-[25%] w-2 h-2 bg-ruby-300 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }} />
    </div>
  );
}

// Season Overview
function SeasonOverview() {
  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      <FloatingGems />

      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-ruby-600/10 border border-ruby-600/30 rounded-full mb-4 sm:mb-6 animate-fade-in-down glass" style={{ animationDelay: '0.1s' }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ruby-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ruby-500" />
            </span>
            <span className="text-ruby-400 text-xs sm:text-sm font-medium">현재 진행 중</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ruby Round <span className="text-shimmer">Season 01</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 mb-3 sm:mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Ruby Round 시즌은 하나의 보석 프로젝트 단위로 운영되며,
            시즌 종료 시 단 한 번의 보상 결과가 확정됩니다.
          </p>

          <p className="text-sm sm:text-base text-gray-400 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            각 라운드에 참여할수록 더 높은 보상 티어의 기회가 열리며,
            시즌 내 모든 참여금은 실물 보석으로 전환됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

// Season Progress Structure
function SeasonStructure() {
  const stages = [
    {
      round: 'Round 1',
      title: '체험 라운드',
      description: '무료 참여, 시즌 세계관과 보석 채굴 구조 체험',
      status: 'completed',
      price: '무료',
    },
    {
      round: 'Round 2',
      title: '탐사 라운드',
      description: '보석 탐사의 첫 단계, 기본 채굴 시작',
      status: 'completed',
      price: '₩500,000',
    },
    {
      round: 'Round 3',
      title: '발굴 라운드',
      description: '본격적인 보석 발굴, 중급 원석 접근',
      status: 'current',
      price: '₩1,000,000',
    },
    {
      round: 'Round 4',
      title: 'Deep Cargo',
      description: '더 깊은 화물 레이어 개봉, 보석 밀도 증가',
      status: 'upcoming',
      price: '₩1,800,000',
    },
    {
      round: 'Round 5',
      title: 'Core Mining',
      description: '핵심 채굴 구역 진입, 희귀 원석 확률 상승',
      status: 'upcoming',
      price: '₩2,500,000',
    },
    {
      round: 'Round 6',
      title: 'Ruby Vein',
      description: '루비 광맥 접근, 고급 원석 채굴',
      status: 'upcoming',
      price: '₩3,500,000',
    },
    {
      round: 'Round 7',
      title: 'Final Extraction',
      description: '최종 추출, 최고급 보석 확정',
      status: 'upcoming',
      price: '₩5,000,000',
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-dark-800/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          시즌 진행 <span className="text-shimmer">구조</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-base text-center mb-6 sm:mb-12 max-w-2xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          시즌은 총 7개의 라운드로 구성되며, 라운드가 진행될수록 보상 기대치가 상승합니다
        </p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-ruby-600 via-dark-600 to-dark-600 hidden lg:block" />

          <div className="space-y-3 sm:space-y-6">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="relative animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-8 w-4 h-4 rounded-full -translate-x-1/2 hidden lg:block transition-all duration-500 ${
                  stage.status === 'completed' ? 'bg-ruby-600' :
                  stage.status === 'current' ? 'bg-ruby-500 ring-4 ring-ruby-500/30 animate-pulse' :
                  'bg-dark-600'
                }`} />

                <div className={`lg:ml-16 card p-4 sm:p-6 hover-lift transition-all duration-500 ${
                  stage.status === 'current' ? 'border-ruby-600/50 bg-ruby-950/20 animate-border-glow' : 'hover-glow'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <span className={`text-xs sm:text-sm font-medium ${
                          stage.status === 'completed' ? 'text-gray-500' :
                          stage.status === 'current' ? 'text-ruby-400' :
                          'text-gray-400'
                        }`}>
                          {stage.round}
                        </span>
                        {stage.status === 'current' && (
                          <span className="px-1.5 py-0.5 sm:px-2 bg-ruby-600 text-white text-[10px] sm:text-xs rounded-full animate-pulse">
                            참여 가능
                          </span>
                        )}
                        {stage.status === 'completed' && (
                          <span className="px-1.5 py-0.5 sm:px-2 bg-dark-600 text-gray-400 text-[10px] sm:text-xs rounded-full">
                            종료
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-xl font-semibold mb-0.5 sm:mb-1">{stage.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{stage.description}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                      <div className="sm:text-right">
                        <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">참여비 (예약금)</p>
                        <p className={`text-base sm:text-xl font-bold ${
                          stage.price === '무료' ? 'text-green-400' : 'text-ruby-400'
                        }`}>
                          {stage.price}
                        </p>
                      </div>
                      {stage.status === 'current' && (
                        <Link to="/rounds" className="btn-primary whitespace-nowrap text-xs sm:text-base px-3 py-1.5 sm:px-6 sm:py-3 relative overflow-hidden group">
                          <span className="relative z-10">참여하기</span>
                          <div className="absolute inset-0 animate-shimmer opacity-30" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement info */}
        <div className="mt-6 sm:mt-12 card p-4 sm:p-6 bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 hover-glow animate-fade-in-scale opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ruby-600/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">시즌 종료 시 정산</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                당첨/미당첨에 따라 실물 루비 보석 또는 보석 적립금으로 정산됩니다.
                모든 참여비는 실물 보석 구매를 위한 예약금이며, 어떠한 경우에도 손실 없이
                보석 또는 적립금으로 전환됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Legal Notice
function LegalNotice() {
  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">법적 고지</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                본 시즌은 확률형 금융상품 또는 사행성 서비스가 아닙니다. 모든 참여비는 실물 보석 구매를 위한 예약금이며,
                시즌 종료 시 반드시 실물 보석 또는 이에 상응하는 적립금으로 제공됩니다.
                Ruby Round는 전자상거래법 및 관련 법규를 준수하며 운영됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Season() {
  return (
    <>
      <SeasonOverview />
      <SeasonStructure />
      <LegalNotice />
    </>
  );
}
