'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/generate/v7');
  }, [router]);

  return (
    <div className="h-dvh bg-bg-deep flex items-center justify-center">
      <div className="text-text-muted font-mono text-sm animate-pulse">
        Redirecting...
      </div>
    </div>
  );
}
