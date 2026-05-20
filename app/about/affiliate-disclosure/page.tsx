import { generateSEO } from '@/lib/seo/metadata';
import { monetizationConfig } from '@/lib/monetization';

export const metadata = generateSEO({
  title: 'Affiliate Disclosure - RadarScout',
  description: 'Learn about how RadarScout uses affiliate links and maintains editorial independence.',
  path: '/about/affiliate-disclosure',
  noIndex: true,
});

export default function AffiliateDisclosurePage() {
  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-black text-white mb-6">
          Affiliate Disclosure
        </h1>

        <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-6 mb-8">
          <p className="text-amber-200 leading-relaxed">
            {monetizationConfig.defaultAffiliateDisclosure}
          </p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-white mt-8 mb-4">What Are Affiliate Links?</h2>
          <p className="text-slate-300 leading-relaxed">
            RadarScout participates in affiliate programs including Amazon Associates and other 
            retailer partnerships. When you click on certain links on our site and make a purchase, 
            we may earn a commission at no additional cost to you.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">How We Use Affiliate Links</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            You'll find affiliate links in several places on RadarScout:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Product pages with "Check price on Amazon" or similar buttons</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Buying guides with product recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Comparison articles where products are recommended</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>"Where to Buy" sections listing retail options</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Our Commitment to You</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Here's what you need to know about how we maintain editorial integrity:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Independence:</strong> Affiliate relationships 
                do not influence our product recommendations, reviews, or editorial content.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Transparency:</strong> We clearly mark affiliate 
                links and disclose when content includes affiliate opportunities.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Research-Based:</strong> Our recommendations are 
                based on product specifications, features, value, and suitability for different users.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">No Pay-to-Play:</strong> Companies cannot pay 
                for positive reviews or guaranteed recommendations.
              </span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Technical Implementation</h2>
          <p className="text-slate-300 leading-relaxed">
            All affiliate links on RadarScout include proper rel="sponsored nofollow" attributes 
            as recommended by search engines. This ensures transparency with both users and 
            search engines about the commercial nature of these links.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Questions</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have questions about our affiliate partnerships or editorial policies, 
            please contact us at{' '}
            <a href="mailto:hello@radarscout.io" className="text-cyan-400 hover:text-cyan-300">
              hello@radarscout.io
            </a>
          </p>

          <p className="text-sm text-slate-500 mt-12">
            Last updated: May 19, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
