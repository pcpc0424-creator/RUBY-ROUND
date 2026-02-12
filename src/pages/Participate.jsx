import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { seasonApi } from '../api/apiClient';

// 토스페이먼츠 클라이언트 키
const TOSS_CLIENT_KEY = 'live_gck_E92LAa5PVbPzPdypLX9B87YmpXyJ';

export default function Participate() {
  const [selectedRound, setSelectedRound] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const seasons = await seasonApi.getSeasons();
        if (!seasons || seasons.length === 0) {
          setError('등록된 시즌이 없습니다.');
          setLoading(false);
          return;
        }

        const activeSeason = seasons.find(s => s.status === 'active') || seasons[0];
        setSeason(activeSeason);

        if (activeSeason) {
          const seasonRounds = await seasonApi.getRounds(activeSeason.id);
          if (seasonRounds && seasonRounds.length > 0) {
            // Sort by round number
            seasonRounds.sort((a, b) => (a.round_number || 0) - (b.round_number || 0));
            setRounds(seasonRounds);
          } else {
            setError('등록된 라운드가 없습니다.');
          }
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePayment = async () => {
    const round = rounds.find(r => r.id === selectedRound);
    if (!round || round.price === 0) return;

    setIsProcessing(true);

    try {
      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      const userName = localStorage.getItem('userName') || '사용자';
      const userEmail = localStorage.getItem('userEmail') || 'guest@rubyround.net';
      const orderId = `RUBY-${round.id}-${Date.now()}`;

      await tossPayments.requestPayment('카드', {
        amount: round.price,
        orderId: orderId,
        orderName: `${round.number} - ${round.title} 참여비`,
        customerName: userName,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        console.error('결제 오류:', error);
        alert('결제 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gray-600/20 text-gray-400 border-gray-600';
      case 'active':
        return 'bg-ruby-600/20 text-ruby-400 border-ruby-600';
      case 'upcoming':
        return 'bg-dark-700 text-gray-500 border-dark-600';
      default:
        return 'bg-dark-700 text-gray-500 border-dark-600';
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
        return '예정';
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-ruby-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

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
        {season && (
          <div className="card p-4 sm:p-6 mb-6 sm:mb-8 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${season.status === 'active' ? 'bg-ruby-500 animate-pulse' : 'bg-gray-500'}`} />
              <h2 className="text-lg sm:text-xl font-bold">{season.name} {season.status === 'active' ? '진행중' : ''}</h2>
            </div>
            {season.description && (
              <p className="text-gray-400 text-sm sm:text-base mb-4">{season.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>총 {rounds.length} 라운드</span>
              {season.end_date && (
                <>
                  <span>|</span>
                  <span>마감: {new Date(season.end_date).toLocaleDateString('ko-KR')}</span>
                </>
              )}
            </div>
          </div>
        )}

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
                    {round.round_number}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">{round.title || round.name}</h3>
                    {round.description && (
                      <p className="text-gray-500 text-xs sm:text-sm">{round.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(round.status)}`}>
                    {getStatusText(round.status)}
                  </span>
                  <span className={`font-bold text-sm sm:text-base ${round.status !== 'active' ? 'text-gray-500' : ''}`}>
                    {round.status === 'active' ? (round.price === 0 ? '무료' : `${round.price.toLocaleString()}원`) : '-'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Section */}
        <div className="card bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50 p-4 sm:p-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          {selectedRound ? (() => {
            const round = rounds.find(r => r.id === selectedRound);
            if (!round) return null;
            return (
              <>
                <h3 className="text-lg sm:text-xl font-bold mb-4">결제 정보</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-400">선택 라운드</span>
                    <span>{round.number} - {round.title || round.name}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-400">참여비</span>
                    <span>{round.price.toLocaleString()}원</span>
                  </div>
                  <div className="border-t border-dark-600 pt-3 flex justify-between font-bold">
                    <span>총 결제금액</span>
                    <span className="text-ruby-400">{round.price.toLocaleString()}원</span>
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '결제 처리 중...' : '결제하기'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  결제 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                </p>
              </>
            );
          })() : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">참여할 라운드를 선택해주세요.</p>
              {!isLoggedIn && (
                <p className="text-xs text-gray-500">
                  로그인 후 참여가 가능합니다.{' '}
                  <Link to="/login" className="text-ruby-400 hover:underline">로그인하기</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
