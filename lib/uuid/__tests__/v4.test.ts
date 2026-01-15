import { describe, it, expect } from 'vitest';
import { generateV4 } from '../v4';

describe('UUID v4', () => {
  it('RFC4122 형식으로 생성해야 함', () => {
    const uuid = generateV4();
    // v4 UUID 정규식: 4가 버전, [89ab]가 variant
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('36자(하이픈 포함) 길이여야 함', () => {
    const uuid = generateV4();
    expect(uuid.length).toBe(36);
  });

  it('소문자로 생성해야 함', () => {
    const uuid = generateV4();
    expect(uuid).toBe(uuid.toLowerCase());
  });

  it('고유한 UUID를 생성해야 함', () => {
    const uuids = new Set(Array.from({ length: 1000 }, () => generateV4()));
    expect(uuids.size).toBe(1000);
  });

  it('버전 비트가 4여야 함', () => {
    const uuid = generateV4();
    const versionChar = uuid.charAt(14);
    expect(versionChar).toBe('4');
  });

  it('variant 비트가 RFC4122여야 함 (8, 9, a, b)', () => {
    const uuid = generateV4();
    const variantChar = uuid.charAt(19);
    expect(['8', '9', 'a', 'b']).toContain(variantChar);
  });
});
