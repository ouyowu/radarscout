import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { GoogleAdSense } from "@/components/monetization/GoogleAdSense";
import { generateWebSiteSchema, generateOrganizationSchema } from "@/lib/seo/metadata";
import { monetizationConfig } from "@/lib/monetization";

const defaultAdsensePublisherId = 'ca-pub-5538837787017019';
const adsensePublisherId =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || defaultAdsensePublisherId;
const defaultGaMeasurementId = 'G-KXWJY9VRVC';
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || defaultGaMeasurementId;

export const metadata: Metadata = {
  title: {
    default: "RadarScout - Your Radar for Smart Home & Health Tech",
    template: "%s | RadarScout",
  },
  description: "Discover, compare, and track the best smart home devices, wearables, and health tech. Expert buying guides and in-depth product comparisons.",
  keywords: ["smart home", "wearables", "health tech", "smart rings", "fitness trackers", "product reviews", "buying guides", "product comparisons"],
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
    site: '@radarscout',
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
        />
      </head>
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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <GoogleAdSense publisherId={monetizationConfig.adsensePublisherId} />
      </body>
    </html>
  );
}
