'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Glassmorphism 스타일 입력 컴포넌트
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2
            bg-white/10 dark:bg-black/20
            backdrop-blur-sm
            border border-white/20 dark:border-white/10
            rounded-xl
            text-white placeholder-white/40
            font-mono
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400/50 focus:ring-red-400/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
