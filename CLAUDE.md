# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UUID Generator - 온라인 UUID 생성/검증/파싱 도구 (uuid.stomx.net)
- Next.js 14 + TypeScript + Tailwind CSS
- Static Export로 GitHub Pages 배포
- RFC 9562 준수 UUID v1, v4, v7 지원
- 다국어 지원 (English, 한국어)

## Multilingual Support (i18n)

이 프로젝트는 영어(en)와 한국어(ko) 두 언어를 지원하며, SEO 최적화된 다국어 구조를 가지고 있습니다.

### 디렉토리 구조
```
app/
├── (main)/          # 영어 페이지 (기본)
│   ├── layout.tsx   # lang="en", locale="en_US"
│   ├── page.tsx     # / → /generate/v7 리다이렉트
│   ├── not-found.tsx
│   ├── generate/
│   ├── validate/
│   └── parse/
└── ko/              # 한국어 페이지
    ├── layout.tsx   # lang="ko", locale="ko_KR"
    ├── page.tsx     # /ko → /ko/generate/v7 리다이렉트
    ├── not-found.tsx
    ├── generate/
    ├── validate/
    └── parse/
```

### URL 구조
- 영어(기본): `/generate/v7`, `/validate`, `/parse`
- 한국어: `/ko/generate/v7`, `/ko/validate`, `/ko/parse`
- **Trailing slash**: 모든 URL은 `/`로 종료 (일관성)

### SEO 최적화

#### HTML lang 속성
- 영어 페이지: `<html lang="en">`
- 한국어 페이지: `<html lang="ko">`

#### Canonical URL
각 페이지는 자기 참조 canonical을 사용:
```html
<!-- 영어 -->
<link rel="canonical" href="https://uuid.stomx.net/generate/v7/" />

<!-- 한국어 -->
<link rel="canonical" href="https://uuid.stomx.net/ko/generate/v7/" />
```

#### hreflang 태그
모든 페이지에 언어별 대체 버전 표시:
```html
<link rel="alternate" hreflang="en" href="https://uuid.stomx.net/[path]/" />
<link rel="alternate" hreflang="ko" href="https://uuid.stomx.net/ko/[path]/" />
<link rel="alternate" hreflang="x-default" href="https://uuid.stomx.net/[path]/" />
```

#### Sitemap
`public/sitemap.xml`에 모든 언어 페이지 포함:
- 영어 페이지 7개
- 한국어 페이지 7개
- 총 14개 URL

### 언어 전환 기능

**LangLayoutClient 컴포넌트** (`components/common/LangLayoutClient.tsx`):
- 헤더에 언어 토글 버튼 (EN ↔ KO)
- 현재 경로 유지하며 언어만 변경
- aria-label로 접근성 확보
- `router.push()`로 클라이언트 사이드 네비게이션

```typescript
const handleLanguageToggle = () => {
  const currentPath = pathname.replace(/^\/ko/, '');
  const newPath = lang === 'ko' ? currentPath : `/ko${currentPath}`;
  router.push(newPath);
};
```

### E2E 테스트
`e2e/language-toggle.spec.ts` (10개 테스트):
- EN ↔ KO 전환 및 URL 변경 확인
- 경로 유지 검증 (parse, v1, v4 페이지)
- aria-label 접근성 확인
- 브라우저 네비게이션 (뒤로/앞으로) 언어 유지
- 루트 리다이렉트 확인 (/, /ko)
- 새로고침 후 언어 상태 유지

### 404 페이지
언어별 404 페이지로 사용자 경험 개선:
- `app/(main)/not-found.tsx` - 영어
- `app/ko/not-found.tsx` - 한국어
- Terminal Noir 테마 일관성
- 빠른 네비게이션 링크 제공

### Google Search Console
`docs/GSC_CHECKLIST.md` 참조:
- Sitemap 제출 및 색인 생성 확인
- hreflang 검증
- 언어별 트래픽 분석
- 국제 타겟팅 설정

## Commands

```bash
# Development
npm run dev          # http://localhost:3000

# Build & Deploy
npm run build        # Static export to /out
npm run deploy       # Build + gh-pages deploy (GitHub Actions 비활성화 상태)

# Test
npm run test         # Vitest watch mode
npm run test:run     # Single run (305 unit tests)
npm run test:e2e     # Playwright E2E tests (76 tests × 2 projects = 152 total)
npm run test:e2e:ui  # Playwright UI mode

# Lint
npm run lint         # ESLint
```

