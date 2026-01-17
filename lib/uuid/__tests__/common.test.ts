import { describe, it, expect } from 'vitest';
import { formatUuid, applyOptions } from '../common';

describe('formatUuid', () => {
  it('16바이트 배열을 표준 UUID 형식으로 변환해야 함', () => {
    // 0x550e8400e29b41d4a716446655440000
    const bytes = new Uint8Array([
      0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4,
      0xa7, 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00,
    ]);

    const result = formatUuid(bytes);

    expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('모든 0 바이트를 nil UUID로 변환해야 함', () => {
    const bytes = new Uint8Array(16).fill(0);

    const result = formatUuid(bytes);

    expect(result).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('모든 0xff 바이트를 최대값 UUID로 변환해야 함', () => {
    const bytes = new Uint8Array(16).fill(0xff);

    const result = formatUuid(bytes);

    expect(result).toBe('ffffffff-ffff-ffff-ffff-ffffffffffff');
  });

  it('8-4-4-4-12 형식으로 하이픈이 배치되어야 함', () => {
    const bytes = new Uint8Array([
      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
    ]);

    const result = formatUuid(bytes);

    const parts = result.split('-');
    expect(parts).toHaveLength(5);
    expect(parts[0]).toHaveLength(8);  // 첫 번째 그룹
    expect(parts[1]).toHaveLength(4);  // 두 번째 그룹
    expect(parts[2]).toHaveLength(4);  // 세 번째 그룹
    expect(parts[3]).toHaveLength(4);  // 네 번째 그룹
    expect(parts[4]).toHaveLength(12); // 다섯 번째 그룹
  });

  it('소문자 hex 문자열을 반환해야 함', () => {
    const bytes = new Uint8Array([
      0xAB, 0xCD, 0xEF, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);

    const result = formatUuid(bytes);

    expect(result).toMatch(/^[0-9a-f-]+$/);
    expect(result.startsWith('abcdef00')).toBe(true);
  });

  it('한 자리 hex 값에 0 패딩을 추가해야 함', () => {
    const bytes = new Uint8Array([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
      0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x00,
    ]);

    const result = formatUuid(bytes);

    expect(result).toBe('01020304-0506-0708-090a-0b0c0d0e0f00');
  });
});

describe('applyOptions', () => {
  const testUuid = '550e8400-e29b-41d4-a716-446655440000';

  describe('uppercase 옵션', () => {
    it('uppercase=true일 때 대문자로 변환해야 함', () => {
      const result = applyOptions(testUuid, { uppercase: true });
      expect(result).toBe('550E8400-E29B-41D4-A716-446655440000');
    });

    it('uppercase=false일 때 원본을 유지해야 함', () => {
      const result = applyOptions(testUuid, { uppercase: false });
      expect(result).toBe(testUuid);
    });

    it('uppercase가 없으면 원본을 유지해야 함', () => {
      const result = applyOptions(testUuid, {});
      expect(result).toBe(testUuid);
    });
  });

  describe('withHyphens 옵션', () => {
    it('withHyphens=false일 때 하이픈을 제거해야 함', () => {
      const result = applyOptions(testUuid, { withHyphens: false });
      expect(result).toBe('550e8400e29b41d4a716446655440000');
    });

    it('withHyphens=true일 때 하이픈을 유지해야 함', () => {
      const result = applyOptions(testUuid, { withHyphens: true });
      expect(result).toBe(testUuid);
    });

    it('withHyphens가 없으면 하이픈을 유지해야 함', () => {
      const result = applyOptions(testUuid, {});
      expect(result).toBe(testUuid);
    });
  });

  describe('옵션 조합', () => {
    it('uppercase=true, withHyphens=false 조합이 작동해야 함', () => {
      const result = applyOptions(testUuid, { uppercase: true, withHyphens: false });
      expect(result).toBe('550E8400E29B41D4A716446655440000');
    });

    it('uppercase=false, withHyphens=true 조합이 작동해야 함', () => {
      const result = applyOptions(testUuid, { uppercase: false, withHyphens: true });
      expect(result).toBe(testUuid);
    });

    it('빈 옵션 객체는 원본을 반환해야 함', () => {
      const result = applyOptions(testUuid, {});
      expect(result).toBe(testUuid);
    });
  });

  describe('이미 하이픈 없는 UUID', () => {
    it('withHyphens=false로 하이픈 없는 UUID를 처리해야 함', () => {
      const noHyphens = '550e8400e29b41d4a716446655440000';
      const result = applyOptions(noHyphens, { withHyphens: false });
      expect(result).toBe(noHyphens);
    });
  });

  describe('이미 대문자인 UUID', () => {
    it('uppercase=true로 대문자 UUID를 처리해야 함', () => {
      const upperUuid = '550E8400-E29B-41D4-A716-446655440000';
      const result = applyOptions(upperUuid, { uppercase: true });
      expect(result).toBe(upperUuid);
    });
  });
});
