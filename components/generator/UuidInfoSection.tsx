'use client';

import { useState } from 'react';
import type { SupportedUuidVersion } from '@/types/uuid';
import type { Locale } from '@/lib/i18n';
import { getTranslations } from '@/lib/i18n/translations';

interface UuidInfoSectionProps {
  version: SupportedUuidVersion;
  lang: Locale;
}

export function UuidInfoSection({ version, lang }: UuidInfoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = getTranslations(lang);

  const versionKey = version.toUpperCase() as 'V1' | 'V4' | 'V7';
  const aboutTitle = t.uuidInfo[`about${versionKey}` as keyof typeof t.uuidInfo] as string;
  const description = t.uuidInfo[`desc${versionKey}` as keyof typeof t.uuidInfo] as string;
  const features = t.uuidInfo[`features${versionKey}` as keyof typeof t.uuidInfo] as string[];
  const useCases = t.uuidInfo[`useCases${versionKey}` as keyof typeof t.uuidInfo] as string[];

  return (
    <section className="border border-border-subtle bg-bg-surface">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-bg-hover transition-colors focus:outline-none focus-visible:shadow-[0_0_0_2px_var(--accent-mint)]"
        aria-expanded={isExpanded}
        aria-controls="uuid-info-content"
      >
        <h2 className="font-mono text-xs sm:text-sm text-text-secondary">
          <span className="text-text-muted mr-2">{'//'}</span>
          {aboutTitle}
        </h2>
        <span className="font-mono text-[10px] sm:text-xs text-accent-mint">
          [{isExpanded ? '-' : '+'}] {isExpanded ? t.uuidInfo.lessInfo : t.uuidInfo.moreInfo}
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        id="uuid-info-content"
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[800px] sm:max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-4 border-t border-border-subtle">
          {/* Description */}
          <p className="pt-3 sm:pt-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            {description}
          </p>

          {/* Features & Use Cases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Features */}
            <div>
              <h3 className="font-mono text-[10px] sm:text-xs text-text-muted mb-2">
                {'// '}{t.uuidInfo.featuresTitle.toUpperCase()}
              </h3>
              <ul className="space-y-1.5">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-[11px] sm:text-xs text-text-secondary"
                  >
                    <span className="text-accent-mint shrink-0 mt-0.5">-</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h3 className="font-mono text-[10px] sm:text-xs text-text-muted mb-2">
                {'// '}{t.uuidInfo.useCasesTitle.toUpperCase()}
              </h3>
              <ul className="space-y-1.5">
                {useCases.map((useCase, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-[11px] sm:text-xs text-text-secondary"
                  >
                    <span className="text-accent-cyan shrink-0 mt-0.5">*</span>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
