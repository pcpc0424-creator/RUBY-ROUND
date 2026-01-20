import { useState, useEffect } from 'react';
import {
  getSystemSettings,
  saveSystemSettings,
  getAdminAuth,
  createAuditLog,
} from '../../api/exchangeApi';
import { ADMIN_ROLES } from '../../constants/exchangeConstants';

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
    approvalRoles: ['ceo'],
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
  ];

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
                        <span className={`w-2 h-2 rounded-full ${key === 'ceo' ? 'bg-ruby-500' : 'bg-blue-500'}`}></span>
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
        </div>
      </div>
    </div>
  );
}
