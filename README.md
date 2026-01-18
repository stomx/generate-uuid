# UUID Generator

온라인 UUID 생성/검증/파싱 도구

**Live Demo**: [uuid.stomx.net](https://uuid.stomx.net)

## Features

- **UUID 생성**: v1 (타임스탬프), v4 (랜덤), v7 (Unix ms 타임스탬프)
- **UUID 검증**: 형식 및 버전 검증, 상세 오류 메시지
- **UUID 파싱**: 버전별 정보 추출 (타임스탬프, 클럭 시퀀스, 노드 ID 등)
- **히스토리**: 최근 검증/파싱 기록 저장 (localStorage)
- **다크/라이트 모드**: 시스템 설정 연동
- **키보드 단축키**: 탭 전환 (1, 2, 3), 버전 선택 (Q, W, E)

## Tech Stack

- **Framework**: Next.js 14 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI (shadcn/ui)
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: GitHub Pages

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests (watch mode)
npm run test:e2e    # E2E tests
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (http://localhost:3000) |
| `npm run build` | Production build (static export to /out) |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Single test run (305 unit tests) |
| `npm run test:e2e` | Playwright E2E tests (76 tests × 2 projects) |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + GitHub Pages deploy |

## Project Structure

```
├── app/                # Next.js App Router
├── components/
│   ├── ui/            # Base UI components (Button, Card, Input)
│   ├── common/        # Shared components (TabNav, ThemeToggle)
│   ├── generator/     # UUID generation UI
│   ├── validator/     # UUID validation UI
│   └── parser/        # UUID parsing UI
├── lib/
│   └── uuid/          # Pure UUID implementation (RFC 9562)
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
├── e2e/               # Playwright E2E tests
└── docs/              # Development documentation
```

## UUID Implementation

외부 라이브러리 없이 RFC 9562 준수 순수 구현:

- `lib/uuid/v1.ts` - 타임스탬프 기반 (랜덤 노드)
- `lib/uuid/v4.ts` - crypto.getRandomValues() 기반
- `lib/uuid/v7.ts` - Unix ms 타임스탬프 + 랜덤
- `lib/uuid/validator.ts` - 형식/버전 검증
- `lib/uuid/parser.ts` - 버전별 정보 추출

## Documentation

- [CLAUDE.md](./CLAUDE.md) - AI 개발 가이드
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - 개발 가이드
- [docs/UUID-SPEC.md](./docs/UUID-SPEC.md) - UUID 스펙 정리

## License

MIT
