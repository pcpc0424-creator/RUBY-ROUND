import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            개인정보처리방침
          </h1>
          <p className="text-gray-400">
            Ruby Round의 개인정보 수집 및 이용에 관한 정책입니다.
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제1조 (개인정보의 수집 항목)
              </h2>
              <p className="mb-4">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
              <div className="bg-dark-700/50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-white font-medium mb-1">필수 수집 항목</p>
                  <p className="text-gray-400">이름, 이메일, 비밀번호, 휴대폰 번호</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">선택 수집 항목</p>
                  <p className="text-gray-400">배송지 주소, 생년월일</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">자동 수집 항목</p>
                  <p className="text-gray-400">IP 주소, 쿠키, 서비스 이용 기록, 접속 로그</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제2조 (개인정보의 수집 및 이용 목적)
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>회원 가입 및 관리: 회원제 서비스 제공, 본인 확인, 부정 이용 방지</li>
                <li>서비스 제공: 시즌 참여, 보석 배송, 결제 처리</li>
                <li>고객 지원: 문의 응대, 불만 처리, 공지사항 전달</li>
                <li>마케팅: 이벤트 정보 제공, 맞춤형 서비스 제공 (동의 시)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제3조 (개인정보의 보유 및 이용 기간)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 파기합니다.</li>
                <li>단, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-400">
                    <li>계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
                    <li>대금결제 및 재화 공급 기록: 5년 (전자상거래법)</li>
                    <li>소비자 불만 또는 분쟁 처리 기록: 3년 (전자상거래법)</li>
                    <li>접속 기록: 3개월 (통신비밀보호법)</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제4조 (개인정보의 제3자 제공)
              </h2>
              <p className="mb-4">회사는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령에 의거하거나 수사 목적으로 수사기관의 요청이 있는 경우</li>
                <li>서비스 제공에 필요한 경우 (배송업체, 결제대행사 등)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제5조 (개인정보의 파기)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄 또는 소각</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제6조 (이용자의 권리)
              </h2>
              <p className="mb-4">이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제7조 (개인정보 보호책임자)
              </h2>
              <div className="bg-dark-700/50 rounded-lg p-4">
                <ul className="space-y-1 text-gray-400">
                  <li>성명: 홍길동</li>
                  <li>직책: 개인정보보호책임자</li>
                  <li>이메일: privacy@rubyround.com</li>
                  <li>전화: 1588-0000</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제8조 (쿠키의 사용)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>회사는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다.</li>
                <li>이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li>
                <li>쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</li>
              </ul>
            </section>

            <section className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm">
                본 개인정보처리방침은 2024년 1월 1일부터 시행됩니다.
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
