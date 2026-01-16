import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassButton } from '../GlassButton';

describe('GlassButton', () => {
  it('children을 렌더링해야 함', () => {
    render(<GlassButton>Click me</GlassButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('glassmorphism 스타일이 적용되어야 함', () => {
    render(<GlassButton>Test</GlassButton>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('backdrop-blur');
    expect(button.className).toContain('rounded-xl');
  });

  describe('variant', () => {
    it('기본 variant는 default여야 함', () => {
      render(<GlassButton>Test</GlassButton>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-white/15');
    });

    it('primary variant를 적용할 수 있어야 함', () => {
      render(<GlassButton variant="primary">Primary</GlassButton>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-purple-500/80');
    });

    it('ghost variant를 적용할 수 있어야 함', () => {
      render(<GlassButton variant="ghost">Ghost</GlassButton>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('size', () => {
    it('기본 size는 md여야 함', () => {
      render(<GlassButton>Test</GlassButton>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
    });

    it('sm size를 적용할 수 있어야 함', () => {
      render(<GlassButton size="sm">Small</GlassButton>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
    });

    it('lg size를 적용할 수 있어야 함', () => {
      render(<GlassButton size="lg">Large</GlassButton>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
    });
  });

  describe('disabled 상태', () => {
    it('disabled=true일 때 버튼이 비활성화되어야 함', () => {
      render(<GlassButton disabled>Disabled</GlassButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disabled=true일 때 클릭 이벤트가 발생하지 않아야 함', () => {
      const handleClick = vi.fn();
      render(<GlassButton disabled onClick={handleClick}>Disabled</GlassButton>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('이벤트 핸들링', () => {
    it('클릭 이벤트를 처리해야 함', () => {
      const handleClick = vi.fn();
      render(<GlassButton onClick={handleClick}>Click</GlassButton>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('className 전달', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<GlassButton className="custom-class">Test</GlassButton>);
      expect(screen.getByRole('button').className).toContain('custom-class');
    });
  });
});
