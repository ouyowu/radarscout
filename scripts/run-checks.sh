#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AI_DIR="$ROOT_DIR/.ai"
LOG_FILE="$AI_DIR/checks.log"
RUN_TESTS="${RUN_TESTS:-0}"

if [[ "${1:-}" == "--tests" ]]; then
  RUN_TESTS=1
fi

mkdir -p "$AI_DIR"

{
  echo "# RadarScout Local Checks"
  echo "Started: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "Working directory: $ROOT_DIR"
  echo
} > "$LOG_FILE"

run_step() {
  local name="$1"
  shift

  {
    echo "## $name"
    echo "\$ $*"
  } >> "$LOG_FILE"

  if "$@" >> "$LOG_FILE" 2>&1; then
    echo "PASS: $name" | tee -a "$LOG_FILE"
    echo >> "$LOG_FILE"
    return 0
  fi

  echo "FAIL: $name" | tee -a "$LOG_FILE"
  echo >> "$LOG_FILE"
  return 1
}

status=0

cd "$ROOT_DIR" || exit 1

run_step "Prisma generate" pnpm --filter @reddit-monitor/db generate || status=1
run_step "Prisma schema validate" pnpm --filter @reddit-monitor/db exec prisma validate || status=1
run_step "Web TypeScript check" pnpm --filter @reddit-monitor/web exec tsc --noEmit || status=1

if [[ "$RUN_TESTS" == "1" ]]; then
  run_step "Workspace tests" pnpm -r --if-present test || status=1
else
  {
    echo "## Workspace tests"
    echo "SKIP: tests are optional. Run with RUN_TESTS=1 pnpm ai:checks or pnpm ai:checks -- --tests."
    echo
  } >> "$LOG_FILE"
fi

{
  echo "Finished: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  if [[ "$status" == "0" ]]; then
    echo "Overall: PASS"
  else
    echo "Overall: FAIL"
  fi
} >> "$LOG_FILE"

echo "Wrote $LOG_FILE"
exit "$status"
