import Link from 'next/link';
import { ShieldCheck, BadgeCheck, FilePenLine, RefreshCcw } from 'lucide-react';
import { generateSEO } from '@/lib/seo/metadata';

export const metadata = generateSEO({
  title: 'Editorial Policy - RadarScout',
  description:
    'Learn how RadarScout researches, reviews, updates, and discloses product coverage across smart home, wearable, and health tech topics.',
  path: '/about/editorial-policy',
});

const principles = [
  {
    title: 'Research first, claims second',
    icon: BadgeCheck,
    body:
      'We prioritize manufacturer documentation, official specifications, release materials, credible third-party reporting, and hands-on signals when available. If a product has not been personally tested, we say so clearly.',
  },
  {
    title: 'Recommendation logic must be visible',
    icon: FilePenLine,
    body:
      'Our reviews and guides are built around category fit, practical tradeoffs, ecosystem compatibility, price context, and who a product is best for or not best for. We aim to explain the reasoning, not just give a verdict.',
  },
  {
    title: 'Commercial relationships do not buy placement',
    icon: ShieldCheck,
    body:
      'RadarScout may earn affiliate commissions from certain links, but affiliate availability does not determine which products are covered or how they are ranked. Sponsored placement is not used to shape editorial conclusions.',
  },
  {
    title: 'Updates and corrections are part of the job',
    icon: RefreshCcw,
    body:
      'Smart devices change quickly. We update pages when pricing, availability, subscription requirements, or key specifications shift. If we make a factual mistake, we correct it and refresh the page as quickly as possible.',
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">Editorial Policy</h1>
        <p className="text-lg text-slate-300 leading-relaxed mb-12">
          RadarScout exists to help readers make clearer, calmer decisions about smart home devices,
          wearables, and consumer health tech. This page explains how we research products, how we
          handle affiliate relationships, and what readers can expect from our coverage.
        </p>

        <div className="space-y-6 mb-14">
          {principles.map(({ title, body, icon: Icon }) => (
            <section key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                  <p className="text-slate-300 leading-relaxed">{body}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="space-y-5 text-slate-300 leading-relaxed">
          <h2 className="text-3xl font-bold text-white">What our coverage includes</h2>
          <p>
            We publish buying guides, product reviews, comparisons, and explanatory guides. Some pages are based
            on hands-on experience, while others are based on specification analysis, update tracking, and public
            source review. When hands-on testing has not happened, we aim to be explicit rather than implying otherwise.
          </p>
          <p>
            We also cover consumer health technology. That content is for informational purposes only and is not medical advice.
            Readers should use qualified healthcare professionals for diagnosis or treatment decisions.
          </p>
        </section>

        <section className="mt-12 space-y-5 text-slate-300 leading-relaxed">
          <h2 className="text-3xl font-bold text-white">Questions, corrections, or feedback</h2>
          <p>
            If you spot outdated pricing, missing context, or a factual mistake, we want to know. The fastest route is our
            contact page or email.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/about/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
            >
              Contact RadarScout
            </Link>
            <Link
              href="/about/affiliate-disclosure"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-700 text-white font-semibold hover:border-slate-500 transition-colors"
            >
              Read affiliate disclosure
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
