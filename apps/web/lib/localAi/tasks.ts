import 'server-only'

import { callOpenWebuiChat } from './openWebuiClient'
import {
  CleanProductTextResult,
  DraftCodexTaskResult,
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
  'Never output raw Bókun payloads unless explicitly requested for server-side debugging.',
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
