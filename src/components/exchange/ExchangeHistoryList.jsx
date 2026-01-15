import { useState, useEffect } from 'react';
import ExchangeStatusBadge from './ExchangeStatusBadge';
import ExchangeDetailModal from './ExchangeDetailModal';
import { EXCHANGE_CATEGORIES, getStatusByKey } from '../../constants/exchangeConstants';
import { getMyApplications, cancelApplication } from '../../api/exchangeApi';
import { formatAmount, formatDate, getRelativeTime, initializeSampleData } from '../../utils/localStorage';

export default function ExchangeHistoryList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 데이터 로드
  const loadApplications = async () => {
    initializeSampleData();
    const userEmail = localStorage.getItem('userEmail') || 'test@ruby.com';
    const result = await getMyApplications(userEmail);
    if (result.success) {
      setApplications(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // 상세 보기
  const handleViewDetail = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  // 취소 처리
  const handleCancel = async (applicationId) => {
    if (!window.confirm('정말 취소하시겠습니까?')) {
      return;
    }

    const result = await cancelApplication(applicationId, '고객 요청 취소');
    if (result.success) {
      loadApplications();
      alert('취소되었습니다.');
    } else {
      alert(result.error || '취소 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-ruby-500 border-t-transparent"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-400">교환 신청 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const category = EXCHANGE_CATEGORIES[app.category];
        const statusInfo = getStatusByKey(app.status);

        return (
          <div
            key={app.id}
            className="bg-dark-700/50 border border-dark-600 rounded-lg overflow-hidden hover:border-ruby-600/30 transition-all duration-300"
          >
            {/* 헤더 */}
            <div className="px-4 py-3 bg-dark-700 border-b border-dark-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-white font-mono text-sm">{app.id}</span>
                <ExchangeStatusBadge status={app.status} showDetail size="small" />
              </div>
              <span className="text-gray-500 text-sm">{getRelativeTime(app.createdAt)}</span>
            </div>

            {/* 내용 */}
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 카테고리 아이콘 */}
                <div className="w-12 h-12 bg-ruby-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {category?.icon}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-white font-medium">{category?.label}</p>
                      <p className="text-gray-400 text-sm">
                        {Object.values(app.specifications || {}).join(' / ') || '사양 미지정'}
                      </p>
                    </div>
                    <p className="text-ruby-400 font-semibold whitespace-nowrap">
                      {formatAmount(app.requestedAmount)}
                    </p>
                  </div>

                  {/* 상태 안내 */}
                  <p className="text-gray-500 text-sm mb-3">{statusInfo?.description}</p>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(app)}
                      className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 text-sm rounded-lg transition-colors"
                    >
                      상세 보기
                    </button>
                    {statusInfo?.canCancel && (
                      <button
                        onClick={() => handleCancel(app.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors"
                      >
                        취소
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 진행 상태 타임라인 (간략) */}
              {app.statusHistory && app.statusHistory.length > 1 && (
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <p className="text-gray-500 text-xs mb-2">최근 상태 변경</p>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {app.statusHistory.slice(-3).map((history, idx) => {
                      const historyStatus = getStatusByKey(history.status);
                      return (
                        <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                          {idx > 0 && (
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {historyStatus?.label || history.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 상세 모달 */}
      {showModal && selectedApplication && (
        <ExchangeDetailModal
          application={selectedApplication}
          onClose={() => {
            setShowModal(false);
            setSelectedApplication(null);
          }}
          onCancel={(id) => {
            handleCancel(id);
            setShowModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
}
