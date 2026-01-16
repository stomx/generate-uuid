import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../Select';

// jsdom에서 scrollIntoView mock
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// 테스트용 Select 컴포넌트 (Content 없이 트리거만)
function TestSelectTrigger({
  value,
  disabled = false,
  placeholder = '선택하세요',
}: {
  value?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <Select value={value} disabled={disabled}>
      <SelectTrigger aria-label="테스트 셀렉트">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
    </Select>
  );
}

describe('Select', () => {
  it('트리거가 렌더링되어야 함', () => {
    render(<TestSelectTrigger />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('placeholder가 표시되어야 함', () => {
    render(<TestSelectTrigger placeholder="항목을 선택하세요" />);
    expect(screen.getByText('항목을 선택하세요')).toBeInTheDocument();
  });

  it('disabled 상태가 적용되어야 함', () => {
    render(<TestSelectTrigger disabled />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('aria-label이 적용되어야 함', () => {
    render(<TestSelectTrigger />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-label', '테스트 셀렉트');
  });

  it('aria-expanded가 false로 시작해야 함', () => {
    render(<TestSelectTrigger />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SelectTrigger', () => {
  it('커스텀 className이 적용되어야 함', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger-class">
          <SelectValue />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('custom-trigger-class');
  });

  it('chevron 아이콘이 렌더링되어야 함', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
      </Select>
    );

    // SVG 아이콘 확인
    const trigger = screen.getByRole('combobox');
    const svg = trigger.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('SelectContent', () => {
  it('컴포넌트가 export되어야 함', () => {
    expect(SelectContent).toBeDefined();
  });
});

describe('SelectItem', () => {
  it('컴포넌트가 export되어야 함', () => {
    expect(SelectItem).toBeDefined();
  });
});
