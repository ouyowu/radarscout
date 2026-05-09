export interface MatchPayload {
  keywordId: string
  platform: 'REDDIT'
  postId: string
  title: string
  url: string
  snippet: string
}

export async function submitMatch(payload: MatchPayload): Promise<void> {
  const apiUrl = process.env.INTERNAL_API_URL
  const secret = process.env.INTERNAL_API_SECRET

  if (!apiUrl || !secret) {
    // Dev fallback: log instead of HTTP post
    console.log('[match]', payload.postId, payload.keywordId, payload.title.slice(0, 60))
    return
  }

  const res = await fetch(`${apiUrl}/api/internal/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': secret,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.error(`[submitter] failed ${payload.postId}: HTTP ${res.status}`)
  }
}
