# RadarScout tour detail SEO candidate first review

Task: `TD-RADARSCOUT-TOUR-DETAIL-SEO-CANDIDATE-FIRST-REVIEW-0`

This is a read-only candidate review for the first possible `/tours/{id}` SEO candidate.

No app code, candidate registry, sitemap, robots metadata, database state, environment variables, Bókun behavior, deployment, or ThaiEleHub files were changed by this review.

## 1. Review question

Can RadarScout select one current `/tours/{id}` product as the first SEO candidate?

Required answer before implementation:

```text
Only a confirmed State A product can move into a separate SEO allowlist PR.
```

## 2. Evidence reviewed

Reviewed sources:

- `docs/radarscout-tour-detail-handoff-policy.md`
- `docs/radarscout-tour-detail-handoff-candidate-list.md`
- `docs/radarscout-tour-detail-handoff-candidate-review.md`
- `docs/radarscout-tour-detail-handoff-mapping-candidate-review.md`
- `docs/radarscout-tour-detail-handoff-mapping-evidence-readonly-1.md`
- `docs/radarscout-tour-detail-handoff-mapping-evidence-packet.md`
- `docs/radarscout-tour-detail-seo-candidate-policy.md`
- `docs/radarscout-tour-detail-seo-opening-status.md`
- `apps/web/lib/publicProducts/ownerManagedProductHandoffMappings.ts`
- `apps/web/lib/publicProducts/tourDetailSeoCandidates.ts`

## 3. Current code state

The current handoff mapping registry is empty:

```text
ownerManagedProductHandoffMappings: []
```

The current tour detail SEO candidate registry is empty:

```text
tourDetailSeoCandidates: []
```

This means no current product can be treated as a confirmed State A SEO candidate by code.

## 4. Current evidence state

Existing docs show:

- public product samples previously exposed no confirmed production `bookingPartnerHandoff`;
- owner-managed activity IDs are known, but they are not the same as public `/tours/{id}` product IDs;
- Preview DB evidence included a preview-only wiring candidate;
- approved production mapping candidates remain `0`;
- public product ID evidence is still required before a real production mapping can be added.

## 5. Candidate decision

Decision:

```text
No current tour detail product should be added to the SEO candidate registry yet.
```

Reason:

- there is no confirmed production State A product in the current code or docs;
- the handoff mapping registry is empty;
- the SEO candidate registry is empty;
- opening SEO based on title, activity ID, or preview-only evidence would violate the candidate policy.

## 6. Safe product behavior that must remain unchanged

Until one product passes a separate evidence review:

- `/tours/{id}` routes may remain public detail pages;
- `/tours/{id}` pages should stay closed to `index,follow` by default;
- `/tours/{id}` URLs should remain out of `sitemap.xml`;
- products without verified handoff should not render a product-specific `Check availability` CTA;
- no live availability, checkout, payment, booking submission, supplier rate, partner rate, or internal Bókun wording should appear.

## 7. Required evidence before first candidate implementation

The next implementation task should not add a tour detail SEO candidate until a reviewed evidence packet provides:

- exact production public product ID used by `/tours/{id}`;
- matching owner-managed Bókun activity ID;
- product title and destination;
- verified public handoff URL;
- evidence that the page renders the safe `Check availability` handoff;
- evidence that CTA rel includes `nofollow sponsored noopener noreferrer`;
- public-copy audit with zero forbidden wording;
- explicit reviewer approval for SEO-candidate consideration.

## 8. Recommended next task

Recommended next task:

`TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-FIRST-PROD-EVIDENCE-0`

Scope:

- collect one production-safe evidence packet for a real public product ID;
- use read-only production/public checks only;
- do not write DB;
- do not call Bókun API;
- do not add mappings;
- do not add SEO candidates;
- do not deploy.

Only after that evidence is reviewed should RadarScout start:

`TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-MAPPING-FIRST-APPROVED-MAPPING`

That later task would still add handoff mapping first, not SEO indexing.
