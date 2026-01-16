import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'UUID Generator - v1, v4, v7 생성기',
  description:
    'UUID v1, v4, v7을 생성하고 검증하는 웹 도구. 타임스탬프 추출, 히스토리 저장 지원.',
  keywords: ['UUID', 'generator', 'validator', 'parser', 'v1', 'v4', 'v7'],
  authors: [{ name: 'UUID Generator' }],
  openGraph: {
    title: 'UUID Generator',
    description: 'UUID v1, v4, v7 생성기 및 검증기',
    type: 'website',
  },
  other: {
    'google-adsense-account': 'ca-pub-4723857054709306',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
