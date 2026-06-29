# RadarScout partner outreach target list template

Task: `TD-RADARSCOUT-PARTNER-OUTREACH-TARGET-LIST-TEMPLATE-0`

Status: docs-only private target list template.

Use this template before running `docs/radarscout-partner-outreach-run-0.md`.

This document helps a human operator choose a small first batch of partner, supplier, and destination partner outreach targets. It does not scrape leads, send email, create CRM records, add backend forms, write to the database, change schema or environment variables, call Bókun API, add checkout, add payment handling, create booking submission, change SEO, touch ThaiEleHub, run Shopify commands, or deploy production.

## 1. Source documents

Use this document with:

- `docs/radarscout-partner-outreach-run-0.md`
- `docs/radarscout-partner-operating-pack.md`
- `docs/radarscout-partner-lead-tracker-template.md`
- `docs/radarscout-partner-outreach-email-templates.md`
- `docs/radarscout-supplier-link-intake-manual-workflow.md`
- `docs/radarscout-supplier-link-intake-static-template.md`

The target list is a pre-outreach planning worksheet. Once a target is selected for outreach, move the relevant fields into the private lead tracker.

## 2. Purpose

The first outreach run should not be a broad sales blast.

The target list should help the operator choose 5 to 10 targets that are likely to:

- focus on Thailand experiences;
- have public traveler-facing pages;
- fit RadarScout's current discovery and handoff model;
- provide useful signal for Chiang Mai or nearby destination expansion;
- avoid private backend, rates, checkout, payment, or inventory scope.

## 3. Target list columns

Use these columns in a private spreadsheet, private document, or internal note:

```text
Target ID
Target name
Target type
Public website
Public contact source
Destination focus
Experience category
Known public traveler-facing page
Likely traveler-facing URL available
Relevance score
Safety score
Outreach priority
Suggested template
Why this target
Known risk or exclusion note
Owner
Ready for outreach
Moved to lead tracker
Lead ID after move
Notes
```

Do not store private credentials, private rates, commission sheets, backend screenshots, checkout session links, traveler personal data, or exact traveler pickup addresses.

## 4. Target type values

Use:

- `local operator`
- `supplier`
- `travel agent`
- `hotel`
- `DMC`
- `destination partner`
- `content partner`
- `unknown`
- `out of scope`

If the operator cannot classify the target from public information, use `unknown` and keep the target out of the first batch unless there is a clear reason to ask for clarification.

## 5. Destination focus values

Use one or more:

- `Chiang Mai`
- `Bangkok`
- `Pattaya`
- `Phuket`
- `Krabi`
- `Khao Sok`
- `Thailand multi-destination`
- `unknown`

For the first run, prefer `Chiang Mai` when possible because the live RadarScout planner is currently strongest there.

## 6. Experience category values

Use one or more:

- `elephant care`
- `cooking`
- `local food`
- `nature day trip`
- `family-friendly`
- `low-intensity`
- `photo-friendly`
- `culture`
- `transfer-friendly`
- `other`

Avoid targets that only provide hotels, flights, unrelated nightlife, or generic global activity inventory with no clear Thailand experience page.

## 7. Public URL readiness

For `Likely traveler-facing URL available`, use:

- `yes`
- `probably`
- `unclear`
- `no`

Definitions:

| Value | Meaning | First-run action |
| --- | --- | --- |
| `yes` | A public product, operator, booking partner, or experience page is already visible. | Good first-batch candidate. |
| `probably` | The website suggests public experience pages exist, but the exact URL is not yet selected. | Acceptable if relevance is strong. |
| `unclear` | The target may be relevant, but public traveler-facing pages are not obvious. | Lower priority. |
| `no` | Only private, backend, social-only, or non-specific pages are visible. | Do not include in first batch. |

Do not use a target in the first batch if the only known link is a backend, checkout, cart, payment, private rate, commission, or inventory page.

## 8. Relevance score

Use:

| Score | Meaning |
| --- | --- |
| `A` | Directly relevant Thailand experience target with clear destination/category fit. |
| `B` | Relevant but missing one important detail, such as exact public product page or destination focus. |
| `C` | Weak fit or too broad for current RadarScout focus. |
| `D` | Out of scope for RadarScout's current model. |

`A` and strong `B` targets can enter the first run.

`C` targets should usually wait.

`D` targets should not be contacted.

## 9. Safety score

Use:

| Score | Meaning |
| --- | --- |
| `safe` | Public-facing site, no obvious backend/rate/checkout dependency, no unsafe claims required. |
| `needs caution` | Relevant, but may require clarification about public URL or role. |
| `do not use` | Requires backend, private rates, checkout, payment, inventory sync, or unsupported claims. |

Only `safe` and some `needs caution` targets may be considered for the first run.

## 10. Outreach priority

Use:

- `P1`: first batch candidate
- `P2`: useful later
- `P3`: low priority
- `do not contact`

Recommended first batch:

```text
P1 targets only
5 to 10 total targets
3 to 5 local operators or suppliers
1 to 3 travel partners, hotels, or DMCs
1 to 2 destination partners
```

## 11. Suggested template mapping

Use:

| Target type | Suggested template |
| --- | --- |
| `local operator` or `supplier` | `Short intro for suppliers or local operators` |
| `travel agent`, `hotel`, or `DMC` | `Short intro for travel partners` |
| `destination partner` | `Destination partner intro` |
| `unknown` | Clarification note before requesting URLs |
| `out of scope` | Do not contact |

The templates live in:

