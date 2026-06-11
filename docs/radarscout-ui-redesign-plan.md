## 🤖 Assistant


# RadarScout UI Redesign Plan - Premium Destination DMC Portal

**Document Version:** 1.0  
**Date:** 2025-01-15  
**Status:** Ready for Phase UI-1 Implementation

---

## 1. Overall UI Direction

### Brand Positioning

RadarScout is transforming into:

```
AI-powered Destination DMC Portal powered by signed Bókun supplier partners
```

**What this means:**
- NOT a generic travel aggregator (Viator/GetYourGuide/Klook)
- NOT a fake marketplace with unbookable products
- NOT a cheap affiliate blog

**What RadarScout IS:**
- Premium destination expert portal
- Curated local experience marketplace
- AI-enhanced itinerary assistant
- Trusted Bókun supplier network
- Regional DMC (Destination Management Company) platform

### Visual Identity Goals

**Emotional Tone:**
```
Warm          → Adventure travel spirit with approachable warmth
Confident     → We deeply know these destinations
Curated       → Quality over quantity, selective partnerships
Trustworthy   → Real suppliers, real inventory, transparent
Professional  → Premium DMC portal, not amateur blog
```

**Visual Aesthetic:**
```
Outdoor adventure warmth   (beige/sand backgrounds, natural photography)
Confident orange accents   (energy, action, exploration)
Editorial magazine layout  (clear sections, visual hierarchy)
Photography-forward        (hero images, destination atmosphere)
Generous whitespace        (premium, not cluttered)
Hand-crafted details       (script labels, personal curation touch)
```

**Inspiration Sources:**
- Premium outdoor travel brands (warmth + adventure)
- High-end hotel experience portals (curated local tours)
- Travel creator marketplaces (personal expertise + curation)
- Regional DMC websites (destination authority)

**NOT Inspired By:**
```
❌ Generic SaaS blue/purple gradients
❌ Fake marketplace inflated numbers
❌ Stock photo affiliate blogs
❌ Cold corporate sterile layouts
❌ Overpromising worldwide coverage
```

---

## 2. Design Tokens

### 2.1 Color System

```css
/* Primary Brand Colors */
--color-accent-orange: #ff9933;           /* CTA buttons, badges, highlights */
--color-accent-orange-dark: #e67300;      /* Hover states */
--color-accent-orange-light: #ffecd9;     /* Subtle backgrounds, alerts */
--color-accent-orange-pale: #fff4e6;      /* Very subtle backgrounds */

/* Background System */
--color-bg-primary: #fdfcf4;              /* Main page background (warm white) */
--color-bg-secondary: #fcfaee;            /* Alternate section background */
--color-bg-muted: #efebdb;                /* Subtle card backgrounds */
--color-bg-card: #ffffff;                 /* Elevated white cards */
--color-bg-dark: #1a1a1a;                 /* Dark sections (testimonials, footer) */

/* Text Colors */
--color-text-primary: #1a1a1a;            /* Body text, headings */
--color-text-secondary: #4a4a4a;          /* Secondary text */
--color-text-muted: #888888;              /* Labels, metadata, hints */
--color-text-inverse: #ffffff;            /* Text on dark backgrounds */

/* Border Colors */
--color-border-light: #e8e4d6;            /* Card borders, dividers */
--color-border-medium: #d4cfc0;           /* Stronger dividers */

/* Status Colors */
--color-success-green: #4a7c59;           /* Live inventory badge */
--color-warning-amber: #d97706;           /* Coming soon badge */
--color-info-blue: #3b82f6;               /* AI features, info badges */
--color-neutral-gray: #6b7280;            /* Neutral status */

/* Semantic Colors */
--color-live-inventory: #4a7c59;          /* Thailand live products */
--color-coming-soon: #d97706;             /* Partner tours coming soon */
--color-ai-feature: #3b82f6;              /* AI-powered features */
```

### 2.2 Typography System

```css
/* Font Families */
--font-body: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-heading: 'Palanquin Dark', 'Bebas Neue', Impact, sans-serif;
--font-script: 'Caveat', 'Dancing Script', 'Mansalva', cursive;

/* Font Sizes (Desktop-first, responsive scale) */
--text-xs: 0.75rem;       /* 12px - Tiny labels, tags */
--text-sm: 0.875rem;      /* 14px - Metadata, captions */
--text-base: 1rem;        /* 16px - Body text */
--text-lg: 1.125rem;      /* 18px - Large body, intro text */
--text-xl: 1.25rem;       /* 20px - Small section titles */
--text-2xl: 1.5rem;       /* 24px - Card titles, product names */
--text-3xl: 1.875rem;     /* 30px - Section headings */
--text-4xl: 2.25rem;      /* 36px - Page titles */
--text-5xl: 3rem;         /* 48px - Hero titles (desktop) */
--text-6xl: 3.75rem;      /* 60px - Homepage hero (desktop) */
--text-7xl: 4.5rem;       /* 72px - Extra large hero (optional) */

/* Mobile Font Size Overrides */
@media (max-width: 768px) {
  --text-5xl: 2.25rem;    /* 36px on mobile */
  --text-6xl: 2.5rem;     /* 40px on mobile */
  --text-7xl: 3rem;       /* 48px on mobile */
}

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-black: 900;     /* For hero headings */

/* Line Heights */
--leading-tight: 1.2;         /* Headlines, hero titles */
--leading-snug: 1.375;        /* Subheadings */
--leading-normal: 1.5;        /* Body text */
--leading-relaxed: 1.625;     /* Large paragraphs, intros */
--leading-loose: 1.75;        /* Extra breathing room */

/* Letter Spacing */
--tracking-tight: -0.02em;    /* Large headlines */
--tracking-normal: 0;
--tracking-wide: 0.025em;     /* Small caps, labels */
--tracking-wider: 0.05em;     /* Button text */
```

### 2.3 Spacing System

```css
/* Spacing Scale (8px base unit) */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Section Spacing */
--section-padding-y: var(--space-20);          /* Desktop vertical section spacing */
--section-padding-y-mobile: var(--space-12);   /* Mobile vertical section spacing */
--section-padding-x: var(--space-6);           /* Horizontal page padding */
--section-padding-x-mobile: var(--space-4);    /* Mobile horizontal padding */

/* Content Width Constraints */
--content-max-width: 1280px;        /* Max content width */
--content-narrow: 720px;            /* Narrow content (blog, forms) */
--content-wide: 1440px;             /* Wide content (hero, full-width) */
```

### 2.4 Border Radius System

```css
--radius-sm: 0.25rem;     /* 4px - Small elements, tags */
--radius-base: 0.5rem;    /* 8px - Cards, buttons */
--radius-lg: 0.75rem;     /* 12px - Large cards */
--radius-xl: 1rem;        /* 16px - Hero cards, featured content */
--radius-2xl: 1.5rem;     /* 24px - Extra large containers */
--radius-full: 9999px;    /* Full circle - badges, pills */
```

### 2.5 Shadow System

```css
/* Card Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Warm Shadow (with slight orange tint) */
--shadow-warm: 0 4px 6px -1px rgba(255, 153, 51, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

### 2.6 Button Styles

```css
/* Primary Button (Orange CTA) */
.btn-primary {
  background: var(--color-accent-orange);
  color: var(--color-text-inverse);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--tracking-wider);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background: var(--color-accent-orange-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Secondary Button (Outlined) */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-medium);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-semibold);
}

.btn-secondary:hover {
  border-color: var(--color-accent-orange);
  color: var(--color-accent-orange);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  padding: var(--space-4) var(--space-8);
  font-weight: var(--font-weight-medium);
}

.btn-ghost:hover {
  background: var(--color-bg-muted);
}
```

### 2.7 Image Ratios

```css
/* Standard Image Aspect Ratios */
--ratio-square: 1 / 1;           /* 1:1 - Square (profile, icons) */
--ratio-landscape: 4 / 3;        /* 4:3 - Standard landscape */
--ratio-wide: 16 / 9;            /* 16:9 - Wide landscape, hero */
--ratio-ultrawide: 21 / 9;       /* 21:9 - Ultra-wide hero */
--ratio-portrait: 3 / 4;         /* 3:4 - Portrait (destination cards) */
--ratio-tall-portrait: 2 / 3;    /* 2:3 - Tall portrait (capsule cards) */
```

### 2.8 Mobile Breakpoints

```css
/* Responsive Breakpoints */
--breakpoint-sm: 640px;    /* Small tablets */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Small desktops */
--breakpoint-xl: 1280px;   /* Large desktops */
--breakpoint-2xl: 1536px;  /* Extra large screens */
```

---

## 3. Page-by-Page Redesign Plan

### 3.1 Homepage (`/`)

**Page Goal:**
Communicate RadarScout's unique value as an AI-powered destination DMC portal with curated Bókun supplier inventory.

**First Screen Structure:**
```
1. AdventureHero (full-width, image background)
   - Script label: "Powered by AI + Local Experts"
   - Bold headline: "Plan Smarter Trips with Curated Local Experiences"
   - Subheadline: "Discover authentic tours from trusted Bókun supplier partners"
   - CTA: "Explore Destinations" + "How It Works"

2. DmcTrustBar (scrolling below hero)
   - "Thailand: 300+ Live Tours"
   - "AI Itinerary Matching"
   - "Verified Local Suppliers"
   - "Coming to 15 Global Destinations"
