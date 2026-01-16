import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// 에러를 발생시키는 컴포넌트
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('테스트 에러');
  }
  return <div>정상 렌더링</div>;
}

describe('ErrorBoundary', () => {
  // console.error 모킹 (React 에러 로그 숨김)
  const originalError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('정상적인 children을 렌더링해야 함', () => {
    render(
      <ErrorBoundary>
        <div>정상 컨텐츠</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('정상 컨텐츠')).toBeInTheDocument();
  });

  it('에러 발생 시 기본 에러 UI를 표시해야 함', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('[ERROR]')).toBeInTheDocument();
    expect(screen.getByText('시스템 오류')).toBeInTheDocument();
    expect(screen.getByText('테스트 에러')).toBeInTheDocument();
  });

  it('에러 발생 시 RETRY 버튼이 표시되어야 함', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('커스텀 fallback을 사용할 수 있어야 함', () => {
    render(
      <ErrorBoundary fallback={<div>커스텀 에러 UI</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('커스텀 에러 UI')).toBeInTheDocument();
    expect(screen.queryByText('[ERROR]')).not.toBeInTheDocument();
  });

  it('에러 메시지가 없을 때 기본 메시지가 표시되어야 함', () => {
    // 에러 메시지가 없는 에러를 발생시키는 컴포넌트
    function ThrowEmptyError() {
      throw new Error();
    }

    render(
      <ErrorBoundary>
        <ThrowEmptyError />
      </ErrorBoundary>
    );

    expect(screen.getByText('알 수 없는 오류가 발생했습니다.')).toBeInTheDocument();
  });

  it('RETRY 클릭 시 children을 다시 렌더링해야 함', () => {
    let shouldThrow = true;

    function ConditionalError() {
      if (shouldThrow) {
        throw new Error('테스트 에러');
      }
      return <div>복구 성공</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    // 에러 UI 확인
    expect(screen.getByText('[ERROR]')).toBeInTheDocument();

    // RETRY 전에 에러 조건 해제
    shouldThrow = false;

    // RETRY 클릭
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    // 리렌더 후 정상 컨텐츠 표시
    rerender(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText('복구 성공')).toBeInTheDocument();
  });
});
