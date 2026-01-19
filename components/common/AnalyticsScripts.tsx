'use client';

import Script from 'next/script';
import { useSyncExternalStore } from 'react';

// 환경 체크 스토어
const envStore = (() => {
  let isLocalhost = false;
  let isInitialized = false;

  const initialize = () => {
    if (isInitialized || typeof window === 'undefined') return;
    isInitialized = true;
    const hostname = window.location.hostname;
    isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
  };

  return {
    subscribe: () => {
      initialize();
      return () => {};
    },
    getSnapshot: () => {
      initialize();
      return isLocalhost;
    },
    getServerSnapshot: () => true, // SSR에서는 항상 localhost로 취급 (스크립트 비활성화)
  };
})();

function AnalyticsScriptsInner() {
  const isLocalhost = useSyncExternalStore(
    envStore.subscribe,
    envStore.getSnapshot,
    envStore.getServerSnapshot
  );

  // localhost에서는 렌더링하지 않음
  if (isLocalhost) {
    return null;
  }

  const adsenseClientId = 'ca-pub-4723857054709306';

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WWD73RTG');`,
        }}
      />

      {/* Google Analytics 4 */}
      <Script
        id="ga-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-R1Y8SQSKY0"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-R1Y8SQSKY0');`,
        }}
      />

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
    </>
  );
}

function GtmNoscriptInner() {
  const isLocalhost = useSyncExternalStore(
    envStore.subscribe,
    envStore.getSnapshot,
    envStore.getServerSnapshot
  );

  // localhost에서는 렌더링하지 않음
  if (isLocalhost) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-WWD73RTG"
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}

// useSyncExternalStore로 SSR 안전하게 구현
// SSR 시 localhost로 취급하여 스크립트 비활성화, 클라이언트에서 실제 환경 체크
export { AnalyticsScriptsInner as AnalyticsScripts, GtmNoscriptInner as GtmNoscript };