```

**Main Module Order:**
```
1. AdventureHero
2. DmcTrustBar
3. How RadarScout Works (3-step process)
   - Script label: "Your Journey Starts Here"
   - Step 1: Choose destination → AI suggests itinerary
   - Step 2: Browse curated partner tours
   - Step 3: Book directly from verified suppliers
4. DestinationCapsuleCarousel (featured destinations)
   - Thailand (Live - 300+ tours)
   - Chiang Mai (Live - 87 tours)
   - Barcelona (Coming Soon)
   - New York (Coming Soon - World Cup 2026)
5. ExperienceCategoryGrid (6 categories)
   - Food & Culture
   - Nature & Adventure
   - Private Experiences
   - Family Friendly
   - Day Tours
   - Multi-Day Journeys
6. TourCollectionSection (Featured Thailand Tours)
   - Script label: "Curated by Local Experts"
   - Title: "Top Experiences in Thailand"
   - CuratedTourCard grid (8-12 cards)
   - CTA: "Explore All Thailand Tours"
7. EditorialBanner (AI Trip Planner)
   - Large hero image
   - "Let AI Build Your Perfect Itinerary"
   - CTA: "Try AI Planner"
8. PartnerInventoryNotice (Coming Soon Destinations)
   - Title: "Expanding to Top Travel Destinations"
   - Destination pills: Barcelona, Lisbon, Tokyo, NYC, etc.
   - Message: "Partner tours coming soon. We're onboarding trusted Bókun suppliers."
   - CTA: "Notify Me When Available"
9. TestimonialBand (2-3 traveler stories)
10. SupplierPartnerCTA
    - "Join RadarScout as a Bókun Supplier Partner"
    - CTA: "Learn More"
11. WarmNewsletterFooter
12. SiteFooter
```

**Card Layout:**
- DestinationCapsule: 4 columns desktop, 2 columns tablet, 1 column mobile
- ExperienceCategory: 6 columns desktop, 3 columns tablet, 2 columns mobile
- TourCard: 4 columns desktop, 2 columns tablet, 1 column mobile

**Primary CTAs:**
```
Hero: "Explore Destinations" (orange button, large)
Hero Secondary: "How It Works" (ghost button)
Tour Section: "Explore All Thailand Tours"
AI Banner: "Try AI Planner"
Partner CTA: "Become a Partner"
```

**Mobile Layout:**
- Hero height: 70vh (not 100vh, to show content below)
- Trust bar: Horizontal scroll
- Single-column stack for all card grids
- Sticky mobile CTA bar at bottom: "Explore Tours"

**Features to Preserve:**
- Link to `/tours` (Thailand live inventory)
- Link to `/destinations` (destination index)
- Link to `/ai-trip-planner` (AI demo)
- Link to `/partners` (supplier partnership page)

---

### 3.2 Destinations Index (`/destinations`)

**Page Goal:**
Premium destination portal index showing live inventory vs. coming soon destinations with clear status badges.

**First Screen Structure:**
```
1. Page Hero (smaller than homepage hero)
   - Script label: "Destination Experts"
   - Title: "Explore the World with Local Expertise"
   - Subtitle: "AI-powered trip planning + curated partner tours in top travel destinations"

2. DmcTrustBar
   - "15 Destinations"
   - "300+ Live Thailand Tours"
   - "Partner Network Growing"
```

**Main Module Order:**
```
1. Page Hero
2. DmcTrustBar
3. Filter Pills (optional, if > 15 destinations)
   - All Destinations
   - Live Inventory
   - Coming Soon
   - World Cup 2026
4. Destination Grid (DestinationCapsuleCard)
   - Thailand destinations (live badge, product count)
   - Coming soon destinations (amber badge)
   - World Cup destinations (special badge)
5. PartnerInventoryNotice
6. FAQAccordion (Destination FAQ)
   - "How do you select destinations?"
   - "What does 'coming soon' mean?"
   - "Can I request a destination?"
7. SupplierPartnerCTA
8. WarmNewsletterFooter
9. SiteFooter
```

**Card Layout:**
- 3 columns desktop
- 2 columns tablet
- 1 column mobile

**DestinationCapsuleCard Design:**
```
Structure:
- Tall portrait image (2:3 ratio)
- Overlay gradient (bottom)
- Badge: "Live - 87 tours" or "Coming Soon"
- Destination name (large, white)
- Country name (small, white)
- Best for tags (if live): "Food & Culture" "Adventure"
- AI planning status icon (if available)

Visual:
- Rounded corners (--radius-xl)
- Hover: Scale 1.05, shadow increase
- Live badge: green background
- Coming soon badge: amber background
```

**Primary CTAs:**
- Each card links to `/destinations/[slug]`
- "Notify Me" button on coming soon cards
- "Explore Tours" button on live cards

**Mobile Layout:**
- Single column
- Cards slightly taller on mobile
- Filter pills: horizontal scroll

**Features to Preserve:**
- Thailand destinations must show live inventory
- Non-Thailand must show "Partner tours coming soon"
- No fake product counts for coming soon destinations

---

### 3.3 Destination Detail Page (`/destinations/[slug]`)

**Page Goal:**
Act as destination expert portal + tour catalog entrance for live destinations OR partner recruitment page for coming soon destinations.

**First Screen Structure (Live Destination - Thailand):**
```
1. DestinationHero
   - Large hero image (destination atmosphere)
   - Script label: "Destination Expert"
   - Destination name + country
   - Short tagline: "87 curated experiences from local partners"
   - Quick facts: Best time to visit, Activities, Difficulty levels
   - CTA: "Explore Tours" (jumps to tour section)
```

**Main Module Order (Live Destination):**
```
1. DestinationHero
2. DmcTrustBar (destination-specific)
   - "87 Partner Tours"
   - "AI Itineraries Available"
   - "Verified Local Suppliers"
3. Destination Expert Portal Section
   - Script label: "Why We Love [Destination]"
   - Description (2-3 paragraphs)
   - Highlights (bullet points with icons)
   - Best for: Families, Adventure seekers, Culture lovers, etc.
4. ExperienceCategoryGrid (destination-specific)
   - Food & Culture (X tours)
   - Nature & Adventure (X tours)
   - Private (X tours)
   - Family Friendly (X tours)
5. TourCollectionSection (Available Partner Tours)
   - Filter by category (uses ProductTag)
   - CuratedTourCard grid
   - Link to `/tours?destination=[slug]`
6. EditorialBanner (AI Trip Planning)
   - "Get AI Itinerary Ideas for [Destination]"
   - CTA: "Try AI Planner"
7. DestinationGuide (Editorial content)
   - Best time to visit
   - Getting around
   - Local tips
   - Weather
8. FAQAccordion (destination-specific)
9. WarmNewsletterFooter
10. SiteFooter
```

**First Screen Structure (Coming Soon Destination):**
```
1. DestinationHero (same as live, but different CTA)
   - Badge: "Partner Tours Coming Soon"
   - CTA: "Notify Me When Available"

2. PartnerInventoryNotice (prominent)
   - "We're expanding to [Destination]"
   - "Currently onboarding trusted Bókun supplier partners"
   - "No tours available yet"
   - Email signup form
```

**Main Module Order (Coming Soon Destination):**
```
1. DestinationHero
2. PartnerInventoryNotice (full-width, prominent)
3. Destination Expert Portal Section (content only)
   - Destination description
   - What to expect when tours launch
   - Types of experiences we'll curate
4. AI Trip Planning Ideas (static)
   - "Plan your [Destination] trip with AI"
   - Sample itinerary ideas (no product links)
   - CTA: "Try AI Planner"
5. Why RadarScout is Expanding Here
   - Market research insights (NOT scraped Viator data)
   - Traveler demand
   - Supplier partnerships in progress
6. SupplierPartnerCTA
   - "Are you a local [Destination] tour operator?"
   - "Join our Bókun supplier network"
   - CTA: "Learn More About Partnerships"
7. Explore Live Destinations (cross-sell)
   - "While you wait, explore our Thailand collection"
   - Link to Thailand destinations
8. FAQAccordion
9. WarmNewsletterFooter
10. SiteFooter
```

**Mobile Layout:**
- Hero height: 60vh
- Single-column stack
- Tour grid: 1 column
- Sticky "Explore Tours" button (live) or "Notify Me" (coming soon)

**Features to Preserve:**
- Thailand destinations MUST show real products
- Non-Thailand MUST NOT show fake products
- ProductTag filtering MUST work
- Link to `/tours?destination=[slug]` for live inventory
- AI planner link to `/ai-trip-planner?destination=[slug]`

**Critical Safety Rules:**
```
✅ Show real BokunProduct data for Thailand
✅ Show "coming soon" notice for non-Thailand
✅ Link to AI planner (static demo, no fake products)

❌ Do NOT show Viator/GetYourGuide products
❌ Do NOT create fake product cards
❌ Do NOT show fake review counts
❌ Do NOT promise booking for unavailable destinations
```

---

### 3.4 Tours Catalog Page (`/tours`)

**Page Goal:**
Transform from basic product list into curated marketplace that feels like premium DMC selection.

**First Screen Structure:**
```
1. Page Hero (medium height)
   - Script label: "Curated by Destination Experts"
   - Title: "Discover Thailand's Best Experiences"
   - Subtitle: "Hand-picked tours from trusted Bókun supplier partners"
   - Filter preview: "300+ experiences | Food & Culture | Nature | Private"

