import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { StructuredData } from './structured-data';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  preload: true,
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical Inline CSS for fastest render */}
        <style dangerouslySetInnerHTML={{__html: `body{background-color:#0a0a0b;color:#e8e8e8;margin:0;padding:0}*{box-sizing:border-box}@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fadeInUp .3s ease-out forwards}`}} />

        {/* Resource Hints for Performance */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        {/* Structured Data for SEO */}
        <StructuredData />

        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WWD73RTG');`}} />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R1Y8SQSKY0" />
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-R1Y8SQSKY0');`}} />

        {/* Microsoft Clarity - 지연 로딩 */}
        <Script
          id="clarity-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var loaded = false;
                function loadClarity() {
                  if (loaded) return;
                  loaded = true;
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "v27j4cca2q");
                }
                setTimeout(loadClarity, 2000);
                ['scroll', 'click', 'touchstart'].forEach(function(e) {
                  window.addEventListener(e, loadClarity, {once: true, passive: true});
                });
              })();
            `,
          }}
        />

        {/* Google AdSense - 지연 로딩 */}
        {adsenseClientId && (
          <Script
            id="adsense-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var loaded = false;
                  function loadAdsense() {
                    if (loaded) return;
                    loaded = true;
                    var s = document.createElement('script');
                    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}';
                    s.crossOrigin = 'anonymous';
                    s.async = true;
                    document.head.appendChild(s);
                  }
                  setTimeout(loadAdsense, 3000);
                  ['scroll', 'click', 'touchstart', 'mousemove'].forEach(function(e) {
                    window.addEventListener(e, loadAdsense, {once: true, passive: true});
                  });
                })();
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WWD73RTG"
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
