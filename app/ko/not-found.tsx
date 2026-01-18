import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - 페이지를 찾을 수 없음 | UUID 생성기',
  description: '요청하신 페이지를 찾을 수 없습니다. UUID 생성기로 돌아가세요.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
      <div className="max-w-md space-y-6">
        {/* ASCII Art Error */}
        <pre className="font-mono text-accent-red text-xs sm:text-sm leading-tight overflow-x-auto">
          {`
╔══════════════════════════════╗
║         오류  404             ║
║    페이지를  찾을  수  없음    ║
╚══════════════════════════════╝
          `}
        </pre>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
            <span className="text-accent-red">[</span>
            <span className="text-text-primary">404</span>
            <span className="text-accent-red">]</span>
            {' '}페이지를 찾을 수 없음
          </h1>

          <p className="font-mono text-sm sm:text-base text-text-muted">
            요청하신 URL은 이 서버에 존재하지 않습니다.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-3 pt-4">
          <Link
            href="/ko/generate/v7"
            className="inline-block px-6 py-3 font-mono text-sm border-2 border-accent-mint text-accent-mint hover:bg-accent-mint hover:text-bg-deep transition-all duration-200"
          >
            → 생성기로 돌아가기
          </Link>

          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <Link href="/ko/validate" className="text-text-muted hover:text-accent-cyan transition-colors">
              검증기
            </Link>
            <span className="text-text-muted/30">|</span>
            <Link href="/ko/parse" className="text-text-muted hover:text-accent-amber transition-colors">
              파서
            </Link>
          </div>
        </div>

        {/* Status Code */}
        <div className="pt-6 text-[10px] font-mono text-text-muted/50">
          <code>HTTP/1.1 404 Not Found</code>
        </div>
      </div>
    </div>
  );
}
