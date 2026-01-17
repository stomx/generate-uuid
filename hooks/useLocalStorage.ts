'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * localStorage 스토어 생성
 */
function createLocalStorageStore<T>(key: string, initialValue: T) {
  let listeners: Array<() => void> = [];
  let cachedValue: T = initialValue;
  let isInitialized = false;

  // localStorage에서 초기값 로드
  const initializeFromStorage = () => {
    if (isInitialized || typeof window === 'undefined') return;
    isInitialized = true;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        cachedValue = JSON.parse(item);
      }
    } catch {
      // localStorage 접근 오류 시 기본값 유지
    }
  };

  const getSnapshot = (): T => {
    initializeFromStorage();
    return cachedValue;
  };

  const getServerSnapshot = (): T => initialValue;

  const subscribe = (listener: () => void) => {
    listeners.push(listener);

    // 다른 탭에서의 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          cachedValue = newValue;
        } catch {
          cachedValue = initialValue;
        }
        listeners.forEach((l) => l());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
      window.removeEventListener('storage', handleStorageChange);
    };
  };

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const currentValue = cachedValue;
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      cachedValue = valueToStore;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      listeners.forEach((l) => l());
    } catch (error) {
      console.warn(`localStorage 쓰기 오류 (${key}):`, error);
    }
  };

  const removeValue = () => {
    try {
      cachedValue = initialValue;
      window.localStorage.removeItem(key);
      listeners.forEach((l) => l());
    } catch (error) {
      console.warn(`localStorage 삭제 오류 (${key}):`, error);
    }
  };

  return { getSnapshot, getServerSnapshot, subscribe, setValue, removeValue };
}

// 스토어 캐시 (같은 키에 대해 동일한 스토어 사용)
const storeCache = new Map<string, ReturnType<typeof createLocalStorageStore>>();

function getStore<T>(key: string, initialValue: T) {
  if (!storeCache.has(key)) {
    storeCache.set(key, createLocalStorageStore(key, initialValue));
  }
  return storeCache.get(key) as ReturnType<typeof createLocalStorageStore<T>>;
}

/**
 * localStorage와 동기화되는 상태 관리 훅
 * useSyncExternalStore를 사용하여 SSR 안전하게 구현
 */
export function useLocalStorage<T>(
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
export const __resetLocalStorageStores = () => storeCache.clear();
