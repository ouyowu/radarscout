# RadarScout Frontend DESIGN.md — "Immersive Expedition"

An **original** design system for RadarScout's public frontend. Direction:
big-image immersive, adventurous, high-end travel-house feel — for Thailand
experiences with a safe booking-partner handoff.

This is original work. It is NOT a copy of any third-party site or commercial
Shopify theme. It evolves RadarScout's existing brand (navy / terracotta / cream)
toward a more immersive, editorial, expedition aesthetic. Do not scrape or reuse
any third-party site's images, CSS, or layout.

## 0. Hard guardrails (do not break while restyling)

- **No cart / checkout / Buy-now / price / live availability / rating claims.**
  Product detail CTA is **"Check availability" → the reviewed Viator affiliate URL**
  (external handoff), never an add-to-cart. `bookingEnabled` / `availabilityEnabled`
  stay false.
- `copySafety` and `publicCopySafety` tests must stay green — restyle changes
  markup/classes, not the safe-copy rules.
- **SEO index policy unchanged**: finder `index:true`; `/ai-trip-planner` noindex;
  `/tours/[id]` gated. Restyle must not touch `robots`/`sitemap` values
  (`seoIndexGuard.test.ts` must stay green).
- No ThaiEleHub / Shopify. No DB / schema / env / provider API changes.
- **Images**: use only owned or properly-licensed imagery (operator's own Thailand
  photos, or licensed stock). Until real assets are provided, use tasteful solid/
  gradient placeholders via `next/image` — never hotlink or copy third-party photos.

## 1. Color

Evolves the existing brand; deep forest base gives the immersive/expedition feel,
warm terracotta stays the action color.

| Token | Hex | Use |
| --- | --- | --- |
| `--ink` | `#14201B` | primary text on light |
| `--forest-900` | `#0F241C` | immersive dark sections / hero overlays |
| `--forest-700` | `#1B4638` | deep brand green, headings on light, nav solid |
| `--forest-500` | `#2E6B55` | secondary buttons, links, chips |
| `--sage-200` | `#CBD8CF` | hairlines, muted surfaces on dark |
| `--terracotta` | `#D57C48` | **primary CTA / accent** (existing brand) |
| `--terracotta-600`| `#C0662F` | CTA hover |
| `--sand-50` | `#F7F2EA` | page background (light) |
| `--sand-100` | `#EFE6D8` | card surface / alt section |
| `--cloud` | `#FFFFFF` | cards, elevated surfaces |
| `--muted` | `#6B7B72` | secondary text |

Rules: dark immersive sections use `--forest-900` (often as a 40–65% overlay over
a full-bleed photo) with white text; light sections use `--sand-50`. Terracotta is
reserved for the single primary action per view — do not overuse.

Contrast: all text must meet WCAG AA (≥4.5:1 body, ≥3:1 large). White on
`--forest-900` and ink on `--sand-50` both pass; verify terracotta buttons use
white text only at ≥18px/bold.

## 2. Typography

High-end travel = editorial serif display + clean grotesque UI.

- **Display / headings**: `Fraunces` (variable serif, optical size). Weights
  500–600, tight leading (1.02–1.08), slight negative tracking on large sizes.
- **Body / UI**: `Inter`. 400/500/600. Leading 1.5–1.7.
- Self-host both (or `next/font/google`) — no third-party CDN. Fallbacks:
  `Fraunces, Georgia, serif` and `Inter, system-ui, sans-serif`.

Type scale (fluid, `clamp`):

| Role | Size (desktop → mobile) | Font |
| --- | --- | --- |
| Hero display | 72 → 40px | Fraunces 600 |
| H2 section | 44 → 30px | Fraunces 600 |
| H3 card title | 22 → 20px | Fraunces 500 |
| Lead paragraph | 20 → 18px | Inter 400 |
| Body | 16px | Inter 400 |
| Overline / eyebrow | 12px, 0.18em tracking, uppercase | Inter 600 |

## 3. Spacing, radius, elevation

- Base 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections breathe:
  desktop section padding 96–128px vertical; mobile 56–72px.
- Container max-width 1240px; wide/full-bleed for hero and image bands.
- Radius: `--r-sm 10px` (chips/inputs), `--r-md 18px` (cards), `--r-lg 28px`
  (feature panels), pill `9999px` (buttons).
