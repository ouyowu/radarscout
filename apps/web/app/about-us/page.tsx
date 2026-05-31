import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - RadarScout',
  description: 'Learn about RadarScout, our mission, and how we provide Thailand nightlife intelligence.',
};

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold text-center">About RadarScout</h1>
        <p className="mb-4 text-black/70 leading-relaxed">
          RadarScout monitors public travel communities, Reddit, RSS feeds, and forums to extract 
          useful nightlife intelligence for travelers in Thailand. We transform noisy online chatter 
          into actionable insights about venues, events, prices, and safety.
        </p>
        <p className="mb-4 text-black/70 leading-relaxed">
          Our intelligence feeds directly into ThaiNight, powering their guides, venue pages, 
          warnings, and traveler resources with fresh, verified information.
        </p>
        <div className="mt-8 pt-6 border-t border-black/10">
          <h2 className="mb-4 text-2xl font-bold text-center">Our Mission</h2>
          <p className="text-black/70 leading-relaxed">
            To be the intelligence layer that empowers travelers with timely, accurate nightlife 
            information across Thailand, enhancing safety and enjoyment through data-driven insights.
          </p>
        </div>
      </div>
    </main>
  );
}
