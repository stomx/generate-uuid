import { describe, it, expect } from 'vitest';
import { parseUuid, formatParsedUuid } from '../parser';

describe('parseUuid', () => {
  describe('v1 UUID 파싱', () => {
    it('유효한 v1 UUID를 파싱해야 함', () => {
      // 실제 v1 UUID 형식
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const result = parseUuid(uuid);

      expect(result).not.toBeNull();
      expect(result?.version).toBe('v1');
      expect(result?.timestamp).toBeInstanceOf(Date);
      expect(result?.clockSeq).toBeDefined();
      expect(result?.node).toBeDefined();
    });

    it('v1 UUID에서 타임스탬프를 추출해야 함', () => {
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const result = parseUuid(uuid);

      expect(result?.timestamp).toBeInstanceOf(Date);
      // v1 UUID는 1582년 기준 타임스탬프이므로 과거 날짜일 수 있음
    });

    it('v1 UUID에서 클럭 시퀀스를 추출해야 함', () => {
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const result = parseUuid(uuid);

      expect(typeof result?.clockSeq).toBe('number');
      // 클럭 시퀀스는 14비트 (0-16383)
      expect(result?.clockSeq).toBeGreaterThanOrEqual(0);
      expect(result?.clockSeq).toBeLessThan(16384);
    });

    it('v1 UUID에서 노드 ID를 추출해야 함', () => {
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const result = parseUuid(uuid);

      expect(result?.node).toBeDefined();
      expect(result?.node).toMatch(/^[0-9a-f]{12}$/i);
    });
  });

  describe('v4 UUID 파싱', () => {
    it('유효한 v4 UUID를 파싱해야 함', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = parseUuid(uuid);

      expect(result).not.toBeNull();
      expect(result?.version).toBe('v4');
    });

    it('v4 UUID에서 랜덤 비트를 표시해야 함', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = parseUuid(uuid);

      expect(result?.randomBits).toBeDefined();
      expect(result?.randomBits).toContain('[v]'); // 버전 비트 표시
      expect(result?.randomBits).toContain('[var]'); // variant 비트 표시
    });

    it('v4 UUID에는 타임스탬프가 없어야 함', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = parseUuid(uuid);

      expect(result?.timestamp).toBeUndefined();
      expect(result?.clockSeq).toBeUndefined();
      expect(result?.node).toBeUndefined();
    });
  });

  describe('v7 UUID 파싱', () => {
    it('유효한 v7 UUID를 파싱해야 함', () => {
      // v7 UUID: 첫 48비트가 Unix ms 타임스탬프, 13번째 문자가 7
      const uuid = '018d6e8e-1234-7000-8000-000000000000';
      const result = parseUuid(uuid);

      expect(result).not.toBeNull();
      expect(result?.version).toBe('v7');
    });

    it('v7 UUID에서 타임스탬프를 추출해야 함', () => {
      // 특정 시점의 v7 UUID 생성
      const uuid = '018d6e8e-1234-7000-8000-000000000000';
      const result = parseUuid(uuid);

      expect(result?.timestamp).toBeInstanceOf(Date);
    });

    it('v7 UUID에는 클럭 시퀀스와 노드가 없어야 함', () => {
      const uuid = '018d6e8e-1234-7000-8000-000000000000';
      const result = parseUuid(uuid);

      expect(result?.clockSeq).toBeUndefined();
      expect(result?.node).toBeUndefined();
    });
  });

  describe('잘못된 입력 처리', () => {
    it('유효하지 않은 UUID는 null을 반환해야 함', () => {
      expect(parseUuid('invalid-uuid')).toBeNull();
      expect(parseUuid('')).toBeNull();
      expect(parseUuid('not-a-uuid-at-all')).toBeNull();
    });

    it('지원하지 않는 버전(v3, v5)은 null을 반환해야 함', () => {
      // v3 UUID (name-based MD5)
      const v3 = '6ba7b810-9dad-31d1-80b4-00c04fd430c8';
      expect(parseUuid(v3)).toBeNull();

      // v5 UUID (name-based SHA-1)
      const v5 = '6ba7b810-9dad-51d1-80b4-00c04fd430c8';
      expect(parseUuid(v5)).toBeNull();
    });

    it('하이픈 없는 형식도 파싱해야 함', () => {
      const uuid = '550e8400e29b41d4a716446655440000';
      const result = parseUuid(uuid);

      expect(result).not.toBeNull();
      expect(result?.version).toBe('v4');
    });

    it('대문자 UUID도 파싱해야 함', () => {
      const uuid = '550E8400-E29B-41D4-A716-446655440000';
      const result = parseUuid(uuid);

      expect(result).not.toBeNull();
      expect(result?.version).toBe('v4');
    });
  });
});

describe('formatParsedUuid', () => {
  it('v1 파싱 결과를 포맷팅해야 함', () => {
    const parsed = {
      version: 'v1' as const,
      timestamp: new Date('2024-01-15T10:30:00Z'),
      clockSeq: 180,
      node: '00c04fd430c8',
    };

    const formatted = formatParsedUuid(parsed);

    expect(formatted['버전']).toBe('V1');
    expect(formatted['타임스탬프']).toBeDefined();
    expect(formatted['생성 시간']).toBeDefined();
    expect(formatted['클럭 시퀀스']).toContain('180');
    expect(formatted['클럭 시퀀스']).toContain('0x00b4');
    expect(formatted['노드 ID']).toBeDefined();
  });

  it('v4 파싱 결과를 포맷팅해야 함', () => {
    const parsed = {
      version: 'v4' as const,
      randomBits: '550e8400e29b[v]1d4[var]16446655440000',
    };

    const formatted = formatParsedUuid(parsed);

    expect(formatted['버전']).toBe('V4');
    expect(formatted['랜덤 비트']).toBeDefined();
    expect(formatted['타임스탬프']).toBeUndefined();
  });

  it('v7 파싱 결과를 포맷팅해야 함', () => {
    const parsed = {
      version: 'v7' as const,
      timestamp: new Date('2024-01-15T10:30:00Z'),
    };

    const formatted = formatParsedUuid(parsed);

    expect(formatted['버전']).toBe('V7');
    expect(formatted['타임스탬프']).toBeDefined();
    expect(formatted['생성 시간']).toBeDefined();
  });

  it('노드 ID를 MAC 주소 형식으로 포맷팅해야 함', () => {
    // MAC 주소 형식 (첫 바이트 LSB가 0 = MAC)
    const parsedMac = {
      version: 'v1' as const,
      node: '00c04fd430c8', // 첫 바이트 00, LSB = 0 → MAC
    };

    const formattedMac = formatParsedUuid(parsedMac);
    expect(formattedMac['노드 ID']).toContain(':');
    expect(formattedMac['노드 ID']).toContain('(MAC)');
  });

  it('랜덤 노드 ID를 표시해야 함', () => {
    // 랜덤 노드 (첫 바이트 LSB가 1 = 랜덤)
    const parsedRandom = {
      version: 'v1' as const,
      node: '01c04fd430c8', // 첫 바이트 01, LSB = 1 → 랜덤
    };

    const formattedRandom = formatParsedUuid(parsedRandom);
    expect(formattedRandom['노드 ID']).toContain('(랜덤)');
  });
});
