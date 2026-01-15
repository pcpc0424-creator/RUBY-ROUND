import { Link } from 'react-router-dom';

export default function Refund() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            환불·청약철회
          </h1>
          <p className="text-gray-400">
            Ruby Round 서비스의 환불 및 청약철회 정책입니다.
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제1조 (청약철회의 기준)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>이용자는 서비스 참여 후 7일 이내에 청약철회를 요청할 수 있습니다.</li>
                <li>청약철회는 서비스 내 마이페이지 또는 고객센터를 통해 신청할 수 있습니다.</li>
                <li>시즌이 종료된 후에는 청약철회가 불가능합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제2조 (환불 절차)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>환불 신청이 접수되면 영업일 기준 3일 이내에 검토가 완료됩니다.</li>
                <li>환불 승인 후 결제 수단에 따라 3~7일 이내에 환불이 처리됩니다.</li>
                <li>신용카드 결제의 경우 카드사 정책에 따라 환불 기간이 다를 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제3조 (환불 제한 사항)
              </h2>
              <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4 mb-4">
                <p className="text-ruby-400 font-medium mb-2">다음의 경우 환불이 제한됩니다:</p>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>시즌이 종료되어 보석 배송이 진행 중인 경우</li>
                <li>이미 실물 보석을 수령한 경우</li>
                <li>적립금으로 전환하여 사용한 경우</li>
                <li>서비스 이용약관을 위반하여 서비스 이용이 제한된 경우</li>
                <li>참여 후 7일이 경과한 경우 (단, 시즌 종료 전에 한함)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제4조 (부분 환불)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>복수의 라운드에 참여한 경우 개별 라운드 단위로 부분 환불이 가능합니다.</li>
                <li>부분 환불 시에도 각 라운드별 환불 가능 기간이 적용됩니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제5조 (환불 수수료)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>참여 후 24시간 이내 환불 신청 시: 전액 환불</li>
                <li>참여 후 24시간 ~ 7일 이내 환불 신청 시: 결제 금액의 3% 수수료 공제 후 환불</li>
                <li>수수료는 결제 대행사 수수료 및 운영 비용에 해당합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제6조 (보석 교환 및 반품)
              </h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>실물 보석 수령 후 7일 이내에 교환 또는 반품을 신청할 수 있습니다.</li>
                <li>보석의 하자가 있는 경우 무상으로 교환됩니다.</li>
                <li>단순 변심에 의한 반품 시 배송비는 이용자 부담입니다.</li>
                <li>보석 감정서와 함께 제공된 보석만 교환/반품이 가능합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제7조 (문의처)
              </h2>
              <div className="bg-dark-700/50 rounded-lg p-4">
                <p className="mb-2">환불 및 청약철회와 관련된 문의:</p>
                <ul className="space-y-1 text-gray-400">
                  <li>이메일: refund@rubyround.com</li>
                  <li>고객센터: 1588-0000 (평일 09:00~18:00)</li>
                  <li>카카오톡: @rubyround</li>
                </ul>
              </div>
            </section>

            <section className="pt-4 border-t border-dark-600">
              <p className="text-gray-500 text-sm">
                본 정책은 2024년 1월 1일부터 시행됩니다.
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
