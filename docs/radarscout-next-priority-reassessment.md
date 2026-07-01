# RadarScout next-priority reassessment

## 1. Current verified state

Task:

```text
TD-RADARSCOUT-NEXT-PRIORITY-REASSESS-0
```

This is a docs-only reassessment after the RadarScout strategy documents were merged.

Verified on July 1, 2026:

| Check | Result |
| --- | --- |
| Open PRs against `codex/travel-mvp-launch` | None |
| Latest base checked | `origin/codex/travel-mvp-launch` |
| Homepage | `https://radarscout.io/` returns `200` |
| Homepage title | `RadarScout \| AI-guided Thailand Experience Planner` |
| Chiang Mai finder | `https://radarscout.io/chiang-mai/elephant-camp-finder` returns `200` |
| Chiang Mai finder title | `Find the right Chiang Mai experience \| RadarScout` |
| Chiang Mai finder robots | `noindex, nofollow` |
| Production sitemap `/tours/{id}` entries | `0` detected |

No code, deployment, database, schema, environment, Bókun, LLM, or ThaiEleHub action happened during this reassessment.

## 2. Current product interpretation

RadarScout is now best understood as:

```text
AI-guided Thailand experience discovery + deterministic itinerary planning + booking partner handoff
```

The live user-facing center of gravity is still:

```text
/chiang-mai/elephant-camp-finder
```

That page is materially stronger than the original finder:

- It has deterministic chat-style planning.
- It has planner picks.
- It has a suggested Chiang Mai day summary.
- It has recommendation cards.
- It uses `Check availability` for external booking partner handoff.
- It still avoids checkout, payment, booking submission, live availability, and inventory behavior.

The project has also added enough strategy docs to keep future agent work aligned:

- AI travel UX direction.
- Chat planner MVP direction.
- Executable roadmap.
- Partner model.
- Phase review.
- Project boundary lock.
- SEO readiness audit.

## 3. Active safety boundaries

These boundaries remain active and should be treated as hard gates:

- Do not open `index,follow` automatically.
- Do not re-add unsafe `/tours/{id}` pages to sitemap.
- Do not call Bókun API, edit Bókun products, or sync Bókun data without explicit approval.
- Do not add checkout, payment, cart, booking submission, live availability, or inventory behavior.
- Do not add LLM/OpenAI parsing to the public planner without a separate disabled-flag plan and explicit approval.
- Do not change DB, Prisma schema, or environment variables.
- Do not touch ThaiEleHub or Shopify from RadarScout tasks.

## 4. Candidate next tasks

### Option A: SEO controlled-opening precheck

