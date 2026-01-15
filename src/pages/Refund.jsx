import { Link } from 'react-router-dom';

export default function Refund() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            환불·청약철회 정책
          </h1>
          <p className="text-gray-400">
            루비라운드 서비스의 환불 및 청약철회 정책입니다.
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">

            {/* 서문 */}
            <section className="bg-dark-700/50 rounded-xl p-6">
              <p className="mb-4">
                본 정책은 루비라운드글로벌 주식회사(이하 "회사")가 운영하는 루비라운드(RUBY ROUND) 서비스에서 제공되는 라운드 참여(결제) 및 교환(주문제작) 상품과 관련한 청약철회(환불), 취소, 반품, 교환 절차를 안내합니다.
              </p>
              <p className="text-gray-400 text-sm">
                본 정책에서 정하지 않은 사항은 관련 법령 및 회사 이용약관·운영정책에 따릅니다.
              </p>
            </section>

            {/* 1. 용어 정의 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                1. 용어 정의
              </h2>
              <ul className="space-y-3 ml-4">
                <li><span className="text-ruby-400 font-medium">라운드 참여(결제):</span> 회원이 특정 시즌/라운드에 참여하기 위해 결제하는 행위(유료 라운드 포함)</li>
                <li><span className="text-ruby-400 font-medium">교환금:</span> 시즌/라운드 결과 정산에 따라 발생하는 교환 전용 잔액(현금 아님)</li>
                <li><span className="text-ruby-400 font-medium">교환(주문제작) 상품:</span> 교환금 또는 보상(티어)에 따라 회원이 신청하여 개별 제작/세팅/구성되는 보석·귀금속·액세서리 등</li>
                <li><span className="text-ruby-400 font-medium">제작 착수:</span> 회사가 회원의 교환(주문제작) 신청을 승인하고, 제작/세팅/재료 발주 등 실질적 제작 절차에 들어간 상태(운영정책 기준)</li>
                <li><span className="text-ruby-400 font-medium">접수 완료:</span> 고객센터 채널을 통해 요청이 접수되어 회사 시스템에 '접수 완료'로 기록되고, 접수 완료 안내(자동 또는 수동)가 발송된 상태</li>
              </ul>
            </section>

            {/* 2. 청약철회(환불) 기본 원칙 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                2. 청약철회(환불) 기본 원칙
              </h2>
              <p className="mb-3">
                통신판매 계약의 청약철회 가능 기간 및 방식은 관련 법령에 따르며, 일반적으로 계약내용 서면을 받은 날 또는 재화 등을 공급받은 날(공급 시작일)부터 <span className="text-ruby-400 font-medium">7일 이내</span> 청약철회가 가능합니다.
              </p>
              <p className="text-gray-400">
                다만, 아래 "청약철회 제한(주문제작 등)" 사유에 해당하는 경우에는 청약철회가 제한될 수 있습니다.
              </p>
            </section>

            {/* 3. 라운드 참여(결제) 취소/환불 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                3. 라운드 참여(결제) 취소/환불
              </h2>

              <div className="space-y-6">
                <div className="bg-ruby-950/30 border border-ruby-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-ruby-400 mb-3">3-1) 라운드 참여 취소 가능 기준 (중요)</h3>
                  <p className="mb-3">
                    라운드 참여(결제) 취소는 해당 라운드 방송에서 앵커가 "해당 라운드 화물을 오픈한다"고 고지하기 전까지, 그리고 그 이전에 <span className="text-white font-medium">고객센터에 취소 요청이 '접수 완료'</span>되어야만 가능합니다.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li><span className="text-gray-400">취소 가능 마감 시점:</span> 앵커가 해당 라운드 화물 오픈을 고지하기 직전까지</li>
                    <li><span className="text-gray-400">취소 요청 유효 기준(판단 시각):</span> 고객센터 채널을 통해 접수되어 <span className="text-white">회사 시스템에 '접수 완료'로 기록된 시각(타임스탬프)</span>을 기준으로 판단합니다. (단순 메시지 작성/전송 시각이 아니라 접수 완료 기록 시각이 기준입니다.)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3-2) "접수 완료"의 인정 범위</h3>
                  <p className="mb-2">다음 중 하나로 접수되어 <span className="text-ruby-400">'접수 완료 안내(자동 또는 수동)'</span>가 발송된 경우를 "접수 완료"로 봅니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>1:1 문의(웹 폼) 접수 완료</li>
                    <li>카카오톡 채널 문의 접수 완료(접수 완료 안내 메시지 수신)</li>
                    <li>이메일 접수(자동 접수 회신 또는 운영시간 내 접수 확인 회신)</li>
                    <li>(선택) 대표번호 문자 접수(접수 확인 회신 수신)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3-3) 마감 이후(앵커 고지 이후) 취소 제한</h3>
                  <p className="mb-3">
                    앵커가 해당 라운드 화물 오픈을 고지한 이후에는 라운드 운영의 공정성과 안정성을 위해 원칙적으로 라운드 참여 취소/환불이 제한됩니다.
                  </p>
                  <p className="mb-2">다만, 아래와 같은 <span className="text-ruby-400">회사 귀책 사유</span>가 있는 경우에는 예외적으로 취소/환불 또는 이에 준하는 조치를 할 수 있습니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>결제 오류(중복 결제 포함)</li>
                    <li>회사 시스템 장애로 정상 참여가 불가능한 경우</li>
                    <li>회사의 중대한 운영 오류로 라운드 진행이 불가능하거나 무효가 된 경우</li>
                    <li>그 밖에 법령상 환급이 필요한 경우</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3-4) 결제 취소 처리 방식</h3>
                  <p>
                    취소가 승인된 경우, 환불은 원칙적으로 결제수단과 동일한 방식으로 처리됩니다. 결제수단별 승인 취소/환급 시점은 PG사 및 카드사 정책에 따라 차이가 있을 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. 교환(주문제작) 상품의 취소/청약철회 제한 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                4. 교환(주문제작) 상품의 취소/청약철회 제한
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">4-1) 주문제작(개별 생산) 특성 안내</h3>
                  <p className="mb-3">
                    교환(주문제작) 상품은 회원의 신청에 따라 <span className="text-ruby-400 font-medium">개별 생산(주문제작)</span>되는 성격을 가질 수 있습니다. 이 경우 관련 법령이 정한 요건을 충족하는 범위에서 청약철회가 제한될 수 있습니다.
                  </p>
                  <p className="mb-2">회사는 청약철회 제한이 적용되는 상품에 대해,</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>제한 사실을 사전에 명확히 고지하고</li>
                    <li>제작 착수 전 전자문서(체크박스 등) 방식으로 동의를 받습니다.</li>
                  </ul>
                </div>

                <div className="bg-dark-700/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">4-2) 결제/승인 단계 동의 문구</h3>
                  <p className="text-gray-400 italic border-l-4 border-ruby-500 pl-4">
                    "본 상품은 고객 요청에 따라 제작되는 주문제작 상품으로, 회사의 제작 착수(승인) 이후에는 취소/청약철회가 제한될 수 있습니다. 이에 동의합니다."
                  </p>
                </div>
              </div>
            </section>

            {/* 5. 교환(주문제작) 신청의 취소/변경 규칙 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                5. 교환(주문제작) 신청의 취소/변경 규칙
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">5-1) 회사 승인(제작 착수) 전</h3>
                  <p>원칙적으로 취소/변경이 <span className="text-green-400 font-medium">가능</span>합니다.</p>
                </div>
                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">5-2) 회사 승인(제작 착수) 후</h3>
                  <p className="mb-2">원칙적으로 취소/변경이 <span className="text-red-400 font-medium">제한</span>됩니다.</p>
                  <p className="text-sm text-gray-400">예외적으로 회사가 승인하는 경우에도, 이미 발생한 실비(재료 발주, 세팅, 제작 공임, 검수/보험/특송 등)는 회원 부담이 될 수 있습니다(사전 고지된 범위 내).</p>
                </div>
              </div>
            </section>

            {/* 6. 반품/교환(하자·오배송) 기준 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                6. 반품/교환(하자·오배송) 기준
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">6-1) 접수 가능한 사유</h3>
                  <p className="mb-2">다음 사유에 해당하는 경우, 회원은 수령 후 지체 없이 고객센터로 접수할 수 있습니다.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>오배송/구성품 누락</li>
                    <li>파손/하자(제작·세팅 불량 등)</li>
                    <li>표시·광고 또는 고지 내용과 현저히 다른 경우</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">6-2) 처리 원칙</h3>
                  <div className="space-y-3">
                    <div className="bg-dark-700/50 rounded-lg p-3">
                      <p className="text-ruby-400 font-medium mb-1">회사 귀책(하자·오배송·파손 등)인 경우:</p>
                      <p className="text-sm">반품/재제작/교환/환불 등 적절한 조치를 하며, 반품(회수) 배송비는 회사가 부담합니다.</p>
                    </div>
                    <div className="bg-dark-700/50 rounded-lg p-3">
                      <p className="text-gray-400 font-medium mb-1">회원 귀책(단순변심, 착용감, 관리 부주의 등)인 경우:</p>
                      <p className="text-sm">주문제작 특성상 제한될 수 있으며, 가능하더라도 왕복 배송비 등 비용이 발생할 수 있습니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. 반품(회수) 절차 및 반품 배송비 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                7. 반품(회수) 절차 및 반품 배송비
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>반품/환불 요청은 아래 채널로 접수합니다.</li>
                <li>회사 안내에 따라 임의 반송 없이 지정 택배/회수 방식으로 진행해야 합니다.</li>
                <li>포장 훼손 및 구성품 누락은 처리 지연 또는 제한 사유가 될 수 있습니다.</li>
              </ul>
              <div className="bg-dark-700/50 rounded-xl p-4 space-y-2 text-sm">
                <p><span className="text-gray-500">반품(회수) 주소:</span> [48297] 부산 수영구 수영로 582번길 26, 102호 (광안동, 리금오피스텔) / 수령인: 루비라운드글로벌</p>
                <p><span className="text-gray-500">반품 배송비(회원 귀책 시):</span> 실비</p>
                <p><span className="text-gray-500">고가 상품 추가 절차:</span> 본인확인, 서명 수령, 영상 개봉 확인, 보험 특송 등</p>
              </div>
            </section>

            {/* 8. 환불 처리 기한 및 방법 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                8. 환불 처리 기한 및 방법
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>청약철회 또는 환불 사유가 확정된 경우, 회사는 관련 법령 및 결제수단 정책에 따라 환불을 진행합니다.</li>
                <li>환불은 원칙적으로 결제수단과 동일한 수단으로 처리되며, 결제수단별(카드/계좌이체/간편결제) 승인 취소·환급 시점은 PG사 및 카드사 정책에 따라 차이가 있을 수 있습니다.</li>
                <li>선지급식 통신판매에 해당하는 경우, 공급 곤란을 알게 된 때에는 지체 없이 통지하고 대금 지급일로부터 <span className="text-ruby-400">3영업일 이내</span> 환급 또는 환급에 필요한 조치를 합니다.</li>
              </ul>
            </section>

            {/* 9. 고객센터(문의/접수) */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                9. 고객센터(문의/접수)
              </h2>
              <div className="bg-dark-700/50 rounded-xl p-4 space-y-2">
                <p><span className="text-gray-500">문의 접수(권장):</span> 카카오톡 채널 / 1:1 문의 / 이메일 cjsql4159@rubyround.net</p>
                <p><span className="text-gray-500">운영시간:</span> 평일 10:00~18:00 / 주말·공휴일 휴무 (문의 접수 기준)</p>
              </div>
            </section>

            {/* 10. 고지 및 시행일 */}
            <section className="pt-4 border-t border-dark-600">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                10. 고지 및 시행일
              </h2>
              <p className="mb-2">
                본 정책은 법령, 이용약관, 운영정책, 상품 구성 변경 등에 따라 개정될 수 있으며, 변경 시 사이트 공지 또는 이용약관의 변경 절차에 따라 안내합니다.
              </p>
              <p className="text-ruby-400 font-medium">
                시행일: 2025년 1월 16일
              </p>
            </section>

          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