2. Filter Bar (sticky on scroll)
   - Destination dropdown (currently Thailand only)
   - Experience type pills (from ProductTag)
   - Duration filter
   - Price range
   - Sorting: Recommended | Price | Duration
```

**Main Module Order:**
```
1. Page Hero
2. DmcTrustBar
   - "300+ Thailand Tours"
   - "Verified Suppliers"
   - "Real-time Availability"
3. TourCollectionSections (organized by category)
   
   Section A: Featured Tours
   - Script label: "Top Picks"
   - 4-6 cards
   
   Section B: Food & Culture
   - Script label: "Taste & Tradition"
   - Filtered by tag
   - "View All Food Tours" CTA
   
   Section C: Nature & Adventure
   - Script label: "Outdoor Exploration"
   - Filtered by tag
   
   Section D: Private Experiences
   - Script label: "Exclusive & Customizable"
   
   Section E: Family Friendly
   - Script label: "Adventures for All Ages"
   
   Section F: All Tours (paginated grid)

4. EditorialBanner (mid-page break)
   - "Not sure what to book?"
   - "Let AI build your perfect Thailand itinerary"
   - CTA: "Try AI Planner"

5. PartnerInventoryNotice (bottom)
   - "Looking for tours in other destinations?"
   - Preview coming soon destinations
   - CTA: "View All Destinations"

6. FAQAccordion (Booking FAQ)
7. WarmNewsletterFooter
8. SiteFooter
```

**CuratedTourCard Redesign:**
```
Structure:
- Tour image (4:3 ratio)
- Badge: "Private Available" / "Family Friendly" / "Food Lover"
- Tour title
- Short excerpt (1 line)
- Duration tag
- Location tag
- Price
- CTA: "View Details"

Visual:
- White card background
- Rounded corners (--radius-lg)
- Subtle shadow (--shadow-base)
- Hover: Shadow increase + slight lift
- Orange accent for CTA button

Labels (lightweight, inferred from ProductTag):
- "Best for families" (if has family tag)
- "Food lover favorite" (if has food tag)
- "Private-friendly" (if customizable)

DO NOT SHOW:
❌ Fake ratings (no stars if no real reviews)
❌ Fake supplier names
❌ Fake sales numbers ("1,234 sold")
❌ Fake urgency ("Only 2 spots left")
```

**Card Layout:**
- 4 columns desktop (compact)
- 3 columns tablet
- 1 column mobile (full-width cards)

**Primary CTAs:**
- "View Details" on each card → `/tours/[id]`
- Section CTAs: "View All Food Tours" → `/tours?tag=food`
- "Try AI Planner"
- "Explore Destinations"

**Mobile Layout:**
- Filter bar: Collapsible drawer
- Single-column card stack
- Sticky mobile filter button
- Lazy loading for performance

**Features to Preserve:**
```
✅ ProductTag filtering (`/tours?tag=food`)
✅ Link to product detail pages (`/tours/[id]`)
✅ Real BokunProduct data
✅ Existing API endpoint (`/api/products`)
✅ Price display
✅ Duration display
✅ Location display
```

**Critical Safety Rules:**
```
✅ Only show real BokunProduct inventory
✅ Only show Thailand tours (for now)

❌ Do NOT add fake products
❌ Do NOT add affiliate products
❌ Do NOT show fake reviews
❌ Do NOT show fake ratings
```

---

### 3.5 Tour Detail Page (`/tours/[id]`)

**Page Goal:**
Professional product detail page that feels like premium DMC booking experience, not cheap affiliate listing.

**First Screen Structure:**
```
1. TourHero
   - Large image gallery (hero image + 4-6 additional)
   - Badge: "Verified Bókun Partner"
   - Tour title
   - Location + Duration
   - Price
   - CTA: "Check Availability" (links to existing booking flow)

2. Quick Facts Bar
   - Duration icon + time
   - Group size icon + capacity
   - Difficulty icon + level
   - Language icon + languages
```

**Main Module Order:**
```
1. TourHero + Image Gallery
2. Quick Facts Bar
3. Two-Column Layout (Desktop)
   
   Left Column (Main Content):
   - Tour Overview (description)
   - What's Included
   - Itinerary (if multi-activity)
   - Meeting Point
   - What to Bring
   - Cancellation Policy
   - FAQAccordion (tour-specific)
   
   Right Column (Booking Sidebar - Sticky):
   - Price display
   - Date selector (existing Bókun availability)
   - Group size selector
   - "Check Availability" CTA
   - "Request Private Tour" CTA
   - Safety badges:
     * "Verified Supplier"
     * "Real-time Availability"
     * "Secure Booking"

4. Related Tours Section
   - "More experiences in [Location]"
   - 4 related tours (same destination or category)

5. Destination Context
   - "Explore more in [Destination]"
   - Link to destination page
   - Link to all tours in destination

6. WarmNewsletterFooter
7. SiteFooter
```

**Mobile Layout:**
- Image gallery: Swipeable carousel
- Single-column stack
- Booking sidebar becomes bottom sheet
- Sticky "Check Availability" button at bottom

**Features to Preserve:**
```
✅ Existing Bókun availability check
✅ Existing booking flow (redirect to Bókun)
✅ Real product data (title, description, price)
✅ Real supplier verification
✅ Link back to `/tours`
✅ Link to destination page

