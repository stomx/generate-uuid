import type { SupportedUuidVersion, UuidOptions } from '@/types/uuid';
import { applyOptions } from './common';
import { generateV1, extractV1Timestamp, extractV1ClockSeq, extractV1Node } from './v1';
import { generateV4 } from './v4';
import { generateV7, extractV7Timestamp } from './v7';

export { generateV1, generateV4, generateV7 };
export { extractV1Timestamp, extractV1ClockSeq, extractV1Node };
export { extractV7Timestamp };
export { validateUuid } from './validator';
export { parseUuid, formatParsedUuid } from './parser';

/**
 * 지정된 버전의 UUID 생성
 */
export function generateUuid(
  version: SupportedUuidVersion,
  options?: Partial<UuidOptions>
): string {
  let uuid: string;

  switch (version) {
    case 'v1':
      uuid = generateV1();
      break;
    case 'v4':
      uuid = generateV4();
      break;
    case 'v7':
      uuid = generateV7();
      break;
    default:
      throw new Error(`Unsupported UUID version: ${version}`);
  }

  return options ? applyOptions(uuid, options) : uuid;
}

/**
 * 여러 개의 UUID 생성
 */
export function generateUuids(
  version: SupportedUuidVersion,
  count: number,
  options?: Partial<UuidOptions>
): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUuid(version, options));
  }
  return uuids;
}
