import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabNav } from '../TabNav';

describe('TabNav', () => {
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('모든 탭이 렌더링되어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    expect(screen.getByTestId('tab-generator')).toBeInTheDocument();
    expect(screen.getByTestId('tab-validator')).toBeInTheDocument();
    expect(screen.getByTestId('tab-parser')).toBeInTheDocument();
  });

  it('role="tablist"가 있어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('각 탭에 role="tab"이 있어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('활성 탭에 aria-selected="true"가 설정되어야 함', () => {
    render(<TabNav activeTab="validator" onTabChange={mockOnTabChange} />);

    const validatorTab = screen.getByTestId('tab-validator');
    const generatorTab = screen.getByTestId('tab-generator');

    expect(validatorTab).toHaveAttribute('aria-selected', 'true');
    expect(generatorTab).toHaveAttribute('aria-selected', 'false');
  });

  it('탭 클릭 시 onTabChange가 호출되어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    const validatorTab = screen.getByTestId('tab-validator');
    fireEvent.click(validatorTab);

    expect(mockOnTabChange).toHaveBeenCalledWith('validator');
  });

  it('다른 탭 클릭 시 해당 탭 ID가 전달되어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    fireEvent.click(screen.getByTestId('tab-parser'));
    expect(mockOnTabChange).toHaveBeenCalledWith('parser');

    fireEvent.click(screen.getByTestId('tab-generator'));
    expect(mockOnTabChange).toHaveBeenCalledWith('generator');
  });

  it('aria-controls가 올바르게 설정되어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    expect(screen.getByTestId('tab-generator')).toHaveAttribute(
      'aria-controls',
      'panel-generator'
    );
    expect(screen.getByTestId('tab-validator')).toHaveAttribute(
      'aria-controls',
      'panel-validator'
    );
    expect(screen.getByTestId('tab-parser')).toHaveAttribute(
      'aria-controls',
      'panel-parser'
    );
  });

  it('단축키 표시가 있어야 함', () => {
    render(<TabNav activeTab="generator" onTabChange={mockOnTabChange} />);

    // 데스크톱 뷰에서 단축키 표시
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();
    expect(screen.getByText('[3]')).toBeInTheDocument();
  });
});
