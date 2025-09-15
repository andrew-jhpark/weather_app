# 요구사항 명세서
# 🌦️ 지역 기반 날씨 웹앱 — 핵심 기능 명세서 (shadcn/ui + Tailwind)

본 문서는 **지역 선택 기반 날씨 서비스**의 구현을 위한 핵심 스펙입니다.
프런트엔드는 **Next.js(React)** 기반, UI는 **shadcn/ui + Tailwind CSS**를 사용합니다.

---

## 1) 핵심 사용자 시나리오 (Happy Path)

1. 최초 접속 시 브라우저 권한 허용 → **현 위치 날씨** 자동 표시.
2. 상단 검색창에 지역 입력 → 자동완성 목록에서 선택 → **선택 지역의 현재/시간별/주간 예보** 표시.
3. 최근 검색/즐겨찾기에서 빠른 전환.
4. 단위(°C/°F), 테마(라이트/다크) 등 환경설정 유지(LocalStorage).

---

## 2) 주요 기능 요구사항

### A. 지역 검색/선택

* 도시/행정구역/국가명 **자동완성(Command + Input)**.
* 최근 검색 5개 저장, **즐겨찾기(핀/언핀)**.
* 한국어/영문 동시 검색 키워드 대응(예: “서울/Seoul”).

### B. 날씨 데이터 표시

* **현재 날씨 카드**: 기온, 상태 아이콘, 체감온도, 습도, 바람, 강수확률/강수량, 자외선(UVI), 일출·일몰.
* **시간별 예보(24\~48h)**: 시간대, 기온, 아이콘, 강수확률 — 스크롤 가능한 차트/리스트.
* **주간 예보(7일)**: 요일, 최고/최저, 상태 아이콘, 간단 설명.
* **경보(Alert)** 표시: 폭염/호우 등 존재 시 상단 배너.

### C. 위치 기반

* **Geolocation API**로 좌표 획득, 반경 내 **역지오코딩**으로 행정명 표시.
* 권한 거부 시: 검색 중심 UX + 안내 토스트.

### D. 환경설정

* 단위(°C/°F), 풍속(m/s, km/h), 압력(hPa), 테마(다크/라이트), 언어(ko/en).
* **LocalStorage** 키: `wa:lastLocation`, `wa:favorites`, `wa:prefs`.

### E. 오류/로딩/빈 상태

* 로딩: **Skeleton** 컴포넌트.
* 오류: 네트워크/쿼터/위치 거부/지역 없음 → **Alert/Toast**로 액션 가이드(다시 시도, 다른 지역 검색).
* 빈 상태: “지역을 검색하세요” 안내 화면.

---

## 3) 화면/컴포넌트 구조 (shadcn/ui)

* **Header**

  * `Command`(검색/자동완성), `Button`(현 위치), `ModeToggle`(다크/라이트), 단위 스위치(`Switch`), 언어 드롭다운(`DropdownMenu`)
* **Main**

  * `Card` 현재 날씨
  * 탭(`Tabs`): `시간별`, `주간`

    * 시간별: 리스트 or 차트(선택) + 가로 스크롤
    * 주간: `Grid` 카드 7개
  * 경보 배너: `Alert`
* **Footer**

  * 데이터 출처, 버전, 피드백 링크
* 공통: `Skeleton`, `Separator`, `Toast`, `Dialog`(권한/에러), `Badge`(경보/상태)

---

## 4) 정보 구조 & 라우팅(Next.js App Router)

* `/` : 기본 대시보드(마지막 지역 또는 현 위치)
* `/city/[slug]?lat=&lon=` : 특정 지역 뷰(직접 공유 가능)
* `/settings` : 환경설정(선택 사항)
* **메타데이터**: OG 이미지, PWA(선택), i18n 메타태그

---

## 5) 데이터 소스 & API 계약(예시)

> 실제 공급자는 **OpenWeather, Tomorrow\.io, KMA 등** 중 선택. 아래는 인터페이스 예시입니다.

### 5.1 지오코딩(검색/자동완성)

* `GET /api/geocode?q={query}&lang={ko|en}&limit=10`
* **Response**

  ```json
  [
    { "name": "Seoul", "state": "Seoul", "country": "KR", "lat": 37.5665, "lon": 126.9780, "id": "kr-seoul" }
  ]
  ```

### 5.2 현재/예보 번들

