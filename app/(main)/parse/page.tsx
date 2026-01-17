import dynamic from 'next/dynamic';
import { generatePageMetadata } from '@/lib/i18n';

export async function generateMetadata() {
  return generatePageMetadata('en', 'parse', '/parse');
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
