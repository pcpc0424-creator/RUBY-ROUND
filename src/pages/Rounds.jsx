import { useState } from 'react';
import { Link } from 'react-router-dom';

const rounds = [
  {
    id: 1,
    number: 'Round 1',
    title: '체험 라운드',
    price: 0,
    status: 'completed',
    participants: 1250,
    description: '무료 체험 라운드 - 실물 보상은 제공되지 않으며 시즌 누적 정보로만 반영됩니다.',
    details: '시즌의 세계관과 보석 채굴 구조를 체험해보세요. 무료로 참여할 수 있으며, 시즌 참여 경험을 쌓을 수 있습니다.',
  },
  {
    id: 2,
    number: 'Round 2',
    title: '탐사 라운드',
    price: 500000,
    status: 'completed',
    participants: 890,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '보석 탐사의 첫 단계입니다. 기본 채굴이 시작되며, 초급 원석에 접근할 수 있습니다.',
  },
  {
    id: 3,
    number: 'Round 3',
    title: '발굴 라운드',
    price: 1000000,
    status: 'active',
    participants: 567,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '본격적인 보석 발굴 단계입니다. 중급 원석에 접근하며, 보석의 품질이 향상됩니다.',
  },
  {
    id: 4,
    number: 'Round 4',
    title: 'Deep Cargo',
    price: 1800000,
    status: 'upcoming',
    participants: 0,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '더 깊은 화물 레이어를 개봉합니다. 보석의 크기와 밀도가 이전 라운드보다 증가합니다.',
  },
  {
    id: 5,
    number: 'Round 5',
    title: 'Core Mining',
    price: 2500000,
    status: 'upcoming',
    participants: 0,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '핵심 채굴 구역에 진입합니다. 희귀 원석의 발견 확률이 크게 상승합니다.',
  },
  {
    id: 6,
    number: 'Round 6',
    title: 'Ruby Vein',
    price: 3500000,
    status: 'upcoming',
    participants: 0,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '루비 광맥에 접근합니다. 고급 루비 원석을 채굴할 수 있는 기회가 열립니다.',
  },
  {
    id: 7,
    number: 'Round 7',
    title: 'Final Extraction',
    price: 5000000,
    status: 'upcoming',
    participants: 0,
    description: '참여비는 루비 보석 악세사리 구매를 위한 예약금입니다.',
    details: '시즌의 마지막 라운드입니다. 최고급 보석의 최종 추출이 이루어집니다.',
  },
];

function RoundCard({ round, isSelected, onClick }) {
  const statusConfig = {
    completed: { label: '종료', color: 'bg-dark-600 text-gray-400' },
    active: { label: '참여 가능', color: 'bg-ruby-600 text-white' },
    upcoming: { label: '예정', color: 'bg-dark-700 text-gray-500' },
  };

  const status = statusConfig[round.status];

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all p-4 sm:p-6 ${
        isSelected ? 'border-ruby-500 bg-ruby-950/20' : ''
      } ${round.status === 'active' ? 'ring-2 ring-ruby-500/30' : ''}`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-gray-400">{round.number}</span>
          <span className={`px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-xs rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {[...Array(Math.min(round.id, 5))].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 ${
                round.status === 'completed' ? 'bg-ruby-600' :
                round.status === 'active' ? 'bg-ruby-500' :
                'bg-dark-600'
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">{round.title}</h3>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">참여비 (예약금)</p>
          <p className={`text-lg sm:text-2xl font-bold ${
            round.price === 0 ? 'text-green-400' : 'text-ruby-400'
          }`}>
            {round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`}
          </p>
        </div>
        {round.participants > 0 && (
          <p className="text-gray-500 text-xs sm:text-sm">
            {round.participants.toLocaleString()}명 참여
          </p>
        )}
      </div>
    </div>
  );
}

function RoundDetail({ round }) {
  if (!round) return null;

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 sticky top-32">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className="text-ruby-500 font-medium text-sm sm:text-base">{round.number}</span>
        {round.status === 'active' && (
          <span className="px-1.5 py-0.5 sm:px-2 bg-ruby-600 text-white text-[10px] sm:text-xs rounded-full animate-pulse">
            참여 가능
          </span>
        )}
      </div>

      <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">{round.title}</h2>

      <div className="mb-4 sm:mb-6">
        <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">참여비 (보석 구매 예약금)</p>
        <p className={`text-2xl sm:text-4xl font-bold ${
          round.price === 0 ? 'text-green-400' : 'text-ruby-400'
        }`}>
          {round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`}
        </p>
      </div>

      <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">{round.details}</p>

      <div className="bg-dark-700 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
        <p className="text-gray-400 text-xs sm:text-sm">{round.description}</p>
      </div>

      {round.status === 'active' ? (
        <button className="w-full btn-primary text-base sm:text-lg py-3 sm:py-4">
          라운드 참여하기
        </button>
      ) : round.status === 'completed' ? (
        <button className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-dark-700 text-gray-500 rounded-lg cursor-not-allowed text-sm sm:text-base">
          종료된 라운드
        </button>
      ) : (
        <button className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-dark-700 text-gray-500 rounded-lg cursor-not-allowed text-sm sm:text-base">
          아직 오픈되지 않음
        </button>
      )}

      <p className="text-center text-gray-500 text-[10px] sm:text-xs mt-3 sm:mt-4">
        참여비 전액은 시즌 종료 시 실물 루비 보석 또는 적립금으로 귀속됩니다.
      </p>
    </div>
  );
}

export default function Rounds() {
  const [selectedRound, setSelectedRound] = useState(rounds.find(r => r.status === 'active') || rounds[0]);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
            라운드 <span className="text-ruby-500">참여</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            각 라운드에 참여하여 시즌 보상을 향해 나아가세요.
            라운드가 진행될수록 보상 기대치가 상승합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {rounds.map((round) => (
              <RoundCard
                key={round.id}
                round={round}
                isSelected={selectedRound?.id === round.id}
                onClick={() => setSelectedRound(round)}
              />
            ))}
          </div>

          <div className="hidden lg:block">
            <RoundDetail round={selectedRound} />
          </div>
        </div>

        {/* Mobile detail */}
        {selectedRound && (
          <div className="lg:hidden mt-6 sm:mt-8">
            <RoundDetail round={selectedRound} />
          </div>
        )}
      </div>
    </div>
  );
}
