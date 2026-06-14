import 'server-only'

import {
  OpenWebuiChatParams,
  OpenWebuiChatResult,
} from './types'

const DEFAULT_TIMEOUT_MS = 20_000

type OpenWebuiConfig = {
  baseUrl: string
  apiKey: string | null
  model: string
  provider: 'openwebui'
}

type OpenWebuiSuccessResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string }>
    }
  }>
}

function readConfig(): OpenWebuiConfig | null {
  const provider = process.env.LOCAL_AI_PROVIDER?.trim().toLowerCase()
  const baseUrl = process.env.OPENWEBUI_BASE_URL?.trim()
  const model = process.env.OPENWEBUI_MODEL?.trim()

  if (provider && provider !== 'openwebui') {
    return null
  }

  if (!baseUrl || !model) {
    return null
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    apiKey: process.env.OPENWEBUI_API_KEY?.trim() || null,
    model,
    provider: 'openwebui',
  }
}

function buildHeaders(apiKey: string | null): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  }
}

function extractContent(payload: unknown): string | null {
  const response = payload as OpenWebuiSuccessResponse
  const content = response.choices?.[0]?.message?.content

  if (typeof content === 'string' && content.trim()) {
    return content.trim()
  }

  if (Array.isArray(content)) {
    const text = content
      .map(item => (item && typeof item === 'object' && typeof item.text === 'string' ? item.text : ''))
      .join('')
      .trim()

    return text || null
  }

  return null
}

export function isLocalAiConfigured(): boolean {
  return readConfig() !== null
}

export async function callOpenWebuiChat(
  params: OpenWebuiChatParams,
): Promise<OpenWebuiChatResult> {
  const config = readConfig()

  if (!config) {
    return { ok: false, error: 'local_ai_not_configured' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${config.baseUrl}/api/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(config.apiKey),
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        temperature: params.temperature ?? 0.2,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        ...(params.responseFormat === 'json_object'
          ? { response_format: { type: 'json_object' } }
          : {}),
      }),
    })

    if (!response.ok) {
      return { ok: false, error: 'local_ai_request_failed' }
    }

    const payload = await response.json()
    const content = extractContent(payload)

    if (!content) {
      return { ok: false, error: 'local_ai_invalid_response' }
    }

    return { ok: true, content }
  } catch {
    return { ok: false, error: 'local_ai_request_failed' }
  } finally {
    clearTimeout(timeout)
  }
}
