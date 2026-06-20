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

type CloudflareAccessConfig = {
  clientId: string
  clientSecret: string
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

function readCloudflareAccessConfig(): CloudflareAccessConfig | null | 'partial' {
  const clientId = process.env.CLOUDFLARE_ACCESS_CLIENT_ID?.trim() || null
  const clientSecret = process.env.CLOUDFLARE_ACCESS_CLIENT_SECRET?.trim() || null

  if (clientId && clientSecret) return { clientId, clientSecret }
  if (!clientId && !clientSecret) return null
  return 'partial'
}

function buildHeaders(apiKey: string | null, cfAccess: CloudflareAccessConfig | null): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    ...(cfAccess
      ? {
          'CF-Access-Client-Id': cfAccess.clientId,
          'CF-Access-Client-Secret': cfAccess.clientSecret,
        }
      : {}),
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

  const cfAccess = readCloudflareAccessConfig()

  if (cfAccess === 'partial') {
    return { ok: false, error: 'cloudflare_access_not_configured' }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${config.baseUrl}/api/chat/completions`, {
      method: 'POST',
      headers: buildHeaders(config.apiKey, cfAccess),
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
      const status = response.status
      if (status === 403) return { ok: false, error: 'cloudflare_access_forbidden' }
      if (status === 401) return { ok: false, error: 'openwebui_unauthorized' }
      if (status === 404) return { ok: false, error: 'openwebui_not_found' }
      if (status === 422) return { ok: false, error: 'openwebui_model_not_found' }
      return { ok: false, error: 'local_ai_request_failed' }
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      return { ok: false, error: 'openwebui_bad_response' }
    }

    const content = extractContent(payload)

    if (!content) {
      return { ok: false, error: 'local_ai_invalid_response' }
    }

    return { ok: true, content }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { ok: false, error: 'openwebui_timeout' }
    }
    return { ok: false, error: 'local_ai_request_failed' }
  } finally {
    clearTimeout(timeout)
  }
}
