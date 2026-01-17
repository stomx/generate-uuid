import type { Metadata } from 'next';
import { UuidGenerator } from '@/components/generator';

export const metadata: Metadata = {
  title: 'UUID v1 Generator - Timestamp-based UUID Generator | UUID Generator',
  description:
    'Generate UUID version 1 (time-based) with timestamp and MAC address node. Create unique identifiers with embedded temporal information. Free online tool with RFC 9562 compliance.',
  keywords: [
    'UUID v1 generator',
    'UUID version 1',
    'time-based UUID',
    'timestamp UUID',
    'MAC address UUID',
    'UUID v1 online',
    'RFC 9562 v1',
    'temporal UUID',
  ],
  openGraph: {
    title: 'UUID v1 Generator - Timestamp-based UUID',
    description:
      'Generate UUID v1 with timestamp and node information. Free online tool with RFC 9562 compliance.',
    url: 'https://uuid.stomx.net/generate/v1',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID v1 Generator - Timestamp-based UUID',
    description: 'Generate UUID v1 with timestamp and node information.',
  },
  alternates: {
    canonical: 'https://uuid.stomx.net/generate/v1',
  },
};

export default function GenerateV1Page() {
  return <UuidGenerator initialVersion="v1" />;
}
