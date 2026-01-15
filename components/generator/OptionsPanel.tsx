'use client';

import type { UuidOptions } from '@/types/uuid';

interface OptionsPanelProps {
  options: UuidOptions;
  onChange: (options: Partial<UuidOptions>) => void;
}

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 py-4 border-t border-border-subtle">
      {/* Count selector */}
      <label className="flex items-center gap-3">
        <span className="text-text-muted font-mono text-xs uppercase">Count</span>
        <select
          value={options.count}
          onChange={(e) => onChange({ count: Number(e.target.value) })}
          className="
            bg-bg-surface border border-border-subtle
            px-3 py-1.5
            font-mono text-sm text-text-primary
            focus:outline-none focus:border-accent-mint
            cursor-pointer
          "
        >
          {[1, 5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n} className="bg-bg-deep text-text-primary">
              {n}
            </option>
          ))}
        </select>
      </label>

      {/* Uppercase toggle */}
      <label className="flex items-center gap-3 cursor-pointer group focus-within:text-accent-mint">
        <div className={`
          w-4 h-4 border flex items-center justify-center
          font-mono text-[10px]
          transition-colors duration-150
          group-focus-within:border-accent-mint
          ${options.uppercase
            ? 'bg-accent-mint border-accent-mint text-bg-deep'
            : 'border-border-subtle text-transparent group-hover:border-text-muted'
          }
        `}>
          {options.uppercase && '✓'}
        </div>
        <input
          type="checkbox"
          checked={options.uppercase}
          onChange={(e) => onChange({ uppercase: e.target.checked })}
          className="sr-only focus:outline-none"
        />
        <span className="text-text-secondary font-mono text-xs uppercase group-hover:text-text-primary transition-colors">
          Uppercase
        </span>
      </label>

      {/* No hyphens toggle */}
      <label className="flex items-center gap-3 cursor-pointer group focus-within:text-accent-mint">
        <div className={`
          w-4 h-4 border flex items-center justify-center
          font-mono text-[10px]
          transition-colors duration-150
          group-focus-within:border-accent-mint
          ${!options.withHyphens
            ? 'bg-accent-mint border-accent-mint text-bg-deep'
            : 'border-border-subtle text-transparent group-hover:border-text-muted'
          }
        `}>
          {!options.withHyphens && '✓'}
        </div>
        <input
          type="checkbox"
          checked={!options.withHyphens}
          onChange={(e) => onChange({ withHyphens: !e.target.checked })}
          className="sr-only focus:outline-none"
        />
        <span className="text-text-secondary font-mono text-xs uppercase group-hover:text-text-primary transition-colors">
          No Hyphens
        </span>
      </label>
    </div>
  );
}
