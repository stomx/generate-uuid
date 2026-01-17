import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'UUID Parser - Extract Timestamp & Decode UUID | UUID Generator',
  description:
    'Parse and decode UUID structure. Extract timestamp from UUID v1 and v7. Analyze UUID components including version, variant, and embedded data. Free online UUID parsing tool.',
  keywords: [
    'UUID parser',
    'parse UUID',
    'decode UUID',
    'UUID timestamp extraction',
    'UUID analyzer',
    'UUID decoder',
    'extract UUID timestamp',
    'UUID structure',
  ],
  openGraph: {
    title: 'UUID Parser - Extract Timestamp & Decode UUID',
    description:
      'Parse and decode UUID structure. Extract timestamp from UUID v1 and v7.',
    url: 'https://uuid.stomx.net/parse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID Parser - Extract Timestamp & Decode UUID',
    description: 'Parse UUID and extract timestamp from v1 and v7.',
  },
  alternates: {
    canonical: 'https://uuid.stomx.net/parse',
  },
};

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
