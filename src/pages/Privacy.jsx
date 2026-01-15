import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            개인정보처리방침
          </h1>
          <p className="text-gray-400">
            루비라운드글로벌 주식회사 개인정보처리방침
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            {/* Notice Banner */}
            <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4">
              <p className="text-ruby-400 font-medium">
                루비라운드글로벌 주식회사(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, 정보주체의 개인정보를 보호하고 권익을 보장하기 위하여 본 개인정보처리방침을 수립·공개합니다.
              </p>
            </div>

            {/* Effective Date */}
            <div className="bg-dark-700/50 rounded-lg p-4 text-sm">
              <p><span className="text-white">시행일:</span> 2025년 2월 1일</p>
              <p><span className="text-white">최종 개정일:</span> 2025년 2월 1일</p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제1조 (개인정보의 처리 목적)
              </h2>
              <p className="mb-4">회사는 다음 목적 범위 내에서 개인정보를 처리합니다. 목적이 변경되는 경우 관련 법령에 따라 별도 동의를 받거나 필요한 조치를 이행합니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">회원가입 및 계정관리</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>회원 식별, 가입의사 확인, 본인 확인, 서비스 부정이용 방지</li>
                    <li>성인(만 19세 이상) 여부 확인(성인 전용 서비스 운영)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">라운드 참여(결제) 및 이용내역 제공</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>라운드 참여(결제) 처리, 참여/결제/환불 내역 조회 제공</li>
                    <li>정산, 세무 처리(현금영수증/세금계산서 발행 등 해당 시)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">교환(주문제작) 신청 및 배송</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>교환 신청 접수, 주문제작 진행, 배송/수령확인</li>
                    <li>고가 물품 특성상 안전배송(본인 수령 확인, 수령확인 기록 등) 절차 운영</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">고객지원 및 분쟁 대응</h3>
                  <p className="text-gray-400 text-sm">문의·민원 처리, 공지 전달, 분쟁 조정 및 법적 대응, 부정이용 방지, 거래기록 보존</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">서비스 개선 및 보안</h3>
                  <p className="text-gray-400 text-sm">접속기록 등 로그 분석, 서비스 안정성 확보, 오류/장애 대응, 보안 강화</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">마케팅/광고(선택 동의)</h3>
                  <p className="text-gray-400 text-sm">이벤트/프로모션 안내, 혜택 알림(수신 동의자에 한함)</p>
                  <p className="text-ruby-400 text-sm mt-2">※ 동의 거부 시에도 기본 서비스 이용에 제한이 없습니다.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제2조 (처리하는 개인정보 항목)
              </h2>
              <p className="mb-4">회사는 서비스 제공에 필요한 최소한의 개인정보를 수집·이용합니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2.1 회원가입/계정관리</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">(필수)</span> 이메일(또는 아이디), 비밀번호, 닉네임, 휴대전화번호, 가입일시</li>
                    <li><span className="text-white">(필수)</span> 성인여부 확인 결과("성인/비성인" 결과값), 중복가입 방지 정보(필요 시)</li>
                    <li><span className="text-white">(선택)</span> 마케팅 수신 동의(이메일/SMS/알림톡 등), 관심정보(선택 입력)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2.2 본인확인/성인인증(휴대폰 본인인증 등)</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">(필수)</span> 성명, 생년월일, 성별, 내·외국인 여부, 휴대전화번호, 통신사, 인증값</li>
                    <li><span className="text-white">(필수/생성정보)</span> 연계정보(CI), 중복가입확인정보(DI)</li>
                  </ul>
                  <p className="text-gray-500 text-sm mt-2">※ 회사는 원칙적으로 성인 여부 확인 결과 및 인증 성공/실패 여부 등 최소 정보를 보관하며, 인증 상세정보의 보관 범위는 본인확인기관의 정책 및 관련 법령에 따릅니다.</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2.3 라운드 참여(결제)·환불·정산</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">(필수)</span> 주문/참여번호, 라운드 식별정보, 결제상태, 결제금액, 결제수단, 결제일시</li>
                    <li><span className="text-white">(필수)</span> 결제 승인/거래 식별정보(PG 거래번호 등), 환불 처리 기록</li>
                    <li><span className="text-white">(필요 시)</span> 환불계좌(계좌환불 시), 현금영수증 정보, 세금계산서 정보</li>
                  </ul>
                  <p className="text-gray-500 text-sm mt-2">※ 카드번호, 계좌비밀번호 등 민감 결제정보는 회사가 직접 저장하지 않으며, PG사가 처리합니다.</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2.4 교환(주문제작)·배송·수령확인</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">(필수)</span> 수령인 성명, 배송지 주소, 연락처, 배송요청사항(선택 입력 포함)</li>
                    <li><span className="text-white">(필수)</span> 배송사 정보(송장번호 등), 배송추적정보, 수령확인 기록(서명/수령확인 여부 등)</li>
                    <li><span className="text-white">(선택)</span> 주문제작 상담 과정에서 고객이 제공하는 디자인/사양 요청사항(반지 호수, 체인 길이 등)</li>
                  </ul>
                  <p className="text-gray-500 text-sm mt-2">※ 고가 배송 관련: 회사는 분실·도난 방지 및 안전배송을 위해 특송/보험배송/본인수령확인 등의 절차를 적용할 수 있습니다.</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2.5 고객센터(비대면) 문의/민원</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">(필수)</span> 닉네임(또는 성명), 연락처, 이메일, 문의 내용, 상담기록, 처리결과</li>
                    <li><span className="text-white">(선택)</span> 고객이 제출한 증빙자료(사진/영상/문서 등)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2.6 자동수집 정보(웹/서비스 이용 과정)</h3>
                  <p className="text-gray-400 text-sm">접속기록(로그), IP 주소, 쿠키, 방문일시, 이용기록, 기기정보(브라우저/OS 등), 오류기록, 보안 이벤트 기록</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제3조 (개인정보의 처리 및 보유 기간)
              </h2>
              <p className="mb-4">회사는 개인정보를 처리 목적 달성 시까지 보유·이용하며, 관련 법령에 따른 보관 의무가 있는 경우 해당 기간 동안 보관합니다.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-3 px-4 text-white font-medium">구분</th>
                      <th className="text-left py-3 px-4 text-white font-medium">보유 기간</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">회원정보</td>
                      <td className="py-3 px-4">회원 탈퇴 시까지 (예외: 부정이용 방지, 분쟁 대응을 위해 필요한 경우 최소 기간 별도 분리보관 후 파기)</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">거래(결제/환불/정산) 관련 정보</td>
                      <td className="py-3 px-4">관계법령이 정한 기간(계약/청약철회, 대금결제, 재화 공급, 소비자 불만/분쟁 처리 기록 등)</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">교환(주문제작)·배송·수령확인 기록</td>
                      <td className="py-3 px-4">배송 완료 및 정산 종료 후, 분쟁 대응에 필요한 범위 내에서 관계법령/내부 기준에 따라 보관</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">고객상담/민원 기록</td>
                      <td className="py-3 px-4">상담 종료 후 3년 또는 분쟁 종료 시까지(내부 기준)</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">마케팅 정보(선택 동의)</td>
                      <td className="py-3 px-4">동의 철회 또는 회원 탈퇴 시까지</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제4조 (개인정보의 제3자 제공)
              </h2>
              <p className="mb-4">회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 다음의 경우에는 예외로 합니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li>정보주체의 별도 동의를 받은 경우</li>
                <li>법령에 특별한 규정이 있거나, 수사기관 등 관계기관이 적법한 절차에 따라 요청하는 경우</li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">※ 현재 회사 운영 기준상, 제3자 제공은 원칙적으로 없습니다. (추후 제3자 제공이 발생하는 경우 제공받는 자/목적/항목/보유기간을 사전 공개 또는 별도 동의로 처리합니다.)</p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제5조 (개인정보 처리업무의 위탁)
              </h2>
              <p className="mb-4">회사는 원활한 서비스 제공을 위해 개인정보 처리업무를 외부 전문업체에 위탁할 수 있습니다. 위탁 시 관련 법령에 따라 계약을 체결하고, 수탁자가 개인정보를 안전하게 처리하도록 관리·감독합니다.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-3 px-4 text-white font-medium">구분</th>
                      <th className="text-left py-3 px-4 text-white font-medium">수탁자</th>
                      <th className="text-left py-3 px-4 text-white font-medium">위탁업무 내용</th>
                      <th className="text-left py-3 px-4 text-white font-medium">보유/이용 기간</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">본인확인/성인인증</td>
                      <td className="py-3 px-4">본인확인 업체</td>
                      <td className="py-3 px-4">휴대폰 본인인증, 성인여부 확인</td>
                      <td className="py-3 px-4">위탁계약 종료 또는 법정 보관기간</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">결제(PG)</td>
                      <td className="py-3 px-4">PG사</td>
                      <td className="py-3 px-4">결제 승인/취소/환불, 현금영수증(해당 시)</td>
                      <td className="py-3 px-4">위탁계약 종료 또는 법정 보관기간</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">알림 발송</td>
                      <td className="py-3 px-4">SMS/알림톡 발송사</td>
                      <td className="py-3 px-4">공지/안내/알림 발송, 마케팅 발송(동의자)</td>
                      <td className="py-3 px-4">위탁계약 종료 또는 법정 보관기간</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제6조 (개인정보의 파기 절차 및 방법)
              </h2>
              <p className="mb-4">회사는 보유기간 경과 또는 처리 목적 달성 등 개인정보가 불필요하게 되었을 때 지체 없이 파기합니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">파기 절차</h3>
                  <p className="text-gray-400 text-sm">파기 사유 발생 → 내부 검토/승인 → 파기 실행 → 파기 결과 확인</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">파기 방법</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">전자적 파일:</span> 복구 불가능한 방법으로 영구 삭제(덮어쓰기 등)</li>
                    <li><span className="text-white">종이 문서:</span> 분쇄 또는 소각</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">법령에 따른 보존</h3>
                  <p className="text-gray-400 text-sm">법령에 따라 보존이 필요한 개인정보는 별도 분리보관하고, 보존 사유 종료 시 즉시 파기합니다.</p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제7조 (정보주체의 권리·의무 및 행사방법)
              </h2>
              <p className="mb-4">이용자는 회사에 대해 다음 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400 mb-4">
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정·삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>동의 철회(마케팅 수신 동의 등)</li>
              </ul>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">7.1 권리 행사 방법(비대면 고객센터)</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li><span className="text-white">접수 채널:</span> 1:1 문의 / 이메일(cs@rubyround.co.kr) / 카카오톡 채널</li>
                    <li>회사는 본인 확인 후 지체 없이 조치합니다.</li>
                    <li>단, 법령상 제한 또는 타인의 권리 침해 우려가 있는 경우 일부 제한될 수 있습니다.</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">7.2 대리인을 통한 행사</h3>
                  <p className="text-gray-400 text-sm">정보주체는 법정대리인 또는 위임받은 대리인을 통해 권리를 행사할 수 있으며, 회사는 필요한 경우 위임장 등 증빙을 요청할 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제8조 (개인정보의 안전성 확보조치)
              </h2>
              <p className="mb-4">회사는 개인정보의 안전성 확보를 위해 관리적·기술적·물리적 조치를 시행합니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">관리적 조치</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>개인정보 취급자 최소화 및 권한관리(직무 기반)</li>
                    <li>내부관리계획 수립·시행 및 정기 점검</li>
                    <li>임직원 교육 및 보안서약, 위탁사 관리·감독</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">기술적 조치</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>접근권한 관리, 접속기록 보관 및 위·변조 방지</li>
                    <li>비밀번호 일방향 암호화 저장</li>
                    <li>전송구간 암호화(HTTPS/TLS)</li>
                    <li>보안 프로그램/침입차단 등 보안조치(운영환경에 따라 적용)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">물리적 조치</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>전산설비/문서보관 장소 접근통제</li>
                    <li>출력물 및 보관물 관리, 파기 절차 통제</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제9조 (개인정보 자동 수집 장치 운영)
              </h2>
              <p className="mb-4">회사는 이용 편의 및 서비스 품질 개선을 위해 쿠키(cookie) 등 자동 수집 장치를 사용할 수 있습니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">쿠키 사용 목적</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>로그인 유지, 보안 강화</li>
                    <li>이용 통계 및 서비스 개선</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">쿠키의 설치·운영 및 거부 방법</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>이용자는 웹브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.</li>
                    <li>단, 쿠키 저장 거부 시 일부 서비스(로그인 유지 등)에 제한이 있을 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제10조 (행태정보 처리)
              </h2>
              <p className="mb-4">회사가 맞춤형 광고/분석 도구를 사용하는 경우, 이용자의 서비스 이용 이력 등 행태정보가 수집·이용될 수 있습니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li><span className="text-white">수집 항목:</span> 방문/클릭/조회 이력, 접속 로그, 광고식별자 등(도구에 따라 상이)</li>
                <li><span className="text-white">처리 목적:</span> 이용 통계 분석, 서비스 개선, 맞춤형 콘텐츠 제공</li>
                <li><span className="text-white">보유·이용 기간:</span> 도구 정책 및 내부 기준에 따라 최소 기간 보관 후 삭제</li>
                <li><span className="text-white">거부 방법:</span> 브라우저/단말 설정을 통해 맞춤형 광고 제한 가능</li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">※ 현재 회사가 맞춤형 광고를 운영하지 않는 경우, 본 조항은 "해당 없음"으로 처리됩니다.</p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제11조 (개인정보 보호책임자 및 고충처리)
              </h2>
              <p className="mb-4">회사는 개인정보 관련 문의 및 피해구제를 위해 아래와 같이 책임자 및 담당부서를 지정합니다.</p>

              <div className="bg-dark-700/50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-400">
                  <li><span className="text-white">개인정보 보호책임자(CPO):</span> 임시윤</li>
                  <li><span className="text-white">소속/직위:</span> 대표이사</li>
                  <li><span className="text-white">이메일:</span> cs@rubyround.co.kr</li>
                  <li><span className="text-white">고충처리 부서:</span> 고객센터</li>
                  <li><span className="text-white">문의 채널:</span> 1:1 문의 / 이메일 / 카카오톡 채널</li>
                  <li><span className="text-white">운영시간:</span> 평일 11:00~18:00 (공휴일 제외)</li>
                </ul>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제12조 (권익침해 구제방법)
              </h2>
              <p className="mb-4">이용자는 개인정보 침해에 대한 신고 또는 상담이 필요할 경우 아래 기관에 문의할 수 있습니다.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">개인정보 침해신고센터</p>
                  <p className="text-gray-400 text-sm">(한국인터넷진흥원)</p>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">개인정보 분쟁조정위원회</p>
                  <p className="text-gray-400 text-sm">&nbsp;</p>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">경찰청 사이버수사</p>
                  <p className="text-gray-400 text-sm">관련 부서</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">※ 기관 정보는 변동될 수 있으므로 최신 정보를 확인 바랍니다.</p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제13조 (민감정보 및 고유식별정보 처리)
              </h2>
              <p className="mb-4">
                회사는 원칙적으로 민감정보를 처리하지 않습니다. 또한 주민등록번호 등 고유식별정보는 법령에서 허용되는 경우 또는 별도 근거가 있는 경우를 제외하고 처리하지 않습니다.
              </p>
              <p className="text-gray-500 text-sm">
                ※ 고가 배송의 본인 수령 확인 과정에서 신분증 확인이 필요한 경우에도 원칙적으로 "대면 확인"에 그치며 사본을 수집·보관하지 않습니다.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제14조 (자동화된 결정에 관한 사항)
              </h2>
              <p>
                회사는 정보주체에게 중대한 영향을 미치는 자동화된 결정을 운영하지 않습니다. (향후 운영 시 기준·절차·거부/설명 요구 방법을 별도 고지합니다.)
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제15조 (개인정보 유출 등 사고 대응)
              </h2>
              <p>
                회사는 개인정보가 유출·훼손·위조·변조 또는 접근권한 상실 등이 발생한 경우, 관련 법령 및 내부 절차에 따라 지체 없이 조사하고 필요한 보호조치 및 통지를 이행합니다.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제16조 (개인정보처리방침의 변경)
              </h2>
              <p>
                본 개인정보처리방침은 법령, 서비스 운영 방식, 내부 운영정책 변경 등에 따라 개정될 수 있습니다. 중요 변경이 있는 경우 회사는 사이트 공지사항 또는 서비스 내 고지 방식으로 변경 내용과 시행일을 안내합니다.
              </p>
            </section>

            {/* Footer */}
            <section className="pt-6 border-t border-dark-600">
              <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">개인정보 보호책임자 정보</h3>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><span className="text-white">개인정보보호책임자:</span> 임시윤 / 대표이사</li>
                  <li><span className="text-white">이메일:</span> cs@rubyround.co.kr</li>
                  <li><span className="text-white">문의:</span> 카카오톡 채널 / 1:1 문의</li>
                </ul>
              </div>
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
