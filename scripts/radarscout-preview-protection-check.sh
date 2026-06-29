#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/radarscout-preview-protection-check.sh <vercel-preview-url>

Purpose:
  Run a read-only check against a RadarScout Vercel preview URL and report
  whether normal fetch access is blocked by Vercel Authentication.

Notes:
  - This script does not deploy.
  - This script does not generate or store Vercel share URLs.
  - This script does not call the Vercel API.
  - This script should not be used against production domains.
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

preview_url="${1:-}"

if [[ -z "$preview_url" ]]; then
  usage >&2
  exit 2
fi

if [[ "$preview_url" != https://*.vercel.app* ]]; then
  echo "ERROR: expected a Vercel preview URL ending in .vercel.app." >&2
  echo "Refusing to run against non-preview or production-looking URL: $preview_url" >&2
  exit 2
fi

if [[ "$preview_url" == *"radarscout.io"* ]]; then
  echo "ERROR: refusing to run against RadarScout production domains." >&2
  exit 2
fi

trimmed_url="${preview_url%/}"
paths=("/" "/sitemap.xml" "/robots.txt")

echo "RadarScout preview protection check"
echo "Preview: $trimmed_url"
echo "Mode: read-only curl checks"
echo

for path in "${paths[@]}"; do
  target="$trimmed_url$path"
  response="$(
    curl \
      --silent \
      --show-error \
      --output /dev/null \
      --write-out '%{http_code}\t%{redirect_url}\t%{content_type}' \
      "$target"
  )"

  status="${response%%$'\t'*}"
  rest="${response#*$'\t'}"
  redirect="${rest%%$'\t'*}"
  content_type="${rest#*$'\t'}"

  echo "Path: $path"
  echo "  status: $status"
  echo "  content_type: ${content_type:-unknown}"

  if [[ -n "$redirect" ]]; then
    echo "  redirect: $redirect"
  else
    echo "  redirect: none"
  fi

  if [[ "$redirect" == https://vercel.com/sso-api* ]]; then
    echo "  result: protected_by_vercel_authentication"
  elif [[ "$status" == "200" ]]; then
    echo "  result: accessible_without_preview_bypass"
  elif [[ "$status" == "401" || "$status" == "403" ]]; then
    echo "  result: protected_or_forbidden"
  else
    echo "  result: check_manually"
  fi

  echo
done

echo "If protected_by_vercel_authentication appears, use the documented"
echo "temporary Vercel share URL or authenticated browser-session workflow."
