# RadarScout homepage SEO controlled opening audit

Task: `TD-RADARSCOUT-SEO-CONTROLLED-OPENING-2-HOMEPAGE-INDEX-AUDIT`

## 1. Executive summary

RadarScout's homepage metadata is now aligned with the AI-guided Thailand experience planner direction, but the homepage visible body copy is not yet fully aligned with the tourist-facing safety rules.

Decision:

```text
Do not treat the homepage as fully SEO-safe yet.
Do not broaden SEO indexing.
Do not open /chiang-mai/elephant-camp-finder yet.
Run a narrow homepage visible-copy safety patch first.
```

This audit does not change code, robots metadata, sitemap output, production state, Bókun behavior, database state, environment variables, or ThaiEleHub files.

## 2. Current production baseline

Latest observed production state after the homepage metadata deploy:

| URL | Status | Finding |
| --- | --- | --- |
| `https://radarscout.io/` | 200 | Homepage title and meta description are updated. |
| `https://www.radarscout.io/` | 200 | Same homepage content. |
| `https://radarscout.io/sitemap.xml` | 200 | 4 URLs only. |
| `https://radarscout.io/robots.txt` | 200 | Robots file is live. |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | Still `noindex,nofollow`. |
| `https://radarscout.io/partners` | 200 | Still `noindex,nofollow`. |
| `https://radarscout.io/suppliers` | 200 | Still `noindex,nofollow`. |
| `https://radarscout.io/destination-partners` | 200 | Still `noindex,nofollow`. |

Current sitemap entries:

```text
https://www.radarscout.io
https://www.radarscout.io/contact
https://www.radarscout.io/privacy-policy
https://www.radarscout.io/terms-of-service
```

The sitemap correctly excludes:

```text
/tours/{id}
/chiang-mai/elephant-camp-finder
/partners
/suppliers
/destination-partners
```

## 3. Homepage metadata status

Homepage metadata is aligned with the safe traveler-facing direction.

Current title:

```text
RadarScout | AI-guided Thailand Experience Planner
```

Current meta description:

```text
Plan Thailand experiences with guided discovery for elephant care, cooking, nature, family-friendly days, and trusted booking partner handoff.
```

Current OpenGraph title:

```text
RadarScout | AI-guided Thailand Experience Planner
```

Current OpenGraph description:

```text
Compare Thailand experiences, draft a day plan, and continue with a trusted booking partner when you are ready.
```

Metadata audit result:

```text
Homepage metadata: pass
Forbidden metadata terms: 0
```

## 4. Homepage visible-copy blocker

The homepage body still contains older DMC / Bókun / live-inventory framing in `apps/web/app/page.tsx`.

Examples found in current source:

```text
AI-powered Destination DMC Portal for Curated Day Tours
signed Bókun supplier partners
Live inventory
Thailand partner tours
Supplier boundary
Book only trusted partner inventory
Bookable products come from signed Bókun supplier partners
Explore live tours
Thailand live inventory
Explore current Bókun partner inventory
```

Risk:

- Search snippets can draw from visible body copy, not only `<meta name="description">`.
- `live inventory` can imply live availability or inventory behavior, which RadarScout does not own.
- `Bókun supplier partners` is too backend/vendor-visible for tourist-facing pages.
- `DMC Portal` does not match the current AI-guided traveler discovery positioning.
- `Bookable products` and `Book only...` can imply a booking engine if seen out of context.

Classification:

```text
Homepage visible copy: fix recommended before any deliberate homepage SEO campaign or broader controlled opening.
```

This is not a production outage because the current homepage is already live and the transactional boundaries still hold. It is an SEO/snippet safety issue.

## 5. Finder and B2B SEO state

