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
  title: 'UUID 생성기 - 무료 온라인 UUID v1, v4, v7 생성 및 검증 도구',
  description:
    '무료 온라인 UUID 생성 및 검증 도구. UUID v1, v4, v7 생성과 타임스탬프 추출 지원. UUID 파싱, 검증, 히스토리 저장 기능. 회원가입 불필요.',
  keywords: [
    'UUID 생성기',
    'UUID v4 생성기',
    'UUID v7 생성기',
    'UUID v1 생성기',
    'GUID 생성기',
    'UUID 검증기',
    'UUID 파서',
    '온라인 UUID 도구',
    '무료 UUID 생성',
    '타임스탬프 UUID',
    'RFC 9562',
    'UUID generator',
  ],
  authors: [{ name: 'UUID Generator' }],
  applicationName: 'UUID Generator',
  generator: 'Next.js',
  category: 'Developer Tools',
  openGraph: {
    title: 'UUID 생성기 - 무료 온라인 도구',
    description:
      'UUID v1, v4, v7 생성, 검증, 파싱. 타임스탬프 추출 및 히스토리 관리 기능을 제공하는 무료 온라인 도구.',
    url: 'https://uuid.stomx.net/ko',
    siteName: 'UUID Generator',
    locale: 'ko_KR',
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
    title: 'UUID 생성기 - 무료 온라인 도구',
    description: 'UUID v1, v4, v7 생성, 검증, 파싱',
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

export default function KoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
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
        <StructuredData locale="ko" />
        <LangLayoutClient lang="ko">{children}</LangLayoutClient>
      </body>
    </html>
  );
}
