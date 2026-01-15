# UUID 스펙 문서

## 타입 정의

```typescript
// types/uuid.ts

// 지원하는 버전 (생성/파싱 가능)
export type SupportedUuidVersion = 'v1' | 'v4' | 'v7';

// 모든 UUID 버전 (검증만 가능)
export type UuidVersion = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8';

export interface UuidOptions {
  uppercase: boolean;
  withHyphens: boolean;
  count: number;
}

export interface UuidHistoryItem {
  id: string;
  uuid: string;
  version: UuidVersion;
  createdAt: string;  // ISO 8601 문자열 (localStorage 직렬화용)
}

// localStorage 직렬화/역직렬화
export function serializeHistory(items: UuidHistoryItem[]): string {
  return JSON.stringify(items);
}

export function deserializeHistory(json: string): UuidHistoryItem[] {
  return JSON.parse(json);
}

// 검증 에러 코드
export enum ValidationErrorCode {
  INVALID_LENGTH = 'INVALID_LENGTH',         // 길이 오류
  INVALID_HEX = 'INVALID_HEX',               // 16진수 아닌 문자
  INVALID_VERSION = 'INVALID_VERSION',       // 버전 비트가 1-8 범위 밖
  INVALID_VARIANT = 'INVALID_VARIANT',       // RFC4122 variant 아님
  INVALID_HYPHEN_POSITION = 'INVALID_HYPHEN_POSITION',
  INVALID_FORMAT = 'INVALID_FORMAT',         // URN/중괄호 형식 오류
}

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  position?: number;
}

export interface ValidationResult {
  isValid: boolean;
  version: UuidVersion | null;
  variant: 'RFC4122' | 'Microsoft' | 'Future' | 'NCS' | null;
  normalized: string | null;
  errors: ValidationError[];
  isSupported: boolean;  // v1/v4/v7만 true (파싱 가능 여부)
}

export interface ParsedUuid {
  version: UuidVersion;
  timestamp?: Date;
  clockSeq?: number;
  node?: string;
  randomBits?: string;
}
```

---

## 검증기 포맷 매트릭스

| 포맷 | 예시 | 허용 |
|------|------|------|
| 표준 (하이픈) | `550e8400-e29b-41d4-a716-446655440000` | ✅ |
| 하이픈 없음 | `550e8400e29b41d4a716446655440000` | ✅ |
| 중괄호 | `{550e8400-e29b-41d4-a716-446655440000}` | ✅ |
| URN | `urn:uuid:550e8400-e29b-41d4-a716-446655440000` | ✅ |
| 대문자 | `550E8400-E29B-41D4-A716-446655440000` | ✅ |

> 파서는 모든 입력을 **소문자 + 하이픈 포함** 정규 형식으로 정규화

### 버전 지원 정책
| 버전 | 생성 | 검증 | 파싱 |
|------|------|------|------|
| v1 | ✅ | ✅ 유효 | ✅ 타임스탬프 추출 |
| v4 | ✅ | ✅ 유효 | ✅ (정보 없음) |
| v7 | ✅ | ✅ 유효 | ✅ 타임스탬프 추출 |
| v3, v5, v6 등 | ❌ | ✅ 유효 | ❌ 미지원 |

> v3/v5/v6 등은 **유효한 UUID로 인정**되지만, 생성/파싱은 지원하지 않음

---

## UUID v4 (랜덤)

```typescript
function generateV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;  // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80;  // variant RFC4122
  return formatUuid(bytes);
}
```

---

## UUID v1 (타임스탬프)

### 프라이버시 정책
- MAC 주소 대신 **랜덤 노드 ID** 사용
- **multicast bit(LSB)를 1로 설정**하여 랜덤 노드임을 표시

