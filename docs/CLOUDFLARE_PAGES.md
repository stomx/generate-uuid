# Cloudflare Pages Setup

UUID Generator 프로젝트를 Cloudflare Pages에 배포하는 가이드입니다.

## 왜 Cloudflare Pages인가?

- **무료 플랜**: 무제한 요청, 무제한 대역폭
- **빠른 성능**: 전 세계 Cloudflare CDN 엣지 네트워크
- **자동 배포**: Git push 시 자동 빌드 및 배포
- **프리뷰 배포**: PR마다 고유한 프리뷰 URL 생성
- **DDoS 보호**: Cloudflare의 기본 보안 기능
- **Analytics**: 기본 제공 웹 분석

## 사전 준비

1. Cloudflare 계정 생성 (https://dash.cloudflare.com/sign-up)
2. GitHub 저장소에 push 권한
3. 도메인 (선택사항, Cloudflare DNS 권장)

## 1. Cloudflare Pages 프로젝트 생성

### 1.1 GitHub 연동

1. Cloudflare Dashboard > **Pages** 메뉴 선택
2. **Create a project** 버튼 클릭
3. **Connect to Git** 선택
4. **GitHub** 선택 및 권한 승인
5. 저장소 선택: `generate-uuid` (또는 실제 저장소 이름)

### 1.2 빌드 설정

**Framework preset**: Next.js (Static HTML Export)

**Build settings**:
```
Build command: npm run build
Build output directory: /out
Root directory: /
```

**Environment variables** (선택사항):
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4723857054709306
NODE_VERSION=22
```

**Branch**: `main` (또는 프로덕션 브랜치)

### 1.3 배포

1. **Save and Deploy** 버튼 클릭
2. 첫 배포 시작 (약 1-2분 소요)
3. 배포 완료 후 `*.pages.dev` URL 확인

## 2. 커스텀 도메인 설정

### 2.1 Cloudflare DNS 사용 (권장)

도메인이 이미 Cloudflare에서 관리되는 경우:

1. Pages 프로젝트 > **Custom domains** 탭
2. **Set up a custom domain** 클릭
3. 도메인 입력: `uuid.stomx.net`
4. **Activate domain** 클릭
5. DNS 레코드 자동 생성 (CNAME)

### 2.2 외부 DNS 사용

다른 DNS 제공업체를 사용하는 경우:

1. CNAME 레코드 추가:
   ```
   Name: uuid (또는 @)
   Type: CNAME
   Value: <your-project>.pages.dev
   ```
2. Cloudflare Pages에서 도메인 활성화
3. DNS 전파 대기 (최대 24시간)

### 2.3 HTTPS/SSL

- Cloudflare Pages는 자동으로 SSL 인증서 발급
- HTTP → HTTPS 자동 리다이렉트
- HSTS 헤더 자동 설정

## 3. 배포 최적화

### 3.1 자동 배포 설정

**Production 브랜치**:
- `main` 브랜치 push 시 프로덕션 자동 배포

**Preview 배포**:
- PR 생성 시 자동 프리뷰 배포
- 각 PR마다 고유 URL: `<commit-hash>.uuid-generator.pages.dev`
- PR 코멘트에 프리뷰 링크 자동 추가

### 3.2 빌드 캐싱

Cloudflare Pages는 기본적으로 `node_modules`를 캐싱:
- 첫 빌드: 약 60초
- 이후 빌드: 약 30초 (캐시 활용)

### 3.3 리다이렉트 설정

`public/_redirects` 파일 생성 (선택사항):
```
# HTTPS 강제 (Cloudflare가 자동 처리하므로 불필요)
# http://:splat https://:splat 301

# Trailing slash 추가 (Next.js가 처리)
# /generate/v7 /generate/v7/ 301

# 404 처리 (Next.js가 처리)
# /* /404.html 404
```

## 4. 성능 최적화

### 4.1 캐시 헤더

Cloudflare Pages 자동 설정:
- HTML: `cache-control: public, max-age=0, must-revalidate`
- 정적 에셋: `cache-control: public, max-age=31536000, immutable`

### 4.2 이미지 최적화

Cloudflare Images 통합 (선택사항):
```javascript
// next.config.mjs
export default {
  images: {
    loader: 'custom',
    loaderFile: './cloudflare-image-loader.js',
  },
};
```

### 4.3 Analytics 설정

1. Cloudflare Dashboard > **Web Analytics** 메뉴
2. **Add a site** 클릭
3. 스크립트 태그 복사
4. `app/(main)/layout.tsx`에 추가 (선택사항)

## 5. 환경 변수 관리

### 5.1 Production 환경 변수

Cloudflare Pages > **Settings** > **Environment variables**:

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4723857054709306
NODE_VERSION=22
```

### 5.2 Preview 환경 변수

Preview 배포에서는 다른 값 사용 가능:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=test-mode
```

## 6. GitHub Actions 통합 (선택사항)

Cloudflare Pages는 Git push 시 자동 배포하지만, GitHub Actions로 추가 검증 가능:

### 6.1 빌드 검증 워크플로우

`.github/workflows/verify-build.yml`:
```yaml
name: Verify Build

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Build project
        run: npm run build

      - name: Verify build output
        run: ./scripts/verify-build.sh
```

### 6.2 E2E 테스트 워크플로우

`.github/workflows/e2e-tests.yml`:
```yaml
name: E2E Tests

on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium webkit

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## 7. 배포 모니터링

### 7.1 배포 로그

Cloudflare Pages > **Deployments** 탭:
- 각 배포의 빌드 로그 확인
- 빌드 시간 및 에러 추적

### 7.2 배포 상태

- ✅ **Success**: 배포 성공
- ⚠️ **Failed**: 빌드 실패 (로그 확인)
- 🔄 **In Progress**: 빌드 진행 중
- ⏸️ **Cancelled**: 배포 취소됨

### 7.3 롤백

이전 배포로 롤백:
1. **Deployments** 탭에서 이전 배포 선택
2. **Rollback to this deployment** 클릭
3. 즉시 이전 버전으로 복구

## 8. 보안 설정

### 8.1 Access 제어 (선택사항)

특정 IP만 접근 허용:
```javascript
// functions/_middleware.js
export async function onRequest(context) {
  const allowedIPs = ['1.2.3.4'];
  const clientIP = context.request.headers.get('CF-Connecting-IP');

  if (!allowedIPs.includes(clientIP)) {
    return new Response('Forbidden', { status: 403 });
  }

  return context.next();
}
```

### 8.2 보안 헤더

`public/_headers` 파일 생성:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 9. 비용

**Free 플랜**:
- 무제한 요청
- 무제한 대역폭
- 500 빌드/월
- 1 동시 빌드

**Pro 플랜** ($20/월):
- 5,000 빌드/월
- 5 동시 빌드
- Advanced Analytics

UUID Generator는 Free 플랜으로 충분합니다.

## 10. 트러블슈팅

### 10.1 빌드 실패

**증상**: "Build failed" 메시지

**해결**:
1. 로컬에서 `npm run build` 성공 확인
2. `package.json`의 `engines` 필드 확인
3. 환경 변수 설정 확인
4. Node.js 버전 확인 (Cloudflare 기본: Node 18)

### 10.2 404 에러

**증상**: 배포 후 모든 페이지가 404

**해결**:
1. **Build output directory**가 `/out`인지 확인
2. `out/` 디렉토리에 `index.html` 존재 확인
3. `next.config.mjs`의 `output: 'export'` 설정 확인

### 10.3 리다이렉트 무한 루프

**증상**: 페이지가 무한 리다이렉트

**해결**:
1. `_redirects` 파일 규칙 확인
2. `next.config.mjs`의 `trailingSlash` 설정 확인
3. Canonical URL 확인

### 10.4 CSS/JS 로딩 실패

**증상**: 페이지가 스타일 없이 표시됨

**해결**:
1. `_next/static/` 경로 확인
2. 브라우저 콘솔에서 404 에러 확인
3. `next.config.mjs`의 `assetPrefix` 설정 확인

## 11. 마이그레이션 (GitHub Pages → Cloudflare Pages)

### 11.1 DNS 전환

1. Cloudflare Pages 배포 완료 확인
2. DNS CNAME 변경:
   ```
   Before: uuid CNAME username.github.io
   After: uuid CNAME uuid-generator.pages.dev
   ```
3. TTL을 짧게 설정 (300초)하여 빠른 전파

### 11.2 GitHub Pages 비활성화

1. GitHub 저장소 > **Settings** > **Pages**
2. **Source**: None으로 설정
3. `gh-pages` 브랜치 삭제 (선택사항)

### 11.3 GitHub Actions 비활성화

`.github/workflows/deploy.yml` 삭제 또는 비활성화

## 12. 체크리스트

배포 전 확인사항:

- [ ] 로컬에서 `npm run build` 성공
- [ ] `./scripts/verify-build.sh` 통과
- [ ] 모든 E2E 테스트 통과 (`npm run test:e2e`)
- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] `sitemap.xml`의 도메인이 프로덕션 도메인으로 설정됨
- [ ] `robots.txt`가 프로덕션 환경에 맞게 설정됨
- [ ] Google Analytics ID 확인
- [ ] AdSense ID 확인 (환경 변수)
- [ ] Canonical URL이 프로덕션 도메인으로 설정됨
- [ ] OG 이미지가 프로덕션 도메인으로 설정됨

## 13. 추가 리소스

- [Cloudflare Pages 공식 문서](https://developers.cloudflare.com/pages/)
- [Next.js Static Export 가이드](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Pages + Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Analytics](https://developers.cloudflare.com/analytics/web-analytics/)

## 14. 지원

문제 발생 시:
1. Cloudflare Community: https://community.cloudflare.com/
2. Cloudflare Support: https://dash.cloudflare.com/?to=/:account/support
3. GitHub Issues: 프로젝트 저장소 이슈 트래커
