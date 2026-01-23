import type { Locale } from './index';

interface BreadcrumbItem {
  name: string;
  item: string;
}

function getBreadcrumbItems(locale: Locale, path: string): BreadcrumbItem[] {
  const baseUrl = 'https://uuid.stomx.net';
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const home: BreadcrumbItem = {
    name: locale === 'en' ? 'Home' : '홈',
    item: `${baseUrl}${localePrefix}/`,
  };

  // Normalize path
  const normalizedPath = path.replace(/^\/ko/, '').replace(/\/$/, '') || '/';

  if (normalizedPath === '/' || normalizedPath === '') {
    return [home];
  }

  if (normalizedPath.startsWith('/generate')) {
    const version = normalizedPath.split('/')[2] || 'v7';
    const versionNames: Record<string, Record<Locale, string>> = {
      v1: { en: 'UUID v1 Generator', ko: 'UUID v1 생성기' },
      v4: { en: 'UUID v4 Generator', ko: 'UUID v4 생성기' },
      v7: { en: 'UUID v7 Generator', ko: 'UUID v7 생성기' },
    };
    return [
      home,
      {
        name: locale === 'en' ? 'Generate' : '생성',
        item: `${baseUrl}${localePrefix}/generate/v7/`,
      },
      {
        name: versionNames[version]?.[locale] || versionNames.v7[locale],
        item: `${baseUrl}${localePrefix}/generate/${version}/`,
      },
    ];
  }

  if (normalizedPath === '/validate') {
    return [
      home,
      {
        name: locale === 'en' ? 'UUID Validator' : 'UUID 검증기',
        item: `${baseUrl}${localePrefix}/validate/`,
      },
    ];
  }

  if (normalizedPath === '/parse') {
    return [
      home,
      {
        name: locale === 'en' ? 'UUID Parser' : 'UUID 파서',
        item: `${baseUrl}${localePrefix}/parse/`,
      },
    ];
  }

  return [home];
}

export function getStructuredData(locale: Locale, path: string = '/') {
  const baseUrl = 'https://uuid.stomx.net';
  const localePrefix = locale === 'ko' ? '/ko' : '';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UUID Generator',
    alternateName: 'UUID::GEN',
    url: `${baseUrl}${localePrefix}`,
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
    author: {
      '@type': 'Organization',
      name: 'UUID Generator',
      url: baseUrl,
    },
    inLanguage: locale === 'en' ? 'en-US' : 'ko-KR',
  };

  const breadcrumbItems = getBreadcrumbItems(locale, path);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return { structuredData, breadcrumb };
}
