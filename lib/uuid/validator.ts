import type {
  UuidVersion,
  ValidationResult,
  ValidationError,
} from '@/types/uuid';
import { ValidationErrorCode } from '@/types/uuid';

const SUPPORTED_VERSIONS: UuidVersion[] = ['v1', 'v4', 'v7'];

/**
 * UUID 검증
 *
 * 허용 포맷:
 * - 표준 (하이픈): 550e8400-e29b-41d4-a716-446655440000
 * - 하이픈 없음: 550e8400e29b41d4a716446655440000
 * - 중괄호: {550e8400-e29b-41d4-a716-446655440000}
 * - URN: urn:uuid:550e8400-e29b-41d4-a716-446655440000
 * - 대문자: 550E8400-E29B-41D4-A716-446655440000
 */
export function validateUuid(input: string): ValidationResult {
  const errors: ValidationError[] = [];
  let normalized: string | null = null;

  // 입력 정규화
  let cleaned = input.trim().toLowerCase();

  // URN 포맷 처리
  if (cleaned.startsWith('urn:uuid:')) {
    cleaned = cleaned.slice(9);
  }

  // 중괄호 포맷 처리
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    cleaned = cleaned.slice(1, -1);
  }

  // 하이픈 제거
  const hex = cleaned.replace(/-/g, '');

  // 길이 검증
  if (hex.length !== 32) {
    errors.push({
      code: ValidationErrorCode.INVALID_LENGTH,
      message: `UUID는 32개의 16진수 문자여야 합니다. (현재: ${hex.length}개)`,
    });
    return createResult(errors);
  }

  // 16진수 검증
  const hexRegex = /^[0-9a-f]+$/;
  if (!hexRegex.test(hex)) {
    const invalidChar = hex.match(/[^0-9a-f]/);
    const position = invalidChar ? hex.indexOf(invalidChar[0]) : undefined;
    errors.push({
      code: ValidationErrorCode.INVALID_HEX,
      message: '유효하지 않은 문자가 포함되어 있습니다.',
      position,
    });
    return createResult(errors);
  }

  // 하이픈 위치 검증 (원본에 하이픈이 있는 경우)
  if (cleaned.includes('-')) {
    const hyphenPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (!hyphenPattern.test(cleaned)) {
      errors.push({
        code: ValidationErrorCode.INVALID_HYPHEN_POSITION,
        message: '하이픈 위치가 올바르지 않습니다. (8-4-4-4-12 형식)',
      });
      return createResult(errors);
    }
  }

  // 정규화된 UUID 생성
  normalized = [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');

  // 버전 추출 (byte[6]의 상위 4비트)
  const versionNibble = parseInt(hex.charAt(12), 16);
  const version = getVersion(versionNibble);

  if (!version) {
    errors.push({
      code: ValidationErrorCode.INVALID_VERSION,
      message: `유효하지 않은 UUID 버전입니다. (버전 비트: ${versionNibble})`,
    });
    return createResult(errors, normalized);
  }

  // Variant 추출 (byte[8]의 상위 비트)
  const variantByte = parseInt(hex.slice(16, 18), 16);
  const variant = getVariant(variantByte);

  if (variant !== 'RFC4122') {
    errors.push({
      code: ValidationErrorCode.INVALID_VARIANT,
      message: `RFC4122 variant가 아닙니다. (${variant || 'Unknown'})`,
    });
    return createResult(errors, normalized, version, variant);
  }

  // 지원 여부 확인
  const isSupported = SUPPORTED_VERSIONS.includes(version);

  return {
    isValid: true,
    version,
    variant,
    normalized,
    errors: [],
    isSupported,
  };
}

/**
 * 버전 비트에서 UUID 버전 추출
 */
function getVersion(versionNibble: number): UuidVersion | null {
  if (versionNibble >= 1 && versionNibble <= 8) {
    return `v${versionNibble}` as UuidVersion;
  }
  return null;
}

/**
 * Variant 바이트에서 variant 타입 추출
 */
function getVariant(
  variantByte: number
): 'RFC4122' | 'Microsoft' | 'Future' | 'NCS' | null {
  // RFC4122: 10xx xxxx (0x80-0xBF)
  if ((variantByte & 0xc0) === 0x80) {
    return 'RFC4122';
  }
  // Microsoft: 110x xxxx (0xC0-0xDF)
  if ((variantByte & 0xe0) === 0xc0) {
    return 'Microsoft';
  }
  // Future: 111x xxxx (0xE0-0xFF)
  if ((variantByte & 0xe0) === 0xe0) {
    return 'Future';
  }
  // NCS: 0xxx xxxx (0x00-0x7F)
  if ((variantByte & 0x80) === 0x00) {
    return 'NCS';
  }
  return null;
}

/**
 * 결과 객체 생성 헬퍼
 */
function createResult(
  errors: ValidationError[],
  normalized: string | null = null,
  version: UuidVersion | null = null,
  variant: 'RFC4122' | 'Microsoft' | 'Future' | 'NCS' | null = null
): ValidationResult {
  return {
    isValid: false,
    version,
    variant,
    normalized,
    errors,
    isSupported: false,
  };
}
