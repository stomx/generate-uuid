import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UuidParser } from '../UuidParser';
import { __resetSessionStorageStores } from '@/hooks/useSessionStorage';

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

// crypto.randomUUID 모킹
vi.stubGlobal('crypto', {
  ...crypto,
  randomUUID: vi.fn(() => 'mock-uuid-id'),
});

describe('UuidParser', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
    __resetSessionStorageStores();
  });
  it('입력 필드가 렌더링되어야 함', () => {
    render(<UuidParser />);
    expect(
      screen.getByPlaceholderText('파싱할 UUID를 입력하세요...')
    ).toBeInTheDocument();
  });

  it('PARSE 버튼이 있어야 함', () => {
    render(<UuidParser />);
    expect(screen.getByText('[ PARSE ]')).toBeInTheDocument();
  });

  it('CLR 버튼이 있어야 함', () => {
    render(<UuidParser />);
    expect(screen.getByRole('button', { name: /입력 지우기/i })).toBeInTheDocument();
  });

  it('v4 UUID 파싱 시 랜덤 비트를 표시해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });
  });

  it('v7 UUID 파싱 시 타임스탬프를 추출해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    // v7 UUID (2024년경 타임스탬프)
    fireEvent.change(input, {
      target: { value: '01936b2a-8e5f-7c5e-8b5d-123456789abc' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
      // 파서 결과에 타임스탬프 관련 필드가 있는지 확인 (히스토리에도 있을 수 있으므로 getAllBy 사용)
      expect(screen.getAllByText('타임스탬프').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('유효하지 않은 UUID 입력 시 에러를 표시해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, { target: { value: 'invalid-uuid' } });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      // 히스토리에도 [ERROR]가 있을 수 있으므로 getAllBy 사용
      expect(screen.getAllByText('[ERROR]').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('지원하지 않는 버전(v3/v5) 입력 시 에러를 표시해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    // v5 UUID (버전 5 = 5xxx)
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-51d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getAllByText('[ERROR]').length).toBeGreaterThanOrEqual(1);
      // 히스토리에도 에러 메시지가 있을 수 있으므로 getAllBy 사용
      expect(screen.getAllByText(/지원하지 않습니다/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('CLR 버튼 클릭 시 입력과 결과를 지워야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: /입력 지우기/i });
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(screen.queryByText('SUCCESS')).not.toBeInTheDocument();
      expect(input).toHaveValue('');
    });
  });

  it('지원 버전 안내가 표시되어야 함', () => {
    render(<UuidParser />);
    expect(screen.getByText('// SUPPORTED_VERSIONS')).toBeInTheDocument();
  });

  it('Enter 키 입력 시 파싱을 실행해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });
  });
});

describe('UuidParser 히스토리', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
    __resetSessionStorageStores();
  });

  it('파싱 후 히스토리에 추가되어야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      // 히스토리 섹션이 표시됨
      expect(screen.getByText('// PARSE_HISTORY')).toBeInTheDocument();
      // sessionStorage에 저장됨
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'uuid-parse-history',
        expect.any(String)
      );
    });
  });

  it('히스토리 카운트가 표시되어야 함', async () => {
    render(<UuidParser />);

    // 초기 상태 - 빈 히스토리 (useSyncExternalStore 초기화 대기)
    await waitFor(() => {
      expect(screen.getByText('[0]')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      // 히스토리 추가 후 카운트 증가
      expect(screen.getByText('[1]')).toBeInTheDocument();
    });
  });

  it('히스토리 Clear All 버튼이 동작해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText('[1]')).toBeInTheDocument();
    });

    // Clear All 버튼 클릭
    const clearAllBtn = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearAllBtn);

    await waitFor(() => {
      expect(screen.getByText('[0]')).toBeInTheDocument();
      expect(screen.getByText('No parse history yet')).toBeInTheDocument();
    });
  });

  it('히스토리 아이템 삭제([RM]) 버튼이 동작해야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

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
    render(<UuidParser />);

    const clearAllBtn = screen.getByRole('button', { name: /clear/i });
    expect(clearAllBtn).toBeDisabled();
  });

  it('에러 결과도 히스토리에 추가되어야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: 'invalid-uuid' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText('[1]')).toBeInTheDocument();
      // 히스토리 아이템에 [ERROR] 표시
      expect(screen.getAllByText('[ERROR]').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('성공한 파싱 결과가 히스토리에 [PARSED]로 표시되어야 함', async () => {
    render(<UuidParser />);

    const input = screen.getByPlaceholderText('파싱할 UUID를 입력하세요...');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    const parseBtn = screen.getByText('[ PARSE ]');
    fireEvent.click(parseBtn);

    await waitFor(() => {
      expect(screen.getByText('[PARSED]')).toBeInTheDocument();
    });
  });
});
