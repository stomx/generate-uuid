import { describe, it, expect } from 'vitest';
import { validateUuid } from '../validator';
import { ValidationErrorCode } from '@/types/uuid';

describe('UUID Validator', () => {
  describe('유효한 UUID', () => {
    it('표준 형식을 허용해야 함', () => {
      const result = validateUuid('550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v4');
    });

    it('하이픈 없는 형식을 허용해야 함', () => {
      const result = validateUuid('550e8400e29b41d4a716446655440000');
      expect(result.isValid).toBe(true);
    });

    it('대문자 형식을 허용해야 함', () => {
      const result = validateUuid('550E8400-E29B-41D4-A716-446655440000');
      expect(result.isValid).toBe(true);
    });

    it('중괄호 형식을 허용해야 함', () => {
      const result = validateUuid('{550e8400-e29b-41d4-a716-446655440000}');
      expect(result.isValid).toBe(true);
    });

    it('URN 형식을 허용해야 함', () => {
      const result = validateUuid('urn:uuid:550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
    });
  });

  describe('버전 감지', () => {
    it('v1 버전을 감지해야 함', () => {
      const result = validateUuid('550e8400-e29b-11d4-a716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v1');
      expect(result.isSupported).toBe(true);
    });

    it('v4 버전을 감지해야 함', () => {
      const result = validateUuid('550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v4');
      expect(result.isSupported).toBe(true);
    });

    it('v7 버전을 감지해야 함', () => {
      const result = validateUuid('0190e2f7-fd16-7abc-8def-1234567890ab');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v7');
      expect(result.isSupported).toBe(true);
    });

    it('v3 버전을 감지하고 미지원으로 표시해야 함', () => {
      const result = validateUuid('550e8400-e29b-31d4-a716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v3');
      expect(result.isSupported).toBe(false);
    });

    it('v5 버전을 감지하고 미지원으로 표시해야 함', () => {
      const result = validateUuid('550e8400-e29b-51d4-a716-446655440000');
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v5');
      expect(result.isSupported).toBe(false);
    });
  });

  describe('정규화', () => {
    it('소문자로 정규화해야 함', () => {
      const result = validateUuid('550E8400-E29B-41D4-A716-446655440000');
      expect(result.normalized).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('하이픈을 포함하여 정규화해야 함', () => {
      const result = validateUuid('550e8400e29b41d4a716446655440000');
      expect(result.normalized).toBe('550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('에러 처리', () => {
    it('길이 오류를 감지해야 함', () => {
      const result = validateUuid('550e8400-e29b-41d4');
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ValidationErrorCode.INVALID_LENGTH);
    });

    it('유효하지 않은 16진수를 감지해야 함', () => {
      const result = validateUuid('550e8400-e29b-41d4-a716-44665544000g');
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ValidationErrorCode.INVALID_HEX);
    });

    it('잘못된 하이픈 위치를 감지해야 함', () => {
      const result = validateUuid('550e84-00e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(false);
      expect(result.errors[0].code).toBe(ValidationErrorCode.INVALID_HYPHEN_POSITION);
    });
  });

  describe('variant 감지', () => {
    it('RFC4122 variant를 감지해야 함', () => {
      const result = validateUuid('550e8400-e29b-41d4-a716-446655440000');
      expect(result.variant).toBe('RFC4122');
    });
  });
});
