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
npm run test:run     # Single run (62 tests)
npm run test:e2e     # Playwright E2E tests
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

## Deployment

GitHub Pages (Custom Domain: uuid.stomx.net)
- GitHub Actions 비활성화 상태 (billing issue)
- 수동 배포: `npm run deploy` 사용

## Analytics Integration

- Google Analytics 4 (G-R1Y8SQSKY0)
- Google Tag Manager (GTM-WWD73RTG)
- Microsoft Clarity (v27j4cca2q)
- Google AdSense (환경변수: NEXT_PUBLIC_ADSENSE_CLIENT_ID)
