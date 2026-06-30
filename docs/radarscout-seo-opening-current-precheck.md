# RadarScout SEO opening current precheck

Task: `TD-RADARSCOUT-SEO-OPENING-PRECHECK-0`

Date checked: 2026-06-30

## 1. Executive summary

RadarScout is closer to a controlled SEO opening, but this task does not open indexing.

Current recommendation:

```text
Keep current production SEO state unchanged.
Use this precheck as the current baseline before any explicit approval to open /chiang-mai/elephant-camp-finder.
```

The safest next SEO implementation remains a narrow, explicitly approved, robots-only opening for:

```text
/chiang-mai/elephant-camp-finder
```

Do not open `index,follow` from this task.

## 2. Live production status

Live URL checks:

| URL | Status | Title | Robots |
| --- | ---: | --- | --- |
| `https://radarscout.io/` | 200 | `RadarScout \| AI-guided Thailand Experience Planner` | no page-level robots meta |
| `https://www.radarscout.io/` | 200 | `RadarScout \| AI-guided Thailand Experience Planner` | no page-level robots meta |
| `https://radarscout.io/chiang-mai/elephant-camp-finder` | 200 | `Find the right Chiang Mai experience \| RadarScout` | `noindex, nofollow` |
| `https://radarscout.io/partners` | 200 | `Partners \| RadarScout` | `noindex, nofollow` |
| `https://radarscout.io/suppliers` | 200 | `Suppliers \| RadarScout` | `noindex, nofollow` |
| `https://radarscout.io/destination-partners` | 200 | `Destination Partners \| RadarScout` | `noindex, nofollow` |
| `https://radarscout.io/sitemap.xml` | 200 | n/a | n/a |

Current sitemap entries:

```text
https://www.radarscout.io
https://www.radarscout.io/contact
https://www.radarscout.io/privacy-policy
https://www.radarscout.io/terms-of-service
```

Current sitemap exclusions remain correct:

```text
/tours/{id}
/chiang-mai/elephant-camp-finder
/partners
/suppliers
/destination-partners
```

## 3. Current safety copy status

Live rendered visible-copy audit found zero matches on:

```text
https://radarscout.io/
https://radarscout.io/chiang-mai/elephant-camp-finder
https://radarscout.io/partners
https://radarscout.io/suppliers
https://radarscout.io/destination-partners
```

Checked visible terms:

- `AI booked this`
- `live availability`
- `available now`
- `guaranteed slot`
- `instant confirmation`
- `checkout`
- `payment`
- `reservation complete`
- `booking complete`
- `Bókun backend`
- `Bókun database`
- `Bókun-powered`
- `Bókun supplier products`
- `supplier net rate`
- `partner rate`
- `commission`
- `fake reviews`
- `fake ratings`
- `live inventory`
- `DMC Portal`

Result:

```text
Visible public copy: pass
```

## 4. What has improved since the stale homepage audit

The stale PR that recorded older homepage copy concerns is now closed as superseded.

Current production has since completed:

- homepage visible copy safety cleanup;
- homepage entry point to the Chiang Mai finder;
- sitemap removal of unsafe `/tours/{id}` URLs;
- deterministic chat planner;
- deterministic itinerary summary;
- compact mobile summary;
- Vercel protected-preview workflow documentation and helper.

The older blocker about homepage visible copy containing DMC, Bókun-heavy, or live-inventory framing is no longer current based on live visible-copy sampling.

## 5. What is ready

The Chiang Mai finder is the best candidate for the first controlled SEO opening because it has:

- a stable homepage entry point;
- traveler-facing AI-guided planning copy;
- deterministic chip-based planner behavior;
- deterministic suggested day summary;
- safe recommendation cards;
- `Check availability` CTA;
- external booking partner handoff;
- no visible unsafe booking, payment, live-availability, rating, rate, or Bókun-backend wording;
- no `/tours/{id}` sitemap exposure.

## 6. What is not ready

Do not open these areas yet:

```text
/partners
/suppliers
/destination-partners
/tours/{id}
```

Reasons:

- B2B pages remain cooperation/lead pages and intentionally `noindex,nofollow`.
- Tour detail pages remain excluded from sitemap until a separate public-safety and indexing-policy pass.
- Broad site-wide SEO opening is not required to test one controlled traveler-facing page.

## 7. Recommended next task

Recommended next implementation, only after explicit approval:

```text
TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING-ROBOTS-ONLY
```

Recommended scope:

- change only `/chiang-mai/elephant-camp-finder` robots from `noindex,nofollow` to `index,follow`;
- do not add the finder to sitemap in the same task;
- keep `/tours/{id}` excluded from sitemap;
- keep B2B pages `noindex,nofollow`;
- keep B2B pages out of sitemap;
- keep homepage copy unchanged;
- keep planner/recommendation/CTA/handoff behavior unchanged.

Required production approval format:

```text
Approve TD-RADARSCOUT-SEO-READINESS-2-CHIANG-MAI-CONTROLLED-OPENING-ROBOTS-ONLY for merge SHA <sha>
```

Without that explicit approval, keep:

```text
/chiang-mai/elephant-camp-finder: noindex,nofollow
```

## 8. Future validation gates

Before any robots change PR is merged:

- Prisma generate passes;
- focused SEO metadata tests pass;
- sitemap tests pass;
- homepage copy tests pass;
- elephant finder tests pass;
- full Vitest passes;
- Playwright passes;
- TypeScript passes;
- Next build passes;
- preview smoke passes on a clean preview deployment;
- Vercel project is `ouyowus-projects / reddit-monitor`;
- preview has no production aliases.

Before any production deploy:

- user explicitly approves the exact merge SHA;
- clean production worktree confirms the approved SHA;
- production smoke confirms only the finder robots changed;
- homepage remains safe;
- B2B pages remain `noindex,nofollow`;
- sitemap still excludes `/tours/{id}`;
- no Bókun API, OpenAI/LLM, DB write, checkout, payment, booking submission, live availability, or inventory behavior appears.

## 9. Guardrails preserved by this task

This task did not:

- modify app code;
- deploy production;
- change robots metadata;
- change sitemap output;
- open SEO indexing;
- call Bókun API;
- add checkout, payment, cart, booking submission, live availability, or inventory behavior;
- write DB;
- change schema or environment variables;
- add LLM/OpenAI;
- touch ThaiEleHub files;
- run Shopify commands.
