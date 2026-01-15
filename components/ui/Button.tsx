'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  active = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-mono font-medium uppercase tracking-wider
    border transition-all duration-150
    disabled:opacity-40 disabled:cursor-not-allowed
    focus:outline-none focus-visible:border-accent-mint whitespace-nowrap
  `;

  const variantStyles = {
    primary: `
      bg-accent-mint text-bg-deep border-accent-mint
      hover:bg-accent-mint-dim hover:border-accent-mint-dim
      active:scale-[0.98]
      shadow-glow-mint
      focus-visible:shadow-[0_0_0_2px_var(--bg-deep),0_0_0_4px_var(--text-primary)]
    `,
    secondary: `
      bg-transparent text-text-primary border-border-subtle
      hover:bg-bg-hover hover:border-text-muted
      active:bg-bg-elevated
      ${active ? 'bg-bg-elevated border-accent-mint text-accent-mint' : ''}
    `,
    ghost: `
      bg-transparent text-text-secondary border-transparent
      hover:text-text-primary hover:bg-bg-hover
      active:bg-bg-elevated
    `,
    danger: `
      bg-transparent text-accent-red border-accent-red/50
      hover:bg-accent-red/10 hover:border-accent-red
      active:bg-accent-red/20
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
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
