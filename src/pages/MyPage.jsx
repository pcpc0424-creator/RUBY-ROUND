import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExchangeApplyForm from '../components/exchange/ExchangeApplyForm';
import ExchangeComplete from '../components/exchange/ExchangeComplete';
import ExchangeHistoryList from '../components/exchange/ExchangeHistoryList';
import { getUserLedger, getPaymentsByUser } from '../api/seasonApi';
import { deleteUser, changePassword, updateUser, getUserDetail } from '../api/exchangeApi';

// 샘플 데이터
const userData = {
  name: '김루비',
  email: 'ruby@example.com',
  phone: '010-1234-5678',
  joinDate: '2024.01.15',
};

const participationData = [
  { id: 1, season: 'Season 1', round: 'Round 1', date: '2026.01.10', amount: 0, status: '완료' },
  { id: 2, season: 'Season 1', round: 'Round 2', date: '2026.01.15', amount: 50000, status: '완료' },
  { id: 3, season: 'Season 1', round: 'Round 3', date: '-', amount: 50000, status: '예정' },
];

const paymentData = [
  { id: 1, date: '2026.01.15', description: 'Season 1 Round 2 참여', amount: 50000, method: '카카오페이', status: '완료' },
  { id: 2, date: '2026.01.10', description: 'Season 1 Round 1 참여', amount: 0, method: '-', status: '완료(무료)' },
];

const exchangeData = [
  { id: 1, date: '2026.01.20', product: '루비 펜던트 목걸이', status: '배송완료', trackingNo: '1234567890' },
];

const deliveryAddresses = [
  { id: 1, name: '집', recipient: '김루비', phone: '010-1234-5678', address: '서울특별시 강남구 테헤란로 123', isDefault: true },
  { id: 2, name: '회사', recipient: '김루비', phone: '010-1234-5678', address: '서울특별시 서초구 서초대로 456', isDefault: false },
];

const coupons = [
  { id: 1, name: '신규 가입 축하 쿠폰', discount: '10%', expiry: '2026.03.31', minOrder: 50000 },
  { id: 2, name: 'Season 1 참여자 특별 할인', discount: '5,000원', expiry: '2026.02.28', minOrder: 100000 },
];

// 메뉴 구조
const menuItems = [
  {
    id: 'participation',
    name: 'MY 참여',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    subItems: [
      { id: 'participation-history', name: '라운드 참여내역' },
      { id: 'payment-history', name: '결제내역' },
    ],
  },
  {
    id: 'balance',
    name: 'MY 교환금',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    subItems: [
      { id: 'balance-overview', name: '잔액/내역' },
    ],
  },
  {
    id: 'exchange',
    name: 'MY 상품 교환',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    subItems: [
      { id: 'exchange-apply', name: '신청하기' },
      { id: 'exchange-history', name: '신청내역' },
    ],
  },
  {
    id: 'delivery',
    name: 'MY 배송',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    subItems: [
      { id: 'delivery-tracking', name: '배송조회' },
      { id: 'delivery-address', name: '배송지관리' },
    ],
  },
  {
    id: 'benefits',
    name: 'MY 혜택',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    subItems: [
      { id: 'coupons', name: '할인쿠폰' },
    ],
  },
  {
    id: 'info',
    name: 'MY 정보',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    subItems: [
      { id: 'profile', name: '개인정보확인/수정' },
    ],
  },
];

