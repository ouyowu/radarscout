# RadarScout Vercel preview bypass workflow

## 1. Purpose

RadarScout preview deployments can be protected by Vercel Authentication. That is correct for safety, but it can block automated smoke checks because normal `curl`, browserless fetch tools, or Playwright sessions may receive a redirect to Vercel SSO instead of the preview page.

This document defines the safe workflow for accessing protected RadarScout preview deployments during review, preview smoke, and post-merge preview validation.

This workflow must not be used to bypass production approval gates.

## 2. Current verified behavior

For protected Vercel preview URLs:

- A normal unauthenticated request may return a redirect to `https://vercel.com/sso-api`.
- Vercel can generate a temporary `_vercel_share` URL for a protected deployment.
- The share URL is temporary and should be treated as an operational testing link.
- Some non-browser fetch clients still fail after receiving the share URL because the flow redirects and expects cookies.
- When cookie handling is not available, use the Vercel protected-preview fetch helper or an authenticated browser session.

Do not commit share URLs into the repository.

## 3. Approved preview access methods

### Method A: Temporary Vercel share URL

Use this when a human or browser-based smoke test needs access to a protected preview.

Expected use:

1. Generate a temporary Vercel share URL for the preview deployment.
2. Open the share URL in a browser.
3. Let Vercel set the temporary access cookie.
4. Continue smoke testing the normal preview URL in that same browser session.

Reporting rule:

- It is acceptable to report that a temporary share URL was generated.
- Do not paste long-lived credentials, tokens, or environment values.
- Do not commit the share URL into docs, tests, PR bodies, or source code.

### Method B: Vercel protected-preview fetch helper

Use this when an agent/tool has a Vercel-aware fetch capability for protected deployments.

Expected use:

1. Fetch a small target first, such as `/sitemap.xml` or `/robots.txt`.
2. Confirm whether the helper returns page content or an SSO redirect.
3. If the helper still returns an SSO redirect, switch to Method A with a browser session.

This method is useful for lightweight checks, but it should not replace browser smoke testing when UI behavior is the validation target.

### Method C: Authenticated browser session

Use this for UI smoke checks that require interaction:

- homepage CTA smoke
- Chiang Mai finder planner flows
- itinerary summary reset behavior
- external booking partner handoff link checks
- mobile viewport overflow checks

If the preview is protected, first use Method A to establish access.

## 4. Standard RadarScout preview smoke flow

For every RadarScout preview smoke task:

1. Deploy from a fresh clean worktree.
2. Confirm Vercel project is `ouyowus-projects / reddit-monitor`.
3. Confirm target is preview, not production.
4. Confirm no production aliases are attached.
5. Confirm the deployment commit SHA matches the intended branch or merge SHA.
6. If normal fetch gets Vercel SSO, generate a temporary share URL.
7. Run the scoped smoke test on the preview.
8. Report the deployment URL, deployment ID, target, project, commit SHA, and whether a share URL was required.

Preview smoke must stop immediately if:

- the deployment target is production without explicit approval;
- `radarscout.io` or `www.radarscout.io` appears as a preview alias;
- the worktree is dirty before deploy;
- the preview deployment commit does not match the intended SHA;
- the Vercel project is not `reddit-monitor`.

## 5. RadarScout safety gates

Preview bypass does not change product safety rules.

During preview smoke, continue to verify:

- no SEO `index,follow` opening unless explicitly approved;
- no `/tours/{id}` sitemap regression;
- no unsafe homepage or tourist-facing copy;
- no Bókun API, edit, or sync behavior;
- no checkout, payment, cart, or booking submission behavior;
- no live availability or inventory claims;
- no DB writes;
- no schema or environment changes;
- no LLM or OpenAI calls;
- no ThaiEleHub or Shopify files touched.

## 6. What not to do

Do not:

- disable Vercel Authentication for the project without explicit approval;
- change Vercel project settings from a preview smoke task;
- use a preview bypass as production deploy approval;
- commit `_vercel_share` links;
- paste secrets, environment values, or Vercel tokens into reports;
- add preview bypass logic to application code;
- add share URLs to tests;
- use preview bypass to skip required validation.

## 7. Recommended reporting format

For protected previews, add this block to the final report:

```text
Preview protection:
- Vercel Authentication encountered: yes/no
- Temporary share URL generated: yes/no
- Browser/authenticated fetch used: yes/no
- Share URL committed or persisted: no
```

Keep the report focused on evidence, not credentials.

## 8. Future helper task

If preview protection continues to slow QA, create a follow-up task:

```text
TD-RADARSCOUT-VERCEL-PREVIEW-BYPASS-1-SMOKE-HELPER
```

Scope:

- document a small operator-only smoke checklist;
- optionally add a local-only script that accepts a preview URL and prints safe diagnostic status;
- do not store share URLs;
- do not change Vercel project settings;
- do not deploy.

The helper should stay outside application runtime behavior.