DO NOT MODIFY:
❌ apps/web/app/booking/*
❌ apps/web/app/pricing/*
❌ apps/web/lib/bokunAvailability.ts
❌ apps/web/app/api/bokun/availability/*
❌ Booking inquiry API
```

**Critical Safety Rules:**
```
✅ Only show real BokunProduct data
✅ Keep existing Bókun booking integration

❌ Do NOT add fake reviews section
❌ Do NOT add fake ratings
❌ Do NOT promise instant booking if not available
❌ Do NOT modify checkout flow
❌ Do NOT add payment processing
```

---

### 3.6 Itinerary Pages (`/itineraries/[slug]`)

**Page Goal:**
Showcase AI-generated or curated multi-day itineraries that link to real bookable tours (Thailand) or show coming soon notice (other destinations).

**First Screen Structure:**
```
1. ItineraryHero
   - Destination image
   - Script label: "AI-Curated Itinerary"
   - Itinerary title: "4 Days in Chiang Mai: Culture & Adventure"
   - Days: 4 | Destinations: 1 | Experiences: 6
   - CTA: "View Full Itinerary"

2. Itinerary Overview Card
   - Best for: Families, First-timers, Culture lovers
   - Trip style: Moderate activity, Cultural immersion
   - Estimated budget per person (if calculated)
```

**Main Module Order (Live Destination - Thailand):**
```
1. ItineraryHero
2. Itinerary Overview
3. Day-by-Day Itinerary
   
   Day 1 Card:
   - Day number + title
   - Morning / Afternoon / Evening structure
   - Linked tour card (if booking available)
   - Activity description (if no tour)
   - Map icon + location
   
   Day 2 Card: (same structure)
   Day 3 Card: (same structure)
   Day 4 Card: (same structure)

4. Matching Bókun Partner Tours
   - "Bookable experiences in this itinerary"
   - CuratedTourCard grid
   - Links to actual Thailand tours
   - CTA: "View All [Destination] Tours"

5. Private Custom Travel Option
   - EditorialBanner
   - "Want a custom version of this itinerary?"
   - "Contact our destination experts"
   - CTA: "Request Custom Trip" → mailto:hello@radarscout.io

6. Itinerary Customization Tips
   - How to adapt this itinerary
   - Alternative experiences
   - Budget adjustments

7. Related Itineraries
   - 3 similar itineraries
   
8. FAQAccordion
9. WarmNewsletterFooter
10. SiteFooter
```

**Main Module Order (Coming Soon Destination):**
```
1. ItineraryHero
2. PartnerInventoryNotice (prominent)
   - "Partner tours for this route are coming soon"
   - "This is an AI-generated itinerary based on travel research"
   - "We're onboarding Bókun suppliers in [Destination]"
   - Email signup: "Notify me when tours are available"

3. Day-by-Day Itinerary (concept only, no booking links)
4. Experience Types Recommended (no specific products)
5. Why We're Excited About This Destination
6. SupplierPartnerCTA
7. Explore Live Itineraries
   - "Explore bookable itineraries in Thailand"
   - Link to Thailand itineraries
8. FAQAccordion
9. WarmNewsletterFooter
10. SiteFooter
```

**Mobile Layout:**
- Hero height: 50vh
- Day cards: Full-width stack
- Tour cards: Single column
- Sticky "View Tours" CTA (live) or "Notify Me" (coming soon)

**Features to Preserve:**
```
✅ Link to `/tours` for Thailand itineraries
✅ AI Planner logic (existing static demo)
✅ Real BokunProduct integration for Thailand

DO NOT MODIFY:
❌ AI Planner backend logic (if it exists)
❌ Booking flow
```

**Critical Safety Rules:**
```
✅ Thailand itineraries can link to real tours
✅ Non-Thailand must show "coming soon" notice
✅ Can show conceptual day-by-day structure

❌ Do NOT link to Viator/GetYourGuide tours
❌ Do NOT show fake bookable tours for coming soon destinations
❌ Do NOT promise booking for unavailable destinations
❌ Do NOT scrape competitor itineraries
```

---

### 3.7 AI Trip Planner Page (`/ai-trip-planner`)

**Page Goal:**
Interactive demo of AI itinerary matching that feels premium and trustworthy, not generic AI template.

**First Screen Structure:**
```
1. AI Planner Hero
   - Script label: "AI-Powered Planning"
   - Title: "Your Personal Trip Planner"
   - Subtitle: "Tell us your travel style, we'll match you with curated experiences"
   - Visual: Illustration or photo of trip planning
   - CTA: "Start Planning"

2. How It Works (3 steps)
   - Step 1: Share your preferences (destination, dates, interests)
   - Step 2: AI matches you with partner tours
   - Step 3: Review and book your perfect itinerary
```

**Main Module Order:**
```
1. AI Planner Hero
2. How It Works
3. PlannerDemo (interactive form)
   
   Form Fields:
   - Destination selector (Thailand + coming soon)
   - Travel dates (date picker)
   - Trip duration (days)
   - Travel style (luxury, mid-range, budget, backpacker)
   - Interests (multi-select tags)
   - Special requests (textarea)
   - CTA: "Generate Itinerary"

4. Demo Results Section (after form submission)
   - Generated itinerary preview
   - Matching tours (if Thailand)
   - Coming soon notice (if other destination)
   - CTA: "View Full Itinerary" or "Notify Me"

5. AI Technology Explanation
   - "How our AI recommendation works"
   - Based on destination expertise
   - Powered by verified supplier inventory
   - Human-curated quality control

6. Sample Itineraries
   - "Get inspired by these itineraries"
   - 4 pre-made itinerary cards
   - Link to `/itineraries/[slug]`

7. Testimonials (if available)
8. FAQAccordion (AI FAQ)
9. WarmNewsletterFooter
10. SiteFooter
```

**Mobile Layout:**
- Form: Single-column stack
- Date picker: Mobile-optimized
- Results: Full-width cards
- Sticky "Generate Itinerary" button

**Features to Preserve:**
```
✅ Existing AI Planner demo logic
✅ Link to `/itineraries/[slug]`
✅ Link to `/tours` for Thailand

DO NOT MODIFY:
❌ apps/web/app/ai-trip-planner/PlannerDemo.tsx (unless UI only)
❌ Any backend AI logic
❌ Booking flow
```

**Critical Safety Rules:**
```
✅ Can show AI-generated itinerary concepts
✅ Can link to real Thailand tours
✅ Must show "coming soon" for non-Thailand

❌ Do NOT promise booking for unavailable destinations
❌ Do NOT link to fake products
❌ Do NOT call external AI APIs without approval
❌ Do NOT train on competitor data
```

---

### 3.8 Partners Page (`/partners`)

**Page Goal:**
Static supplier partnership page that explains how local tour operators can join RadarScout's Bókun network.

**First Screen Structure:**
```
1. PartnerHero
   - Script label: "Join Our Network"
   - Title: "Partner with RadarScout"
   - Subtitle: "Reach travelers through our AI-powered destination portal"
   - Image: Handshake, local guide, tour operator
   - CTA: "Learn More" (scroll to benefits)
```

**Main Module Order:**
```
1. PartnerHero
2. Why Partner with RadarScout
   - "We're building a selective network of trusted local operators"
   - "Not a generic aggregator—a curated DMC marketplace"
   - "AI-powered promotion for your best tours"

3. How RadarScout Promotes Your Tours (4 touchpoints)
   - Destination Pages (featured placement)
   - Itinerary Pages (AI matching)
   - Curated Day Tour Search (category prominence)
   - Private Custom Trip Requests (direct referrals)

4. What We Look For in Partners
   - Verified Bókun supplier account
   - Reliable local operations
   - Quality experiences (not just quantity)
   - Responsive customer service
   - Competitive pricing

5. Destinations We're Expanding To
   - Current: Thailand (live)
   - Next: Barcelona, Lisbon, Bali, Mexico City, Tokyo, NYC, etc.
   - "We selectively expand into top travel destinations"
   - "We're not trying to list every tour worldwide"

6. How to Connect Through Bókun
   - Step 1: Create Bókun supplier account
   - Step 2: List your tours on Bókun
   - Step 3: Apply to RadarScout network
   - Step 4: Get featured on our portal

7. Partner Success Stories (if available)
   - 2-3 testimonials from Thailand suppliers
   - Photo + quote + supplier name

8. Contact CTA
   - "Ready to partner with RadarScout?"
   - CTA: "Email Us" → mailto:hello@radarscout.io
   - Contact info:
     * Email: hello@radarscout.io
     * Subject line suggestion: "Bókun Supplier Partnership Inquiry"

9. FAQAccordion (Partnership FAQ)
   - "What is Bókun?"
   - "Do you charge commission?"
   - "How long does onboarding take?"
   - "Can I join if I'm not on Bókun yet?"
   - "Which destinations are you prioritizing?"

10. WarmNewsletterFooter
11. SiteFooter
```

**Mobile Layout:**
- Single-column stack
- Larger CTA buttons
- Email link works on mobile

**Features to Preserve:**
```
✅ Static page (no backend form)
✅ mailto: link for contact

DO NOT CREATE:
❌ Backend partner application form
❌ Database writes
❌ Email sending automation
```

**Critical Safety Rules:**
```
✅ Can explain Bókun partnership model
✅ Can list destination expansion plans
✅ Can show contact email

❌ Do NOT build backend form submission
❌ Do NOT write to database
❌ Do NOT send automated emails
❌ Do NOT promise specific commission rates (legal issue)
❌ Do NOT overpromise worldwide coverage
```

---

## 4. Component Plan

### 4.1 AdventureHero

**Purpose:**  
Full-width hero section for homepage and major landing pages with adventure travel aesthetic.

**Visual Style:**
- Background: Large atmospheric photo (destination, activity, landscape)
- Overlay: Semi-transparent dark gradient (bottom-to-top fade)
- Typography: Bold heading + script label accent
- Layout: Centered content with generous padding
- CTA: Orange primary button + ghost secondary button

**Props:**
```typescript
interface AdventureHeroProps {
  backgroundImage: string;
  scriptLabel?: string;      // e.g., "Powered by AI + Local Experts"
  title: string;              // Large bold headline
  subtitle?: string;          // Supporting text
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  height?: 'full' | 'large' | 'medium';  // 100vh | 80vh | 60vh
}
```

**Usage:**
- Homepage hero
- Destination page hero
- Partners page hero
- AI Planner hero

**Responsive:**
- Desktop: Full-width, content max-width 720px centered
- Mobile: Height reduced to 70vh, font sizes scaled down

---

### 4.2 ScriptLabel

**Purpose:**  
Decorative hand-written style label for section accents and personal curation touch.

**Visual Style:**
- Font: Script font (Caveat, Dancing Script)
- Color: Orange accent or muted text
- Size: Small (14-16px)
- Position: Usually above main headings
- Optional: Small decorative underline or flourish

**Props:**
```typescript
interface ScriptLabelProps {
  children: React.ReactNode;
  color?: 'orange' | 'muted';
  align?: 'left' | 'center' | 'right';
  className?: string;
}
```

**Usage:**
- Hero sections ("Powered by AI")
- Section headings ("Curated by Experts")
- Card labels ("Top Pick")
- CTA sections ("Your Journey Starts Here")

---

### 4.3 DestinationCapsuleCard

**Purpose:**  
Tall portrait card for destination showcase with prominent image and status badge.

**Visual Style:**
- Image: Tall portrait ratio (2:3 or 3:4)
- Overlay: Bottom gradient for text readability
- Badge: Top-right corner (Live/Coming Soon)
- Content: Destination name, country, product count
- Hover: Scale 1.05, shadow increase
- Border: Rounded corners (--radius-xl)

**Props:**
```typescript
interface DestinationCapsuleCardProps {
  slug: string;
  name: string;
  country: string;
  image: string;
  status: 'live' | 'coming-soon';
  productCount?: number;      // Only if live
  aiPlanningAvailable?: boolean;
  bestForTags?: string[];     // e.g., ["Food & Culture", "Adventure"]
  worldCup2026?: boolean;
}
```

**Usage:**
- Homepage destination carousel
- Destinations index page grid
- Related destinations sections

**Responsive:**
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column (full-width)

---

### 4.4 ExperienceCategoryGrid

**Purpose:**  
Icon-based category grid for experience types (Food, Adventure, Private, etc.).

**Visual Style:**
- Grid: 6 columns desktop, 3 tablet, 2 mobile
- Cards: Light background, icon + label
- Icon: Large custom icon or emoji
- Hover: Background darkens, slight scale
- Border: Subtle border, rounded corners

**Props:**
```typescript
interface ExperienceCategoryGridProps {
  categories: Array<{
    id: string;
    name: string;
    icon: string;          // Icon name or emoji
    slug: string;          // For filtering (/tours?category=food)
    productCount?: number; // Optional count
  }>;
  destination?: string;    // Optional destination filter
}
```

**Usage:**
- Homepage (global categories)
- Destination pages (destination-specific categories)
- Tours page (filterable categories)

---

### 4.5 CuratedTourCard

**Purpose:**  
Premium tour/product card for catalog and collection sections.

**Visual Style:**
- Image: 4:3 ratio, fills card top
- Badge: Top-left corner (Private, Family, etc.)
- Content: White card background, padding
- Title: Bold, 2 lines max with ellipsis
- Metadata: Duration, location icons
- Price: Bottom of card, prominent
- CTA: "View Details" button (orange)
- Shadow: Subtle, increases on hover
- Border: Rounded corners

**Props:**
```typescript
interface CuratedTourCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image: string;
  price: string;
  currency: string;
  duration?: string;
  location?: string;
  tags?: string[];        // For badge generation
  badges?: string[];      // Pre-computed: "Private", "Family Friendly"
}
```

**Usage:**
- Homepage tour sections
- Tours catalog page
- Destination page tour sections
- Related tours sections
- Itinerary matching tours

**Badge Logic (inferred from ProductTag):**
```typescript
// Example badge inference
if (tags.includes('family')) badge = "Family Friendly";
if (tags.includes('food')) badge = "Food Lover";
if (tags.includes('private')) badge = "Private Available";
```

**Responsive:**
- Desktop: 4 columns
- Tablet: 2-3 columns
- Mobile: 1 column (full-width)

---

### 4.6 DmcTrustBar

**Purpose:**  
Horizontal trust indicators bar showing key metrics and features.

**Visual Style:**
- Layout: Horizontal row of 3-5 items
- Background: Muted beige or white
- Icons: Small icon + text
- Separator: Subtle vertical divider between items
- Typography: Small, medium weight

**Props:**
```typescript
interface DmcTrustBarProps {
  items: Array<{
    icon: string;
    text: string;
  }>;
  variant?: 'default' | 'compact';
}
```

**Example Items:**
```
- "300+ Thailand Tours"
- "Verified Bókun Suppliers"
- "AI Itinerary Matching"
- "Real-time Availability"
- "Secure Booking"
```

**Usage:**
- Below hero sections (homepage, destinations)
- Tours page header
- Product detail pages
- Partners page

**Responsive:**
- Desktop: Horizontal row
- Mobile: Horizontal scroll or 2-row stack

---

### 4.7 PartnerInventoryNotice

**Purpose:**  
Prominent notice for coming soon destinations, explaining Bókun supplier expansion.

**Visual Style:**
- Background: Light orange or muted beige
- Border: Optional orange left border
- Icon: Info icon or partner icon
- Typography: Clear, readable
- CTA: "Notify Me" button or "Learn More"
- Optional: Email signup inline form

**Props:**
```typescript
interface PartnerInventoryNoticeProps {
  destination?: string;     // Specific destination or general
  message: string;
  showEmailSignup?: boolean;
  ctaText?: string;
  ctaHref?: string;
  variant?: 'prominent' | 'subtle';
}
```

**Usage:**
- Coming soon destination pages (prominent)
- Homepage coming soon section (subtle)
- Tours page footer (subtle)
- Itinerary pages for non-live destinations (prominent)

**Responsive:**
- Full-width on all devices
- Email form: Stacks vertically on mobile

---

### 4.8 EditorialBanner

**Purpose:**  
Large horizontal CTA banner with image and text, editorial magazine style.

**Visual Style:**
- Layout: Side-by-side image and content (desktop)
- Image: Large, 50% width, covers left or right side
- Content: Centered in remaining 50%, generous padding
- Background: Can alternate between image left/right per section
- CTA: Large orange button
- Border: Rounded corners

**Props:**
```typescript
interface EditorialBannerProps {
  image: string;
  imagePosition: 'left' | 'right';
  scriptLabel?: string;
  title: string;
  description?: string;
  cta: {
    text: string;
    href: string;
  };
  backgroundColor?: string;  // Background behind content side
}
```

**Usage:**
- Homepage AI planner CTA
- Mid-page breaks on long pages
- Destination page AI planning section
- Partners page CTA section

**Responsive:**
- Desktop: Side-by-side
- Mobile: Image on top, content below, full-width

---

### 4.9 TourCollectionSection

**Purpose:**  
Organized section of tour cards with heading and optional filter/CTA.

**Visual Style:**
- Header: Script label + bold title
- Optional: Category filter pills
- Grid: 4 columns desktop, responsive
- Footer: "View All" CTA if truncated

**Props:**
```typescript
interface TourCollectionSectionProps {
  scriptLabel?: string;
  title: string;
  description?: string;
  tours: CuratedTourCardProps[];
  limit?: number;           // Show only X cards, add "View All"
  viewAllHref?: string;     // "View All" link
  showFilters?: boolean;    // Optional category filters
}
```

**Usage:**
- Homepage featured tours
- Tours page category sections
- Destination page tour sections
- Related tours sections

---

### 4.10 TestimonialBand

**Purpose:**  
Horizontal testimonial section with traveler stories and photos.

**Visual Style:**
- Background: Warm muted beige or white
- Layout: Alternating image and quote (desktop)
- Image: Circular or rounded rectangle traveler photo
- Quote: Large quote marks, italic text
- Attribution: Name, location, trip type
- Navigation: Dots or arrows for multiple testimonials

**Props:**
```typescript
interface TestimonialBandProps {
  testimonials: Array<{
    id: string;
    quote: string;
    author: string;
    location?: string;
    tripType?: string;
    image?: string;
  }>;
  autoplay?: boolean;
}
```

**Usage:**
- Homepage testimonials section
- Destination pages (destination-specific testimonials)
- About page

**Responsive:**
- Desktop: Image + quote side-by-side
- Mobile: Stacked vertically

---

### 4.11 GuideBlogCard

**Purpose:**  
Blog/guide article card for content sections.

**Visual Style:**
- Image: 16:9 ratio, top of card
- Content: White background, padding
- Meta: Date, category, read time
- Title: Bold, 2-3 lines
- Excerpt: 2 lines with ellipsis
- CTA: "Read More" link (not button)
- Border: Subtle, rounded corners

**Props:**
```typescript
interface GuideBlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  category?: string;
  readTime?: string;
}
```

**Usage:**
- Homepage blog section
- Destination pages (related guides)
- Blog index page

**Responsive:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

---

### 4.12 SupplierPartnerCTA

**Purpose:**  
Call-to-action section for supplier partnership recruitment.

**Visual Style:**
- Background: Orange accent or muted beige
- Layout: Centered content
- Icon: Handshake or partner icon
- Typography: Bold headline
- CTA: "Learn More" or "Become a Partner" button
- Optional: Background pattern or image

**Props:**
```typescript
interface SupplierPartnerCTAProps {
  title: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  variant?: 'prominent' | 'subtle';
}
```

**Usage:**
- Homepage bottom section
- Destinations page footer
- Coming soon destination pages
- Tours page footer

**Responsive:**
- Full-width on all devices
- Content max-width constrained

---

### 4.13 WarmNewsletterFooter

**Purpose:**  
Newsletter signup section with warm brand aesthetic, above main footer.

**Visual Style:**
- Background: Warm beige or light orange
- Layout: Centered content
- Icon: Envelope or travel icon
- Form: Email input + submit button (inline)
- Typography: Friendly, inviting
- Border: Optional decorative top border

**Props:**
```typescript
interface WarmNewsletterFooterProps {
  title: string;
  description: string;
  placeholder?: string;
  submitText?: string;
}
```

**Usage:**
- Every major page above site footer

**Responsive:**
- Desktop: Inline form
- Mobile: Stacked form (input full-width, button below)

**Note:**
```
Static UI only. Do NOT implement:
❌ Backend email submission
❌ Database writes
❌ Email service integration
```

---

### 4.14 FAQAccordion

**Purpose:**  
Expandable FAQ section for common questions.

**Visual Style:**
- Layout: Vertical stack of accordion items
- Item: Question (bold) + expand icon
- Expanded: Answer text revealed with smooth animation
- Border: Subtle border between items
- Hover: Background lightens

**Props:**
```typescript
interface FAQAccordionProps {
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  defaultOpen?: number;  // Index of default open item
}
```

**Usage:**
- Homepage FAQ section
- Destination pages
- Tours page
- Itinerary pages
- Partners page
- AI Planner page

**Responsive:**
- Full-width on all devices
- Touch-friendly tap targets on mobile

---

### 4.15 StickyMobileCTA

**Purpose:**  
Sticky bottom CTA bar for mobile devices with primary action.

**Visual Style:**
- Position: Fixed bottom, full-width
- Background: White with shadow
- Button: Full-width orange CTA
- Height: Compact (60-70px)
- Z-index: High (above page content)

**Props:**
```typescript
interface StickyMobileCTAProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  showOnMobileOnly?: boolean;
}
```

**Usage:**
- Tours catalog page ("Explore Tours")
- Destination pages ("View Tours" or "Notify Me")
- Itinerary pages ("View Matching Tours")
- Product detail pages ("Check Availability")

**Responsive:**
- Mobile only (hidden on desktop)

---

## 5. Current RadarScout Feature Preservation

### 5.1 Database & Backend (DO NOT MODIFY)

```
✅ MUST PRESERVE:

Database:
- packages/db/prisma/schema.prisma
- packages/db/prisma/migrations/*
- BokunProduct model
- ProductTag model
- BokunSupplier model
- All existing relationships

Server:
- server/* (all sync scripts)
- server/bokun/product-sync.js
- server/bokun/supplier-sync.js
- server/bokun/tag-engine.js (if exists)
- server/bokun/tag-report.js (if exists)
- server/bokun/api-client.js

APIs:
- apps/web/app/api/products/*
- apps/web/app/api/booking-inquiries/*
- apps/web/app/api/bokun/availability/*
- apps/web/middleware.ts

Booking:
- apps/web/app/booking/*
- apps/web/app/pricing/*
- apps/web/lib/bokunAvailability.ts

Config:
- pnpm-lock.yaml
- pnpm-workspace.yaml
```

### 5.2 Frontend Features (PRESERVE FUNCTIONALITY)

```
✅ MUST PRESERVE:

Thailand Live Inventory:
- 300+ real BokunProduct records
- ProductTag filtering system
- /tours page with tag filters (/tours?tag=food)
- Product detail pages (/tours/[id])
- Real prices, durations, locations
- Bókun supplier verification

API Integration:
- /api/products endpoint
- Query parameters: ?tag=, ?destination=, ?limit=
- Response structure
- Pagination (if exists)

Navigation:
- /tours (main catalog)
- /tours/[id] (product detail)
- /destinations
- /destinations/[slug]
- /itineraries/[slug]
- /ai-trip-planner
- /partners

Existing Components (if they exist):
- Product card component
- Filter components
- Tag components
- Navigation components
```

### 5.3 Coming Soon Destinations (PRESERVE MESSAGING)

```
✅ MUST PRESERVE:

Transparency:
- "Partner tours coming soon" messaging
- "We're onboarding Bókun suppliers" explanation
- No fake products for non-Thailand destinations
- Clear status badges (Live vs. Coming Soon)

Email Notifications:
- "Notify Me When Available" CTAs (static UI only)
- No backend form submission required

Cross-sell:
- "Explore Thailand tours while you wait"
- Links to live inventory
```

### 5.4 AI Planner (PRESERVE DEMO LOGIC)

```
✅ MUST PRESERVE:

If apps/web/app/ai-trip-planner/PlannerDemo.tsx exists:
- Keep existing demo logic
- Keep existing form structure
- Keep existing result display
- Only modify visual presentation (CSS, layout)

Static Itineraries:
- If apps/web/lib/itineraries.ts exists, preserve data structure
- Only enhance visual presentation
```

---

## 6. Safety Rules for Implementation

### 6.1 Absolute Prohibitions

```
❌ NEVER MODIFY:

Database & Schema:
- packages/db/prisma/schema.prisma
- packages/db/prisma/migrations/*
- Any Prisma model definitions
- Any database relationships

Server & Sync:
- server/* (all files)
- Bókun API integration
- Product sync logic
- Supplier sync logic
- Tag engine logic

API Endpoints:
- apps/web/app/api/* (all backend API routes)
- Request/response structures
- Authentication logic
- Rate limiting

Booking Flow:
- apps/web/app/booking/*
- apps/web/app/pricing/*
- apps/web/lib/bokunAvailability.ts
- Availability checking
- Pricing calculations
- Checkout logic

Config Files:
- pnpm-lock.yaml
- pnpm-workspace.yaml
- .env files
- Middleware configuration
```

### 6.2 Prohibited Actions

```
❌ NEVER DO:

Database:
- Run migrations (npx prisma migrate)
- Create new models
- Alter existing models
- Write to database from frontend
- Delete records

Backend:
- Add new API routes
- Modify existing API logic
- Call Bókun API directly from frontend
- Implement real booking submission
- Implement real payment processing
- Implement real email sending

Data:
- Add fake products
- Add Viator/GetYourGuide/Klook products
- Add affiliate products
- Add fake reviews
- Add fake ratings
- Add fake supplier names
- Add fake sales numbers
- Scrape competitor data

Deployment:
- Deploy to production
- Commit to git (report changes only)
- Push to remote
- Create pull requests
```

### 6.3 Allowed Modifications

```
✅ ALLOWED (Frontend/Static Only):

Page Components:
- apps/web/app/page.tsx (homepage)
- apps/web/app/destinations/page.tsx
- apps/web/app/destinations/[slug]/page.tsx
- apps/web/app/tours/page.tsx
- apps/web/app/tours/[id]/page.tsx
- apps/web/app/itineraries/[slug]/page.tsx
- apps/web/app/ai-trip-planner/page.tsx
- apps/web/app/ai-trip-planner/PlannerDemo.tsx (UI only)
- apps/web/app/partners/page.tsx (create new)

Shared Components:
- apps/web/app/_components/* (UI components)
- apps/web/app/_components/SiteNav.tsx
- apps/web/app/_components/SiteFooter.tsx
- apps/web/app/_components/InventoryAlert.tsx

Styles:
- apps/web/app/globals.css
- apps/web/tailwind.config.ts (if needed)
- Component-level CSS modules

Static Data:
- apps/web/lib/global-destinations.ts
- apps/web/lib/itineraries.ts (structure only, not database)

Documentation:
- docs/dmc-portal-strategy.md (create new)
- docs/supplier-onboarding-playbook.md (create new)
- docs/radarscout-ui-redesign-plan.md (this document)

Allowed Changes:
- HTML structure (non-functional)
- CSS styling
- Layout components
- Visual hierarchy
- Typography
- Colors
- Spacing
- Images (placeholders only)
- Static copy/text
- Component props (UI only)
- Responsive design
```

### 6.4 Verification Requirements

```
✅ MUST VERIFY AFTER EACH CHANGE:

Build Check:
- pnpm --filter @reddit-monitor/web exec tsc --noEmit
- Must pass with 0 errors

AI Safety Check:
- pnpm ai:checks
- Must pass all safety checks

Manual Testing:
- /tours page loads
- /tours?tag=food filters work
- /tours/[id] detail pages load
- Thailand product data displays correctly
- No console errors in browser
- Mobile responsive
- No broken links

Data Integrity:
- Thailand products still display (300+)
- Product prices display correctly
- Product tags still work
- Filtering still works
- No fake products appear
- Coming soon destinations show correct messaging
```

---

## 7. Implementation Phases

### Phase UI-1: Design Tokens + Shared Components

**Duration:** Week 1

**Goal:**  
Establish design system foundation and create reusable components WITHOUT modifying any pages yet.

**Allowed Files:**
```
✅ CREATE/MODIFY:

Design Tokens:
- apps/web/app/globals.css (add design tokens)
- apps/web/tailwind.config.ts (if needed for custom colors)

Shared Components (CREATE NEW):
- apps/web/app/_components/AdventureHero.tsx
- apps/web/app/_components/ScriptLabel.tsx
- apps/web/app/_components/DestinationCapsuleCard.tsx
- apps/web/app/_components/ExperienceCategoryGrid.tsx
- apps/web/app/_components/CuratedTourCard.tsx
- apps/web/app/_components/DmcTrustBar.tsx
- apps/web/app/_components/PartnerInventoryNotice.tsx
- apps/web/app/_components/EditorialBanner.tsx
- apps/web/app/_components/TourCollectionSection.tsx
- apps/web/app/_components/TestimonialBand.tsx
- apps/web/app/_components/GuideBlogCard.tsx
- apps/web/app/_components/SupplierPartnerCTA.tsx
- apps/web/app/_components/WarmNewsletterFooter.tsx
- apps/web/app/_components/FAQAccordion.tsx
- apps/web/app/_components/StickyMobileCTA.tsx

Documentation:
- docs/radarscout-ui-redesign-plan.md (this file)
```

**Prohibited Files:**
```
❌ DO NOT MODIFY:

- apps/web/app/page.tsx (not yet)
- apps/web/app/destinations/* (not yet)
- apps/web/app/tours/* (not yet)
- Any API routes
- Any server files
- Any Prisma files
```

**Tasks:**

1. **Add Design Tokens to globals.css**
   ```css
   /* Add CSS custom properties from Section 2 */
   :root {
     --color-accent-orange: #ff9933;
     /* ... all tokens ... */
   }
   ```

2. **Create Each Component (15 total)**
   - Create TypeScript component file
   - Define props interface
   - Implement visual design
   - Add responsive styles
   - Export component

3. **Create Component Storybook Page (Optional)**
   - Create `apps/web/app/components-showcase/page.tsx`
   - Display all components with sample data
   - Manual visual testing page

**Verification:**
```bash
# TypeScript check
pnpm --filter @reddit-monitor/web exec tsc --noEmit

