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
  createdAt: string; // ISO 8601 문자열 (localStorage 직렬화용)
}

// 검증 에러 코드
export enum ValidationErrorCode {
  INVALID_LENGTH = 'INVALID_LENGTH',
  INVALID_HEX = 'INVALID_HEX',
  INVALID_VERSION = 'INVALID_VERSION',
  INVALID_VARIANT = 'INVALID_VARIANT',
  INVALID_HYPHEN_POSITION = 'INVALID_HYPHEN_POSITION',
  INVALID_FORMAT = 'INVALID_FORMAT',
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
  isSupported: boolean; // v1/v4/v7만 true (파싱 가능 여부)
}

export interface ParsedUuid {
  version: UuidVersion;
  timestamp?: Date;
  clockSeq?: number;
  node?: string;
  randomBits?: string;
}

// localStorage 직렬화/역직렬화
export function serializeHistory(items: UuidHistoryItem[]): string {
  return JSON.stringify(items);
}

export function deserializeHistory(json: string): UuidHistoryItem[] {
  return JSON.parse(json);
}
