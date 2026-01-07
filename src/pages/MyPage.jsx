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
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-ruby-500 to-ruby-700 rounded-full flex items-center justify-center text-2xl font-bold">
          {userData.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-gray-400 text-sm">{userData.email}</p>
          <p className="text-gray-500 text-xs">가입일: {userData.joinDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">총 누적 예약금</p>
          <p className="text-xl font-bold text-ruby-400">
            ₩{userData.totalDeposit.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-700 rounded-xl p-4">
          <p className="text-gray-500 text-xs mb-1">보석 적립금</p>
          <p className="text-xl font-bold text-green-400">
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
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">나의 시즌 참여 현황</h3>
        <span className="px-3 py-1 bg-ruby-600/20 text-ruby-400 text-sm rounded-full">
          {currentSeason.name}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-ruby-500">
            {currentSeason.participatedRounds.length}
          </p>
          <p className="text-gray-500 text-xs mt-1">참여 라운드</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">
            ₩{(currentSeason.totalDeposit / 10000).toFixed(0)}
            <span className="text-lg text-gray-500">만</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">시즌 예약금</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-amber-400">
            {currentSeason.estimatedTier}
          </p>
          <p className="text-gray-500 text-xs mt-1">예상 티어</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <p className="text-gray-400 text-sm">참여 라운드</p>
        <div className="flex-1 h-px bg-dark-600" />
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((round) => (
          <div
            key={round}
            className={`flex-1 h-2 rounded-full ${
              currentSeason.participatedRounds.includes(round)
                ? 'bg-ruby-500'
                : 'bg-dark-600'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-gray-500 text-xs">R1</span>
        <span className="text-gray-500 text-xs">R7</span>
      </div>

      <Link to="/rounds" className="btn-primary w-full mt-6 text-center block">
        다음 라운드 참여하기
      </Link>
    </div>
  );
}

function HistorySection() {
  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-6">참여 내역</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-dark-600">
              <th className="pb-3 text-gray-500 text-sm font-medium">라운드</th>
              <th className="pb-3 text-gray-500 text-sm font-medium">참여일</th>
              <th className="pb-3 text-gray-500 text-sm font-medium text-right">예약금</th>
              <th className="pb-3 text-gray-500 text-sm font-medium text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {userData.history.map((item, index) => (
              <tr key={index}>
                <td className="py-4 font-medium">{item.round}</td>
                <td className="py-4 text-gray-400">{item.date}</td>
                <td className="py-4 text-right">
                  {item.amount === 0 ? (
                    <span className="text-green-400">무료</span>
                  ) : (
                    <span className="text-ruby-400">₩{item.amount.toLocaleString()}</span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === '완료' ? 'bg-dark-600 text-gray-400' :
                    item.status === '예정' ? 'bg-ruby-600/20 text-ruby-400' :
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
    <div className="card bg-gradient-to-r from-green-950/30 to-dark-800 border-green-900/30">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">보석 적립금</h3>
          <p className="text-3xl font-bold text-green-400 mb-2">
            ₩{userData.credits.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">
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
      <div className="py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-400 mb-6">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link to="/login" className="btn-primary">로그인하기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">
          마이<span className="text-ruby-500">페이지</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <ProfileSection />
            <CreditsSection />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <CurrentSeasonSection />
            <HistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
