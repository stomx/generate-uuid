'use client';

import { useState, useCallback } from 'react';
import type { SupportedUuidVersion, UuidOptions, UuidHistoryItem } from '@/types/uuid';
import { generateUuid, generateUuids } from '@/lib/uuid';
import { useLocalStorage } from './useLocalStorage';

const MAX_HISTORY = 50;

interface UseUuidGeneratorReturn {
  uuids: string[];
  version: SupportedUuidVersion;
  options: UuidOptions;
  history: UuidHistoryItem[];
  generate: () => void;
  setVersion: (version: SupportedUuidVersion) => void;
  setOptions: (options: Partial<UuidOptions>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

const DEFAULT_OPTIONS: UuidOptions = {
  uppercase: false,
  withHyphens: true,
  count: 1,
};

/**
 * UUID 생성기 상태 관리 훅
 */
export function useUuidGenerator(): UseUuidGeneratorReturn {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<SupportedUuidVersion>('v7');
  const [options, setOptionsState] = useState<UuidOptions>(DEFAULT_OPTIONS);
  const [history, setHistory, clearHistoryStorage] = useLocalStorage<UuidHistoryItem[]>(
    'uuid-history',
    []
  );

  // UUID 생성
  const generate = useCallback(() => {
    const newUuids = generateUuids(version, options.count, options);
    setUuids(newUuids);

    // 히스토리에 추가
    const newItems: UuidHistoryItem[] = newUuids.map((uuid) => ({
      id: crypto.randomUUID(),
      uuid,
      version,
      createdAt: new Date().toISOString(),
    }));

    setHistory((prev) => {
      const updated = [...newItems, ...prev];
      return updated.slice(0, MAX_HISTORY);
    });
  }, [version, options, setHistory]);

  // 옵션 업데이트
  const setOptions = useCallback((newOptions: Partial<UuidOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    clearHistoryStorage();
  }, [clearHistoryStorage]);

  // 히스토리에서 항목 제거
  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    },
    [setHistory]
  );

  return {
    uuids,
    version,
    options,
    history,
    generate,
    setVersion,
    setOptions,
    clearHistory,
    removeFromHistory,
  };
}
