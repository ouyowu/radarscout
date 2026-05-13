# RadarScout Campaign + Multi-Source Intent Strategy

This document is written for Claude Code. Use it as the product and architecture brief before changing code.

## Core Product Insight

RadarScout should not be defined as a "Reddit monitoring tool" forever.

The real product is:

> Find people who publicly express buying intent, hiring intent, or urgent task demand, then help the user decide whether and how to respond.

Reddit is only the first source. Other public demand sources can be added later, especially job/task marketplaces such as Upwork, Fiverr, Freelancer, PeoplePerHour, Contra, LinkedIn jobs/posts, Indie Hackers, Hacker News, Product Hunt comments, and X/Twitter search.

## Why Reddit Is Still Useful

Reddit is good for early intent and market research:

- Users ask for tool recommendations.
- Users complain about existing products.
- Users compare alternatives.
- Users describe pain before they have created a formal job post.
- SaaS founders can reply naturally with advice and product context.

Examples:

- "F5Bot alternative"
- "reddit monitoring tool"
- "gummysearch alternative"
- "looking for a cheap social listening tool"
- "how do I find SaaS customers on Reddit"

Reddit is best for:

- SaaS subscriptions
- SEO positioning
- Public social proof
- Founder-led marketing
- Warm but early-stage leads

## Why Fiverr / Upwork-Style Sources Matter

Task marketplaces are different. They often contain stronger commercial intent because the buyer has already described a task and may already have a budget.

Examples:

- "Need someone to monitor Reddit mentions"
- "Find Reddit leads for my SaaS"
- "Set up social listening alerts"
- "Build a scraper for Reddit posts"
- "Lead generation for B2B SaaS"
- "Need competitor monitoring dashboard"

These sources are best for:

- Service businesses
- Agencies
- Freelancers
- Done-for-you lead generation
- Consulting offers
- Custom SaaS onboarding

Important: do not build auto-bidding, auto-DM, or spam automation. The product should only discover public demand and help the user manually decide what to do.

## Recommended Product Direction

Upgrade RadarScout from:

> Keyword monitor

to:

> Campaign-based intent discovery system

A Campaign represents a business objective, product, client, or offer.

Examples:

- "Find users looking for F5Bot alternatives"
- "Find SaaS founders who need Reddit leads"
- "Find agencies needing social listening"
- "Find buyers asking for lead generation services"

Each Campaign should have:

- Name
- Description
- Offer or product being promoted
- Target customer
- Sources enabled
- Keywords / phrases
- Negative keywords
- Intent rules
- Minimum score threshold
- Notification settings
- Status: active, paused, archived

## Campaign + Sources Model

The product should support multiple source types under one Campaign.

Initial source types:

- `reddit`
- `upwork`
- `fiverr`
- `freelancer`
- `peopleperhour`
- `linkedin`
- `indie_hackers`
- `hacker_news`
- `product_hunt`
- `twitter_x`
- `manual`

Do not implement all sources at once. Start with Reddit as the working source, but design the database and crawler interfaces so new sources can be added later.

## Intent Signal Types

RadarScout should classify posts/tasks into intent categories.

Recommended categories:

- `buying_intent`: user wants to buy a product or subscription.
- `hiring_intent`: user wants to hire a person, freelancer, or agency.
- `alternative_search`: user is looking for an alternative to a known tool.
- `pain_complaint`: user complains about an existing product or workflow.
- `recommendation_request`: user asks others to recommend a tool or service.
- `build_request`: user wants someone to build an automation, scraper, dashboard, or internal tool.
- `research_only`: weak signal; user is researching but may not buy soon.
- `low_quality`: not worth notifying.

## Scoring Logic

Keep the existing AI intent scoring idea, but make it source-aware.

Suggested score dimensions:

- Urgency: 0-10
- Budget signal: 0-10
- Buyer clarity: 0-10
- Fit with campaign offer: 0-10
- Competition/noise risk: 0-10
- Reply opportunity: 0-10

The existing 1-10 score can remain as the user-facing score, derived from these dimensions.

## Database Direction

Current system has `Keyword`. Upgrade to a Campaign-centered model.

Recommended models:

- `Campaign`
- `CampaignSource`
- `CampaignKeyword`
- `Lead`
- `LeadScore`
- `LeadAction`

Suggested relationships:

