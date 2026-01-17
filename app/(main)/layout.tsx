import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { LangLayoutClient, StructuredData, AnalyticsScripts, GtmNoscript } from '@/components/common';
import '../globals.css';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  preload: true,
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://uuid.stomx.net'),
  title: 'UUID Generator - Free Online UUID v1, v4, v7 Generator & Validator',
  description:
    'Free online UUID generator and validator. Generate UUID v1, v4, v7 with timestamp extraction. Parse, validate, and save UUID history. No registration required.',
  keywords: [
    'UUID generator',
    'UUID v4 generator',
    'UUID v7 generator',
    'UUID v1 generator',
    'GUID generator',
    'UUID validator',
    'UUID parser',
    'online UUID tool',
    'free UUID generator',
    'timestamp UUID',
    'RFC 9562',
    'UUID 생성기',
    '무료 UUID',
  ],
  authors: [{ name: 'UUID Generator' }],
  applicationName: 'UUID Generator',
  generator: 'Next.js',
  category: 'Developer Tools',
  openGraph: {
    title: 'UUID Generator - Free Online Tool',
    description:
      'Generate, validate, and parse UUID v1, v4, v7. Free online tool with timestamp extraction and history.',
    url: 'https://uuid.stomx.net',
    siteName: 'UUID Generator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://uuid.stomx.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UUID Generator - Free Online Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID Generator - Free Online Tool',
    description: 'Generate, validate, and parse UUID v1, v4, v7',
    images: ['https://uuid.stomx.net/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'EJZJslnlASZmjLWp3JfieXPgbM1zlKRsguaJGn4XHPM',
  },
  other: {
    'google-adsense-account': 'ca-pub-4723857054709306',
  },
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical Inline CSS for fastest render */}
        <style dangerouslySetInnerHTML={{__html: `body{background-color:#0a0a0b;color:#e8e8e8;margin:0;padding:0}*{box-sizing:border-box}@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fadeInUp .3s ease-out forwards}`}} />

        {/* Resource Hints for Performance */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        {/* Analytics Scripts (disabled on localhost, client-only) */}
        <AnalyticsScripts />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) - disabled on localhost */}
        <GtmNoscript />
        <StructuredData locale="en" />
        <LangLayoutClient lang="en">{children}</LangLayoutClient>
      </body>
    </html>
  );
}