# Build check
pnpm --filter @reddit-monitor/web build

# Safety check
pnpm ai:checks

# Manual check
# Visit http://localhost:3000/components-showcase
# Verify all components render correctly
```

**Success Criteria:**
- [ ] All 15 components created
- [ ] Design tokens added to globals.css
- [ ] TypeScript compilation succeeds
- [ ] No console errors
- [ ] Components display correctly in showcase page
- [ ] Mobile responsive
- [ ] No existing pages broken

---

### Phase UI-2: Homepage + Destinations

**Duration:** Week 2

**Goal:**  
Transform homepage and destination pages into premium DMC portal.

**Allowed Files:**
```
✅ MODIFY:

Homepage:
- apps/web/app/page.tsx

Destinations:
- apps/web/app/destinations/page.tsx
- apps/web/app/destinations/[slug]/page.tsx

Static Data:
- apps/web/lib/global-destinations.ts (if not exists, create)

Shared Components (if needed):
- apps/web/app/_components/SiteNav.tsx (minor updates)
```

**Prohibited Files:**
```
❌ DO NOT MODIFY:

- apps/web/app/tours/* (not yet)
- apps/web/app/itineraries/* (not yet)
- apps/web/app/ai-trip-planner/* (not yet)
- Any API routes
- Any server files
```

**Tasks:**

1. **Update Homepage (`apps/web/app/page.tsx`)**
   - Replace current hero with AdventureHero
   - Add DmcTrustBar
   - Add "How RadarScout Works" section
   - Add DestinationCapsuleCarousel
   - Add ExperienceCategoryGrid
   - Add TourCollectionSection (Thailand tours)
   - Add EditorialBanner (AI planner CTA)
   - Add PartnerInventoryNotice (coming soon)
   - Add TestimonialBand
   - Add SupplierPartnerCTA
   - Add WarmNewsletterFooter
   - Preserve all existing links and functionality

2. **Update Destinations Index (`apps/web/app/destinations/page.tsx`)**
   - Add page hero
   - Add DmcTrustBar
   - Add filter pills (if > 15 destinations)
   - Update to use DestinationCapsuleCard grid
   - Add PartnerInventoryNotice
   - Add FAQAccordion
   - Add SupplierPartnerCTA

3. **Update Destination Detail (`apps/web/app/destinations/[slug]/page.tsx`)**
   - Add DestinationHero
   - Add DmcTrustBar (destination-specific)
   - Add "Destination Expert Portal" section
   - Add ExperienceCategoryGrid (destination-specific)
   - Add TourCollectionSection (for Thailand) OR PartnerInventoryNotice (for coming soon)
   - Add EditorialBanner (AI planner)
   - Add DestinationGuide section
   - Add FAQAccordion
   - Preserve link to `/tours?destination=[slug]` for Thailand

4. **Create/Update Global Destinations Data**
   ```typescript
   // apps/web/lib/global-destinations.ts
   export const GLOBAL_DESTINATIONS = [
     {
       slug: 'chiang-mai',
       name: 'Chiang Mai',
       country: 'Thailand',
       status: 'live',
       productCount: 87,
       // ... metadata
     },
     {
       slug: 'barcelona',
       name: 'Barcelona',
       country: 'Spain',
       status: 'coming-soon',
       // ... metadata
     },
     // ... 15 destinations
   ];
   ```

**Verification:**
```bash
# TypeScript check
pnpm --filter @reddit-monitor/web exec tsc --noEmit

# Safety check
pnpm ai:checks

# Manual testing:
# 1. Visit http://localhost:3000
#    - Verify new hero displays
#    - Verify all sections display
#    - Verify links to /tours work
#    - Verify links to /destinations work
#    - Verify links to /ai-trip-planner work
#    - Verify mobile responsive

# 2. Visit http://localhost:3000/destinations
#    - Verify destination grid displays
#    - Verify Thailand shows live badge + product count
#    - Verify non-Thailand shows coming soon badge
#    - Verify destination links work

# 3. Visit http://localhost:3000/destinations/chiang-mai
#    - Verify hero displays
#    - Verify tours section displays real products
#    - Verify link to /tours?destination=chiang-mai works

# 4. Visit http://localhost:3000/destinations/barcelona
#    - Verify hero displays
#    - Verify "coming soon" notice displays
#    - Verify NO fake products display
#    - Verify supplier partner CTA displays
```

**Success Criteria:**
- [ ] Homepage transformed with new design
- [ ] Destinations index transformed
- [ ] Destination detail pages work for both live and coming soon
- [ ] Thailand products display correctly
- [ ] No fake products for coming soon destinations
- [ ] All links work
- [ ] TypeScript compilation succeeds
- [ ] Mobile responsive
- [ ] No existing tours functionality broken

---

### Phase UI-3: Tours + Tour Detail

**Duration:** Week 3

**Goal:**  
Transform tours catalog and detail pages into curated marketplace.

**Allowed Files:**
```
✅ MODIFY:

Tours:
- apps/web/app/tours/page.tsx
- apps/web/app/tours/[id]/page.tsx (if exists)

Components (if needed):
- apps/web/app/_components/TourDetailHero.tsx (create if needed)
- apps/web/app/_components/BookingSidebar.tsx (create if needed, UI only)
```

**Prohibited Files:**
```
❌ DO NOT MODIFY:

- apps/web/app/booking/* (preserve existing booking flow)
- apps/web/app/pricing/*
- apps/web/lib/bokunAvailability.ts
- apps/web/app/api/bokun/availability/*
- Any backend logic
```

**Tasks:**

1. **Update Tours Catalog (`apps/web/app/tours/page.tsx`)**
   - Add page hero (medium height)
   - Add filter bar (sticky)
   - Add DmcTrustBar
   - Add TourCollectionSection for each category:
     * Featured Tours
     * Food & Culture
     * Nature & Adventure
     * Private Experiences
     * Family Friendly
   - Add EditorialBanner (AI planner CTA, mid-page)
   - Add PartnerInventoryNotice (bottom)
   - Add FAQAccordion (booking FAQ)
   - Update cards to use CuratedTourCard
   - Preserve ProductTag filtering (`/tours?tag=food`)
   - Preserve pagination (if exists)

2. **Update Tour Detail (`apps/web/app/tours/[id]/page.tsx`)**
   - Add TourDetailHero with image gallery
   - Add Quick Facts Bar
   - Create two-column layout (desktop):
     * Left: Overview, What's Included, Itinerary, Meeting Point, Cancellation
     * Right: Booking sidebar (price, date, group size, CTA)
   - Add Related Tours section
   - Add Destination Context section
   - Preserve existing Bókun availability integration
   - Preserve existing booking flow (redirect to Bókun)
   - Add "Request Private Tour" CTA (mailto:hello@radarscout.io)

3. **Create Booking Sidebar Component (UI Only)**
   ```typescript
   // apps/web/app/_components/BookingSidebar.tsx
   // Sticky sidebar with:
   // - Price display
   // - Date selector (existing Bókun integration)
   // - Group size selector
   // - "Check Availability" CTA (existing flow)
   // - "Request Private Tour" CTA (mailto)
   // - Safety badges
   ```

**Verification:**
```bash
# TypeScript check
pnpm --filter @reddit-monitor/web exec tsc --noEmit

# Safety check
pnpm ai:checks

# Manual testing:
# 1. Visit http://localhost:3000/tours
#    - Verify page hero displays
#    - Verify tour collection sections display
#    - Verify real Thailand products display
#    - Verify CuratedTourCard design
#    - Verify filter by tag works (/tours?tag=food)
#    - Verify "View Details" links work

# 2. Visit http://localhost:3000/tours/[id] (pick a real product)
#    - Verify hero + image gallery displays
#    - Verify product details display correctly
#    - Verify price displays correctly
#    - Verify booking sidebar displays
#    - Verify "Check Availability" button works (existing flow)
#    - Verify "Request Private Tour" mailto link works
#    - Verify related tours display

# 3. Test mobile:
#    - Verify single-column layout
#    - Verify booking sidebar becomes bottom sheet
#    - Verify sticky CTA works
```

**Success Criteria:**
- [ ] Tours catalog page transformed
- [ ] Tour detail pages transformed
- [ ] CuratedTourCard displays correctly
- [ ] Real Thailand products display
- [ ] ProductTag filtering still works
- [ ] Booking flow still works (not modified)
- [ ] Related tours section works
- [ ] TypeScript compilation succeeds
- [ ] Mobile responsive
- [ ] No booking functionality broken

---

### Phase UI-4: Itineraries + Partners + AI Planner Polish

**Duration:** Week 4

**Goal:**  
Complete remaining pages and final polish.

**Allowed Files:**
```
✅ MODIFY:

Itineraries:
- apps/web/app/itineraries/[slug]/page.tsx

AI Planner:
- apps/web/app/ai-trip-planner/page.tsx
- apps/web/app/ai-trip-planner/PlannerDemo.tsx (UI only)

Partners:
- apps/web/app/partners/page.tsx (create new)

Static Data:
- apps/web/lib/itineraries.ts (if needed, structure only)

Navigation:
- apps/web/app/_components/SiteNav.tsx (add partners link)
- apps/web/app/_components/SiteFooter.tsx (polish)

Documentation:
- docs/dmc-portal-strategy.md (create new)
- docs/supplier-onboarding-playbook.md (create new)
```

**Prohibited Files:**
```
❌ DO NOT MODIFY:

- Any AI planner backend logic
- Any API routes
- Any server files
```

**Tasks:**

1. **Update Itinerary Pages (`apps/web/app/itineraries/[slug]/page.tsx`)**
   - Add ItineraryHero
   - Add Itinerary Overview Card
   - Add Day-by-Day Itinerary section
   - Add Matching Bókun Partner Tours (Thailand only)
   - Add Private Custom Travel Option (EditorialBanner)
   - Add PartnerInventoryNotice (for coming soon destinations)
   - Add Related Itineraries
   - Add FAQAccordion
   - Preserve link to `/tours` for Thailand itineraries
   - Show "coming soon" for non-Thailand itineraries

2. **Update AI Planner Page (`apps/web/app/ai-trip-planner/page.tsx`)**
   - Add AI Planner Hero
   - Add "How It Works" section
   - Polish PlannerDemo component (UI only):
     * Form styling
     * Result display styling
     * Loading states
     * Error states
   - Add AI Technology Explanation section
   - Add Sample Itineraries section
   - Add FAQAccordion (AI FAQ)
   - Preserve existing demo logic

3. **Create Partners Page (`apps/web/app/partners/page.tsx`)**
   - Add PartnerHero
   - Add "Why Partner with RadarScout" section
   - Add "How RadarScout Promotes Your Tours" (4 touchpoints)
   - Add "What We Look For in Partners" section
   - Add "Destinations We're Expanding To" section
   - Add "How to Connect Through Bókun" section
   - Add Partner Success Stories (if available)
   - Add Contact CTA (mailto:hello@radarscout.io)
   - Add FAQAccordion (Partnership FAQ)
   - Static page only, NO backend form

4. **Polish Site Navigation**
   - Add "Partners" link to navigation
   - Verify all navigation links work
   - Add mobile menu improvements
   - Add breadcrumbs where needed

5. **Polish Site Footer**
   - Add WarmNewsletterFooter (if not already global)
   - Update footer links
   - Add partner link
   - Add social links
   - Add payment/security badges (if needed)

6. **Create Documentation**
   
   **docs/dmc-portal-strategy.md:**
   ```markdown
   # RadarScout DMC Portal Strategy
   
   ## Positioning
   - AI-powered Destination DMC Portal
   - Bókun supplier-powered inventory
   - Selective destination expansion
   
   ## NOT a Generic Aggregator
   - No Viator/GetYourGuide/Klook
   - No fake products
   - Quality over quantity
   
   ## Destination Expansion Strategy
   - Start: Thailand (live inventory)
   - Next: Barcelona, Lisbon, Bali, etc.
   - World Cup 2026: NYC, LA, Miami, etc.
   
   ## Supplier Partnership Model
   - Bókun verification required
   - Selective onboarding
   - Quality curation
   ```
   
   **docs/supplier-onboarding-playbook.md:**
   ```markdown
   # Supplier Onboarding Playbook
   
   ## Partner Requirements
   - Active Bókun supplier account
   - Reliable local operations
   - Quality experiences
   - Responsive customer service
   
   ## Onboarding Steps
   1. Create Bókun account
   2. List tours on Bókun
   3. Apply to RadarScout network
   4. Get featured on portal
   
   ## Contact
   - Email: hello@radarscout.io
   ```

**Verification:**
```bash
# TypeScript check
pnpm --filter @reddit-monitor/web exec tsc --noEmit

# Safety check
pnpm ai:checks

# Manual testing:
# 1. Visit http://localhost:3000/itineraries/[slug] (Thailand)
#    - Verify hero displays
#    - Verify day-by-day itinerary displays
#    - Verify matching tours link to /tours
#    - Verify private CTA mailto works

# 2. Visit http://localhost:3000/itineraries/[slug] (non-Thailand)
#    - Verify "coming soon" notice displays
#    - Verify NO fake products display

# 3. Visit http://localhost:3000/ai-trip-planner
#    - Verify hero displays
#    - Verify form works (existing logic)
#    - Verify result display works

# 4. Visit http://localhost:3000/partners
#    - Verify all sections display
#    - Verify mailto link works
#    - Verify FAQ displays

# 5. Navigation check:
#    - Verify "Partners" link in nav
#    - Verify all nav links work
#    - Verify mobile menu works

# 6. Footer check:
#    - Verify newsletter section displays
#    - Verify all footer links work

# 7. Documentation check:
#    - Verify docs/dmc-portal-strategy.md exists
#    - Verify docs/supplier-onboarding-playbook.md exists
```

**Success Criteria:**
- [ ] Itinerary pages work for both Thailand and coming soon
- [ ] AI planner page polished (UI only)
- [ ] Partners page created and functional
- [ ] Navigation updated with partners link
- [ ] Footer polished
- [ ] Documentation created
- [ ] All pages mobile responsive
- [ ] TypeScript compilation succeeds
- [ ] No existing functionality broken
- [ ] NO backend forms created
- [ ] NO database writes
- [ ] NO booking flow modifications

---

## 8. Codex Execution Prompt

**FOR PHASE UI-1 ONLY** (Design Tokens + Shared Components)

```
You are the frontend architect for RadarScout, an AI-powered Destination DMC Portal.

## Your Task: Phase UI-1 - Design Tokens + Shared Components

Create the design system foundation and reusable components WITHOUT modifying any existing pages.

## Context

RadarScout is NOT a generic travel aggregator. It is:
- Premium destination expert portal
- Curated Bókun supplier marketplace
- AI-enhanced itinerary assistant
- Regional DMC platform

Visual inspiration: Warm adventure travel aesthetic with orange accents, beige backgrounds, bold headings, and hand-written script labels.

## Phase UI-1 Scope

CREATE these files:

1. Design Tokens:
   - Modify apps/web/app/globals.css (add CSS custom properties)

2. Shared Components (15 total):
   - apps/web/app/_components/AdventureHero.tsx
   - apps/web/app/_components/ScriptLabel.tsx
   - apps/web/app/_components/DestinationCapsuleCard.tsx
   - apps/web/app/_components/ExperienceCategoryGrid.tsx
   - apps/web/app/_components/CuratedTourCard.tsx
   - apps/web/app/_components/DmcTrustBar.tsx
   - apps/web/app/_components/PartnerInventoryNotice.tsx
   - apps/web/app/_components/EditorialBanner.tsx
   - apps/web/app/_components/TourCollectionSection.tsx
   - apps/web/app/_components/TestimonialBand.tsx
   - apps/web/app/_components/GuideBlogCard.tsx
   - apps/web/app/_components/SupplierPartnerCTA.tsx
   - apps/web/app/_components/WarmNewsletterFooter.tsx
   - apps/web/app/_components/FAQAccordion.tsx
   - apps/web/app/_components/StickyMobileCTA.tsx

3. Component Showcase (for testing):
   - apps/web/app/components-showcase/page.tsx

## Design Tokens Reference

Add to apps/web/app/globals.css:

```css
:root {
  /* Colors */
  --color-accent-orange: #ff9933;
  --color-accent-orange-dark: #e67300;
  --color-accent-orange-light: #ffecd9;
  --color-bg-primary: #fdfcf4;
  --color-bg-secondary: #fcfaee;
  --color-bg-muted: #efebdb;
  --color-bg-card: #ffffff;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #4a4a4a;
  --color-text-muted: #888888;
  --color-border-light: #e8e4d6;
  --color-success-green: #4a7c59;
  --color-warning-amber: #d97706;
  --color-info-blue: #3b82f6;

  /* Typography */
  --font-body: 'Montserrat', sans-serif;
  --font-heading: 'Palanquin Dark', sans-serif;
  --font-script: 'Caveat', cursive;

  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Borders */
  --radius-base: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Component Requirements

