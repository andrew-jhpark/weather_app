# 🚀 배포 가이드

이 문서는 날씨 앱의 프로덕션 배포를 위한 가이드입니다.

## 📋 배포 전 체크리스트

### 1. 환경 변수 설정
배포 전 다음 환경 변수가 설정되어 있는지 확인하세요:

```bash
# 필수 환경 변수
OPENWEATHERMAP_API_KEY=your_openweather_api_key_here

# 선택적 환경 변수 (프로덕션 권장)
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
```

### 2. 배포 전 검증
```bash
# 전체 배포 검증 (린트, 테스트, 빌드)
npm run deploy:check

# 개별 검증
npm run lint          # 코드 스타일 검사
npm run test:run      # 단위 테스트 실행
npm run build:prod    # 프로덕션 빌드
```

### 3. 성능 감사
```bash
# 개발 서버 실행 후 성능 감사
npm run dev
npm run perf:audit    # Lighthouse 감사 실행
```

## 🌐 배포 플랫폼별 가이드

### Vercel 배포
1. Vercel 계정 연결
2. 환경 변수 설정
3. 자동 배포 설정

```bash
# Vercel CLI 사용
npm i -g vercel
vercel --prod
```

### Netlify 배포
1. `netlify.toml` 설정 (필요시)
2. 환경 변수 설정
3. 빌드 명령어: `npm run build`

### Docker 배포
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 프로덕션 최적화

### 1. 성능 최적화
- ✅ 이미지 최적화 (WebP/AVIF)
- ✅ 번들 크기 최적화
- ✅ API 응답 캐싱
- ✅ 정적 자원 압축

### 2. 보안 설정
- ✅ CSP (Content Security Policy)
- ✅ 보안 헤더 설정
- ✅ API 키 보호
- ✅ 입력 검증

### 3. 모니터링
- ✅ 에러 추적
- ✅ 성능 모니터링
- ✅ 로그 시스템

## 📊 성능 기준

### Core Web Vitals 목표
- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Lighthouse 점수 목표
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90
- **PWA**: ≥ 80

## 🔍 배포 후 검증

### 1. 기능 테스트
- [ ] 위치 기반 날씨 조회
- [ ] 도시 검색 기능
- [ ] 단위 변환 (°C/°F)
- [ ] 다크/라이트 테마
- [ ] 언어 전환 (한/영)
- [ ] 반응형 디자인

### 2. 성능 테스트
```bash
# 프로덕션 빌드 후 성능 테스트
npm run build
npm run start
npm run lighthouse
```

### 3. 접근성 테스트
- [ ] 키보드 내비게이션
- [ ] 스크린 리더 호환성
- [ ] 색상 대비 확인
- [ ] ARIA 레이블 검증

## 🚨 트러블슈팅

### 빌드 실패
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 타입 에러 확인
npm run type-check
```

### 성능 이슈
```bash
# 번들 분석
npm run analyze

# 성능 프로파일링
npm run perf:audit
```

### API 연결 문제
1. 환경 변수 확인
2. API 키 유효성 검증
3. CORS 설정 확인
4. 네트워크 연결 상태 확인

## 📈 지속적 개선

### 모니터링 도구 연동
- **에러 추적**: Sentry, Bugsnag
- **성능 모니터링**: New Relic, DataDog
- **사용자 분석**: Google Analytics, Mixpanel

### 정기 점검
- [ ] 월간 성능 감사
- [ ] 보안 업데이트 확인
- [ ] 의존성 업데이트
- [ ] 사용자 피드백 반영

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 로그 파일 검토
2. 환경 변수 설정 확인
3. API 응답 상태 확인
4. 브라우저 개발자 도구 확인

추가 지원이 필요한 경우 개발팀에 문의하세요.


