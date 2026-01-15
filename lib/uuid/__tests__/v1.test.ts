import { describe, it, expect } from 'vitest';
import { generateV1, extractV1Timestamp, extractV1ClockSeq, extractV1Node } from '../v1';

describe('UUID v1', () => {
  it('RFC4122 v1 형식으로 생성해야 함', () => {
    const uuid = generateV1();
    // v1 UUID 정규식: 1이 버전
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('버전 비트가 1이어야 함', () => {
    const uuid = generateV1();
    const versionChar = uuid.charAt(14);
    expect(versionChar).toBe('1');
  });

  it('variant 비트가 RFC4122여야 함', () => {
    const uuid = generateV1();
    const variantChar = uuid.charAt(19);
    expect(['8', '9', 'a', 'b']).toContain(variantChar);
  });

  it('노드 ID에 multicast bit가 설정되어야 함', () => {
    const uuid = generateV1();
    const nodeHex = extractV1Node(uuid);
    expect(nodeHex).not.toBeNull();
    const firstByte = parseInt(nodeHex!.slice(0, 2), 16);
    // LSB가 1이면 multicast bit 설정됨
    expect(firstByte & 0x01).toBe(1);
  });

  it('고유한 UUID를 생성해야 함', () => {
    const uuids = new Set(Array.from({ length: 100 }, () => generateV1()));
    expect(uuids.size).toBe(100);
  });
});

describe('UUID v1 파싱', () => {
  it('타임스탬프를 추출할 수 있어야 함', () => {
    const uuid = generateV1();
    const timestamp = extractV1Timestamp(uuid);
    expect(timestamp).toBeInstanceOf(Date);
    // 현재 시간과 비교 (1초 이내)
    const now = Date.now();
    expect(Math.abs(timestamp!.getTime() - now)).toBeLessThan(1000);
  });

  it('클럭 시퀀스를 추출할 수 있어야 함', () => {
    const uuid = generateV1();
    const clockSeq = extractV1ClockSeq(uuid);
    expect(clockSeq).not.toBeNull();
    // 14비트 범위 (0-16383)
    expect(clockSeq).toBeGreaterThanOrEqual(0);
    expect(clockSeq).toBeLessThan(16384);
  });

  it('노드 ID를 추출할 수 있어야 함', () => {
    const uuid = generateV1();
    const node = extractV1Node(uuid);
    expect(node).not.toBeNull();
    // 12자리 16진수
    expect(node).toMatch(/^[0-9a-f]{12}$/);
  });
});
