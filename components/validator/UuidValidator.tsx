'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { validateUuid } from '@/lib/uuid';
import { useLocalStorage } from '@/hooks';
import { copyToClipboard } from '@/lib/utils/clipboard';
import type { ValidationResult, ValidationHistoryItem } from '@/types/uuid';

const MAX_HISTORY = 20;

export function UuidValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [history, setHistory] = useLocalStorage<ValidationHistoryItem[]>('uuid-validation-history', []);
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
  const addToHistory = useCallback((inputValue: string, validationResult: ValidationResult) => {
    const trimmedInput = inputValue.trim();
    // 동일한 입력이 최근에 있으면 추가하지 않음
    if (history.length > 0 && history[0].input === trimmedInput) {
      return;
    }

    const newItem: ValidationHistoryItem = {
      id: crypto.randomUUID(),
      input: trimmedInput,
      result: validationResult,
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => [newItem, ...prev].slice(0, MAX_HISTORY));
  }, [history, setHistory]);

  // 히스토리 복사
  const handleCopyFromHistory = async (item: ValidationHistoryItem) => {
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


  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    const validationResult = validateUuid(input);
    setResult(validationResult);
    addToHistory(input, validationResult);
  }, [input, addToHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 입력 필드 */}
      <div className='flex flex-col gap-2'>
        <div className="flex gap-2 p-1 -m-1">
          <Input
            ref={inputRef}
            data-testid="uuid-input"
            placeholder="검증할 UUID를 입력하세요..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
            aria-label="검증할 UUID 입력"
            className="flex-1 text-sm sm:text-base"
          />
        </div>
        <div className="flex gap-2 p-1 -m-1">
          <Button variant="primary" onClick={handleValidate} className="px-3 sm:px-4 w-full">
            <span className="hidden sm:inline">[ VALIDATE ]</span>
            <span className="sm:hidden">VALID</span>
          </Button>
          <Button variant="ghost" onClick={handleClear} aria-label="입력 지우기" className="w-1/3">
            <span className="hidden sm:inline">[CLR]</span>
            <span className="sm:hidden">×</span>
          </Button>
        </div>
      </div>

      {/* 검증 결과 */}
      {result && (
        <div
          data-testid="validation-result"
          className="border border-border-subtle bg-bg-surface animate-fade-in"
        >
          {/* 상태 헤더 */}
          <div className={`
            flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3
            border-b
            ${result.isValid
              ? 'border-accent-mint/30 bg-accent-mint/5'
              : 'border-accent-red/30 bg-accent-red/5'
            }
          `}>
            <span className={`
              font-mono text-base sm:text-lg
              ${result.isValid ? 'text-accent-mint' : 'text-accent-red'}
            `}>
              {result.isValid ? '[VALID]' : '[INVALID]'}
            </span>
            <span className="text-text-secondary font-mono text-xs sm:text-sm">
              {result.isValid ? '유효한 UUID' : '유효하지 않은 UUID'}
            </span>
          </div>

          {/* 상세 정보 */}
          {result.isValid && result.version && (
            <div className="p-3 sm:p-4 space-y-2 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center w-full">
                  <span className="text-text-muted w-16 sm:w-20 shrink-0">VERSION</span>
                  <span className="text-accent-cyan">
                    {result.version.toUpperCase()}
                  </span>
                  {!result.isSupported && (
                    <span className="ml-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">
                      UNSUPPORTED
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-text-muted w-16 sm:w-20 shrink-0">VARIANT</span>
                  <span className="text-text-primary">{result.variant}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0 w-full">
                <span className="text-text-muted w-20 sm:w-24 shrink-0">NORMALIZED</span>
                <code className="text-text-primary text-[11px] sm:text-sm break-all">
                  {result.normalized}
                </code>
              </div>
            </div>
          )}

          {/* 에러 목록 */}
          {result.errors.length > 0 && (
            <div className="p-3 sm:p-4 space-y-2 border-t border-border-subtle">
              {result.errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 font-mono text-xs sm:text-sm"
                >
                  <span className="text-accent-red shrink-0">[ERR]</span>
                  <span className="text-text-primary">
                    {error.message}
                    {error.position !== undefined && (
                      <span className="text-text-muted ml-1 sm:ml-2 text-[10px] sm:text-xs">
                        @ pos {error.position}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 허용 포맷 안내 */}
      <Card className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-text-muted font-mono text-[10px] sm:text-xs">{'// ACCEPTED_FORMATS'}</span>
        </div>
        <div className="space-y-1 font-mono text-[10px] sm:text-xs text-text-secondary overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-3 sm:w-4 shrink-0">→</span>
            <code className="whitespace-nowrap">550e8400-e29b-41d4-a716-446655440000</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-3 sm:w-4 shrink-0">→</span>
            <code className="whitespace-nowrap">550e8400e29b41d4a716446655440000</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-3 sm:w-4 shrink-0">→</span>
            <code className="whitespace-nowrap">{'{550e8400-e29b-...}'}</code>
            <span className="hidden sm:inline text-text-muted/50">(braced)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-3 sm:w-4 shrink-0">→</span>
            <code className="whitespace-nowrap">urn:uuid:550e84...</code>
            <span className="hidden sm:inline text-text-muted/50">(URN)</span>
          </div>
        </div>
      </Card>

      {/* 검증 히스토리 */}
      <div className="mt-3 sm:mt-4">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-text-muted font-mono text-[10px] sm:text-xs">
              {'// VALIDATION_HISTORY'}
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
              No validation history yet
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
                  ${item.result.isValid
                    ? 'border-accent-mint/30 bg-accent-mint/5'
                    : 'border-accent-red/30 bg-accent-red/5'
                  }
                `}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`
                      font-mono text-sm sm:text-base
                      ${item.result.isValid ? 'text-accent-mint' : 'text-accent-red'}
                    `}>
                      {item.result.isValid ? '[VALID]' : '[INVALID]'}
                    </span>
                    <span className="text-text-secondary font-mono text-[10px] sm:text-xs">
                      {item.result.isValid ? '유효한 UUID' : '유효하지 않은 UUID'}
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

                {/* 상세 정보 (유효한 경우) */}
                {item.result.isValid && item.result.version && (
                  <div className="p-3 sm:p-4 space-y-1.5 font-mono text-[10px] sm:text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center w-full">
                        <span className="text-text-muted w-16 sm:w-20 shrink-0">VERSION</span>
                        <span className="text-accent-cyan">
                          {item.result.version.toUpperCase()}
                        </span>
                        {!item.result.isSupported && (
                          <span className="ml-2 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">
                            UNSUPPORTED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center w-full">
                        <span className="text-text-muted w-16 sm:w-20 shrink-0">VARIANT</span>
                        <span className="text-text-primary">{item.result.variant}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0">
                      <span className="text-text-muted w-20 sm:w-24 shrink-0">NORMALIZED</span>
                      <code className="text-text-primary text-[10px] sm:text-xs break-all">
                        {item.result.normalized}
                      </code>
                    </div>
                  </div>
                )}

                {/* 에러 목록 */}
                {item.result.errors.length > 0 && (
                  <div className="p-3 sm:p-4 space-y-1.5 border-t border-border-subtle">
                    {item.result.errors.map((error, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs"
                      >
                        <span className="text-accent-red shrink-0">[ERR]</span>
                        <span className="text-text-primary">
                          {error.message}
                          {error.position !== undefined && (
                            <span className="text-text-muted ml-1 sm:ml-2 text-[9px] sm:text-[10px]">
                              @ pos {error.position}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
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
