import { generateSEO } from '@/lib/seo/metadata';

export const metadata = generateSEO({
  title: 'About RadarScout - Your Tech Intelligence Platform',
  description: 'Learn about RadarScout, our mission to help you make smarter tech decisions, and our approach to product reviews and recommendations.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-6">
          About RadarScout
        </h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            RadarScout is your intelligence platform for smart home devices, wearables, 
            and consumer health technology. We help you discover, compare, and make 
            informed decisions about the tech that matters to your life.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            The smart home and health tech landscape is overwhelming. New products launch 
            constantly, specifications are confusing, and marketing claims are hard to verify. 
            RadarScout cuts through the noise to deliver clear, evidence-based information.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">How We Work</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Our approach combines automated product tracking, comprehensive research, and 
            structured analysis:
          </p>

          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Product Discovery:</strong> We track new releases, 
                crowdfunding campaigns, and product updates across the smart home and health tech space.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Research-Based Reviews:</strong> When we haven't 
                tested a product ourselves, we clearly state that our analysis is based on official 
                specifications, public reviews, and available data.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Structured Comparisons:</strong> We organize 
                product information to help you compare features, ecosystems, and value.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-white">Continuous Updates:</strong> Product information 
                changes. We track updates and maintain current data on specifications, pricing, 
                and availability.
              </span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Editorial Independence</h2>
          <p className="text-slate-300 leading-relaxed">
            RadarScout may earn commissions from affiliate links, but this does not influence 
            our editorial recommendations. We maintain clear disclosure policies and never let 
            commercial relationships compromise our analysis.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Health Technology Disclaimer</h2>
          <p className="text-slate-300 leading-relaxed">
            RadarScout provides general information about consumer health technology. We are 
            not medical professionals, and our content is not medical advice. Always consult 
            qualified healthcare providers for medical decisions.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">Contact</h2>
          <p className="text-slate-300 leading-relaxed">
            Have questions, feedback, or product suggestions? We'd love to hear from you.
          </p>
          <p className="text-slate-300">
            Email: <a href="mailto:hello@radarscout.io" className="text-cyan-400 hover:text-cyan-300">hello@radarscout.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
