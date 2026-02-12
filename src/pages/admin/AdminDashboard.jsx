import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatistics, getUserStatistics } from '../../api/exchangeApi';
import { getSeasons } from '../../api/seasonApi';
import { formatAmount } from '../../utils/localStorage';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [exchangeResult, userResult, seasonResult] = await Promise.all([
        getStatistics(),
        getUserStatistics(),
        getSeasons(),
      ]);

      if (exchangeResult.success) {
        setStats(exchangeResult.data);
      }
      if (userResult.success) {
        setUserStats(userResult.data);
      }
      if (seasonResult.success) {
        setSeasons(seasonResult.data || []);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: '전체 신청',
      value: stats?.total || 0,
      suffix: '건',
      color: 'bg-dark-700',
      icon: (
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: '대기 중',
      value: (stats?.byStatus?.received || 0) + (stats?.byStatus?.cs_consulting || 0),
      suffix: '건',
      color: 'bg-blue-500/10 border-blue-500/30',
      textColor: 'text-blue-400',
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '승인 대기',
      value: stats?.byStatus?.consultation_confirmed || 0,
      suffix: '건',
      color: 'bg-yellow-500/10 border-yellow-500/30',
      textColor: 'text-yellow-400',
      icon: (
        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '승인 완료',
      value: stats?.byStatus?.approved || 0,
      suffix: '건',
      color: 'bg-green-500/10 border-green-500/30',
      textColor: 'text-green-400',
      icon: (
        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  const amountStats = [
    {
      title: '총 신청 금액',
      value: formatAmount(stats?.totalRequestedAmount || 0),
      color: 'text-gray-400',
    },
    {
      title: '승인(차감) 금액',
      value: formatAmount(stats?.totalApprovedAmount || 0),
      color: 'text-ruby-400',
    },
  ];

  // 라운드 수 계산
  const totalRounds = seasons.reduce((acc, season) => acc + (season.rounds?.length || 0), 0);
  const activeRounds = seasons.reduce((acc, season) =>
    acc + (season.rounds?.filter(r => r.status === 'active')?.length || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">대시보드</h1>
        <p className="text-gray-400 text-sm mt-1">서비스 현황을 한눈에 확인합니다.</p>
      </div>

      {/* 주요 현황 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-blue-300 text-xs sm:text-sm">전체 회원</span>
            <svg className="w-6 h-6 text-blue-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {userStats?.totalUsers || 0}
            <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">명</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-purple-300 text-xs sm:text-sm">진행 시즌</span>
            <svg className="w-6 h-6 text-purple-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {seasons.filter(s => s.status === 'active').length || 0}
            <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">/ {seasons.length}</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border border-emerald-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-emerald-300 text-xs sm:text-sm">진행 라운드</span>
            <svg className="w-6 h-6 text-emerald-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {activeRounds}
            <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">/ {totalRounds}</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/10 border border-amber-500/30 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-amber-300 text-xs sm:text-sm">성인인증</span>
            <svg className="w-6 h-6 text-amber-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {userStats?.adultVerifiedUsers || 0}
            <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">명</span>
          </p>
        </div>
      </div>

      {/* 시즌/라운드 현황 */}
      {seasons.length > 0 && (
        <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-dark-600 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm sm:text-base">시즌/라운드 현황</h3>
            <Link to="/admin/seasons" className="text-xs text-ruby-400 hover:text-ruby-300">전체보기</Link>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            {seasons.slice(0, 3).map((season) => (
              <div key={season.id} className="bg-dark-700/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white text-sm">{season.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    season.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    season.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {season.status === 'active' ? '진행중' : season.status === 'upcoming' ? '예정' : '종료'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  라운드 {season.rounds?.length || 0}개
                  {season.rounds?.filter(r => r.status === 'active').length > 0 && (
                    <span className="text-emerald-400 ml-2">
                      (진행중 {season.rounds.filter(r => r.status === 'active').length}개)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 교환 신청 현황 제목 */}
      <div className="pt-2">
        <h2 className="text-lg font-semibold text-white">교환 신청 현황</h2>
        <p className="text-gray-400 text-xs mt-1">교환 신청 및 처리 상태를 확인합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.color} border border-dark-600 rounded-xl p-4 sm:p-5`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <span className="text-gray-400 text-xs sm:text-sm">{card.title}</span>
              <div className="hidden sm:block">{card.icon}</div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${card.textColor || 'text-white'}`}>
              {card.value}
              <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">{card.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 금액 통계 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {amountStats.map((stat, idx) => (
          <div key={idx} className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-5">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">{stat.title}</p>
            <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 상태별 현황 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-dark-600">
          <h3 className="font-semibold text-white text-sm sm:text-base">상태별 현황</h3>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { key: 'received', label: '접수완료', color: 'bg-blue-500' },
              { key: 'cs_consulting', label: '전문 상담사 확인중', color: 'bg-cyan-500' },
              { key: 'consultation_confirmed', label: '상담확정', color: 'bg-yellow-500' },
              { key: 'approved', label: '승인(차감)', color: 'bg-green-500' },
              { key: 'in_production', label: '제작중', color: 'bg-purple-500' },
              { key: 'ready_to_ship', label: '출고준비', color: 'bg-orange-500' },
              { key: 'shipping', label: '배송중', color: 'bg-pink-500' },
              { key: 'delivered', label: '배송완료', color: 'bg-teal-500' },
              { key: 'completed', label: '완료', color: 'bg-gray-500' },
              { key: 'cancelled', label: '취소', color: 'bg-red-500' },
            ].map((status) => (
              <div key={status.key} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${status.color}`}></div>
                <span className="text-gray-400 text-xs sm:text-sm truncate">{status.label}</span>
                <span className="text-white font-medium text-sm ml-auto">
                  {stats?.byStatus?.[status.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-5">
        <h3 className="font-semibold text-white text-sm sm:text-base mb-3 sm:mb-4">빠른 액션</h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            to="/admin/exchange?status=received"
            className="px-3 sm:px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm rounded-lg transition-colors"
          >
            신규 접수 확인
          </Link>
          <Link
            to="/admin/exchange?status=consultation_confirmed"
            className="px-3 sm:px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-sm rounded-lg transition-colors"
          >
            승인 대기 목록
          </Link>
          <Link
            to="/admin/exchange?status=in_production"
            className="px-3 sm:px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm rounded-lg transition-colors"
          >
            제작 중 현황
          </Link>
        </div>
      </div>
    </div>
  );
}
