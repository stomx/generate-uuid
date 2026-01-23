# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UUID Generator - 온라인 UUID 생성/검증/파싱 도구 (uuid.stomx.net)
- Next.js 16 + TypeScript + Tailwind CSS
- Static Export로 Cloudflare Pages 배포
- RFC 9562 준수 UUID v1, v4, v7 지원
- 다국어 지원 (English, 한국어)

## Multilingual Support (i18n)

영어(en)와 한국어(ko) 두 언어를 지원합니다.

### URL 구조
- 영어(기본): `/generate/v7`, `/validate`, `/parse`
- 한국어: `/ko/generate/v7`, `/ko/validate`, `/ko/parse`
- 모든 URL은 trailing slash로 종료

### 주요 파일
- `app/(main)/` - 영어 페이지 (lang="en")
- `app/ko/` - 한국어 페이지 (lang="ko")
- `lib/i18n/` - 번역 및 메타데이터
- `components/common/LangLayoutClient.tsx` - 언어 전환 로직

### SEO
- 페이지별 고유 H1 (`sr-only` 클래스로 숨김, SEO용)
- 자기 참조 canonical + hreflang 태그
- 페이지별 동적 Breadcrumb 스키마
- `public/sitemap.xml` - 14개 URL (영어 7개 + 한국어 7개)

### 번역 구조
`lib/i18n/translations.ts`에서 타입 안전한 번역 관리:
- **Flat keys**: `nav.*`, `common.*`, `generator.*`, `validator.*`, `parser.*`
- **Nested arrays**: `uuidInfo.featuresV1[]`, `uuidInfo.useCasesV7[]` 등

```typescript
// 동적 키 접근 (버전별 콘텐츠)
const versionKey = version.toUpperCase() as 'V1' | 'V4' | 'V7';
const features = t.uuidInfo[`features${versionKey}`] as string[];
```

## Commands

```bash
# Development
npm run dev          # http://localhost:3000

# Build
npm run build        # Static export to /out (Cloudflare Pages 자동 배포)

# Test
npm run test         # Vitest watch mode
npm run test:run     # Single run
npm run test:e2e     # Playwright E2E tests (86 tests × 2 projects = 172 total)
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
├── generator/   # UUID 생성 (VersionSelector, OptionsPanel, UuidInfoSection)
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

**테스트 파일** (`e2e/`):
`generator`, `validator`, `parser`, `routing`, `language-toggle`, `accessibility`, `mobile`

### 테스트 모킹 패턴

- **localStorage**: 히스토리 기능 테스트 시 모킹 필요 (예: `components/validator/__tests__/`)
- **crypto.randomUUID**: ID 생성 테스트 시 `vi.stubGlobal()` 사용
- **Radix UI**: `Element.prototype.scrollIntoView` 모킹 필요

## Deployment

**Cloudflare Pages** (Custom Domain: uuid.stomx.net)
- Git push 시 자동 배포
- Benefits: Unlimited bandwidth, global CDN, automatic previews on PR
- See `docs/CLOUDFLARE_PAGES.md` for setup guide

### Build Verification

```bash
npm run build
./scripts/verify-build.sh  # 53개 검증 (페이지, SEO 태그, 정적 자산 등)
```

디렉토리 구조, HTML lang 속성, canonical/hreflang 태그, sitemap, 메타 태그 등을 검증합니다.

## Static Assets

- `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` - Next.js 파일 기반 메타데이터
- `public/og-image.jpg` - SNS 미리보기 (1200x630)

## Analytics

Google Analytics 4, Google Tag Manager, Microsoft Clarity, Google AdSense 통합.
설정: `components/common/AnalyticsScripts.tsx`
