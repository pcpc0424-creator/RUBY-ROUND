export default function Guide() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            참여 · 정산 <span className="text-ruby-500">안내</span>
          </h1>
          <p className="text-xl text-gray-300">
            Ruby Round의 참여 방법과 정산 방식을 안내합니다.
          </p>
        </div>

        {/* 참여비 안내 */}
        <section className="mb-16">
          <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-ruby-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-ruby-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">참여비 안내</h2>
                <p className="text-gray-300 text-lg">
                  모든 참여비는 루비 보석 악세사리 구매를 위한 <span className="text-ruby-400 font-semibold">예약금</span>입니다.
                </p>
                <p className="text-gray-400 mt-2">
                  참여비는 베팅이나 도박 자금이 아니며, 시즌 종료 시 반드시 실물 보석 또는 보석 적립금으로 전환됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 정산 방식 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">정산 방식</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 당첨 시 */}
            <div className="card border-green-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-400">당첨 시</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">확정된 티어의 보석 제공</p>
                    <p className="text-gray-400 text-sm mt-1">당첨된 티어(SS/S/A/B)에 해당하는 프리미엄 보석 주얼리가 제공됩니다.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">초과 예약금 적립금 전환</p>
                    <p className="text-gray-400 text-sm mt-1">보석 가치를 초과하는 예약금은 보석 적립금으로 자동 전환됩니다.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* 미당첨 시 */}
            <div className="card border-blue-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-400">미당첨 시</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">누적 예약금 상당 보석 제공</p>
                    <p className="text-gray-400 text-sm mt-1">시즌 동안 누적된 예약금 총액에 해당하는 루비 보석 악세사리가 제공됩니다.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">손실 없는 정산 보장</p>
                    <p className="text-gray-400 text-sm mt-1">미당첨이더라도 참여금 전액이 실물 보석으로 전환되어 손실이 없습니다.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 참여 프로세스 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">참여 프로세스</h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-dark-600 hidden md:block" />

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: '회원 가입',
                  description: 'Ruby Round 회원으로 가입하고 본인 인증을 완료합니다.',
                },
                {
                  step: 2,
                  title: '시즌 확인',
                  description: '현재 진행 중인 시즌의 정보와 라운드 구성을 확인합니다.',
                },
                {
                  step: 3,
                  title: '라운드 참여',
                  description: '원하는 라운드에 예약금을 결제하고 참여합니다. Round 1은 무료입니다.',
                },
                {
                  step: 4,
                  title: '라이브 시청',
                  description: '보석 채굴 과정을 라이브 방송으로 실시간 확인합니다.',
                },
                {
                  step: 5,
                  title: '시즌 종료 및 정산',
                  description: '시즌 종료 시 당첨 여부와 관계없이 실물 보석 또는 적립금을 받습니다.',
                },
              ].map((item, index) => (
                <div key={item.step} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`card ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <span className="text-ruby-500 font-bold">Step {item.step}</span>
                      <h3 className="text-xl font-semibold mt-2 mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-ruby-600 rounded-full items-center justify-center text-white font-bold z-10">
                    {item.step}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section>
          <div className="bg-dark-800 border border-yellow-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">환불 안내</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  시즌 진행 단계에 따라 환불 정책이 적용됩니다.
                  라운드 참여 후에는 해당 라운드의 예약금이 시즌 정산에 포함되며,
                  시즌 종료 전 환불 요청 시 약관에 따라 처리됩니다.
                  자세한 사항은 이용약관을 참고해주세요.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
