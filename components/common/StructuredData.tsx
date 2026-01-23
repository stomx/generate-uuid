'use client';

import { usePathname } from 'next/navigation';
import { getStructuredData } from '@/lib/i18n/structured-data';
import type { Locale } from '@/lib/i18n';

export function StructuredData({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  // Note: JSON.stringify output is safe for script tags as it produces valid JSON
  // No external/user input is used - all data is generated from our codebase
  const { structuredData, breadcrumb } = getStructuredData(locale, pathname);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
