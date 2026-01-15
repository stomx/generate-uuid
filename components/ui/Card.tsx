'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
  glow?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  glow = false
}: CardProps) {
  const baseStyles = 'relative';

  const variantStyles = {
    default: 'bg-bg-surface border border-border-subtle',
    elevated: 'bg-bg-elevated border border-border-subtle',
    bordered: 'bg-transparent border border-dashed border-border-dashed',
  };

  const glowStyles = glow ? 'shadow-glow-mint' : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${glowStyles} ${className}`}>
      {children}
    </div>
  );
}
