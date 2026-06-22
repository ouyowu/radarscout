export function isIssueFlagsEnabled(): boolean {
  return process.env.PRODUCT_ISSUE_FLAGS_ENABLED === 'true'
}

export function isAiItineraryDraftEnabled(): boolean {
  return process.env.AI_ITINERARY_DRAFT_ENABLED === 'true'
}
