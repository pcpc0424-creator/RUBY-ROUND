// 테스트 데이터 시드 스크립트
// 브라우저 콘솔에서 실행하세요

(function() {
  const STORAGE_KEYS = {
    SEASONS: 'rubyround_seasons',
    ROUNDS: 'rubyround_rounds',
    ROUND_PAYMENTS: 'rubyround_round_payments',
  };

  // 테스트 시즌 데이터
  const testSeasons = [
    {
      id: 'SEASON-20260204-TEST1',
      name: 'Season 1',
      title: '루비의 시작',
      description: '첫 번째 시즌입니다.',
      startDate: '2026-02-04',
      endDate: '2026-02-28',
      status: 'active',
      isSettled: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'SEASON-20260204-TEST2',
      name: 'Season 2',
      title: '보석의 여정',
      description: '두 번째 시즌입니다.',
      startDate: '2026-02-04',
      endDate: '2026-03-15',
      status: 'upcoming',
      isSettled: false,
      createdAt: new Date().toISOString(),
    },
  ];

  // 테스트 라운드 데이터
  const testRounds = [
    {
      id: 'R1',
      number: 'Round 1',
      title: '체험 라운드',
      price: 0,
      status: 'completed',
      seasonId: 'SEASON-20260204-TEST1',
      description: '무료 체험 라운드',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'R2',
      number: 'Round 2',
      title: '탐사 라운드',
      price: 500000,
      status: 'completed',
      seasonId: 'SEASON-20260204-TEST1',
      description: '보석 탐사의 첫 단계',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'R3',
      number: 'Round 3',
      title: '발굴 라운드',
      price: 1000000,
      status: 'active',
      seasonId: 'SEASON-20260204-TEST1',
      description: '본격적인 보석 발굴',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'R4',
      number: 'Round 4',
      title: 'Deep Cargo',
      price: 1800000,
      status: 'upcoming',
      seasonId: 'SEASON-20260204-TEST1',
      description: '더 깊은 화물 레이어',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'R5',
      number: 'Round 5',
      title: 'Core Mining',
      price: 2500000,
      status: 'upcoming',
      seasonId: 'SEASON-20260204-TEST1',
      description: '핵심 채굴 구역',
      createdAt: new Date().toISOString(),
    },
  ];

  // 테스트 결제 데이터
  const testPayments = [
    {
      id: 'PAY-001',
      userEmail: 'test@example.com',
      userName: '테스트 사용자',
      seasonId: 'SEASON-20260204-TEST1',
      roundId: 'R1',
      roundTitle: '체험 라운드',
      amount: 0,
      status: 'success',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'PAY-002',
      userEmail: 'test@example.com',
      userName: '테스트 사용자',
      seasonId: 'SEASON-20260204-TEST1',
      roundId: 'R2',
      roundTitle: '탐사 라운드',
      amount: 500000,
      status: 'success',
      createdAt: new Date().toISOString(),
    },
  ];

  // 데이터 저장
  localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(testSeasons));
  localStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(testRounds));
  localStorage.setItem(STORAGE_KEYS.ROUND_PAYMENTS, JSON.stringify(testPayments));

  console.log('✅ 테스트 데이터가 생성되었습니다!');
  console.log('시즌:', testSeasons.length + '개');
  console.log('라운드:', testRounds.length + '개');
  console.log('결제:', testPayments.length + '개');
  console.log('\n어드민 페이지에서 확인하세요:');
  console.log('- 시즌 관리: /admin/seasons');
  console.log('- 시즌 상세: /admin/seasons/SEASON-20260204-TEST1');

  // 페이지 새로고침 안내
  alert('테스트 데이터가 생성되었습니다. 페이지를 새로고침하세요.');
})();
