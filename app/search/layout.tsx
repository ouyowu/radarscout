import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | RadarScout',
  description: 'Search RadarScout products, reviews, buying guides, and comparisons.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
