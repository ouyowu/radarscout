export interface MatchPayload {
  keywordId: string
  platform: 'REDDIT'
  postId: string
  title: string
  url: string
  snippet: string
}

export async function submitMatch(payload: MatchPayload): Promise<string | null> {
  const apiUrl = process.env.INTERNAL_API_URL
  const secret = process.env.INTERNAL_API_SECRET

  if (!apiUrl || !secret) {
    console.log('[match]', payload.postId, payload.keywordId, payload.title.slice(0, 60))
    return null
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
    return null
  }

  const data = (await res.json()) as { id?: string }
  return data.id ?? null
}

export async function patchMatchScore(
  matchId: string,
  intentScore: number,
  aiSummary: string | null,
): Promise<void> {
  const apiUrl = process.env.INTERNAL_API_URL
  const secret = process.env.INTERNAL_API_SECRET
  if (!apiUrl || !secret) return

  try {
    await fetch(`${apiUrl}/api/internal/matches/${matchId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify({ intentScore, aiSummary }),
    })
  } catch (err) {
    console.error('[submitter] patch score failed:', err)
  }
}
