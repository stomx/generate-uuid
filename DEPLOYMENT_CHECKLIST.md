# 배포 체크리스트

UUID Generator 프로덕션 배포를 위한 단계별 체크리스트

**생성일**: 2026-01-18
**대상 플랫폼**: Cloudflare Pages
**도메인**: uuid.stomx.net

---

## ✅ 배포 전 검증 (Pre-Deployment)

### 자동 검증
- [ ] 배포 전 검증 스킬 실행
  ```bash
  # Claude Code에서 실행
  "배포 전 검증"

  # 또는 수동 실행
  npm run test:run && npm run test:e2e && npm run build && ./scripts/verify-build.sh
  ```

### 수동 확인
- [ ] **테스트 통과**
  - [ ] 305 유닛 테스트 통과
  - [ ] 86 E2E 테스트 통과 (chromium)
  - [ ] 빌드 검증 53개 체크 통과

- [ ] **Git 상태**
  - [ ] 모든 변경사항 커밋됨
  - [ ] 원격 저장소에 푸시됨 (14 commits)
  - [ ] Working tree clean

- [ ] **빌드 산출물**
  - [ ] `/out` 디렉토리 생성됨
  - [ ] 14개 페이지 생성 확인 (7 영어 + 7 한국어)
  - [ ] 정적 에셋 존재 (sitemap.xml, robots.txt, favicon, icons, og-image)

---

## 🚀 Cloudflare Pages 설정 (First-Time Setup)

**참고 문서**: `docs/CLOUDFLARE_PAGES.md`

