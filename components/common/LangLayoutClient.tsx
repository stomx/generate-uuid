'use client';

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { TabNav, ThemeToggle, ErrorBoundary } from '@/components/common';
import type { TabId } from '@/components/common';

function getActiveTab(pathname: string): TabId {
  if (pathname.includes('/validate')) return 'validator';
  if (pathname.includes('/parse')) return 'parser';
  return 'generator';
}

export function LangLayoutClient({ children, lang }: { children: ReactNode; lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);
  const langPrefix = lang === 'ko' ? '/ko' : '';

  // 언어 변경 핸들러
  const handleLanguageToggle = () => {
    const currentPath = pathname.replace(/^\/ko/, ''); // /ko 제거
    const newPath = lang === 'ko' ? currentPath : `/ko${currentPath}`;
    router.push(newPath);
  };

  // 키보드 단축키 (Option/Alt + 숫자) - 입력 필드에서도 동작
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Option(Mac)/Alt(Windows) + 숫자로 탭 전환
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          router.push(`${langPrefix}/generate/v7`);
        }
        if (e.key === '2') {
          e.preventDefault();
          router.push(`${langPrefix}/validate`);
        }
        if (e.key === '3') {
          e.preventDefault();
          router.push(`${langPrefix}/parse`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, langPrefix]);

  return (
    <main className="h-dvh bg-bg-deep flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col h-full p-4 sm:p-6">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          {/* 헤더 - 고정 높이 */}
          <header className="flex items-center justify-between pb-4 shrink-0 animate-fade-in">
            <div className="flex items-center gap-4">
              <Link href={`${langPrefix}/generate/v7`}>
                <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight">
                  <span className="text-accent-mint">UUID</span>
                  <span className="text-text-primary">::</span>
                  <span className="text-text-secondary">GEN</span>
                </h1>
              </Link>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-mono uppercase border border-border-subtle text-text-muted">
                v1.0.0
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-muted">
                <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
                <span>ONLINE</span>
              </div>
              <button
                onClick={handleLanguageToggle}
                className="px-2 py-1 text-xs font-mono border border-border-subtle text-text-muted hover:text-accent-mint hover:border-accent-mint transition-colors"
                aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
              >
                {lang === 'ko' ? 'EN' : 'KO'}
              </button>
              <ThemeToggle />
            </div>
          </header>

          {/* 메인 컨테이너 */}
          <div
            className="flex-1 flex flex-col min-h-0 animate-fade-in"
            style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
          >
            {/* 터미널 스타일 헤더 */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-bg-elevated border border-border-subtle border-b-0 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent-red/80" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent-amber/80" />
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent-mint/80" />
              </div>
              <span className="text-text-muted font-mono text-[10px] sm:text-xs">
                ~/uuid-generator
              </span>
            </div>

            {/* 메인 카드 */}
            <Card className="p-3 sm:p-6 border-t-0 flex-1 flex flex-col min-h-0">
              <nav className="mb-3 sm:mb-4 shrink-0">
                <TabNav activeTab={activeTab} lang={lang} />
              </nav>

              <ErrorBoundary>
                <div
                  role="tabpanel"
                  id={`panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                  className="flex-1 overflow-y-auto min-h-0 p-1 -m-1"
                >
                  {children}
                </div>
              </ErrorBoundary>
            </Card>
          </div>

          {/* 푸터 */}
          <footer
            className="pt-3 sm:pt-4 text-center shrink-0 animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-text-muted font-mono text-[10px] sm:text-xs">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Link href={`${langPrefix}/generate/v1`} className="text-accent-cyan hover:underline">
                  v1
                </Link>
                <span className="text-text-muted/50">/</span>
                <Link href={`${langPrefix}/generate/v4`} className="text-accent-amber hover:underline">
                  v4
                </Link>
                <span className="text-text-muted/50">/</span>
                <Link href={`${langPrefix}/generate/v7`} className="text-accent-mint hover:underline">
                  v7
                </Link>
              </span>
              <span className="text-text-muted/30">|</span>
              <a
                href="https://www.rfc-editor.org/rfc/rfc9562.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-mint transition-colors underline underline-offset-2"
              >
                RFC 9562
              </a>
            </div>

            <div className="hidden sm:flex mt-2 items-center justify-center gap-4 text-text-muted/50 font-mono text-[10px]">
              <span>
                <kbd className="px-1.5 py-0.5 border border-border-subtle bg-bg-surface">
                  Alt/⌥+1
                </kbd>
                <span className="ml-1">GEN</span>
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 border border-border-subtle bg-bg-surface">
                  Alt/⌥+2
                </kbd>
                <span className="ml-1">VAL</span>
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 border border-border-subtle bg-bg-surface">
                  Alt/⌥+3
                </kbd>
                <span className="ml-1">PARSE</span>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
