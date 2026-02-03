const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = 3010;

// 토스페이먼츠 시크릿 키
const TOSS_SECRET_KEY = 'live_gsk_EP59LybZ8Bp4XzPjXxzkV6GYo7pR';

// 카카오 REST API 키
const KAKAO_REST_API_KEY = '3dd43ca76776af78ace98fbea2cd032c';
const KAKAO_CLIENT_SECRET = 'pL6T6sC2Eem6Ml6p9CebKuGDVn05PwPt';
const KAKAO_CHANNEL_PUBLIC_ID = '_xiJqhX';

// 구글 OAuth 설정 (환경변수에서 로드)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// NICE 본인확인 API 설정
const NICE_CLIENT_ID = process.env.NICE_CLIENT_ID || '';
const NICE_CLIENT_SECRET = process.env.NICE_CLIENT_SECRET || '';
const NICE_PRODUCT_ID = process.env.NICE_PRODUCT_ID || '';
const NICE_SIMULATION = process.env.NICE_SIMULATION === 'true';

// NICE 인증 임시 저장소 (메모리)
const niceRequestStore = new Map();  // requestNo -> { key, iv, hmacKey }
const niceResultStore = new Map();   // resultToken -> { name, birthDate, gender, ci, di, isAdult }

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const requestBody = `grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&client_secret=${KAKAO_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;

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

    // 3. 사용자 정보 추출 (추가 동의 항목 포함)
    const kakaoAccount = userData.kakao_account || {};
    const profile = kakaoAccount.profile || {};

    const userInfo = {
      kakaoId: userData.id,
      email: kakaoAccount.email || `kakao_${userData.id}@kakao.user`,
      name: profile.nickname || '카카오 사용자',
      profileImage: profile.profile_image_url || '',
      accessToken: tokenData.access_token,
      // 추가 동의 항목
      phoneNumber: kakaoAccount.phone_number || '',
      birthday: kakaoAccount.birthday || '', // MMDD 형식
      birthyear: kakaoAccount.birthyear || '', // YYYY 형식
      gender: kakaoAccount.gender || '', // male/female
      // 동의 여부 확인
      hasPhoneNumber: kakaoAccount.has_phone_number || false,
      hasBirthday: kakaoAccount.has_birthday || false,
      hasBirthyear: kakaoAccount.has_birthyear || false,
      hasGender: kakaoAccount.has_gender || false,
    };

    console.log('카카오 로그인 성공:', userInfo.email);
    console.log('추가 정보:', {
      phoneNumber: userInfo.phoneNumber ? '있음' : '없음',
      birthday: userInfo.birthday,
      birthyear: userInfo.birthyear,
      gender: userInfo.gender
    });

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

// 카카오톡 메시지 발송 API (가입 환영 메시지)
app.post('/api/auth/kakao/send-welcome-message', async (req, res) => {
  const { accessToken, userName, isNewUser } = req.body;

  // 신규 가입자에게만 메시지 발송
  if (!isNewUser) {
    return res.json({ success: true, message: '기존 사용자 - 메시지 발송 생략' });
  }

  if (!accessToken) {
    return res.status(400).json({
      success: false,
      error: '액세스 토큰이 필요합니다.'
    });
  }

  try {
    // 카카오톡 나에게 보내기 API 호출
    const messageResponse = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        template_object: JSON.stringify({
          object_type: 'text',
          text: `🎉 ${userName}님, 루비라운드 가입을 환영합니다!\n\n루비라운드에서 특별한 보석 교환 서비스를 경험해보세요.\n\n💎 다양한 루비 컬렉션\n🔄 안전한 교환 서비스\n📞 친절한 고객 상담\n\n궁금한 점이 있으시면 언제든 문의해주세요!`,
          link: {
            web_url: 'https://rubyround.net',
            mobile_web_url: 'https://rubyround.net',
          },
          button_title: '루비라운드 바로가기',
        }),
      }),
    });

    const messageResult = await messageResponse.json();

    if (messageResult.result_code === 0) {
      console.log('카카오톡 환영 메시지 발송 성공:', userName);
      res.json({ success: true, message: '환영 메시지가 발송되었습니다.' });
    } else {
      console.log('카카오톡 메시지 발송 실패:', messageResult);
      // 메시지 발송 실패해도 가입은 성공 처리
      res.json({ success: true, message: '메시지 발송 실패 (권한 없음)', error: messageResult });
    }

  } catch (error) {
    console.error('카카오톡 메시지 발송 오류:', error);
    // 메시지 발송 실패해도 가입은 성공 처리
    res.json({ success: true, message: '메시지 발송 오류', error: error.message });
  }
});

// 구글 로그인 API
app.post('/api/auth/google', async (req, res) => {
  const { code, redirectUri } = req.body;

  console.log('구글 로그인 요청:', { code: code?.substring(0, 20) + '...', redirectUri });

  if (!code || !redirectUri) {
    return res.status(400).json({
      success: false,
      error: '필수 파라미터가 누락되었습니다.'
    });
  }

  try {
    // 1. 인가 코드로 액세스 토큰 받기
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('구글 토큰 에러:', tokenData);
      return res.status(400).json({
        success: false,
        error: tokenData.error_description || '토큰 발급 실패'
      });
    }

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (userData.error) {
      console.error('구글 사용자 정보 에러:', userData);
      return res.status(400).json({
        success: false,
        error: '사용자 정보를 가져올 수 없습니다.'
      });
    }

    // 3. 사용자 정보 추출
    const userInfo = {
      googleId: userData.id,
      email: userData.email,
      name: userData.name || userData.given_name || '구글 사용자',
      profileImage: userData.picture || '',
      accessToken: tokenData.access_token,
    };

    console.log('구글 로그인 성공:', userInfo.email);

    res.json({
      success: true,
      data: userInfo
    });

  } catch (error) {
    console.error('구글 로그인 오류:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    });
  }
});

// ========== NICE 본인인증 API ==========

// 만 나이 계산 함수
function calculateAge(birthDateStr) {
  const birth = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// 이름 마스킹 (김루비 → 김*비)
function maskName(name) {
  if (!name || name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

// 생년월일 마스킹 (1990-01-15 → 1990.**.**)
function maskBirthDate(birthDate) {
  if (!birthDate) return '';
  const parts = birthDate.split('-');
  if (parts.length !== 3) return birthDate;
  return `${parts[0]}.**.**`;
}

// POST /api/auth/nice/token - 암호화 토큰 요청
app.post('/api/auth/nice/token', async (req, res) => {
  try {
    const requestNo = crypto.randomUUID();

    if (NICE_SIMULATION) {
      // 시뮬레이션 모드: 시뮬레이션 폼 URL 반환
      const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || '';
      const serverOrigin = `${req.protocol}://${req.get('host')}`;

      niceRequestStore.set(requestNo, { simulation: true, createdAt: Date.now() });

      // 5분 후 자동 삭제
      setTimeout(() => niceRequestStore.delete(requestNo), 5 * 60 * 1000);

      return res.json({
        success: true,
        data: {
          requestNo,
          simulation: true,
          formUrl: `${serverOrigin}/api/auth/nice/simulate?requestNo=${requestNo}`,
        },
      });
    }

    // 실제 NICE API 연동
    // 1. Access Token 발급
    const authHeader = Buffer.from(`${NICE_CLIENT_ID}:${NICE_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch('https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
      body: 'grant_type=client_credentials&scope=default',
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.dataBody?.access_token) {
      console.error('NICE 토큰 발급 실패:', tokenData);
      return res.status(500).json({ success: false, error: 'NICE 토큰 발급에 실패했습니다.' });
    }

    const accessToken = tokenData.dataBody.access_token;

    // 2. 암호화 토큰 요청
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const cryptoResponse = await fetch('https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`,
        'client_id': NICE_CLIENT_ID,
        'productID': NICE_PRODUCT_ID,
      },
      body: JSON.stringify({
        dataHeader: { CNTY_CD: 'ko' },
        dataBody: {
          req_dtim: new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
          req_no: requestNo,
          enc_mode: '1',
        },
      }),
    });

    const cryptoData = await cryptoResponse.json();
    if (cryptoData.dataHeader?.GW_RSLT_CD !== '1200') {
      console.error('NICE 암호화 토큰 실패:', cryptoData);
      return res.status(500).json({ success: false, error: 'NICE 암호화 토큰 요청에 실패했습니다.' });
    }

    const { token_val, site_code, token_version_id } = cryptoData.dataBody;

    // 3. 대칭키 생성
    const reqDtim = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const value = `${reqDtim.trim()}${requestNo.trim()}${token_val.trim()}`;
    const hmacSha256 = crypto.createHmac('sha256', token_val).update(value).digest('hex');

    const key = hmacSha256.substring(0, 16);
    const iv = hmacSha256.substring(hmacSha256.length - 16);
    const hmacKey = hmacSha256.substring(0, 32);

    // 대칭키 저장
    niceRequestStore.set(requestNo, { key, iv, hmacKey, tokenVersionId: token_version_id, createdAt: Date.now() });
    setTimeout(() => niceRequestStore.delete(requestNo), 5 * 60 * 1000);

    // 4. 요청 데이터 암호화
    const serverOrigin = `${req.protocol}://${req.get('host')}`;
    const requestData = JSON.stringify({
      requestno: requestNo,
      returnurl: `${serverOrigin}/api/auth/nice/callback`,
      sitecode: site_code,
      authtype: 'M',
      popupyn: 'Y',
    });

    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encData = cipher.update(requestData, 'utf8', 'base64');
    encData += cipher.final('base64');

    const integrityValue = crypto.createHmac('sha256', hmacKey).update(encData).digest('base64');

    return res.json({
      success: true,
      data: {
        requestNo,
        enc_data: encData,
        token_version_id,
        integrity_value: integrityValue,
      },
    });
  } catch (error) {
    console.error('NICE 토큰 요청 오류:', error);
    res.status(500).json({ success: false, error: '본인인증 준비 중 오류가 발생했습니다.' });
  }
});