The Chiang Mai finder remains closed:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
```

The B2B pages remain closed:

```text
/partners: noindex,nofollow
/suppliers: noindex,nofollow
/destination-partners: noindex,nofollow
```

Do not use this homepage audit to open those pages.

## 6. Sitemap status

Sitemap state remains safe and should not be changed by the homepage copy cleanup.

Keep excluded:

```text
/tours/{id}
/chiang-mai/elephant-camp-finder
/partners
/suppliers
/destination-partners
```

The homepage is currently in the sitemap. That is acceptable only if the visible homepage copy is made safer before intentional SEO expansion.

## 7. Required copy direction for homepage safety patch

Recommended follow-up task:

```text
TD-RADARSCOUT-HOMEPAGE-VISIBLE-COPY-SAFETY-1
```

Goal:

```text
Replace older DMC / live inventory / Bókun-visible homepage body copy with traveler-facing AI-guided Thailand experience planner copy.
```

Safe positioning:

```text
RadarScout helps travelers plan Thailand experiences, compare real local options, draft a day plan, and continue with a booking partner when ready.
```

Allowed copy:

- AI-guided Thailand experience planner
- guided planner
- compare experiences
- trusted local experiences
- booking partner
- continue with a booking partner
- Check availability
- Plan with RadarScout

Avoid on tourist-facing homepage:

- live availability
- available now
- live inventory
- inventory
- instant confirmation
- checkout
- payment
- booking complete
- DMC Portal
- Bókun backend
- Bókun database
- Bókun-powered
- Bókun supplier partners
- partner rate
- supplier net rate
- commission

Use caution with:

- `book`
- `bookable`
- `live tours`

Safer replacements:

| Current direction | Safer direction |
| --- | --- |
| `Explore live tours` | `Compare Thailand experiences` |
| `Live inventory` | `Thailand experiences` |
| `Signed Bókun supplier partners` | `trusted local partners` or `booking partners` |
| `DMC Portal` | `AI-guided Thailand experience planner` |
| `Book only trusted partner inventory` | `Continue with a trusted booking partner` |

## 8. Guardrails for the follow-up implementation

The follow-up implementation should be narrow.

Allowed files:

```text
apps/web/app/page.tsx
apps/web/app/__tests__/homepageCopy.test.ts
```

Allowed changes:

- Update homepage visible copy only.
- Update homepage copy tests.
- Keep the Chiang Mai finder homepage CTA and link.
- Keep existing metadata.

Forbidden:

- robots metadata changes;
- sitemap changes;
- SEO `index,follow` changes;
- B2B page indexing;
- `/tours/{id}` sitemap re-entry;
- Bókun API calls, sync, edits, backend wording, or database wording;
- checkout, payment, cart, booking submission, confirmation, live availability, or inventory behavior;
- DB writes, schema changes, or environment changes;
- LLM/OpenAI integration;
- ThaiEleHub files or Shopify commands.

## 9. Validation for the follow-up implementation

Recommended validation:

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- homepageCopy
pnpm --filter @reddit-monitor/web test -- sitemap
pnpm --filter @reddit-monitor/web test -- seo
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
pnpm --filter @reddit-monitor/web build
git diff --check
```

Preview smoke should confirm:

- homepage returns 200;
- homepage visible copy avoids forbidden wording;
- homepage title and description remain safe;
- homepage still links to `/chiang-mai/elephant-camp-finder`;
- sitemap still has 4 URLs;
- `/tours/{id}` remains excluded from sitemap;
- `/chiang-mai/elephant-camp-finder` remains out of sitemap;
- finder remains `noindex,nofollow`;
- B2B pages remain `noindex,nofollow`;
- no unsafe network behavior appears.

## 10. Recommended next tasks

Recommended sequence:

```text
TD-RADARSCOUT-HOMEPAGE-VISIBLE-COPY-SAFETY-1
TD-RADARSCOUT-HOMEPAGE-VISIBLE-COPY-SAFETY-1-PREVIEW-SMOKE
TD-RADARSCOUT-HOMEPAGE-VISIBLE-COPY-SAFETY-1-MERGE-POSTMERGE-PREVIEW
TD-DEPLOY-HOMEPAGE-VISIBLE-COPY-SAFETY-1-PRODUCTION only after explicit approval
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING only after explicit approval
```

Do not proceed directly to opening `/chiang-mai/elephant-camp-finder` until homepage visible copy is safer and the user explicitly approves the SEO change.
