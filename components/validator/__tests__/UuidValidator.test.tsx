import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UuidValidator } from '../UuidValidator';

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

// crypto.randomUUID 모킹 - 고유 ID 생성을 위한 카운터 사용
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  ...crypto,
  randomUUID: vi.fn(() => `mock-uuid-id-${++uuidCounter}`),
});

describe('UuidValidator', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });
  it('입력 필드가 렌더링되어야 함', () => {
    render(<UuidValidator />);
    expect(screen.getByTestId('uuid-input')).toBeInTheDocument();
  });

  it('유효한 UUID 입력 후 검증 시 [VALID] 상태를 표시해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    // Enter 키로 검증 실행
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      // 결과 영역의 [VALID] 확인 (data-testid 사용)
      expect(screen.getByTestId('validation-result')).toHaveTextContent('[VALID]');
    });
  });

  it('유효하지 않은 UUID 입력 후 검증 시 [INVALID] 상태를 표시해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: 'invalid-uuid' },
    });
    // Enter 키로 검증 실행
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('validation-result')).toHaveTextContent('[INVALID]');
    });
  });

  it('v4 UUID의 버전을 올바르게 감지해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      // 결과 영역에서 버전 정보 확인 (대문자 V4)
      expect(screen.getByTestId('validation-result')).toHaveTextContent('V4');
    });
  });

  it('v7 UUID의 버전을 올바르게 감지해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    // v7 UUID 예시
    fireEvent.change(input, {
      target: { value: '01936b2a-8e5f-7c5e-8b5d-123456789abc' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      // 결과 영역에서 버전 정보 확인 (대문자 V7)
      expect(screen.getByTestId('validation-result')).toHaveTextContent('V7');
    });
  });

  it('CLR 버튼 클릭 시 입력을 지워야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('validation-result')).toHaveTextContent('[VALID]');
    });

    const clearBtn = screen.getByRole('button', { name: /입력 지우기/i });
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('Enter 키로 검증을 실행해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');

    // 유효하지 않은 UUID 입력
    fireEvent.change(input, { target: { value: '550e8400' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('validation-result')).toHaveTextContent('[INVALID]');
    });

    // 유효한 UUID로 변경 후 재검증
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('validation-result')).toHaveTextContent('[VALID]');
    });
  });

  it('허용되는 포맷 안내가 표시되어야 함', () => {
    render(<UuidValidator />);
    expect(screen.getByText('// ACCEPTED_FORMATS')).toBeInTheDocument();
  });
});

describe('UuidValidator 히스토리', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('검증 후 히스토리에 추가되어야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      // 히스토리 섹션이 표시됨
      expect(screen.getByText('// VALIDATION_HISTORY')).toBeInTheDocument();
      // localStorage에 저장됨
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'uuid-validation-history',
        expect.any(String)
      );
    });
  });

  it('히스토리 카운트가 표시되어야 함', async () => {
    render(<UuidValidator />);

    // 초기 상태 - 빈 히스토리
    expect(screen.getByText('[0]')).toBeInTheDocument();

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      // 히스토리 추가 후 카운트 증가
      expect(screen.getByText('[1]')).toBeInTheDocument();
    });
  });

  it('히스토리 Clear All 버튼이 동작해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('[1]')).toBeInTheDocument();
    });

    // Clear All 버튼 클릭
    const clearAllBtn = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearAllBtn);

    await waitFor(() => {
      expect(screen.getByText('[0]')).toBeInTheDocument();
      expect(screen.getByText('No validation history yet')).toBeInTheDocument();
    });
  });

  it('히스토리 아이템 삭제([RM]) 버튼이 동작해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('[1]')).toBeInTheDocument();
    });

    // [RM] 버튼 클릭
    const removeBtn = screen.getByLabelText('히스토리에서 삭제');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.getByText('[0]')).toBeInTheDocument();
    });
  });

  it('빈 히스토리 상태에서 Clear All 버튼이 비활성화되어야 함', () => {
    render(<UuidValidator />);

    const clearAllBtn = screen.getByRole('button', { name: /clear/i });
    expect(clearAllBtn).toBeDisabled();
  });

  it('유효하지 않은 UUID도 히스토리에 추가되어야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: 'invalid-uuid' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('[1]')).toBeInTheDocument();
      // 히스토리 아이템에 [INVALID] 표시
      expect(screen.getAllByText('[INVALID]').length).toBeGreaterThanOrEqual(2); // 결과 + 히스토리
    });
  });
});
