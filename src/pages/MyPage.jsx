import { Link } from 'react-router-dom';

const userData = {
  name: '김루비',
  email: 'ruby@example.com',
  joinDate: '2024.01.15',
  totalDeposit: 2500000,
  credits: 150000,
  currentSeason: {
    name: 'Season 01',
    participatedRounds: [1, 2, 3],
    totalDeposit: 2500000,
    estimatedTier: 'A',
  },
  history: [
    { round: 'Round 1', date: '2024.01.20', amount: 0, status: '완료' },
    { round: 'Round 2', date: '2024.02.05', amount: 500000, status: '완료' },
    { round: 'Round 3', date: '2024.02.20', amount: 1000000, status: '완료' },
    { round: 'Round 4', date: '-', amount: 1000000, status: '예정' },
  ],
};

function ProfileSection() {
  return (
    <div className="card p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-ruby-500 to-ruby-700 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold animate-glow">
          {userData.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{userData.name}</h2>
          <p className="text-gray-400 text-xs sm:text-sm">{userData.email}</p>
          <p className="text-gray-500 text-[10px] sm:text-xs">가입일: {userData.joinDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-dark-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover-lift">
          <p className="text-gray-500 text-[10px] sm:text-xs mb-1">총 누적 예약금</p>
          <p className="text-lg sm:text-xl font-bold text-ruby-400">
            ₩{userData.totalDeposit.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover-lift">
          <p className="text-gray-500 text-[10px] sm:text-xs mb-1">보석 적립금</p>
          <p className="text-lg sm:text-xl font-bold text-green-400">
            ₩{userData.credits.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function CurrentSeasonSection() {
  const { currentSeason } = userData;

  return (
    <div className="card p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold">나의 시즌 참여 현황</h3>
        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-ruby-600/20 text-ruby-400 text-xs sm:text-sm rounded-full animate-pulse">
          {currentSeason.name}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center animate-count-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <p className="text-2xl sm:text-3xl font-bold text-ruby-500">
            {currentSeason.participatedRounds.length}
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1">참여 라운드</p>
        </div>
        <div className="text-center animate-count-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <p className="text-2xl sm:text-3xl font-bold">
            ₩{(currentSeason.totalDeposit / 10000).toFixed(0)}
            <span className="text-base sm:text-lg text-gray-500">만</span>
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1">시즌 예약금</p>
        </div>
        <div className="text-center animate-count-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <p className="text-2xl sm:text-3xl font-bold text-amber-400">
            {currentSeason.estimatedTier}
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-1">예상 티어</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <p className="text-gray-400 text-xs sm:text-sm">참여 라운드</p>
        <div className="flex-1 h-px bg-dark-600" />
      </div>

      <div className="flex gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((round) => (
          <div
            key={round}
            className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
              currentSeason.participatedRounds.includes(round)
                ? 'bg-ruby-500 animate-pulse'
                : 'bg-dark-600'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5 sm:mt-2">
        <span className="text-gray-500 text-[10px] sm:text-xs">R1</span>
        <span className="text-gray-500 text-[10px] sm:text-xs">R7</span>
      </div>

      <Link to="/rounds" className="btn-primary w-full mt-4 sm:mt-6 text-center block text-sm sm:text-base relative overflow-hidden group">
        <span className="relative z-10">다음 라운드 참여하기</span>
        <div className="absolute inset-0 animate-shimmer opacity-30" />
      </Link>
    </div>
  );
}

function HistorySection() {
  return (
    <div className="card p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
      <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">참여 내역</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-dark-600">
              <th className="pb-2 sm:pb-3 text-gray-500 text-xs sm:text-sm font-medium">라운드</th>
              <th className="pb-2 sm:pb-3 text-gray-500 text-xs sm:text-sm font-medium">참여일</th>
              <th className="pb-2 sm:pb-3 text-gray-500 text-xs sm:text-sm font-medium text-right">예약금</th>
              <th className="pb-2 sm:pb-3 text-gray-500 text-xs sm:text-sm font-medium text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {userData.history.map((item, index) => (
              <tr
                key={index}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <td className="py-3 sm:py-4 font-medium text-xs sm:text-sm">{item.round}</td>
                <td className="py-3 sm:py-4 text-gray-400 text-xs sm:text-sm">{item.date}</td>
                <td className="py-3 sm:py-4 text-right text-xs sm:text-sm">
                  {item.amount === 0 ? (
                    <span className="text-green-400">무료</span>
                  ) : (
                    <span className="text-ruby-400">₩{item.amount.toLocaleString()}</span>
                  )}
                </td>
                <td className="py-3 sm:py-4 text-right">
                  <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded-full ${
                    item.status === '완료' ? 'bg-dark-600 text-gray-400' :
                    item.status === '예정' ? 'bg-ruby-600/20 text-ruby-400 animate-pulse' :
                    'bg-dark-600 text-gray-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreditsSection() {
  return (
    <div className="card bg-gradient-to-r from-green-950/30 to-dark-800 border-green-900/30 p-4 sm:p-6 hover-glow animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">보석 적립금</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-400 mb-1 sm:mb-2 text-shimmer">
            ₩{userData.credits.toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            적립금은 향후 보석 또는 커스텀 주얼리 교환에 사용 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MyPage() {
  // 실제 구현에서는 로그인 상태를 확인하고 데이터를 가져옵니다
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return (
      <div className="py-12 sm:py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-fade-in-scale">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 animate-fade-in-up">로그인이 필요합니다</h2>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base animate-fade-in-up">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link to="/login" className="btn-primary inline-block">로그인하기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-green-600/5 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          마이<span className="text-shimmer">페이지</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <ProfileSection />
            <CreditsSection />
          </div>
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CurrentSeasonSection />
            <HistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
