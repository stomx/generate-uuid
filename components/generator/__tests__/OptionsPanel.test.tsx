import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionsPanel } from '../OptionsPanel';
import type { UuidOptions } from '@/types/uuid';

describe('OptionsPanel', () => {
  const defaultOptions: UuidOptions = {
    count: 1,
    uppercase: false,
    withHyphens: true,
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('렌더링', () => {
    it('Count 레이블을 표시해야 함', () => {
      render(<OptionsPanel options={defaultOptions} onChange={mockOnChange} />);

      expect(screen.getByText('Count')).toBeInTheDocument();
    });

    it('Uppercase 체크박스를 표시해야 함', () => {
      render(<OptionsPanel options={defaultOptions} onChange={mockOnChange} />);

      expect(screen.getByRole('checkbox', { name: /uppercase/i })).toBeInTheDocument();
    });

    it('No Hyphens 체크박스를 표시해야 함', () => {
      render(<OptionsPanel options={defaultOptions} onChange={mockOnChange} />);

      expect(screen.getByRole('checkbox', { name: /no.*hyphen/i })).toBeInTheDocument();
    });
  });

  describe('Count Select', () => {
    it('현재 count 값을 표시해야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, count: 5 }} onChange={mockOnChange} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('5');
    });

    it('count=1이 기본값으로 표시되어야 함', () => {
      render(<OptionsPanel options={defaultOptions} onChange={mockOnChange} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('1');
    });

    it('combobox가 렌더링되어야 함', () => {
      render(<OptionsPanel options={defaultOptions} onChange={mockOnChange} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Uppercase Checkbox', () => {
    it('uppercase=false일 때 체크되지 않아야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, uppercase: false }} onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox', { name: /uppercase/i });
      expect(checkbox).not.toBeChecked();
    });

    it('uppercase=true일 때 체크되어야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, uppercase: true }} onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox', { name: /uppercase/i });
      expect(checkbox).toBeChecked();
    });

    it('체크박스 클릭 시 onChange가 uppercase=true로 호출되어야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, uppercase: false }} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('checkbox', { name: /uppercase/i }));

      expect(mockOnChange).toHaveBeenCalledWith({ uppercase: true });
    });

    it('체크 해제 시 onChange가 uppercase=false로 호출되어야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, uppercase: true }} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('checkbox', { name: /uppercase/i }));

      expect(mockOnChange).toHaveBeenCalledWith({ uppercase: false });
    });
  });

  describe('No Hyphens Checkbox', () => {
    it('withHyphens=true일 때 체크되지 않아야 함 (No Hyphens = unchecked)', () => {
      render(<OptionsPanel options={{ ...defaultOptions, withHyphens: true }} onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox', { name: /no.*hyphen/i });
      expect(checkbox).not.toBeChecked();
    });

    it('withHyphens=false일 때 체크되어야 함 (No Hyphens = checked)', () => {
      render(<OptionsPanel options={{ ...defaultOptions, withHyphens: false }} onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox', { name: /no.*hyphen/i });
      expect(checkbox).toBeChecked();
    });

    it('체크박스 클릭 시 onChange가 withHyphens=false로 호출되어야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, withHyphens: true }} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('checkbox', { name: /no.*hyphen/i }));

      expect(mockOnChange).toHaveBeenCalledWith({ withHyphens: false });
    });

    it('체크 해제 시 onChange가 withHyphens=true로 호출되어야 함', () => {
      render(<OptionsPanel options={{ ...defaultOptions, withHyphens: false }} onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole('checkbox', { name: /no.*hyphen/i }));

      expect(mockOnChange).toHaveBeenCalledWith({ withHyphens: true });
    });
  });

  describe('다양한 count 값', () => {
    const countValues = [1, 5, 10, 20, 50, 100];

    countValues.forEach((count) => {
      it(`count=${count}이 올바르게 표시되어야 함`, () => {
        render(<OptionsPanel options={{ ...defaultOptions, count }} onChange={mockOnChange} />);

        expect(screen.getByRole('combobox')).toHaveTextContent(String(count));
      });
    });
  });

  describe('옵션 조합', () => {
    it('모든 옵션이 활성화된 상태를 렌더링해야 함', () => {
      const allEnabledOptions: UuidOptions = {
        count: 10,
        uppercase: true,
        withHyphens: false,
      };

      render(<OptionsPanel options={allEnabledOptions} onChange={mockOnChange} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('10');
      expect(screen.getByRole('checkbox', { name: /uppercase/i })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: /no.*hyphen/i })).toBeChecked();
    });
  });
});
