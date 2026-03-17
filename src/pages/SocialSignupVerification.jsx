import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerOrGetSocialUser, completePassVerification } from '../api/exchangeApi';

export default function SocialSignupVerification() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);

  useEffect(() => {
    // sessionStorage에서 대기 중인 소셜 사용자 정보 가져오기
    const storedData = sessionStorage.getItem('pendingSocialUser');
    if (!storedData) {
      setError('회원가입 정보가 없습니다. 다시 로그인해주세요.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const userData = JSON.parse(storedData);
      setPendingUserData(userData);
    } catch (err) {
      setError('회원가입 정보를 불러올 수 없습니다.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  // PASS 본인인증 처리 (새로운 NICE 통합인증 방식)
  const handlePassVerification = useCallback(async () => {
    setVerificationLoading(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const tokenRes = await fetch(`${API_BASE}/api/auth/nice/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.success) {
        setError(tokenData.error || '본인인증 준비에 실패했습니다.');
        setVerificationLoading(false);
        return;
      }

      const { data } = tokenData;

      // 팝업 열기
      let popupUrl;
      if (data.simulation) {
        // 시뮬레이션 모드
        popupUrl = data.formUrl;
      } else {
        // 새로운 NICE 통합인증 방식
        popupUrl = data.authUrl;
      }

      // requestNo 저장 (새로운 방식에서 필요)
      const currentRequestNo = data.requestNo;

      const popup = window.open(popupUrl, 'niceAuth', 'width=480,height=720,scrollbars=yes');

      if (!popup) {
        setError('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        setVerificationLoading(false);
        return;
      }

      // postMessage 이벤트 리스너
      const handleMessage = async (event) => {
        if (event.origin !== window.location.origin) return;

        // 새로운 NICE 통합인증 방식
        if (event.data?.type === 'NICE_VERIFICATION_NEW') {
          window.removeEventListener('message', handleMessage);

          const webTransactionId = event.data.webTransactionId;
          if (!webTransactionId) {
            setError('인증 결과를 받을 수 없습니다.');
            setVerificationLoading(false);
            return;
          }

          // 결과 조회 (새로운 방식)
          const verifyRes = await fetch(`${API_BASE}/api/auth/nice/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestNo: currentRequestNo,
              webTransactionId,
            }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            setError(verifyData.error || '인증 결과 조회에 실패했습니다.');
            setVerificationLoading(false);
            return;
          }

          const result = verifyData.data;

          if (!result.isAdult) {
            setError('만 19세 미만은 가입할 수 없습니다.');
            setVerificationLoading(false);
            return;
          }

          setVerificationResult({
            name: result.name,
            maskedName: result.maskedName,
            birthDate: result.birthDate,
            maskedBirthDate: result.maskedBirthDate,
            ci: result.ci,
            di: result.di,
            isAdult: result.isAdult,
            verified: true,
            verifiedAt: new Date().toISOString(),
          });
          setVerificationLoading(false);
          return;
        }

        // 기존 방식 (시뮬레이션 등)
        if (event.data?.type === 'NICE_VERIFICATION') {
          window.removeEventListener('message', handleMessage);

          const resultToken = event.data.token;
          if (!resultToken) {
            setError('인증 결과를 받을 수 없습니다.');
            setVerificationLoading(false);
            return;
          }

          // 결과 조회
          const resultRes = await fetch(`${API_BASE}/api/auth/nice/result/${resultToken}`);
          const resultData = await resultRes.json();

          if (!resultData.success) {
            setError(resultData.error || '인증 결과 조회에 실패했습니다.');
            setVerificationLoading(false);
            return;
          }

          const result = resultData.data;

          if (!result.isAdult) {
            setError('만 19세 미만은 가입할 수 없습니다.');
            setVerificationLoading(false);
            return;
          }

          setVerificationResult({
            name: result.name,
            maskedName: result.maskedName,
            birthDate: result.birthDate,
            maskedBirthDate: result.maskedBirthDate,
            ci: result.ci,
            di: result.di,
            isAdult: result.isAdult,
            verified: true,
            verifiedAt: result.verifiedAt,
          });
          setVerificationLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // 팝업 닫힘 감지
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setVerificationLoading(false);
          window.removeEventListener('message', handleMessage);
        }
      }, 500);
    } catch (err) {
      console.error('PASS 인증 오류:', err);
      setError('본인인증 처리 중 오류가 발생했습니다.');
      setVerificationLoading(false);
    }
  }, []);

  // 회원가입 완료 처리
  const handleCompleteSignup = async () => {
    if (!pendingUserData) {
      setError('회원가입 정보가 없습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 사용자 등록
      const registerResult = await registerOrGetSocialUser({
        ...pendingUserData,
      });

      if (!registerResult.success) {
        throw new Error(registerResult.error || '회원가입에 실패했습니다.');
      }

      // 성인인증은 NICE 연동 완료 후 활성화 예정
      // const passResult = await completePassVerification(registerResult.data.email, verificationResult);

      // 로그인 처리
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', registerResult.data.name);
      localStorage.setItem('userEmail', registerResult.data.email);
      localStorage.setItem('userProfileImage', registerResult.data.profileImage || '');
      localStorage.setItem('loginProvider', pendingUserData.loginProvider);
      localStorage.setItem('adultVerified', 'false'); // NICE 연동 후 true로 변경

      // 카카오 액세스 토큰 저장
      if (pendingUserData.accessToken) {
        localStorage.setItem('kakaoAccessToken', pendingUserData.accessToken);
      }

      // sessionStorage 정리
      sessionStorage.removeItem('pendingSocialUser');

      setSuccess('회원가입이 완료되었습니다!');
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      console.error('회원가입 에러:', err);
      setError(err.message || '회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const providerName = pendingUserData?.loginProvider === 'kakao' ? '카카오' : '구글';
  const providerColor = pendingUserData?.loginProvider === 'kakao' ? 'yellow' : 'blue';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 sm:py-20 relative overflow-hidden bg-dark-900">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-md w-full mx-auto px-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-6 sm:mb-8 group">
          <div className="relative">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Ruby Round"
              className="h-10 sm:h-12 transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
            />
          </div>
        </Link>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {providerName} 회원가입
          </h1>
          <p className="text-sm text-gray-400">
            회원가입을 완료해주세요
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-600/10 border border-green-600/30 rounded-lg text-sm text-green-400">
            {success}
          </div>
        )}

        {/* User Info Card */}
        {pendingUserData && (
          <div className="mb-6 p-4 bg-dark-800/50 border border-dark-600 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              {pendingUserData.profileImage ? (
                <img
                  src={pendingUserData.profileImage}
                  alt="프로필"
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className={`w-12 h-12 rounded-full bg-${providerColor}-500/20 flex items-center justify-center`}>
                  <span className="text-lg font-bold text-gray-300">
                    {pendingUserData.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-medium">{pendingUserData.name}</p>
                <p className="text-sm text-gray-400">{pendingUserData.email}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-${providerColor}-500/20 text-${providerColor}-400 text-xs`}>
              {pendingUserData.loginProvider === 'kakao' ? (
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,3c5.8,0,10.5,3.7,10.5,8.3c0,4.6-4.7,8.3-10.5,8.3c-1,0-2-0.1-2.9-0.4l-4.5,3l0.9-4.4C3.2,16,2,13.8,2,11.3C2,6.7,6.7,3,12,3z"/>
                </svg>
              ) : (
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              )}
              {providerName} 계정
            </div>
          </div>
        )}

        {/* 성인 인증 섹션 - NICE 연동 완료 후 활성화 예정 */}
        {/*
        <div className="p-4 bg-dark-800/50 border border-dark-600 rounded-lg mb-6">
          ... 성인인증 UI ...
        </div>
        */}

        {/* 회원가입 완료 버튼 */}
        <button
          type="button"
          onClick={handleCompleteSignup}
          disabled={loading}
          className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                처리 중...
              </span>
            ) : (
              '회원가입 완료'
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 animate-shimmer opacity-30" />
        </button>

        {/* 취소 버튼 */}
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem('pendingSocialUser');
            navigate('/login');
          }}
          className="w-full mt-3 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          취소하고 로그인 페이지로 돌아가기
        </button>

        {/* Notice */}
        <p className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-500">
          Ruby Round 계정으로 시즌에 참여하고<br />
          실물 루비 보석을 받아보세요.
        </p>
      </div>
    </div>
  );
}
