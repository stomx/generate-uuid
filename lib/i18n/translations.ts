export type Locale = 'en' | 'ko';

export interface Translations {
  // Navigation
  nav: {
    generate: string;
    validate: string;
    parse: string;
    generateShort: string;
    validateShort: string;
    parseShort: string;
  };

  // Language selector
  language: {
    label: string;
    english: string;
    korean: string;
  };

  // Common buttons
  common: {
    copy: string;
    copyAll: string;
    generate: string;
    validate: string;
    parse: string;
    clear: string;
    clearAll: string;
    delete: string;
    deleteAll: string;
  };

  // Generator
  generator: {
    title: string;
    options: string;
    count: string;
    uppercase: string;
    hyphenated: string;
    version: string;
    generated: string;
  };

  // Validator
  validator: {
    title: string;
    placeholder: string;
    valid: string;
    invalid: string;
    validMessage: string;
    invalidMessage: string;
    history: string;
  };

  // Parser
  parser: {
    title: string;
    placeholder: string;
    result: string;
    version: string;
    timestamp: string;
    node: string;
    clockSeq: string;
    history: string;
  };

  // Status
  status: {
    online: string;
    copied: string;
    copyError: string;
  };

  // Page titles (H1) for SEO
  pageTitle: {
    generatorV1: string;
    generatorV4: string;
    generatorV7: string;
    validator: string;
    parser: string;
  };

