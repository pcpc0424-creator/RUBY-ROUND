# Ruby Round 프로젝트 작업 기록

## 2026-02-13: NICE 본인인증 API 설정

### 변경 내용
- NICE 본인인증 API를 시뮬레이션 모드에서 **실제 운영 모드**로 전환
- SMS소지확인(휴대폰 인증) 방식으로 성인인증 활성화

### 설정 값 (server/.env, .env)
```
NICE_CLIENT_ID=NI35e0edfb-2e05-488d-bf3a-09d8417594c4
NICE_CLIENT_SECRET=MWU4ZTA3YWEtZDEyNi00ZThmLTg5YjMtODFmNjMxOWFjMTRiQ0YwOENDOTUyNzg3OEExRUU0OEJFMkMy
NICE_PRODUCT_ID=2101875014
NICE_SIMULATION=false
```

### 참고 사항
- Product ID `2101875014`는 SMS소지확인 상품코드
- PASS인증서(2101048020)는 미승인 상태이나, SMS소지확인은 NICE 고객센터 확인 결과 사용 가능
- NICE API 관리 페이지: https://niceapi.co.kr
- 허용 IP: 115.68.223.124
