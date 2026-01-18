'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * sessionStorage 스토어 생성
 */
function createSessionStorageStore<T>(key: string, initialValue: T) {
  let listeners: Array<() => void> = [];
  let cachedValue: T = initialValue;
  let isInitialized = false;

  // sessionStorage에서 초기값 로드
  const initializeFromStorage = () => {
    if (isInitialized || typeof window === 'undefined') return;
    isInitialized = true;
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        cachedValue = JSON.parse(item);
      }
    } catch {
      // sessionStorage 접근 오류 시 기본값 유지
    }
  };

  const getSnapshot = (): T => {
    initializeFromStorage();
    return cachedValue;
  };

  const getServerSnapshot = (): T => initialValue;

  const subscribe = (listener: () => void) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const currentValue = cachedValue;
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      cachedValue = valueToStore;
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      listeners.forEach((l) => l());
    } catch (error) {
      console.warn(`sessionStorage 쓰기 오류 (${key}):`, error);
    }
  };

  const removeValue = () => {
    try {
      cachedValue = initialValue;
      window.sessionStorage.removeItem(key);
      listeners.forEach((l) => l());
    } catch (error) {
      console.warn(`sessionStorage 삭제 오류 (${key}):`, error);
    }
  };

  return { getSnapshot, getServerSnapshot, subscribe, setValue, removeValue };
}

// 스토어 캐시 (같은 키에 대해 동일한 스토어 사용)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeCache = new Map<string, any>();

function getStore<T>(key: string, initialValue: T) {
  if (!storeCache.has(key)) {
    storeCache.set(key, createSessionStorageStore(key, initialValue));
  }
  return storeCache.get(key) as ReturnType<typeof createSessionStorageStore<T>>;
}

/**
 * sessionStorage와 동기화되는 상태 관리 훅
 * useSyncExternalStore를 사용하여 SSR 안전하게 구현
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const store = getStore<T>(key, initialValue);

  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      store.setValue(newValue);
    },
    [store]
  );

  const removeValue = useCallback(() => {
    store.removeValue();
  }, [store]);

  return [value, setValue, removeValue];
}

// 테스트용 export
export const __resetSessionStorageStores = () => storeCache.clear();
