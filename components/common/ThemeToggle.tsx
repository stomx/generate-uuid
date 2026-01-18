'use client';

import { useTheme } from '@/hooks';

const THEME_LABELS = {
  system: 'SYS',
  light: 'LT',
  dark: 'DK',
} as const;

const THEME_ARIA = {
  system: 'SYS - System theme',
  light: 'LT - Light theme',
  dark: 'DK - Dark theme',
} as const;

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      onClick={cycleTheme}
      aria-label={THEME_ARIA[theme]}
      className="
        w-10 h-8 flex items-center justify-center
        text-text-secondary hover:text-accent-amber
        border border-border-subtle hover:border-accent-amber/50
        transition-all duration-150
        font-mono text-xs
        focus:outline-none focus-visible:border-accent-mint
      "
    >
      {THEME_LABELS[theme]}
    </button>
  );
}