```typescript
const GREGORIAN_OFFSET = 122192928000000000n;

function generateV1(): string {
  // 밀리초를 100ns 단위로 변환
  const timestamp = BigInt(Date.now()) * 10000n + GREGORIAN_OFFSET;

  // 랜덤 클럭 시퀀스 (14비트) - 충돌 방지용
  const clockSeq = crypto.getRandomValues(new Uint16Array(1))[0] & 0x3fff;

  // 랜덤 노드 ID (48비트) + multicast bit
  const node = crypto.getRandomValues(new Uint8Array(6));
  node[0] |= 0x01;

  return formatV1(timestamp, clockSeq, node);
}

// 참고: 같은 ms 내 다중 생성 시에도 clockSeq(14비트)와 node(48비트)가
// 매번 랜덤이므로 충돌 확률은 2^62 분의 1 수준으로 극히 낮음

function formatV1(timestamp: bigint, clockSeq: number, node: Uint8Array): string {
  const bytes = new Uint8Array(16);

  // time-low (4 bytes)
  const timeLow = Number(timestamp & 0xffffffffn);
  bytes[0] = (timeLow >> 24) & 0xff;
  bytes[1] = (timeLow >> 16) & 0xff;
  bytes[2] = (timeLow >> 8) & 0xff;
  bytes[3] = timeLow & 0xff;

  // time-mid (2 bytes)
  const timeMid = Number((timestamp >> 32n) & 0xffffn);
  bytes[4] = (timeMid >> 8) & 0xff;
  bytes[5] = timeMid & 0xff;

  // time-high + version (2 bytes)
  const timeHigh = Number((timestamp >> 48n) & 0x0fffn);
  bytes[6] = ((timeHigh >> 8) & 0x0f) | 0x10;
  bytes[7] = timeHigh & 0xff;

  // clock-seq + variant (2 bytes)
  bytes[8] = ((clockSeq >> 8) & 0x3f) | 0x80;
  bytes[9] = clockSeq & 0xff;

  // node (6 bytes)
  bytes.set(node, 10);

  return formatUuid(bytes);
}
```

---

## UUID v7 (정렬 가능)

### 세션 키 전략
사이트 로드 시 **세션 ID**를 생성하여 모든 UUID v7에 포함시킴:
- 다른 탭/다른 사용자와의 충돌 완전 방지
- 같은 세션 내에서는 카운터로 순서 보장

```typescript
// ========== 세션 초기화 (사이트 로드 시 1회) ==========
const SESSION_ID = crypto.getRandomValues(new Uint8Array(6));

// ========== 카운터 상태 ==========
let lastTimestamp = 0n;
let counter = 0;
const MAX_COUNTER = 0xfff; // 12비트

function generateV7(): string {
  let now = BigInt(Date.now());

  // 카운터 관리 (같은 ms 내 순서 보장)
  if (now === lastTimestamp) {
    counter++;
    if (counter > MAX_COUNTER) {
      // 오버플로우 시 타임스탬프 1ms 증가
      now = lastTimestamp + 1n;
      counter = 0;
    }
  } else if (now < lastTimestamp) {
    // 시계 역행 시 마지막 타임스탬프 유지
    now = lastTimestamp;
    counter++;
  } else {
    counter = 0;
  }

  lastTimestamp = now;
  return formatV7(now, counter, SESSION_ID);
}

function formatV7(
  timestamp: bigint,
  counter: number,
  sessionId: Uint8Array
): string {
  const bytes = new Uint8Array(16);

  // timestamp (48 bits)
  let ts = timestamp;
  for (let i = 5; i >= 0; i--) {
    bytes[i] = Number(ts & 0xffn);
    ts >>= 8n;
  }

  // version (4 bits) + counter (12 bits)
  bytes[6] = 0x70 | ((counter >> 8) & 0x0f);
  bytes[7] = counter & 0xff;

  // variant (2 bits) + 세션 ID (48 bits) + 랜덤 (14 bits)
  bytes[8] = (sessionId[0] & 0x3f) | 0x80;  // variant 설정
  bytes[9] = sessionId[1];
  bytes[10] = sessionId[2];
  bytes[11] = sessionId[3];
  bytes[12] = sessionId[4];
  bytes[13] = sessionId[5];
  // 마지막 2바이트는 추가 랜덤
  const extra = crypto.getRandomValues(new Uint8Array(2));
  bytes[14] = extra[0];
  bytes[15] = extra[1];

  return formatUuid(bytes);
}
```

---

## 공통 헬퍼

```typescript
function formatUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

function applyOptions(uuid: string, options: UuidOptions): string {
  let result = uuid;
  if (options.uppercase) result = result.toUpperCase();
  if (!options.withHyphens) result = result.replace(/-/g, '');
  return result;
}
```

---

## 기술 노트

### UUID 버전별 특징
| 버전 | 특징 | 용도 |
|------|------|------|
| v1 | 타임스탬프(100ns) + 노드 ID | 생성 시간 추적 필요 시 |
| v4 | 122비트 랜덤 | 범용 (가장 일반적) |
| v7 | Unix ms + 카운터 + 랜덤 | DB 인덱싱 최적화 |

### 보안 고려사항
- `crypto.getRandomValues()` 사용 (CSPRNG)
- `Math.random()` 사용 금지
- v1에서 MAC 주소 노출 방지 (랜덤 노드 ID)
