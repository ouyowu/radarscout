const assert = require("node:assert/strict")
const test = require("node:test")

const {
  parseLocalUrl,
} = require("../radarscout-ai-trip-local-smoke")

test("parseLocalUrl accepts localhost AI Trip Planner URLs", () => {
  assert.equal(
    parseLocalUrl("http://localhost:3456/ai-trip-planner"),
    "http://localhost:3456/ai-trip-planner",
  )
})

test("parseLocalUrl accepts 127.0.0.1 and normalizes the path", () => {
  assert.equal(
    parseLocalUrl("http://127.0.0.1:3456/"),
    "http://127.0.0.1:3456/ai-trip-planner",
  )
})

test("parseLocalUrl refuses RadarScout production domains", () => {
  assert.throws(
    () => parseLocalUrl("https://radarscout.io/ai-trip-planner"),
    /Refusing to run against RadarScout production domains/,
  )
})

test("parseLocalUrl refuses non-local hosts", () => {
  assert.throws(
    () => parseLocalUrl("http://example.com/ai-trip-planner"),
    /Expected localhost or 127\.0\.0\.1/,
  )
})

test("parseLocalUrl refuses https URLs", () => {
  assert.throws(
    () => parseLocalUrl("https://localhost:3456/ai-trip-planner"),
    /Expected an http:\/\/ local URL/,
  )
})
