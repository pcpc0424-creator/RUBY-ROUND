import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Ruby Round <span className="text-ruby-500">서비스 소개</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            실물 루비 보석을 기반으로 한 새로운 형태의 시즌제 라이브 보석 커머스입니다.
          </p>
        </div>

        {/* What is Ruby Round */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Ruby Round란?
              </h2>
              <p className="text-gray-300 mb-4">
                Ruby Round는 실물 루비 및 보석을 기반으로 한 시즌제 라이브 보석 커머스입니다.
                참여자들은 각 라운드에 예약금을 결제하고, 보석 채굴 과정을 라이브로 시청하며,
                시즌 종료 시 실물 보석을 받게 됩니다.
              </p>
              <p className="text-gray-400 mb-6">
                도박이나 사행성 서비스가 아닌, 예약금 기반의 정당한 보석 커머스로서
                모든 참여자에게 실물 보석을 보장합니다.
              </p>
              <Link to="/season" className="btn-primary">
                현재 시즌 보기
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-600/20 to-ruby-400/20 rounded-3xl blur-3xl" />
              <div className="relative bg-dark-800 border border-dark-600 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="font-semibold">실물 보석</p>
                    <p className="text-gray-500 text-sm">100% 보장</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-semibold">라이브 방송</p>
                    <p className="text-gray-500 text-sm">실시간 채굴</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="font-semibold">안전한 거래</p>
                    <p className="text-gray-500 text-sm">손실 없음</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <p className="font-semibold">티어 보상</p>
                    <p className="text-gray-500 text-sm">4단계 등급</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            서비스 <span className="text-ruby-500">구조</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ruby-500">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">시즌 참여</h3>
              <p className="text-gray-400 text-sm">
                하나의 시즌은 여러 라운드로 구성됩니다.
                Round 1은 무료 체험이며, Round 2부터 유료로 참여합니다.
                참여비는 보석 구매 예약금입니다.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ruby-500">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">라이브 채굴</h3>
              <p className="text-gray-400 text-sm">
                각 라운드에서 보석 채굴 과정이 라이브로 진행됩니다.
                실시간으로 채굴 과정을 시청하며
                보석 발굴의 긴장감을 경험하세요.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-ruby-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ruby-500">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">보상 수령</h3>
              <p className="text-gray-400 text-sm">
                시즌 종료 시 당첨 여부와 관계없이
                실물 보석을 받습니다. 당첨 시 티어 보석,
                미당첨 시 예약금 상당의 보석이 제공됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="mb-20">
          <div className="bg-dark-800 border border-dark-600 rounded-3xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              핵심 <span className="text-ruby-500">포인트</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">손실 없는 참여</h3>
                  <p className="text-gray-400 text-sm">
                    모든 참여비는 예약금으로, 시즌 종료 시 반드시 보석으로 전환됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">실물 보석 보장</h3>
                  <p className="text-gray-400 text-sm">
                    가상 자산이 아닌 실제 루비 보석을 받을 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">투명한 운영</h3>
                  <p className="text-gray-400 text-sm">
                    모든 채굴 과정이 라이브로 공개되어 투명하게 운영됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">법적 준수</h3>
                  <p className="text-gray-400 text-sm">
                    전자상거래법 및 관련 법규를 준수하여 운영됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Round 1 체험 라운드는 무료입니다.
              부담 없이 Ruby Round의 세계를 경험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/season" className="btn-primary text-lg px-8 py-4">
                시즌 참여하기
              </Link>
              <Link to="/faq" className="btn-secondary text-lg px-8 py-4">
                자주 묻는 질문
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
