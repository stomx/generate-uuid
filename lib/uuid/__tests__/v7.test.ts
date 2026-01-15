import { describe, it, expect, beforeEach } from 'vitest';
import { generateV7, extractV7Timestamp, resetSessionForTesting } from '../v7';

describe('UUID v7', () => {
  beforeEach(() => {
    resetSessionForTesting();
  });

  it('RFC4122 v7 형식으로 생성해야 함', () => {
    const uuid = generateV7();
    // v7 UUID 정규식: 7이 버전
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('버전 비트가 7이어야 함', () => {
    const uuid = generateV7();
    const versionChar = uuid.charAt(14);
    expect(versionChar).toBe('7');
  });

  it('variant 비트가 RFC4122여야 함', () => {
    const uuid = generateV7();
    const variantChar = uuid.charAt(19);
    expect(['8', '9', 'a', 'b']).toContain(variantChar);
  });

  it('고유한 UUID를 생성해야 함', () => {
    const uuids = new Set(Array.from({ length: 1000 }, () => generateV7()));
    expect(uuids.size).toBe(1000);
  });

  it('시간순으로 정렬 가능해야 함', () => {
    const uuids: string[] = [];
    for (let i = 0; i < 100; i++) {
      uuids.push(generateV7());
    }
    // 문자열로 정렬해도 시간순 유지
    const sorted = [...uuids].sort();
    expect(sorted).toEqual(uuids);
  });

  it('같은 밀리초 내에서도 순서가 유지되어야 함', () => {
    const uuids: string[] = [];
    // 빠르게 여러 개 생성
    for (let i = 0; i < 100; i++) {
      uuids.push(generateV7());
    }
    // 생성 순서대로 정렬되어야 함
    const sorted = [...uuids].sort();
    expect(sorted).toEqual(uuids);
  });
});

describe('UUID v7 파싱', () => {
  beforeEach(() => {
    resetSessionForTesting();
  });

  it('타임스탬프를 추출할 수 있어야 함', () => {
    const uuid = generateV7();
    const timestamp = extractV7Timestamp(uuid);
    expect(timestamp).toBeInstanceOf(Date);
    // 현재 시간과 비교 (1초 이내)
    const now = Date.now();
    expect(Math.abs(timestamp!.getTime() - now)).toBeLessThan(1000);
  });
});
