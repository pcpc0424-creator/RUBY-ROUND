import { Link } from 'react-router-dom';

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-ruby-950/20 via-dark-900 to-dark-900" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-ruby-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-ruby-500/5 rounded-full blur-3xl" />

      {/* Floating ruby gems */}
      <div className="absolute top-20 left-[10%] w-4 h-4 bg-ruby-500/30 rotate-45 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-[15%] w-6 h-6 bg-ruby-400/20 rotate-45 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-[20%] w-3 h-3 bg-ruby-600/25 rotate-45 animate-float" style={{ animationDelay: '0.5s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-ruby-600/10 border border-ruby-600/30 rounded-full mb-4 sm:mb-8">
            <span className="w-2 h-2 bg-ruby-500 rounded-full animate-pulse" />
            <span className="text-ruby-400 text-xs sm:text-sm font-medium">Season 01 진행 중</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6">
            실물 루비를
            <br />
            <span className="gradient-text">발굴하다</span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-300 font-light mb-3 sm:mb-4">
            라이브로 진행되는 보석 프로젝트
          </p>

          <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mb-3 sm:mb-4">
            Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다.
          </p>

          <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mb-6 sm:mb-10">
            모든 참여 금액은 시즌 종료 시 실물 루비 보석 악세사리 또는 보석 적립금으로 전환됩니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/season" className="btn-primary text-center text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4">
              현재 시즌 참여하기
            </Link>
            <Link to="/about" className="btn-secondary text-center text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4">
              서비스 구조 알아보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Current Season Card
function CurrentSeasonCard() {
  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-ruby-600 to-ruby-400 rounded-2xl sm:rounded-3xl blur opacity-20" />

          <div className="relative bg-dark-800 border border-dark-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-ruby-600/20 text-ruby-400 text-xs sm:text-sm font-medium rounded-full">
                    진행 중
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">2024.01 ~ 진행중</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  Ruby Round <span className="text-ruby-500">Season 01</span>
                </h2>

                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                  첫 번째 시즌이 시작되었습니다. 라운드별로 참여하고 시즌 종료 시
                  확정된 보상 티어에 따라 실물 루비 보석을 받아보세요.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link to="/season" className="btn-primary text-center text-sm sm:text-base">
                    시즌 상세 보기
                  </Link>
                  <Link to="/rounds" className="btn-secondary text-center text-sm sm:text-base">
                    라운드 참여
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">현재 라운드</p>
                  <p className="text-xl sm:text-3xl font-bold text-ruby-500">Round 3</p>
                </div>
                <div className="bg-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">잔여 라운드</p>
                  <p className="text-xl sm:text-3xl font-bold">4 ~ 7</p>
                </div>
                <div className="bg-dark-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center col-span-2">
                  <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">누적 참여 금액</p>
                  <p className="text-xl sm:text-3xl font-bold text-ruby-400">₩128,500,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Service Features
function ServiceFeatures() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: '시즌 · 라운드 구조',
      description: '하나의 시즌은 여러 라운드로 구성되며 시즌당 1회의 보상 결과가 확정됩니다.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '예약금 기반 참여',
      description: '모든 라운드 참여비는 보석 구매를 위한 예약금입니다.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '실물 보석 보장',
      description: '당첨·미당첨 관계없이 시즌 종료 시 실물 보석이 제공됩니다.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: '라이브 채굴 연출',
      description: '보석 채굴 과정을 라이브 방송으로 실시간 확인할 수 있습니다.',
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Ruby Round의 <span className="text-ruby-500">핵심 가치</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            투명하고 안전한 보석 커머스 경험을 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card group hover:bg-dark-700/50 p-4 sm:p-6"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-ruby-600/10 rounded-lg sm:rounded-xl flex items-center justify-center text-ruby-500 mb-3 sm:mb-4 group-hover:bg-ruby-600/20 transition-colors">
                <div className="w-5 h-5 sm:w-8 sm:h-8">{feature.icon}</div>
              </div>
              <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm">{feature.description}</p>
            </div>
          ))}
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
        <div className="relative bg-gradient-to-r from-ruby-950 to-dark-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ruby-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-ruby-500/10 rounded-full blur-3xl" />

          <div className="relative text-center">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              지금 바로 시즌에 참여하세요
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-5 sm:mb-8">
              Round 1 체험 라운드는 무료로 참여할 수 있습니다.
              시즌의 세계관과 보석 채굴 구조를 직접 경험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/rounds" className="btn-primary text-sm sm:text-lg px-6 py-3 sm:px-10 sm:py-4">
                무료 체험 시작하기
              </Link>
              <Link to="/faq" className="btn-secondary text-sm sm:text-lg px-6 py-3 sm:px-10 sm:py-4">
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
      <CurrentSeasonCard />
      <ServiceFeatures />
      <CTASection />
    </>
  );
}
