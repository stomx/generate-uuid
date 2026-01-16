import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UuidValidator } from '../UuidValidator';

describe('UuidValidator', () => {
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
