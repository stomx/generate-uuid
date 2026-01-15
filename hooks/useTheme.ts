'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'system' | 'light' | 'dark';

/**
 * 다크모드 테마 관리 훅
 * - 시스템 설정 자동 감지
 * - system → light → dark 순환
 * - localStorage 저장
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('dark');

  // localStorage에서 테마 로드
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && ['system', 'light', 'dark'].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  // 테마 적용
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolved = () => {
      let isDark: boolean;

      if (theme === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = theme === 'dark';
      }

      setResolved(isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark);
    };

    updateResolved();

    // 시스템 설정 변경 감지
    mediaQuery.addEventListener('change', updateResolved);
    return () => mediaQuery.removeEventListener('change', updateResolved);
  }, [theme]);

  // 테마 설정 함수
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  // 테마 순환 함수 (system → light → dark → system)
  const cycleTheme = useCallback(() => {
    const nextTheme: Theme =
      theme === 'system' ? 'light' :
      theme === 'light' ? 'dark' : 'system';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return { theme, resolved, setTheme, cycleTheme };
}
