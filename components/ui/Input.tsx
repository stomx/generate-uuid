'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3
              bg-bg-surface
              border border-border-subtle
              text-text-primary placeholder-text-muted
              font-mono text-sm
              transition-all duration-150
              focus:outline-none focus:border-accent-mint focus:shadow-glow-mint
              disabled:opacity-40 disabled:cursor-not-allowed
              ${prefix ? 'pl-8' : ''}
              ${error ? 'border-accent-red focus:border-accent-red focus:shadow-none' : ''}
              ${className}
            `}
            {...props}
          />
          {/* Cursor blink effect on focus */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-mint opacity-0 peer-focus:opacity-100 animate-blink pointer-events-none" />
        </div>
        {error && (
          <p className="mt-2 text-xs font-mono text-accent-red" role="alert">
            <span className="text-accent-red/60">[ERROR]</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