// GET /api/auth/nice/simulate - 시뮬레이션 폼 (HTML)
app.get('/api/auth/nice/simulate', (req, res) => {
  if (!NICE_SIMULATION) {
    return res.status(404).send('Not Found');
  }

  const { requestNo } = req.query;
  if (!requestNo || !niceRequestStore.has(requestNo)) {
    return res.status(400).send('유효하지 않은 요청입니다.');
  }

  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PASS 본인인증 (시뮬레이션)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { background: #16213e; border-radius: 16px; padding: 32px; max-width: 400px; width: 100%; margin: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
    h2 { text-align: center; margin-bottom: 8px; color: #e94560; }
    .subtitle { text-align: center; color: #888; font-size: 13px; margin-bottom: 24px; }
    .badge { display: inline-block; background: #e94560; color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-left: 8px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 13px; color: #aaa; margin-bottom: 6px; }
    input { width: 100%; padding: 12px; background: #0f3460; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 15px; outline: none; }
    input:focus { border-color: #e94560; }
    .btn { width: 100%; padding: 14px; background: #e94560; border: none; border-radius: 8px; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .btn:hover { background: #c73e54; }
    .btn:disabled { background: #555; cursor: not-allowed; }
    .notice { font-size: 11px; color: #666; text-align: center; margin-top: 16px; line-height: 1.6; }
    .error { color: #e94560; font-size: 13px; margin-top: 8px; display: none; }
  </style>
</head>
<body>
  <div class="container">
    <h2>PASS 본인인증 <span class="badge">시뮬레이션</span></h2>
    <p class="subtitle">NICE 계약 전 테스트 모드입니다.</p>
    <form id="simForm" action="/api/auth/nice/simulate" method="POST">
      <input type="hidden" name="requestNo" value="${requestNo}" />
      <div class="form-group">
        <label>이름</label>
        <input type="text" name="name" required placeholder="홍길동" />
      </div>
      <div class="form-group">
        <label>생년월일</label>
        <input type="date" name="birthDate" required />
      </div>
      <div class="form-group">
        <label>휴대폰 번호</label>
        <input type="tel" name="phone" required placeholder="010-1234-5678" />
      </div>
      <div class="form-group">
        <label>성별</label>
        <select name="gender" style="width:100%;padding:12px;background:#0f3460;border:1px solid #333;border-radius:8px;color:#fff;font-size:15px;">
          <option value="M">남성</option>
          <option value="F">여성</option>
        </select>
      </div>
      <div id="error" class="error"></div>
      <button type="submit" class="btn" id="submitBtn">본인인증 완료</button>
    </form>
    <p class="notice">
      이 화면은 시뮬레이션 모드 전용입니다.<br/>
      실제 NICE API 연동 시에는 PASS 앱 인증 화면이 표시됩니다.
    </p>
  </div>
  <script>
    document.getElementById('simForm').addEventListener('submit', function(e) {
      var btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = '처리 중...';
    });
  </script>
</body>
</html>`);
});

// POST /api/auth/nice/simulate - 시뮬레이션 인증 처리
app.post('/api/auth/nice/simulate', (req, res) => {
  if (!NICE_SIMULATION) {
    return res.status(404).send('Not Found');
  }

  const { requestNo, name, birthDate, phone, gender } = req.body;

  if (!requestNo || !niceRequestStore.has(requestNo)) {
    return res.status(400).send('유효하지 않은 요청입니다.');
  }

  if (!name || !birthDate || !phone) {
    return res.status(400).send('모든 필드를 입력해주세요.');
  }

  // 만 19세 확인
  const age = calculateAge(birthDate);
  const isAdult = age >= 19;

  // 가짜 CI/DI 생성
  const ci = crypto.createHash('sha256').update(`CI_${name}_${birthDate}_${phone}`).digest('hex');
  const di = crypto.createHash('sha256').update(`DI_${name}_${birthDate}_${phone}_rubyround`).digest('hex');

  // 결과 토큰 생성
  const resultToken = crypto.randomUUID();
  niceResultStore.set(resultToken, {
    name,
    birthDate,
    phone,
    gender: gender || 'M',
    ci,
    di,
    isAdult,
    age,
    verifiedAt: new Date().toISOString(),
  });

  // 5분 후 자동 삭제
  setTimeout(() => niceResultStore.delete(resultToken), 5 * 60 * 1000);

  // 요청 데이터 정리
  niceRequestStore.delete(requestNo);

  // 프론트 콜백 페이지로 리다이렉트
  const origin = req.headers.referer ? new URL(req.headers.referer).origin : '';
  res.redirect(`${origin}/auth/nice/callback?token=${resultToken}`);
});

// POST /api/auth/nice/callback - NICE 실제 인증 결과 수신
app.post('/api/auth/nice/callback', (req, res) => {
  try {
    const { enc_data, token_version_id, integrity_value } = req.body;

    if (!enc_data) {
      return res.status(400).send('인증 데이터가 없습니다.');
    }

    // requestNo로 저장된 키 찾기
    let foundEntry = null;
    let foundRequestNo = null;
    for (const [reqNo, entry] of niceRequestStore.entries()) {
      if (entry.tokenVersionId === token_version_id) {
        foundEntry = entry;
        foundRequestNo = reqNo;
        break;
      }
    }

    if (!foundEntry) {
      return res.status(400).send('유효하지 않은 인증 요청입니다.');
    }

    const { key, iv, hmacKey } = foundEntry;

    // 무결성 검증
    const computedIntegrity = crypto.createHmac('sha256', hmacKey).update(enc_data).digest('base64');
    if (computedIntegrity !== integrity_value) {
      return res.status(400).send('데이터 무결성 검증에 실패했습니다.');
    }

    // AES 복호화
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(enc_data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    const resultData = JSON.parse(decrypted);

    // 결과 추출
    const name = resultData.utf8_name || resultData.name || '';
    const birthDate = resultData.birthdate ?
      `${resultData.birthdate.substring(0, 4)}-${resultData.birthdate.substring(4, 6)}-${resultData.birthdate.substring(6, 8)}` :
      '';
    const gender = resultData.gender === '1' ? 'M' : 'F';
    const ci = resultData.ci || '';
    const di = resultData.di || '';
    const phone = resultData.mobileno || '';

    const age = calculateAge(birthDate);
    const isAdult = age >= 19;

    // 결과 토큰 생성
    const resultToken = crypto.randomUUID();
    niceResultStore.set(resultToken, {
      name,
      birthDate,
      phone,
      gender,
      ci,
      di,
      isAdult,
      age,
      verifiedAt: new Date().toISOString(),
    });

    setTimeout(() => niceResultStore.delete(resultToken), 5 * 60 * 1000);
    niceRequestStore.delete(foundRequestNo);

    // 프론트 콜백 페이지로 리다이렉트
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : '');
    res.send(`<!DOCTYPE html><html><body><script>
      window.location.href = '${origin}/auth/nice/callback?token=${resultToken}';
    </script></body></html>`);
  } catch (error) {
    console.error('NICE 콜백 처리 오류:', error);
    res.status(500).send('인증 결과 처리 중 오류가 발생했습니다.');
  }
});

// GET /api/auth/nice/result/:token - 인증 결과 조회
app.get('/api/auth/nice/result/:token', (req, res) => {
  const { token } = req.params;

  if (!token || !niceResultStore.has(token)) {
    return res.status(404).json({ success: false, error: '인증 결과를 찾을 수 없거나 만료되었습니다.' });
  }

  const result = niceResultStore.get(token);

  // 1회 조회 후 삭제 (보안)
  niceResultStore.delete(token);

  res.json({
    success: true,
    data: {
      name: result.name,
      maskedName: maskName(result.name),
      birthDate: result.birthDate,
      maskedBirthDate: maskBirthDate(result.birthDate),
      gender: result.gender,
      ci: result.ci,
      di: result.di,
      isAdult: result.isAdult,
      age: result.age,
      verifiedAt: result.verifiedAt,
    },
  });
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Ruby Round Payment Server running on port ${PORT}`);
});
