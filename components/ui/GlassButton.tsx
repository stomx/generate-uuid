'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Glassmorphism 스타일 버튼 컴포넌트
 */
export function GlassButton({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...props
}: GlassButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    backdrop-blur-sm
    border
    rounded-xl
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-white/30
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    default: `
      bg-white/15 dark:bg-white/10
      border-white/30 dark:border-white/20
      text-white
      hover:bg-white/25 dark:hover:bg-white/20
      hover:-translate-y-0.5
      active:translate-y-0
    `,
    primary: `
      bg-purple-500/80 dark:bg-purple-600/80
      border-purple-400/50
      text-white
      hover:bg-purple-500/90 dark:hover:bg-purple-600/90
      hover:-translate-y-0.5
      active:translate-y-0
    `,
    ghost: `
      bg-transparent
      border-transparent
      text-white/80
      hover:bg-white/10
      hover:text-white
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
