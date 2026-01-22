const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3010;

// 토스페이먼츠 시크릿 키
const TOSS_SECRET_KEY = 'live_gsk_EP59LybZ8Bp4XzPjXxzkV6GYo7pR';

// 카카오 REST API 키
const KAKAO_REST_API_KEY = '3dd43ca76776af78ace98fbea2cd032c';

app.use(cors());
app.use(express.json());

// 결제 승인 API
app.post('/api/payments/confirm', async (req, res) => {
  const { paymentKey, orderId, amount } = req.body;

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({
      success: false,
      error: '필수 파라미터가 누락되었습니다.'
    });
  }

  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('결제 승인 성공:', orderId);
      res.json({
        success: true,
        data
      });
    } else {
      console.error('결제 승인 실패:', data);
      res.status(response.status).json({
        success: false,
        error: data.message || '결제 승인에 실패했습니다.',
        code: data.code
      });
    }
  } catch (error) {
    console.error('결제 승인 오류:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    });
  }
});

// 카카오 로그인 API
app.post('/api/auth/kakao', async (req, res) => {
  const { code, redirectUri } = req.body;

  console.log('카카오 로그인 요청:', { code: code?.substring(0, 20) + '...', redirectUri });
  console.log('사용할 REST API KEY:', KAKAO_REST_API_KEY);

  if (!code || !redirectUri) {
    return res.status(400).json({
      success: false,
      error: '필수 파라미터가 누락되었습니다.'
    });
  }

  try {
    const requestBody = `grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;

    console.log('토큰 요청 바디:', requestBody);

    // 1. 인가 코드로 액세스 토큰 받기
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('카카오 토큰 에러:', tokenData);
      return res.status(400).json({
        success: false,
        error: tokenData.error_description || '토큰 발급 실패'
      });
    }

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const userData = await userResponse.json();

    if (userData.code && userData.code < 0) {
      console.error('카카오 사용자 정보 에러:', userData);
      return res.status(400).json({
        success: false,
        error: '사용자 정보를 가져올 수 없습니다.'
      });
    }

    // 3. 사용자 정보 추출
    const kakaoAccount = userData.kakao_account || {};
    const profile = kakaoAccount.profile || {};

    const userInfo = {
      kakaoId: userData.id,
      email: kakaoAccount.email || `kakao_${userData.id}@kakao.user`,
      name: profile.nickname || '카카오 사용자',
      profileImage: profile.profile_image_url || '',
      accessToken: tokenData.access_token,
    };

    console.log('카카오 로그인 성공:', userInfo.email);

    res.json({
      success: true,
      data: userInfo
    });

  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    });
  }
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Ruby Round Payment Server running on port ${PORT}`);
});
