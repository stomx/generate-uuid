import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('children을 렌더링해야 함', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  describe('variant', () => {
    it('기본 variant는 default여야 함', () => {
      render(<Card>Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card?.className).toContain('bg-bg-surface');
    });

    it('elevated variant를 적용할 수 있어야 함', () => {
      render(<Card variant="elevated">Elevated</Card>);
      const card = screen.getByText('Elevated').closest('div');
      expect(card?.className).toContain('bg-bg-elevated');
    });

    it('bordered variant를 적용할 수 있어야 함', () => {
      render(<Card variant="bordered">Bordered</Card>);
      const card = screen.getByText('Bordered').closest('div');
      expect(card?.className).toContain('bg-transparent');
      expect(card?.className).toContain('border-dashed');
    });
  });

  describe('glow', () => {
    it('glow=false일 때 glow 스타일이 없어야 함', () => {
      render(<Card glow={false}>No glow</Card>);
      const card = screen.getByText('No glow').closest('div');
      expect(card?.className).not.toContain('shadow-glow-mint');
    });

    it('glow=true일 때 glow 스타일이 적용되어야 함', () => {
      render(<Card glow>With glow</Card>);
      const card = screen.getByText('With glow').closest('div');
      expect(card?.className).toContain('shadow-glow-mint');
    });
  });

  describe('className 전달', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<Card className="custom-card">Test</Card>);
      const card = screen.getByText('Test').closest('div');
      expect(card?.className).toContain('custom-card');
    });

    it('기존 스타일과 함께 커스텀 className이 적용되어야 함', () => {
      render(<Card variant="elevated" className="p-4">Combined</Card>);
      const card = screen.getByText('Combined').closest('div');
      expect(card?.className).toContain('bg-bg-elevated');
      expect(card?.className).toContain('p-4');
    });
  });

  describe('중첩 콘텐츠', () => {
    it('복잡한 children을 렌더링할 수 있어야 함', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });
});
