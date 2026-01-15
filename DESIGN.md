# UUID Generator - 설계 문서

## 프로젝트 개요

| 항목 | 선택 |
|------|------|
| **프로젝트 유형** | 웹 애플리케이션 |
| **프레임워크** | Next.js 14 (App Router, Static Export) |
| **언어** | TypeScript |
| **스타일링** | Tailwind CSS + Glassmorphism |
| **UUID 버전** | v1, v4, v7 |
| **배포** | 정적 사이트 (GitHub Pages, Netlify 등) |

---

## 핵심 기능

### 1. UUID 생성기
- v1 (타임스탬프 기반), v4 (랜덤), v7 (시간순 정렬 가능)
- 다중 생성 (1~100개)
- 포맷 옵션 (대소문자, 하이픈)

### 2. UUID 검증기
- 다양한 포맷 허용 (표준, 하이픈 없음, 중괄호, URN)
- 버전 및 variant 자동 감지
- 구조화된 에러 코드 반환

### 3. UUID 파서
- v1/v7 타임스탬프 추출
- v1 클럭 시퀀스, 노드 ID 분석

### 4. 추가 기능
- 클립보드 복사 (폴백 지원)
- 생성 히스토리 (localStorage)
- 다크모드 (시스템 감지 + 수동 토글)
- Glassmorphism UI 테마
- 반응형 디자인

---

## 디렉토리 구조

```
generate-uuid/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # GlassCard, GlassButton, GlassInput
│   │   ├── generator/          # UuidGenerator, VersionSelector, OptionsPanel
│   │   ├── validator/          # UuidValidator, ValidationResult
│   │   ├── parser/             # UuidParser, ParsedInfo
│   │   └── common/             # TabNav, UuidHistory, ErrorBoundary
│   ├── lib/
│   │   └── uuid/               # v1.ts, v4.ts, v7.ts, validator.ts, parser.ts
│   ├── hooks/                  # useUuidGenerator, useTheme, useLocalStorage
│   └── types/                  # uuid.ts
├── docs/                       # 상세 설계 문서
├── e2e/                        # Playwright E2E 테스트
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 상세 문서

| 문서 | 내용 |
|------|------|
| [docs/UUID-SPEC.md](docs/UUID-SPEC.md) | UUID 생성 로직, 타입 정의, 검증 규칙 |
| [docs/UI-UX.md](docs/UI-UX.md) | Glassmorphism, 반응형, 다크모드, 접근성 |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | 테스트 전략, 배포 설정, 번들 최적화 |

---

## 구현 계획

| 단계 | 작업 |
|------|------|
| 1 | 프로젝트 초기화 (Next.js + TypeScript + Tailwind) |
| 2 | 타입 정의 (`types/uuid.ts`) |
| 3 | Glass UI 컴포넌트 |
| 4 | UUID 생성 로직 (v1, v4, v7) |
| 5 | 검증/파싱 로직 |
| 6 | 커스텀 훅 구현 |
| 7 | 메인 컴포넌트 통합 |
| 8 | 히스토리 기능 |
| 9 | 테스트 작성 |
| 10 | 배포 |

---

## 참고 자료

- [RFC 9562 - UUID](https://www.rfc-editor.org/rfc/rfc9562.html)
- [RFC 4122 - UUID (Legacy)](https://www.rfc-editor.org/rfc/rfc4122)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
