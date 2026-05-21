import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";

const defaultAdsensePublisherId = 'ca-pub-5538837787017019';
const adsensePublisherId =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || defaultAdsensePublisherId;
const defaultGaMeasurementId = 'G-KXWJY9VRVC';
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || defaultGaMeasurementId;

export const metadata: Metadata = {
  title: "RadarScout - Your Radar for Smart Home & Health Tech",
  description: "Discover, compare, and track the best smart home devices, wearables, and health tech. Expert buying guides and in-depth product comparisons.",
  keywords: ["smart home", "wearables", "health tech", "smart rings", "fitness trackers", "product reviews"],
  metadataBase: new URL('https://www.radarscout.io'),
  alternates: {
    canonical: 'https://www.radarscout.io',
  },
  openGraph: {
    title: "RadarScout - Your Radar for Smart Home & Health Tech",
    description: "Discover, compare, and track the best smart home devices, wearables, and health tech. Expert buying guides and in-depth product comparisons.",
    url: 'https://www.radarscout.io',
    siteName: 'RadarScout',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "RadarScout - Your Radar for Smart Home & Health Tech",
    description: "Discover, compare, and track the best smart home devices, wearables, and health tech. Expert buying guides and in-depth product comparisons.",
    images: ['/opengraph-image'],
  },
  other: adsensePublisherId
    ? {
        'google-adsense-account': adsensePublisherId,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {gaMeasurementId ? (
          <>
            <Script
              id="ga4-script"
              async
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script id="ga4-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        {adsensePublisherId ? (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          />
        ) : null}
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
