'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 브라우저 언어 감지
    const browserLang = navigator.language.split('-')[0];
    const path = browserLang === 'ko' ? '/ko/generate/v7' : '/generate/v7';

    router.replace(path);
  }, [router]);

  return (
    <div className="h-dvh bg-bg-deep flex items-center justify-center">
      <div className="text-text-muted font-mono text-sm animate-pulse">
        Redirecting...
      </div>
    </div>
  );
}
