import { useEffect, useState } from 'react';
import { getConsultationModalContent } from '../../api/exchangeApi';

export default function ConsultationSubmitModal({ isOpen, onConfirm, onCancel }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const modalContent = getConsultationModalContent();
      setContent(modalContent);
    }
  }, [isOpen]);

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* 모달 콘텐츠 */}
      <div className="relative w-full max-w-lg bg-dark-800 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden animate-fade-in">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-ruby-600 to-ruby-700 px-6 py-5">
          <h2 className="text-xl font-bold text-white">{content.title}</h2>
          {content.subtitle && (
            <p className="text-ruby-200 text-sm mt-1">{content.subtitle}</p>
          )}
        </div>

        {/* 본문 */}
        <div className="px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {content.items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex gap-4 p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-ruby-600/30 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 버튼 */}
        <div className="px-6 py-4 bg-dark-900/50 border-t border-dark-600 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-colors"
          >
            {content.cancelButtonText || '취소'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-ruby-600 hover:bg-ruby-700 text-white font-semibold rounded-lg transition-colors"
          >
            {content.confirmButtonText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
