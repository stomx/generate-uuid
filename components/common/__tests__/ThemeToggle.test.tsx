import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

// useTheme 훅 모킹
const mockCycleTheme = vi.fn();
vi.mock('@/hooks', () => ({
  useTheme: vi.fn(() => ({
    theme: 'system',
    resolved: 'dark',
    setTheme: vi.fn(),
    cycleTheme: mockCycleTheme,
  })),
}));

// 동적 import로 모킹된 훅 사용
import { useTheme } from '@/hooks';
const mockUseTheme = vi.mocked(useTheme);

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      resolved: 'dark',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });
  });

  it('버튼이 렌더링되어야 함', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('system 테마일 때 SYS가 표시되어야 함', () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      resolved: 'dark',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByText('SYS')).toBeInTheDocument();
  });

  it('light 테마일 때 LT가 표시되어야 함', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      resolved: 'light',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByText('LT')).toBeInTheDocument();
  });

  it('dark 테마일 때 DK가 표시되어야 함', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      resolved: 'dark',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByText('DK')).toBeInTheDocument();
  });

  it('클릭 시 cycleTheme이 호출되어야 함', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCycleTheme).toHaveBeenCalledTimes(1);
  });

  it('system 테마일 때 올바른 aria-label이 있어야 함', () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      resolved: 'dark',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      '시스템 설정 사용 중 - 라이트 모드로 전환'
    );
  });

  it('light 테마일 때 올바른 aria-label이 있어야 함', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      resolved: 'light',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      '라이트 모드 - 다크 모드로 전환'
    );
  });

  it('dark 테마일 때 올바른 aria-label이 있어야 함', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      resolved: 'dark',
      setTheme: vi.fn(),
      cycleTheme: mockCycleTheme,
    });

    render(<ThemeToggle />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      '다크 모드 - 시스템 설정으로 전환'
    );
  });
});
