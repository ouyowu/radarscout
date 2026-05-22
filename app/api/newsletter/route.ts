import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email ?? '').trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      // Silently succeed in dev/preview when env vars aren't set yet
      return Response.json({ success: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    return Response.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong.';
    // Duplicate contact returns a 422 — treat as success so users don't see an error
    if (message.toLowerCase().includes('already exists') || message.includes('422')) {
      return Response.json({ success: true });
    }
    console.error('[newsletter]', message);
    return Response.json({ error: 'Could not subscribe. Please try again later.' }, { status: 500 });
  }
}
