import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UuidInfoSection } from '../UuidInfoSection';

describe('UuidInfoSection', () => {
  describe('렌더링', () => {
    it('접힌 상태로 초기 렌더링되어야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('버전별 제목을 표시해야 함 (영어)', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      expect(screen.getByText('About UUID v7')).toBeInTheDocument();
    });

    it('버전별 제목을 표시해야 함 (한국어)', () => {
      render(<UuidInfoSection version="v7" lang="ko" />);

      expect(screen.getByText('UUID v7이란?')).toBeInTheDocument();
    });

    it('MORE INFO 토글 텍스트를 표시해야 함', () => {
      render(<UuidInfoSection version="v4" lang="en" />);

      expect(screen.getByText(/MORE INFO/)).toBeInTheDocument();
    });
  });

  describe('토글 동작', () => {
    it('클릭 시 펼쳐져야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(/LESS INFO/)).toBeInTheDocument();
    });

    it('다시 클릭 시 접혀야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button); // 펼치기
      fireEvent.click(button); // 접기

      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText(/MORE INFO/)).toBeInTheDocument();
    });
  });

  describe('버전별 콘텐츠', () => {
    it('v1 설명을 표시해야 함', () => {
      render(<UuidInfoSection version="v1" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/MAC address/i)).toBeInTheDocument();
    });

    it('v4 설명을 표시해야 함', () => {
      render(<UuidInfoSection version="v4" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/122 bits of entropy/i)).toBeInTheDocument();
    });

    it('v7 설명을 표시해야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/modern standard/i)).toBeInTheDocument();
    });

    it('특징 목록을 표시해야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/FEATURES/i)).toBeInTheDocument();
    });

    it('사용 사례 목록을 표시해야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/USE CASES/i)).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('aria-controls 속성이 있어야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'uuid-info-content');
    });

    it('콘텐츠 영역에 올바른 id가 있어야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      expect(document.getElementById('uuid-info-content')).toBeInTheDocument();
    });
  });

  describe('다국어 지원', () => {
    it('한국어 콘텐츠를 표시해야 함', () => {
      render(<UuidInfoSection version="v7" lang="ko" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/특징/)).toBeInTheDocument();
      expect(screen.getByText(/사용 사례/)).toBeInTheDocument();
    });

    it('영어 콘텐츠를 표시해야 함', () => {
      render(<UuidInfoSection version="v7" lang="en" />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText(/Features/i)).toBeInTheDocument();
      expect(screen.getByText(/Use Cases/i)).toBeInTheDocument();
    });
  });
});
