import type { UuidOptions } from '@/types/uuid';

/**
 * 16바이트 배열을 표준 UUID 문자열로 변환
 */
export function formatUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/**
 * UUID 문자열에 옵션 적용 (대문자, 하이픈 제거)
 */
export function applyOptions(uuid: string, options: Partial<UuidOptions>): string {
  let result = uuid;
  if (options.uppercase) result = result.toUpperCase();
  if (options.withHyphens === false) result = result.replace(/-/g, '');
  return result;
}
