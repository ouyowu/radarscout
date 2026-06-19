import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const fetchMock = vi.hoisted(() => vi.fn())
vi.stubGlobal('fetch', fetchMock)

import { callOpenWebuiChat, isLocalAiConfigured } from './openWebuiClient'

const BASE_ENV = {
  LOCAL_AI_PROVIDER: 'openwebui',
  OPENWEBUI_BASE_URL: 'https://openwebui.example.com',
  OPENWEBUI_MODEL: 'llama3',
  OPENWEBUI_API_KEY: 'test-api-key',
}

function makeSuccessResponse(content = 'hello') {
  return {
    ok: true,
    json: async () => ({
      choices: [{ message: { content } }],
    }),
  }
}

describe('callOpenWebuiChat — Cloudflare Access Service Token', () => {
  beforeEach(() => {
    vi.stubEnv('LOCAL_AI_PROVIDER', BASE_ENV.LOCAL_AI_PROVIDER)
    vi.stubEnv('OPENWEBUI_BASE_URL', BASE_ENV.OPENWEBUI_BASE_URL)
    vi.stubEnv('OPENWEBUI_MODEL', BASE_ENV.OPENWEBUI_MODEL)
    vi.stubEnv('OPENWEBUI_API_KEY', BASE_ENV.OPENWEBUI_API_KEY)
    fetchMock.mockResolvedValue(makeSuccessResponse())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  // ── Both CF vars present ──────────────────────────────────────────────────

  it('sends CF-Access-Client-Id and CF-Access-Client-Secret when both vars are set', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_SECRET', 'cf-client-secret-value')

    await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers['CF-Access-Client-Id']).toBe('cf-client-id.access')
    expect(options.headers['CF-Access-Client-Secret']).toBe('cf-client-secret-value')
  })

  it('preserves Authorization: Bearer header alongside CF headers', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_SECRET', 'cf-client-secret-value')

    await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer test-api-key')
    expect(options.headers['CF-Access-Client-Id']).toBe('cf-client-id.access')
    expect(options.headers['CF-Access-Client-Secret']).toBe('cf-client-secret-value')
  })

  it('returns ok:true with content when both CF vars are set and Open WebUI responds', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_SECRET', 'cf-client-secret-value')

    const result = await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    expect(result).toEqual({ ok: true, content: 'hello' })
  })

  // ── Both CF vars absent ───────────────────────────────────────────────────

  it('sends no CF headers when neither var is set (existing behaviour)', async () => {
    await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers).not.toHaveProperty('CF-Access-Client-Id')
    expect(options.headers).not.toHaveProperty('CF-Access-Client-Secret')
  })

  it('still sends Authorization: Bearer when neither CF var is set', async () => {
    await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer test-api-key')
  })

  it('returns ok:true when neither CF var is set', async () => {
    const result = await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    expect(result).toEqual({ ok: true, content: 'hello' })
  })

  // ── Only CLIENT_ID set ────────────────────────────────────────────────────

  it('returns cloudflare_access_not_configured when only CLOUDFLARE_ACCESS_CLIENT_ID is set', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')

    const result = await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    expect(result).toEqual({ ok: false, error: 'cloudflare_access_not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // ── Only CLIENT_SECRET set ────────────────────────────────────────────────

  it('returns cloudflare_access_not_configured when only CLOUDFLARE_ACCESS_CLIENT_SECRET is set', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_SECRET', 'cf-client-secret-value')

    const result = await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    expect(result).toEqual({ ok: false, error: 'cloudflare_access_not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // ── Secrets do not leak ───────────────────────────────────────────────────

  it('does not include CF secrets in the error response when partially configured', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')

    const result = await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })
    const serialized = JSON.stringify(result)

    expect(serialized).not.toContain('cf-client-id.access')
    expect(serialized).not.toContain('cf-client-secret-value')
  })

  it('does not include the API key in the response', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_SECRET', 'cf-client-secret-value')

    const result = await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })
    const serialized = JSON.stringify(result)

    expect(serialized).not.toContain('test-api-key')
    expect(serialized).not.toContain('cf-client-id.access')
    expect(serialized).not.toContain('cf-client-secret-value')
  })

  it('does not include CF secrets in the request body', async () => {
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_ID', 'cf-client-id.access')
    vi.stubEnv('CLOUDFLARE_ACCESS_CLIENT_SECRET', 'cf-client-secret-value')

    await callOpenWebuiChat({ systemPrompt: 'sys', userPrompt: 'user' })

    const [, options] = fetchMock.mock.calls[0]
    const body: string = options.body
    expect(body).not.toContain('cf-client-id.access')
    expect(body).not.toContain('cf-client-secret-value')
  })
})

describe('isLocalAiConfigured', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns false when Open WebUI vars are missing', () => {
    expect(isLocalAiConfigured()).toBe(false)
  })

  it('returns true when Open WebUI base vars are set (regardless of CF vars)', () => {
    vi.stubEnv('LOCAL_AI_PROVIDER', 'openwebui')
    vi.stubEnv('OPENWEBUI_BASE_URL', 'https://openwebui.example.com')
    vi.stubEnv('OPENWEBUI_MODEL', 'llama3')

    expect(isLocalAiConfigured()).toBe(true)
  })
})
