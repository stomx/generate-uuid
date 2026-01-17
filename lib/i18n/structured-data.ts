import type { Locale } from './index';

export function getStructuredData(locale: Locale) {
  const baseUrl = 'https://uuid.stomx.net';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UUID Generator',
    alternateName: 'UUID::GEN',
    url: `${baseUrl}/${locale}`,
    description:
      locale === 'en'
        ? 'Free online UUID generator and validator. Generate UUID v1, v4, v7 with timestamp extraction. Parse, validate, and save UUID history. No registration required.'
        : '무료 온라인 UUID 생성 및 검증 도구. UUID v1, v4, v7 생성과 타임스탬프 추출 지원. UUID 파싱, 검증, 히스토리 저장 기능. 회원가입 불필요.',
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
    featureList:
      locale === 'en'
        ? [
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
          ]
        : [
            'UUID v1 생성 (타임스탬프 기반)',
            'UUID v4 생성 (랜덤)',
            'UUID v7 생성 (시간 순서)',
            'UUID 검증',
            'UUID 파싱',
            '타임스탬프 추출',
            '히스토리 관리',
            '일괄 생성',
            'RFC 9562 준수',
            '키보드 단축키',
          ],
    screenshot: `${baseUrl}/og-image.jpg`,
    softwareVersion: '1.0.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'UUID Generator',
      url: baseUrl,
    },
    inLanguage: locale === 'en' ? 'en-US' : 'ko-KR',
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'en' ? 'Home' : '홈',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'en' ? 'UUID Generator' : 'UUID 생성기',
        item: `${baseUrl}/${locale}/generate/v7`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locale === 'en' ? 'UUID Validator' : 'UUID 검증기',
        item: `${baseUrl}/${locale}/validate`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: locale === 'en' ? 'UUID Parser' : 'UUID 파서',
        item: `${baseUrl}/${locale}/parse`,
      },
    ],
  };

  return { structuredData, breadcrumb };
}
