export function isIssueFlagsEnabled(): boolean {
  return process.env.PRODUCT_ISSUE_FLAGS_ENABLED === 'true'
}
