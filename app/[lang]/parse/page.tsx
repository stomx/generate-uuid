import dynamic from 'next/dynamic';
import { locales, generatePageMetadata, type Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return generatePageMetadata(lang, 'parse', '/parse');
}

const UuidParser = dynamic(
  () => import('@/components/parser').then((mod) => mod.UuidParser),
  {
    loading: () => (
      <div className="flex items-center justify-center h-32 text-text-muted font-mono text-sm">
        <span className="animate-pulse">Loading...</span>
      </div>
    ),
  }
);

export default function ParsePage() {
  return <UuidParser />;
}
