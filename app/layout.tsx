import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { generateWebSiteSchema, generateOrganizationSchema } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: {
    default: "RadarScout - Your Radar for Smart Home & Health Tech",
    template: "%s | RadarScout",
  },
  description: "Discover, compare, and track the best smart home devices, wearables, and health tech. Expert buying guides and in-depth product comparisons.",
  keywords: ["smart home", "wearables", "health tech", "smart rings", "fitness trackers", "product reviews", "buying guides", "product comparisons"],
  metadataBase: new URL("https://radarscout.io"),
  openGraph: {
    siteName: "RadarScout",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@radarscout",
  },
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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
