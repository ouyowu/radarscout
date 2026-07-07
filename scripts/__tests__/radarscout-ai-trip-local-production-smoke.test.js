const assert = require("node:assert/strict")
const test = require("node:test")

const {
  getLocalPlannerUrl,
  getPort,
} = require("../radarscout-ai-trip-local-production-smoke")

test("getLocalPlannerUrl returns the localhost AI Trip Planner URL", () => {
  assert.equal(
    getLocalPlannerUrl(3456),
    "http://localhost:3456/ai-trip-planner",
  )
})

test("getPort defaults to the local smoke port", () => {
  assert.equal(getPort({}), 3456)
})

test("getPort accepts a valid environment port", () => {
  assert.equal(getPort({ RADARSCOUT_LOCAL_SMOKE_PORT: "4567" }), 4567)
})

test("getPort rejects invalid environment ports", () => {
  assert.throws(
    () => getPort({ RADARSCOUT_LOCAL_SMOKE_PORT: "0" }),
    /Invalid RADARSCOUT_LOCAL_SMOKE_PORT/,
  )
  assert.throws(
    () => getPort({ RADARSCOUT_LOCAL_SMOKE_PORT: "not-a-port" }),
    /Invalid RADARSCOUT_LOCAL_SMOKE_PORT/,
  )
})
