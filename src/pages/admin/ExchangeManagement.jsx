import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ExchangeStatusBadge from '../../components/exchange/ExchangeStatusBadge';
import { EXCHANGE_CATEGORIES, EXCHANGE_STATUS, DEFAULT_CONSULTATION_MODAL_CONTENT } from '../../constants/exchangeConstants';
import { getApplications, getConsultationModalContent, saveConsultationModalContent, resetConsultationModalContent, getAdminAuth } from '../../api/exchangeApi';
import { formatAmount, getRelativeTime } from '../../utils/localStorage';

export default function ExchangeManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
  });

  // 탭 관리
  const [activeTab, setActiveTab] = useState('list');
  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';

  // 모달 관리 상태
  const [modalContent, setModalContent] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 데이터 로드
  const loadApplications = async () => {
    setLoading(true);
    const result = await getApplications(filters);
    if (result.success) {
      setApplications(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
    // 모달 콘텐츠 로드
    const content = getConsultationModalContent();
    setModalContent(content);
  }, [filters]);

  // 모달 콘텐츠 변경 핸들러
  const handleModalChange = (field, value) => {
    setModalContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModalItemChange = (index, field, value) => {
    setModalContent((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddModalItem = () => {
    const newItem = {
      id: Date.now(),
      icon: '📌',
      title: '새 항목',
      description: '설명을 입력하세요.',
    };
    setModalContent((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveModalItem = (index) => {
    if (modalContent.items.length <= 1) {
      alert('최소 1개 이상의 항목이 필요합니다.');
      return;
    }
    setModalContent((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveModalItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= modalContent.items.length) return;

    const newItems = [...modalContent.items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setModalContent((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSaveModal = async () => {
    setModalSaving(true);
    const result = await saveConsultationModalContent(modalContent);
    if (result.success) {
      alert('모달 설정이 저장되었습니다.');
    } else {
      alert(result.error || '저장 중 오류가 발생했습니다.');
    }
    setModalSaving(false);
  };

  const handleResetModal = async () => {
    if (!window.confirm('기본값으로 초기화하시겠습니까?')) return;
    const result = await resetConsultationModalContent();
    if (result.success) {
      setModalContent(DEFAULT_CONSULTATION_MODAL_CONTENT);
      alert('기본값으로 초기화되었습니다.');
    }
  };

  // 필터 변경
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // URL 파라미터 업데이트
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  // 상세 페이지로 이동
  const handleViewDetail = (applicationId) => {
    navigate(`/admin/exchange/${applicationId}`);
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setFilters({ status: '', category: '', search: '' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.status || filters.category || filters.search;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">교환 관리</h1>
          <p className="text-gray-400 text-sm mt-1">
            {activeTab === 'list' ? `전체 ${applications.length}건` : '상담 접수 모달 설정'}
          </p>
        </div>
        {activeTab === 'list' && (
          <div className="flex items-center gap-2">
            {/* 모바일 필터 토글 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                hasActiveFilters
                  ? 'bg-ruby-600/20 text-ruby-400'
                  : 'bg-dark-700 text-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {hasActiveFilters && <span className="w-2 h-2 bg-ruby-500 rounded-full"></span>}
            </button>
            <button
              onClick={loadApplications}
              className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">새로고침</span>
            </button>
          </div>
        )}
      </div>

      {/* 탭 메뉴 */}
      {isCeo && (
        <div className="flex gap-2 border-b border-dark-600 pb-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-dark-700 text-ruby-400 border-b-2 border-ruby-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            신청 목록
          </button>
          <button
            onClick={() => setActiveTab('modal')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'modal'
                ? 'bg-dark-700 text-ruby-400 border-b-2 border-ruby-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            모달 설정
          </button>
        </div>
      )}

      {/* 신청 목록 탭 */}
      {activeTab === 'list' && (
        <>
          {/* 필터 - 모바일에서는 토글 */}
          <div className={`bg-dark-800 border border-dark-600 rounded-xl overflow-hidden transition-all duration-300 ${
            showFilters ? 'block' : 'hidden sm:block'
          }`}>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 상태 필터 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">상태</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                  text-white focus:outline-none focus:border-ruby-500"
              >
                <option value="">전체</option>
                {Object.values(EXCHANGE_STATUS).map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">카테고리</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                  text-white focus:outline-none focus:border-ruby-500"
              >
                <option value="">전체</option>
                {Object.values(EXCHANGE_CATEGORIES).map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 검색 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">검색</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="신청번호, 고객명, 이메일"
                className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg
                  text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
              />
            </div>

            {/* 초기화 버튼 */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2.5 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
              >
                필터 초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">해당하는 신청이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 레이아웃 */}
          <div className="sm:hidden space-y-3">
            {applications.map((app) => {
              const category = EXCHANGE_CATEGORIES[app.category];
              return (
                <div
                  key={app.id}
                  onClick={() => handleViewDetail(app.id)}
                  className="bg-dark-800 border border-dark-600 rounded-xl p-4 active:bg-dark-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-mono text-sm truncate">{app.id}</p>
                      <p className="text-gray-400 text-sm mt-1">{app.userName}</p>
                    </div>
                    <ExchangeStatusBadge status={app.status} size="small" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {category?.icon} {category?.label}
                    </span>
                    <span className="text-ruby-400 font-medium">
                      {formatAmount(app.requestedAmount)}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dark-600 flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{getRelativeTime(app.createdAt)}</span>
                    <span className="text-ruby-400 text-sm">상세 보기 →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PC 테이블 레이아웃 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">신청번호</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">고객</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">카테고리</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">신청금액</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">신청일</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {applications.map((app) => {
                    const category = EXCHANGE_CATEGORIES[app.category];
                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-dark-700/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetail(app.id)}
                      >
                        <td className="px-4 py-4">
                          <span className="text-white font-mono text-sm">{app.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-white text-sm">{app.userName}</p>
                            <p className="text-gray-500 text-xs">{app.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-gray-300 text-sm">
                            {category?.icon} {category?.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-ruby-400 font-medium">
                            {formatAmount(app.requestedAmount)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <ExchangeStatusBadge status={app.status} size="small" />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-gray-400 text-sm">
                            {getRelativeTime(app.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(app.id);
                            }}
                            className="px-3 py-1 bg-ruby-600/20 hover:bg-ruby-600/30 text-ruby-400 text-sm rounded transition-colors"
                          >
                            상세
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
        </>
      )}

      {/* 모달 설정 탭 */}
      {activeTab === 'modal' && modalContent && (
        <div className="space-y-6">
          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPreviewOpen(true)}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors"
            >
              미리보기
            </button>
            <button
              onClick={handleResetModal}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
            >
              초기화
            </button>
            <button
              onClick={handleSaveModal}
              disabled={modalSaving}
              className="px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {modalSaving ? '저장 중...' : '저장'}
            </button>
          </div>

          {/* 기본 설정 */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
            <h2 className="text-lg font-semibold text-white mb-4">기본 설정</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">모달 제목</label>
                <input
                  type="text"
                  value={modalContent.title}
                  onChange={(e) => handleModalChange('title', e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">부제목</label>
                <input
                  type="text"
                  value={modalContent.subtitle}
                  onChange={(e) => handleModalChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">확인 버튼 텍스트</label>
                <input
                  type="text"
                  value={modalContent.confirmButtonText}
                  onChange={(e) => handleModalChange('confirmButtonText', e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">취소 버튼 텍스트</label>
                <input
                  type="text"
                  value={modalContent.cancelButtonText}
                  onChange={(e) => handleModalChange('cancelButtonText', e.target.value)}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 안내 항목 */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">안내 항목</h2>
              <button
                onClick={handleAddModalItem}
                className="px-3 py-1.5 bg-ruby-600 hover:bg-ruby-700 text-white text-sm rounded-lg transition-colors"
              >
                + 항목 추가
              </button>
            </div>

            <div className="space-y-4">
              {modalContent.items.map((item, index) => (
                <div key={item.id || index} className="bg-dark-700/50 rounded-xl p-4 border border-dark-600">
                  <div className="flex items-start gap-4">
                    {/* 순서 조절 */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveModalItem(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveModalItem(index, 1)}
                        disabled={index === modalContent.items.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* 항목 내용 */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-400 mb-1">아이콘</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => handleModalItemChange(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white text-center text-xl focus:border-ruby-500 focus:outline-none"
                          maxLength={2}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-gray-400 mb-1">제목</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleModalItemChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-6">
                        <label className="block text-xs font-medium text-gray-400 mb-1">설명</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleModalItemChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemoveModalItem(index)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 미리보기 모달 */}
      {previewOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewOpen(false)} />
          <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
            <div className="bg-gradient-to-r from-ruby-600 to-ruby-700 px-6 py-5">
              <h2 className="text-xl font-bold text-white">{modalContent.title}</h2>
              {modalContent.subtitle && (
                <p className="text-ruby-200 text-sm mt-1">{modalContent.subtitle}</p>
              )}
            </div>
            <div className="px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {modalContent.items.map((item, index) => (
                <div key={item.id || index} className="flex gap-4 p-4 bg-dark-700/50 rounded-xl border border-dark-600">
                  <div className="flex-shrink-0 w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-dark-900/50 border-t border-dark-600 flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 py-3 px-4 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-colors"
                onClick={() => setPreviewOpen(false)}
              >
                {modalContent.cancelButtonText || '취소'}
              </button>
              <button
                className="flex-1 py-3 px-4 bg-ruby-600 hover:bg-ruby-700 text-white font-semibold rounded-lg transition-colors"
                onClick={() => setPreviewOpen(false)}
              >
                {modalContent.confirmButtonText || '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
