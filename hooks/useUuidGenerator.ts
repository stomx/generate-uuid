'use client';

import { useState, useCallback } from 'react';
import type { SupportedUuidVersion, UuidOptions } from '@/types/uuid';
import { generateUuids } from '@/lib/uuid';

interface UseUuidGeneratorReturn {
  uuids: string[];
  version: SupportedUuidVersion;
  options: UuidOptions;
  generate: () => void;
  setVersion: (version: SupportedUuidVersion) => void;
  setOptions: (options: Partial<UuidOptions>) => void;
}

const DEFAULT_OPTIONS: UuidOptions = {
  uppercase: false,
  withHyphens: true,
  count: 1,
};

interface UseUuidGeneratorParams {
  initialVersion?: SupportedUuidVersion;
}

/**
 * UUID 생성기 상태 관리 훅
 */
export function useUuidGenerator(
  params: UseUuidGeneratorParams = {}
): UseUuidGeneratorReturn {
  const { initialVersion = 'v7' } = params;
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<SupportedUuidVersion>(initialVersion);
  const [options, setOptionsState] = useState<UuidOptions>(DEFAULT_OPTIONS);

  // UUID 생성
  const generate = useCallback(() => {
    const newUuids = generateUuids(version, options.count, options);
    setUuids(newUuids);
  }, [version, options]);

  // 옵션 업데이트
  const setOptions = useCallback((newOptions: Partial<UuidOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  return {
    uuids,
    version,
    options,
    generate,
    setVersion,
    setOptions,
  };
}
