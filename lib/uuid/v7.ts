import { formatUuid } from './common';

/**
 * 세션 ID (6바이트)
 * 사이트 로드 시 1회 생성되어 모든 v7 UUID에 포함됨
 * 다른 탭/사용자와의 충돌을 방지
 */
let SESSION_ID: Uint8Array | null = null;

function getSessionId(): Uint8Array {
  if (!SESSION_ID) {
    SESSION_ID = crypto.getRandomValues(new Uint8Array(6));
  }
  return SESSION_ID;
}

// 카운터 상태
let lastTimestamp = 0n;
let counter = 0;
const MAX_COUNTER = 0xfff; // 12비트

/**
 * UUID v7 생성 (시간순 정렬 가능)
 *
 * 구조:
 * - 48비트 Unix 밀리초 타임스탬프
 * - 4비트 버전 (0111 = 7)
 * - 12비트 카운터 (같은 ms 내 순서 보장)
 * - 2비트 variant (10 = RFC4122)
 * - 48비트 세션 ID (충돌 방지)
 * - 14비트 랜덤
 */
export function generateV7(): string {
  let now = BigInt(Date.now());
  const sessionId = getSessionId();

  // 카운터 관리 (같은 ms 내 순서 보장)
  if (now === lastTimestamp) {
    counter++;
    if (counter > MAX_COUNTER) {
      // 오버플로우 시 타임스탬프 1ms 증가 (논리적 증가)
      now = lastTimestamp + 1n;
      counter = 0;
    }
  } else if (now < lastTimestamp) {
    // 시계 역행 시 마지막 타임스탬프 유지
    now = lastTimestamp;
    counter++;
    if (counter > MAX_COUNTER) {
      now = lastTimestamp + 1n;
      counter = 0;
    }
  } else {
    counter = 0;
  }

  lastTimestamp = now;
  return formatV7(now, counter, sessionId);
}

/**
 * v7 UUID 바이트 배열 생성 및 포맷팅
 */
function formatV7(
  timestamp: bigint,
  counter: number,
  sessionId: Uint8Array
): string {
  const bytes = new Uint8Array(16);

  // timestamp (48 bits) - 상위 6바이트
  let ts = timestamp;
  for (let i = 5; i >= 0; i--) {
    bytes[i] = Number(ts & 0xffn);
    ts >>= 8n;
  }

  // version (4 bits) + counter high (4 bits)
  bytes[6] = 0x70 | ((counter >> 8) & 0x0f);

  // counter low (8 bits)
  bytes[7] = counter & 0xff;

  // variant (2 bits) + session ID 첫 6비트
  bytes[8] = (sessionId[0] & 0x3f) | 0x80;

  // session ID 나머지 (5 bytes)
  bytes[9] = sessionId[1];
  bytes[10] = sessionId[2];
  bytes[11] = sessionId[3];
  bytes[12] = sessionId[4];
  bytes[13] = sessionId[5];

  // 추가 랜덤 (2 bytes)
  const extra = crypto.getRandomValues(new Uint8Array(2));
  bytes[14] = extra[0];
  bytes[15] = extra[1];

  return formatUuid(bytes);
}

/**
 * v7 UUID에서 타임스탬프 추출
 */
export function extractV7Timestamp(uuid: string): Date | null {
  const hex = uuid.replace(/-/g, '');
  if (hex.length !== 32) return null;

  // 상위 48비트 (12 hex chars)가 타임스탬프
  const timestampHex = hex.slice(0, 12);
  const timestamp = parseInt(timestampHex, 16);

  return new Date(timestamp);
}

/**
 * 테스트용: 세션 ID 리셋
 */
export function resetSessionForTesting(): void {
  SESSION_ID = null;
  lastTimestamp = 0n;
  counter = 0;
}
