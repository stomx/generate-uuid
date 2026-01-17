'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0];
    const lang = browserLang === 'ko' ? 'ko' : defaultLocale;

    router.replace(`/${lang}/generate/v7`);
  }, [router]);

  return (
    <div className="h-dvh bg-bg-deep flex items-center justify-center">
      <div className="text-text-muted font-mono text-sm animate-pulse">
        Redirecting...
      </div>
    </div>
  );
}
