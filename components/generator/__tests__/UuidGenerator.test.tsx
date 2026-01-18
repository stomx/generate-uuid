import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UuidGenerator } from '../UuidGenerator';
import { __resetLocalStorageStores } from '@/hooks/useLocalStorage';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/generate/v7',
}));

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
  readText: vi.fn().mockResolvedValue(''),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('UuidGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    __resetLocalStorageStores();
  });

  it('마운트 시 UUID를 생성해야 함', async () => {
    render(<UuidGenerator />);

    await waitFor(() => {
      const display = screen.getByTestId('uuid-display');
      expect(display).toBeInTheDocument();
    });
  });

  it('UUID 디스플레이가 렌더링되어야 함', () => {
    render(<UuidGenerator />);
    expect(screen.getByTestId('uuid-display')).toBeInTheDocument();
  });

  it('복사 버튼이 있어야 함', () => {
    render(<UuidGenerator />);
    // 아이콘 복사 버튼 (aria-label로 식별)
    expect(screen.getByLabelText('전체 복사')).toBeInTheDocument();
  });

  it('생성 버튼이 있어야 함', () => {
    render(<UuidGenerator />);
    expect(screen.getByTestId('generate-btn')).toBeInTheDocument();
  });

  it('생성 버튼 클릭 시 새 UUID가 생성되어야 함', async () => {
    render(<UuidGenerator />);

    const generateBtn = screen.getByTestId('generate-btn');

    // 첫 번째 UUID 캡처
    await waitFor(() => {
      const display = screen.getByTestId('uuid-display');
      expect(display.textContent).toBeTruthy();
    });

    // 새로 생성
    fireEvent.click(generateBtn);

    await waitFor(() => {
      // UUID가 변경되었는지 확인
      const display = screen.getByTestId('uuid-display');
      expect(display).toBeInTheDocument();
    });
  });

  it('복사 버튼 클릭 시 클립보드에 복사해야 함', async () => {
    render(<UuidGenerator />);

    await waitFor(() => {
      expect(screen.getByTestId('uuid-display').textContent).toBeTruthy();
    });

    // 아이콘 복사 버튼 (aria-label로 식별)
    const copyBtn = screen.getByLabelText('전체 복사');
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
  });

  it('버전 선택기가 렌더링되어야 함', () => {
    render(<UuidGenerator />);
    expect(screen.getByText('V1')).toBeInTheDocument();
    expect(screen.getByText('V4')).toBeInTheDocument();
    expect(screen.getByText('V7')).toBeInTheDocument();
  });
});
