'use client';

import { useState } from 'react';
import type { UuidHistoryItem } from '@/types/uuid';
import { Button } from '@/components/ui';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface UuidHistoryProps {
  history: UuidHistoryItem[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

export function UuidHistory({ history, onClear, onRemove }: UuidHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (item: UuidHistoryItem) => {
    const success = await copyToClipboard(item.uuid);
    if (success) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'now';
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHour < 24) return `${diffHour}h`;
    return date.toLocaleDateString('ko-KR');
  };

  // 항상 렌더링하여 레이아웃 시프트 방지
  const isEmpty = history.length === 0;

  return (
    <div className="mt-4">
      {/* Header - 항상 표시 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-text-muted font-mono text-xs">
            {'// HISTORY'}
          </span>
          <span className="text-text-muted font-mono text-xs min-w-[32px]">
            [{history.length}]
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isEmpty}
          className={isEmpty ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Clear All
        </Button>
      </div>

      {/* List - 고정 높이 컨테이너 */}
      <div className="space-y-1 h-[180px] overflow-y-auto">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full text-text-muted/50 font-mono text-xs">
            No history yet
          </div>
        ) : (
          history.slice(0, 10).map((item, index) => (
            <div
              key={item.id}
              className="
                group flex items-center gap-3 px-3 py-1.5
                bg-bg-surface border border-border-subtle
                hover:border-border-dashed hover:bg-bg-hover
                transition-all duration-150
                animate-fade-in
              "
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Line number */}
              <span className="text-text-muted font-mono text-xs w-6 text-right shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* UUID */}
              <code className="flex-1 font-mono text-sm text-text-primary truncate">
                {item.uuid}
              </code>

              {/* Version badge */}
              <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-bg-elevated text-accent-cyan border border-accent-cyan/30 shrink-0">
                {item.version}
              </span>

              {/* Time */}
              <span className="text-text-muted font-mono text-xs w-10 text-right shrink-0">
                {formatTime(item.createdAt)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(item)}
                  className={`
                    px-1.5 py-0.5 font-mono text-xs
                    transition-colors duration-150
                    focus:outline-none focus-visible:text-accent-mint
                    ${copiedId === item.id
                      ? 'text-accent-mint'
                      : 'text-text-muted hover:text-text-primary'
                    }
                  `}
                  aria-label="UUID 복사"
                >
                  {copiedId === item.id ? '[OK]' : '[CP]'}
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-1.5 py-0.5 font-mono text-xs text-text-muted hover:text-accent-red transition-colors focus:outline-none focus-visible:text-accent-red"
                  aria-label="히스토리에서 삭제"
                >
                  [RM]
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* More entries - 고정 높이, visibility로 토글 */}
      <p className={`
        h-5 mt-1 text-center text-text-muted font-mono text-xs
        transition-opacity duration-150
        ${history.length > 10 ? 'opacity-100' : 'opacity-0'}
      `}>
        {history.length > 10 ? `+ ${history.length - 10} more entries` : '\u00A0'}
      </p>
    </div>
  );
}
