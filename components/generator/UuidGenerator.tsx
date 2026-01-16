'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { VersionSelector } from './VersionSelector';
import { OptionsPanel } from './OptionsPanel';
import { useUuidGenerator } from '@/hooks';
import { copyToClipboard } from '@/lib/utils/clipboard';

export function UuidGenerator() {
  const {
    uuids,
    version,
    options,
    generate,
    setVersion,
    setOptions,
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
  const handleCopySingle = async (uuid: string, index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    // 복사 후 focus 제거 (currentTarget = 버튼 자체)
    e.currentTarget.blur();

    const success = await copyToClipboard(uuid);
    if (success) {
      setCopiedIndex(index);
      // 텍스트 선택 해제 (select-all로 인한 selection 하이라이트 제거)
      window.getSelection()?.removeAllRanges();
      setTimeout(() => setCopiedIndex(null), 1000);
    }
  };

  const handleRegenerate = () => {
    generate();
  };

  // 단일 UUID 여부 (레이아웃 결정용)
  const isSingle = uuids.length === 1;

  return (
    <div className="flex flex-col h-full min-h-0 gap-3 sm:gap-4">
      {/* Version Selector */}
      <div className="shrink-0">
        <VersionSelector selected={version} onChange={setVersion} />
      </div>

      {/* Controls: Options + Buttons */}
      <div className="shrink-0 flex flex-col items-center justify-between gap-4 py-2.5 sm:py-4 border-t border-border-subtle w-full">
        {/* <div className="flex gap-2 sm:gap-3 shrink-0">
          <Button
            data-testid="copy-btn"
            onClick={handleCopyAll}
            variant={copied ? 'primary' : 'secondary'}
            size="lg"
            aria-label="UUID를 클립보드에 복사"
            className="flex-1 sm:flex-none"
          >
            <span className="inline-block sm:min-w-[90px]">
              <span className="hidden sm:inline">
                {copied ? '[ COPIED ]' : uuids.length > 1 ? '[ COPY ALL ]' : '[ COPY ]'}
              </span>
              <span className="sm:hidden">
                {copied ? 'COPIED' : 'COPY'}
              </span>
            </span>
          </Button> */}
        <Button
          data-testid="generate-btn"
          onClick={handleRegenerate}
          variant="primary"
          size="lg"
          className="w-full"
        >
          <span className="hidden sm:inline">[ GENERATE ]</span>
          <span className="sm:hidden">GEN</span>
        </Button>
        {/* </div> */}
        <OptionsPanel options={options} onChange={setOptions} />
      </div>

      {/* UUID Output */}
      <div className="relative sm:flex-1 flex flex-col sm:min-h-0">
        {/* Terminal-style header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-bg-elevated border border-border-subtle border-b-0 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 justify-between w-full">
            {/* UUIDs 배지 - 항상 공간 유지, visibility로 토글 */}
            <span className={`
              px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono uppercase
              bg-accent-mint/10 border border-accent-mint/30 text-accent-mint
              min-w-[50px] sm:min-w-[70px] text-center
              transition-opacity duration-150
              ${uuids.length > 1 ? 'opacity-100' : 'opacity-0'}
            `}>
              {uuids.length > 1 ? `${uuids.length} UUIDs` : '1 UUID'}
            </span>
            <div className='flex items-center gap-1.5 sm:gap-2'>

              <span className="text-text-muted font-mono text-[10px] sm:text-xs">
                output.{version}
              </span>
              <button
                onClick={handleCopyAll}
                className={`
                w-6 h-6 flex items-center justify-center transition-all duration-150
                ${copied
                    ? 'bg-accent-mint text-bg-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                  }
              `}
                aria-label="전체 복사"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Output area */}
        <output
          aria-live="polite"
          aria-label="생성된 UUID"
          data-testid="uuid-display"
          className="
            block w-full min-h-[80px] sm:min-h-[120px]
            bg-bg-surface border border-border-subtle
            font-mono text-text-primary
            relative
          "
        >
          {/* Inner container - always single column */}
          <div className={`
            min-h-full p-2 sm:p-3
            ${isSingle
              ? 'flex items-center justify-center py-4 sm:h-full'
              : 'flex flex-col gap-0.5 sm:gap-1'
            }
          `}>
            {uuids.map((uuid, index) => (
              <button
                key={index}
                onClick={(e) => handleCopySingle(uuid, index, e)}
                className={`
                  group relative text-left
                  transition-all duration-150
                  animate-fade-in
                  focus:outline-none focus:border-transparent focus:bg-transparent
                  ${isSingle
                    ? `block px-2 sm:px-4 py-2 border border-transparent hover:border-accent-mint/30
                       ${copiedIndex === index ? 'border-accent-mint/50 bg-accent-mint/5' : ''}`
                    : `flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5
                       border border-transparent hover:border-accent-mint/30 hover:bg-bg-hover
                       ${copiedIndex === index ? 'border-accent-mint/50 bg-accent-mint/5' : ''}`
                  }
                `}
                style={{ animationDelay: `${index * 20}ms` }}
                title="클릭하여 복사"
              >
                {/* Line number (multi only) - 데스크톱만 */}
                {!isSingle && (
                  <span className={`
                    hidden sm:inline font-mono text-xs w-6 text-right shrink-0
                    ${copiedIndex === index ? 'text-accent-mint' : 'text-text-muted'}
                  `}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}

                {/* UUID value */}
                <span className={`
                  text-sm sm:text-lg md:text-xl tracking-wide select-all
                  ${isSingle ? 'text-center' : 'flex-1'}
                  ${copiedIndex === index ? 'text-accent-mint' : ''}
                `}>
                  {uuid}
                </span>

                {/* Copy indicator (multi-UUID only) - 모바일에서 항상 표시 */}
                {!isSingle && (
                  copiedIndex === index ? (
                    <span className="text-accent-mint text-[10px] sm:text-xs font-mono shrink-0">
                      [OK]
                    </span>
                  ) : (
                    <span className="text-text-muted text-[10px] sm:text-xs font-mono shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      [CP]
                    </span>
                  )
                )}
              </button>
            ))}
          </div>
        </output>

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
    </div>
  );
}
