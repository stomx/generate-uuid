export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UUID Generator',
    alternateName: 'UUID::GEN',
    url: 'https://uuid.stomx.net',
    description:
      'Free online UUID generator and validator. Generate UUID v1, v4, v7 with timestamp extraction. Parse, validate, and save UUID history. No registration required.',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Developer Tools',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Modern browser recommended.',
    permissions: 'clipboard-write',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'UUID v1 Generation (Timestamp-based)',
      'UUID v4 Generation (Random)',
      'UUID v7 Generation (Time-ordered)',
      'UUID Validation',
      'UUID Parsing',
      'Timestamp Extraction',
      'History Management',
      'Bulk Generation',
      'RFC 9562 Compliance',
      'Keyboard Shortcuts',
    ],
    screenshot: 'https://uuid.stomx.net/og-image.jpg',
    softwareVersion: '1.0.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'UUID Generator',
      url: 'https://uuid.stomx.net',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://uuid.stomx.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'UUID Generator',
        item: 'https://uuid.stomx.net/generate/v7',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'UUID Validator',
        item: 'https://uuid.stomx.net/validate',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'UUID Parser',
        item: 'https://uuid.stomx.net/parse',
      },
    ],
  };

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
