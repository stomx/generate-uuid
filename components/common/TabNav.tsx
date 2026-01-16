'use client';


export type TabId = 'generator' | 'validator' | 'parser';

interface Tab {
  id: TabId;
  label: string;
  shortcut: string;
}

const TABS: Tab[] = [
  { id: 'generator', label: 'Generate', shortcut: '1' },
  { id: 'validator', label: 'Validate', shortcut: '2' },
  { id: 'parser', label: 'Parse', shortcut: '3' },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div role="tablist" aria-label="UUID 도구 선택" className="flex border-b border-border-subtle -mx-1 px-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          data-testid={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-6 py-3
            font-mono text-sm uppercase tracking-wider
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
          <span className="text-text-muted text-xs mr-2">[{tab.shortcut}]</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
