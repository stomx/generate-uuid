'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type Theme = 'system' | 'light' | 'dark';

/**
 * 테마 스토어 (싱글톤)
 */
const themeStore = (() => {
  let listeners: Array<() => void> = [];
  let currentTheme: Theme = 'system';

  const getSnapshot = (): Theme => currentTheme;
  const getServerSnapshot = (): Theme => 'system';

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const setTheme = (theme: Theme) => {
    currentTheme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // localStorage 사용 불가 시 무시
    }
    listeners.forEach((l) => l());
  };

  // 초기 로드 (클라이언트에서만)
  const initialize = () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored && ['system', 'light', 'dark'].includes(stored)) {
        currentTheme = stored;
      }
    } catch {
      // localStorage 사용 불가 시 기본값 유지
    }
  };

  // 테스트용 리셋 함수
  const reset = () => {
    currentTheme = 'system';
    listeners.forEach((l) => l());
  };

  return { getSnapshot, getServerSnapshot, subscribe, setTheme, initialize, reset };
})();

// 클라이언트에서 초기화
if (typeof window !== 'undefined') {
  themeStore.initialize();
}

/**
 * 다크모드 테마 관리 훅
 * - 시스템 설정 자동 감지
 * - system → light → dark 순환
 * - localStorage 저장
 * - useSyncExternalStore로 SSR 안전하게 구현
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  // 실제 적용되는 테마 (system 해석)
  const resolved = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    () => {
      if (typeof window === 'undefined') return 'dark';
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme === 'dark' ? 'dark' : 'light';
    },
    () => 'dark'
  );

  // DOM에 테마 클래스 적용
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);

  // 테마 설정 함수
  const setTheme = useCallback((newTheme: Theme) => {
    themeStore.setTheme(newTheme);
  }, []);

  // 테마 순환 함수 (system → light → dark → system)
  const cycleTheme = useCallback(() => {
    const nextTheme: Theme =
      theme === 'system' ? 'light' :
      theme === 'light' ? 'dark' : 'system';
    themeStore.setTheme(nextTheme);
  }, [theme]);

  return { theme, resolved, setTheme, cycleTheme };
}

// 테스트용 export
export const __resetThemeStore = () => themeStore.reset();
