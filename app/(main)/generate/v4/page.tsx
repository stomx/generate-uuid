import type { Metadata } from 'next';
import { UuidGenerator } from '@/components/generator';

export const metadata: Metadata = {
  title: 'UUID v4 Generator - Random UUID Generator | UUID Generator',
  description:
    'Generate UUID version 4 (random) with cryptographically secure randomness. Create truly random unique identifiers. Free online tool with RFC 9562 compliance.',
  keywords: [
    'UUID v4 generator',
    'UUID version 4',
    'random UUID',
    'crypto UUID',
    'GUID generator',
    'UUID v4 online',
    'RFC 9562 v4',
    'secure random UUID',
  ],
  openGraph: {
    title: 'UUID v4 Generator - Random UUID',
    description:
      'Generate UUID v4 with cryptographically secure randomness. Free online tool with RFC 9562 compliance.',
    url: 'https://uuid.stomx.net/generate/v4',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID v4 Generator - Random UUID',
    description: 'Generate UUID v4 with cryptographically secure randomness.',
  },
  alternates: {
    canonical: 'https://uuid.stomx.net/generate/v4',
  },
};

export default function GenerateV4Page() {
  return <UuidGenerator initialVersion="v4" />;
}
