import 'server-only'

import { callOpenWebuiChat } from './openWebuiClient'
import {
  CleanProductTextResult,
  DraftCodexTaskResult,
  DraftProductEnrichmentResult,
  DraftSeoSnippetResult,
  LocalAiError,
  LocalAiTaskBaseResult,
  LocalAiTaskErrorResult,
  LocalAiTaskName,
  SuggestProductTagsResult,
  SummarizeProductDescriptionResult,
  SummarizeProjectDocumentResult,
} from './types'

const SHARED_SAFETY_RULES = [
  'Only use user-provided input.',
  'Do not invent prices.',
  'Do not invent availability.',
  'Do not invent booking links.',
  'Do not invent suppliers.',
  'Do not invent ratings.',
  'Do not invent opening hours.',
  'If information is missing, return null or "unknown".',
  'Never claim something is bookable unless explicitly provided by real stored data.',
  'Never output secrets.',
  'Never output raw Bókun payloads.',
]

function errorResult(error: LocalAiError): LocalAiTaskErrorResult {
  return {
    ok: false,
    error,
    warnings: [],
  }
}

function jsonPrompt(task: LocalAiTaskName, input: Record<string, unknown>, outputShape: string): string {
  return [
    `Task: ${task}`,
    '',
    'Safety rules:',
    ...SHARED_SAFETY_RULES.map(rule => `- ${rule}`),
    '',
    'Return strict JSON only.',
    `Output shape: ${outputShape}`,
    '',
    'Input:',
    JSON.stringify(input, null, 2),
  ].join('\n')
}

async function runJsonTask<T extends LocalAiTaskBaseResult>(
  task: LocalAiTaskName,
  input: Record<string, unknown>,
  outputShape: string,
): Promise<T | LocalAiTaskErrorResult> {
  const result = await callOpenWebuiChat({
    systemPrompt: [
      'You are a low-risk local writing assistant.',
      'You help with text cleaning, summarization, SEO drafting, and tag suggestion.',
      'Follow the safety rules exactly and return strict JSON only.',
    ].join(' '),
    userPrompt: jsonPrompt(task, input, outputShape),
    temperature: 0.2,
    responseFormat: 'json_object',
  })

  if (!result.ok) {
    return errorResult(result.error)
  }

  try {
    return JSON.parse(result.content) as T
  } catch {
    return errorResult('local_ai_invalid_response')
  }
}

export function buildLocalAiTaskPrompt(
  task: LocalAiTaskName,
  input: Record<string, unknown>,
  outputShape: string,
): string {
  return jsonPrompt(task, input, outputShape)
}

export async function cleanProductText(input: {
  title: string | null
  description: string | null
  excerpt?: string | null
}): Promise<CleanProductTextResult> {
  return runJsonTask<Extract<CleanProductTextResult, { ok: true }>>(
    'cleanProductText',
    input,
    '{"ok":true,"title":string|null,"summary":string|null,"tags":string[],"missingFacts":string[],"warnings":string[]}',
  )
}

export async function summarizeProductDescription(input: {
  title?: string | null
  description: string | null
}): Promise<SummarizeProductDescriptionResult> {
  return runJsonTask<Extract<SummarizeProductDescriptionResult, { ok: true }>>(
    'summarizeProductDescription',
    input,
    '{"ok":true,"summary":string|null,"missingFacts":string[],"warnings":string[]}',
  )
}

export async function suggestProductTags(input: {
  title?: string | null
  description: string | null
  existingTags?: string[]
}): Promise<SuggestProductTagsResult> {
  return runJsonTask<Extract<SuggestProductTagsResult, { ok: true }>>(
    'suggestProductTags',
    input,
    '{"ok":true,"tags":string[],"missingFacts":string[],"warnings":string[]}',
  )
}

export async function draftSeoSnippet(input: {
  title: string | null
  description: string | null
  destination?: string | null
}): Promise<DraftSeoSnippetResult> {
  return runJsonTask<Extract<DraftSeoSnippetResult, { ok: true }>>(
    'draftSeoSnippet',
    input,
    '{"ok":true,"title":string|null,"metaDescription":string|null,"missingFacts":string[],"warnings":string[]}',
  )
}

export async function summarizeProjectDocument(input: {
  title?: string | null
  content: string | null
}): Promise<SummarizeProjectDocumentResult> {
  return runJsonTask<Extract<SummarizeProjectDocumentResult, { ok: true }>>(
    'summarizeProjectDocument',
    input,
    '{"ok":true,"summary":string|null,"keyPoints":string[],"missingFacts":string[],"warnings":string[]}',
  )
}

export async function draftProductEnrichment(input: {
  title: string | null
  description: string | null
  excerpt: string | null
  destination: string | null
  location: string | null
}): Promise<DraftProductEnrichmentResult> {
  const outputShape = `{
  "ok": true,
  "cleanedTitle": "human-readable title — string or null, max 120 chars",
  "shortSummary": "1-sentence experience description — string or null, max 280 chars",
  "suggestedTags": ["3 to 8 short topic tags — never empty if any input is usable"],
  "seoTitle": "search-optimised page title — string or null, max 70 chars",
  "seoDescription": "meta description — string or null, max 180 chars",
  "missingFacts": ["facts that would improve the content"],
  "warnings": ["concerns about input quality or gaps"]
}

Field rules:
- cleanedTitle: max 120 chars. Only null if title field is completely absent.
- shortSummary: max 280 chars, exactly 1 sentence. Only null if no usable input exists at all.
- suggestedTags: return 3-8 tags as a JSON array. Never return an empty array if any title or description is present.
- seoTitle: max 70 chars. Only null if title field is completely absent.
- seoDescription: max 180 chars. Only null if no usable input exists at all.
- Prefer concise factual wording over null. Use null only when genuinely impossible.
- When using null, add a warning entry explaining which field is missing and why.`

  return runJsonTask<Extract<DraftProductEnrichmentResult, { ok: true }>>(
    'draftProductEnrichment',
    input,
    outputShape,
  )
}

export async function draftCodexTask(input: {
  goal: string | null
  constraints?: string[] | null
  context?: string | null
}): Promise<DraftCodexTaskResult> {
  return runJsonTask<Extract<DraftCodexTaskResult, { ok: true }>>(
    'draftCodexTask',
    input,
    '{"ok":true,"taskDraft":string|null,"missingFacts":string[],"warnings":string[]}',
  )
}
