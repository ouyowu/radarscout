import { generateSEO } from '@/lib/seo/metadata';

export const metadata = generateSEO({
  title: 'Privacy Policy - RadarScout',
  description:
    'Privacy Policy for RadarScout. Learn how we collect, use, and protect your information, including our use of Google AdSense and third-party advertising.',
  path: '/about/privacy-policy',
  noIndex: false,
});

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-950 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-12">Last updated: May 21, 2026</p>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            RadarScout ("we," "our," or "us") operates the website radarscout.io (the "Site").
            This Privacy Policy explains how we collect, use, disclose, and protect information
            about you when you visit our Site.
          </p>
          <p className="text-slate-300 leading-relaxed">
            By using the Site, you agree to the collection and use of information in accordance
            with this policy. If you do not agree, please discontinue use of the Site.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Information We Collect</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We collect information in two ways:
          </p>

          <h3 className="text-xl font-semibold text-cyan-400 mb-3">Information You Provide</h3>
          <p className="text-slate-300 leading-relaxed mb-6">
            We do not currently require account creation. If you contact us via email, we
            receive your email address and any information you include in your message.
          </p>

          <h3 className="text-xl font-semibold text-cyan-400 mb-3">
            Information Collected Automatically
          </h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            When you visit the Site, certain information is collected automatically, including:
          </p>
          <ul className="space-y-3 text-slate-300 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Log data:</strong> IP address, browser type,
                referring/exit pages, operating system, and date/time of your visit.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Usage data:</strong> Pages viewed, time spent on
                pages, links clicked, and other interaction data.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Device data:</strong> Device type, screen
                resolution, and browser version.
              </span>
            </li>
          </ul>
          <p className="text-slate-300 leading-relaxed">
            This data is collected through analytics services and advertising cookies, as
            described below.
          </p>
        </section>

        {/* Cookies & Tracking */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Cookies &amp; Tracking Technologies</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We use cookies and similar tracking technologies to track activity on our Site and
            hold certain information. Cookies are files with a small amount of data that are
            stored on your device.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            Types of cookies we use:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Essential cookies:</strong> Required for the Site
                to function properly.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Analytics cookies:</strong> Help us understand
                how visitors interact with the Site (e.g., page views, session duration).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Advertising cookies:</strong> Used by third-party
                advertisers (including Google) to serve relevant ads based on your interests.
              </span>
            </li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-4">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is
            being sent. However, if you do not accept cookies, some portions of the Site may
            not function properly.
          </p>
        </section>

        {/* Google AdSense */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Google AdSense &amp; Third-Party Advertising
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We use Google AdSense to display advertisements on this Site. Google AdSense is an
            advertising service provided by Google LLC. Google uses cookies to serve ads based
            on your prior visits to this website and other sites on the internet.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            Google's use of advertising cookies enables it and its partners to serve ads to you
            based on your visit to our Site and/or other sites on the internet. You may opt out
            of personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Ads Settings
            </a>
            .
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            For more information on how Google collects and uses data when you use our Site,
            please review the{' '}
            <a
              href="https://policies.google.com/privacy"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
            .
          </p>
          <p className="text-slate-300 leading-relaxed">
            Third-party ad vendors other than Google may also use cookies to serve ads on our
            Site. These vendors' use of cookies is subject to their own privacy policies, not
            this one.
          </p>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How We Use Your Information</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Operate, maintain, and improve the Site</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Understand and analyze how you use the Site</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Display personalized advertisements via Google AdSense</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Respond to your comments, questions, and requests</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Monitor and analyze trends, usage, and activities on the Site</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Detect and prevent fraudulent activity and other illegal activities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>Comply with legal obligations</span>
            </li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Data Sharing</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We do not sell your personal information. We may share your information in the
            following limited circumstances:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Service providers:</strong> Third-party vendors
                who assist us in operating our Site (analytics, hosting, advertising), subject
                to confidentiality agreements.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Legal requirements:</strong> When required by
                law, subpoena, or similar legal process.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Business transfers:</strong> In connection with a
                merger, acquisition, or sale of all or a portion of our assets.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Protection of rights:</strong> When we believe
                disclosure is necessary to protect the rights, property, or safety of RadarScout,
                our users, or the public.
              </span>
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Your Rights</h2>

          <h3 className="text-xl font-semibold text-cyan-400 mb-3">GDPR Rights (EEA Residents)</h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you are a resident of the European Economic Area, you have the following rights
            under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="space-y-3 text-slate-300 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right of access:</strong> Request a copy of the
                personal data we hold about you.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to rectification:</strong> Request
                correction of inaccurate or incomplete personal data.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to erasure:</strong> Request deletion of
                your personal data under certain conditions ("right to be forgotten").
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to restriction of processing:</strong>{' '}
                Request that we restrict the processing of your personal data in certain
                circumstances.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to data portability:</strong> Receive your
                personal data in a structured, commonly used format.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to object:</strong> Object to our
                processing of your personal data based on legitimate interests or for direct
                marketing purposes.
              </span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-cyan-400 mb-3">
            CCPA Rights (California Residents)
          </h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you are a California resident, the California Consumer Privacy Act (CCPA)
            provides you with the following rights:
          </p>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to know:</strong> Request disclosure of
                the categories and specific pieces of personal information we have collected
                about you, the sources of collection, our business purpose for collecting it,
                and the categories of third parties with whom we share it.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to delete:</strong> Request deletion of
                personal information we have collected from you, subject to certain exceptions.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 font-bold mt-1">•</span>
              <span>
                <strong className="text-white">Right to opt out of sale:</strong> We do not
                sell personal information. However, you have the right to direct us not to sell
                your personal information at any time.
              </span>
            </li>
          </ul>
          <p className="text-slate-300 leading-relaxed mt-4">
            To exercise any of these rights, please contact us at{' '}
            <a
              href="mailto:hello@radarscout.io"
              className="text-cyan-400 hover:text-cyan-300"
            >
              hello@radarscout.io
            </a>
            . We will respond to your request within 30 days.
          </p>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Data Retention</h2>
          <p className="text-slate-300 leading-relaxed">
            We retain personal information only for as long as necessary to fulfill the purposes
            described in this Privacy Policy, unless a longer retention period is required or
            permitted by law. Analytics data is typically retained for up to 26 months.
            Email correspondence is retained for as long as it remains relevant to our
            operations.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Children's Privacy</h2>
          <p className="text-slate-300 leading-relaxed">
            The Site is not directed to children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you are a parent or
            guardian and believe your child has provided us with personal information, please
            contact us immediately and we will take steps to delete such information.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Changes to This Policy</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the "Last
            updated" date at the top. You are advised to review this Privacy Policy periodically
            for any changes. Changes are effective when they are posted on this page.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our privacy practices,
            please contact us:
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
