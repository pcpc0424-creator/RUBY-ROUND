import { useState, useEffect } from 'react';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  issueCouponToUser,
  getCouponUsages,
  getAdminAuth,
  createAuditLog,
} from '../../api/exchangeApi';
import { COUPON_STATUS, COUPON_TYPE } from '../../constants/exchangeConstants';
import { formatAmount } from '../../utils/localStorage';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponUsages, setCouponUsages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'detail' | 'create' | 'edit' | 'issue' | 'usages'
  const [newCoupon, setNewCoupon] = useState({
    name: '',
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    totalQuantity: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [issueData, setIssueData] = useState({ userEmail: '' });
  const auth = getAdminAuth();

  useEffect(() => {
    loadCoupons();
  }, [filters]);

  const loadCoupons = async () => {
    setLoading(true);
    const result = await getCoupons(filters);
    if (result.success) {
      setCoupons(result.data);
    }
    setLoading(false);
  };

  const handleViewDetail = async (coupon) => {
    setSelectedCoupon(coupon);
    setModalType('detail');
    setShowModal(true);
  };

  const handleViewUsages = async (coupon) => {
    setSelectedCoupon(coupon);
    const result = await getCouponUsages(coupon.id);
    if (result.success) {
      setCouponUsages(result.data);
    }
    setModalType('usages');
    setShowModal(true);
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.name || !newCoupon.code || !newCoupon.value) {
      alert('필수 항목을 입력해주세요.');
      return;
    }

    const result = await createCoupon(
      {
        ...newCoupon,
        value: parseInt(newCoupon.value),
        minPurchase: newCoupon.minPurchase ? parseInt(newCoupon.minPurchase) : 0,
        maxDiscount: newCoupon.maxDiscount ? parseInt(newCoupon.maxDiscount) : null,
        totalQuantity: newCoupon.totalQuantity ? parseInt(newCoupon.totalQuantity) : null,
      },
      auth?.name || 'Admin'
    );

    if (result.success) {
      await createAuditLog({
        action: 'create',
        targetType: 'coupon',
        targetId: result.data.id,
        details: `쿠폰 생성: ${newCoupon.name} (${newCoupon.code})`,
        adminName: auth?.name || 'Admin',
      });
      alert('쿠폰이 생성되었습니다.');
      closeModal();
      loadCoupons();
    } else {
      alert(result.error || '쿠폰 생성에 실패했습니다.');
    }
  };

  const handleUpdateCoupon = async () => {
    const result = await updateCoupon(selectedCoupon.id, newCoupon, auth?.name || 'Admin');

    if (result.success) {
      await createAuditLog({
        action: 'update',
        targetType: 'coupon',
        targetId: selectedCoupon.id,
        details: `쿠폰 수정: ${newCoupon.name}`,
        adminName: auth?.name || 'Admin',
      });
      alert('쿠폰이 수정되었습니다.');
      closeModal();
      loadCoupons();
    } else {
      alert(result.error || '쿠폰 수정에 실패했습니다.');
    }
  };

  const handleIssueCoupon = async () => {
    if (!issueData.userEmail) {
      alert('사용자 이메일을 입력해주세요.');
      return;
    }

    const result = await issueCouponToUser(
      selectedCoupon.id,
      issueData.userEmail,
      auth?.name || 'Admin'
    );

    if (result.success) {
      await createAuditLog({
        action: 'issue',
        targetType: 'coupon',
        targetId: selectedCoupon.id,
        details: `쿠폰 발급: ${issueData.userEmail}에게 ${selectedCoupon.name}`,
        adminName: auth?.name || 'Admin',
      });
      alert('쿠폰이 발급되었습니다.');
      setIssueData({ userEmail: '' });
      setModalType('detail');
    } else {
      alert(result.error || '쿠폰 발급에 실패했습니다.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCoupon(null);
    setCouponUsages([]);
    setModalType('');
    setNewCoupon({
      name: '',
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      maxDiscount: '',
      totalQuantity: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIssueData({ userEmail: '' });
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setNewCoupon({
      name: coupon.name,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      totalQuantity: coupon.totalQuantity?.toString() || '',
      startDate: coupon.startDate || '',
      endDate: coupon.endDate || '',
      description: coupon.description || '',
    });
    setModalType('edit');
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusInfo = COUPON_STATUS[status] || { label: status, color: 'gray' };
    const colorMap = {
      green: 'bg-green-500/20 text-green-400',
      gray: 'bg-gray-500/20 text-gray-400',
      red: 'bg-red-500/20 text-red-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorMap[statusInfo.color] || colorMap.gray}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeInfo = COUPON_TYPE[type] || { label: type };
    const colorMap = {
      percentage: 'bg-purple-500/20 text-purple-400',
      fixed: 'bg-blue-500/20 text-blue-400',
      free_shipping: 'bg-green-500/20 text-green-400',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colorMap[type] || 'bg-gray-500/20 text-gray-400'}`}>
        {typeInfo.label}
      </span>
    );
  };

  const formatCouponValue = (coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    } else if (coupon.type === 'fixed') {
      return formatAmount(coupon.value);
    } else {
      return '무료배송';
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon({ ...newCoupon, code });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">쿠폰/프로모션</h1>
          <p className="text-gray-400 text-sm mt-1">전체 {coupons.length}건</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setModalType('create');
              setShowModal(true);
            }}
            className="px-3 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">쿠폰 생성</span>
          </button>
          <button
            onClick={loadCoupons}
            className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">검색</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="쿠폰명, 코드"
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">상태</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {Object.entries(COUPON_STATUS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">유형</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-ruby-500"
            >
              <option value="">전체</option>
              {Object.entries(COUPON_TYPE).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', type: '', search: '' })}
              className="w-full px-4 py-2.5 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-8 sm:p-12 text-center">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <p className="text-gray-400">등록된 쿠폰이 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 모바일 카드 */}
          <div className="sm:hidden space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() => handleViewDetail(coupon)}
                className="bg-dark-800 border border-dark-600 rounded-xl p-4 active:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">{coupon.name}</p>
                    <p className="text-ruby-400 font-bold">{formatCouponValue(coupon)}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {getStatusBadge(coupon.status)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-mono">{coupon.code}</span>
                  <span className="text-gray-500">
                    {coupon.usedCount || 0}/{coupon.totalQuantity || '∞'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PC 테이블 */}
          <div className="hidden sm:block bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">쿠폰명</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">코드</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">유형</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">할인</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">상태</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400">사용/수량</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">유효기간</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-dark-700/50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-white font-medium">{coupon.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-300 font-mono text-sm">{coupon.code}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getTypeBadge(coupon.type)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-ruby-400 font-medium">{formatCouponValue(coupon)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(coupon.status)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-300">
                          {coupon.usedCount || 0}/{coupon.totalQuantity || '∞'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-400 text-sm">
                          {coupon.endDate
                            ? new Date(coupon.endDate).toLocaleDateString('ko-KR')
                            : '무제한'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleViewDetail(coupon)}
                            className="px-2 py-1 bg-ruby-600/20 hover:bg-ruby-600/30 text-ruby-400 text-sm rounded transition-colors"
                          >
                            상세
                          </button>
                          <button
                            onClick={() => handleViewUsages(coupon)}
                            className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded transition-colors"
                          >
                            이력
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="bg-dark-700 px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg font-bold text-white">
                {modalType === 'detail' && '쿠폰 상세'}
                {modalType === 'create' && '쿠폰 생성'}
                {modalType === 'edit' && '쿠폰 수정'}
                {modalType === 'issue' && '쿠폰 발급'}
                {modalType === 'usages' && '사용 이력'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {/* 쿠폰 상세 */}
              {modalType === 'detail' && selectedCoupon && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">쿠폰명</span>
                      <span className="text-white font-medium">{selectedCoupon.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">코드</span>
                      <span className="text-white font-mono">{selectedCoupon.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">유형</span>
                      {getTypeBadge(selectedCoupon.type)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">할인</span>
                      <span className="text-ruby-400 font-bold">{formatCouponValue(selectedCoupon)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">상태</span>
                      {getStatusBadge(selectedCoupon.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">최소 구매금액</span>
                      <span className="text-white">
                        {selectedCoupon.minPurchase ? formatAmount(selectedCoupon.minPurchase) : '없음'}
                      </span>
                    </div>
                    {selectedCoupon.maxDiscount && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">최대 할인</span>
                        <span className="text-white">{formatAmount(selectedCoupon.maxDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">사용/수량</span>
                      <span className="text-white">
                        {selectedCoupon.usedCount || 0}/{selectedCoupon.totalQuantity || '무제한'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">유효기간</span>
                      <span className="text-white">
                        {selectedCoupon.startDate && selectedCoupon.endDate
                          ? `${new Date(selectedCoupon.startDate).toLocaleDateString('ko-KR')} ~ ${new Date(selectedCoupon.endDate).toLocaleDateString('ko-KR')}`
                          : '무제한'}
                      </span>
                    </div>
                  </div>

                  {selectedCoupon.description && (
                    <div className="bg-dark-700/50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">설명</h3>
                      <p className="text-white text-sm">{selectedCoupon.description}</p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(selectedCoupon)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setModalType('issue')}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                    >
                      사용자에게 발급
                    </button>
                  </div>
                </div>
              )}

              {/* 쿠폰 생성/수정 */}
              {(modalType === 'create' || modalType === 'edit') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">쿠폰명 *</label>
                    <input
                      type="text"
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">쿠폰 코드 *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                        className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white font-mono focus:border-ruby-500 focus:outline-none"
                      />
                      <button
                        onClick={generateCouponCode}
                        className="px-4 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                      >
                        자동생성
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">유형</label>
                      <select
                        value={newCoupon.type}
                        onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      >
                        {Object.entries(COUPON_TYPE).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {newCoupon.type === 'percentage' ? '할인율 (%)' : '할인금액'} *
                      </label>
                      <input
                        type="number"
                        value={newCoupon.value}
                        onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">최소 구매금액</label>
                      <input
                        type="number"
                        value={newCoupon.minPurchase}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                        placeholder="0"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">최대 할인금액</label>
                      <input
                        type="number"
                        value={newCoupon.maxDiscount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                        placeholder="무제한"
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">총 수량</label>
                    <input
                      type="number"
                      value={newCoupon.totalQuantity}
                      onChange={(e) => setNewCoupon({ ...newCoupon, totalQuantity: e.target.value })}
                      placeholder="무제한"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">시작일</label>
                      <input
                        type="date"
                        value={newCoupon.startDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">종료일</label>
                      <input
                        type="date"
                        value={newCoupon.endDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
                    <textarea
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={closeModal}
                      className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={modalType === 'create' ? handleCreateCoupon : handleUpdateCoupon}
                      className="flex-1 py-3 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors"
                    >
                      {modalType === 'create' ? '생성하기' : '수정하기'}
                    </button>
                  </div>
                </div>
              )}

              {/* 쿠폰 발급 */}
              {modalType === 'issue' && selectedCoupon && (
                <div className="space-y-4">
                  <div className="bg-dark-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400">발급할 쿠폰</p>
                    <p className="text-lg font-bold text-white">{selectedCoupon.name}</p>
                    <p className="text-ruby-400">{formatCouponValue(selectedCoupon)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">사용자 이메일 *</label>
                    <input
                      type="email"
                      value={issueData.userEmail}
                      onChange={(e) => setIssueData({ ...issueData, userEmail: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setModalType('detail')}
                      className="flex-1 py-3 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleIssueCoupon}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      발급하기
                    </button>
                  </div>
                </div>
              )}

              {/* 사용 이력 */}
              {modalType === 'usages' && selectedCoupon && (
                <div className="space-y-4">
                  <div className="bg-dark-700/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400">쿠폰</p>
                    <p className="text-lg font-bold text-white">{selectedCoupon.name}</p>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {couponUsages.length > 0 ? (
                      couponUsages.map((usage, idx) => (
                        <div key={idx} className="bg-dark-700/50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-white font-medium">{usage.userEmail}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              usage.status === 'used'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {usage.status === 'used' ? '사용됨' : '미사용'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            <p>발급일: {new Date(usage.issuedAt).toLocaleString('ko-KR')}</p>
                            {usage.usedAt && (
                              <p>사용일: {new Date(usage.usedAt).toLocaleString('ko-KR')}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">사용 이력이 없습니다.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
