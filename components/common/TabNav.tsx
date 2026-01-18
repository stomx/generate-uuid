'use client';

import Link from 'next/link';
import { getTranslations } from '@/lib/i18n/translations';

export type TabId = 'generator' | 'validator' | 'parser';

interface Tab {
  id: TabId;
  labelKey: 'generate' | 'validate' | 'parse';
  shortLabelKey: 'generateShort' | 'validateShort' | 'parseShort';
  shortcut: string;
  path: string;
}

const TABS: Tab[] = [
  { id: 'generator', labelKey: 'generate', shortLabelKey: 'generateShort', shortcut: '1', path: '/generate/v7' },
  { id: 'validator', labelKey: 'validate', shortLabelKey: 'validateShort', shortcut: '2', path: '/validate' },
  { id: 'parser', labelKey: 'parse', shortLabelKey: 'parseShort', shortcut: '3', path: '/parse' },
];

interface TabNavProps {
  activeTab: TabId;
  lang?: string;
}

export function TabNav({ activeTab, lang = 'en' }: TabNavProps) {
  const langPrefix = lang === 'ko' ? '/ko' : '';
  const t = getTranslations(lang as 'en' | 'ko');

  return (
    <div role="tablist" aria-label="UUID 도구 선택" className="flex border-b border-border-subtle -mx-1 px-1">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={`${langPrefix}${tab.path}`}
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
          <span className="sm:hidden">{t.nav[tab.shortLabelKey]}</span>
          <span className="hidden sm:inline">{t.nav[tab.labelKey]}</span>
        </Link>
      ))}
    </div>
  );
}
