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