## Architecture

### UUID Library (`lib/uuid/`)
외부 의존성 없는 순수 구현. RFC 9562 준수.

- `v1.ts` - 타임스탬프 기반 (MAC 주소 대신 랜덤 노드)
- `v4.ts` - crypto.getRandomValues() 사용
- `v7.ts` - Unix ms 타임스탬프 + 랜덤
- `validator.ts` - UUID 형식/버전 검증
- `parser.ts` - UUID 파싱 및 타임스탬프 추출

### Component Structure
```
components/
├── ui/          # 기본 UI + shadcn/ui 컴포넌트
│   ├── Card, Button, Input (커스텀)
│   ├── Checkbox, Select (Radix UI 기반)
│   └── index.ts (barrel exports)
├── common/      # 공통 (TabNav, ThemeToggle, ErrorBoundary)
├── generator/   # UUID 생성 (VersionSelector, OptionsPanel)
├── validator/   # UUID 검증 + 히스토리
└── parser/      # UUID 파싱 + 히스토리
```

### UI Components (shadcn/ui)
이 프로젝트는 **shadcn/ui** 컴포넌트 라이브러리를 사용합니다.

**설정 파일**: `components.json`
- Radix UI 프리미티브 기반 접근성 컴포넌트
- CSS Variables로 Terminal Noir 디자인 시스템 연동

**유틸리티**: `lib/utils.ts`
```typescript
import { cn } from '@/lib/utils';
// cn() = clsx + tailwind-merge
cn('base-class', condition && 'conditional', className)
```

**주요 의존성**:
- `@radix-ui/react-checkbox` - 체크박스 프리미티브
- `@radix-ui/react-select` - 셀렉트 드롭다운
- `clsx` + `tailwind-merge` - className 조합
- `tailwindcss-animate` - 애니메이션 유틸리티

### Styling
- **CSS Variables**: `globals.css`의 `:root`에 정의된 시맨틱 컬러 토큰
- **Tailwind 확장**: `tailwind.config.ts`에서 CSS 변수 매핑 (`bg-deep`, `text-primary`, `accent-mint` 등)
- **테마**: `.dark` 클래스로 다크모드 (기본), 클래스 제거 시 라이트모드

### Path Aliases
`@/*` → 프로젝트 루트 (tsconfig.json)

## Key Patterns

### UUID 생성 함수
```typescript
import { generateUuid, generateUuids } from '@/lib/uuid';
generateUuid('v4');              // 단일 생성
generateUuids('v7', 10);         // 다중 생성
```

### 히스토리 기능
Validator와 Parser 컴포넌트에 localStorage 기반 히스토리 기능이 내장되어 있습니다.
- 최대 20개 항목 저장 (`MAX_HISTORY`)
- 복사, 삭제, 전체 삭제 지원
- `useLocalStorage` 훅으로 상태 관리

### 접근성 (Accessibility)

**ARIA 레이블**:
- 아이콘 전용 버튼에는 `aria-label` 필수 (예: `aria-label="전체 복사"`)
- Radix UI 컴포넌트 (Select 등)에도 명시적 레이블 제공

**키보드 단축키** (입력 필드 내에서는 비활성화):
| 기능 | 단축키 |
|------|--------|
| 탭 전환 | Alt/⌥ + 1, 2, 3 |
| 버전 전환 | Alt/⌥ + Q, W, E |
| UUID 생성 | Alt/⌥ + N 또는 Enter |

**스크린 리더 지원**:
- `<div role="status" aria-live="assertive">` 영역으로 상태 변경 알림

### 컴포넌트 Export
각 폴더의 `index.ts`에서 barrel export. 새 컴포넌트 추가 시 index에 등록 필요.

### 테스트 작성 시 주의사항
히스토리 기능으로 인해 동일 텍스트가 여러 곳에 표시될 수 있습니다:
```typescript
// 단일 요소 → 다중 요소 처리
screen.getAllByText('[ERROR]').length  // getByText 대신
screen.getByTestId('validation-result')  // 특정 영역 선택
```

## Development Guidelines

### 공통 규칙
- **유의미한 작업 완료 시 반드시 커밋** - 기능 추가, 버그 수정, 리팩토링 등 완료 후 즉시 커밋