// 콘텐츠 컴포넌트들
function ParticipationHistory() {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipations = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const result = await getUserLedger(userEmail);
        if (result.success && result.data) {
          // 참여 내역만 필터링
          const participationItems = result.data.filter(item =>
            item.type === 'participation' || item.description?.includes('참여')
          );
          setParticipations(participationItems);
        }
      }
      setLoading(false);
    };
    loadParticipations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold">라운드 참여내역</h3>
        <div className="card p-8 text-center text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">라운드 참여내역</h3>

      {participations.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-2">참여내역이 없습니다.</div>
          <p className="text-sm text-gray-500">라운드에 참여하면 이곳에 내역이 표시됩니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 레이아웃 */}
          <div className="sm:hidden space-y-3">
            {participations.map((item, index) => (
              <div key={item.id || index} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.season || 'Season 1'}</span>
                    <span className="text-ruby-400 font-bold">{item.round || '-'}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === '완료' ? 'bg-dark-600 text-gray-400' : 'bg-ruby-600/20 text-ruby-400'
                  }`}>
                    {item.status || '완료'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{item.date || new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                  {item.amount === 0 ? (
                    <span className="text-green-400 font-medium">무료</span>
                  ) : (
                    <span className="text-ruby-400 font-medium">{(item.amount || 0).toLocaleString()}원</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* PC 테이블 레이아웃 */}
          <div className="hidden sm:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-400">시즌</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-400">라운드</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-400">참여일</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-400">참여비</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-400">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {participations.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-3 text-xs sm:text-sm">{item.season || 'Season 1'}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-medium">{item.round || '-'}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-400">{item.date || new Date(item.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-right">
                        {item.amount === 0 ? (
                          <span className="text-green-400">무료</span>
                        ) : (
                          <span className="text-ruby-400">{(item.amount || 0).toLocaleString()}원</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === '완료' ? 'bg-dark-600 text-gray-400' : 'bg-ruby-600/20 text-ruby-400'
                        }`}>
                          {item.status || '완료'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const result = await getPaymentsByUser(userEmail);
        if (result.success && result.data) {
          setPayments(result.data);
        }
      }
      setLoading(false);
    };
    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold">결제내역</h3>
        <div className="card p-8 text-center text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">결제내역</h3>

      {payments.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-2">결제내역이 없습니다.</div>
          <p className="text-sm text-gray-500">결제가 완료되면 이곳에 내역이 표시됩니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 레이아웃 */}
          <div className="sm:hidden space-y-3">
            {payments.map((item, index) => (
              <div key={item.id || index} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">{item.date || new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-400">
                    {item.status || '완료'}
                  </span>
                </div>
                <p className="text-sm font-medium mb-3">{item.description || '-'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{item.method || '-'}</span>
                  <span className="text-ruby-400 font-medium">
                    {item.amount === 0 ? '무료' : `${(item.amount || 0).toLocaleString()}원`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PC 테이블 레이아웃 */}
          <div className="hidden sm:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-400">결제일</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-400">내용</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-400">금액</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-400">결제수단</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-400">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {payments.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-400">{item.date || new Date(item.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm">{item.description || '-'}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-right text-ruby-400">
                        {item.amount === 0 ? '무료' : `${(item.amount || 0).toLocaleString()}원`}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-right text-gray-400">{item.method || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-400">
                          {item.status || '완료'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExchangeApply({ onNavigate }) {
  const [view, setView] = useState('form'); // 'form' | 'complete'
  const [completedApplication, setCompletedApplication] = useState(null);

  const handleComplete = (application) => {
    setCompletedApplication(application);
    setView('complete');
  };

  const handleViewHistory = () => {
    onNavigate('exchange-history');
  };

  const handleNewApplication = () => {
    setCompletedApplication(null);
    setView('form');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">
        {view === 'form' ? '교환 신청' : '신청 완료'}
      </h3>
      <div className="card p-4 sm:p-6">
        {view === 'form' ? (
          <ExchangeApplyForm
            onComplete={handleComplete}
            onCancel={null}
          />
        ) : (
          <ExchangeComplete
            application={completedApplication}
            onViewHistory={handleViewHistory}
            onNewApplication={handleNewApplication}
          />
        )}
      </div>
    </div>
  );
}

function ExchangeHistory() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">교환 신청내역</h3>
      <ExchangeHistoryList />
    </div>
  );
}

function BalanceOverview() {
  const [balanceData, setBalanceData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credit'); // 'credit' | 'debit' | 'payments'

  const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [balanceRes, paymentsRes] = await Promise.all([
      getUserLedger(userEmail),
      getPaymentsByUser(userEmail),
    ]);

    if (balanceRes.success) {
      setBalanceData(balanceRes.data);
    }
    if (paymentsRes.success) {
      setPayments(paymentsRes.data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold">교환금 잔액/내역</h3>
        <div className="card p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ruby-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4">로딩 중...</p>
        </div>
      </div>
    );
  }

  const creditLedger = balanceData?.ledger?.filter(l => l.type === 'credit') || [];
  const debitLedger = balanceData?.ledger?.filter(l => l.type === 'debit') || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">교환금 잔액/내역</h3>

      {/* 잔액 카드 */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-ruby-950/50 to-dark-800 border-ruby-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-ruby-600/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-ruby-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm">현재 교환금 잔액</p>
            <p className="text-2xl sm:text-3xl font-bold text-shimmer">
              ₩{(balanceData?.totalBalance || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-600">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">사용 가능</p>
            <p className="text-lg font-medium text-green-400">₩{(balanceData?.availableBalance || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">사용 완료</p>
            <p className="text-lg font-medium text-gray-400">₩{(balanceData?.usedBalance || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 border-b border-dark-600">
        <button
          onClick={() => setActiveTab('credit')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'credit'
              ? 'border-ruby-500 text-ruby-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          적립 내역 ({creditLedger.length})
        </button>
        <button
          onClick={() => setActiveTab('debit')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'debit'
              ? 'border-ruby-500 text-ruby-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          차감 내역 ({debitLedger.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-ruby-500 text-ruby-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          결제 내역 ({payments.length})
        </button>
      </div>

      {/* 적립 내역 */}
      {activeTab === 'credit' && (
        <div className="space-y-3">
          {creditLedger.length === 0 ? (
            <div className="card p-6 text-center text-gray-400">
              적립 내역이 없습니다.
            </div>
          ) : (
            creditLedger.map((entry) => (
              <div key={entry.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 text-xs rounded bg-green-600/20 text-green-400">적립</span>
                      {entry.reason === 'SEASON_SETTLEMENT' && (
                        <>
                          {entry.isWinnerRoundParticipant ? (
                            <span className="px-2 py-0.5 text-xs rounded bg-ruby-600/20 text-ruby-400">당첨 정산</span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs rounded bg-blue-600/20 text-blue-400">미당첨 적립</span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      {entry.reason === 'SEASON_SETTLEMENT' ? '시즌 정산 적립' : entry.description || '교환금 적립'}
                    </p>
                    {entry.seasonId && (
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        시즌: {entry.seasonId}
                        {entry.winningRoundId && ` / 당첨 라운드: ${entry.winningRoundId}`}
                      </p>
                    )}
                    {entry.totalPaidInSeason && (
                      <p className="text-xs text-gray-500 mt-1">
                        누적 참여비: ₩{entry.totalPaidInSeason.toLocaleString()}
                        {entry.winningValue > 0 && ` / 당첨가액: ₩${entry.winningValue.toLocaleString()}`}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-green-400">+₩{entry.amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">잔액: ₩{entry.balanceAfter?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 차감 내역 */}
      {activeTab === 'debit' && (
        <div className="space-y-3">
          {debitLedger.length === 0 ? (
            <div className="card p-6 text-center text-gray-400">
              차감 내역이 없습니다.
            </div>
          ) : (
            debitLedger.map((entry) => (
              <div key={entry.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs rounded bg-red-600/20 text-red-400">차감</span>
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      {entry.description || '교환 신청 승인'}
                    </p>
                    {entry.relatedId && (
                      <p className="text-xs text-gray-500 mt-1">신청번호: {entry.relatedId}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-red-400">-₩{entry.amount?.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">잔액: ₩{entry.balanceAfter?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 결제 내역 */}
      {activeTab === 'payments' && (
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="card p-6 text-center text-gray-400">
              결제 내역이 없습니다.
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        payment.status === 'success'
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {payment.status === 'success' ? '결제완료' : '취소'}
                      </span>
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      {payment.roundTitle || '라운드 참여'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      시즌: {payment.seasonId} / 라운드: {payment.roundId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(payment.paidAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-ruby-400">₩{payment.amount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 안내 */}
      <div className="card bg-dark-800/50 border-yellow-900/30 p-4">
        <h4 className="font-medium text-yellow-500 flex items-center gap-2 mb-2 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          교환금 안내
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>- 교환금은 시즌 정산 시 자동으로 적립됩니다.</li>
          <li>- 교환금으로 악세사리 제작을 신청할 수 있습니다.</li>
          <li>- 교환금 차감은 대표 승인 시 이루어집니다.</li>
        </ul>
      </div>
    </div>
  );
}

function DeliveryTracking() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">배송조회</h3>
      {exchangeData.length > 0 ? (
        <div className="space-y-3">
          {exchangeData.map((item) => (
            <div key={item.id} className="card p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{item.product}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{item.trackingNo}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-400 flex-shrink-0">
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
                <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
                <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
                <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-2">
                <span>주문</span>
                <span>준비</span>
                <span>배송중</span>
                <span>완료</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-6 text-center text-gray-400">
          배송 중인 상품이 없습니다.
        </div>
      )}
    </div>
  );
}

function DeliveryAddress() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-bold">배송지관리</h3>
        <button className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 whitespace-nowrap">
          + 추가
        </button>
      </div>
      <div className="space-y-3">
        {deliveryAddresses.map((addr) => (
          <div key={addr.id} className="card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-medium text-sm sm:text-base">{addr.name}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 text-[10px] sm:text-xs rounded bg-ruby-600/20 text-ruby-400">
                      기본
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-300">{addr.recipient} · {addr.phone}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 break-words">{addr.address}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="text-xs sm:text-sm text-gray-400 hover:text-white">수정</button>
                <button className="text-xs sm:text-sm text-gray-400 hover:text-red-400">삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Coupons() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold">할인쿠폰</h3>
      <p className="text-sm text-gray-400">보유 쿠폰 <span className="text-ruby-400 font-medium">{coupons.length}장</span></p>
      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="card p-4 sm:p-5 border-l-4 border-ruby-500">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base mb-1 truncate">{coupon.name}</p>
                <p className="text-xl sm:text-2xl font-bold text-ruby-400">{coupon.discount}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  {coupon.minOrder.toLocaleString()}원 이상
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">유효기간</p>
                <p className="text-xs sm:text-sm font-medium">~{coupon.expiry}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        const result = await getUserDetail(email);
        if (result.success) {
          setUserInfo(result.data);
          setFormData({
            name: result.data.name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
          });
        }
      }
    };
    loadUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adultVerified');
    navigate('/');
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm('정말 회원탈퇴를 하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.');
    if (!confirmed) return;

    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    const result = await deleteUser(email);
    if (result.success) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('adultVerified');
      alert('회원탈퇴가 완료되었습니다.');
      navigate('/');
    } else {
      alert(result.error || '회원탈퇴에 실패했습니다.');
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('모든 필드를 입력해주세요.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 4) {
      setPasswordError('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      setPasswordError('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    const result = await changePassword(email, passwordData.currentPassword, passwordData.newPassword);
    if (result.success) {
      alert('비밀번호가 변경되었습니다.');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordError(result.error || '비밀번호 변경에 실패했습니다.');
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('로그인 정보를 찾을 수 없습니다.');
      return;
    }

    const result = await updateUser(email, {
      name: formData.name,
      phone: formData.phone,
    });

    if (result.success) {
      localStorage.setItem('userName', formData.name);
      alert('개인정보가 수정되었습니다.');
      setIsEditing(false);
    } else {
      alert(result.error || '개인정보 수정에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold">개인정보확인/수정</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary text-sm py-2 px-4"
        >
          {isEditing ? '취소' : '수정하기'}
        </button>
      </div>
      <div className="card p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">이름</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
              />
            ) : (
              <p className="px-4 py-3 bg-dark-700 rounded-lg">{formData.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">이메일</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
              />
            ) : (
              <p className="px-4 py-3 bg-dark-700 rounded-lg">{formData.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">연락처</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
              />
            ) : (
              <p className="px-4 py-3 bg-dark-700 rounded-lg">{formData.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">가입일</label>
            <p className="px-4 py-3 bg-dark-700 rounded-lg text-gray-400">
              {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
          {isEditing && (
            <button onClick={handleSaveProfile} className="btn-primary w-full py-3 mt-4">
              변경사항 저장
            </button>
          )}
        </div>
      </div>
      <div className="card p-4 sm:p-6 border-red-900/30">
        <h4 className="font-medium text-red-400 mb-3">계정 관리</h4>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowPasswordModal(true)} className="text-sm text-gray-400 hover:text-white">비밀번호 변경</button>
          <span className="text-dark-600">|</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">로그아웃</button>
          <span className="text-dark-600">|</span>
          <button onClick={handleWithdraw} className="text-sm text-red-400 hover:text-red-300">회원탈퇴</button>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">비밀번호 변경</h3>
            {passwordError && (
              <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg text-sm text-red-400">
                {passwordError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">현재 비밀번호</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
                  placeholder="현재 비밀번호 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">새 비밀번호</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
                  placeholder="새 비밀번호 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
                  placeholder="새 비밀번호 다시 입력"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-500 rounded-lg transition-colors"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyPage() {
  const [activeMenu, setActiveMenu] = useState('participation');
  const [activeSubMenu, setActiveSubMenu] = useState('participation-history');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // localStorage에서 로그인 상태 및 사용자 정보 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loggedInUserName = localStorage.getItem('userName') || userData.name;
  const loggedInUserEmail = localStorage.getItem('userEmail') || userData.email;

  if (!isLoggedIn) {
    return (
      <div className="py-12 sm:py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link to="/login" className="btn-primary inline-block">로그인하기</Link>
        </div>
      </div>
    );
  }

  const handleNavigate = (subMenuId) => {
    // 해당 서브메뉴의 상위 메뉴 찾기
    const parentMenu = menuItems.find(item =>
      item.subItems.some(sub => sub.id === subMenuId)
    );
    if (parentMenu) {
      setActiveMenu(parentMenu.id);
      setActiveSubMenu(subMenuId);
    }
  };

  const renderContent = () => {
    switch (activeSubMenu) {
      case 'participation-history':
        return <ParticipationHistory />;
      case 'payment-history':
        return <PaymentHistory />;
      case 'balance-overview':
        return <BalanceOverview />;
      case 'exchange-apply':
        return <ExchangeApply onNavigate={handleNavigate} />;
      case 'exchange-history':
        return <ExchangeHistory />;
      case 'delivery-tracking':
        return <DeliveryTracking />;
      case 'delivery-address':
        return <DeliveryAddress />;
      case 'coupons':
        return <Coupons />;
      case 'profile':
        return <Profile />;
      default:
        return <ParticipationHistory />;
    }
  };

  const currentMenu = menuItems.find(item => item.id === activeMenu);

  return (
    <div className="py-6 sm:py-12 lg:py-20 relative overflow-hidden min-h-screen">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-ruby-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-ruby-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            마이<span className="text-ruby-500">페이지</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            안녕하세요, <span className="text-white font-medium">{loggedInUserName}</span>님
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {currentMenu?.icon}
                <span className="font-medium">{currentMenu?.name}</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            <div className={`overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px] mt-2' : 'max-h-0'}`}>
              <div className="card p-2 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        setActiveMenu(item.id);
                        setActiveSubMenu(item.subItems[0].id);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeMenu === item.id
                          ? 'bg-ruby-600/20 text-ruby-400'
                          : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </button>
                    {activeMenu === item.id && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActiveSubMenu(sub.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              activeSubMenu === sub.id
                                ? 'text-ruby-400 bg-ruby-600/10'
                                : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        setActiveMenu(item.id);
                        setActiveSubMenu(item.subItems[0].id);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeMenu === item.id
                          ? 'bg-ruby-600/20 text-ruby-400'
                          : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium text-sm">{item.name}</span>
                    </button>
                    {activeMenu === item.id && (
                      <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-dark-600 pl-4">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setActiveSubMenu(sub.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeSubMenu === sub.id
                                ? 'text-ruby-400 bg-ruby-600/10'
                                : 'text-gray-500 hover:text-white hover:bg-dark-700/50'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
