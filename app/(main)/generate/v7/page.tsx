import type { Metadata } from 'next';
import { UuidGenerator } from '@/components/generator';

export const metadata: Metadata = {
  title: 'UUID v7 Generator - Modern Sortable UUID Generator | UUID Generator',
  description:
    'Generate UUID version 7 (time-ordered) with Unix timestamp for database efficiency. Modern sortable UUIDs perfect for distributed systems. Free online tool with RFC 9562 compliance.',
  keywords: [
    'UUID v7 generator',
    'UUID version 7',
    'sortable UUID',
    'time-ordered UUID',
    'Unix timestamp UUID',
    'database UUID',
    'UUID v7 online',
    'RFC 9562 v7',
    'modern UUID',
  ],
  openGraph: {
    title: 'UUID v7 Generator - Modern Sortable UUID',
    description:
      'Generate UUID v7 with Unix timestamp for database efficiency. Modern sortable UUIDs for distributed systems.',
    url: 'https://uuid.stomx.net/generate/v7',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID v7 Generator - Modern Sortable UUID',
    description: 'Generate UUID v7 with Unix timestamp for database efficiency.',
  },
  alternates: {
    canonical: 'https://uuid.stomx.net/generate/v7',
  },
};

export default function GenerateV7Page() {
  return <UuidGenerator initialVersion="v7" />;
}
