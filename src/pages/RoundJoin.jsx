import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const CURRENT_SEASON_ID = 'SEASON-1';

const roundsData = [
  {
    id: 'R1',
    number: 'Round 1',
    title: '체험 라운드',
    price: 0,
    status: 'completed',
    participants: 1250,
    seasonId: CURRENT_SEASON_ID,
    description: '무료 체험 라운드 - 실물 보상은 제공되지 않으며 시즌 누적 정보로만 반영됩니다.',
    details: '시즌의 세계관과 보석 채굴 구조를 체험해보세요. 무료로 참여할 수 있으며, 시즌 참여 경험을 쌓을 수 있습니다.',
    benefits: [
      '시즌 시스템 무료 체험',
      '채굴 메커니즘 이해',
      '시즌 참여 이력 누적',
    ],
  },
  {
    id: 'R2',
    number: 'Round 2',
    title: '탐사 라운드',
    price: 500000,
    status: 'completed',
    participants: 890,
    seasonId: CURRENT_SEASON_ID,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '보석 탐사의 첫 단계입니다. 기본 채굴이 시작되며, 초급 원석에 접근할 수 있습니다.',
    benefits: [
      '초급 루비 원석 접근권',
      '기본 채굴 보너스 적용',
      '시즌 보상 1단계 자격',
    ],
  },
  {
    id: 'R3',
    number: 'Round 3',
    title: '발굴 라운드',
    price: 1000000,
    status: 'active',
    participants: 567,
    seasonId: CURRENT_SEASON_ID,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '본격적인 보석 발굴 단계입니다. 중급 원석에 접근하며, 보석의 품질이 향상됩니다.',
    benefits: [
      '중급 루비 원석 접근권',
      '품질 향상 보너스 적용',
      '시즌 보상 2단계 자격',
      '누적 참여자 특별 혜택',
    ],
  },
  {
    id: 'R4',
    number: 'Round 4',
    title: 'Deep Cargo',
    price: 1800000,
    status: 'upcoming',
    participants: 0,
    seasonId: CURRENT_SEASON_ID,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '더 깊은 화물 레이어를 개봉합니다. 보석의 크기와 밀도가 이전 라운드보다 증가합니다.',
    benefits: [
      '고급 원석 레이어 접근',
      '크기/밀도 증가 보너스',
      '시즌 보상 3단계 자격',
    ],
  },
  {
    id: 'R5',
    number: 'Round 5',
    title: 'Core Mining',
    price: 2500000,
    status: 'upcoming',
    participants: 0,
    seasonId: CURRENT_SEASON_ID,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '핵심 채굴 구역에 진입합니다. 희귀 원석의 발견 확률이 크게 상승합니다.',
    benefits: [
      '희귀 원석 발견 확률 상승',
      '핵심 채굴 구역 진입권',
      '시즌 보상 4단계 자격',
    ],
  },
  {
    id: 'R6',
    number: 'Round 6',
    title: 'Ruby Vein',
    price: 3500000,
    status: 'upcoming',
    participants: 0,
    seasonId: CURRENT_SEASON_ID,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '루비 광맥에 접근합니다. 고급 루비 원석을 채굴할 수 있는 기회가 열립니다.',
    benefits: [
      '루비 광맥 접근권',
      '고급 루비 원석 채굴',
      '시즌 보상 5단계 자격',
    ],
  },
  {
    id: 'R7',
    number: 'Round 7',
    title: 'Final Extraction',
    price: 5000000,
    status: 'upcoming',
    participants: 0,
    seasonId: CURRENT_SEASON_ID,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '시즌의 마지막 라운드입니다. 최고급 보석의 최종 추출이 이루어집니다.',
    benefits: [
      '최고급 보석 추출 기회',
      '시즌 최종 보상 자격',
      '다음 시즌 우선 참여권',
    ],
  },
];

