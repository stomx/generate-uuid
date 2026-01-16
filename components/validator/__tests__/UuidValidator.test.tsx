import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UuidValidator } from '../UuidValidator';

describe('UuidValidator', () => {
  it('입력 필드가 렌더링되어야 함', () => {
    render(<UuidValidator />);
    expect(screen.getByTestId('uuid-input')).toBeInTheDocument();
  });

  it('유효한 UUID 입력 시 [VALID] 상태를 표시해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    await waitFor(() => {
      expect(screen.getByText('[VALID]')).toBeInTheDocument();
    });
  });

  it('유효하지 않은 UUID 입력 시 [INVALID] 상태를 표시해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: 'invalid-uuid' },
    });

    await waitFor(() => {
      expect(screen.getByText('[INVALID]')).toBeInTheDocument();
    });
  });

  it('v4 UUID의 버전을 올바르게 감지해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    await waitFor(() => {
      expect(screen.getByText('V4')).toBeInTheDocument();
    });
  });

  it('v7 UUID의 버전을 올바르게 감지해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    // v7 UUID 예시
    fireEvent.change(input, {
      target: { value: '01936b2a-8e5f-7c5e-8b5d-123456789abc' },
    });

    await waitFor(() => {
      expect(screen.getByText('V7')).toBeInTheDocument();
    });
  });

  it('CLR 버튼 클릭 시 입력과 결과를 지워야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    await waitFor(() => {
      expect(screen.getByText('[VALID]')).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: /입력 지우기/i });
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(screen.queryByText('[VALID]')).not.toBeInTheDocument();
      expect(input).toHaveValue('');
    });
  });

  it('실시간으로 입력을 검증해야 함', async () => {
    render(<UuidValidator />);

    const input = screen.getByTestId('uuid-input');

    // 부분 입력 (유효하지 않음)
    fireEvent.change(input, { target: { value: '550e8400' } });

    await waitFor(() => {
      expect(screen.getByText('[INVALID]')).toBeInTheDocument();
    });

    // 전체 입력 (유효함)
    fireEvent.change(input, {
      target: { value: '550e8400-e29b-41d4-a716-446655440000' },
    });

    await waitFor(() => {
      expect(screen.getByText('[VALID]')).toBeInTheDocument();
    });
  });

  it('허용되는 포맷 안내가 표시되어야 함', () => {
    render(<UuidValidator />);
    expect(screen.getByText('// ACCEPTED_FORMATS')).toBeInTheDocument();
  });
});
