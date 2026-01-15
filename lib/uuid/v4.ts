import { formatUuid } from './common';

/**
 * UUID v4 생성 (122비트 랜덤)
 *
 * 구조:
 * - 122비트 랜덤 데이터
 * - 4비트 버전 (0100 = 4)
 * - 2비트 variant (10 = RFC4122)
 */
export function generateV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  // version 4: byte[6]의 상위 4비트를 0100으로 설정
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // variant RFC4122: byte[8]의 상위 2비트를 10으로 설정
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUuid(bytes);
}
