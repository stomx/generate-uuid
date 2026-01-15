'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * localStorage와 동기화되는 상태 관리 훅
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // 초기값 로드 (SSR 대응)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // 클라이언트에서 localStorage 값 로드
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`localStorage 읽기 오류 (${key}):`, error);
    }
    setIsLoaded(true);
  }, [key]);

  // 값 설정 함수
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`localStorage 쓰기 오류 (${key}):`, error);
      }
    },
    [key, storedValue]
  );

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`localStorage 삭제 오류 (${key}):`, error);
    }
  }, [key, initialValue]);

  return [isLoaded ? storedValue : initialValue, setValue, removeValue];
}