- Elevation: soft, low-spread — `0 20px 40px rgba(15,36,28,0.10)`. Avoid harsh
  shadows; high-end = restrained.

## 4. Core components

- **Buttons**: primary = terracotta pill, white text, hover `--terracotta-600`,
  min-height 52px, generous padding, uppercase-tracked label. Secondary =
  outline (1px `--forest-500`) on light, or `bg-white/10 backdrop-blur` outline on
  imagery. Ghost = text + underline on hover.
- **Experience card** (the workhorse): full-bleed image top (4:3 or 3:4),
  `--r-md`, subtle gradient scrim at bottom, eyebrow (city) + Fraunces title +
  one-line summary + tag chips. Whole card is one link. On detail results, the
  card's CTA is "View details" (→ tour detail), never "Book"/price.
- **Nav**: transparent over hero, becomes `--forest-700` solid + shadow on scroll.
  Logo left, primary links center/right, terracotta "Plan a trip" pill CTA. Mobile:
  full-screen overlay menu.
- **Chips / tags**: `--sand-100` pill on light, `bg-white/12` on dark; used for
  interests (Elephants, Nature, Family) and "why this fits" signals.
- **Section band**: alternating `--sand-50` / full-bleed image with `--forest-900`
  overlay to create rhythm.

## 5. Page blueprints

### Home (`/`)
1. **Full-bleed hero**: large Thailand image, `--forest-900` 55% overlay, eyebrow
   "Thailand, thoughtfully planned", Fraunces hero headline, one lead line, two
   CTAs (primary terracotta "Plan a trip" → planner; secondary "Explore Chiang Mai"
   → finder). Subtle scroll cue.
2. **Trust strip**: the existing transparency points (Read-only comparison /
   Partner-direct value / Thailand-only / Reviewed coverage) as a quiet band.
3. **Featured experiences**: 3–4 real partner experience cards (from the seed),
   image-forward grid.
4. **How it works**: 3-step, editorial, generous whitespace.
5. **Immersive destination band**: full-bleed image + Fraunces quote-style copy +
   CTA to finder.
6. **Partner-direct value**: honest positioning (trusted operators, secure booking
   handoff) — reuse existing safe copy.
7. Footer: sitemap-safe links, no unsafe claims.

### Collection / listing (`/tours`, destination pages)
- Category header: full-bleed image + Fraunces title + count/summary (no price).
- Sticky-ish filter/sort bar (destination, interest chips). Client-side only.
- Responsive experience-card grid (1 / 2 / 3 cols). Skeleton loading states.
- Empty state: friendly, suggests other searches (reuse planner's no-match copy).

### Product / experience detail (`/tours/[id]`)
- Immersive hero of the experience (image + title + city eyebrow).
- Optional gallery strip (owned/licensed images only).
- Description + "why this fits" chips (reuse existing fit signals).
- **Sticky action** (desktop side rail / mobile bottom bar): **"Check availability"
  → reviewed Viator affiliate URL** (external, `rel="nofollow sponsored noopener noreferrer"`).
  NO price, NO availability text, NO add-to-cart.
- Safe partner/handoff note (reuse existing tour-detail return + handoff copy).
- Related experiences (same city) as cards.

## 6. Motion & accessibility

- Motion: restrained — hero image slow parallax/zoom (respect
  `prefers-reduced-motion`), fade-up on scroll for cards, 150–250ms eases. No
  gratuitous animation.
- A11y: WCAG 2.1 AA. Visible focus rings, keyboard nav, alt text on every image,
  semantic landmarks, 44px+ touch targets, color never the sole signal.
- Performance: `next/image` with sizes, priority only on hero, lazy elsewhere;
  target good LCP/CLS; self-hosted fonts with `font-display: swap`.

## 7. Build order (per SOP — one PR per step, gates green, don't auto-merge)

1. **Design tokens + primitives**: add the palette/type/spacing tokens + Button,
   Card, Nav, Section primitives (Tailwind theme extension or CSS vars). No page
   rewrite yet. Tests + build green.
2. **Home** restyle to the blueprint. copySafety/SEO/E2E green.
3. **Listing** restyle.
4. **Detail** restyle (handoff CTA, no cart).

Each step: new branch off `codex/travel-mvp-launch`, full gate, open PR, do not
merge. Keep the finder/planner functional and their guards intact.
