'use client';

import { usePathname, useRouter } from 'next/navigation';
import * as Select from '@radix-ui/react-select';
import { getTranslations } from '@/lib/i18n/translations';

interface LanguageSelectProps {
  lang: string;
}

export function LanguageSelect({ lang }: LanguageSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = getTranslations(lang as 'en' | 'ko');

  const handleLanguageChange = (newLang: string) => {
    const currentPath = pathname.replace(/^\/ko/, ''); // Remove /ko prefix
    const newPath = newLang === 'ko' ? `/ko${currentPath}` : currentPath;
    router.push(newPath);
  };

  return (
    <Select.Root value={lang} onValueChange={handleLanguageChange}>
      <Select.Trigger
        className="inline-flex items-center gap-2 px-2 py-1 text-xs font-mono border border-border-subtle text-text-muted hover:text-accent-mint hover:border-accent-mint transition-colors focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--accent-mint)]"
        aria-label={t.language.label}
      >
        <Select.Value />
        <Select.Icon className="text-text-muted">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="overflow-hidden bg-bg-elevated border border-border-subtle shadow-lg z-50"
          position="popper"
          sideOffset={5}
        >
          <Select.Viewport className="p-1">
            <Select.Item
              value="en"
              className="relative flex items-center px-6 py-2 text-xs font-mono text-text-primary hover:bg-bg-hover hover:text-accent-mint outline-none cursor-pointer transition-colors data-[state=checked]:text-accent-mint"
            >
              <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Select.ItemIndicator>
              <Select.ItemText>{t.language.english}</Select.ItemText>
            </Select.Item>

            <Select.Item
              value="ko"
              className="relative flex items-center px-6 py-2 text-xs font-mono text-text-primary hover:bg-bg-hover hover:text-accent-mint outline-none cursor-pointer transition-colors data-[state=checked]:text-accent-mint"
            >
              <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Select.ItemIndicator>
              <Select.ItemText>{t.language.korean}</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
