import { Link } from 'react-router-dom';

export default function YouthPolicy() {
  return (
    <div className="min-h-screen py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            청소년보호정책
          </h1>
          <p className="text-gray-400">
            루비라운드글로벌 주식회사 청소년보호정책
          </p>
        </div>

        {/* Content */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            {/* Notice Banner */}
            <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4">
              <p className="text-ruby-400 font-medium">
                루비라운드글로벌 주식회사(이하 "회사")는 청소년이 유해정보로부터 보호받고 안전한 온라인 환경에서 서비스를 이용할 수 있도록 「청소년보호법」 등 관계 법령 및 관련 지침을 준수하며, 다음과 같이 청소년보호정책을 수립·시행합니다.
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
                제1조 (정책의 목적)
              </h2>
              <p className="mb-4">
                본 정책은 회사가 운영하는 루비라운드(RUBY ROUND) 서비스(웹사이트, 고객센터 채널, 라이브 방송 운영 포함)에서 다음 목적을 달성하기 위해 수립되었습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li>청소년의 접근이 제한되어야 하는 정보(이하 "청소년 유해정보")의 노출을 예방</li>
                <li>청소년의 서비스 이용을 부적절하게 유도하는 표현·상거래·커뮤니케이션을 차단</li>
                <li>청소년보호 관련 조직·절차·기술적 조치를 명확히 하여 청소년 보호를 실효적으로 달성</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제2조 (적용 범위)
              </h2>
              <p className="mb-4">본 정책은 다음 범위에 적용됩니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li>루비라운드 공식 웹사이트 및 그 하위 페이지(회원가입, 시즌/라운드 안내, 참여(결제), 공지, FAQ 등)</li>
                <li>회사가 운영·관리하는 고객상담 채널(카카오톡 채널, 1:1 문의, 이메일 등)</li>
                <li>회사가 진행하거나 관리하는 라이브 방송(송출 화면/자막/채팅 관리/공지 포함)</li>
                <li>회사가 제공하거나 회원이 게시하는 모든 텍스트/이미지/영상/링크/댓글/채팅 등 콘텐츠 전반</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제3조 (용어 정의)
              </h2>
              <ul className="space-y-3 ml-4">
                <li>
                  <span className="text-white font-medium">"청소년"</span>
                  <span className="text-gray-400 ml-2">: 관계 법령이 정하는 연령 미만의 자(실무 운영 기준: 만 19세 미만)</span>
                </li>
                <li>
                  <span className="text-white font-medium">"청소년 유해정보"</span>
                  <span className="text-gray-400 ml-2">: 관계 법령 및 심의기준상 청소년에게 유해하다고 판단되는 정보(음란, 성적 착취, 폭력, 잔혹, 범죄 조장, 약물·주류·담배의 부적절한 유통·사용 조장 등)</span>
                </li>
                <li>
                  <span className="text-white font-medium">"연령확인(성인인증)"</span>
                  <span className="text-gray-400 ml-2">: 본인확인 수단 등을 통해 이용자의 성인 여부를 확인하는 절차</span>
                </li>
                <li>
                  <span className="text-white font-medium">"접근제한 조치"</span>
                  <span className="text-gray-400 ml-2">: 청소년이 유해정보 또는 성인 전용 영역에 접근하지 못하도록 하는 기술·관리 조치(성인인증, 등급표시, 차단/블라인드, 모니터링, 제재 등)</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제4조 (청소년보호를 위한 기본 원칙)
              </h2>
              <p className="mb-4">회사는 청소년 보호를 위해 다음 원칙을 준수합니다.</p>

              <div className="space-y-4 ml-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">1. 성인 전용 서비스 운영 원칙</h3>
                  <p className="text-gray-400 text-sm">회사 서비스는 원칙적으로 만 19세 이상 성인을 대상으로 운영하며, 청소년의 서비스 이용 및 결제 참여를 제한합니다.</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">2. 유해정보의 사전 예방 및 사후 차단</h3>
                  <p className="text-gray-400 text-sm">유해정보가 유입되지 않도록 사전 예방 조치를 취하고, 유입 시 즉시 차단·삭제·제재 등 사후 조치를 시행합니다.</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">3. 건전한 표현 및 오해 유발 요소의 차단</h3>
                  <p className="text-gray-400 text-sm">회사는 청소년에게 부적절한 동기(사행성, 선정성, 불법행위 조장 등)를 유발할 수 있는 문구·이미지·연출을 제한합니다. 특히 회사는 대외 커뮤니케이션에서 "배팅/판돈/잭팟/대박/일확천금" 등 사행성·도박성 표현을 사용하지 않습니다.</p>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">4. 신고와 구제의 실효성 확보</h3>
                  <p className="text-gray-400 text-sm">청소년 유해정보 신고 접수 채널을 운영하고, 접수된 사안은 신속히 처리합니다.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제5조 (청소년보호책임자 지정 및 연락처)
              </h2>
              <p className="mb-4">회사는 청소년 유해정보로부터 청소년을 보호하고 청소년 보호 업무를 총괄하기 위하여 청소년보호책임자를 지정·운영합니다.</p>
              <div className="bg-dark-700/50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-400">
                  <li><span className="text-white">청소년보호책임자:</span> 임시윤</li>
                  <li><span className="text-white">직위/부서:</span> 대표이사</li>
                  <li><span className="text-white">이메일:</span> cs@rubyround.net</li>
                  <li><span className="text-white">문의 접수 채널:</span> 카카오톡 채널 / 1:1 문의 / 이메일</li>
                  <li><span className="text-white">운영시간:</span> 평일 11:00~18:00 (주말·공휴일 휴무)</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제6조 (연령확인 및 청소년 접근제한 조치)
              </h2>
              <p className="mb-4">회사는 청소년의 서비스 이용을 제한하기 위해 다음과 같은 조치를 시행합니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">6.1 성인인증 적용 영역</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>회원가입/로그인</li>
                    <li>유료 라운드 참여(결제) 및 결제내역 조회</li>
                    <li>교환(주문제작) 신청, 배송/수령 관련 민감 정보 확인</li>
                    <li>성인 전용 안내 페이지 또는 기능(회사가 필요 시 설정)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">6.2 성인인증 방식</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>휴대폰 본인확인 등 회사가 채택한 본인확인 수단을 통해 성인 여부를 확인합니다.</li>
                    <li>성인인증 과정에서 처리되는 개인정보는 개인정보처리방침 및 관련 법령에 따라 최소한으로 처리합니다.</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">6.3 청소년 또는 미확인 이용자에 대한 제한</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>성인인증이 완료되지 않은 이용자는 성인 전용 기능(참여/결제/교환 신청 등)을 이용할 수 없습니다.</li>
                    <li>청소년으로 확인되거나 청소년으로 의심되는 경우(타인 명의 도용, 비정상 인증 패턴 등) 회사는 추가 확인을 요청하거나 계정을 제한할 수 있습니다.</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">6.4 명의도용·부정이용 대응</h3>
                  <p className="text-gray-400 text-sm">타인의 인증수단을 이용한 성인인증, 미성년자의 부정 이용 시도 등 부정행위가 확인되는 경우, 회사는 이용제한, 결제 취소/환불 조치, 필요 시 관계기관 협조 등 적절한 조치를 취할 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제7조 (유해정보의 범주 및 금지 기준)
              </h2>
              <p className="mb-4">회사는 아래 유형의 정보를 청소년 유해정보로 보고, 서비스 내 게시·유통·전송·링크 제공을 금지합니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li>음란·선정적 콘텐츠(성행위 묘사, 노골적 신체 노출, 성적 수치심 유발 등)</li>
                <li>성착취·아동청소년 성범죄 관련 콘텐츠(그루밍, 착취물, 성매매 유도 등)</li>
                <li>폭력·잔혹·혐오 콘텐츠(과도한 폭력 묘사, 자극적 살상/상해, 혐오 조장 등)</li>
                <li>자해·자살 조장, 극단적 선택 유도 정보</li>
                <li>범죄·불법행위 조장(사기·도박·불법촬영·마약 등)</li>
                <li>청소년의 음주·흡연·약물 오남용을 조장하거나 판매를 유도하는 콘텐츠</li>
                <li>기타 관계 법령/심의기준에서 청소년에게 유해하다고 판단되는 정보</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제8조 (모니터링 및 운영상 차단)
              </h2>
              <p className="mb-4">회사는 청소년 유해정보 노출을 예방하기 위해 다음의 관리 체계를 운영합니다.</p>

              <div className="space-y-4">
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">8.1 상시 모니터링</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>사이트 게시물/문의 내용/공식 공지/FAQ/배너 문구 점검</li>
                    <li>라이브 방송 자막·멘트·채팅 환경 점검(운영 인력/모더레이션 포함)</li>
                    <li>신고 접수 사안 우선 처리</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">8.2 내부 운영 기준(가이드)</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>청소년 유해정보로 해석될 소지가 있는 문구·이미지·연출 금지</li>
                    <li>사행성·도박성 오해를 유발하는 표현 금지(예: 배팅/판돈/잭팟 등)</li>
                    <li>링크 공유 시 외부 유해사이트로의 연결 차단(필요 시 링크 무력화)</li>
                  </ul>
                </div>
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">8.3 운영 인력 권한 및 기록</h3>
                  <p className="text-gray-400 text-sm">청소년보호 업무 담당자(또는 팀)를 지정하고, 게시물 차단/삭제/계정제재 권한을 부여합니다. 처리 이력(접수-검토-조치-통지)은 분쟁 방지를 위해 일정 기간 보관할 수 있습니다.</p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제9조 (기술적 보호조치)
              </h2>
              <p className="mb-4">회사는 서비스 특성 및 운영환경에 따라 다음과 같은 기술적 조치를 적용합니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li>성인인증 기반 접근통제(미인증/청소년 계정 기능 제한)</li>
                <li>유해 키워드/표현 필터링(채팅/게시물/문의폼 등 적용 가능)</li>
                <li>신고 누적·패턴 기반 제재(반복 위반 계정 제한)</li>
                <li>외부 링크 제한 또는 유해 URL 차단(필요 시)</li>
                <li>접속기록/이상징후 탐지 및 보안조치(부정이용 방지)</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제10조 (신고 접수 및 처리 절차)
              </h2>
              <p className="mb-4">이용자는 서비스 내 청소년 유해정보를 발견한 경우 아래 채널로 신고할 수 있습니다.</p>

              <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                <p className="text-white font-medium mb-2">신고 채널</p>
                <p className="text-gray-400 text-sm">카카오톡 채널 / 1:1 문의 / 이메일 cs@rubyround.net</p>
                <p className="text-white font-medium mt-3 mb-2">신고 시 기재 권장사항</p>
                <p className="text-gray-400 text-sm">문제 콘텐츠 위치(URL/화면 캡처), 내용 설명, 발생 시각, 계정 정보(가능한 경우)</p>
              </div>

              <div className="bg-dark-700/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">처리 절차</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                  <li><span className="text-white">접수:</span> 신고 접수 후 '접수 완료' 안내(자동 또는 수동)</li>
                  <li><span className="text-white">검토:</span> 사실관계 확인 및 법령/정책 위반 여부 판단</li>
                  <li><span className="text-white">조치:</span> 삭제/블라인드/접근제한/계정 제재/재발 방지 조치</li>
                  <li><span className="text-white">통지:</span> 신고자 및(필요 시) 게시자에게 처리결과 안내</li>
                  <li><span className="text-white">재발 방지:</span> 동일 유형 반복 발생 시 필터 강화, 운영 가이드 개정 등</li>
                </ol>
                <p className="text-ruby-400 text-sm mt-3">※ 긴급·중대 사안(성착취물 의심, 범죄 조장 등)은 즉시 차단 후 사후 검토·통지할 수 있습니다.</p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제11조 (이용자 및 계정에 대한 제재 기준)
              </h2>
              <p className="mb-4">회사는 청소년 유해정보 게시·유통 또는 청소년의 부정 이용 시도가 확인되는 경우 다음 조치를 취할 수 있습니다(위반 정도에 따라 단계 적용).</p>
              <ul className="list-decimal list-inside space-y-2 ml-4 text-gray-400">
                <li>경고 및 콘텐츠 삭제/블라인드</li>
                <li>기능 제한(게시/채팅/참여/결제 제한 등)</li>
                <li>일정 기간 이용정지</li>
                <li>영구 이용제한(계정 해지)</li>
                <li>필요 시 관계기관 신고/협조(법령상 의무 또는 중대한 위반 사안)</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제12조 (교육 및 내부 점검)
              </h2>
              <p className="mb-4">회사는 청소년 보호의 실효성을 위해 다음을 시행합니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                <li>청소년보호책임자 및 관련 담당자에 대한 정기 교육(유해정보 유형, 신고 처리, 증거 보존, 이용자 응대 기준)</li>
                <li>정책 준수 여부 내부 점검 및 개선(문구/배너/방송 스크립트/운영 프로세스 포함)</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제13조 (관계기관 협조)
              </h2>
              <p>
                회사는 청소년 유해정보 관련 법령 위반 소지가 있거나 중대한 사안이 확인되는 경우, 관계기관의 적법한 요청에 따라 필요한 범위에서 협조할 수 있습니다.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-ruby-500 rotate-45" />
                제14조 (정책 변경 및 고지)
              </h2>
              <p>
                본 청소년보호정책은 법령, 서비스 운영 방식, 내부 운영정책 변경 등에 따라 개정될 수 있습니다. 중요 변경이 있는 경우 회사는 사이트 공지사항 또는 서비스 내 고지 방식으로 변경 내용과 시행일을 안내합니다.
              </p>
            </section>

            {/* Footer Info Block */}
            <section className="pt-6 border-t border-dark-600">
              <div className="bg-ruby-600/10 border border-ruby-600/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">청소년보호 책임자 정보</h3>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><span className="text-white">청소년보호책임자:</span> 임시윤 / 대표이사</li>
                  <li><span className="text-white">이메일:</span> cs@rubyround.net</li>
                  <li><span className="text-white">신고/문의:</span> 카카오톡 채널 / 1:1 문의</li>
                </ul>
              </div>
            </section>

            {/* External Agencies */}
            <section>
              <h3 className="text-white font-medium mb-3">외부 신고 기관</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">방송통신심의위원회</p>
                  <p className="text-gray-400 text-sm">전화: 1377</p>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">청소년 전화</p>
                  <p className="text-gray-400 text-sm">전화: 1388</p>
                </div>
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
