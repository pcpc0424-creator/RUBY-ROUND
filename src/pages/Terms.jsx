import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            이용약관
          </h1>
          <p className="text-gray-400">
            루비라운드 서비스 이용약관입니다.
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">

            {/* 목차 */}
            <section className="bg-dark-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">목차</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제1장 총칙</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제1조 목적</li>
                    <li>제2조 정의</li>
                    <li>제3조 약관의 명시·개정 및 해석</li>
                    <li>제4조 운영정책의 적용</li>
                    <li>제5조 서비스 성격 및 사행성 표현 미사용 원칙</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제2장 회원</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제6조 회원가입</li>
                    <li>제7조 회원정보의 변경</li>
                    <li>제8조 계정 관리 및 보호</li>
                    <li>제9조 회원 탈퇴 및 자격 제한</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제3장 시즌/라운드 참여 및 결제</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제10조 서비스 구성: 시즌/라운드</li>
                    <li>제11조 참여 신청 및 청약확인</li>
                    <li>제12조 대금 결제 및 결제 취소</li>
                    <li>제13조 거래기록의 보존 및 오류 방지</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제4장 보상(티어), 교환금, 교환/배송</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제14조 보상(티어) 및 결과 산정</li>
                    <li>제15조 교환금의 정의·부여·사용·유효기간</li>
                    <li>제16조 교환(주문제작) 신청 및 승인 절차</li>
                    <li>제17조 배송, 수령확인, 보험 및 위험부담</li>
                    <li>제18조 제작·출고 지연 및 공급 불가 시 조치</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제5장 청약철회/환불/반품</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제19조 청약철회 등</li>
                    <li>제20조 청약철회 등의 제한: 주문제작 등</li>
                    <li>제21조 환급 및 환급에 필요한 조치</li>
                    <li>제22조 오류 적립·부정사용의 정정/회수</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제6장 금지행위 및 제재</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제23조 금지행위</li>
                    <li>제24조 서비스 이용 제한 및 계약 해제·해지</li>
                    <li>제25조 분쟁조정 및 고객센터</li>
                  </ul>
                </div>
                <div>
                  <p className="text-ruby-400 font-medium mb-2">제7장 개인정보/표시·광고/책임</p>
                  <ul className="space-y-1 text-gray-400">
                    <li>제26조 개인정보보호</li>
                    <li>제27조 표시·광고 및 정보 제공</li>
                    <li>제28조 손해배상</li>
                    <li>제29조 면책 및 책임 제한</li>
                    <li>제30조 준거법 및 관할</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제1장 총칙 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제1장 총칙</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제1조 (목적)
                  </h3>
                  <p>
                    본 약관은 루비라운드글로벌 주식회사(이하 "회사")가 운영하는 웹사이트 및 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 회원 간의 권리·의무 및 책임사항, 이용조건과 절차 등 기본사항을 규정함을 목적으로 합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제2조 (정의)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>"사이트"란 회사가 서비스를 제공하기 위하여 운영하는 온라인 채널(도메인 포함)을 말합니다.</li>
                    <li>"회원"이란 본 약관에 동의하고 회원가입을 완료하여 회사로부터 서비스 이용자격을 부여받은 자를 말합니다.</li>
                    <li>"시즌"이란 회사가 정한 기간 또는 회차 단위의 서비스 운영 구간을 말합니다.</li>
                    <li>"라운드"란 시즌 내에서 회사가 정한 참여 단위(회차/회수/참여구간)를 말합니다.</li>
                    <li>"참여"란 회원이 회사가 정한 방식에 따라 라운드에 참여 신청을 하고 대금을 결제(또는 무상 참여 포함)하는 행위를 말합니다.</li>
                    <li>"참여대금"이란 회원이 라운드 참여를 위해 결제하는 대금을 말하며, 회사가 고지한 바에 따라 재화(상품) 제공 또는 교환금 부여와 연동되는 선지급 대금의 성격을 가질 수 있습니다.</li>
                    <li>"보상(티어)"란 라운드 결과에 따라 회사가 사전에 고지한 기준으로 결정되는 보상 등급(SS/S/A/B 등)을 말합니다.</li>
                    <li>"당첨상품"이란 라운드 결과에 따라 확정되는 보상 상품(귀금속/보석류 등)을 말합니다.</li>
                    <li>"교환금"이란 라운드 결과에 따라 회사 기준에 의해 산정·부여되어 회원이 교환(주문제작) 신청에 사용할 수 있는 서비스 내 지급수단을 말합니다(현금 아님).</li>
                    <li>"운영정책"이란 고객센터 운영, 처리기한(SLA), 교환/배송 세부절차, 제한사유, 공지 방식 등 회사가 별도로 정하여 사이트에 게시하는 세부 기준을 말합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제3조 (약관의 명시·개정 및 해석)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 사이트에 게시합니다.</li>
                    <li>회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
                    <li>약관을 개정하는 경우 회사는 시행일 및 개정사유, 주요 변경내용을 명시하여 다음 각 호의 기간 동안 공지합니다.
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>회원에게 불리하지 않은 일반 변경: 시행일 7일 전</li>
                        <li>회원에게 불리하거나 중요한 변경(권리·의무, 비용 부담 등): 시행일 15일 전</li>
                      </ul>
                    </li>
                    <li>본 약관에서 정하지 아니한 사항이나 해석에 대하여는 관련 법령 및 상관례에 따릅니다.</li>
                    <li>약관 조항이 신의성실 원칙을 위반하여 공정성을 잃은 경우 무효가 될 수 있으며, 회사는 고의·중과실 책임을 부당하게 배제하지 않습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제4조 (운영정책의 적용)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 서비스 운영을 위하여 운영정책을 제정·개정할 수 있습니다.</li>
                    <li>운영정책은 본 약관과 함께 서비스 이용에 적용되며, 약관과 운영정책이 충돌하는 경우 회원에게 더 유리한 기준을 우선 적용합니다.</li>
                    <li>운영정책 중 회원에게 불리하거나 중요한 변경은 제3조 제3항의 기준에 준하여 공지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제5조 (서비스 성격 및 사행성 표현 미사용 원칙)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 서비스의 외부 커뮤니케이션에서 "배팅/판돈/잭팟/대박/일확천금" 등 사행성·도박성 표현을 사용하지 않는 것을 운영 원칙으로 합니다.</li>
                    <li>회사는 라운드 결과, 보상(티어), 교환금 산정 기준 등 중요한 정보를 사이트 공지 및 안내를 통해 투명하게 제공합니다(단, 보안·공정성·운영상 필요에 따라 일부 세부 기준은 운영정책으로 관리될 수 있습니다).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제2장 회원 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제2장 회원</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제6조 (회원가입)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회원가입은 이용자가 본 약관 및 개인정보 처리에 대한 동의를 한 후 회사가 정한 절차에 따라 가입신청을 하고, 회사가 이를 승낙함으로써 완료됩니다.</li>
                    <li>회사는 다음 각 호에 해당하는 경우 가입을 승낙하지 않거나 사후에 취소할 수 있습니다.
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li>타인의 정보 도용 등 허위로 신청한 경우</li>
                        <li>만 19세 미만인 경우(회사 정책상 성인만 이용 가능)</li>
                        <li>서비스 운영을 현저히 저해하거나 관련 법령 위반 소지가 큰 경우</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제7조 (회원정보의 변경)
                  </h3>
                  <p>
                    회원은 회원정보가 변경된 경우 지체 없이 수정하여야 하며, 미수정으로 발생한 불이익은 회원의 책임으로 합니다.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제8조 (계정 관리 및 보호)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>아이디 및 비밀번호 관리 책임은 회원에게 있습니다.</li>
                    <li>회원은 계정의 도용 또는 부정사용을 인지한 경우 즉시 회사에 통지하여야 합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제9조 (회원 탈퇴 및 자격 제한)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회원은 언제든지 탈퇴를 요청할 수 있으며 회사는 관련 법령 및 정당한 처리기간 내에 처리합니다.</li>
                    <li>회사는 회원이 본 약관 또는 운영정책을 위반한 경우 사전 통지 후 이용을 제한할 수 있습니다(긴급·중대 사안은 사후 통지 가능).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제3장 시즌/라운드 참여 및 결제 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제3장 시즌/라운드 참여 및 결제</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제10조 (서비스 구성: 시즌/라운드)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>서비스는 시즌 단위로 운영되며, 시즌은 복수의 라운드로 구성될 수 있습니다.</li>
                    <li>라운드의 참여 방식(유료/무료), 참여 기간, 참여대금, 결과 산정 기준, 보상(티어) 구성, 교환/배송 방식 등은 사이트 공지 및 각 라운드 안내에서 정합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제11조 (참여 신청 및 청약확인)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회원은 회사가 정한 절차(참여 페이지, 결제 페이지 등)에 따라 참여 신청을 할 수 있습니다.</li>
                    <li>회사는 전자상거래에서 소비자의 조작 실수 등을 방지하기 위한 확인·정정 절차를 마련합니다.</li>
                    <li>회사는 참여 신청 접수 후 청약 의사표시 수신 확인 및 판매(진행) 가능 여부를 신속히 안내합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제12조 (대금 결제 및 결제 취소)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>참여대금의 결제수단은 회사가 제공하는 결제수단 중 회원이 선택합니다.</li>
                    <li>결제 취소 가능 시점/방법은 각 라운드 안내 및 운영정책에 따르며, 결제수단별로 PG사 정책이 함께 적용될 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제13조 (거래기록의 보존 및 오류 방지)
                  </h3>
                  <p>
                    회사는 관련 법령에 따라 거래기록을 보존하고, 거래 안정성을 위하여 필요한 조치를 취할 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 제4장 보상(티어), 교환금, 교환/배송 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제4장 보상(티어), 교환금, 교환/배송</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제14조 (보상(티어) 및 결과 산정)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>라운드 결과에 따라 보상(티어)이 결정되며, 티어는 다음과 같이 구성됩니다.
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                        <li><span className="text-ruby-400 font-medium">SS:</span> 럭셔리 그랜드 라인</li>
                        <li><span className="text-ruby-400 font-medium">S:</span> 얼티밋 골드 컬렉션</li>
                        <li><span className="text-ruby-400 font-medium">A:</span> 프리미엄 악세사리 시리즈</li>
                        <li><span className="text-ruby-400 font-medium">B:</span> 스탠다드 악세사리 시리즈</li>
                      </ul>
                    </li>
                    <li>라운드 결과 산정 기준 및 티어별 제공 내용은 각 라운드 안내 또는 보상 안내 페이지에 따릅니다.</li>
                    <li>회사는 티어별 제공 상품을 특정 "금액 상당"으로 단정하여 표시하지 않을 수 있으며, 대신 동일 사양(동급) 기준의 상품 제공 원칙 및 구체 구성은 안내 페이지에서 고지할 수 있습니다(운영상 필요 시 동급 내에서 디자인/재고/제작 여건에 따라 변경 가능).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제15조 (교환금의 정의·부여·사용·유효기간)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>교환금은 현금이 아니며, 회사가 제공하는 교환(주문제작) 상품 신청에 사용할 수 있습니다.</li>
                    <li>교환금은 양도·대여·담보제공이 불가하며, 이자나 배당이 발생하지 않습니다.</li>
                    <li>교환금 유효기간은 무기한입니다. 다만, 법령·감독지침 변경, 서비스 종료 등 불가피한 사유가 있는 경우 회사는 사전 공지 후 합리적인 범위에서 처리하며, 법령상 환급 등 의무가 발생하는 경우 관계 법령에 따릅니다.</li>
                    <li>오류 적립, 취소/환불, 부정사용이 확인되는 경우 회사는 교환금을 정정·회수할 수 있습니다(제22조).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제16조 (교환(주문제작) 신청 및 승인 절차)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>교환(주문제작) 신청은 회원이 사이트 또는 회사가 정한 채널로 신청하며, 회사는 아래 절차로 처리할 수 있습니다.
                      <p className="ml-6 mt-2 text-gray-400">회원 신청 → 고객센터 1차 확인(주문요청/사양확인) → 회사(대표 등) 승인 → 제작/출고</p>
                    </li>
                    <li>교환 신청 금액은 최소 300,000원 이상으로 하며, 상한은 운영정책에서 정할 수 있습니다.</li>
                    <li>주문제작 특성상 취소/변경은 원칙적으로 '회사 승인(제작 착수) 전'까지만 가능하며, 세부 기준은 운영정책에 따릅니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제17조 (배송, 수령확인, 보험 및 위험부담)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>배송 방법, 배송비 부담, 평균 소요기간, 수령확인 절차는 교환/배송 안내 및 운영정책에 따릅니다.</li>
                    <li>고가 상품은 분실·파손 리스크 관리를 위해 보험 가입, 본인확인, 서명 수령, 촬영 등 추가 절차를 적용할 수 있으며, 회원은 합리적 범위에서 협조하여야 합니다.</li>
                    <li>주소 오기재, 수령거부 등 회원 귀책으로 인한 추가 비용은 회원이 부담할 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제18조 (제작·출고 지연 및 공급 불가 시 조치)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 회원의 청약일로부터 관련 법령이 정한 기간 내에 재화 공급에 필요한 조치를 하며, 선지급식 통신판매에 해당하는 경우에는 법령상 기한을 준수합니다.</li>
                    <li>공급이 곤란한 경우 회사는 지체 없이 사유를 통지하고, 선지급식 통신판매에 해당하는 경우 법령이 정한 기간 내에 환급 또는 환급에 필요한 조치를 합니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제5장 청약철회/환불/반품 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제5장 청약철회/환불/반품</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제19조 (청약철회 등)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회원은 관련 법령에 따라 일정 기간 내 청약철회 등을 할 수 있습니다.</li>
                    <li>청약철회 절차, 반품 주소, 비용 부담 기준은 법령 및 운영정책에 따릅니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제20조 (청약철회 등의 제한: 주문제작 등)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회원의 주문에 따라 개별적으로 생산되는 주문제작 상품 등은, 청약철회를 인정할 경우 회사에 회복할 수 없는 중대한 피해가 예상되는 경우에 한하여 사전에 별도 고지하고 회원의 서면(전자문서 포함) 동의를 받은 때 청약철회가 제한될 수 있습니다.</li>
                    <li>회사는 위 제한을 적용하는 경우 결제(또는 제작 착수) 단계에서 제한 사실을 명확히 표시하고 동의를 받습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제21조 (환급 및 환급에 필요한 조치)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>청약철회, 공급 불가 등으로 환급 사유가 발생하는 경우 회사는 관련 법령 및 결제수단 정책에 따라 환급을 진행합니다.</li>
                    <li>선지급식 통신판매에 해당하는 경우 회사는 법령상 환급 기한 및 조치를 준수합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제22조 (오류 적립·부정사용의 정정/회수)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>시스템 오류, 운영상 착오, 부정사용 등으로 교환금 또는 제공 내용이 잘못 부여된 경우 회사는 합리적 범위에서 정정·회수할 수 있습니다.</li>
                    <li>회사는 정정·회수 전에 사유와 근거를 안내하며, 회원은 이의가 있는 경우 고객센터를 통해 소명할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제6장 금지행위 및 제재 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제6장 금지행위 및 제재</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제23조 (금지행위)
                  </h3>
                  <p className="mb-2">회원은 다음 행위를 하여서는 안 됩니다.</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>타인의 정보 도용, 결제수단 부정사용</li>
                    <li>서비스 결과/상품/교환금 관련 허위 주장, 반복 민원으로 업무 방해</li>
                    <li>환불/반품 제도의 악용, 부정수령, 교환금 부정거래</li>
                    <li>사이트/시스템 해킹, 리버스엔지니어링, 자동화 수단을 통한 비정상 이용</li>
                    <li>관계 법령 또는 공서양속에 반하는 행위</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제24조 (서비스 이용 제한 및 계약 해제·해지)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 금지행위 또는 약관 위반이 확인되는 경우 경고, 이용정지, 계약 해제·해지 등 조치를 할 수 있습니다.</li>
                    <li>중대한 위반 또는 긴급한 사안은 사전 통지 없이 우선 조치 후 사후 통지할 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제25조 (분쟁조정 및 고객센터)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 고객센터를 운영하며, 처리기한(SLA) 및 상태값 기준은 운영정책으로 게시합니다.</li>
                    <li>분쟁이 발생한 경우 당사자는 원만한 해결을 위해 성실히 협의하며, 필요한 경우 관계기관의 분쟁조정 절차를 이용할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 제7장 개인정보/표시·광고/책임 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">제7장 개인정보/표시·광고/책임</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제26조 (개인정보보호)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 개인정보 보호 관련 법령을 준수하며, 개인정보 처리방침을 수립·공개합니다.</li>
                    <li>개인정보의 수집·이용, 제3자 제공, 처리위탁 등은 개인정보 처리방침에 따릅니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제27조 (표시·광고 및 정보 제공)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 표시·광고 관련 법령을 준수하고, 회원의 합리적 선택에 필요한 중요 정보를 제공하기 위해 노력합니다.</li>
                    <li>회사는 서비스 안내에서 허위·과장 또는 오해 소지가 있는 표현을 지양합니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제28조 (손해배상)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사 또는 회원이 본 약관을 위반하여 상대방에게 손해를 입힌 경우 그 손해를 배상할 책임이 있습니다.</li>
                    <li>다만, 당사자에게 고의 또는 과실이 없는 경우에는 책임을 부담하지 않습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제29조 (면책 및 책임 제한)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>회사는 천재지변, 전쟁, 기간통신사업자의 장애, 불가항력 등 회사의 합리적 통제 범위를 벗어난 사유로 서비스를 제공할 수 없는 경우 책임을 면합니다.</li>
                    <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
                    <li>본 조의 면책/제한은 관련 법령 및 약관규제 원칙에 반하지 않는 범위에서만 적용됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                    제30조 (준거법 및 관할)
                  </h3>
                  <ul className="list-decimal list-inside space-y-2 ml-4">
                    <li>본 약관은 대한민국 법령을 준거법으로 합니다.</li>
                    <li>회사와 회원 간 분쟁에 관한 소송의 관할은 민사소송법 등 관계 법령에 따릅니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 부칙 */}
            <section>
              <h2 className="text-2xl font-bold text-ruby-400 mb-6 pb-2 border-b border-ruby-500/30">부칙</h2>
              <ul className="list-decimal list-inside space-y-2 ml-4">
                <li>본 약관은 <span className="text-ruby-400">2025년 1월 16일</span>부터 시행합니다.</li>
                <li>시행일 이전에 가입한 회원에게도 본 약관이 적용됩니다. 다만, 회원에게 불리한 변경은 제3조 제3항의 공지기간을 준수합니다.</li>
              </ul>
            </section>

            {/* 사업자 정보 */}
            <section className="bg-dark-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">표시의무 고지 (사업자 정보)</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><span className="text-gray-500">상호(법인명):</span> 루비라운드글로벌 주식회사</p>
                  <p><span className="text-gray-500">서비스명:</span> 루비라운드(RUBY ROUND)</p>
                  <p><span className="text-gray-500">대표자:</span> 임시윤</p>
                  <p><span className="text-gray-500">사업자등록번호:</span> 504-86-22650</p>
                  <p><span className="text-gray-500">통신판매업 신고번호:</span> 제2025-부산수영-0000호</p>
                </div>
                <div className="space-y-2">
                  <p><span className="text-gray-500">사업장 주소:</span> [48297] 부산 수영구 수영로 582번길 26, 102호 (광안동, 리금오피스텔)</p>
                  <p><span className="text-gray-500">이메일:</span> cjsql4159@rubyround.net</p>
                  <p><span className="text-gray-500">팩스:</span> 051-980-6150</p>
                  <p><span className="text-gray-500">결제대행사(PG):</span> 토스페이먼츠</p>
                  <p><span className="text-gray-500">에스크로/구매안전 서비스:</span> 이용함 (토스페이먼츠)</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-4">
                고지 내용은 관련 법령 및 회사 사정에 따라 변경될 수 있으며, 변경 시 사이트 공지 또는 본 약관의 변경 절차에 따라 안내합니다.
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
