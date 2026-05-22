import { generateSEO } from '@/lib/seo/metadata';

export const metadata = generateSEO({
  title: 'Terms of Service - RadarScout',
  description:
    'Terms of Service for RadarScout. Read the terms governing your use of radarscout.io, including our policies on intellectual property, affiliate links, disclaimers, and more.',
  path: '/about/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-black text-white mb-4">Terms of Service</h1>
        <p className="text-slate-400 text-sm mb-12">Last updated: May 21, 2026</p>

        {/* Acceptance of Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Acceptance of Terms</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            By accessing or using radarscout.io (the "Site"), you agree to be bound by these
            Terms of Service ("Terms"). If you do not agree to all of these Terms, do not access
            or use the Site.
          </p>
          <p className="text-slate-300 leading-relaxed">
            These Terms apply to all visitors, users, and others who access or use the Site.
            RadarScout reserves the right to modify these Terms at any time, and your continued
            use of the Site constitutes acceptance of any such changes.
          </p>
        </section>

        {/* Use of Site */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Use of Site</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            You may use the Site for lawful, personal, non-commercial purposes only. You agree
            not to:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Use the Site in any way that violates applicable local, national, or international
                laws or regulations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Reproduce, duplicate, copy, or resell any part of our Site content without our
                express written permission
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Systematically extract data from the Site for use in competitive products or
                services
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Attempt to gain unauthorized access to any portion of the Site or its related
                systems
              </span>
            </li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Intellectual Property</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Site and its original content, features, and functionality are and will remain
            the exclusive property of RadarScout and its licensors. Our trademarks, trade dress,
            logos, and service marks may not be used in connection with any product or service
            without our prior written consent.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Product names, logos, brands, and other trademarks or trade dress mentioned or
            depicted on this Site are the property of their respective owners. References to
            third-party products and services are for informational purposes and do not constitute
            endorsement unless explicitly stated.
          </p>
        </section>

        {/* Affiliate Links & Compensation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Affiliate Links &amp; Compensation
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Some links on this Site are affiliate links. This means that if you click on a link
            and make a purchase, RadarScout may earn a commission at no additional cost to you.
            We participate in affiliate programs including, but not limited to, the Amazon
            Associates Program and other retailer affiliate programs.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            The receipt of affiliate compensation does not influence our editorial
            recommendations, rankings, or reviews. Our content reflects our genuine assessments
            of products and services based on research, available data, and stated
            specifications. We maintain editorial independence regardless of any commercial
            relationships.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Where affiliate relationships exist, we provide disclosure in accordance with the
            U.S. Federal Trade Commission (FTC) guidelines.
          </p>
        </section>

        {/* Disclaimer of Warranties */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Disclaimer of Warranties</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Site and all content, products, and services available through it are provided
            on an "as is" and "as available" basis, without warranty of any kind, express or
            implied. To the fullest extent permitted by applicable law, RadarScout expressly
            disclaims all warranties, including but not limited to:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Warranties of merchantability, fitness for a particular purpose, and
                non-infringement
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                That the Site will be uninterrupted, error-free, or secure
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                That product information, pricing, specifications, or availability displayed on
                the Site are accurate, complete, or current
              </span>
            </li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-4">
            Information on the Site is provided for general informational purposes only and is
            not a substitute for professional advice, including medical, legal, or financial
            advice.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Limitation of Liability</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            To the maximum extent permitted by law, RadarScout, its owners, employees,
            affiliates, agents, contractors, and licensors shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or related to
            your use of, or inability to use, the Site or its content.
          </p>
          <p className="text-slate-300 leading-relaxed">
            This includes, without limitation, damages for loss of profits, goodwill, data, or
            other intangible losses, even if RadarScout has been advised of the possibility of
            such damages. Some jurisdictions do not allow the exclusion or limitation of certain
            damages, so the above limitation may not apply to you.
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Third-Party Links</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            The Site may contain links to third-party websites or services that are not owned or
            controlled by RadarScout. We have no control over and assume no responsibility for
            the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p className="text-slate-300 leading-relaxed">
            We strongly advise you to read the privacy policy and terms of service of any
            third-party site you visit. The inclusion of any link does not imply our endorsement
            of the site.
          </p>
        </section>

        {/* User Conduct */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">User Conduct</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            When interacting with RadarScout (including via email), you agree not to:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Submit false, misleading, or defamatory content
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Harass, threaten, or intimidate RadarScout staff or other users
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Attempt to impersonate any person or entity or misrepresent your affiliation
                with any person or entity
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                Transmit unsolicited commercial communications (spam)
              </span>
            </li>
          </ul>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Changes to Terms</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We reserve the right to modify or replace these Terms at any time at our sole
            discretion. We will provide notice of significant changes by updating the "Last
            updated" date at the top of this page.
          </p>
          <p className="text-slate-300 leading-relaxed">
            It is your responsibility to review these Terms periodically for changes. Your
            continued use of the Site following the posting of any changes constitutes acceptance
            of those changes.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Governing Law</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            These Terms shall be governed and construed in accordance with the laws of the State
            of California, United States, without regard to its conflict of law provisions.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Any disputes arising under or in connection with these Terms shall be subject to the
            exclusive jurisdiction of the state and federal courts located in California. If any
            provision of these Terms is held to be invalid or unenforceable, the remaining
            provisions will continue in full force and effect.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Contact</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-300">
              <strong className="text-white">RadarScout</strong>
            </p>
            <p className="text-slate-300 mt-2">
              Email:{' '}
              <a
                href="mailto:hello@radarscout.io"
                className="text-cyan-400 hover:text-cyan-300"
              >
                hello@radarscout.io
              </a>
            </p>
            <p className="text-slate-300 mt-1">Website: radarscout.io</p>
          </div>
        </section>
      </div>
    </div>
  );
}
