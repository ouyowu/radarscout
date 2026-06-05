import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - RadarScout',
  description: 'RadarScout Terms of Service - governing your use of our website.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white text-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold text-center">Terms of Service</h1>
        <p className="mb-4 text-black/70 text-center">
          Last Updated: May 31, 2026
        </p>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Acceptance of Terms</h2>
          <p className="text-black/70 leading-relaxed">
            By accessing or using radarscout.io, you agree to be bound by these
            Terms of Service and all applicable laws and regulations.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Use of Service</h2>
          <p className="text-black/70 leading-relaxed">
            The RadarScout service is provided for informational purposes only. 
            While we strive for accuracy, we make no guarantees about the 
            completeness or reliability of the intelligence provided.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Disclaimer</h2>
          <p className="text-black/70 leading-relaxed">
            The materials on RadarScout's website are provided on an 'as is' basis.
            RadarScout makes no warranties, expressed or implied, and hereby disclaims
            and negates all other warranties including, without limitation, implied
            warranties or conditions of merchantability, fitness for a particular
            purpose, or non-infringement of intellectual property or other violation
            of rights.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Limitation of Liability</h2>
          <p className="text-black/70 leading-relaxed">
            In no event shall RadarScout or its suppliers be liable for any damages
            (including, without limitation, direct, indirect, incidental, punitive, 
            and consequential damages) arising out of the use or inability to use
            the RadarScout service.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Governing Law</h2>
          <p className="text-black/70 leading-relaxed">
            These Terms of Service shall be governed by and construed in accordance
            with the laws applicable to RadarScout, without regard to conflict of law
            provisions.
          </p>
        </section>
        <p className="mt-8 text-black/50 text-center text-sm">
          For any inquiries regarding our Terms of Service, please contact us.
        </p>
      </div>
    </main>
  );
}
