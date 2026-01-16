# 개발 가이드

## 정적 사이트 배포

### Next.js Static Export 설정
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

### 제약사항
| 기능 | 사용 가능 | 비고 |
|------|----------|------|
| API Routes | ❌ | 서버 필요 |
| Server Components | ❌ | 클라이언트만 |
| Middleware | ❌ | 서버 필요 |
| Client Components | ✅ | 'use client' 사용 |
| Static Generation | ✅ | 기본 동작 |

### 배포 플랫폼
| 플랫폼 | 설정 |
|--------|------|
| GitHub Pages | `out/` 폴더 배포 |
| Netlify | 빌드: `npm run build` |
| Vercel | 자동 감지 |
| Cloudflare Pages | `out/` 폴더 지정 |

### 스크립트
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "npx serve out",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

## 테스트 전략

### 테스트 스택
| 도구 | 용도 |
|------|------|
| **Vitest** | 단위 테스트 |
| **Testing Library** | 컴포넌트 테스트 |
| **Playwright** | E2E 테스트 |

### 단위 테스트 예시
```typescript
// lib/uuid/__tests__/v4.test.ts
describe('UUID v4', () => {
  it('should generate valid RFC4122 format', () => {
    const uuid = generateV4();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('should generate unique UUIDs', () => {
    const uuids = new Set(Array.from({ length: 1000 }, () => generateV4()));
    expect(uuids.size).toBe(1000);
  });
});

// lib/uuid/__tests__/validator.test.ts
describe('UUID Validator', () => {
  it('should accept standard format', () => {
    expect(validate('550e8400-e29b-41d4-a716-446655440000').isValid).toBe(true);
  });

  it('should accept hyphenless format', () => {
    expect(validate('550e8400e29b41d4a716446655440000').isValid).toBe(true);
  });

  it('should reject invalid hex', () => {
    const result = validate('550e8400-e29b-41d4-a716-44665544000g');
    expect(result.errors[0].code).toBe('INVALID_HEX');
  });
});
```

### E2E 테스트 예시

#### Playwright 설정 (클립보드 권한)
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    permissions: ['clipboard-read', 'clipboard-write'],
    browserName: 'chromium',
  },
});
```

```typescript
// e2e/generator.spec.ts
import { test, expect } from '@playwright/test';

test('should generate and copy UUID', async ({ page, context }) => {
  // 클립보드 권한 부여
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/');

  await page.click('[data-testid="version-v4"]');
  await page.click('[data-testid="generate-btn"]');

  const uuid = await page.textContent('[data-testid="uuid-display"]');
  expect(uuid).toMatch(/^[0-9a-f-]{36}$/);

  await page.click('[data-testid="copy-btn"]');

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe(uuid);
});

test('should validate UUID', async ({ page }) => {
  await page.goto('/');

  await page.click('[data-testid="tab-validator"]');
  await page.fill('[data-testid="uuid-input"]', '550e8400-e29b-41d4-a716-446655440000');

  const result = await page.textContent('[data-testid="validation-result"]');
  expect(result).toContain('유효');
  expect(result).toContain('v4');
});
```

### 커버리지 목표
| 영역 | 목표 |
|------|------|
| UUID 생성 로직 | 95%+ |
| 검증/파싱 로직 | 90%+ |
| UI 컴포넌트 | 80%+ |
| **전체** | **85%+** |

### 테스트 현황 (2026-01-17)

**Unit 241개 + E2E 26개 = 총 267개**

| 영역 | 파일 | 테스트 수 |
|------|------|-----------|
| **UUID 라이브러리** | `lib/uuid/__tests__/` | 53 |
| └ v1.test.ts | 타임스탬프 기반 생성 | 8 |
| └ v4.test.ts | 랜덤 생성 | 6 |
| └ v7.test.ts | Unix ms 타임스탬프 | 7 |
| └ validator.test.ts | 형식/버전 검증 | 16 |
| └ parser.test.ts | UUID 파싱 | 19 |
| **Hooks** | `hooks/__tests__/` | 25 |
| └ useLocalStorage.test.ts | localStorage 상태 관리 | 7 |
| └ useTheme.test.ts | 테마 전환 로직 | 8 |
| └ useUuidGenerator.test.ts | UUID 생성 훅 | 10 |
| **UI 컴포넌트** | `components/ui/__tests__/` | 100 |
| └ Button.test.tsx | 버튼 variant/size/events | 17 |
| └ Card.test.tsx | 카드 variant/glow | 9 |
| └ Input.test.tsx | 입력 label/error/prefix | 23 |
| └ GlassButton.test.tsx | Glass 버튼 | 12 |
| └ GlassCard.test.tsx | Glass 카드 | 8 |
| └ GlassInput.test.tsx | Glass 입력 | 15 |
| └ Checkbox.test.tsx | Radix UI 체크박스 | 7 |
| └ Select.test.tsx | Radix UI 셀렉트 | 9 |
| **Common** | `components/common/__tests__/` | 22 |
| └ TabNav.test.tsx | 탭 네비게이션 | 8 |
| └ ThemeToggle.test.tsx | 테마 토글 버튼 | 8 |
| └ ErrorBoundary.test.tsx | 에러 바운더리 | 6 |
| **Generator** | `components/generator/__tests__/` | 7 |
| **Validator** | `components/validator/__tests__/` | 14 |
| **Parser** | `components/parser/__tests__/` | 17 |
| **E2E** | `e2e/*.spec.ts` | 26 |
| └ generator.spec.ts | UUID 생성 플로우 | 9 |
| └ validator.spec.ts | 검증 + 히스토리 | 9 |
| └ parser.spec.ts | 파싱 + 히스토리 | 8 |

---

## 번들링 최적화

### 전략
| 전략 | 구현 |
|------|------|
| Tree Shaking | UUID 함수별 독립 모듈 |
| Dynamic Import | 검증기/파서 lazy loading |
| 코드 분할 | `next/dynamic` 사용 |
| 번들 분석 | `@next/bundle-analyzer` |
| 폰트 최적화 | `next/font` |

### Dynamic Import
```typescript
import dynamic from 'next/dynamic';

const UuidValidator = dynamic(
  () => import('@/components/validator/UuidValidator'),
  { loading: () => <LoadingSpinner /> }
);

const UuidParser = dynamic(
  () => import('@/components/parser/UuidParser'),
  { loading: () => <LoadingSpinner /> }
);
```

### 번들 분석
```bash
# 설치
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# 실행
ANALYZE=true npm run build
```

---

## 클립보드 폴백

```typescript
// lib/utils/clipboard.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch { /* fallback */ }
  }

  // 2. execCommand 폴백
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}
```

---

## 의존성

### 필수
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## Git 설정

### .gitignore
```
node_modules/
.next/
out/
*.log
.env*.local
.vercel
coverage/
playwright-report/
```

### 커밋 컨벤션
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경
```
