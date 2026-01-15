'use client';

import { Component, ReactNode } from 'react';
import { Card, Button } from '@/components/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * React 에러를 캐치하고 대체 UI를 표시
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-accent-red font-mono text-lg">[ERROR]</span>
              <span className="text-text-primary font-mono">시스템 오류</span>
            </div>
            <p className="text-text-secondary font-mono text-sm mb-6">
              {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            <Button onClick={this.handleRetry} variant="primary">
              [ RETRY ]
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
