import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { buildLocalAiTaskPrompt, cleanProductText } from './tasks'

describe('local AI task helpers', () => {
  afterEach(() => {
    delete process.env.LOCAL_AI_PROVIDER
    delete process.env.OPENWEBUI_BASE_URL
    delete process.env.OPENWEBUI_MODEL
    delete process.env.OPENWEBUI_API_KEY
    vi.restoreAllMocks()
  })

  it('fails safely when Open WebUI config is missing', async () => {
    const result = await cleanProductText({
      title: 'Bangkok evening cruise',
      description: 'Sunset cruise with buffet dinner.',
    })

    expect(result).toEqual({
      ok: false,
      error: 'local_ai_not_configured',
      warnings: [],
    })
  })

  it('includes the hard safety rules in task prompts', () => {
    const prompt = buildLocalAiTaskPrompt(
      'cleanProductText',
      { title: 'Bangkok evening cruise', description: 'Sunset cruise with buffet dinner.' },
      '{"ok":true}',
    )

    expect(prompt).toContain('Only use user-provided input.')
    expect(prompt).toContain('Do not invent prices.')
    expect(prompt).toContain('Do not invent availability.')
    expect(prompt).toContain('Do not invent booking links.')
    expect(prompt).toContain('Do not invent suppliers.')
    expect(prompt).toContain('Do not invent ratings.')
    expect(prompt).toContain('Never output secrets.')
    expect(prompt).toContain('Never output raw Bókun payloads unless explicitly requested for server-side debugging.')
  })

  it('parses strict JSON output from the local model', async () => {
    process.env.LOCAL_AI_PROVIDER = 'openwebui'
    process.env.OPENWEBUI_BASE_URL = 'http://localhost:3000'
    process.env.OPENWEBUI_MODEL = 'gemma4'

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  ok: true,
                  title: 'Bangkok evening cruise',
                  summary: 'Sunset dinner cruise on the river.',
                  tags: ['cruise', 'dinner'],
                  missingFacts: ['price', 'availability'],
                  warnings: [],
                }),
              },
            },
          ],
        }),
      }),
    )

    const result = await cleanProductText({
      title: 'Bangkok evening cruise',
      description: 'Sunset cruise with buffet dinner.',
    })

    expect(result).toEqual({
      ok: true,
      title: 'Bangkok evening cruise',
      summary: 'Sunset dinner cruise on the river.',
      tags: ['cruise', 'dinner'],
      missingFacts: ['price', 'availability'],
      warnings: [],
    })
  })
})
