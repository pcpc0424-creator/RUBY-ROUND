import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerOrGetSocialUser } from '../api/exchangeApi';

const KAKAO_JS_KEY = '8bfa8dcca7350d0d0b9b866bcaea6f89';

export default function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setError('카카오 로그인이 취소되었습니다.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (code) {
      handleKakaoCallback(code);
    } else {
      setStatus('error');
      setError('인증 코드가 없습니다.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  const handleKakaoCallback = async (code) => {
    try {
      // Kakao SDK 초기화
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }

      // 인가 코드로 토큰 요청 (SDK 사용)
      const response = await fetch('/api/auth/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirectUri: window.location.origin + '/oauth',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '카카오 로그인 실패');
      }

      const userInfo = result.data;

      // 사용자 등록/조회 (추가 동의 항목 포함)
      const registerResult = await registerOrGetSocialUser({
        name: userInfo.name,
        email: userInfo.email,
        profileImage: userInfo.profileImage || '',
        loginProvider: 'kakao',
        socialId: userInfo.kakaoId,
        // 추가 동의 항목
        phoneNumber: userInfo.phoneNumber || '',
        birthday: userInfo.birthday || '',
        birthyear: userInfo.birthyear || '',
        gender: userInfo.gender || '',
      });

      if (!registerResult.success) {
        throw new Error('사용자 등록에 실패했습니다.');
      }

      // 로그인 처리
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', registerResult.data.name);
      localStorage.setItem('userEmail', registerResult.data.email);
      localStorage.setItem('userProfileImage', registerResult.data.profileImage || '');
      localStorage.setItem('loginProvider', 'kakao');
      localStorage.setItem('kakaoAccessToken', userInfo.accessToken);

      // 신규 가입자에게 카카오톡 환영 메시지 발송
      if (registerResult.isNewUser) {
        try {
          await fetch('/api/auth/kakao/send-welcome-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              accessToken: userInfo.accessToken,
              userName: userInfo.name,
              isNewUser: true,
            }),
          });
        } catch (msgErr) {
          console.log('환영 메시지 발송 실패 (무시됨):', msgErr);
        }
      }

      setStatus('success');
      setTimeout(() => navigate('/'), 1000);

    } catch (err) {
      console.error('카카오 로그인 에러:', err);
      setStatus('error');
      setError(err.message || '카카오 로그인 처리 중 오류가 발생했습니다.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-lg">카카오 로그인 처리 중...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-lg">로그인 성공!</p>
            <p className="text-gray-400 mt-2">잠시 후 이동합니다...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-lg">로그인 실패</p>
            <p className="text-red-400 mt-2">{error}</p>
            <p className="text-gray-400 mt-2">로그인 페이지로 이동합니다...</p>
          </>
        )}
      </div>
    </div>
  );
}