```text
docs/radarscout-partner-outreach-email-templates.md
```

## 12. Inclusion criteria

A first-run target should meet most of these:

- Thailand-focused or clearly relevant to Thailand travelers.
- Destination fit with Chiang Mai, Bangkok, Pattaya, Phuket, Krabi, Khao Sok, or multi-destination Thailand.
- Experience category fit with current RadarScout planning direction.
- Public website exists.
- Public traveler-facing page exists or likely exists.
- The target can be contacted without asking for backend, checkout, payment, private rate, commission, or inventory access.
- The target can be safely asked for a public traveler-facing URL.

## 13. Exclusion criteria

Do not include targets that primarily require:

- supplier dashboard access;
- Bókun backend links;
- private admin links;
- checkout links;
- cart links;
- payment session links;
- private rates;
- partner rates;
- commission sheets;
- live inventory calendars;
- login credentials;
- traveler personal data;
- unsupported public claims.

Also exclude targets whose public positioning depends on:

- fake reviews;
- fake ratings;
- unverifiable awards;
- guaranteed slots;
- instant confirmation claims that RadarScout cannot verify;
- claims that RadarScout would complete bookings or payments.

## 14. Ready-for-outreach check

Set `Ready for outreach` to `yes` only if:

- [ ] `Target type` is known.
- [ ] `Public website` is present.
- [ ] `Destination focus` is relevant.
- [ ] `Experience category` is relevant.
- [ ] `Likely traveler-facing URL available` is `yes` or `probably`.
- [ ] `Relevance score` is `A` or strong `B`.
- [ ] `Safety score` is `safe` or acceptable `needs caution`.
- [ ] `Outreach priority` is `P1`.
- [ ] The correct outreach template is selected.
- [ ] There is no backend, checkout, payment, rate, commission, or inventory dependency.

If any condition fails, do not send outreach in run 0.

## 15. Move selected targets to lead tracker

When a target is selected, create a lead tracker row using:

```text
docs/radarscout-partner-lead-tracker-template.md
```

Map fields:

| Target list field | Lead tracker field |
| --- | --- |
| `Target ID` | notes or reference |
| `Target name` | `Organization name` |
| `Target type` | `Lead type` |
| `Public website` | `Public website` |
| `Destination focus` | `Destination focus` |
| `Experience category` | `Experience category` |
| `Suggested template` | `Response template used` |
| `Why this target` | `Notes` |
| `Known risk or exclusion note` | `Notes` or `Do not use reason` |

After moving, set:

```text
Moved to lead tracker: yes
Lead ID after move: <lead id>
```

Do not send outreach until the lead tracker row exists.

## 16. Example target list rows

### Strong supplier target

```text
Target ID: T-001
Target name: Example Chiang Mai Nature Care
Target type: local operator
Public website: https://example.com
Destination focus: Chiang Mai
Experience category: elephant care, local food, low-intensity
Known public traveler-facing page: yes
Likely traveler-facing URL available: yes
Relevance score: A
Safety score: safe
Outreach priority: P1
Suggested template: Short intro for suppliers or local operators
Why this target: Direct Chiang Mai experience fit with likely public product page.
Ready for outreach: yes
```

### Needs caution target

```text
Target ID: T-002
Target name: Example Thailand Travel Partner
Target type: DMC
Public website: https://example-travel-partner.com
Destination focus: Thailand multi-destination
Experience category: nature day trip, family-friendly
Known public traveler-facing page: unclear
Likely traveler-facing URL available: probably
Relevance score: B
Safety score: needs caution
Outreach priority: P1
Suggested template: Short intro for travel partners
Why this target: Potential partner fit, but public experience URL must be clarified.
Ready for outreach: yes
```

### Excluded target

```text
Target ID: T-003
Target name: Example Private Rates Wholesaler
Target type: out of scope
Known public traveler-facing page: no
Likely traveler-facing URL available: no
Relevance score: D
Safety score: do not use
Outreach priority: do not contact
Known risk or exclusion note: Requires private rate sheet and inventory access.
Ready for outreach: no
```

## 17. Batch summary

Before starting outreach, summarize:

```text
Batch name:
Prepared by:
Prepared date:
Total candidate targets reviewed:
P1 targets selected:
Local operators or suppliers selected:
Travel partners, hotels, or DMCs selected:
Destination partners selected:
Destinations represented:
Experience categories represented:
Known public traveler-facing pages:
Targets needing clarification:
Targets excluded and why:
Ready to move selected targets to lead tracker: yes | no
```

## 18. Handoff to outreach run

After selected targets are moved to the lead tracker, use:

```text
docs/radarscout-partner-outreach-run-0.md
```

The target list does not authorize:

- sending automated emails;
- adding public links to RadarScout;
- creating a static registry;
- implementing handoff source changes;
- changing tour detail pages;
- changing recommendation cards;
- deploying production.

## 19. Future implementation gate

Only consider a future static registry specification after:

1. at least one real public traveler-facing URL is collected;
2. the URL passes supplier link intake review;
3. the review status is `approved for manual handoff consideration`;
4. a separate implementation task is approved.

Likely future gated task:

```text
TD-RADARSCOUT-TOUR-DETAIL-HANDOFF-SOURCE-2-STATIC-REGISTRY-SPEC
```

Do not start that task from target-list evidence alone. A target list is not the same as an approved public URL.

## 20. Validation for this task

This is a docs-only task.

Required validation:

```bash
git diff --check -- docs/radarscout-partner-outreach-target-list-template.md
```

No app tests are required unless app code changes accidentally.