- User has many Campaigns.
- Campaign has many CampaignSources.
- Campaign has many CampaignKeywords.
- Campaign has many Leads.
- Lead belongs to Campaign and Source.
- LeadScore belongs to Lead.

Important migration requirement:

- Preserve existing users and keywords.
- Create a default Campaign for each user who has existing keywords.
- Move existing keywords into that default Campaign.
- Keep old routes working temporarily or redirect them to the new Campaign UI.

## Crawler Direction

Current crawler loads enabled keywords from an internal API and logs:

`[engine] loaded 0 keywords`

After Campaign upgrade, crawler should load active Campaign tasks instead.

Recommended internal API:

`GET /api/internal/campaigns`

Return only active campaigns with enabled sources and keywords.

Example response shape:

```json
[
  {
    "campaignId": "camp_xxx",
    "userId": "user_xxx",
    "plan": "PRO",
    "name": "F5Bot Alternative Leads",
    "offer": "RadarScout finds high-intent Reddit leads",
    "sources": [
      {
        "type": "reddit",
        "enabled": true,
        "subreddits": ["SaaS", "SideProject", "Entrepreneur"]
      }
    ],
    "keywords": [
      { "id": "kw_xxx", "text": "f5bot alternative", "enabled": true },
      { "id": "kw_yyy", "text": "reddit monitoring tool", "enabled": true }
    ],
    "negativeKeywords": ["free karma", "meme", "homework"],
    "minimumScore": 7
  }
]
```

Crawler log should change from:

`[engine] loaded 0 keywords`

to something clearer:

`[engine] loaded 1 campaigns, 7 keywords, 1 sources`

## Source Implementation Phases

### Phase 1: Campaign Architecture, Reddit Only

Goal: no new external source yet. Make the product model correct.

Tasks:

- Add Campaign database model.
- Add CampaignSource and CampaignKeyword or adapt Keyword with `campaignId`.
- Migrate existing keywords into a default Campaign.
- Update dashboard from "Keywords" to "Campaigns".
- Keep Reddit crawler working through Campaign API.
- Confirm production crawler logs show non-zero campaigns and keywords.

### Phase 2: Marketplace Demand Research, No Automation

Goal: explore task-demand sources without risky automation.

Tasks:

- Add source type definitions for Upwork/Fiverr/Freelancer.
- Build manual/import source first.
- Allow user to paste public task URLs into a Campaign.
- Score pasted tasks for fit and buying/hiring intent.
- Do not scrape logged-in pages.
- Do not auto-bid or auto-message.

### Phase 3: Public Source Connectors

Goal: add compliant public discovery where allowed.

Tasks:

- Use official APIs where available.
- Use RSS/search pages only if allowed by source terms.
- Respect robots, rate limits, and platform rules.
- Store source URL, title, snippet, author/company if public, timestamp, and source type.
- Make every lead traceable to the original public page.

### Phase 4: Outreach Assistant, Not Outreach Bot

Goal: help users respond naturally.

Tasks:

- Generate response angle, not spam comments.
- Provide "why this is a good lead".
- Provide manual reply draft.
- Add warnings when a community or platform likely dislikes promotion.
- Never auto-post, auto-DM, auto-bid, or auto-apply.

## Positioning Update

Current positioning:

> Reddit lead finder with AI intent scoring.

Future positioning:

> AI intent scout for founders, agencies, and freelancers. Find public buying signals across Reddit, communities, and task marketplaces.

Short landing-page phrasing:

> Find people already asking for what you sell.

Alternative:

> RadarScout watches public demand signals across Reddit and freelance marketplaces, scores purchase intent, and shows you the leads worth replying to.

## Product Safety Rules

Claude Code should preserve these rules:

- Do not build spam automation.
- Do not auto-post replies.
- Do not auto-send DMs.
- Do not auto-bid on jobs.
- Do not bypass login, CAPTCHA, rate limits, or platform restrictions.
- Prefer official APIs, user-provided URLs, RSS, or compliant public pages.
- Always show source URL and reason for match.
- Always keep human-in-the-loop for outreach.

## Immediate Next Build Recommendation

Build Phase 1 first:

1. Campaign architecture.
2. Migration from existing Keyword to Campaign.
3. Campaign dashboard.
4. Internal Campaign API for crawler.
5. Crawler reads active Campaigns and logs campaign/keyword/source counts.

Do not start Fiverr/Upwork scraping yet. Add them as future source types only after the core Campaign model is stable.

