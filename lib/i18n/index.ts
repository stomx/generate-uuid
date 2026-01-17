import type { Metadata } from 'next';

export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 언어별 메타데이터
export const metadata: Record<Locale, {
  home: Metadata;
  v1: Metadata;
  v4: Metadata;
  v7: Metadata;
  validate: Metadata;
  parse: Metadata;
}> = {
  en: {
    home: {
      title: 'UUID Generator - Free Online UUID v1, v4, v7 Generator & Validator',
      description:
        'Free online UUID generator and validator. Generate UUID v1, v4, v7 with timestamp extraction. Parse, validate, and save UUID history. No registration required.',
      keywords: [
        'UUID generator',
        'UUID v4 generator',
        'UUID v7 generator',
        'UUID v1 generator',
        'GUID generator',
        'UUID validator',
        'UUID parser',
        'online UUID tool',
        'free UUID generator',
        'timestamp UUID',
        'RFC 9562',
      ],
    },
    v1: {
      title: 'UUID v1 Generator - Timestamp-based UUID Generator | UUID Generator',
      description:
        'Generate UUID version 1 (time-based) with timestamp and MAC address node. Create unique identifiers with embedded temporal information. Free online tool with RFC 9562 compliance.',
      keywords: [
        'UUID v1 generator',
        'UUID version 1',
        'time-based UUID',
        'timestamp UUID',
        'MAC address UUID',
        'UUID v1 online',
        'RFC 9562 v1',
        'temporal UUID',
      ],
    },
    v4: {
      title: 'UUID v4 Generator - Random UUID Generator | UUID Generator',
      description:
        'Generate UUID version 4 (random) with cryptographically secure randomness. Create truly random unique identifiers. Free online tool with RFC 9562 compliance.',
      keywords: [
        'UUID v4 generator',
        'UUID version 4',
        'random UUID',
        'crypto UUID',
        'GUID generator',
        'UUID v4 online',
        'RFC 9562 v4',
        'secure random UUID',
      ],
    },
    v7: {
      title: 'UUID v7 Generator - Modern Sortable UUID Generator | UUID Generator',
      description:
        'Generate UUID version 7 (time-ordered) with Unix timestamp for database efficiency. Modern sortable UUIDs perfect for distributed systems. Free online tool with RFC 9562 compliance.',
      keywords: [
        'UUID v7 generator',
        'UUID version 7',
        'sortable UUID',
        'time-ordered UUID',
        'Unix timestamp UUID',
        'database UUID',
        'UUID v7 online',
        'RFC 9562 v7',
        'modern UUID',
      ],
    },
    validate: {
      title: 'UUID Validator - Check UUID Format & Version | UUID Generator',
      description:
        'Validate UUID format and version (v1, v4, v7). Check UUID compliance with RFC 9562 standards. Detect invalid UUIDs and verify structure. Free online UUID validation tool.',
      keywords: [
        'UUID validator',
        'validate UUID',
        'check UUID',
        'UUID format checker',
        'UUID version detector',
        'RFC 9562 validator',
        'UUID compliance',
        'verify UUID',
      ],
    },
    parse: {
      title: 'UUID Parser - Extract Timestamp & Decode UUID | UUID Generator',
      description:
        'Parse and decode UUID structure. Extract timestamp from UUID v1 and v7. Analyze UUID components including version, variant, and embedded data. Free online UUID parsing tool.',
      keywords: [
        'UUID parser',
        'parse UUID',
        'decode UUID',
        'UUID timestamp extraction',
        'UUID analyzer',
        'UUID decoder',
        'extract UUID timestamp',
        'UUID structure',
      ],
    },
  },
  ko: {
    home: {
      title: 'UUID 생성기 - 무료 온라인 UUID v1, v4, v7 생성 및 검증 도구',
      description:
        '무료 온라인 UUID 생성 및 검증 도구. UUID v1, v4, v7 생성과 타임스탬프 추출 지원. UUID 파싱, 검증, 히스토리 저장 기능. 회원가입 불필요.',
      keywords: [
        'UUID 생성기',
        'UUID v4 생성기',
        'UUID v7 생성기',
        'UUID v1 생성기',
        'GUID 생성기',
        'UUID 검증기',
        'UUID 파서',
        '온라인 UUID 도구',
        '무료 UUID 생성',
        '타임스탬프 UUID',
        'RFC 9562',
        'UUID generator',
      ],
    },
    v1: {
      title: 'UUID v1 생성기 - 타임스탬프 기반 UUID 생성 도구 | UUID Generator',
      description:
        'UUID 버전 1(시간 기반)을 타임스탬프 및 MAC 주소 노드와 함께 생성합니다. 시간 정보가 포함된 고유 식별자를 만들 수 있습니다. RFC 9562 준수 무료 온라인 도구.',
      keywords: [
        'UUID v1 생성기',
        'UUID 버전 1',
        '시간 기반 UUID',
        '타임스탬프 UUID',
        'MAC 주소 UUID',
        'UUID v1 온라인',
        'RFC 9562 v1',
        '시간 정보 UUID',
        'UUID v1 generator',
      ],
    },
    v4: {
      title: 'UUID v4 생성기 - 랜덤 UUID 생성 도구 | UUID Generator',
      description:
        'UUID 버전 4(랜덤)를 암호학적으로 안전한 난수로 생성합니다. 완전히 무작위인 고유 식별자를 만들 수 있습니다. RFC 9562 준수 무료 온라인 도구.',
      keywords: [
        'UUID v4 생성기',
        'UUID 버전 4',
        '랜덤 UUID',
        '암호화 UUID',
        'GUID 생성기',
        'UUID v4 온라인',
        'RFC 9562 v4',
        '보안 랜덤 UUID',
        'UUID v4 generator',
      ],
    },
    v7: {
      title: 'UUID v7 생성기 - 최신 정렬 가능 UUID 생성 도구 | UUID Generator',
      description:
        'UUID 버전 7(시간 순서)을 Unix 타임스탬프와 함께 생성하여 데이터베이스 효율성을 높입니다. 분산 시스템에 완벽한 최신 정렬 가능 UUID. RFC 9562 준수 무료 온라인 도구.',
      keywords: [
        'UUID v7 생성기',
        'UUID 버전 7',
        '정렬 가능 UUID',
        '시간 순서 UUID',
        'Unix 타임스탬프 UUID',
        '데이터베이스 UUID',
        'UUID v7 온라인',
        'RFC 9562 v7',
        '최신 UUID',
        'UUID v7 generator',
      ],
    },
    validate: {
      title: 'UUID 검증기 - UUID 형식 및 버전 확인 도구 | UUID Generator',
      description:
        'UUID 형식 및 버전(v1, v4, v7)을 검증합니다. RFC 9562 표준 준수 여부를 확인하고 잘못된 UUID를 감지하며 구조를 검증합니다. 무료 온라인 UUID 검증 도구.',
      keywords: [
        'UUID 검증기',
        'UUID 검증',
        'UUID 확인',
        'UUID 형식 검사',
        'UUID 버전 감지',
        'RFC 9562 검증',
        'UUID 준수',
        'UUID 확인 도구',
        'UUID validator',
      ],
    },
    parse: {
      title: 'UUID 파서 - UUID 타임스탬프 추출 및 디코딩 도구 | UUID Generator',
      description:
        'UUID 구조를 파싱하고 디코딩합니다. UUID v1 및 v7에서 타임스탬프를 추출합니다. 버전, 변형 및 내장 데이터를 포함한 UUID 구성 요소를 분석합니다. 무료 온라인 UUID 파싱 도구.',
      keywords: [
        'UUID 파서',
        'UUID 파싱',
        'UUID 디코딩',
        'UUID 타임스탬프 추출',
        'UUID 분석기',
        'UUID 디코더',
        'UUID 타임스탬프 추출',
        'UUID 구조',
        'UUID parser',
      ],
    },
  },
};

