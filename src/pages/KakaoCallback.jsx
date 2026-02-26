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
      const response = await fetch(`${import.meta.env.BASE_URL}api/auth/kakao`, {
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

      // 먼저 사용자 존재 여부 확인
      const checkResponse = await fetch(`${import.meta.env.BASE_URL}api/auth/social/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userInfo.email,
          socialProvider: 'kakao',
          socialId: userInfo.kakaoId,
        }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResult.success) {
        throw new Error('사용자 확인에 실패했습니다.');
      }

      // 기존 사용자인 경우 바로 로그인
      if (checkResult.data.exists) {
        const registerResult = await registerOrGetSocialUser({
          name: userInfo.name,
          email: userInfo.email,
          profileImage: userInfo.profileImage || '',
          loginProvider: 'kakao',
          socialId: userInfo.kakaoId,
          phoneNumber: userInfo.phoneNumber || '',
          birthday: userInfo.birthday || '',
          birthyear: userInfo.birthyear || '',
          gender: userInfo.gender || '',
        });

        if (!registerResult.success) {
          throw new Error('로그인에 실패했습니다.');
        }

        // 로그인 처리
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', registerResult.data.name);
        localStorage.setItem('userEmail', registerResult.data.email);
        localStorage.setItem('userProfileImage', registerResult.data.profileImage || '');
        localStorage.setItem('loginProvider', 'kakao');
        localStorage.setItem('kakaoAccessToken', userInfo.accessToken);
        localStorage.setItem('adultVerified', checkResult.data.isAdultVerified ? 'true' : 'false');

        setStatus('success');
        setTimeout(() => navigate('/'), 1000);
      } else {
        // 신규 사용자 - 성인인증 페이지로 이동
        sessionStorage.setItem('pendingSocialUser', JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          profileImage: userInfo.profileImage || '',
          loginProvider: 'kakao',
          socialId: userInfo.kakaoId,
          phoneNumber: userInfo.phoneNumber || '',
          birthday: userInfo.birthday || '',
          birthyear: userInfo.birthyear || '',
          gender: userInfo.gender || '',
          accessToken: userInfo.accessToken,
        }));

        setStatus('verification_required');
        setTimeout(() => navigate('/signup/verify'), 1500);
      }

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

        {status === 'verification_required' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-white text-lg">성인인증이 필요합니다</p>
            <p className="text-gray-400 mt-2">성인인증 페이지로 이동합니다...</p>
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
