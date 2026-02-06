import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser, checkAdultVerification, completePassVerification } from '../api/exchangeApi';

// 카카오 설정
const KAKAO_JS_KEY = '8bfa8dcca7350d0d0b9b866bcaea6f89';
const KAKAO_REST_API_KEY = '3dd43ca76776af78ace98fbea2cd032c';
const KAKAO_CHANNEL_PUBLIC_ID = '_xiJqhX';

// 구글 설정
const GOOGLE_CLIENT_ID = '719952954585-c1a0qjdfk2jo7ml11pou2ept5coc55r6.apps.googleusercontent.com';

// 테스트 계정
const TEST_ACCOUNT = {
  email: 'test@ruby.com',
  password: '1234',
  name: '김루비',
};

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [kakaoInitialized, setKakaoInitialized] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // PASS 본인인증 처리
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
        popupUrl = data.formUrl;
      } else {
        // 실제 NICE 인증 페이지 (form submit 방식)
        popupUrl = `https://nice.checkplus.co.kr/CheckPlusSa498AgreeStmt/mob/agree?m=checkplusService&token_version_id=${data.token_version_id}&enc_data=${encodeURIComponent(data.enc_data)}&integrity_value=${encodeURIComponent(data.integrity_value)}`;
      }

      const popup = window.open(popupUrl, 'niceAuth', 'width=480,height=720,scrollbars=yes');

      if (!popup) {
        setError('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        setVerificationLoading(false);
        return;
      }

      // postMessage 이벤트 리스너
      const handleMessage = async (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'NICE_VERIFICATION') return;

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

  // 카카오 SDK 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
      setKakaoInitialized(true);
    } else if (window.Kakao?.isInitialized()) {
      setKakaoInitialized(true);
    }
  }, []);

  // 카카오 로그인 핸들러 (카카오 싱크 + 추가 동의 항목)
  const handleKakaoLogin = () => {
    if (!window.Kakao?.isInitialized()) {
      window.Kakao?.init(KAKAO_JS_KEY);
    }

    // 카카오 SDK 2.x 버전 - authorize 사용
    // 카카오 싱크: 채널 추가 + 추가 동의 항목 + 메시지 발송 권한
    window.Kakao.Auth.authorize({
      redirectUri: window.location.origin + '/oauth',
      // 추가 동의 항목: 전화번호, 생년월일, 성별, 카카오톡 메시지
      scope: 'phone_number,birthday,birthyear,gender,talk_message',
      // 카카오 싱크: 채널 추가 동의
      channelPublicIds: KAKAO_CHANNEL_PUBLIC_ID,
      // 서비스 약관 동의 (카카오 싱크)
      serviceTerms: 'channel_add',
    });
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = () => {
    const redirectUri = window.location.origin + '/oauth/google';
    const scope = 'email profile openid';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // 로그인 처리
        const loginResult = await loginUser(formData.email, formData.password);

        if (loginResult.success) {
          // 로그인 성공
          const user = loginResult.data;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userEmail', user.email);

          // 성인 인증 상태 확인
          const verificationResult = await checkAdultVerification(user.email);
          if (verificationResult.success) {
            localStorage.setItem('adultVerified', verificationResult.data.isVerified ? 'true' : 'false');
          }

          navigate('/');
        } else {
          setError(loginResult.error);
        }
      } else {
        // 회원가입 처리
        if (formData.password !== formData.confirmPassword) {
          setError('비밀번호가 일치하지 않습니다.');
          setLoading(false);
          return;
        }

        // 사용자 등록
        const registerResult = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          birthDate: verificationResult?.birthDate || '',
        });

        if (!registerResult.success) {
          setError(registerResult.error || '회원가입에 실패했습니다.');
          setLoading(false);
          return;
        }

        // PASS 본인인증 결과가 있으면 자동 승인
        if (verificationResult?.verified) {
          const passResult = await completePassVerification(formData.email, verificationResult);
          if (passResult.success) {
            setSuccess('회원가입이 완료되었습니다. 성인 인증이 완료되었습니다. 로그인해주세요.');
          } else {
            setSuccess('회원가입이 완료되었습니다. 성인 인증 처리 중 문제가 발생했습니다. 마이페이지에서 다시 시도해주세요.');
          }
        } else {
          setSuccess('회원가입이 완료되었습니다. 로그인해주세요.');
        }

        // 로그인 상태로 전환
        setTimeout(() => {
          setIsLogin(true);
          setVerificationResult(null);
          setFormData({
            email: formData.email,
            password: '',
            name: '',
            phone: '',
            confirmPassword: '',
            agreeTerms: false,
          });
        }, 2000);
      }
    } catch (err) {
      setError('처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 sm:py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-ruby-600/10 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-ruby-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* Floating gems */}
      <div className="absolute top-32 right-[20%] w-4 h-4 bg-gradient-to-br from-ruby-400 to-ruby-600 rotate-45 animate-ruby-rotate opacity-40" />
      <div className="absolute bottom-40 left-[15%] w-3 h-3 bg-gradient-to-br from-ruby-300 to-ruby-500 rotate-45 animate-ruby-rotate opacity-30" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-40 left-[10%] w-2 h-2 bg-ruby-400 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-60 right-[10%] w-2 h-2 bg-ruby-300 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />

      <div className="max-w-md w-full mx-auto px-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-6 sm:mb-8 animate-fade-in-down opacity-0 group" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="relative">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Ruby Round"
              className="h-10 sm:h-12 transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
            />
            <div className="absolute inset-0 bg-ruby-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        {/* Tab */}
        <div className="flex bg-dark-800 rounded-xl p-1 mb-6 sm:mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              isLogin ? 'bg-ruby-600 text-white shadow-lg shadow-ruby-600/25' : 'text-gray-400 hover:text-white'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              !isLogin ? 'bg-ruby-600 text-white shadow-lg shadow-ruby-600/25' : 'text-gray-400 hover:text-white'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Test Account Info */}
        {isLogin && (
          <div className="mb-4 p-3 bg-ruby-600/10 border border-ruby-600/30 rounded-lg text-sm animate-fade-in-up opacity-0" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <p className="text-ruby-400 font-medium mb-1">테스트 계정</p>
            <p className="text-gray-400">이메일: <span className="text-white">test@ruby.com</span></p>
            <p className="text-gray-400">비밀번호: <span className="text-white">1234</span></p>
          </div>
        )}

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {!isLogin && (
            <div className="animate-fade-in-up">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all duration-300 text-sm sm:text-base"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              이메일
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all duration-300 text-sm sm:text-base"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all duration-300 text-sm sm:text-base"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="animate-fade-in-up">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all duration-300 text-sm sm:text-base"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>

              <div className="animate-fade-in-up">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruby-500 focus:ring-2 focus:ring-ruby-500/20 transition-all duration-300 text-sm sm:text-base"
                  placeholder="010-1234-5678"
                />
              </div>

              {/* 성인 인증 섹션 */}
              <div className="animate-fade-in-up p-4 bg-dark-800/50 border border-dark-600 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-ruby-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-ruby-400">성인 인증</span>
                </div>

                {verificationResult?.verified ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-600/20 text-green-400 border border-green-600/30">
                        인증완료
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      인증 이름: <span className="text-white">{verificationResult.maskedName}</span>
                      <span className="text-dark-500 mx-2">|</span>
                      생년월일: <span className="text-white">{verificationResult.maskedBirthDate}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationResult(null);
                        handlePassVerification();
                      }}
                      className="mt-3 text-xs sm:text-sm text-gray-400 hover:text-ruby-400 transition-colors underline underline-offset-2"
                    >
                      다시 인증하기
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
                        미인증
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePassVerification}
                      disabled={verificationLoading}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg font-medium text-sm sm:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {verificationLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          인증 진행 중...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          PASS 본인인증 하기
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-[10px] sm:text-xs text-gray-500">
                      * 본인 명의 휴대폰으로 인증이 진행됩니다.
                    </p>
                    <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                      * 만 19세 이상만 가입 가능합니다.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 sm:gap-3 animate-fade-in-up">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 bg-dark-800 border border-dark-600 rounded text-ruby-600 focus:ring-ruby-500"
                  required
                />
                <label htmlFor="agreeTerms" className="text-xs sm:text-sm text-gray-400">
                  <Link to="/terms" className="text-ruby-400 hover:underline">이용약관</Link> 및{' '}
                  <Link to="/privacy" className="text-ruby-400 hover:underline">개인정보처리방침</Link>에 동의합니다.
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
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
                isLogin ? '로그인' : '회원가입'
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-ruby-700 to-ruby-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 animate-shimmer opacity-30" />
          </button>
        </form>

        {isLogin && (
          <div className="mt-4 sm:mt-6 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-ruby-400 transition-colors">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        )}

        {/* Social Login */}
        <div className="mt-6 sm:mt-8 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-dark-900 text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-dark-800 border border-dark-600 rounded-lg hover:border-dark-500 hover:bg-dark-700 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
              </svg>
              <span className="text-xs sm:text-sm text-gray-300">Google</span>
            </button>
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#FEE500] rounded-lg hover:bg-[#FDD800] transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#000" d="M12,3c5.8,0,10.5,3.7,10.5,8.3c0,4.6-4.7,8.3-10.5,8.3c-1,0-2-0.1-2.9-0.4l-4.5,3l0.9-4.4C3.2,16,2,13.8,2,11.3C2,6.7,6.7,3,12,3z"/>
              </svg>
              <span className="text-xs sm:text-sm text-dark-900 font-medium">카카오</span>
            </button>
          </div>
        </div>

        {/* Notice */}
        <p className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-500 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          Ruby Round 계정으로 시즌에 참여하고<br />
          실물 루비 보석을 받아보세요.
        </p>
      </div>
    </div>
  );
}
