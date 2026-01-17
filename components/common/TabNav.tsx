'use client';

import Link from 'next/link';

export type TabId = 'generator' | 'validator' | 'parser';

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  shortcut: string;
  href: string;
}

const TABS: Tab[] = [
  { id: 'generator', label: 'Generate', shortLabel: 'GEN', shortcut: '1', href: '/generate/v7' },
  { id: 'validator', label: 'Validate', shortLabel: 'VAL', shortcut: '2', href: '/validate' },
  { id: 'parser', label: 'Parse', shortLabel: 'PARSE', shortcut: '3', href: '/parse' },
];

interface TabNavProps {
  activeTab: TabId;
}

export function TabNav({ activeTab }: TabNavProps) {
  return (
    <div role="tablist" aria-label="UUID 도구 선택" className="flex border-b border-border-subtle -mx-1 px-1">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          role="tab"
          data-testid={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`
            relative flex-1 sm:flex-none
            px-3 sm:px-6 py-2.5 sm:py-3
            font-mono text-xs sm:text-sm uppercase tracking-wider
            transition-all duration-150
            border-b-2 -mb-[2px]
            focus:outline-none
            focus-visible:shadow-[0_0_0_2px_var(--accent-mint)]
            ${activeTab === tab.id
              ? 'text-accent-mint border-accent-mint'
              : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-hover'
            }
          `}
        >
          {/* 모바일: 단축키만, 데스크톱: 단축키 + 풀 라벨 */}
          <span className="hidden sm:inline text-text-muted text-xs mr-2">[{tab.shortcut}]</span>
          <span className="sm:hidden">{tab.shortLabel}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}
