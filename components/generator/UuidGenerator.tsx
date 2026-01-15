'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { UuidHistory } from '@/components/common';
import { VersionSelector } from './VersionSelector';
import { OptionsPanel } from './OptionsPanel';
import { useUuidGenerator } from '@/hooks';
import { copyToClipboard } from '@/lib/utils/clipboard';

export function UuidGenerator() {
  const {
    uuids,
    version,
    options,
    history,
    generate,
    setVersion,
    setOptions,
    clearHistory,
    removeFromHistory,
  } = useUuidGenerator();

  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState(false);

  // 초기 UUID 생성
  useEffect(() => {
    if (uuids.length === 0) {
      generate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 생성 시 자동 복사 (silent 모드 - 권한 팝업 없음)
  useEffect(() => {
    if (uuids.length > 0) {
      const textToCopy = uuids.join('\n');
      copyToClipboard(textToCopy, true).then((success) => {
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      });
    }
  }, [uuids]);

  // 버전 변경 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 무시
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'q') setVersion('v1');
      if (key === 'w') setVersion('v4');
      if (key === 'e') setVersion('v7');

      // Enter: 버튼에 포커스가 있으면 해당 버튼의 기본 동작 우선
      if (key === 'enter' && !(e.target instanceof HTMLButtonElement)) {
        generate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setVersion, generate]);

  // 전체 복사
  const handleCopyAll = async () => {
    const textToCopy = uuids.join('\n');
    const success = await copyToClipboard(textToCopy);

    if (success) {
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 1500);
    } else {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  // 개별 UUID 복사
  const handleCopySingle = async (uuid: string, index: number) => {
    const success = await copyToClipboard(uuid);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1000);
    }
  };

  const handleRegenerate = () => {
    generate();
  };

  // 단일 UUID 여부 (레이아웃 결정용)
  const isSingle = uuids.length === 1;

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Version Selector - 고정 */}
      <div className="shrink-0">
        <VersionSelector selected={version} onChange={setVersion} />
      </div>

      {/* UUID Output - flex-1로 남은 공간 채움 */}
      <div className="relative flex-1 flex flex-col min-h-0">
        {/* Terminal-style header */}
        <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border border-border-subtle border-b-0 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-red/80" />
            <span className="w-3 h-3 rounded-full bg-accent-amber/80" />
            <span className="w-3 h-3 rounded-full bg-accent-mint/80" />
          </div>
          <div className="flex items-center gap-3">
            {/* UUIDs 배지 - 항상 공간 유지, visibility로 토글 */}
            <span className={`
              px-2 py-0.5 text-[10px] font-mono uppercase
              bg-accent-mint/10 border border-accent-mint/30 text-accent-mint
              min-w-[70px] text-center
              transition-opacity duration-150
              ${uuids.length > 1 ? 'opacity-100' : 'opacity-0'}
            `}>
              {uuids.length > 1 ? `${uuids.length} UUIDs` : '1 UUID'}
            </span>
            <span className="text-text-muted font-mono text-xs">
              output.{version}
            </span>
          </div>
        </div>

        {/* Output area - flex-1로 확장 */}
        <output
          aria-live="polite"
          aria-label="생성된 UUID"
          data-testid="uuid-display"
          className="
            block w-full flex-1 min-h-[120px]
            bg-bg-surface border border-border-subtle
            font-mono text-text-primary
            overflow-y-auto
            relative
          "
        >
          {/* Inner container with adaptive layout */}
          <div className={`
            min-h-full p-3
            ${isSingle
              ? 'flex items-center justify-center h-full'
              : 'grid gap-1 content-start'
            }
            ${uuids.length >= 10 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}
          `}>
            {uuids.map((uuid, index) => (
              <button
                key={index}
                onClick={() => handleCopySingle(uuid, index)}
                className={`
                  group relative text-left
                  transition-all duration-150
                  animate-fade-in
                  focus:outline-none
                  ${isSingle
                    ? 'block px-4 py-2 border border-transparent hover:border-accent-mint/30 focus-visible:border-accent-mint focus-visible:text-accent-mint'
                    : `
                      flex items-center gap-3 px-3 py-1.5
                      border border-transparent
                      hover:border-accent-mint/30 hover:bg-bg-hover
                      focus-visible:border-accent-mint/50
                      ${copiedIndex === index ? 'border-accent-mint/50 bg-accent-mint/5' : ''}
                    `
                  }
                `}
                style={{ animationDelay: `${index * 20}ms` }}
                title="클릭하여 복사"
              >
                {/* Line number (multi only) */}
                {!isSingle && (
                  <span className={`
                    font-mono text-xs w-6 text-right shrink-0
                    ${copiedIndex === index ? 'text-accent-mint' : 'text-text-muted'}
                  `}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}

                {/* UUID value */}
                <span className={`
                  ${isSingle
                    ? 'text-xl sm:text-2xl tracking-wide text-center inline-flex items-center justify-center'
                    : 'text-sm flex-1 truncate'
                  }
                  ${copiedIndex === index ? 'text-accent-mint' : ''}
                `}>
                  {uuid}
                  {/* Cursor for single UUID - inline with text */}
                  {isSingle && (
                    <span className="inline-block w-3 h-7 bg-accent-mint ml-2 animate-blink" />
                  )}
                </span>

                {/* Copy indicator (multi-UUID only) */}
                {!isSingle && (
                  copiedIndex === index ? (
                    <span className="text-accent-mint text-xs font-mono shrink-0">
                      [OK]
                    </span>
                  ) : (
                    <span className="text-text-muted text-xs font-mono shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      [CP]
                    </span>
                  )
                )}
              </button>
            ))}
          </div>

          {/* Scroll fade hint (appears when scrollable) */}
          {uuids.length > 5 && (
            <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none" />
          )}
        </output>

        {/* Click hint for single */}
        {isSingle && (
          <div className="absolute bottom-2 right-3 text-text-muted/50 font-mono text-[10px]">
            click to copy
          </div>
        )}
      </div>

      {/* Action buttons - 고정, padding으로 focus shadow 공간 확보 */}
      <div className="flex gap-3 shrink-0 p-1 -m-1">
        <Button
          data-testid="copy-btn"
          onClick={handleCopyAll}
          variant={copied ? 'primary' : 'secondary'}
          size="lg"
          aria-label="UUID를 클립보드에 복사"
          className="flex-1"
        >
          {/* 고정 너비 텍스트 - 가장 긴 텍스트 기준 */}
          <span className="inline-block min-w-[90px]">
            {copied ? '[ COPIED ]' : uuids.length > 1 ? '[ COPY ALL ]' : '[ COPY ]'}
          </span>
        </Button>
        <Button
          data-testid="generate-btn"
          onClick={handleRegenerate}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          [ GENERATE ]
        </Button>
      </div>

      {/* Error message - 고정 높이, opacity로 토글 */}
      <div
        role="alert"
        aria-hidden={!copyError}
        className={`
          shrink-0 overflow-hidden transition-all duration-200
          ${copyError ? 'h-8 opacity-100' : 'h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-2 bg-accent-red/10 border border-accent-red/30 font-mono text-xs text-accent-red">
          <span className="text-accent-red/60">[ERROR]</span> 복사에 실패했습니다. 직접 선택하여 복사해주세요.
        </div>
      </div>

      {/* Screen reader announcement */}
      <div role="status" aria-live="assertive" className="sr-only">
        {copied ? 'UUID가 클립보드에 복사되었습니다' : ''}
        {copiedIndex !== null ? `UUID ${copiedIndex + 1}이(가) 복사되었습니다` : ''}
      </div>

      {/* Options - 고정 */}
      <div className="shrink-0">
        <OptionsPanel options={options} onChange={setOptions} />
      </div>

      {/* History - 고정 (간소화) */}
      <div className="shrink-0">
        <UuidHistory
          history={history}
          onClear={clearHistory}
          onRemove={removeFromHistory}
        />
      </div>
    </div>
  );
}