### TDD (Test-Driven Development)
이 프로젝트는 TDD 방식으로 개발합니다.

1. **테스트 먼저 작성** - 기능 구현 전 테스트 케이스 작성
2. **Red → Green → Refactor** 사이클 준수
3. **테스트 위치**:
   - 유닛 테스트: `lib/**/__tests__/*.test.ts`
   - 컴포넌트 테스트: `components/**/__tests__/*.test.tsx`
   - E2E 테스트: `e2e/*.spec.ts`

### E2E 테스트 (Playwright)

**프로젝트 구성** (`playwright.config.ts`):
- `chromium`: Desktop Chrome + 클립보드 권한
- `mobile`: iPhone 14 (WebKit - 클립보드 권한 미지원)

**조건부 테스트 스킵**:
```typescript
test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
  await page.goto('/');
});
```

**테스트 파일**:
- `generator.spec.ts` - UUID 생성, 복사, 키보드 단축키
- `validator.spec.ts` - UUID 검증 및 히스토리
- `parser.spec.ts` - UUID 파싱 및 히스토리
- `routing.spec.ts` - URL 라우팅, 탭/버전 전환, 브라우저 네비게이션
- `language-toggle.spec.ts` - 언어 전환 기능 (EN ↔ KO)
- `accessibility.spec.ts` - WCAG 2.0 A/AA (@axe-core/playwright)
- `mobile.spec.ts` - 모바일 레이아웃 및 터치 인터랙션

### 테스트 모킹 패턴

**localStorage 모킹** (히스토리 기능 테스트):
```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// beforeEach에서 초기화
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
```

**crypto.randomUUID 모킹** (ID 생성 테스트):
```typescript
vi.stubGlobal('crypto', {
  ...crypto,
  randomUUID: vi.fn(() => 'mock-uuid-id'),
});
```

**Radix UI 테스트** (Select 등):
```typescript
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
```

## Deployment

**Primary**: GitHub Pages (Custom Domain: uuid.stomx.net)
- GitHub Actions 비활성화 상태 (billing issue)
- 수동 배포: `npm run deploy` 사용

**Alternative**: Cloudflare Pages
- See `docs/CLOUDFLARE_PAGES.md` for complete setup guide
- Benefits: Unlimited bandwidth, global CDN, automatic previews on PR
- Recommended for future migration due to GitHub Pages limitations

### Build Verification

UUID Generator includes comprehensive build verification to ensure all pages are generated correctly.

**Script**: `./scripts/verify-build.sh`

**Verification Checks** (44 total):
1. **Directory Structure**: `/out`, `/_next`, `/generate`, `/ko` directories
2. **English Pages**: 7 pages (index, v7, v4, v1, validate, parse, 404)
3. **Korean Pages**: 6 pages in `/ko/*`
4. **Static Assets**: sitemap.xml, robots.txt, favicon.ico, OG image
5. **HTML Attributes**: `lang` attributes (`en`, `ko`)
6. **Canonical URLs**: Self-referencing canonical tags
7. **Hreflang Tags**: Multilingual alternate links (en, ko, x-default)
8. **Sitemap Content**: All 14 pages listed with correct URLs
9. **Meta Tags**: og:locale and description tags
10. **Build Artifacts**: CSS/JS chunks generated

**Usage**:
```bash
npm run build
./scripts/verify-build.sh  # Validates build output (44 checks)
```

This script should be run before deployment to catch build issues early.

## Static Assets

| 에셋 | 경로 | 용도 |
|------|------|------|
| Favicon | `app/favicon.ico` | 브라우저 탭 아이콘 |
| App Icon | `app/icon.png` | PWA/일반 아이콘 (32x32) |
| Apple Icon | `app/apple-icon.png` | iOS 홈화면 (180x180) |
| OG Image | `public/og-image.jpg` | SNS 미리보기 (1200x630) |

**참고**: Next.js 14 파일 기반 메타데이터 규칙 사용. `app/` 디렉토리의 아이콘은 자동 감지됨.

## Analytics Integration

- Google Analytics 4 (G-R1Y8SQSKY0)
- Google Tag Manager (GTM-WWD73RTG)
- Microsoft Clarity (v27j4cca2q)
- Google AdSense (환경변수: NEXT_PUBLIC_ADSENSE_CLIENT_ID)
