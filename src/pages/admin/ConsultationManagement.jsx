import { useState } from 'react';

// 채널 옵션
const CHANNELS = [
  { value: 'kakao', label: '카카오톡', color: 'bg-yellow-500' },
  { value: 'instagram', label: '인스타그램', color: 'bg-pink-500' },
  { value: 'facebook', label: '페이스북', color: 'bg-blue-600' },
  { value: 'tiktok', label: '틱톡', color: 'bg-gray-800' },
];

// 상태 옵션
const STATUSES = [
  { value: 'new', label: '신규', color: 'bg-blue-500' },
  { value: 'in_progress', label: '진행', color: 'bg-yellow-500' },
  { value: 'completed', label: '완료', color: 'bg-green-500' },
];

// 임시 목 데이터 - 고객 목록
const mockCustomers = [
  {
    id: 1,
    name: '김민수',
    nickname: '민수님',
    contact: '010-1234-5678',
    memberId: 'user_001',
    memberName: '김민수',
    latestChannel: 'kakao',
    latestStatus: 'in_progress',
    latestDate: '2025-01-20 14:30',
    staffName: '관리자1',
    consultations: [
      { id: 1, date: '2025-01-20 14:30', channel: 'kakao', status: 'in_progress', memo: '배송 지연 관련 문의. 1/22 도착 예정 안내 완료.', staff: '관리자1' },
      { id: 2, date: '2025-01-19 10:15', channel: 'kakao', status: 'completed', memo: '교환 신청 방법 안내. 마이페이지에서 진행 가능하다고 안내.', staff: '관리자2' },
      { id: 3, date: '2025-01-18 16:45', channel: 'instagram', status: 'completed', memo: '시즌2 참여 방법 문의. 홈페이지 안내 완료.', staff: '관리자1' },
    ]
  },
  {
    id: 2,
    name: '이영희',
    nickname: null,
    contact: '010-9876-5432',
    memberId: null,
    memberName: null,
    latestChannel: 'instagram',
    latestStatus: 'new',
    latestDate: '2025-01-20 11:20',
    staffName: '관리자2',
    consultations: [
      { id: 1, date: '2025-01-20 11:20', channel: 'instagram', status: 'new', memo: '루비 진품 여부 문의. 감정서 안내 예정.', staff: '관리자2' },
    ]
  },
  {
    id: 3,
    name: '박지훈',
    nickname: '지훈이',
    contact: '010-5555-1234',
    memberId: 'user_015',
    memberName: '박지훈',
    latestChannel: 'facebook',
    latestStatus: 'completed',
    latestDate: '2025-01-19 09:00',
    staffName: '관리자1',
    consultations: [
      { id: 1, date: '2025-01-19 09:00', channel: 'facebook', status: 'completed', memo: '결제 오류 문의. 카드사 문제로 확인됨. 재결제 안내 완료.', staff: '관리자1' },
      { id: 2, date: '2025-01-17 14:20', channel: 'tiktok', status: 'completed', memo: '이벤트 참여 방법 문의. DM으로 상세 안내 완료.', staff: '관리자2' },
    ]
  },
  {
    id: 4,
    name: '최수진',
    nickname: '수진맘',
    contact: null,
    memberId: null,
    memberName: null,
    latestChannel: 'tiktok',
    latestStatus: 'in_progress',
    latestDate: '2025-01-20 16:00',
    staffName: '관리자1',
    consultations: [
      { id: 1, date: '2025-01-20 16:00', channel: 'tiktok', status: 'in_progress', memo: '환불 요청. 환불 정책 안내 후 처리 대기 중.', staff: '관리자1' },
    ]
  },
];

// 회원 검색용 목 데이터
const mockMembers = [
  { id: 'user_001', name: '김민수', phone: '010-1234-5678' },
  { id: 'user_002', name: '홍길동', phone: '010-1111-2222' },
  { id: 'user_015', name: '박지훈', phone: '010-5555-1234' },
  { id: 'user_020', name: '정다은', phone: '010-7777-8888' },
];