export default function RoundJoin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [round, setRound] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);

  useEffect(() => {
    // id가 'R1' 형식 또는 숫자일 수 있음
    const foundRound = roundsData.find(r => r.id === id || r.id === `R${id}`);
    if (foundRound) {
      setRound(foundRound);
    }
  }, [id]);

  const handleJoin = () => {
    if (!agreedToTerms || !agreedToRefund) {
      alert('이용약관 및 환불정책에 동의해주세요.');
      return;
    }

    // 결제 페이지로 이동
    navigate(`/rounds/${id}/payment`);
  };

  if (!round) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400">라운드 정보를 찾을 수 없습니다.</p>
        <Link to="/rounds" className="text-ruby-400 hover:underline mt-4 inline-block">
          라운드 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const statusConfig = {
    completed: { label: '종료됨', color: 'bg-dark-600 text-gray-400', canJoin: false },
    active: { label: '참여 가능', color: 'bg-ruby-600 text-white', canJoin: true },
    upcoming: { label: '오픈 예정', color: 'bg-dark-700 text-gray-500', canJoin: false },
  };

  const status = statusConfig[round.status];

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating particles */}
      <div className="absolute top-40 left-[10%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" />
      <div className="absolute bottom-60 right-[15%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '1s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back button */}
        <Link
          to="/rounds"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          라운드 목록으로 돌아가기
        </Link>

        {/* Header */}
        <div className="mb-8 sm:mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-ruby-500 font-medium">{round.number}</span>
            <span className={`px-3 py-1 text-xs rounded-full ${status.color} ${round.status === 'active' ? 'animate-pulse' : ''}`}>
              {status.label}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">
            {round.title} <span className="text-shimmer">참여하기</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {round.details}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Left: Round Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Round Details Card */}
            <div className="card p-5 sm:p-8 hover-glow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-ruby-500 rotate-45" />
                라운드 상세 정보
              </h2>

              <div className="space-y-4">
                <div className="bg-dark-700 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">참여비 (보석 구매 예약금)</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${round.price === 0 ? 'text-green-400' : 'text-shimmer'}`}>
                    {round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`}
                  </p>
                </div>

                <p className="text-gray-300 text-sm sm:text-base">
                  {round.description}
                </p>

                {round.participants > 0 && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>현재 {round.participants.toLocaleString()}명 참여</span>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits Card */}
            <div className="card p-5 sm:p-8 hover-glow animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-ruby-500 rotate-45" />
                참여 혜택
              </h2>

              <ul className="space-y-3">
                {round.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-ruby-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-ruby-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notice Card */}
            <div className="card bg-dark-800/50 border-yellow-900/30 p-5 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-yellow-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                참여 전 안내사항
              </h2>

              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  시즌 종료 후 실물 루비 보석 또는 적립금으로 귀속됩니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  참여 후 환불은 환불정책에 따라 진행됩니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  라운드별 참여는 한 계정당 1회만 가능합니다.
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Payment Summary */}
          <div className="lg:col-span-2">
            <div className="card bg-gradient-to-b from-ruby-950/30 to-dark-800 border-ruby-900/50 p-5 sm:p-6 sticky top-32 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-lg font-bold mb-4">참여 신청</h2>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">라운드</span>
                  <span>{round.number} - {round.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">참여비</span>
                  <span>{round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`}</span>
                </div>
                <div className="border-t border-dark-600 pt-3 flex justify-between font-bold">
                  <span>총 결제금액</span>
                  <span className={round.price === 0 ? 'text-green-400' : 'text-ruby-400'}>
                    {round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Agreement Checkboxes */}
              {status.canJoin && (
                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-700 text-ruby-500 focus:ring-ruby-500 focus:ring-offset-dark-800"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      <Link to="/terms" className="text-ruby-400 hover:underline">이용약관</Link> 및{' '}
                      <Link to="/privacy" className="text-ruby-400 hover:underline">개인정보처리방침</Link>에 동의합니다.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreedToRefund}
                      onChange={(e) => setAgreedToRefund(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-700 text-ruby-500 focus:ring-ruby-500 focus:ring-offset-dark-800"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      <Link to="/refund" className="text-ruby-400 hover:underline">환불정책</Link>을 확인하였으며 동의합니다.
                    </span>
                  </label>
                </div>
              )}

              {/* Join Button */}
              {status.canJoin ? (
                <button
                  onClick={handleJoin}
                  disabled={!agreedToTerms || !agreedToRefund}
                  className={`w-full btn-primary text-base py-4 relative overflow-hidden group ${
                    (!agreedToTerms || !agreedToRefund) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="relative z-10">
                    {round.price === 0 ? '무료 체험 시작하기' : '참여 신청하기'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 animate-shimmer opacity-30" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-6 py-4 bg-dark-700 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  {round.status === 'completed' ? '종료된 라운드' : '아직 오픈되지 않음'}
                </button>
              )}

              <p className="text-center text-gray-500 text-xs mt-4">
                참여비 전액은 시즌 종료 시 실물 루비 보석 또는 적립금으로 귀속됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
