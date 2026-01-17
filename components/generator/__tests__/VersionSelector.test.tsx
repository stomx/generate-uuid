import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VersionSelector } from '../VersionSelector';

describe('VersionSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('렌더링', () => {
    it('세 가지 버전 버튼을 렌더링해야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      expect(screen.getByTestId('version-v1')).toBeInTheDocument();
      expect(screen.getByTestId('version-v4')).toBeInTheDocument();
      expect(screen.getByTestId('version-v7')).toBeInTheDocument();
    });

    it('버전 레이블을 표시해야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      expect(screen.getByText('V1')).toBeInTheDocument();
      expect(screen.getByText('V4')).toBeInTheDocument();
      expect(screen.getByText('V7')).toBeInTheDocument();
    });

    it('radiogroup role이 있어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('각 버튼에 radio role이 있어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });
  });

  describe('선택 상태', () => {
    it('선택된 버전의 aria-checked가 true여야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      expect(screen.getByTestId('version-v4')).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByTestId('version-v1')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByTestId('version-v7')).toHaveAttribute('aria-checked', 'false');
    });

    it('v1 선택 시 v1의 aria-checked가 true여야 함', () => {
      render(<VersionSelector selected="v1" onChange={mockOnChange} />);

      expect(screen.getByTestId('version-v1')).toHaveAttribute('aria-checked', 'true');
    });

    it('v7 선택 시 v7의 aria-checked가 true여야 함', () => {
      render(<VersionSelector selected="v7" onChange={mockOnChange} />);

      expect(screen.getByTestId('version-v7')).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('클릭 이벤트', () => {
    it('v1 클릭 시 onChange가 v1으로 호출되어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      fireEvent.click(screen.getByTestId('version-v1'));

      expect(mockOnChange).toHaveBeenCalledWith('v1');
    });

    it('v4 클릭 시 onChange가 v4로 호출되어야 함', () => {
      render(<VersionSelector selected="v1" onChange={mockOnChange} />);

      fireEvent.click(screen.getByTestId('version-v4'));

      expect(mockOnChange).toHaveBeenCalledWith('v4');
    });

    it('v7 클릭 시 onChange가 v7로 호출되어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      fireEvent.click(screen.getByTestId('version-v7'));

      expect(mockOnChange).toHaveBeenCalledWith('v7');
    });

    it('이미 선택된 버전 클릭 시에도 onChange가 호출되어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      fireEvent.click(screen.getByTestId('version-v4'));

      expect(mockOnChange).toHaveBeenCalledWith('v4');
    });
  });

  describe('단축키 힌트', () => {
    it('단축키 힌트가 표시되어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      expect(screen.getByText('Alt+Q')).toBeInTheDocument();
      expect(screen.getByText('Alt+W')).toBeInTheDocument();
      expect(screen.getByText('Alt+E')).toBeInTheDocument();
    });
  });

  describe('배지 (badge)', () => {
    it('각 버전의 배지를 표시해야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      // badge는 두 곳에서 표시될 수 있음 (모바일 description, 데스크톱 badge)
      expect(screen.getAllByText('TIME').length).toBeGreaterThan(0);
      expect(screen.getAllByText('RAND').length).toBeGreaterThan(0);
      expect(screen.getAllByText('SORT').length).toBeGreaterThan(0);
    });
  });

  describe('접근성', () => {
    it('radiogroup에 aria-label이 있어야 함', () => {
      render(<VersionSelector selected="v4" onChange={mockOnChange} />);

      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'UUID 버전 선택');
    });
  });
});
