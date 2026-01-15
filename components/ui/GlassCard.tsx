'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Glassmorphism 스타일 카드 컴포넌트
 */
export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        bg-white/10 dark:bg-black/20
        backdrop-blur-md
        border border-white/20 dark:border-white/10
        rounded-2xl
        shadow-lg shadow-black/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}
