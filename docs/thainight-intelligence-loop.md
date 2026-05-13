# RadarScout x thainight intelligence loop

## Product direction

RadarScout is no longer positioned as a generic SaaS lead finder.

New positioning:

> Thailand nightlife intelligence feed for travelers.
> Monitor Reddit, X, Quora, RSS and travel communities for fresh nightlife tips, warnings, questions and hidden gems.

RadarScout is the discovery engine. thainight is the conversion layer.

## RadarScout responsibilities

- Collect public posts from Reddit, X, Quora, RSS feeds and travel forums.
- Detect location:
  - Bangkok
  - Pattaya
  - Phuket
  - Chiang Mai
  - Thailand
  - Unknown
- Detect content category:
  - bar
  - club
  - massage
  - scam
  - price
  - dating
  - transport
  - safety
  - tourist_question
  - hidden_gem
  - general_nightlife
- Score each item:
  - travelIntentScore: how useful this is to a traveler planning a night out.
  - credibilityScore: whether the post has first-hand, recent, specific detail.
  - commercialScore: whether thainight can turn it into a guide, map entry, newsletter item, paid PDF section or service lead.
- Store only public metadata, links, short snippets and AI summaries. Do not copy full third-party posts.

## thainight responsibilities

- Turn RadarScout signals into:
  - city nightlife guides
  - maps
  - "what travelers are asking today" pages
  - paid PDFs
  - newsletter issues
  - Telegram posts
  - affiliate or service recommendations
- Link back to original community posts when useful.
- Link to RadarScout-powered live intelligence pages for freshness.

## First source set

Start with Reddit because it is the easiest public signal source to operate safely.

Suggested subreddits:

- r/ThailandTourism
- r/Thailand
- r/Bangkok
- r/Pattaya
- r/phuket
- r/chiangmai
- r/solotravel
- r/travel

Suggested keywords:

- bangkok nightlife
- pattaya nightlife
- phuket nightlife
- chiang mai nightlife
- soi cowboy
- nana plaza
- walking street pattaya
- bangla road
- thai massage
- bar fine
- gogo bar
- nightclub bangkok
- thailand scam
- tourist police thailand
- lady drink
- dating thailand
- safe at night bangkok

## Data handoff

RadarScout exposes partner feeds for thainight:

- JSON: `/api/thainight/intelligence`
- RSS: `/api/thainight/intelligence?format=rss`
- Optional filters:
  - `?location=Bangkok`
  - `?category=scam`
  - `?limit=25`

If `THAINIGHT_FEED_TOKEN` is set, thainight must send either:

- query parameter: `?token=...`
- header: `x-thainight-token: ...`

## Content loop

1. RadarScout finds a fresh signal.
2. AI classifies city, category, opportunity type and scores.
3. High-value signals appear in RadarScout dashboard and thainight feed.
4. thainight converts the best signals into content.
5. thainight links readers to relevant live feeds or updates.
6. RadarScout learns which categories produce monetizable thainight content.
