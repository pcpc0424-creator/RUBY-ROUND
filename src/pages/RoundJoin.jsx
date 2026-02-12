import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { seasonApi } from '../api/apiClient';

export default function RoundJoin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);

  useEffect(() => {
    const loadRound = async () => {
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

        if (activeSeason) {
          const seasonRounds = await seasonApi.getRounds(activeSeason.id);
          // ID로 찾기 (DB ID 또는 round_number로 매칭)
          const foundRound = seasonRounds?.find(r =>
            r.id === id ||
            r.id === `ROUND-${id}` ||
            String(r.round_number) === id
          );

          if (foundRound) {
            setRound(foundRound);
          } else {
            setError('라운드를 찾을 수 없습니다.');
          }
        }
      } catch (err) {
        console.error('라운드 로드 실패:', err);
        setError('라운드 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadRound();
  }, [id]);

  const handleJoin = () => {
    if (!agreedToTerms || !agreedToRefund) {
      alert('이용약관 및 환불정책에 동의해주세요.');
      return;
    }

    // 결제 페이지로 이동
    navigate(`/rounds/${round.id}/payment`);
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
  if (error || !round) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400 mb-4">{error || '라운드 정보를 찾을 수 없습니다.'}</p>
        <Link to="/rounds" className="text-ruby-400 hover:underline">
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

  const status = statusConfig[round.status] || statusConfig.upcoming;

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
          {round.description && (
            <p className="text-gray-400 text-sm sm:text-base">
              {round.description}
            </p>
          )}
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
                  <p className={`text-2xl sm:text-3xl font-bold ${
                    round.status === 'active' ? (round.price === 0 ? 'text-green-400' : 'text-shimmer') : 'text-gray-500'
                  }`}>
                    {round.status === 'active' ? (round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`) : '-'}
                  </p>
                </div>

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

            {/* Notice Card */}
            <div className="card bg-dark-800/50 border-yellow-900/30 p-5 sm:p-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
            <div className="card bg-gradient-to-b from-ruby-950/30 to-dark-800 border-ruby-900/50 p-5 sm:p-6 sticky top-32 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-lg font-bold mb-4">참여 신청</h2>

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">라운드</span>
                  <span>{round.number} - {round.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">참여비</span>
                  <span>{round.status === 'active' ? (round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`) : '-'}</span>
                </div>
                <div className="border-t border-dark-600 pt-3 flex justify-between font-bold">
                  <span>총 결제금액</span>
                  <span className={
                    round.status === 'active' ? (round.price === 0 ? 'text-green-400' : 'text-ruby-400') : 'text-gray-500'
                  }>
                    {round.status === 'active' ? (round.price === 0 ? '무료' : `₩${round.price.toLocaleString()}`) : '-'}
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