export default function ConsultationManagement() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showMemberSearchModal, setShowMemberSearchModal] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // 새 상담 메모 폼
  const [newMemo, setNewMemo] = useState({
    channel: 'kakao',
    status: 'new',
    memo: ''
  });

  // 새 고객 폼
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    nickname: '',
    contact: ''
  });

  // 검색 필터링
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(term) ||
      customer.nickname?.toLowerCase().includes(term) ||
      customer.contact?.includes(term)
    );
  });

  // 채널 라벨 가져오기
  const getChannelLabel = (value) => {
    return CHANNELS.find(c => c.value === value)?.label || value;
  };

  // 채널 색상 가져오기
  const getChannelColor = (value) => {
    return CHANNELS.find(c => c.value === value)?.color || 'bg-gray-500';
  };

  // 상태 라벨 가져오기
  const getStatusLabel = (value) => {
    return STATUSES.find(s => s.value === value)?.label || value;
  };

  // 상태 색상 가져오기
  const getStatusColor = (value) => {
    return STATUSES.find(s => s.value === value)?.color || 'bg-gray-500';
  };

  // 고객 상세 열기
  const openDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
    setNewMemo({ channel: 'kakao', status: 'new', memo: '' });
  };

  // 상담 메모 추가
  const addConsultation = () => {
    if (!newMemo.memo.trim()) {
      alert('메모 내용을 입력해주세요.');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');

    const newConsultation = {
      id: Date.now(),
      date: dateStr,
      channel: newMemo.channel,
      status: newMemo.status,
      memo: newMemo.memo,
      staff: '관리자1' // 실제로는 로그인한 관리자
    };

    const updatedCustomer = {
      ...selectedCustomer,
      latestChannel: newMemo.channel,
      latestStatus: newMemo.status,
      latestDate: dateStr,
      staffName: '관리자1',
      consultations: [newConsultation, ...selectedCustomer.consultations]
    };

    setSelectedCustomer(updatedCustomer);
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setNewMemo({ channel: 'kakao', status: 'new', memo: '' });
  };

  // 새 고객 추가
  const addNewCustomer = () => {
    if (!newCustomer.name.trim()) {
      alert('고객명을 입력해주세요.');
      return;
    }

    const customer = {
      id: Date.now(),
      name: newCustomer.name,
      nickname: newCustomer.nickname || null,
      contact: newCustomer.contact || null,
      memberId: null,
      memberName: null,
      latestChannel: null,
      latestStatus: null,
      latestDate: null,
      staffName: null,
      consultations: []
    };

    setCustomers([customer, ...customers]);
    setShowNewCustomerModal(false);
    setNewCustomer({ name: '', nickname: '', contact: '' });
    openDetail(customer);
  };

  // 회원 연계
  const linkMember = (member) => {
    const updatedCustomer = {
      ...selectedCustomer,
      memberId: member.id,
      memberName: member.name
    };
    setSelectedCustomer(updatedCustomer);
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setShowMemberSearchModal(false);
    setMemberSearchTerm('');
  };

  // 회원 연계 해제
  const unlinkMember = () => {
    const updatedCustomer = {
      ...selectedCustomer,
      memberId: null,
      memberName: null
    };
    setSelectedCustomer(updatedCustomer);
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  // 회원 검색 필터링
  const filteredMembers = mockMembers.filter(member => {
    if (!memberSearchTerm) return true;
    const term = memberSearchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.phone.includes(term) ||
      member.id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">상담 기록</h1>
          <p className="text-gray-400 mt-1">카카오톡/인스타그램/페이스북/틱톡 상담 내용을 기록하고 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="px-4 py-2 bg-ruby-600 text-white rounded-lg hover:bg-ruby-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 고객 등록
        </button>
      </div>

      {/* 검색 */}
      <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="고객명 또는 연락처로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="text-gray-400 text-sm">전체 고객</div>
          <div className="text-2xl font-bold text-white mt-1">{customers.length}</div>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="text-gray-400 text-sm">신규 상담</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {customers.filter(c => c.latestStatus === 'new').length}
          </div>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="text-gray-400 text-sm">진행 중</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {customers.filter(c => c.latestStatus === 'in_progress').length}
          </div>
        </div>
        <div className="bg-dark-800 rounded-xl p-4 border border-dark-700">
          <div className="text-gray-400 text-sm">완료</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {customers.filter(c => c.latestStatus === 'completed').length}
          </div>
        </div>
      </div>

      {/* 고객 리스트 */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-700/50 border-b border-dark-600">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">날짜/시간</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">고객</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">연락처</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">채널</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">상태</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">담당자</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">회원연계</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 상담 기록이 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => openDetail(customer)}
                    className="border-b border-dark-700 hover:bg-dark-700/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {customer.latestDate || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{customer.name}</div>
                      {customer.nickname && (
                        <div className="text-gray-500 text-xs">({customer.nickname})</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {customer.contact || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {customer.latestChannel ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getChannelColor(customer.latestChannel)}`}>
                          {getChannelLabel(customer.latestChannel)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {customer.latestStatus ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(customer.latestStatus)}`}>
                          {getStatusLabel(customer.latestStatus)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {customer.staffName || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {customer.memberId ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-ruby-600/20 text-ruby-400">
                          회원
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">비회원</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 고객 상세 모달 */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">고객 상담 상세</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* 고객 기본 정보 */}
              <div className="bg-dark-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">고객 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">고객명</div>
                    <div className="text-white font-medium">{selectedCustomer.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">닉네임</div>
                    <div className="text-white">{selectedCustomer.nickname || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">연락처</div>
                    <div className="text-white">{selectedCustomer.contact || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">회원 연계</div>
                    {selectedCustomer.memberId ? (
                      <div className="flex items-center gap-2">
                        <span className="text-ruby-400">{selectedCustomer.memberName} ({selectedCustomer.memberId})</span>
                        <button
                          onClick={unlinkMember}
                          className="text-xs text-gray-500 hover:text-red-400"
                        >
                          해제
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowMemberSearchModal(true)}
                        className="text-sm text-ruby-400 hover:text-ruby-300"
                      >
                        + 회원 연계
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 상담 메모 추가 폼 */}
              <div className="bg-dark-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">상담 메모 추가</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">채널</label>
                      <select
                        value={newMemo.channel}
                        onChange={(e) => setNewMemo({ ...newMemo, channel: e.target.value })}
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ruby-500"
                      >
                        {CHANNELS.map(ch => (
                          <option key={ch.value} value={ch.value}>{ch.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">상태</label>
                      <select
                        value={newMemo.status}
                        onChange={(e) => setNewMemo({ ...newMemo, status: e.target.value })}
                        className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ruby-500"
                      >
                        {STATUSES.map(st => (
                          <option key={st.value} value={st.value}>{st.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">메모 내용</label>
                    <textarea
                      value={newMemo.memo}
                      onChange={(e) => setNewMemo({ ...newMemo, memo: e.target.value })}
                      placeholder="상담 내용을 입력하세요..."
                      rows={3}
                      className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ruby-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={addConsultation}
                    className="w-full py-2 bg-ruby-600 text-white rounded-lg hover:bg-ruby-700 transition-colors text-sm font-medium"
                  >
                    저장
                  </button>
                </div>
              </div>

              {/* 상담 기록 타임라인 */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">상담 기록 ({selectedCustomer.consultations.length}건)</h3>
                {selectedCustomer.consultations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    아직 상담 기록이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCustomer.consultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="bg-dark-700/50 rounded-lg p-4 border-l-4"
                        style={{ borderLeftColor: getChannelColor(consultation.channel).replace('bg-', '#').replace('yellow-500', 'eab308').replace('pink-500', 'ec4899').replace('blue-600', '2563eb').replace('gray-800', '1f2937') }}
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">{consultation.date}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getChannelColor(consultation.channel)}`}>
                            {getChannelLabel(consultation.channel)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getStatusColor(consultation.status)}`}>
                            {getStatusLabel(consultation.status)}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">담당: {consultation.staff}</span>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{consultation.memo}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 새 고객 등록 모달 */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <h2 className="text-lg font-bold text-white">새 고객 등록</h2>
              <button
                onClick={() => setShowNewCustomerModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">고객명 *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="고객명 입력"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruby-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">닉네임</label>
                <input
                  type="text"
                  value={newCustomer.nickname}
                  onChange={(e) => setNewCustomer({ ...newCustomer, nickname: e.target.value })}
                  placeholder="닉네임 (선택)"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruby-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">연락처</label>
                <input
                  type="text"
                  value={newCustomer.contact}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                  placeholder="010-0000-0000 (선택)"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruby-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowNewCustomerModal(false)}
                  className="flex-1 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={addNewCustomer}
                  className="flex-1 py-2 bg-ruby-600 text-white rounded-lg hover:bg-ruby-700 transition-colors"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 회원 검색 모달 */}
      {showMemberSearchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-xl border border-dark-700 w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <h2 className="text-lg font-bold text-white">회원 검색</h2>
              <button
                onClick={() => {
                  setShowMemberSearchModal(false);
                  setMemberSearchTerm('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                placeholder="회원명, 연락처, 회원ID로 검색..."
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruby-500 mb-4"
              />
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => linkMember(member)}
                    className="w-full text-left p-3 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-sm text-gray-400">{member.phone} | {member.id}</div>
                  </button>
                ))}
                {filteredMembers.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
