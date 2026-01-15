import type { ParsedUuid, UuidVersion } from '@/types/uuid';
import { validateUuid } from './validator';
import { extractV1Timestamp, extractV1ClockSeq, extractV1Node } from './v1';
import { extractV7Timestamp } from './v7';

/**
 * UUID 파싱
 *
 * 지원 버전:
 * - v1: 타임스탬프, 클럭 시퀀스, 노드 ID 추출
 * - v4: 정보 없음 (122비트 랜덤)
 * - v7: 타임스탬프 추출
 *
 * v3, v5, v6 등은 검증은 가능하지만 파싱은 미지원
 */
export function parseUuid(input: string): ParsedUuid | null {
  const validation = validateUuid(input);

  if (!validation.isValid || !validation.normalized || !validation.version) {
    return null;
  }

  if (!validation.isSupported) {
    // v3, v5, v6 등은 유효하지만 파싱 미지원
    return null;
  }

  const uuid = validation.normalized;
  const version = validation.version;

  switch (version) {
    case 'v1':
      return parseV1(uuid, version);
    case 'v4':
      return parseV4(uuid, version);
    case 'v7':
      return parseV7(uuid, version);
    default:
      return null;
  }
}

/**
 * v1 UUID 파싱
 */
function parseV1(uuid: string, version: UuidVersion): ParsedUuid {
  return {
    version,
    timestamp: extractV1Timestamp(uuid) ?? undefined,
    clockSeq: extractV1ClockSeq(uuid) ?? undefined,
    node: extractV1Node(uuid) ?? undefined,
  };
}

/**
 * v4 UUID 파싱 (정보 없음)
 */
function parseV4(uuid: string, version: UuidVersion): ParsedUuid {
  // v4는 122비트가 랜덤이므로 추출할 정보가 없음
  const hex = uuid.replace(/-/g, '');

  // 랜덤 비트 표시 (버전/variant 비트 제외)
  return {
    version,
    randomBits: `${hex.slice(0, 12)}[v]${hex.slice(13, 16)}[var]${hex.slice(18)}`,
  };
}

/**
 * v7 UUID 파싱
 */
function parseV7(uuid: string, version: UuidVersion): ParsedUuid {
  return {
    version,
    timestamp: extractV7Timestamp(uuid) ?? undefined,
  };
}

/**
 * 파싱 결과를 읽기 쉬운 형태로 포맷팅
 */
export function formatParsedUuid(parsed: ParsedUuid): Record<string, string> {
  const result: Record<string, string> = {
    버전: parsed.version.toUpperCase(),
  };

  if (parsed.timestamp) {
    result['타임스탬프'] = parsed.timestamp.toISOString();
    result['생성 시간'] = formatLocalDateTime(parsed.timestamp);
  }

  if (parsed.clockSeq !== undefined) {
    result['클럭 시퀀스'] = `${parsed.clockSeq} (0x${parsed.clockSeq.toString(16).padStart(4, '0')})`;
  }

  if (parsed.node) {
    result['노드 ID'] = formatNodeId(parsed.node);
  }

  if (parsed.randomBits) {
    result['랜덤 비트'] = parsed.randomBits;
  }

  return result;
}

/**
 * 노드 ID를 MAC 주소 형식으로 포맷팅
 */
function formatNodeId(node: string): string {
  const formatted = node.match(/.{2}/g)?.join(':') ?? node;
  const isRandom = (parseInt(node.slice(0, 2), 16) & 0x01) === 1;
  return `${formatted} ${isRandom ? '(랜덤)' : '(MAC)'}`;
}

/**
 * 로컬 날짜/시간 포맷팅
 */
function formatLocalDateTime(date: Date): string {
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
