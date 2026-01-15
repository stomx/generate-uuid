'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { TabNav, ThemeToggle, ErrorBoundary } from '@/components/common';
import type { TabId } from '@/components/common';
import { UuidGenerator } from '@/components/generator';
import { UuidValidator } from '@/components/validator';
import { UuidParser } from '@/components/parser';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('generator');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 무시
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '1') {
        e.preventDefault();
        setActiveTab('generator');
      }
      if (e.key === '2') {
        e.preventDefault();
        setActiveTab('validator');
      }
      if (e.key === '3') {
        e.preventDefault();
        setActiveTab('parser');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="h-dvh bg-bg-deep flex flex-col overflow-hidden">
      {/* 100dvh 레이아웃: 헤더/푸터 고정, 메인 영역 flex-1 */}

      <div className="relative z-10 flex flex-col h-full p-4 sm:p-6">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          {/* 헤더 - 고정 높이 */}
          <header className={`
            flex items-center justify-between pb-4 shrink-0
            ${mounted ? 'animate-fade-in' : 'opacity-0'}
          `}>
            <div className="flex items-center gap-4">
              {/* 로고/타이틀 */}
              <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-accent-mint">UUID</span>
                <span className="text-text-primary">::</span>
                <span className="text-text-secondary">GEN</span>
              </h1>

              {/* 버전 배지 */}
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-mono uppercase border border-border-subtle text-text-muted">
                v1.0.0
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* 상태 표시 */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-muted">
                <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
                <span>ONLINE</span>
              </div>

              <ThemeToggle />
            </div>
          </header>

          {/* 메인 컨테이너 - flex-1로 남은 공간 채움 */}
          <div className={`
            flex-1 flex flex-col min-h-0
            ${mounted ? 'animate-fade-in' : 'opacity-0'}
          `} style={{ animationDelay: '100ms' }}>
            {/* 터미널 스타일 헤더 */}
            <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border border-border-subtle border-b-0 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-red/80" />
                <span className="w-3 h-3 rounded-full bg-accent-amber/80" />
                <span className="w-3 h-3 rounded-full bg-accent-mint/80" />
              </div>
              <span className="text-text-muted font-mono text-xs">
                ~/uuid-generator
              </span>
            </div>

            {/* 메인 카드 - flex-1로 확장, 내부 스크롤 */}
            <Card className="p-4 sm:p-6 border-t-0 flex-1 flex flex-col min-h-0">
              {/* 탭 네비게이션 */}
              <nav className="mb-4 shrink-0">
                <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
              </nav>

              {/* 탭 패널 - 내부 스크롤 */}
              <ErrorBoundary>
                <div
                  role="tabpanel"
                  id={`panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                  className="flex-1 overflow-y-auto min-h-0"
                >
                  {activeTab === 'generator' && <UuidGenerator />}
                  {activeTab === 'validator' && <UuidValidator />}
                  {activeTab === 'parser' && <UuidParser />}
                </div>
              </ErrorBoundary>
            </Card>
          </div>

          {/* 푸터 - 고정 높이 */}
          <footer className={`
            pt-4 text-center shrink-0
            ${mounted ? 'animate-fade-in' : 'opacity-0'}
          `} style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-text-muted font-mono text-xs">
              <span className="flex items-center gap-2">
                <span className="text-accent-cyan">v1</span>
                <span className="text-text-muted/50">/</span>
                <span className="text-accent-amber">v4</span>
                <span className="text-text-muted/50">/</span>
                <span className="text-accent-mint">v7</span>
              </span>
              <span className="hidden sm:inline text-text-muted/30">|</span>
              <a
                href="https://www.rfc-editor.org/rfc/rfc9562.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-mint transition-colors underline underline-offset-2"
              >
                RFC 9562
              </a>
            </div>

            {/* 키보드 단축키 힌트 */}
            <div className="mt-2 flex items-center justify-center gap-4 text-text-muted/50 font-mono text-[10px]">
              <span>
                <kbd className="px-1.5 py-0.5 border border-border-subtle bg-bg-surface">1</kbd>
                <span className="ml-1">GEN</span>
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 border border-border-subtle bg-bg-surface">2</kbd>
                <span className="ml-1">VAL</span>
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 border border-border-subtle bg-bg-surface">3</kbd>
                <span className="ml-1">PARSE</span>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
