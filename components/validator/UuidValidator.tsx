'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { validateUuid } from '@/lib/uuid';
import type { ValidationResult } from '@/types/uuid';

export function UuidValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 탭 전환 시 인풋에 포커스 (키 이벤트 완료 후 포커스)
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    const validationResult = validateUuid(input);
    setResult(validationResult);
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // 실시간 검증
    if (e.target.value.trim()) {
      const validationResult = validateUuid(e.target.value);
      setResult(validationResult);
    } else {
      setResult(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 입력 필드 */}
      <div className="flex gap-2 p-1.5 -m-1.5">
        <Input
          ref={inputRef}
          data-testid="uuid-input"
          placeholder="UUID를 입력하세요..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          aria-label="검증할 UUID 입력"
          className="flex-1"
        />
        <Button variant="ghost" onClick={handleClear} aria-label="입력 지우기">
          [CLR]
        </Button>
      </div>

      {/* 검증 결과 */}
      {result && (
        <div
          data-testid="validation-result"
          className="border border-border-subtle bg-bg-surface animate-fade-in"
        >
          {/* 상태 헤더 */}
          <div className={`
            flex items-center gap-3 px-4 py-3
            border-b
            ${result.isValid
              ? 'border-accent-mint/30 bg-accent-mint/5'
              : 'border-accent-red/30 bg-accent-red/5'
            }
          `}>
            <span className={`
              font-mono text-lg
              ${result.isValid ? 'text-accent-mint' : 'text-accent-red'}
            `}>
              {result.isValid ? '[VALID]' : '[INVALID]'}
            </span>
            <span className="text-text-secondary font-mono text-sm">
              {result.isValid ? '유효한 UUID' : '유효하지 않은 UUID'}
            </span>
          </div>

          {/* 상세 정보 */}
          {result.isValid && result.version && (
            <div className="p-4 space-y-2 font-mono text-sm">
              <div className="flex items-center">
                <span className="text-text-muted w-24">VERSION</span>
                <span className="text-accent-cyan">
                  {result.version.toUpperCase()}
                </span>
                {!result.isSupported && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">
                    UNSUPPORTED
                  </span>
                )}
              </div>

              <div className="flex items-center">
                <span className="text-text-muted w-24">VARIANT</span>
                <span className="text-text-primary">{result.variant}</span>
              </div>

              <div className="flex items-start">
                <span className="text-text-muted w-24">NORMALIZED</span>
                <code className="text-text-primary break-all">
                  {result.normalized}
                </code>
              </div>

              <div className="flex items-center">
                <span className="text-text-muted w-24">PARSEABLE</span>
                <span className={result.isSupported ? 'text-accent-mint' : 'text-text-muted'}>
                  {result.isSupported ? '[YES]' : '[NO]'}
                </span>
              </div>
            </div>
          )}

          {/* 에러 목록 */}
          {result.errors.length > 0 && (
            <div className="p-4 space-y-2 border-t border-border-subtle">
              {result.errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 font-mono text-sm"
                >
                  <span className="text-accent-red">[ERR]</span>
                  <span className="text-text-primary">
                    {error.message}
                    {error.position !== undefined && (
                      <span className="text-text-muted ml-2">
                        @ position {error.position}
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
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-text-muted font-mono text-xs">{'// ACCEPTED_FORMATS'}</span>
        </div>
        <div className="space-y-1 font-mono text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-4">→</span>
            <code>550e8400-e29b-41d4-a716-446655440000</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-4">→</span>
            <code>550e8400e29b41d4a716446655440000</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-4">→</span>
            <code>{'{550e8400-e29b-41d4-a716-446655440000}'}</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-mint w-4">→</span>
            <code>urn:uuid:550e8400-e29b-41d4-a716-446655440000</code>
          </div>
        </div>
      </Card>
    </div>
  );
}
