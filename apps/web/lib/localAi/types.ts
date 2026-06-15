import 'server-only'

export type LocalAiProvider = 'openwebui'

export type LocalAiError =
  | 'local_ai_not_configured'
  | 'local_ai_request_failed'
  | 'local_ai_invalid_response'

export type LocalAiTaskName =
  | 'cleanProductText'
  | 'summarizeProductDescription'
  | 'suggestProductTags'
  | 'draftSeoSnippet'
  | 'summarizeProjectDocument'
  | 'draftCodexTask'

export type LocalAiTaskBaseResult = {
  ok: boolean
  warnings: string[]
}

export type LocalAiTaskErrorResult = {
  ok: false
  error: LocalAiError
  warnings: string[]
}

export type CleanProductTextResult =
  | ({
      ok: true
      title: string | null
      summary: string | null
      tags: string[]
      missingFacts: string[]
      warnings: string[]
    })
  | LocalAiTaskErrorResult

export type SummarizeProductDescriptionResult =
  | ({
      ok: true
      summary: string | null
      missingFacts: string[]
      warnings: string[]
    })
  | LocalAiTaskErrorResult

export type SuggestProductTagsResult =
  | ({
      ok: true
      tags: string[]
      missingFacts: string[]
      warnings: string[]
    })
  | LocalAiTaskErrorResult

export type DraftSeoSnippetResult =
  | ({
      ok: true
      title: string | null
      metaDescription: string | null
      missingFacts: string[]
      warnings: string[]
    })
  | LocalAiTaskErrorResult

export type SummarizeProjectDocumentResult =
  | ({
      ok: true
      summary: string | null
      keyPoints: string[]
      missingFacts: string[]
      warnings: string[]
    })
  | LocalAiTaskErrorResult

export type DraftCodexTaskResult =
  | ({
      ok: true
      taskDraft: string | null
      missingFacts: string[]
      warnings: string[]
    })
  | LocalAiTaskErrorResult

export type OpenWebuiResponseFormat = 'json_object' | 'text'

export type OpenWebuiChatParams = {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  responseFormat?: OpenWebuiResponseFormat
}

export type OpenWebuiChatResult =
  | {
      ok: true
      content: string
    }
  | {
      ok: false
      error: LocalAiError
    }
