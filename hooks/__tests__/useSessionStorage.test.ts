import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSessionStorage, __resetSessionStorageStores } from '../useSessionStorage';

// sessionStorage 모킹
const sessionStorageMock = (() => {
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

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
    __resetSessionStorageStores();
  });

  it('초기값을 반환해야 함', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('sessionStorage에 저장된 값을 로드해야 함', () => {
    sessionStorageMock.setItem('test-key', JSON.stringify('stored-value'));

    renderHook(() => useSessionStorage('test-key', 'initial'));

    // 초기값 이후 useEffect에서 로드
    expect(sessionStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('setValue로 값을 변경할 수 있어야 함', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
  });

  it('함수형 업데이트를 지원해야 함', () => {
    const { result } = renderHook(() => useSessionStorage('counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('removeValue로 값을 삭제할 수 있어야 함', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('stored-value');
    });

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBe('initial');
    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('객체 값을 저장하고 로드할 수 있어야 함', () => {
    const initialValue = { name: 'test', count: 0 };
    const { result } = renderHook(() => useSessionStorage('object-key', initialValue));

    act(() => {
      result.current[1]({ name: 'updated', count: 5 });
    });

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
  });

  it('배열 값을 저장하고 로드할 수 있어야 함', () => {
    const { result } = renderHook(() => useSessionStorage<string[]>('array-key', []));

    act(() => {
      result.current[1](['item1', 'item2']);
    });

    expect(result.current[0]).toEqual(['item1', 'item2']);
  });
});
