import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUuidGenerator } from '../useUuidGenerator';

describe('useUuidGenerator', () => {
  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    expect(result.current.uuids).toEqual([]);
    expect(result.current.version).toBe('v7');
    expect(result.current.options).toEqual({
      uppercase: false,
      withHyphens: true,
      count: 1,
    });
  });

  it('generate()가 UUID를 생성해야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.generate();
    });

    expect(result.current.uuids.length).toBe(1);
    expect(result.current.uuids[0]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('setVersion()이 버전을 변경해야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setVersion('v4');
    });

    expect(result.current.version).toBe('v4');
  });

  it('setOptions()가 옵션을 업데이트해야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setOptions({ uppercase: true });
    });

    expect(result.current.options.uppercase).toBe(true);
    expect(result.current.options.withHyphens).toBe(true); // 기존 값 유지
  });

  it('count 옵션에 따라 여러 UUID를 생성해야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setOptions({ count: 5 });
    });

    act(() => {
      result.current.generate();
    });

    expect(result.current.uuids.length).toBe(5);
  });

  it('uppercase 옵션이 적용되어야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setOptions({ uppercase: true });
    });

    act(() => {
      result.current.generate();
    });

    const uuid = result.current.uuids[0];
    expect(uuid).toBe(uuid.toUpperCase());
  });

  it('withHyphens: false 옵션이 적용되어야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setOptions({ withHyphens: false });
    });

    act(() => {
      result.current.generate();
    });

    const uuid = result.current.uuids[0];
    expect(uuid).not.toContain('-');
    expect(uuid.length).toBe(32);
  });

  it('v4 버전으로 UUID를 생성할 수 있어야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setVersion('v4');
    });

    act(() => {
      result.current.generate();
    });

    // v4 UUID의 버전 비트 확인 (13번째 문자가 4)
    const uuid = result.current.uuids[0];
    expect(uuid[14]).toBe('4');
  });

  it('v1 버전으로 UUID를 생성할 수 있어야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.setVersion('v1');
    });

    act(() => {
      result.current.generate();
    });

    // v1 UUID의 버전 비트 확인 (13번째 문자가 1)
    const uuid = result.current.uuids[0];
    expect(uuid[14]).toBe('1');
  });

  it('generate()를 여러 번 호출하면 새 UUID로 교체되어야 함', () => {
    const { result } = renderHook(() => useUuidGenerator());

    act(() => {
      result.current.generate();
    });

    const firstUuid = result.current.uuids[0];

    act(() => {
      result.current.generate();
    });

    const secondUuid = result.current.uuids[0];

    expect(firstUuid).not.toBe(secondUuid);
  });
});
