import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function NiceCallback() {
  const [searchParams] = useSearchParams();

  // 기존 방식: token
  const token = searchParams.get('token');

  // 새로운 방식: web_transaction_id (NICE 통합인증)
  const webTransactionId = searchParams.get('web_transaction_id');

  useEffect(() => {
    if (window.opener) {
      if (webTransactionId) {
        // 새로운 NICE 통합인증 방식
        window.opener.postMessage(
          { type: 'NICE_VERIFICATION_NEW', webTransactionId },
          window.location.origin
        );
      } else if (token) {
        // 기존 방식 (시뮬레이션 등)
        window.opener.postMessage(
          { type: 'NICE_VERIFICATION', token },
          window.location.origin
        );
      }
      // 팝업 닫기
      setTimeout(() => window.close(), 500);
    }
  }, [token, webTransactionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center p-8">
        <div className="animate-spin w-10 h-10 border-3 border-ruby-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-300 text-lg font-medium mb-2">본인인증 처리 중...</p>
        <p className="text-gray-500 text-sm">잠시만 기다려주세요. 창이 자동으로 닫힙니다.</p>
        {!window.opener && (token || webTransactionId) && (
          <p className="text-yellow-400 text-sm mt-4">
            팝업이 차단된 경우, 이 창을 닫고 다시 시도해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
