import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-ruby-600/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[10%] w-5 h-5 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-40" />
      <div className="absolute top-60 left-[5%] w-4 h-4 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-30" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-[20%] w-3 h-3 bg-gradient-to-br from-ruby-500 to-ruby-700 rotate-45 animate-ruby-rotate opacity-35" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 left-[30%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-60 left-[15%] w-2 h-2 bg-ruby-300 rounded-full animate-sparkle" style={{ animationDelay: '1.2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero */}
        <div className="text-center mb-12 sm:mb-20">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Ruby Round <span className="text-shimmer">서비스 소개</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            실물 루비 보석을 기반으로 한 새로운 형태의 시즌제 라이브 보석 커머스입니다.
          </p>
        </div>

        {/* What is Ruby Round */}
        <section className="mb-12 sm:mb-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="animate-slide-in-left opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                Ruby Round란?
              </h2>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다.
                참여자들은 각 라운드에 예약금을 결제하고, 보석 채굴 과정을 라이브로 시청하며,
                시즌 종료 시 실물 보석을 받게 됩니다.
              </p>
              <p className="text-gray-400 mb-4 sm:mb-6 text-xs sm:text-base">
                도박이나 사행성 서비스가 아닌, 예약금 기반의 정당한 보석 커머스로서
                모든 참여자에게 실물 보석을 보장합니다.
              </p>
              <Link to="/season" className="btn-primary inline-block relative overflow-hidden group text-sm sm:text-base">
                <span className="relative z-10">현재 시즌 보기</span>
                <div className="absolute inset-0 animate-shimmer opacity-30" />
              </Link>
            </div>
            <div className="relative animate-slide-in-right opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-600/20 to-ruby-400/20 rounded-2xl sm:rounded-3xl blur-3xl animate-glow" />
              <div className="relative bg-dark-800 border border-dark-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover-glow">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: '실물 보석', sub: '100% 보장' },
                    { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', label: '라이브 방송', sub: '실시간 채굴' },
                    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: '안전한 거래', sub: '손실 없음' },
                    { icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7', label: '티어 보상', sub: '4단계 등급' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-3 sm:p-4 hover-lift animate-fade-in-scale opacity-0"
                      style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ruby-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                      </div>
                      <p className="font-semibold text-sm sm:text-base">{item.label}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            서비스 <span className="text-shimmer">구조</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { step: 1, title: '시즌 참여', desc: '하나의 시즌은 여러 라운드로 구성됩니다. Round 1은 무료 체험이며, Round 2부터 유료로 참여합니다. 참여비는 보석 구매 예약금입니다.' },
              { step: 2, title: '라이브 채굴', desc: '각 라운드에서 보석 채굴 과정이 라이브로 진행됩니다. 실시간으로 채굴 과정을 시청하며 보석 발굴의 긴장감을 경험하세요.' },
              { step: 3, title: '보상 수령', desc: '시즌 종료 시 당첨 여부와 관계없이 실물 보석을 받습니다. 당첨 시 티어 보석, 미당첨 시 예약금 상당의 보석이 제공됩니다.' },
            ].map((item, index) => (
              <div
                key={index}
                className="card text-center p-4 sm:p-6 hover-lift hover-glow animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.4 + index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ruby-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-ruby-500">{item.step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Points */}
        <section className="mb-12 sm:mb-20 animate-fade-in-scale opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-800 border border-dark-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 hover-glow">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              핵심 <span className="text-shimmer">포인트</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { title: '손실 없는 참여', desc: '모든 참여비는 예약금으로, 시즌 종료시 보석 악세사리, 귀금속 상품 / 보석 교환금으로 전환됩니다.' },
                { title: '실물 보석 보장', desc: '가상 자산이 아닌 실제 루비 보석을 받을 수 있습니다.' },
                { title: '투명한 운영', desc: '모든 채굴 과정이 라이브로 공개되어 투명하게 운영됩니다.' },
                { title: '법적 준수', desc: '전자상거래법 및 관련 법규를 준수하여 운영됩니다.' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4 animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Round 1 체험 라운드는 무료입니다.
              부담 없이 Ruby Round의 세계를 경험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/season" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 relative overflow-hidden group">
                <span className="relative z-10">시즌 참여하기</span>
                <div className="absolute inset-0 animate-shimmer opacity-30" />
              </Link>
              <Link to="/faq" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover-glow">
                자주 묻는 질문
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
