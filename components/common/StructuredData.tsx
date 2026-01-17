import { getStructuredData } from '@/lib/i18n/structured-data';
import type { Locale } from '@/lib/i18n';

export function StructuredData({ locale }: { locale: Locale }) {
  const { structuredData, breadcrumb } = getStructuredData(locale);

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