Suggested task:

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PRECHECK-0
```

Value:

- Moves RadarScout toward public acquisition.
- Uses the now-mature Chiang Mai finder as the first candidate.
- Checks whether the page is ready for controlled `index,follow` later.
- Keeps the actual SEO opening behind a separate approval gate.

Risk:

- Medium. SEO exposure can surface unsafe copy or thin content if the page is opened too early.

Scope:

- Audit only first.
- Check title, meta, canonical, robots, sitemap exclusion/inclusion policy, internal links, forbidden copy, CTA handoff, and search-console readiness.
- Do not change robots in this task.

Safety gates:

- No `index,follow` change.
- No sitemap change unless separately scoped.
- No production deploy.
- No unsafe tourist-facing copy.

Assessment:

This is strategically important, but should remain an audit before any opening.

### Option B: Homepage AI planner concept

Suggested task:

```text
TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-CONCEPT-0
```

Value:

- Improves the first impression of RadarScout.
- Connects the homepage more directly to the AI-guided planner direction.
- Can make the site feel less like a generic DMC portal and more like a travel planning product.

Risk:

- Medium. Homepage copy can easily drift into unsafe claims such as “live availability,” “book now,” or “AI booked this.”

Scope:

- Docs or design-spec first.
- No homepage code change until the exact copy and CTA model are approved.

Safety gates:

- Keep CTA as planner/discovery, not checkout.
- No availability, instant confirmation, or payment claims.
- No SEO opening in the same task.

Assessment:

Useful, but less urgent than confirming whether the current acquisition path is safe.

### Option C: Analytics / conversion tracking plan

Suggested task:

```text
TD-RADARSCOUT-ANALYTICS-FUNNEL-0
```

Value:

- Gives the project evidence about planner engagement and `Check availability` clicks.
- Helps decide whether to optimize UX, SEO, or partner conversion next.

Risk:

- Medium. Analytics can create privacy, consent, vendor, or implementation drift if rushed.

Scope:

- Plan only.
- Define events and privacy guardrails.
- Do not add vendor scripts yet.

Safety gates:

- No third-party script or data collection without explicit implementation approval.
- No PII.
- No DB writes unless separately scoped and approved.

Assessment:

High leverage after SEO and homepage priorities are stabilized.

### Option D: Partner conversion flow

Suggested task:

```text
TD-RADARSCOUT-PARTNER-CONVERSION-REVIEW-0
```

Value:

- Aligns supplier and destination partner acquisition with the existing B2B pages.
- Can turn the static partner pages into a safer manual operating workflow.

Risk:

- Medium. Partner copy can drift into commission, rate, supplier backend, or Bókun database wording.

Scope:

- Docs/read-only first.
- Review `/partners`, `/suppliers`, and `/destination-partners`.
- Propose safe lead capture and manual triage workflow.

Safety gates:

- No login, portal, dashboard, supplier backend, commission automation, checkout, or API sync.
- Keep B2B pages `noindex,nofollow` unless explicitly reopened later.

Assessment:

Useful, but after the public traveler funnel has a clearer SEO/analytics path.

### Option E: Optional LLM parser docs

Suggested task:

```text
TD-RADARSCOUT-CHAT-PLANNER-3-LLM-PARSER-DOCS
```

Value:

- Defines how a future LLM parser could extract structured intent from natural language.
- Keeps product matching deterministic and prevents invented products.

Risk:

- High. LLM integration can introduce hallucinated products, booking claims, availability claims, or external API complexity.

Scope:

- Docs only.
- No implementation.
- No OpenAI/LLM calls.

Safety gates:

- LLM output is structured intent only.
- No product invention.
- No booking copy generation.
- Disabled flag required for any future implementation.

Assessment:

Do not implement yet. Keep as future documentation after SEO and funnel priorities.

## 5. Recommendation

Recommended next task:

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PRECHECK-0
```

Reason:

RadarScout’s current strongest public asset is the Chiang Mai finder. The page is functional and product-shaped, but it still intentionally returns:

```text
noindex, nofollow
```

Before opening SEO, the project needs one final controlled precheck that proves the page is safe, useful, and supported by a clean sitemap and internal-link posture.

Important boundary:

```text
TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PRECHECK-0 must not open index/follow.
```

It should only produce a readiness report and, if needed, a small follow-up task list.

## 6. Suggested task queue

Recommended near-term queue:

1. `TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PRECHECK-0`
   - Audit only.
   - No robots change.
   - No deploy.

2. `TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PREP-1`
   - Only if the precheck finds small safe fixes.
   - Code PR allowed only for scoped copy/meta/internal-link corrections.
   - Still no `index,follow`.

3. `TD-RADARSCOUT-SEO-CONTROLLED-OPENING-APPROVAL-GATE`
   - Human decision point.
   - Explicit approval required before any robots opening.

4. `TD-RADARSCOUT-ANALYTICS-FUNNEL-0`
   - Plan event tracking and privacy boundaries.
   - No vendor implementation yet.

5. `TD-RADARSCOUT-HOMEPAGE-AI-PLANNER-CONCEPT-0`
   - Design/copy concept for homepage planner entry.
   - No production UI change until approved.

## 7. Acceptance criteria for the next task

`TD-RADARSCOUT-SEO-CONTROLLED-OPENING-PRECHECK-0` should verify:

- Homepage and Chiang Mai finder return `200`.
- Chiang Mai finder still has `noindex,nofollow`.
- B2B pages still have `noindex,nofollow`.
- `/tours/{id}` pages remain excluded from sitemap.
- Finder copy has no forbidden claims.
- CTA remains `Check availability`.
- CTA handoff remains external booking partner handoff.
- CTA rel remains `nofollow sponsored noopener noreferrer`.
- No `/api/bokun`, OpenAI/LLM, checkout/payment, booking submission, DB write, schema, or env behavior is introduced.
- A clear go / no-go recommendation is documented.

## 8. Stop conditions

Stop and report if any future precheck finds:

- SEO already opened unexpectedly.
- `/tours/{id}` URLs returned to sitemap.
- Tourist-facing copy includes forbidden booking, payment, live availability, Bókun backend, partner rate, supplier net rate, commission, fake review, or fake rating wording.
- Bókun API, OpenAI/LLM, checkout, payment, or booking submission network calls appear.
- ThaiEleHub or Shopify files are touched.