  // UUID Info Section
  uuidInfo: {
    moreInfo: string;
    lessInfo: string;
    aboutV1: string;
    aboutV4: string;
    aboutV7: string;
    descV1: string;
    descV4: string;
    descV7: string;
    featuresTitle: string;
    useCasesTitle: string;
    featuresV1: string[];
    featuresV4: string[];
    featuresV7: string[];
    useCasesV1: string[];
    useCasesV4: string[];
    useCasesV7: string[];
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      generate: 'Generate',
      validate: 'Validate',
      parse: 'Parse',
      generateShort: 'GEN',
      validateShort: 'VAL',
      parseShort: 'PARSE',
    },
    language: {
      label: 'Language',
      english: 'English',
      korean: '한국어',
    },
    common: {
      copy: 'Copy',
      copyAll: 'Copy All',
      generate: 'Generate',
      validate: 'Validate',
      parse: 'Parse',
      clear: 'Clear',
      clearAll: 'Clear All',
      delete: 'Delete',
      deleteAll: 'Delete All',
    },
    generator: {
      title: 'UUID Generator',
      options: 'Options',
      count: 'Count',
      uppercase: 'Uppercase',
      hyphenated: 'Hyphenated',
      version: 'Version',
      generated: 'Generated',
    },
    validator: {
      title: 'UUID Validator',
      placeholder: 'Enter UUID to validate...',
      valid: 'VALID',
      invalid: 'INVALID',
      validMessage: 'Valid UUID',
      invalidMessage: 'Invalid UUID',
      history: 'History',
    },
    parser: {
      title: 'UUID Parser',
      placeholder: 'Enter UUID to parse...',
      result: 'Parse Result',
      version: 'Version',
      timestamp: 'Timestamp',
      node: 'Node',
      clockSeq: 'Clock Sequence',
      history: 'History',
    },
    status: {
      online: 'ONLINE',
      copied: 'Copied!',
      copyError: 'Copy failed',
    },
    pageTitle: {
      generatorV1: 'UUID v1 Generator - Timestamp Based',
      generatorV4: 'UUID v4 Generator - Random',
      generatorV7: 'UUID v7 Generator - Time-Ordered',
      validator: 'UUID Validator - Format & Version Check',
      parser: 'UUID Parser - Timestamp Extraction',
    },
    uuidInfo: {
      moreInfo: 'MORE INFO',
      lessInfo: 'LESS INFO',
      aboutV1: 'About UUID v1',
      aboutV4: 'About UUID v4',
      aboutV7: 'About UUID v7',
      descV1: 'UUID v1 is generated using a timestamp and the node identifier (typically MAC address). It embeds the creation time, making it useful for tracking when records were created.',
      descV4: 'UUID v4 is generated using cryptographically secure random numbers. It provides maximum randomness with 122 bits of entropy, making collisions virtually impossible.',
      descV7: 'UUID v7 is the modern standard (RFC 9562) combining Unix timestamp with random data. It is naturally sortable by creation time, making it ideal for database primary keys.',
      featuresTitle: 'Features',
      useCasesTitle: 'Use Cases',
      featuresV1: [
        'Contains 60-bit timestamp (100-nanosecond precision)',
        'Includes clock sequence for uniqueness',
        'Node ID based on hardware or random',
        'Timestamp extractable from UUID',
      ],
      featuresV4: [
        '122 bits of random data',
        'Cryptographically secure generation',
        'No embedded information',
        'Completely unpredictable',
      ],
      featuresV7: [
        '48-bit Unix timestamp (millisecond precision)',
        'Naturally sortable by creation time',
        'Better database index performance',
        'RFC 9562 compliant',
      ],
      useCasesV1: [
        'Audit logging with timestamps',
        'Legacy system compatibility',
        'Distributed systems needing time ordering',
      ],
      useCasesV4: [
        'Session tokens and API keys',
        'Security-sensitive identifiers',
        'When predictability must be avoided',
      ],
      useCasesV7: [
        'Database primary keys',
        'Event sourcing and logs',
        'Distributed systems requiring sort order',
      ],
    },
  },
  ko: {
    nav: {
      generate: '생성',
      validate: '검증',
      parse: '파싱',
      generateShort: '생성',
      validateShort: '검증',
      parseShort: '파싱',
    },
    language: {
      label: '언어',
      english: 'English',
      korean: '한국어',
    },
    common: {
      copy: '복사',
      copyAll: '전체 복사',
      generate: '생성',
      validate: '검증',
      parse: '파싱',
      clear: '지우기',
      clearAll: '전체 지우기',
      delete: '삭제',
      deleteAll: '전체 삭제',
    },
    generator: {
      title: 'UUID 생성기',
      options: '옵션',
      count: '개수',
      uppercase: '대문자',
      hyphenated: '하이픈 포함',
      version: '버전',
      generated: '생성됨',
    },
    validator: {
      title: 'UUID 검증기',
      placeholder: '검증할 UUID를 입력하세요...',
      valid: '유효함',
      invalid: '유효하지 않음',
      validMessage: '유효한 UUID',
      invalidMessage: '유효하지 않은 UUID',
      history: '히스토리',
    },
    parser: {
      title: 'UUID 파서',
      placeholder: '파싱할 UUID를 입력하세요...',
      result: '파싱 결과',
      version: '버전',
      timestamp: '타임스탬프',
      node: '노드',
      clockSeq: '클럭 시퀀스',
      history: '히스토리',
    },
    status: {
      online: '온라인',
      copied: '복사됨!',
      copyError: '복사 실패',
    },
    pageTitle: {
      generatorV1: 'UUID v1 생성기 - 타임스탬프 기반',
      generatorV4: 'UUID v4 생성기 - 랜덤',
      generatorV7: 'UUID v7 생성기 - 시간 순서',
      validator: 'UUID 검증기 - 형식 및 버전 확인',
      parser: 'UUID 파서 - 타임스탬프 추출',
    },
    uuidInfo: {
      moreInfo: '더 알아보기',
      lessInfo: '접기',
      aboutV1: 'UUID v1이란?',
      aboutV4: 'UUID v4란?',
      aboutV7: 'UUID v7이란?',
      descV1: 'UUID v1은 타임스탬프와 노드 식별자(일반적으로 MAC 주소)를 사용하여 생성됩니다. 생성 시간이 포함되어 있어 레코드 생성 시점을 추적하는 데 유용합니다.',
      descV4: 'UUID v4는 암호학적으로 안전한 난수를 사용하여 생성됩니다. 122비트의 엔트로피로 최대한의 무작위성을 제공하며, 충돌이 사실상 불가능합니다.',
      descV7: 'UUID v7은 Unix 타임스탬프와 랜덤 데이터를 결합한 최신 표준(RFC 9562)입니다. 생성 시간 순으로 자연스럽게 정렬되어 데이터베이스 기본 키에 이상적입니다.',
      featuresTitle: '특징',
      useCasesTitle: '사용 사례',
      featuresV1: [
        '60비트 타임스탬프 포함 (100나노초 정밀도)',
        '고유성을 위한 클럭 시퀀스 포함',
        '하드웨어 또는 랜덤 기반 노드 ID',
        'UUID에서 타임스탬프 추출 가능',
      ],
      featuresV4: [
        '122비트 랜덤 데이터',
        '암호학적으로 안전한 생성',
        '내장된 정보 없음',
        '완전히 예측 불가능',
      ],
      featuresV7: [
        '48비트 Unix 타임스탬프 (밀리초 정밀도)',
        '생성 시간 순 자연 정렬',
        '향상된 데이터베이스 인덱스 성능',
        'RFC 9562 표준 준수',
      ],
      useCasesV1: [
        '타임스탬프가 필요한 감사 로깅',
        '레거시 시스템 호환성',
        '시간 순서가 필요한 분산 시스템',
      ],
      useCasesV4: [
        '세션 토큰 및 API 키',
        '보안에 민감한 식별자',
        '예측 가능성을 피해야 할 때',
      ],
      useCasesV7: [
        '데이터베이스 기본 키',
        '이벤트 소싱 및 로그',
        '정렬 순서가 필요한 분산 시스템',
      ],
    },
  },
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: string): string {
  const trans = getTranslations(locale);
  const keys = key.split('.');

  let value: any = trans;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}
