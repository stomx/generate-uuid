import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassInput } from '../GlassInput';

describe('GlassInput', () => {
  it('input 요소를 렌더링해야 함', () => {
    render(<GlassInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('glassmorphism 스타일이 적용되어야 함', () => {
    render(<GlassInput />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('backdrop-blur');
    expect(input.className).toContain('rounded-xl');
  });

  describe('label', () => {
    it('label을 표시해야 함', () => {
      render(<GlassInput label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('label이 input과 연결되어야 함', () => {
      render(<GlassInput label="Username" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });

    it('label이 없으면 label 요소가 없어야 함', () => {
      render(<GlassInput />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('error 메시지를 표시해야 함', () => {
      render(<GlassInput error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('error가 있을 때 role="alert"이 있어야 함', () => {
      render(<GlassInput error="Error message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error가 있을 때 에러 스타일이 적용되어야 함', () => {
      render(<GlassInput error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-red-400/50');
    });

    it('error가 없으면 에러 메시지가 없어야 함', () => {
      render(<GlassInput />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('이벤트 핸들링', () => {
    it('onChange 이벤트를 처리해야 함', () => {
      const handleChange = vi.fn();
      render(<GlassInput onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('onFocus 이벤트를 처리해야 함', () => {
      const handleFocus = vi.fn();
      render(<GlassInput onFocus={handleFocus} />);
      fireEvent.focus(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled 상태', () => {
    it('disabled=true일 때 input이 비활성화되어야 함', () => {
      render(<GlassInput disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('HTML 속성 전달', () => {
    it('placeholder가 전달되어야 함', () => {
      render(<GlassInput placeholder="Enter text..." />);
      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Enter text...');
    });
  });

  describe('className 전달', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<GlassInput className="custom-input" />);
      expect(screen.getByRole('textbox').className).toContain('custom-input');
    });
  });

  describe('ref 전달', () => {
    it('forwardRef로 ref를 전달할 수 있어야 함', () => {
      const ref = vi.fn();
      render(<GlassInput ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
