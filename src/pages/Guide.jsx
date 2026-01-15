export default function Guide() {
  const roundInfo = [
    {
      round: 'Round 1',
      title: '무료 체험',
      price: '0원',
      description: '서비스 소개 및 체험을 위한 무료 라운드',
      details: [
        '서비스 진행 방식(방송 흐름/운영 규칙) 안내',
        '화물 구성 및 결과 집계 방식 소개',
        '신규 회원의 이해도 향상',
      ],
      isFree: true,
    },
    {
      round: 'Round 2~9',
      title: '유료 참여',
      price: '유료',
      description: '예약금(선불금)으로 누적되는 유료 참여 라운드',
      details: [
        '라운드별 참여비, 정원(선착순), 방송 일정(예정) 확인',
        '참여 확정은 결제 완료 기준',
        '정원 마감 시 해당 라운드 참여 제한',
        '시즌 종료 시 실물 상품 또는 교환금 전환으로 정산',
      ],
      isFree: false,
    },
  ];

  const checklist = [
    '해당 라운드의 참여비(예약금) 및 정원',
    '방송 일정(예정) 및 운영 공지',
    '시즌 결과(보상 티어) 확정 방식',
    '교환/배송 안내 및 제한 사항',
    '환불·청약철회 기준(푸터 정책 페이지 참고)',
  ];

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[10%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" />
      <div className="absolute bottom-60 left-[5%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-60 left-[15%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '0.8s' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            시즌/라운드 <span className="text-shimmer">안내</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Ruby Round의 시즌 및 라운드 운영 방식을 안내합니다.
          </p>
        </div>

        {/* 시즌이란? */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ruby-600/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">1) 시즌(Season)이란?</h2>
                <p className="text-gray-300 text-sm sm:text-lg mb-3">
                  <span className="text-ruby-400 font-semibold">시즌은 루비라운드의 하나의 운영 단위(프로젝트 단위)</span>입니다.
                </p>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
                  각 시즌은 정해진 기간 동안 진행되며, 시즌 안에는 여러 개의 <strong className="text-white">라운드(Round)</strong>가 순서대로 운영됩니다.
                  시즌이 종료되면, 해당 시즌의 운영 결과에 따라 보상(티어)이 확정되고, 회원이 납부한 <strong className="text-white">참여비(예약금)</strong>는
                  안내된 방식에 따라 실물 상품 제공 또는 교환금 전환으로 정산됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 라운드란? */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <div className="card p-4 sm:p-6 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">2) 라운드(Round)란?</h2>
                <p className="text-gray-300 text-sm sm:text-lg mb-3">
                  <span className="text-blue-400 font-semibold">라운드는 시즌을 구성하는 '참여 단위'</span>입니다.
                </p>
                <p className="text-gray-400 text-xs sm:text-base mb-4">
                  회원은 원하는 라운드를 선택하여 참여할 수 있으며, 라운드별로 다음 요소가 사전에 고지됩니다.
                </p>
                <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    라운드 참여비(예약금)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    라운드 정원(선착순 마감)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    방송 진행 일정(예정)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    해당 라운드가 시즌 결과에 반영되는 방식
                  </li>
                </ul>
                <p className="text-gray-500 text-xs sm:text-sm mt-4">
                  라운드 참여는 결제 완료 시점에 확정되며, 정원이 마감되면 해당 라운드는 참여가 제한될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 참여비는 예약금 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-green-950/30 to-dark-800 border-green-900/50 p-4 sm:p-6 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">3) 참여비는 '예약금(선불금)'입니다</h2>
                <p className="text-gray-300 text-sm sm:text-lg mb-3">
                  루비라운드의 참여비는 <span className="text-green-400 font-semibold">판돈이나 배팅이 아니라, 보석 상품 제공을 위한 '예약금(선불금)'</span>입니다.
                </p>
                <p className="text-gray-400 text-xs sm:text-base mb-3">
                  따라서 서비스 안내는 '예약금 기반 거래' 관점으로만 제공되며, 사행성 표현은 사용하지 않습니다.
                </p>
                <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    참여비는 시즌 종료 시 실물 보석/상품 제공 또는 교환금 전환으로 귀속됩니다.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    현금 환급은 원칙적으로 제공하지 않으며, 법령상 예외(과오납/회사 귀책 등)는 별도 절차로 처리됩니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 독립 참여 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <div className="card p-4 sm:p-6 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">4) 라운드는 "독립 참여"가 기본입니다</h2>
                <p className="text-gray-300 text-sm sm:text-lg mb-3">
                  회원은 모든 라운드에 참여할 의무가 없습니다.
                </p>
                <p className="text-gray-400 text-xs sm:text-base">
                  원하는 라운드만 선택하여 참여할 수 있으며, 참여하지 않은 라운드의 결과는 해당 회원에게 적용되지 않습니다.
                  즉, <span className="text-purple-400 font-semibold">"내가 참여한 라운드의 결과만"</span> 정산 대상이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 시즌 결과 반영 방식 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <div className="card bg-gradient-to-r from-amber-950/30 to-dark-800 border-amber-900/50 p-4 sm:p-6 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">5) 라운드 참여 → 시즌 결과 반영 방식 <span className="text-amber-400">(핵심)</span></h2>
                <p className="text-gray-300 text-sm sm:text-lg mb-3">
                  루비라운드는 시즌 내 라운드 운영을 통해 <span className="text-amber-400 font-semibold">시즌 결과(보상 티어)</span>가 확정됩니다.
                </p>
                <p className="text-gray-400 text-xs sm:text-base mb-4">
                  이때 시즌 결과가 어떤 라운드에서 확정되었는지에 따라 정산 대상이 다음과 같이 결정됩니다.
                </p>
                <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    특정 라운드에서 시즌 결과가 확정되는 경우, 그 라운드 참여자가 해당 시즌 정산의 대상이 됩니다.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    참여자 모집은 라운드별로 진행되므로, 라운드마다 참여자 풀은 달라질 수 있습니다.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    시즌 결과 확정 및 정산 기준은 공지된 방식에 따라 처리되며, 관련 내용은 시즌 공지/약관/환불·청약철회 정책에서 확인할 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Round 1 & Round 2~9 */}
        <section className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            라운드별 <span className="text-shimmer">안내</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {roundInfo.map((round, index) => (
              <div
                key={round.round}
                className={`card p-4 sm:p-6 hover-lift animate-fade-in-up opacity-0 ${
                  round.isFree ? 'border-cyan-500/30' : 'border-ruby-500/30'
                }`}
                style={{ animationDelay: `${0.9 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                    round.isFree ? 'bg-cyan-500/20 text-cyan-400' : 'bg-ruby-500/20 text-ruby-400'
                  }`}>
                    {round.round}
                  </div>
                  <span className={`font-semibold ${round.isFree ? 'text-cyan-400' : 'text-ruby-400'}`}>
                    {round.price}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{round.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">{round.description}</p>
                <ul className="space-y-2">
                  {round.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        round.isFree ? 'bg-cyan-400' : 'bg-ruby-400'
                      }`} />
                      {detail}
                    </li>
                  ))}
                </ul>
                {round.isFree && (
                  <p className="text-gray-500 text-xs mt-4">
                    무료 라운드는 체험 및 안내 목적의 운영이며, 유료 라운드와 적용 기준은 시즌 공지에서 안내됩니다.
                  </p>
                )}
                {!round.isFree && (
                  <p className="text-gray-500 text-xs mt-4">
                    현금 환급은 원칙적으로 제공하지 않으며, 법령상 예외(과오납/회사 귀책 등)는 별도 절차로 처리됩니다.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 참여 전 확인사항 */}
        <section className="mb-10 sm:mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-800 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover-glow">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">8) 참여 전 확인사항(체크리스트)</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">라운드 참여 전에 아래 내용을 반드시 확인해 주세요.</p>
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
        <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="bg-dark-900/50 border border-dark-600 rounded-xl p-4 sm:p-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              본 안내는 '예약금 기반 거래' 관점으로 제공되며, 사행성 표현을 사용하지 않습니다.
              <br />
              <span className="text-ruby-400 font-semibold">만 19세 이상만 이용 가능합니다.</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