For each component, refer to Section 4 of docs/radarscout-ui-redesign-plan.md for:
- Props interface
- Visual style details
- Usage examples

Key design principles:
- Use design tokens (CSS custom properties)
- Mobile-first responsive
- Warm adventure travel aesthetic
- Orange accent for CTAs
- Script labels for personal touch
- Bold headings with generous spacing
- White cards on warm beige backgrounds

## Safety Rules

DO NOT modify:
- apps/web/app/page.tsx (homepage - not yet)
- apps/web/app/destinations/* (not yet)
- apps/web/app/tours/* (not yet)
- apps/web/app/itineraries/* (not yet)
- apps/web/app/api/* (never)
- packages/db/prisma/* (never)
- server/* (never)
- Any booking or payment logic

DO NOT:
- Add fake products
- Add fake reviews
- Add affiliate products
- Modify database
- Modify API routes
- Implement real booking logic

## Demo Content Rules

- Showcase testimonials are demo-only unless they are explicitly sourced from verified customers or signed supplier partners.
- Demo cards must not be interpreted as real bookings, real reviews, real ratings, real suppliers, or live inventory.
- Current live bookable inventory is Thailand only.
- Other destinations must use partner tours coming soon or planning-only messaging until signed Bókun supplier inventory is connected.
- UI demos should never imply worldwide live tours, global real-time availability, or bookable products outside the current signed supplier inventory boundary.

## Verification

After completing Phase UI-1, verify:

```bash
# TypeScript check
pnpm --filter @reddit-monitor/web exec tsc --noEmit

# Build check
pnpm --filter @reddit-monitor/web build

# Safety check
pnpm ai:checks
```

Then visit:
- http://localhost:3000/components-showcase

Verify all 15 components render correctly with sample data.

## Output Format

Report:
1. List of files created/modified
2. Component summary (15 components)
3. Design tokens added
4. TypeScript compilation result
5. Build result
6. Safety check result
7. Suggested next steps for Phase UI-2

DO NOT proceed to Phase UI-2 until instructed.

---

Begin Phase UI-1 implementation now.
```

---

## End of RadarScout UI Redesign Plan

**Document Status:** Complete and ready for phased implementation  
**Next Action:** Execute Phase UI-1 via Codex  
**Safety:** All prohibited modifications clearly documented  
**Verification:** Testing steps included for each phase
