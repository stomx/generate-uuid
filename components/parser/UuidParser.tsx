'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { parseUuid, formatParsedUuid, validateUuid } from '@/lib/uuid';

export function UuidParser() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 탭 전환 시 인풋에 포커스 (키 이벤트 완료 후 포커스)
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleParse = useCallback(() => {
    if (!input.trim()) {
      setFormatted(null);
      setError(null);
      return;
    }

    // 먼저 검증
    const validation = validateUuid(input);

    if (!validation.isValid) {
      setError('유효하지 않은 UUID입니다.');
      setFormatted(null);
      return;
    }

    if (!validation.isSupported) {
      setError(`${validation.version?.toUpperCase()} 버전은 파싱을 지원하지 않습니다.`);
      setFormatted(null);
      return;
    }

    const result = parseUuid(input);

    if (result) {
      setFormatted(formatParsedUuid(result));
      setError(null);
    } else {
      setError('UUID를 파싱할 수 없습니다.');
      setFormatted(null);
    }
  }, [input]);

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
    <div className="space-y-6">
      {/* 입력 필드 */}
      <div className="flex gap-2 p-1.5 -m-1.5">
        <Input
          ref={inputRef}
          placeholder="파싱할 UUID를 입력하세요..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="파싱할 UUID 입력"
          className="flex-1"
        />
        <Button variant="primary" onClick={handleParse}>
          [ PARSE ]
        </Button>
        <Button variant="ghost" onClick={handleClear} aria-label="입력 지우기">
          [CLR]
        </Button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="px-4 py-3 bg-accent-red/5 border border-accent-red/30 animate-fade-in">
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-accent-red">[ERROR]</span>
            <span className="text-text-primary">{error}</span>
          </div>
        </div>
      )}

      {/* 파싱 결과 */}
      {formatted && (
        <div className="border border-border-subtle bg-bg-surface animate-fade-in">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border-b border-border-subtle">
            <span className="text-text-muted font-mono text-xs">{'// PARSE_RESULT'}</span>
            <span className="px-2 py-0.5 text-xs font-mono bg-accent-mint/10 border border-accent-mint/30 text-accent-mint">
              SUCCESS
            </span>
          </div>

          {/* 결과 데이터 */}
          <div className="p-4 space-y-2">
            {Object.entries(formatted).map(([key, value], index) => (
              <div
                key={key}
                className="flex items-start gap-4 font-mono text-sm animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-text-muted w-4 text-right">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-accent-cyan w-32 uppercase">{key}</span>
                <span className="text-text-primary break-all flex-1">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 지원 버전 안내 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-text-muted font-mono text-xs">{'// SUPPORTED_VERSIONS'}</span>
        </div>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-start gap-3">
            <span className="px-1.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
              V1
            </span>
            <span className="text-text-secondary">
              타임스탬프, 클럭 시퀀스, 노드 ID 추출
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="px-1.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
              V4
            </span>
            <span className="text-text-secondary">
              랜덤 비트 표시 (추출 가능한 정보 없음)
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="px-1.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">
              V7
            </span>
            <span className="text-text-secondary">
              Unix 타임스탬프 추출
            </span>
          </div>
          <div className="flex items-start gap-3 mt-3 pt-3 border-t border-border-subtle">
            <span className="text-text-muted">
              v3, v5, v6 등 - 검증만 가능, 파싱 미지원
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