* `GET /api/weather?lat={lat}&lon={lon}&units={metric|imperial}&lang={ko|en}`
* **Response**

  ```json
  {
    "current": { "dt": 1694313600, "temp": 26.3, "feels_like": 27.1, "humidity": 64,
      "wind_speed": 3.2, "uvi": 5.4, "sunrise": 1694292000, "sunset": 1694337600,
      "weather": { "main": "Clouds", "description": "구름 많음", "icon": "04d" },
      "pop": 0.2, "rain_1h": 0.0
    },
    "hourly": [
      { "dt": 1694317200, "temp": 26.1, "pop": 0.15, "weather": {"icon": "04d"} }
    ],
    "daily": [
      { "dt": 1694356800, "temp": {"min": 22.1, "max": 28.7}, "pop": 0.3,
        "weather": {"icon": "10d", "description": "가끔 비"}
      }
    ],
    "alerts": [
      { "sender": "KMA", "event": "호우주의보", "start": 1694310000, "end": 1694331600, "description": "…" }
    ]
  }
  ```

> 백엔드는 위 프록시 API를 외부 공급자에 매핑. **API 키는 서버만 보관**, 클라이언트에는 노출 금지.

---

## 6) 상태관리 & 캐싱

* **SWR 또는 React Query**: `key` = `[lat, lon, units, lang]`.
* **Stale-While-Revalidate**: 최초 즉시 표시 + 배경 갱신.
* **Next.js Route Handler/Edge** 캐시: `/api/*` 5~~10분 TTL(현재/시간별), 30~~60분 TTL(주간).
* 최근 조회 지역 5개 **LocalStorage** 캐시.
* 오프라인: 마지막 성공 응답 graceful fallback.

---

## 7) 성능 & 접근성

* **성능 목표**: LCP < 2.5s(4G), TTI < 3s, CLS < 0.1.
* 아이콘 스프라이트화 또는 CDN, 이미지 lazy-load.
* 접근성: 키보드 내비게이션, `aria-*`, 대비비 4.5:1, 모션 감소 옵션(사용자 설정 준수).
* 다크/라이트 테마 시스템 선호도 반영(`prefers-color-scheme`).

---

## 8) 국제화(i18n) & 지역화

* 기본 `ko-KR`, 보조 `en-US`.
* 날짜/시간: `date-fns-tz`로 **사용자 타임존(Asia/Seoul)** 처리.
* 숫자/단위 포맷: `Intl.NumberFormat`.
* 텍스트 리소스 JSON 분리(`/locales/ko.json`, `/locales/en.json`).

---

## 9) 에러 처리 정책

* **유형**: 권한 거부(403), 위치 미확인(422), 데이터 없음(204), 외부 API 에러(5xx), 쿼터 초과(429).
* **표시**: `Alert` + 재시도 버튼, 대체 동작(수동 검색), 로그 수집(Sentry).

---

## 10) 보안 & 개인정보

* 전 구간 **HTTPS**.
* API 키 서버 보관(.env), 클라이언트 전달 금지.
* 위치/환경설정은 **브라우저 로컬 저장**만 사용, 서버 저장 없음.
* 쿠키 사용 시 `SameSite=Lax`, 민감정보 저장 금지.

---

## 11) 테스트 & 릴리스 체크리스트

* 유닛: 포맷터/단위 변환/언어 스위치.
* 통합: `/api/geocode`, `/api/weather` 행복/에러 케이스.
* 시각 테스트: 라이트/다크, 모바일(≤640px)/데스크탑(≥1024px).
* 접근성: 키보드/스크린리더.
* 성능: Lighthouse, WebPageTest.
* 모니터링: 콘솔 에러 0, 네트워크 실패 재시도 동작 확인.

---

## 12) 수용 기준(예시)

* [ ] 권한 허용 시 3초 이내 **현재 날씨** 표시.
* [ ] 검색어 2자 이상 입력 시 200ms 내 자동완성 목록 노출.
* [ ] 시간별 24개, 주간 7개의 카드가 올바른 단위/언어로 표시.
* [ ] 단위/테마 변경 시 100ms 내 UI 반영, 새로고침 후에도 유지.
* [ ] 외부 API 실패 시 안내 + 재시도 버튼 제공.

---

## 13) 컴포넌트/모듈 명세(간단)

