'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { parseUuid, formatParsedUuid, validateUuid } from '@/lib/uuid';
import { useLocalStorage } from '@/hooks';
import { copyToClipboard } from '@/lib/utils/clipboard';
import type { ParseHistoryItem, ParsedUuid } from '@/types/uuid';

const MAX_HISTORY = 20;

export function UuidParser() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<ParseHistoryItem[]>('uuid-parse-history', []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 탭 전환 시 인풋에 포커스 (키 이벤트 완료 후 포커스)
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 히스토리에 추가
  const addToHistory = useCallback((
    inputValue: string,
    result: ParsedUuid | null,
    formattedResult: Record<string, string> | null,
    errorMsg: string | null
  ) => {
    const trimmedInput = inputValue.trim();
    // 동일한 입력이 최근에 있으면 추가하지 않음
    if (history.length > 0 && history[0].input === trimmedInput) {
      return;
    }

    const newItem: ParseHistoryItem = {
      id: crypto.randomUUID(),
      input: trimmedInput,
      result,
      formatted: formattedResult,
      error: errorMsg,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY));
  }, [history, setHistory]);

  // 히스토리 복사
  const handleCopyFromHistory = async (item: ParseHistoryItem) => {
    const success = await copyToClipboard(item.input);
    if (success) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  // 히스토리에서 제거
  const handleRemoveFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // 히스토리 전체 삭제
  const handleClearHistory = () => {
    setHistory([]);
  };


  const handleParse = useCallback(() => {
    if (!input.trim()) {
      setFormatted(null);
      setError(null);
      return;
    }

    // 먼저 검증
    const validation = validateUuid(input);

    if (!validation.isValid) {
      const errorMsg = '유효하지 않은 UUID입니다.';
      setError(errorMsg);
      setFormatted(null);
      addToHistory(input, null, null, errorMsg);
      return;
    }

    if (!validation.isSupported) {
      const errorMsg = `${validation.version?.toUpperCase()} 버전은 파싱을 지원하지 않습니다.`;
      setError(errorMsg);
      setFormatted(null);
      addToHistory(input, null, null, errorMsg);
      return;
    }

    const result = parseUuid(input);

    if (result) {
      const formattedResult = formatParsedUuid(result);
      setFormatted(formattedResult);
      setError(null);
      addToHistory(input, result, formattedResult, null);
    } else {
      const errorMsg = 'UUID를 파싱할 수 없습니다.';
      setError(errorMsg);
      setFormatted(null);
      addToHistory(input, null, null, errorMsg);
    }
  }, [input, addToHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleParse();
    }
  };

  const handleClear = () => {
    setInput('');
    setFormatted(null);
    setError(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 입력 필드 */}
      <div className='flex flex-col gap-2'>
        <div className="flex gap-2 p-1 -m-1">
          <Input
            ref={inputRef}
            placeholder="파싱할 UUID를 입력하세요..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label="파싱할 UUID 입력"
            className="flex-1 text-sm sm:text-base"
          />
        </div>
        <div className="flex gap-2 p-1 -m-1">
          <Button variant="primary" onClick={handleParse} className="px-3 sm:px-4 w-full">
            <span className="hidden sm:inline">[ PARSE ]</span>
            <span className="sm:hidden">PARSE</span>
          </Button>
          <Button variant="ghost" onClick={handleClear} aria-label="입력 지우기" className="w-1/3">
            <span className="hidden sm:inline">[CLR]</span>
            <span className="sm:hidden">×</span>
          </Button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-accent-red/5 border border-accent-red/30 animate-fade-in">
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs sm:text-sm">
            <span className="text-accent-red shrink-0">[ERROR]</span>
            <span className="text-text-primary">{error}</span>
          </div>
        </div>
      )}

      {/* 파싱 결과 */}
      {formatted && (
        <div className="border border-border-subtle bg-bg-surface animate-fade-in">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-bg-elevated border-b border-border-subtle">
            <span className="text-text-muted font-mono text-[10px] sm:text-xs">{'// PARSE_RESULT'}</span>
            <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-mono bg-accent-mint/10 border border-accent-mint/30 text-accent-mint">
              SUCCESS
            </span>
          </div>

          {/* 결과 데이터 */}
          <div className="p-3 sm:p-4 space-y-2">
            {Object.entries(formatted).map(([key, value], index) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 font-mono text-xs sm:text-sm animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="hidden sm:inline text-text-muted w-4 text-right shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-accent-cyan w-28 sm:w-32 uppercase shrink-0">{key}</span>
                </div>
                <span className="text-text-primary break-all flex-1 pl-0 sm:pl-0 text-[11px] sm:text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 지원 버전 안내 */}
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-text-muted font-mono text-[10px] sm:text-xs">{'// SUPPORTED_VERSIONS'}</span>
        </div>
        <div className="space-y-2 font-mono text-[10px] sm:text-xs">
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="px-1 sm:px-1.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan shrink-0">
              V1
            </span>
            <span className="text-text-secondary">
              <span className="sm:hidden">타임스탬프, 노드 ID</span>
              <span className="hidden sm:inline">타임스탬프, 클럭 시퀀스, 노드 ID 추출</span>
            </span>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="px-1 sm:px-1.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan shrink-0">
              V4
            </span>
            <span className="text-text-secondary">
              <span className="sm:hidden">랜덤 비트 표시</span>
              <span className="hidden sm:inline">랜덤 비트 표시 (추출 가능한 정보 없음)</span>
            </span>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="px-1 sm:px-1.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan shrink-0">
              V7
            </span>
            <span className="text-text-secondary">
              Unix 타임스탬프 추출
            </span>
          </div>
          <div className="flex items-start gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border-subtle">
            <span className="text-text-muted">
              v3, v5, v6 등 - 검증만 가능
            </span>
          </div>
        </div>
      </Card>

      {/* 파싱 히스토리 */}
      <div className="mt-3 sm:mt-4">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-text-muted font-mono text-[10px] sm:text-xs">
              {'// PARSE_HISTORY'}
            </span>
            <span className="text-text-muted font-mono text-[10px] sm:text-xs min-w-[24px] sm:min-w-[32px]">
              [{history.length}]
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className={`text-[10px] sm:text-xs py-1 px-2 ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-[60px] text-text-muted/50 font-mono text-[10px] sm:text-xs">
              No parse history yet
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="border border-border-subtle bg-bg-surface animate-fade-in"
              >
                {/* 상태 헤더 */}
                <div className={`
                  flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5
                  border-b
                  ${item.error
                    ? 'border-accent-red/30 bg-accent-red/5'
                    : 'border-accent-mint/30 bg-accent-mint/5'
                  }
                `}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`
                      font-mono text-sm sm:text-base
                      ${item.error ? 'text-accent-red' : 'text-accent-mint'}
                    `}>
                      {item.error ? '[ERROR]' : '[PARSED]'}
                    </span>
                    <span className="text-text-secondary font-mono text-[10px] sm:text-xs">
                      {item.error ? '파싱 실패' : '파싱 성공'}
                    </span>
                  </div>
                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCopyFromHistory(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCopyFromHistory(item);
                        }
                      }}
                      className={`
                        px-1.5 py-0.5 font-mono text-[10px] sm:text-xs cursor-pointer
                        transition-colors duration-150
                        ${copiedId === item.id
                          ? 'text-accent-mint'
                          : 'text-text-muted hover:text-text-primary'
                        }
                      `}
                      aria-label="UUID 복사"
                    >
                      {copiedId === item.id ? '[OK]' : '[CP]'}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRemoveFromHistory(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleRemoveFromHistory(item.id);
                        }
                      }}
                      className="px-1.5 py-0.5 font-mono text-[10px] sm:text-xs text-text-muted hover:text-accent-red transition-colors cursor-pointer"
                      aria-label="히스토리에서 삭제"
                    >
                      [RM]
                    </span>
                  </div>
                </div>

                {/* 입력값 */}
                <div className="px-3 sm:px-4 py-2 border-b border-border-subtle">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0 font-mono text-[10px] sm:text-xs">
                    <span className="text-text-muted w-20 sm:w-24 shrink-0">INPUT</span>
                    <code className="text-text-primary break-all">
                      {item.input}
                    </code>
                  </div>
                </div>

                {/* 파싱 결과 (성공한 경우) */}
                {item.formatted && (
                  <div className="p-3 sm:p-4 space-y-1.5 font-mono text-[10px] sm:text-xs">
                    {Object.entries(item.formatted).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0 w-full">
                        <span className="text-text-muted w-20 sm:w-24 shrink-0 uppercase">{key}</span>
                        <span className="text-text-primary break-all">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 에러 메시지 */}
                {item.error && (
                  <div className="p-3 sm:p-4 space-y-1.5 border-t border-border-subtle">
                    <div className="flex items-start gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs">
                      <span className="text-accent-red shrink-0">[ERR]</span>
                      <span className="text-text-primary">{item.error}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
