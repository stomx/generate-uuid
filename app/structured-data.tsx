export function StructuredData() {
  const structuredData = [
    // WebApplication
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'UUID Generator',
      url: 'https://uuid.stomx.net',
      description:
        'Free online UUID generator and validator. Generate UUID v1, v4, v7 with timestamp extraction.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'UUID v1 Generation',
        'UUID v4 Generation',
        'UUID v7 Generation',
        'UUID Validation',
        'Timestamp Extraction',
        'History Management',
      ],
    },
    // BreadcrumbList
    {
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
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
