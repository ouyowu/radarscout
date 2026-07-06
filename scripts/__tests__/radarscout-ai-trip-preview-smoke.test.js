const assert = require("node:assert/strict")
const test = require("node:test")

const {
  detectPreviewProtection,
  parseUrl,
} = require("../radarscout-ai-trip-preview-smoke")

test("detects Vercel authentication protection pages before waiting for planner UI", () => {
  const result = detectPreviewProtection({
    url: "https://vercel.com/login?next=%2Fsso-api%3Furl%3Dhttps%253A%252F%252Freddit-monitor-example.vercel.app%252Fai-trip-planner",
    title: "Login – Vercel",
    bodyText: "Log in to Vercel Continue with Email Continue with GitHub",
    tripIdeaCount: 0,
  })

  assert.equal(result.protected, true)
  assert.equal(result.reason, "vercel_authentication_required")
})

test("does not flag a normal AI Trip Planner page as protected", () => {
  const result = detectPreviewProtection({
    url: "https://reddit-monitor-example.vercel.app/ai-trip-planner",
    title: "Thailand AI Trip Planner | RadarScout",
    bodyText: "Thailand AI Trip Planner Try the AI Trip Planner",
    tripIdeaCount: 1,
  })

  assert.equal(result.protected, false)
  assert.equal(result.reason, null)
})

test("parseUrl still refuses RadarScout production domains", () => {
  assert.throws(
    () => parseUrl("https://radarscout.io/ai-trip-planner"),
    /Refusing to run against RadarScout production domains/,
  )
})
