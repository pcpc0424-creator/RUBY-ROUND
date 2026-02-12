import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRoundPayment } from '../api/seasonApi';
import { seasonApi } from '../api/apiClient';

function RoundCard({ round, isSelected, onClick, index }) {
  const statusConfig = {
    completed: { label: '종료', color: 'bg-dark-600 text-gray-400' },
    active: { label: '참여 가능', color: 'bg-ruby-600 text-white' },
    upcoming: { label: '예정', color: 'bg-dark-700 text-gray-500' },
  };

  const status = statusConfig[round.status];

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-500 p-4 sm:p-6 hover-lift animate-fade-in-up ${
        isSelected ? 'border-ruby-500 bg-ruby-950/20' : 'hover-glow'
      } ${round.status === 'active' ? 'ring-2 ring-ruby-500/30 animate-border-glow' : ''}`}
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-gray-400">{round.number}</span>
          <span className={`px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-xs rounded-full ${status.color} ${round.status === 'active' ? 'animate-pulse' : ''}`}>
            {status.label}
          </span>
        </div>
        <div className="flex gap-0.5 sm:gap-1">
          {[...Array(Math.min(index + 1, 5))].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 transition-all duration-300 ${
                round.status === 'completed' ? 'bg-ruby-600' :
                round.status === 'active' ? 'bg-ruby-500 animate-pulse' :
                'bg-dark-600'
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-ruby-400 transition-colors">{round.title}</h3>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1">참여비 (예약금)</p>
          <p className={`text-lg sm:text-2xl font-bold ${
            round.status === 'active' ? (round.price === 0 ? 'text-green-400' : 'text-ruby-400') : 'text-gray-500'
          }`}>
            {round.status === 'active' ? (round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`) : '-'}
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

function RoundDetail({ round, onPayment }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!round) return null;

  const handlePayment = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!agreedToTerms) {
      alert('이용약관 및 환불정책에 동의해주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      await onPayment(round);
    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl sm:rounded-2xl p-5 sm:p-8 sticky top-32 hover-glow animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
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
          round.status === 'active' ? (round.price === 0 ? 'text-green-400' : 'text-shimmer') : 'text-gray-500'
        }`}>
          {round.status === 'active' ? (round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`) : '-'}
        </p>
      </div>

      {round.description && (
        <div className="bg-dark-700 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-gray-400 text-xs sm:text-sm">{round.description}</p>
        </div>
      )}

      {/* 결제 수단 표시 */}
      {round.status === 'active' && round.price > 0 && (
        <div className="bg-dark-700 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">신용/체크카드</p>
              <p className="text-xs text-gray-400">모든 카드사 결제 가능</p>
            </div>
          </div>
        </div>
      )}

      {/* 동의 체크박스 */}
      {round.status === 'active' && (
        <label className="flex items-start gap-3 cursor-pointer group mb-4 sm:mb-6">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-700 text-ruby-500 focus:ring-ruby-500 focus:ring-offset-dark-800"
          />
          <span className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <Link to="/terms" className="text-ruby-400 hover:underline">이용약관</Link>,{' '}
            <Link to="/refund" className="text-ruby-400 hover:underline">환불정책</Link>에 동의합니다.
          </span>
        </label>
      )}

      {round.status === 'active' ? (
        <button
          onClick={handlePayment}
          disabled={isProcessing || !agreedToTerms}
          className={`w-full btn-primary text-base sm:text-lg py-3 sm:py-4 relative overflow-hidden group ${
            (isProcessing || !agreedToTerms) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="relative z-10">
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                결제 준비중...
              </span>
            ) : round.price === 0 ? (
              '무료 체험 시작하기'
            ) : (
              '참여하기'
            )}
          </span>
          {!isProcessing && agreedToTerms && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-shimmer opacity-30" />
            </>
          )}
        </button>
      ) : round.status === 'completed' ? (
        <Link
          to={`/rounds/${round.id}/join`}
          className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-dark-700 text-gray-400 rounded-lg text-sm sm:text-base block text-center hover:bg-dark-600 transition-colors"
        >
          상세 보기
        </Link>
      ) : (
        <Link
          to={`/rounds/${round.id}/join`}
          className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-dark-700 text-gray-400 rounded-lg text-sm sm:text-base block text-center hover:bg-dark-600 transition-colors"
        >
          상세 보기
        </Link>
      )}

      <p className="text-center text-gray-500 text-[10px] sm:text-xs mt-3 sm:mt-4">
        참여비 전액은 시즌 종료 시 실물 루비 보석 또는 적립금으로 귀속됩니다.
      </p>
    </div>
  );
}

export default function Rounds() {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRounds = async () => {
      setLoading(true);
      setError(null);
      try {
        const seasons = await seasonApi.getSeasons();
        if (!seasons || seasons.length === 0) {
          setError('등록된 시즌이 없습니다.');
          setLoading(false);
          return;
        }

        // Find active season
        const activeSeason = seasons.find(s => s.status === 'active') || seasons[0];

        if (activeSeason) {
          const seasonRounds = await seasonApi.getRounds(activeSeason.id);

          if (seasonRounds && seasonRounds.length > 0) {
            // Sort by round number
            seasonRounds.sort((a, b) => {
              return (a.round_number || 0) - (b.round_number || 0);
            });

            setRounds(seasonRounds);
            setSelectedRound(seasonRounds.find(r => r.status === 'active') || seasonRounds[0]);
          } else {
            setError('등록된 라운드가 없습니다.');
          }
        }
      } catch (err) {
        console.error('라운드 로드 실패:', err);
        setError('라운드 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadRounds();
  }, []);

  // 결제 처리 함수
  const handlePayment = async (round) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 무료 라운드는 바로 참여 처리
    if (round.price === 0) {
      const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';
      const userName = localStorage.getItem('userName') || '사용자';

      // 무료 라운드 참여 기록 저장
      await createRoundPayment({
        userEmail,
        userName,
        seasonId: round.seasonId,
        roundId: round.id,
        roundTitle: round.title,
        amount: 0,
      });

      alert('무료 체험 라운드에 참여하셨습니다!');
      navigate('/mypage');
      return;
    }

    // 결제 페이지로 이동
    navigate(`/rounds/${round.id}/join`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-ruby-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">라운드 정보를 불러오는 중...</p>
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
      <div className="absolute top-20 right-0 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating particles */}
      <div className="absolute top-40 left-[10%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-30" />
      <div className="absolute bottom-60 right-[15%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-25" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            라운드 <span className="text-shimmer">참여</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            각 라운드에 참여하여 시즌 보상을 향해 나아가세요.
            라운드가 진행될수록 보상 기대치가 상승합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {rounds.map((round, index) => (
              <RoundCard
                key={round.id}
                round={round}
                isSelected={selectedRound?.id === round.id}
                onClick={() => setSelectedRound(round)}
                index={index}
              />
            ))}
          </div>

          <div className="hidden lg:block">
            <RoundDetail round={selectedRound} onPayment={handlePayment} />
          </div>
        </div>

        {/* Mobile detail */}
        {selectedRound && (
          <div className="lg:hidden mt-6 sm:mt-8">
            <RoundDetail round={selectedRound} onPayment={handlePayment} />
          </div>
        )}
      </div>
    </div>
  );
}
