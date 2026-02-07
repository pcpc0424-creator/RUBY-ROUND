import { useState, useEffect } from 'react';
import {
  getSystemSettings,
  saveSystemSettings,
  getAdminAuth,
  createAuditLog,
} from '../../api/exchangeApi';
import { ADMIN_ROLES, STORAGE_KEYS } from '../../constants/exchangeConstants';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    // 일반 설정
    siteName: 'Ruby Round',
    siteDescription: '실물 루비 보석 라이브 커머스',
    maintenanceMode: false,
    maintenanceMessage: '',
    // 결제 설정
    minPurchaseAmount: 10000,
    maxPurchaseAmount: 10000000,
    paymentMethods: ['card', 'bank'],
    // 라운드 설정
    defaultRoundDuration: 7,
    maxParticipantsPerRound: 1000,
    autoCloseRounds: true,
    // 교환금 설정
    minExchangeAmount: 10000,
    exchangeFeePercent: 0,
    // 알림 설정
    emailNotifications: true,
    smsNotifications: false,
    // RBAC 설정
    requireApprovalForExchange: true,
    requireApprovalForDelivery: true,
    approvalRoles: ['CEO'],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const auth = getAdminAuth();
  const isCeo = auth?.role === 'ceo';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const result = getSystemSettings();
    if (result.success && result.data) {
      setSettings((prev) => ({ ...prev, ...result.data }));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!isCeo) {
      alert('대표 계정만 시스템 설정을 변경할 수 있습니다.');
      return;
    }

    setSaving(true);
    const result = await saveSystemSettings(settings, auth?.name || 'Admin');
    if (result.success) {
      await createAuditLog({
        action: 'update',
        targetType: 'system',
        targetId: 'settings',
        details: '시스템 설정 변경',
        adminName: auth?.name || 'Admin',
      });
      alert('설정이 저장되었습니다.');
    } else {
      alert(result.error || '설정 저장에 실패했습니다.');
    }
    setSaving(false);
  };

  const tabs = [
    { key: 'general', label: '일반', icon: '⚙️' },
    { key: 'payment', label: '결제', icon: '💳' },
    { key: 'round', label: '라운드', icon: '🎯' },
    { key: 'exchange', label: '교환금', icon: '💰' },
    { key: 'notification', label: '알림', icon: '🔔' },
    { key: 'rbac', label: '권한/승인', icon: '🔐' },
    { key: 'data', label: '데이터 관리', icon: '🗑️' },
  ];

  // 데이터 초기화 관련 정의
  const dataCategories = [
    {
      key: 'users',
      label: '사용자 데이터',
      description: '사용자 계정, 잔액, 성인인증 정보',
      storageKeys: [STORAGE_KEYS.USERS, STORAGE_KEYS.USER_EXCHANGE_BALANCE, STORAGE_KEYS.ADULT_VERIFICATIONS, STORAGE_KEYS.VERIFICATION_EVIDENCE],
      danger: true
    },
    {
      key: 'exchanges',
      label: '교환 신청 데이터',
      description: '교환 신청 내역, 원장',
      storageKeys: [STORAGE_KEYS.EXCHANGE_APPLICATIONS, STORAGE_KEYS.EXCHANGE_LEDGER],
      danger: true
    },
    {
      key: 'seasons',
      label: '시즌/라운드 데이터',
      description: '시즌, 라운드, 결제, 정산 정보',
      storageKeys: [STORAGE_KEYS.SEASONS, STORAGE_KEYS.ROUNDS, STORAGE_KEYS.ROUND_PAYMENTS, STORAGE_KEYS.SEASON_SETTLEMENTS, STORAGE_KEYS.ROUND_RESULTS],
      danger: true
    },
    {
      key: 'rewards',
      label: '보상/쿠폰 데이터',
      description: '보상, 당첨, 쿠폰 정보',
      storageKeys: [STORAGE_KEYS.REWARDS, STORAGE_KEYS.COUPONS, STORAGE_KEYS.COUPON_USAGES],
      danger: false
    },
    {
      key: 'deliveries',
      label: '배송 데이터',
      description: '배송 정보',
      storageKeys: [STORAGE_KEYS.DELIVERIES],
      danger: false
    },
    {
      key: 'logs',
      label: '감사 로그',
      description: '관리자 작업 로그',
      storageKeys: [STORAGE_KEYS.AUDIT_LOGS],
      danger: false
    },
  ];

  const [deleting, setDeleting] = useState(null);

  const handleDeleteData = async (category) => {
    if (!isCeo) {
      alert('대표 계정만 데이터를 삭제할 수 있습니다.');
      return;
    }

    const confirmMessage = category.danger
      ? `⚠️ 경고: "${category.label}"을(를) 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다!`
      : `"${category.label}"을(를) 삭제하시겠습니까?`;

    if (!confirm(confirmMessage)) return;

    if (category.danger) {
      const doubleConfirm = prompt(`정말 삭제하려면 "${category.label}"을(를) 입력하세요:`);
      if (doubleConfirm !== category.label) {
        alert('입력이 일치하지 않습니다. 삭제가 취소되었습니다.');
        return;
      }
    }

    setDeleting(category.key);
    try {
      category.storageKeys.forEach(key => {
        if (key) localStorage.removeItem(key);
      });

      await createAuditLog({
        action: 'delete',
        targetType: 'data',
        targetId: category.key,
        details: `데이터 삭제: ${category.label}`,
        adminName: auth?.name || 'Admin',
      });

      alert(`${category.label}이(가) 삭제되었습니다.`);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
    setDeleting(null);
  };

  const handleDeleteAllData = async () => {
    if (!isCeo) {
      alert('대표 계정만 데이터를 삭제할 수 있습니다.');
      return;
    }

    if (!confirm('⚠️ 경고: 모든 데이터를 삭제하시겠습니까?\n\n관리자 계정을 제외한 모든 데이터가 삭제됩니다.\n이 작업은 되돌릴 수 없습니다!')) return;

    const confirmText = prompt('정말 모든 데이터를 삭제하려면 "전체 삭제"를 입력하세요:');
    if (confirmText !== '전체 삭제') {
      alert('입력이 일치하지 않습니다. 삭제가 취소되었습니다.');
      return;
    }

    setDeleting('all');
    try {
      // 관리자 인증 정보는 유지
      const adminAuth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);

      // 모든 rubyround_ 키 삭제
      Object.values(STORAGE_KEYS).forEach(key => {
        if (key && key !== STORAGE_KEYS.ADMIN_AUTH) {
          localStorage.removeItem(key);
        }
      });

      await createAuditLog({
        action: 'delete',
        targetType: 'data',
        targetId: 'all',
        details: '전체 데이터 삭제',
        adminName: auth?.name || 'Admin',
      });

      alert('모든 데이터가 삭제되었습니다. (관리자 계정 제외)');
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">시스템 설정</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isCeo ? '시스템 전체 설정을 관리합니다' : '설정 조회만 가능합니다 (대표 계정만 수정 가능)'}
          </p>
        </div>
        {isCeo && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-ruby-600 hover:bg-ruby-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            저장
          </button>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl">
        <div className="flex border-b border-dark-600 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-ruby-500 text-ruby-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* 일반 설정 */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">사이트 이름</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  disabled={!isCeo}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">사이트 설명</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  disabled={!isCeo}
                  rows={2}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50 resize-none"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">점검 모드</p>
                  <p className="text-gray-400 text-sm">활성화 시 사용자에게 점검 메시지가 표시됩니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    disabled={!isCeo}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
              {settings.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">점검 메시지</label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    disabled={!isCeo}
                    placeholder="서비스 점검 중입니다. 잠시 후 다시 이용해주세요."
                    rows={2}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50 resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* 결제 설정 */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">최소 결제 금액</label>
                  <input
                    type="number"
                    value={settings.minPurchaseAmount}
                    onChange={(e) => setSettings({ ...settings, minPurchaseAmount: parseInt(e.target.value) })}
                    disabled={!isCeo}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">최대 결제 금액</label>
                  <input
                    type="number"
                    value={settings.maxPurchaseAmount}
                    onChange={(e) => setSettings({ ...settings, maxPurchaseAmount: parseInt(e.target.value) })}
                    disabled={!isCeo}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">결제 수단</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'card', label: '카드' },
                    { key: 'bank', label: '계좌이체' },
                    { key: 'vbank', label: '가상계좌' },
                    { key: 'phone', label: '휴대폰' },
                  ].map((method) => (
                    <label key={method.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods?.includes(method.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings({
                              ...settings,
                              paymentMethods: [...(settings.paymentMethods || []), method.key],
                            });
                          } else {
                            setSettings({
                              ...settings,
                              paymentMethods: settings.paymentMethods?.filter((m) => m !== method.key),
                            });
                          }
                        }}
                        disabled={!isCeo}
                        className="w-4 h-4 text-ruby-600 bg-dark-700 border-dark-600 rounded focus:ring-ruby-500"
                      />
                      <span className="text-gray-300">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 라운드 설정 */}
          {activeTab === 'round' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">기본 라운드 기간 (일)</label>
                  <input
                    type="number"
                    value={settings.defaultRoundDuration}
                    onChange={(e) => setSettings({ ...settings, defaultRoundDuration: parseInt(e.target.value) })}
                    disabled={!isCeo}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">라운드당 최대 참여자</label>
                  <input
                    type="number"
                    value={settings.maxParticipantsPerRound}
                    onChange={(e) => setSettings({ ...settings, maxParticipantsPerRound: parseInt(e.target.value) })}
                    disabled={!isCeo}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">자동 라운드 종료</p>
                  <p className="text-gray-400 text-sm">기간 만료 시 자동으로 라운드를 종료합니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoCloseRounds}
                    onChange={(e) => setSettings({ ...settings, autoCloseRounds: e.target.checked })}
                    disabled={!isCeo}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>
          )}

          {/* 교환금 설정 */}
          {activeTab === 'exchange' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">최소 교환 신청 금액</label>
                  <input
                    type="number"
                    value={settings.minExchangeAmount}
                    onChange={(e) => setSettings({ ...settings, minExchangeAmount: parseInt(e.target.value) })}
                    disabled={!isCeo}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">교환 수수료 (%)</label>
                  <input
                    type="number"
                    value={settings.exchangeFeePercent}
                    onChange={(e) => setSettings({ ...settings, exchangeFeePercent: parseFloat(e.target.value) })}
                    disabled={!isCeo}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-ruby-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 알림 설정 */}
          {activeTab === 'notification' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">이메일 알림</p>
                  <p className="text-gray-400 text-sm">주요 이벤트 발생 시 이메일 알림을 전송합니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    disabled={!isCeo}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">SMS 알림</p>
                  <p className="text-gray-400 text-sm">주요 이벤트 발생 시 SMS 알림을 전송합니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                    disabled={!isCeo}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>
          )}

          {/* 권한/승인 설정 */}
          {activeTab === 'rbac' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">교환 신청 승인 필요</p>
                  <p className="text-gray-400 text-sm">교환 신청 시 관리자 승인이 필요합니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireApprovalForExchange}
                    onChange={(e) => setSettings({ ...settings, requireApprovalForExchange: e.target.checked })}
                    disabled={!isCeo}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <div>
                  <p className="text-white font-medium">배송 출고 승인 필요</p>
                  <p className="text-gray-400 text-sm">배송 출고 시 관리자 승인이 필요합니다</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireApprovalForDelivery}
                    onChange={(e) => setSettings({ ...settings, requireApprovalForDelivery: e.target.checked })}
                    disabled={!isCeo}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ruby-600 peer-disabled:opacity-50"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">승인 권한 역할</label>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(ADMIN_ROLES).map(([key, role]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.approvalRoles?.includes(key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings({
                              ...settings,
                              approvalRoles: [...(settings.approvalRoles || []), key],
                            });
                          } else {
                            setSettings({
                              ...settings,
                              approvalRoles: settings.approvalRoles?.filter((r) => r !== key),
                            });
                          }
                        }}
                        disabled={!isCeo}
                        className="w-4 h-4 text-ruby-600 bg-dark-700 border-dark-600 rounded focus:ring-ruby-500"
                      />
                      <span className="text-gray-300">{role.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-2">선택된 역할만 승인 권한을 갖습니다</p>
              </div>

              {/* 역할별 권한 표시 */}
              <div className="mt-6">
                <h3 className="text-white font-medium mb-4">역할별 권한</h3>
                <div className="space-y-3">
                  {Object.entries(ADMIN_ROLES).map(([key, role]) => (
                    <div key={key} className="bg-dark-700/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${key === 'CEO' ? 'bg-ruby-500' : 'bg-blue-500'}`}></span>
                        <span className="text-white font-medium">{role.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-2 py-1 text-xs bg-dark-600 text-gray-300 rounded"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 데이터 관리 */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {!isCeo && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-400 text-sm">대표 계정만 데이터를 삭제할 수 있습니다.</p>
                </div>
              )}

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 font-medium">주의사항</p>
                <p className="text-red-300 text-sm mt-1">
                  삭제된 데이터는 복구할 수 없습니다. 신중하게 진행해주세요.
                </p>
              </div>

              {/* 개별 데이터 삭제 */}
              <div>
                <h3 className="text-white font-medium mb-4">개별 데이터 삭제</h3>
                <div className="space-y-3">
                  {dataCategories.map((category) => (
                    <div
                      key={category.key}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        category.danger ? 'bg-red-500/5 border border-red-500/20' : 'bg-dark-700/50'
                      }`}
                    >
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          {category.label}
                          {category.danger && (
                            <span className="text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded">위험</span>
                          )}
                        </p>
                        <p className="text-gray-400 text-sm">{category.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteData(category)}
                        disabled={!isCeo || deleting === category.key}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 ${
                          category.danger
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-dark-600 hover:bg-dark-500 text-gray-300'
                        }`}
                      >
                        {deleting === category.key ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 전체 데이터 삭제 */}
              <div className="border-t border-dark-600 pt-6">
                <h3 className="text-red-400 font-medium mb-4">전체 데이터 삭제</h3>
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                  <p className="text-white font-medium mb-2">모든 데이터 초기화</p>
                  <p className="text-gray-400 text-sm mb-4">
                    관리자 계정을 제외한 모든 데이터(사용자, 교환 신청, 시즌, 라운드, 결제, 보상 등)가 삭제됩니다.
                  </p>
                  <button
                    onClick={handleDeleteAllData}
                    disabled={!isCeo || deleting === 'all'}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {deleting === 'all' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    전체 데이터 삭제
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
