import { NextResponse } from 'next/server';

function normalizePublisherForAdsTxt(value: string) {
  if (!value) return '';
  return value.replace(/^ca-/, '');
}

export function GET() {
  const rawPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '';
  const publisherId = normalizePublisherForAdsTxt(rawPublisherId);

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : '# Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID to publish your AdSense seller record.\n';

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
