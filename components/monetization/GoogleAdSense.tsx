import Script from 'next/script';

interface GoogleAdSenseProps {
  publisherId: string;
}

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps) {
  if (!publisherId) return null;

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
