import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('input 요소를 렌더링해야 함', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  describe('label', () => {
    it('label을 표시해야 함', () => {
      render(<Input label="Username" />);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('label이 input과 연결되어야 함', () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });

    it('label이 없으면 label 요소가 없어야 함', () => {
      render(<Input />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('커스텀 id가 label에 사용되어야 함', () => {
      render(<Input label="Name" id="custom-id" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Name');
      expect(label).toHaveAttribute('for', 'custom-id');
      expect(input).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('error', () => {
    it('error 메시지를 표시해야 함', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('error가 있을 때 [ERROR] 라벨이 표시되어야 함', () => {
      render(<Input error="Invalid input" />);
      expect(screen.getByText('[ERROR]')).toBeInTheDocument();
    });

    it('error가 있을 때 role="alert"이 있어야 함', () => {
      render(<Input error="Error message" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error가 있을 때 에러 스타일이 적용되어야 함', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-accent-red');
    });

    it('error가 없으면 에러 메시지가 없어야 함', () => {
      render(<Input />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('prefix', () => {
    it('prefix를 표시해야 함', () => {
      render(<Input prefix="$" />);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('prefix가 있을 때 padding이 조정되어야 함', () => {
      render(<Input prefix=">" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('pl-8');
    });

    it('prefix가 없으면 추가 padding이 없어야 함', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).not.toContain('pl-8');
    });
  });

  describe('이벤트 핸들링', () => {
    it('onChange 이벤트를 처리해야 함', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('onFocus 이벤트를 처리해야 함', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('onBlur 이벤트를 처리해야 함', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled 상태', () => {
    it('disabled=true일 때 input이 비활성화되어야 함', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('disabled=true일 때 opacity 스타일이 적용되어야 함', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('disabled:opacity-40');
    });
  });

  describe('HTML 속성 전달', () => {
    it('placeholder가 전달되어야 함', () => {
      render(<Input placeholder="Enter text..." />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text...');
    });

    it('type이 전달되어야 함', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('value와 onChange로 제어할 수 있어야 함', () => {
      const handleChange = vi.fn();
      render(<Input value="controlled" onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('controlled');
    });
  });

  describe('className 전달', () => {
    it('커스텀 className이 적용되어야 함', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('custom-input');
    });
  });

  describe('ref 전달', () => {
    it('forwardRef로 ref를 전달할 수 있어야 함', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
