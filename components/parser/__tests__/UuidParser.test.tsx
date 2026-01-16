import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UuidParser } from '../UuidParser';

describe('UuidParser', () => {
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