### 1. Cloudflare 계정 및 프로젝트 생성
- [ ] Cloudflare 계정 로그인 (https://dash.cloudflare.com)
- [ ] **Pages** 메뉴 선택
- [ ] **Create a project** 클릭
- [ ] **Connect to Git** 선택

### 2. GitHub 저장소 연결
- [ ] GitHub 권한 승인
- [ ] `generate-uuid` 저장소 선택
- [ ] Production 브랜치 선택: `main`

### 3. 빌드 설정
```
Framework preset: Next.js (Static HTML Export)
Build command: npm run build
Build output directory: /out
Root directory: /
Node version: 22
```

- [ ] Build command 설정: `npm run build`
- [ ] Build output directory: `/out`
- [ ] Environment variables 추가:
  - [ ] `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-4723857054709306`
  - [ ] `NODE_VERSION` = `22`

### 4. 첫 배포 실행
- [ ] **Save and Deploy** 클릭
- [ ] 빌드 로그 확인 (약 1-2분 소요)
- [ ] 배포 성공 확인
- [ ] `*.pages.dev` URL 접속 테스트

---

## 🌐 커스텀 도메인 설정

### 1. Cloudflare DNS 설정
- [ ] Pages 프로젝트 > **Custom domains** 탭
- [ ] **Set up a custom domain** 클릭
- [ ] 도메인 입력: `uuid.stomx.net`
- [ ] **Activate domain** 클릭
- [ ] DNS 레코드 자동 생성 확인 (CNAME)

### 2. SSL/HTTPS 확인
- [ ] SSL 인증서 자동 발급 확인 (약 5-10분)
- [ ] HTTPS 접속 테스트: `https://uuid.stomx.net`
- [ ] HTTP → HTTPS 자동 리다이렉트 확인

---

## 🔍 배포 후 검증 (Post-Deployment)

### 영어 페이지 테스트
- [ ] https://uuid.stomx.net/ → `/generate/v7` 리다이렉트
- [ ] https://uuid.stomx.net/generate/v7 로딩
- [ ] https://uuid.stomx.net/generate/v4 로딩
- [ ] https://uuid.stomx.net/generate/v1 로딩
- [ ] https://uuid.stomx.net/validate 로딩
- [ ] https://uuid.stomx.net/parse 로딩
- [ ] 404 페이지 테스트: https://uuid.stomx.net/invalid-path

### 한국어 페이지 테스트
- [ ] https://uuid.stomx.net/ko → `/ko/generate/v7` 리다이렉트
- [ ] https://uuid.stomx.net/ko/generate/v7 로딩
- [ ] https://uuid.stomx.net/ko/generate/v4 로딩
- [ ] https://uuid.stomx.net/ko/generate/v1 로딩
- [ ] https://uuid.stomx.net/ko/validate 로딩
- [ ] https://uuid.stomx.net/ko/parse 로딩
- [ ] 404 페이지 테스트: https://uuid.stomx.net/ko/invalid-path

### 언어 전환 기능
- [ ] 영어 페이지에서 KO 버튼 클릭 → 한국어 페이지로 전환
- [ ] 한국어 페이지에서 EN 버튼 클릭 → 영어 페이지로 전환
- [ ] 경로 유지 확인 (예: `/validate` ↔ `/ko/validate`)

### 정적 에셋
- [ ] https://uuid.stomx.net/sitemap.xml 접속
- [ ] https://uuid.stomx.net/robots.txt 접속
- [ ] https://uuid.stomx.net/favicon.ico 접속
- [ ] https://uuid.stomx.net/og-image.jpg 접속

### 기능 테스트
- [ ] UUID v7 생성 동작
- [ ] UUID v4 생성 동작
- [ ] UUID v1 생성 동작
- [ ] UUID 검증 기능 동작
- [ ] UUID 파싱 기능 동작
- [ ] 복사 버튼 동작
- [ ] 히스토리 기능 동작
- [ ] 테마 토글 동작

### SEO 메타데이터 확인
- [ ] 브라우저 개발자 도구로 HTML 소스 확인
- [ ] 영어 페이지 `<html lang="en">` 확인
- [ ] 한국어 페이지 `<html lang="ko">` 확인
- [ ] 영어 404 페이지 `<html lang="en">` 확인
- [ ] 한국어 404 페이지 `<html lang="ko">` 확인
- [ ] Canonical URL 자기 참조 확인
- [ ] Hreflang 태그 존재 확인 (en, ko, x-default)
- [ ] OG 메타 태그 확인 (og:locale, og:image, etc.)

---

## 📊 Google Search Console 설정

**참고 문서**: `docs/GSC_CHECKLIST.md`

### 1. 속성 추가 및 소유권 확인
- [ ] Google Search Console 접속 (https://search.google.com/search-console)
- [ ] 속성 추가: `uuid.stomx.net` (도메인 속성 권장)
- [ ] HTML 메타 태그로 소유권 확인
  - 이미 설정됨: `google: 'EJZJslnlASZmjLWp3JfieXPgbM1zlKRsguaJGn4XHPM'`
- [ ] 속성 확인 완료

### 2. Sitemap 제출
- [ ] "Sitemaps" 메뉴 선택
- [ ] 새 사이트맵 추가: `https://uuid.stomx.net/sitemap.xml`
- [ ] 제출 완료
- [ ] 상태 확인: "성공" (발견된 URL: 14개)

### 3. URL 검사
영어 페이지 검사:
- [ ] `/generate/v7/` URL 검사
- [ ] 색인 생성 요청
- [ ] HTML lang="en" 확인
- [ ] Hreflang 태그 확인

한국어 페이지 검사:
- [ ] `/ko/generate/v7/` URL 검사
- [ ] 색인 생성 요청
- [ ] HTML lang="ko" 확인
- [ ] Hreflang 태그 확인

### 4. International Targeting
- [ ] "레거시 도구 및 보고서" > "국제 타겟팅" 확인
- [ ] Hreflang 오류 0개 확인
- [ ] 경고 확인 및 해결

---

## 📈 Analytics 설정

### Google Analytics 4
- [ ] 프로덕션 사이트에서 GA4 로딩 확인
  - Tag ID: `G-R1Y8SQSKY0`
- [ ] 실시간 보고서에서 페이지뷰 확인
- [ ] 이벤트 수집 확인

### Google Tag Manager
- [ ] GTM 컨테이너 로딩 확인
  - Container ID: `GTM-WWD73RTG`
- [ ] 미리보기 모드로 태그 실행 확인

### Microsoft Clarity
- [ ] Clarity 스크립트 로딩 확인
  - Project ID: `v27j4cca2q`
- [ ] 세션 녹화 시작 확인

### Google AdSense (선택사항)
- [ ] AdSense 스크립트 로딩 확인
  - Client ID: `ca-pub-4723857054709306`
- [ ] 광고 단위 표시 확인 (승인된 경우)

---

## 🎨 성능 및 품질 확인

### Lighthouse 감사
- [ ] Desktop Lighthouse 실행
  - [ ] Performance: >90
  - [ ] Accessibility: >90
  - [ ] Best Practices: >90
  - [ ] SEO: 100

- [ ] Mobile Lighthouse 실행
  - [ ] Performance: >80
  - [ ] Accessibility: >90
  - [ ] Best Practices: >90
  - [ ] SEO: 100

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint): <2.5초
- [ ] FID (First Input Delay): <100ms
- [ ] CLS (Cumulative Layout Shift): <0.1

### 브라우저 호환성 테스트
- [ ] Chrome (Desktop/Mobile)
- [ ] Safari (Desktop/Mobile)
- [ ] Firefox (Desktop)
- [ ] Edge (Desktop)

---

## 🔒 보안 확인

### HTTPS/SSL
- [ ] SSL 인증서 유효
- [ ] HTTPS 강제 적용
- [ ] Mixed content 경고 없음

### 보안 헤더 (선택사항)
`public/_headers` 파일로 추가 가능:
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy 설정

---

## 📝 배포 완료 후 작업

### 문서 업데이트
- [ ] README.md에 프로덕션 URL 업데이트
- [ ] CHANGELOG.md 작성 (선택사항)
- [ ] 배포 날짜 및 버전 기록

### 모니터링 설정
- [ ] UptimeRobot 또는 Pingdom 설정 (선택사항)
- [ ] Error tracking (Sentry) 설정 (선택사항)
- [ ] Cloudflare Analytics 확인

### GitHub 정리
- [ ] PR 생성 (claude/analyze-project-diagnosis-t4bGv → main)
- [ ] PR 설명 작성 (변경사항 요약)
- [ ] PR 머지
- [ ] 배포 브랜치 삭제 (선택사항)

### 커뮤니케이션
- [ ] 팀원에게 배포 완료 알림 (해당하는 경우)
- [ ] 사용자에게 공지 (해당하는 경우)
- [ ] SNS 공유 (선택사항)

---

## 🐛 트러블슈팅

### 빌드 실패 시
1. Cloudflare Pages 빌드 로그 확인
2. 로컬에서 `npm run build` 재실행
3. Node.js 버전 확인 (v22.x 필요)
4. 환경 변수 설정 확인

### 페이지 404 에러
1. Build output directory가 `/out`인지 확인
2. `out/` 디렉토리에 파일 생성 확인
3. `next.config.mjs`의 `output: 'export'` 설정 확인

### Analytics 작동 안 함
1. 개발자 도구 > Network 탭에서 스크립트 로딩 확인
2. Ad blocker 비활성화 후 재테스트
3. localhost에서는 비활성화되는지 확인 (AnalyticsScripts.tsx)

### Sitemap 인식 안 됨
1. `https://uuid.stomx.net/sitemap.xml` 직접 접속 확인
2. XML 형식 오류 확인
3. GSC에서 사이트맵 재제출

---

## 📋 체크리스트 요약

**필수 항목** (반드시 완료):
- ✅ 배포 전 검증 통과
- ✅ Cloudflare Pages 배포 성공
- ✅ 커스텀 도메인 연결
- ✅ 모든 페이지 로딩 확인
- ✅ SEO 메타데이터 확인
- ✅ Google Search Console 설정

**권장 항목** (가능한 완료):
- ⭐ Lighthouse 점수 확인
- ⭐ Analytics 데이터 수집 확인
- ⭐ GitHub PR 생성 및 머지

**선택 항목** (필요시 완료):
- 🔹 보안 헤더 추가
- 🔹 업타임 모니터링 설정
- 🔹 Error tracking 설정

---

## 📅 배포 기록

| 날짜 | 버전 | 배포자 | 주요 변경사항 | 상태 |
|------|------|--------|--------------|------|
| 2026-01-18 | v1.0.0 | - | 다국어 SEO 구현 완료 | 준비 완료 |
|  |  |  |  |  |

---

## 🎉 완료!

모든 체크리스트 항목을 완료하면 UUID Generator가 프로덕션에서 안정적으로 운영됩니다.

**다음 단계**:
1. 정기적인 Google Search Console 확인 (주 1회)
2. Analytics 데이터 분석 (월 1회)
3. Core Web Vitals 모니터링
4. 사용자 피드백 수집

**문서 참고**:
- `docs/CLOUDFLARE_PAGES.md` - 상세 배포 가이드
- `docs/GSC_CHECKLIST.md` - SEO 검증 체크리스트
- `CLAUDE.md` - 프로젝트 전체 가이드
