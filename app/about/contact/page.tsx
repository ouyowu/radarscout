import { generateSEO } from '@/lib/seo/metadata';

export const metadata = generateSEO({
  title: 'Contact Us - RadarScout',
  description:
    'Get in touch with the RadarScout team. Reach us for general inquiries, product review requests, advertising opportunities, or editorial corrections.',
  path: '/about/contact',
});

function EmailCard() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-cyan-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">
          Email us at
        </p>
        <a
          href="mailto:hello@radarscout.io"
          className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          hello@radarscout.io
        </a>
        <p className="text-slate-400 text-sm mt-2">
          We typically respond within 2–3 business days.
        </p>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
        <p className="text-xl text-slate-300 leading-relaxed mb-10">
          Have a question, suggestion, or opportunity to discuss? We'd love to hear from you.
          Reach out at the address below and we'll get back to you promptly.
        </p>

        <EmailCard />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* General Inquiries */}
          <section className="bg-slate-900 border border-slate-700/60 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">General Inquiries</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Questions about our content, methodology, or the products we cover? We welcome
              reader feedback and strive to respond to every message we receive.
            </p>
          </section>

          {/* Product Review Requests */}
          <section className="bg-slate-900 border border-slate-700/60 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">Product Review Requests</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Are you a brand or PR representative looking to have a product reviewed on
              RadarScout? Email us with product details and we will evaluate fit with our
              editorial calendar. All editorial decisions remain ours alone.
            </p>
          </section>

          {/* Advertise With Us */}
          <section className="bg-slate-900 border border-slate-700/60 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">Advertise With Us</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Interested in reaching our audience of smart home and health tech enthusiasts?
              Get in touch to discuss display advertising and sponsorship opportunities.
              Please note: we do not accept sponsored posts that are not clearly disclosed
              as such.
            </p>
          </section>

          {/* Editorial & Corrections */}
          <section className="bg-slate-900 border border-slate-700/60 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-3">Editorial &amp; Corrections</h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Spotted an error in one of our articles or product pages? We take accuracy
              seriously and appreciate corrections from our readers. Please include the URL of
              the page and a brief description of the issue.
            </p>
          </section>
        </div>

        <p className="text-slate-500 text-sm mt-12">
          For all inquiries:{' '}
          <a href="mailto:hello@radarscout.io" className="text-cyan-400 hover:text-cyan-300">
            hello@radarscout.io
          </a>
        </p>
      </div>
    </div>
  );
}
