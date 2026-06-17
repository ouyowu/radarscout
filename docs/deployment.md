# Deployment Guide

## Production Site

- URL: https://www.radarscout.io
- Vercel project: `reddit-monitor`

## Branch Strategy

| Branch | Role |
|--------|------|
| `main` | Vercel automatic production trigger (GitHub default branch) |
| `codex/travel-mvp-launch` | Active product branch — all RadarScout travel work happens here |

**These branches are divergent and must not be merged casually.**

- `main` contains SEO/AdSense commits that are not on `codex/travel-mvp-launch`.
- `codex/travel-mvp-launch` contains travel MVP work that is not on `main`.
- Do not use `--allow-unrelated-histories` without explicit user approval.

## How Vercel Deploys Today

Vercel's Git integration auto-deploys the GitHub **default branch** (`main`) to production on every push.

**Pushing to `codex/travel-mvp-launch` does NOT automatically deploy to production.** Vercel creates a preview deployment only.

PR merges to `codex/travel-mvp-launch` also do not auto-deploy to production.

## How to Deploy `codex/travel-mvp-launch` to Production

Use one of the two methods below. Choose the one that suits your setup.

### Option A — Promote via Vercel Dashboard (no CLI needed)

1. Go to the Vercel dashboard → project `reddit-monitor` → **Deployments** tab.
2. Find a deployment triggered from `codex/travel-mvp-launch` (it will be marked as a Preview deployment).
3. Click `...` → **Promote to Production**.

### Option B — Deploy via Vercel CLI

```bash
git checkout codex/travel-mvp-launch
# Confirm you are on the correct branch and commit:
git branch --show-current
git rev-parse HEAD
# Then deploy:
vercel --prod
```

## Pre-deploy Checklist

Before promoting or running `vercel --prod`, confirm:

- [ ] You are on branch `codex/travel-mvp-launch`
- [ ] Commit SHA matches the intended state
- [ ] If any DB schema changed: migration has been applied and verified for the target environment
- [ ] Required Vercel env vars are present (check Vercel dashboard → Settings → Environment Variables)
- [ ] No secrets are printed or exposed in build output

## Long-term TODO

The following must be done in a separate, reviewed PR before the two branches can be reconciled:

- Carefully cherry-pick or merge the `main` SEO/AdSense commits into `codex/travel-mvp-launch`.
- Get ChatGPT/user review of the reconciliation PR before merge.
- Do not use `--allow-unrelated-histories` without explicit user approval.
- After reconciliation, evaluate whether to make `codex/travel-mvp-launch` the GitHub default branch or merge it into `main`.
