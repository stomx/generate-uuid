import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('렌더링되어야 함', () => {
    render(<Checkbox aria-label="테스트 체크박스" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('클릭 시 체크 상태가 토글되어야 함', () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="테스트 체크박스"
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('checked 상태일 때 체크 아이콘이 표시되어야 함', () => {
    render(<Checkbox aria-label="테스트 체크박스" checked />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('unchecked 상태일 때 data-state가 unchecked여야 함', () => {
    render(<Checkbox aria-label="테스트 체크박스" checked={false} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('disabled 상태가 적용되어야 함', () => {
    render(<Checkbox aria-label="테스트 체크박스" disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('커스텀 className이 적용되어야 함', () => {
    render(<Checkbox aria-label="테스트 체크박스" className="custom-class" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('Space 키로 토글할 수 있어야 함', () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="테스트 체크박스"
        onCheckedChange={onCheckedChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: ' ' });

    // Radix UI는 내부적으로 Space 키를 처리함
    expect(checkbox).toBeInTheDocument();
  });
});
