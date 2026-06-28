# RadarScout sitemap safety audit

Task: `TD-RADARSCOUT-SITEMAP-SAFETY-0`

## 1. Executive summary

RadarScout should remove `/tours/{id}` URLs from the sitemap for now.

Production audit evidence showed:

```text
Production sitemap: https://radarscout.io/sitemap.xml
Status: 200
Total URLs: 250
/tours/{id} URLs: 246
Non-tour URLs: 4
```

Sampled eligible tour pages are in the sitemap, have no page-level robots meta, and contain tourist-facing wording such as:

- `payment`
- `partner rate`
- `Bókun supplier partner product database`

Recommendation:

```text
Remove /tours/{id} from sitemap until tour pages are public-safe.
Do not delete tour routes.
Do not change tour page behavior.
Do not open SEO index/follow.
```

## 2. Current production sitemap state

The production sitemap contains 250 URLs.

Non-tour URLs in production sitemap:

```text
https://www.radarscout.io
https://www.radarscout.io/contact
https://www.radarscout.io/privacy-policy
https://www.radarscout.io/terms-of-service
```

Tour URLs:

```text
246 /tours/{id} URLs
```

The sitemap source is:

```text
apps/web/app/sitemap.ts
```

Current behavior before the safety fix:

- emits four static public URLs;
- calls `listPublicThailandProducts()`;
- emits `/tours/${product.id}` for every returned product.

## 3. robots.txt and metadata relationship

Production `robots.txt` is available at:

```text
https://radarscout.io/robots.txt
```

It allows `/`, disallows internal route families, and points to:

```text
https://www.radarscout.io/sitemap.xml
```

Noindex pages checked during audit:

```text
/chiang-mai/elephant-camp-finder: not in sitemap, noindex,nofollow
/partners: not in sitemap, noindex,nofollow
/suppliers: not in sitemap, noindex,nofollow
/destination-partners: not in sitemap, noindex,nofollow
```

Sampled eligible `/tours/{id}` pages had no page-level robots meta.

Sitemap inclusion does not itself open indexing, but including unsafe or not-yet-public-safe pages can confuse future SEO opening and should be cleaned before any `index,follow` work.

## 4. `/tours/{id}` sample audit

Sample tour URLs checked:

```text
https://www.radarscout.io/tours/5c51176e-e42e-4bbb-9c4e-9c05666b5e6e
https://www.radarscout.io/tours/aa4d78d7-4ad2-414b-bae2-59685a8604f6
https://www.radarscout.io/tours/7da857ee-f4d2-4785-91ee-da884d5a2fa3
https://www.radarscout.io/tours/7a119353-9eb6-4339-91dd-61b8d393ed51
https://www.radarscout.io/tours/b8c42a27-f29c-4c71-a401-118543be2cc5
```

Findings:

- sampled tour pages returned 200;
- eligible tour pages had no page-level robots meta;
- sampled eligible tour pages exposed display-only product detail copy;
- sampled eligible tour pages did not show an internal checkout route;
- sampled eligible tour pages contained wording that is not suitable for tourist-facing SEO snippets.

## 5. Unsafe wording findings

Forbidden tourist-facing wording checked:

```text
live availability
available now
guaranteed slot
instant confirmation
checkout
payment
reservation complete
Bókun backend
Bókun database
Bókun-powered
Bókun supplier partner product database
partner rate
supplier net rate
commission
fake reviews
fake ratings
```

Findings:

- Homepage, Chiang Mai finder, and B2B page production checks passed for visible unsafe copy.
- Sampled eligible `/tours/{id}` pages contained `payment`, `partner rate`, and `Bókun supplier partner product database`.
- This is a sitemap/SEO safety issue, not evidence of active booking behavior.

## 6. Sitemap risk classification

Current classification:

```text
/tours/{id}: should remain excluded from sitemap for now
```

Reason:

- Tour pages are not yet written as public-safe SEO landing pages.
- Tour pages expose display-only supplier/source boundary language.
- Tour pages need a separate copy, metadata, CTA, and indexing policy review before sitemap inclusion.

## 7. Recommended sitemap policy

Recommended policy:

```text
Remove /tours/{id} from sitemap until tour pages are public-safe.
```

Do not:

- delete `/tours/{id}` routes;
- change `/tours/{id}` page rendering;
- add `/chiang-mai/elephant-camp-finder` to the sitemap while it remains `noindex,nofollow`;
- add B2B pages to the sitemap while they remain `noindex,nofollow`;
- open `index,follow`.

## 8. Dependencies before SEO opening

Before any controlled SEO opening for:

```text
/chiang-mai/elephant-camp-finder
```

RadarScout should:

- remove unsafe `/tours/{id}` pages from sitemap or make them public-safe;
- confirm B2B pages remain noindex and out of sitemap;
- confirm the Chiang Mai finder remains safe in metadata, visible copy, CTA rel, and handoff behavior;
- decide explicitly whether the Chiang Mai finder should be added to sitemap during a future SEO opening task;
- confirm Search Console and post-index monitoring plan.

## 9. Recommended next task

Recommended implementation:

```text
TD-RADARSCOUT-SITEMAP-SAFETY-1-EXCLUDE-UNSAFE-TOURS
```

Scope:

- change sitemap output only;
- remove `/tours/{id}` from `sitemap.xml`;
- keep static safe sitemap routes unchanged;
- keep routes and page behavior unchanged;
- keep robots and SEO indexing state unchanged;
- do not deploy without separate explicit approval.
