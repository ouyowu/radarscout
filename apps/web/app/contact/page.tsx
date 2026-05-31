import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - RadarScout',
  description: 'Get in touch with the RadarScout team for partnerships, feedback, or support.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="mb-6 text-3xl font-bold text-center">Contact Us</h1>
        <p className="mb-4 text-black/70 text-center">
          Have questions, feedback, or interested in collaborating? Reach out to us below.
        </p>
        <form className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black/60 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full rounded-md border border-black/20 px-3 py-1.5 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black/60 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full rounded-md border border-black/20 px-3 py-1.5 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-black/60 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              required
              className="w-full rounded-md border border-black/20 px-3 py-1.5 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
