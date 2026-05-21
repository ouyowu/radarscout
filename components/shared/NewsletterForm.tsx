'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setEmail('');
        setMessage("You're in! Expect expert guides in your inbox soon.");
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-3">
      <div className="flex gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </div>

      {message && (
        <p className={`text-sm text-center ${status === 'success' ? 'text-cyan-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      {status !== 'success' && (
        <p className="text-xs text-slate-500 text-center">
          No spam. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