* `components/SearchCommand` — Command + Input + ResultItem
* `components/WeatherCard` — 현재 날씨
* `components/HourlyList` — 시간별 리스트(스크롤)
* `components/DailyGrid` — 7일 그리드
* `components/AlertBanner` — 기상 특보
* `components/UnitToggle`, `components/ModeToggle`
* `lib/geocode.ts`, `lib/weather.ts` — API 클라이언트
* `lib/format.ts` — 단위/날짜/아이콘 매핑
* `store/prefs.ts` — 단위/언어/테마 상태(로컬 퍼시스트)

---

## 14) Tailwind/shadcn 가이드

* **레이아웃**: `container mx-auto px-4 sm:px-6 lg:px-8`
* **그리드**: 주간 `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3`
* **타이포**: 현재 기온 `text-5xl font-semibold`, 보조 `text-sm text-muted-foreground`
* **상태색**: 토스트/알림은 shadcn 프리셋 사용, 커스텀 색 최소화
* **아이콘**: 날씨 아이콘은 공급자 CDN or 내부 매핑(SVG)

---

### 개발 메모

* 차트 라이브러리는 필수 아님(리스트 우선), 성능 여유 시 추가.
* 배포 전 프록시 API의 **쿼터/캐시 정책** 확정.
* PWA(오프라인/홈 추가)는 2차 스프린트 고려.

---

## 15) 개발 구현 단계

### 1단계: 프로젝트 기반 설정
- **환경 구성**
  - Shadcn UI 설치 및 구성
  - Tailwind CSS 테마 설정 (다크/라이트 모드)
  - 기본 레이아웃 구성 (Header, Main, Footer)
  - API 키 관리를 위한 환경 변수 설정

- **데이터 모델 정의**
  - 지역 정보 타입 정의
  - 날씨 데이터 인터페이스 정의 (현재, 시간별, 주간)

### 2단계: API 통합 및 서버 구성
- **서버 API 핸들러 구현**
  - `/api/geocode` 엔드포인트 구현 (지역 검색/자동완성)
  - `/api/weather` 엔드포인트 구현 (날씨 데이터)

- **외부 API 연동**
  - OpenWeatherMap API 클라이언트 구현 
  - API 응답 변환 및 캐싱 전략 구현

### 3단계: 핵심 기능 구현
- **위치 기반 기능**
  - Geolocation API 통합
  - 현재 위치 날씨 표시

- **지역 검색 기능**
  - 검색 Command 컴포넌트 구현
  - 자동완성 기능
  - 최근 검색 및 즐겨찾기 기능 (LocalStorage)

- **날씨 데이터 표시**
  - 현재 날씨 카드 컴포넌트
  - 시간별 예보 리스트/차트
  - 주간 예보 그리드
  - 기상 경보 배너

### 4단계: 환경설정 및 사용자 경험
- **사용자 환경설정**
  - 단위 전환 (°C/°F, m/s, km/h 등)
  - 테마 전환 (다크/라이트)
  - 언어 전환 (ko/en)

- **상태 관리 및 퍼시스턴스**
  - SWR/React Query 통합
  - LocalStorage 저장소 구현

- **반응형 디자인**
  - 모바일/태블릿/데스크탑 최적화

### 5단계: 강화된 사용자 경험
- **로딩 상태 관리**
  - Skeleton 로딩 컴포넌트
  - 상태별 UI (로딩/에러/빈 상태)

- **에러 처리**
  - 권한 거부/네트워크 오류/API 한도 초과 등 처리
  - 오류 안내 및 복구 UI

- **국제화(i18n)**
  - 다국어 지원 (한국어/영어)
  - 날짜/시간/단위 지역화

### 6단계: 최적화 및 테스트
- **성능 최적화**
  - 이미지/아이콘 최적화
  - 번들 크기 최적화
  - 코드 스플리팅

- **접근성 개선**
  - 키보드 내비게이션
  - ARIA 속성 추가
  - 색상 대비 최적화

- **테스트 및 디버깅**
  - 단위 테스트
  - 통합 테스트
  - 크로스 브라우저/디바이스 테스트

### 7단계: 배포 준비
- **보안 검토**
  - API 키 보호
  - HTTPS 설정

- **최종 성능 검사**
  - Lighthouse 검사
  - Core Web Vitals 최적화

- **배포 및 모니터링**
  - 배포 파이프라인 구성
  - 로깅 및 에러 모니터링 설정

