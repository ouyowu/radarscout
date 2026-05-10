import { Resend } from 'resend'

export interface MatchAlertParams {
  to: string
  keyword: string
  subreddit: string
  postTitle: string
  postUrl: string
  snippet: string
  unsubscribeUrl: string
}

export async function sendMatchAlert(params: MatchAlertParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[mailer] RESEND_API_KEY not set — skipping email to', params.to)
    return
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL ?? 'alerts@radarscout.io'

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `[RadarScout] "${params.keyword}" mentioned in r/${params.subreddit}`,
    html: buildHtml(params),
    headers: {
      'List-Unsubscribe': `<${params.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })

  if (error) {
    console.error('[mailer] send failed:', error)
  }
}

export interface MatchDigestParams {
  to: string
  unsubscribeUrl: string
  matches: Array<{
    keyword: string
    subreddit: string
    postTitle: string
    postUrl: string
    snippet: string
  }>
}

export async function sendMatchDigest(params: MatchDigestParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[mailer] RESEND_API_KEY not set — skipping digest to', params.to)
    return
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL ?? 'alerts@radarscout.io'
  const count = params.matches.length
  const subject =
    count === 1
      ? `[RadarScout] "${params.matches[0].keyword}" mentioned`
      : `[RadarScout] ${count} new keyword matches`

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject,
    html: buildDigestHtml(params),
    headers: {
      'List-Unsubscribe': `<${params.unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })

  if (error) {
    console.error('[mailer] digest send failed:', error)
  }
}

function buildDigestHtml({ matches, unsubscribeUrl }: MatchDigestParams): string {
  const rows = matches
    .map(
      m => `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">
        ${esc(m.keyword)}${m.subreddit ? ` &middot; r/${esc(m.subreddit)}` : ''}
      </p>
      <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#111827;line-height:1.4;">
        ${esc(m.postTitle)}
      </p>
      ${m.snippet ? `<p style="margin:0 0 12px;font-size:13px;color:#6b7280;font-style:italic;line-height:1.6;">&ldquo;&hellip;${esc(m.snippet)}&hellip;&rdquo;</p>` : ''}
      <a href="${esc(m.postUrl)}"
         style="display:inline-block;background:#ea580c;color:#fff;font-size:13px;font-weight:600;padding:8px 16px;border-radius:6px;text-decoration:none;">
        View on Reddit &rarr;
      </a>
    </div>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#ea580c;padding:20px 32px;">
            <span style="color:#fff;font-size:18px;font-weight:600;">RadarScout</span>
            <span style="color:#fed7aa;font-size:13px;margin-left:8px;">
              ${matches.length} new match${matches.length !== 1 ? 'es' : ''}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            ${rows}
            <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
              You&rsquo;re receiving this because you have active keyword monitors.
              <a href="${esc(unsubscribeUrl)}" style="color:#9ca3af;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildHtml({ keyword, subreddit, postTitle, postUrl, snippet, unsubscribeUrl }: MatchAlertParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:#ea580c;padding:20px 32px;">
            <span style="color:#fff;font-size:18px;font-weight:600;">RadarScout</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;">
              Keyword match
            </p>
            <h1 style="margin:0 0 4px;font-size:22px;color:#111827;">${esc(keyword)}</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">in <strong>r/${esc(subreddit)}</strong></p>

            <!-- Post card -->
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:#111827;line-height:1.4;">
                ${esc(postTitle)}
              </p>
              <p style="margin:0 0 16px;font-size:13px;color:#6b7280;font-style:italic;line-height:1.6;">
                &ldquo;…${esc(snippet)}…&rdquo;
              </p>
              <a href="${esc(postUrl)}"
                 style="display:inline-block;background:#ea580c;color:#fff;font-size:13px;font-weight:600;padding:8px 16px;border-radius:6px;text-decoration:none;">
                View on Reddit →
              </a>
            </div>

            <p style="margin:0;font-size:12px;color:#9ca3af;">
              You're receiving this because you monitor <em>r/${esc(subreddit)}</em> for
              &ldquo;${esc(keyword)}&rdquo;.
              <a href="${esc(unsubscribeUrl)}" style="color:#9ca3af;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
