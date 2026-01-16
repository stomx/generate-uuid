import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
  it('children을 렌더링해야 함', () => {
    render(<GlassCard>Card content</GlassCard>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('glassmorphism 스타일이 적용되어야 함', () => {
    render(<GlassCard>Test</GlassCard>);
    const card = screen.getByText('Test').closest('div');
    expect(card?.className).toContain('backdrop-blur-md');
    expect(card?.className).toContain('rounded-2xl');
  });

  it('배경 투명도 스타일이 적용되어야 함', () => {
    render(<GlassCard>Test</GlassCard>);
    const card = screen.getByText('Test').closest('div');
    expect(card?.className).toContain('bg-white/10');
  });

  it('테두리 스타일이 적용되어야 함', () => {
    render(<GlassCard>Test</GlassCard>);
    const card = screen.getByText('Test').closest('div');
    expect(card?.className).toContain('border');
    expect(card?.className).toContain('border-white/20');
  });

  it('그림자 스타일이 적용되어야 함', () => {
    render(<GlassCard>Test</GlassCard>);
    const card = screen.getByText('Test').closest('div');
    expect(card?.className).toContain('shadow-lg');
  });

  describe('className 전달', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<GlassCard className="p-6">Test</GlassCard>);
      const card = screen.getByText('Test').closest('div');
      expect(card?.className).toContain('p-6');
    });

    it('기존 스타일과 함께 커스텀 className이 적용되어야 함', () => {
      render(<GlassCard className="my-custom-class">Combined</GlassCard>);
      const card = screen.getByText('Combined').closest('div');
      expect(card?.className).toContain('backdrop-blur-md');
      expect(card?.className).toContain('my-custom-class');
    });
  });

  describe('중첩 콘텐츠', () => {
    it('복잡한 children을 렌더링할 수 있어야 함', () => {
      render(
        <GlassCard>
          <h2>Title</h2>
          <p>Description</p>
        </GlassCard>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });
});
