import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            이용약관
          </h1>
          <p className="text-gray-400">
            Ruby Round 서비스 이용약관입니다.
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제1조 (목적)
              </h2>
              <p>
                이 약관은 Ruby Round(이하 "회사")가 제공하는 실물 루비 보석 라이브 커머스 서비스(이하 "서비스")의 이용과 관련하여
                회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제2조 (정의)
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>"서비스"란 회사가 제공하는 시즌제 라이브 보석 커머스 플랫폼을 말합니다.</li>
                <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</li>
                <li>"시즌"이란 회사가 정한 일정 기간 동안 진행되는 보석 참여 프로그램을 말합니다.</li>
                <li>"라운드"란 시즌 내에서 개별적으로 진행되는 참여 단위를 말합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제3조 (약관의 효력 및 변경)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.</li>
                <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 서비스 내 공지합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제4조 (서비스의 제공)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>회사는 시즌제 실물 루비 보석 커머스 서비스를 제공합니다.</li>
                <li>모든 참여 금액은 시즌 종료 시 실물 보석 또는 이에 상응하는 적립금으로 제공됩니다.</li>
                <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
                <li>회사는 시스템 점검 등의 필요에 의해 서비스를 일시 중단할 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제5조 (이용자의 의무)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>이용자는 서비스 이용 시 관련 법령 및 본 약관의 규정을 준수해야 합니다.</li>
                <li>이용자는 타인의 개인정보를 도용하거나 부정한 목적으로 서비스를 이용해서는 안 됩니다.</li>
                <li>이용자는 서비스의 안정적 운영을 방해하는 행위를 해서는 안 됩니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제6조 (면책조항)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
                <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
              </ul>
            </section>

            <section className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm">
                본 약관은 2024년 1월 1일부터 시행됩니다.
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
