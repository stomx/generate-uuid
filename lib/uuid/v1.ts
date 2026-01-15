import { formatUuid } from './common';

/**
 * Gregorian 캘린더 시작점 (1582-10-15)과 Unix epoch (1970-01-01) 사이의
 * 100나노초 단위 간격
 */
const GREGORIAN_OFFSET = 122192928000000000n;

/**
 * UUID v1 생성 (타임스탬프 기반)
 *
 * 구조:
 * - 60비트 타임스탬프 (100ns 단위, Gregorian 기준)
 * - 4비트 버전 (0001 = 1)
 * - 14비트 클럭 시퀀스 (랜덤)
 * - 2비트 variant (10 = RFC4122)
 * - 48비트 노드 ID (랜덤 + multicast bit)
 *
 * 프라이버시: MAC 주소 대신 랜덤 노드 ID 사용
 */
export function generateV1(): string {
  // 밀리초를 100ns 단위로 변환 후 Gregorian 오프셋 추가
  const timestamp = BigInt(Date.now()) * 10000n + GREGORIAN_OFFSET;

  // 랜덤 클럭 시퀀스 (14비트) - 충돌 방지용
  const clockSeq = crypto.getRandomValues(new Uint16Array(1))[0] & 0x3fff;

  // 랜덤 노드 ID (48비트) + multicast bit 설정
  const node = crypto.getRandomValues(new Uint8Array(6));
  node[0] |= 0x01; // multicast bit (LSB)를 1로 설정하여 랜덤 노드임을 표시

  return formatV1(timestamp, clockSeq, node);
}

/**
 * v1 UUID 바이트 배열 생성 및 포맷팅
 */
function formatV1(timestamp: bigint, clockSeq: number, node: Uint8Array): string {
  const bytes = new Uint8Array(16);

  // time-low (4 bytes) - 타임스탬프 하위 32비트
  const timeLow = Number(timestamp & 0xffffffffn);
  bytes[0] = (timeLow >> 24) & 0xff;
  bytes[1] = (timeLow >> 16) & 0xff;
  bytes[2] = (timeLow >> 8) & 0xff;
  bytes[3] = timeLow & 0xff;

  // time-mid (2 bytes) - 타임스탬프 중간 16비트
  const timeMid = Number((timestamp >> 32n) & 0xffffn);
  bytes[4] = (timeMid >> 8) & 0xff;
  bytes[5] = timeMid & 0xff;

  // time-high + version (2 bytes) - 타임스탬프 상위 12비트 + 버전 4비트
  const timeHigh = Number((timestamp >> 48n) & 0x0fffn);
  bytes[6] = ((timeHigh >> 8) & 0x0f) | 0x10; // version 1
  bytes[7] = timeHigh & 0xff;

  // clock-seq + variant (2 bytes)
  bytes[8] = ((clockSeq >> 8) & 0x3f) | 0x80; // variant RFC4122
  bytes[9] = clockSeq & 0xff;

  // node (6 bytes)
  bytes.set(node, 10);

  return formatUuid(bytes);
}

/**
 * v1 UUID에서 타임스탬프 추출
 */
export function extractV1Timestamp(uuid: string): Date | null {
  const hex = uuid.replace(/-/g, '');
  if (hex.length !== 32) return null;

  // 타임스탬프 재구성: time-low + time-mid + time-high
  const timeLow = BigInt('0x' + hex.slice(0, 8));
  const timeMid = BigInt('0x' + hex.slice(8, 12));
  const timeHigh = BigInt('0x' + hex.slice(12, 16)) & 0x0fffn;

  const timestamp = timeLow | (timeMid << 32n) | (timeHigh << 48n);

  // Gregorian 오프셋 제거 후 밀리초로 변환
  const unixNs = timestamp - GREGORIAN_OFFSET;
  const unixMs = Number(unixNs / 10000n);

  return new Date(unixMs);
}

/**
 * v1 UUID에서 클럭 시퀀스 추출
 */
export function extractV1ClockSeq(uuid: string): number | null {
  const hex = uuid.replace(/-/g, '');
  if (hex.length !== 32) return null;

  const clockSeqHigh = parseInt(hex.slice(16, 18), 16) & 0x3f;
  const clockSeqLow = parseInt(hex.slice(18, 20), 16);

  return (clockSeqHigh << 8) | clockSeqLow;
}

/**
 * v1 UUID에서 노드 ID 추출
 */
export function extractV1Node(uuid: string): string | null {
  const hex = uuid.replace(/-/g, '');
  if (hex.length !== 32) return null;

  return hex.slice(20, 32);
}
