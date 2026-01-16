'use client';

import { useEffect, useState } from 'react';

interface AdBannerProps {
  /**
   * Google AdSense 클라이언트 ID
   */
  adClient: string;
  /**
   * 광고 슬롯 ID
   */
  adSlot: string;
  /**
   * 광고 형식 (기본: auto)
   */
  adFormat?: string;
  /**
   * 전체 너비 반응형 여부
   */
  fullWidthResponsive?: boolean;
  /**
   * 광고 표시 지연 시간 (초, 기본: 3초)
   */
  delay?: number;
  /**
   * 커스텀 클래스명
   */
  className?: string;
}

/**
 * 터미널 스타일 Google AdSense 배너
 *
 * 페이지 로드 후 지정된 시간(기본 3초) 후에 광고를 표시합니다.
 *
 * 사용법:
 * <AdBanner
 *   adClient="ca-pub-XXXXXXXXXXXXXXXX"
 *   adSlot="XXXXXXXXXX"
 *   delay={3}
 * />
 */
export function AdBanner({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  delay = 3,
  className = '',
}: AdBannerProps) {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // 지정된 시간 후 광고 표시
    const timer = setTimeout(() => {
      setShowAd(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!showAd) return;

    // 광고 표시 후 AdSense 스크립트 실행
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [showAd]);

  if (!showAd) {
    return null;
  }

  return (
    <div className={`terminal-ad-container ${className}`}>
      {/* 터미널 스타일 헤더 */}
      <div className="ad-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-accent-mint animate-blink">▸</span>
            <span className="text-text-muted">system</span>
            <span className="text-text-secondary">:</span>
            <span className="text-accent-amber">sponsored</span>
          </div>

          <div className="flex items-center gap-1.5 text-text-muted/30 font-mono text-[10px]">
            <span>[</span>
            <span className="text-text-muted/50">AD</span>
            <span>]</span>
          </div>
        </div>
      </div>

      {/* 광고 컨테이너 */}
      <div className="ad-content">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>

      {/* 터미널 스타일 푸터 */}
      <div className="ad-footer">
        <div className="h-px bg-border-subtle" />
      </div>

      <style jsx>{`
        .terminal-ad-container {
          position: relative;
          width: 100%;
          margin: 0 auto;
          background: var(--bg-surface);
          border: 1px dashed var(--border-dashed);
          overflow: hidden;
          transition: all 0.2s ease;
          animation: fadeInUp 0.4s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .terminal-ad-container:hover {
          border-color: var(--accent-mint);
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.1);
        }

        /* 스캔라인 효과 */
        .terminal-ad-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.05) 2px,
            rgba(0, 0, 0, 0.05) 4px
          );
          pointer-events: none;
          z-index: 1;
        }

        .ad-header {
          padding: 0.5rem 0.75rem;
          background: var(--bg-elevated);
          border-bottom: 1px dashed var(--border-dashed);
        }

        .ad-content {
          position: relative;
          min-height: 90px;
          padding: 1rem;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ad-footer {
          padding: 0.25rem 0.75rem;
        }

        /* 반응형 */
        @media (min-width: 640px) {
          .ad-content {
            min-height: 100px;
          }
        }

        /* 광고 로딩 상태 */
        .adsbygoogle[data-ad-status="unfilled"]::before {
          content: '> Ad loading...';
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          color: var(--text-muted);
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}

/**
 * TypeScript 타입 확장
 */
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