// Open Graph 메타데이터 생성 헬퍼
export function createOpenGraphMetadata(
  locale: Locale,
  page: keyof typeof metadata.en,
  path: string
): Metadata['openGraph'] {
  const baseUrl = 'https://uuid.stomx.net';
  const meta = metadata[locale][page];

  return {
    title: meta.title as string,
    description: meta.description as string,
    url: `${baseUrl}/${locale}${path}`,
    siteName: 'UUID Generator',
    locale: locale === 'en' ? 'en_US' : 'ko_KR',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'UUID Generator - Free Online Tool',
      },
    ],
  };
}

// Twitter Card 메타데이터 생성 헬퍼
export function createTwitterMetadata(
  locale: Locale,
  page: keyof typeof metadata.en
): Metadata['twitter'] {
  const meta = metadata[locale][page];

  return {
    card: 'summary_large_image',
    title: meta.title as string,
    description: meta.description as string,
    images: ['https://uuid.stomx.net/og-image.jpg'],
  };
}

// 언어 대체 링크 생성
export function createAlternateLinks(path: string): Metadata['alternates'] {
  const baseUrl = 'https://uuid.stomx.net';

  return {
    canonical: `${baseUrl}/en${path}`,
    languages: {
      en: `${baseUrl}/en${path}`,
      ko: `${baseUrl}/ko${path}`,
      'x-default': `${baseUrl}/en${path}`,
    },
  };
}

// 페이지별 완전한 메타데이터 생성
export function generatePageMetadata(
  locale: Locale,
  page: keyof typeof metadata.en,
  path: string
): Metadata {
  const meta = metadata[locale][page];

  return {
    ...meta,
    metadataBase: new URL('https://uuid.stomx.net'),
    openGraph: createOpenGraphMetadata(locale, page, path),
    twitter: createTwitterMetadata(locale, page),
    alternates: createAlternateLinks(path),
  };
}
