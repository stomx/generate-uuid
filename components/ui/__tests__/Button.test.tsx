import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('children을 렌더링해야 함', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  describe('variant', () => {
    it('기본 variant는 secondary여야 함', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-bg-surface');
    });

    it('primary variant를 적용할 수 있어야 함', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-accent-mint');
    });

    it('ghost variant를 적용할 수 있어야 함', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });

    it('danger variant를 적용할 수 있어야 함', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-accent-red');
    });
  });

  describe('size', () => {
    it('기본 size는 md여야 함', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
    });

    it('sm size를 적용할 수 있어야 함', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
    });

    it('lg size를 적용할 수 있어야 함', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
    });
  });

  describe('active 상태', () => {
    it('active=true일 때 활성 스타일이 적용되어야 함', () => {
      render(<Button active>Active</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-bg-elevated');
      expect(button.className).toContain('border-accent-mint');
    });

    it('active=false일 때 활성 스타일이 없어야 함', () => {
      render(<Button active={false}>Inactive</Button>);
      const button = screen.getByRole('button');
      // active 스타일이 명시적으로 없어야 함 (기본 secondary 스타일)
      expect(button.className).not.toContain('border-accent-mint text-accent-mint');
    });
  });

  describe('disabled 상태', () => {
    it('disabled=true일 때 버튼이 비활성화되어야 함', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disabled=true일 때 opacity 스타일이 적용되어야 함', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled:opacity-40');
    });
  });

  describe('이벤트 핸들링', () => {
    it('클릭 이벤트를 처리해야 함', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled일 때 클릭 이벤트가 발생하지 않아야 함', () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('className 전달', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
  });

  describe('HTML 속성 전달', () => {
    it('type 속성이 전달되어야 함', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('aria-label이 전달되어야 함', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });
  });
});
