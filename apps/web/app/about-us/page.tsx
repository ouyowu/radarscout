import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - RadarScout',
  description: 'Learn about RadarScout and our mission to help teams find high-intent Reddit conversations before competitors do.',
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold text-center">About RadarScout</h1>
        <p className="mb-4 text-black/70 leading-relaxed">
          RadarScout monitors public Reddit conversations for brand mentions, competitor complaints,
          product alternatives, and high-intent buying questions. We help teams find the threads worth
          reading before they disappear into Reddit's feed.
        </p>
        <p className="mb-4 text-black/70 leading-relaxed">
          Our goal is simple: reduce noisy alerts and surface the conversations where a thoughtful,
          helpful reply can become a customer conversation.
        </p>
        <div className="mt-8 pt-6 border-t border-black/10">
          <h2 className="mb-4 text-2xl font-bold text-center">Our Mission</h2>
          <p className="text-black/70 leading-relaxed">
            To make Reddit monitoring practical for founders, marketers, and sales teams by combining
            fast alerts, useful context, and workflows that encourage genuine replies instead of spam.
          </p>
        </div>
      </div>
    </main>
  );
}
