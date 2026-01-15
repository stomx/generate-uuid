'use client';

import type { SupportedUuidVersion } from '@/types/uuid';

interface Version {
  id: SupportedUuidVersion;
  label: string;
  description: string;
  badge: string;
}

const VERSIONS: (Version & { shortcut: string })[] = [
  { id: 'v1', label: 'V1', description: 'Timestamp-based', badge: 'TIME', shortcut: 'Q' },
  { id: 'v4', label: 'V4', description: 'Random', badge: 'RAND', shortcut: 'W' },
  { id: 'v7', label: 'V7', description: 'Sortable', badge: 'SORT', shortcut: 'E' },
];

interface VersionSelectorProps {
  selected: SupportedUuidVersion;
  onChange: (version: SupportedUuidVersion) => void;
}

export function VersionSelector({ selected, onChange }: VersionSelectorProps) {
  return (
    <div role="radiogroup" aria-label="UUID 버전 선택" className="flex gap-2 p-1 -m-1">
      {VERSIONS.map((version) => {
        const isSelected = selected === version.id;
        return (
          <button
            key={version.id}
            role="radio"
            aria-checked={isSelected}
            data-testid={`version-${version.id}`}
            onClick={() => onChange(version.id)}
            className={`
              flex-1 relative px-4 py-4
              border transition-all duration-150
              group focus:outline-none
              focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--accent-mint)]
              ${isSelected
                ? 'bg-bg-elevated border-accent-mint text-accent-mint shadow-glow-mint'
                : 'bg-bg-surface border-border-subtle text-text-secondary hover:border-border-dashed hover:bg-bg-hover'
              }
            `}
          >
            {/* Shortcut hint */}
            <div className={`
              absolute top-2 left-2
              px-1 py-0.5
              font-mono text-[10px]
              border
              ${isSelected
                ? 'border-accent-mint/30 text-accent-mint/50'
                : 'border-border-dashed text-text-muted/50'
              }
            `}>
              {version.shortcut}
            </div>

            {/* Version label */}
            <div className="font-mono text-2xl font-bold tracking-tighter mt-2">
              {version.label}
            </div>

            {/* Description */}
            <div className={`
              font-mono text-xs uppercase tracking-wider mt-1
              ${isSelected ? 'text-accent-mint/70' : 'text-text-muted'}
            `}>
              {version.description}
            </div>

            {/* Badge */}
            <div className={`
              absolute top-2 right-2
              px-1.5 py-0.5
              font-mono text-[10px] uppercase
              border
              ${isSelected
                ? 'border-accent-mint/50 text-accent-mint/70'
                : 'border-border-dashed text-text-muted'
              }
            `}>
              {version.badge}
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-mint" />
            )}
          </button>
        );
      })}
    </div>
  );
}
