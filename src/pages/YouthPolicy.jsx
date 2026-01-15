import { Link } from 'react-router-dom';

export default function YouthPolicy() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            청소년보호정책
          </h1>
          <p className="text-gray-400">
            Ruby Round의 청소년 보호를 위한 정책입니다.
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            {/* Notice Banner */}
            <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4">
              <p className="text-ruby-400 font-medium">
                Ruby Round는 청소년이 건전한 인터넷 환경에서 서비스를 이용할 수 있도록 청소년보호정책을 수립하여 운영하고 있습니다.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제1조 (목적)
              </h2>
              <p>
                본 정책은 청소년보호법에 따라 청소년이 유해한 정보로부터 보호받을 수 있도록 하고,
                청소년의 건전한 인터넷 이용환경을 조성하기 위해 Ruby Round가 수행하는 청소년 보호 활동에 관한 사항을 규정합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제2조 (이용 제한)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>본 서비스는 만 19세 이상의 성인만 이용 가능합니다.</li>
                <li>회원 가입 시 본인인증을 통해 연령을 확인합니다.</li>
                <li>만 19세 미만의 청소년은 서비스 가입 및 이용이 제한됩니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제3조 (청소년 보호를 위한 조치)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  <span className="text-white">본인인증 의무화:</span>
                  <span className="text-gray-400 ml-2">모든 회원은 가입 시 본인인증을 완료해야 합니다.</span>
                </li>
                <li>
                  <span className="text-white">결제 제한:</span>
                  <span className="text-gray-400 ml-2">청소년 명의의 결제수단으로는 결제가 불가능합니다.</span>
                </li>
                <li>
                  <span className="text-white">이용시간 제한:</span>
                  <span className="text-gray-400 ml-2">청소년 보호법에 따른 이용시간 제한 정책을 준수합니다.</span>
                </li>
                <li>
                  <span className="text-white">유해정보 차단:</span>
                  <span className="text-gray-400 ml-2">청소년에게 유해한 정보가 노출되지 않도록 관리합니다.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제4조 (유해정보의 표시)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>19세 이용가 표시를 통해 청소년 접근을 제한합니다.</li>
                <li>유해정보에 대한 표시 및 경고 문구를 게시합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제5조 (청소년보호책임자)
              </h2>
              <p className="mb-4">회사는 청소년 보호를 위해 청소년보호책임자를 지정하고 있습니다.</p>
              <div className="bg-dark-700/50 rounded-lg p-4">
                <ul className="space-y-1 text-gray-400">
                  <li>성명: 김보호</li>
                  <li>직책: 청소년보호책임자</li>
                  <li>이메일: youth@rubyround.com</li>
                  <li>전화: 1588-0000</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제6조 (신고 및 상담)
              </h2>
              <p className="mb-4">청소년 유해정보 또는 청소년 보호 관련 문의사항은 아래로 신고 및 상담하실 수 있습니다:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">회사 신고센터</p>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>이메일: report@rubyround.com</li>
                    <li>전화: 1588-0000</li>
                  </ul>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">외부 기관</p>
                  <ul className="space-y-1 text-gray-400 text-sm">
                    <li>방송통신심의위원회: 1377</li>
                    <li>청소년보호위원회: 1388</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제7조 (교육 및 홍보)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>임직원을 대상으로 청소년 보호에 관한 교육을 정기적으로 실시합니다.</li>
                <li>청소년 보호와 관련된 법령 및 제도 변경 시 즉시 반영합니다.</li>
                <li>이용자에게 청소년 보호의 중요성을 홍보합니다.</li>
              </ul>
            </section>

            <section className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm">
                본 청소년보호정책은 2024년 1월 1일부터 시행됩니다.
              </p>
            </section>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-ruby-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
