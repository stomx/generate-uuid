import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMedia 모킹
let mediaQueryCallback: ((e: { matches: boolean }) => void) | null = null;
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: false, // 기본: 라이트 모드
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn((_event: string, callback: (e: { matches: boolean }) => void) => {
    mediaQueryCallback = callback;
  }),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    document.documentElement.classList.remove('dark');
    mediaQueryCallback = null;
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('기본 테마가 system이어야 함', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
  });

  it('localStorage에 저장된 테마를 로드해야 함', () => {
    localStorageMock.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme());

    // useEffect 후 테마 로드됨
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  it('setTheme으로 테마를 변경할 수 있어야 함', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('cycleTheme으로 테마를 순환할 수 있어야 함 (system → light)', () => {
    const { result } = renderHook(() => useTheme());

    // 초기: system
    expect(result.current.theme).toBe('system');

    act(() => {
      result.current.cycleTheme();
    });

    // system → light
    expect(result.current.theme).toBe('light');
  });

  it('cycleTheme 순환: light → dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    act(() => {
      result.current.cycleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });

  it('cycleTheme 순환: dark → system', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    act(() => {
      result.current.cycleTheme();
    });

    expect(result.current.theme).toBe('system');
  });

  it('dark 테마일 때 document에 dark 클래스가 추가되어야 함', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('light 테마일 때 dark 클래스가 제거되어야 함', () => {
    document.documentElement.classList.add('dark');

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
