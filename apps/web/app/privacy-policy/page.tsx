import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - RadarScout',
  description: 'RadarScout Privacy Policy - how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold text-center">Privacy Policy</h1>
        <p className="mb-4 text-black/70 text-center">
          Last Updated: May 31, 2026
        </p>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
          <p className="text-black/70 leading-relaxed">
            RadarScout ("we", "our", "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you visit our website radarscout.io.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Information We Collect</h2>
          <p className="text-black/70 leading-relaxed">
            We process public Reddit content that matches customer-configured keywords. We also collect
            account information you provide directly, such as your email address, billing status, and
            saved monitoring settings.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">How We Use Your Information</h2>
          <p className="text-black/70 leading-relaxed">
            We use the information we collect to provide, maintain, and improve our
            Reddit monitoring service, send alerts, manage billing, improve keyword matching, and
            communicate about service updates.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
          <p className="text-black/70 leading-relaxed">
            We implement reasonable security measures to protect your information
            from unauthorized access, alteration, or destruction.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Changes to This Policy</h2>
          <p className="text-black/70 leading-relaxed">
            We may update this Privacy Policy from time to time. The updated version
            will be indicated by an updated "Last Updated" date.
          </p>
        </section>
        <p className="mt-8 text-black/50 text-center text-sm">
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </main>
  );
}
