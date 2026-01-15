import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Participate() {
  const [selectedRound, setSelectedRound] = useState(null);

  const rounds = [
    { id: 1, name: 'Round 1', price: 0, status: 'completed', description: '무료 체험 라운드' },
    { id: 2, name: 'Round 2', price: 50000, status: 'active', description: '시즌 본격 시작' },
    { id: 3, name: 'Round 3', price: 50000, status: 'upcoming', description: '진행 예정' },
    { id: 4, name: 'Round 4', price: 50000, status: 'upcoming', description: '진행 예정' },
    { id: 5, name: 'Round 5', price: 50000, status: 'upcoming', description: '진행 예정' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gray-600/20 text-gray-400 border-gray-600';
      case 'active':
        return 'bg-ruby-600/20 text-ruby-400 border-ruby-600';
      case 'upcoming':
        return 'bg-dark-700 text-gray-500 border-dark-600';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return '종료';
      case 'active':
        return '진행중';
      case 'upcoming':
        return '예정';
      default:
        return '';
    }
  };

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[15%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" />
      <div className="absolute bottom-60 left-[10%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '0.7s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            시즌 <span className="text-shimmer">참여하기</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            원하는 라운드를 선택하고 참여해보세요.
          </p>
        </div>

        {/* Current Season Info */}
        <div className="card p-4 sm:p-6 mb-6 sm:mb-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-ruby-500 rounded-full animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold">Season 1 진행중</h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            현재 Round 2가 진행 중입니다. 참여하여 루비 보석을 획득할 기회를 잡으세요!
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>총 5 라운드</span>
            <span>|</span>
            <span>마감: 2026년 3월 31일</span>
          </div>
        </div>

        {/* Round Selection */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {rounds.map((round, index) => (
            <button
              key={round.id}
              onClick={() => round.status === 'active' && setSelectedRound(round.id)}
              disabled={round.status !== 'active'}
              className={`w-full card p-4 sm:p-5 text-left transition-all duration-300 animate-fade-in-up opacity-0 ${
                round.status === 'active'
                  ? 'hover:border-ruby-500 cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              } ${selectedRound === round.id ? 'border-ruby-500 bg-ruby-600/10' : ''}`}
              style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold ${
                    round.status === 'active' ? 'bg-ruby-600 text-white' : 'bg-dark-700 text-gray-500'
                  }`}>
                    {round.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">{round.name}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">{round.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(round.status)}`}>
                    {getStatusText(round.status)}
                  </span>
                  <span className="font-bold text-sm sm:text-base">
                    {round.price === 0 ? '무료' : `${round.price.toLocaleString()}원`}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Section */}
        <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          {selectedRound ? (
            <>
              <h3 className="text-lg sm:text-xl font-bold mb-4">결제 정보</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">선택 라운드</span>
                  <span>Round {selectedRound}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-400">참여비</span>
                  <span>50,000원</span>
                </div>
                <div className="border-t border-dark-600 pt-3 flex justify-between font-bold">
                  <span>총 결제금액</span>
                  <span className="text-ruby-400">50,000원</span>
                </div>
              </div>
              <button className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base">
                결제하기
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                결제 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">참여할 라운드를 선택해주세요.</p>
              <p className="text-xs text-gray-500">
                로그인 후 참여가 가능합니다.{' '}
                <Link to="/login" className="text-ruby-400 hover:underline">로그인하기</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
