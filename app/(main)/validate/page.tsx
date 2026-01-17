import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'UUID Validator - Check UUID Format & Version | UUID Generator',
  description:
    'Validate UUID format and version (v1, v4, v7). Check UUID compliance with RFC 9562 standards. Detect invalid UUIDs and verify structure. Free online UUID validation tool.',
  keywords: [
    'UUID validator',
    'validate UUID',
    'check UUID',
    'UUID format checker',
    'UUID version detector',
    'RFC 9562 validator',
    'UUID compliance',
    'verify UUID',
  ],
  openGraph: {
    title: 'UUID Validator - Check UUID Format & Version',
    description:
      'Validate UUID format and version. Check UUID compliance with RFC 9562 standards.',
    url: 'https://uuid.stomx.net/validate',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID Validator - Check UUID Format & Version',
    description: 'Validate UUID format and version. Check RFC 9562 compliance.',
  },
  alternates: {
    canonical: 'https://uuid.stomx.net/validate',
  },
};

const UuidValidator = dynamic(
  () => import('@/components/validator').then((mod) => mod.UuidValidator),
  {
    loading: () => (
      <div className="flex items-center justify-center h-32 text-text-muted font-mono text-sm">
        <span className="animate-pulse">Loading...</span>
      </div>
    ),
  }
);

export default function ValidatePage() {
  return <UuidValidator />;
}
