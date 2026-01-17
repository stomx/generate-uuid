# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UUID Generator - 온라인 UUID 생성/검증/파싱 도구 (uuid.stomx.net)
- Next.js 14 + TypeScript + Tailwind CSS
- Static Export로 GitHub Pages 배포
- RFC 9562 준수 UUID v1, v4, v7 지원

## Commands

```bash
# Development
npm run dev          # http://localhost:3000

# Build & Deploy
npm run build        # Static export to /out
npm run deploy       # Build + gh-pages deploy (GitHub Actions 비활성화 상태)

# Test
npm run test         # Vitest watch mode
npm run test:run     # Single run (304 unit tests)
npm run test:e2e     # Playwright E2E tests (45 tests × 2 projects)
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

GitHub Pages (Custom Domain: uuid.stomx.net)
- GitHub Actions 비활성화 상태 (billing issue)
- 수동 배포: `npm run deploy` 사용

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

## Current Work (진행 중인 작업)

### Branch: `fix/color-contrast-wcag`

**목표**: WCAG 2.1 색상 대비 기준 충족

**배경**:
- `e2e/accessibility.spec.ts`에서 axe-core를 통한 WCAG 2.0 A/AA 자동 테스트 수행 중
- 색상 대비 관련 추가 개선 필요 가능성 검토

**작업 계획**:
1. 현재 색상 대비 비율 분석 (text-primary, text-muted 등)
2. WCAG 2.1 AA 기준 (4.5:1 일반 텍스트, 3:1 큰 텍스트) 충족 여부 확인
3. 미충족 항목 CSS 변수 수정 (`globals.css`)
4. 접근성 테스트 실행으로 검증

**다른 디바이스에서 이어서 작업 시**:
```bash
git fetch origin
git checkout fix/color-contrast-wcag
npm install
npm run test:e2e -- --project=chromium accessibility.spec.ts
```
