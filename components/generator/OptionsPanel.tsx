'use client';

import type { UuidOptions } from '@/types/uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from '@/components/ui';

interface OptionsPanelProps {
  options: UuidOptions;
  onChange: (options: Partial<UuidOptions>) => void;
}

const COUNT_OPTIONS = [1, 5, 10, 20, 50, 100];

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  return (
    <div className="flex items-center gap-x-4 sm:gap-x-6">
      {/* Count selector */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <span className="text-text-muted font-mono text-[10px] sm:text-xs uppercase">
          Count
        </span>
        <Select
          value={String(options.count)}
          onValueChange={(value) => onChange({ count: Number(value) })}
        >
          <SelectTrigger className="min-w-[50px] sm:min-w-[60px]" aria-label="UUID 생성 개수">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNT_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Uppercase toggle */}
      <label className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group">
        <Checkbox
          id="uppercase"
          checked={options.uppercase}
          onCheckedChange={(checked) =>
            onChange({ uppercase: checked === true })
          }
        />
        <span className="text-text-secondary font-mono text-[10px] sm:text-xs uppercase group-hover:text-text-primary transition-colors select-none">
          <span className="hidden sm:inline">Uppercase</span>
          <span className="sm:hidden">UPPER</span>
        </span>
      </label>

      {/* No hyphens toggle */}
      <label className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group">
        <Checkbox
          id="no-hyphens"
          checked={!options.withHyphens}
          onCheckedChange={(checked) =>
            onChange({ withHyphens: checked !== true })
          }
        />
        <span className="text-text-secondary font-mono text-[10px] sm:text-xs uppercase group-hover:text-text-primary transition-colors select-none">
          <span className="hidden sm:inline">No Hyphens</span>
          <span className="sm:hidden">NO -</span>
        </span>
      </label>
    </div>
  );
}
