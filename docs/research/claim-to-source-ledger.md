# Claim-to-source ledger

Accessed 2026-09-08. Sources opened directly; worker claims reconciled with parent inspection for consequential claims. Native retrieval metadata retained here for research provenance only; not included in the user-facing report.

| Claim | Source, publisher, date | URL | Confidence / limitation |
| --- | --- | --- | --- |
| Relevant information should remain grouped | Negative Impact of Mobile-First Web Design on Desktop; NN/G; 2023-10-13 | https://www.nngroup.com/articles/content-dispersion/ | Medium; 13-person qualitative prototype study, no product-specific effect size. Parent turn11view4 |
| Complex application task hierarchy | 8 Design Guidelines for Complex Applications; NN/G; 2020-11-08 | https://www.nngroup.com/articles/complex-application-design/ | High as heuristic, not a causal uplift forecast. Worker turn3view0 |
| AA target size, focus and motion requirements | WCAG 2.2; W3C; 2024-12-12 Recommendation | https://www.w3.org/TR/WCAG22/ | High; exceptions and complete criterion scope apply. Worker turn5view0 |
| Reflow at 320 CSS px; table exception is limited | Understanding Reflow; W3C WAI; updated 2026-08-10 | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html | High; explanatory documentation. Parent turn11view1 |
| Short status messages, not entire result list | Understanding Status Messages; W3C WAI; updated 2026-05-11 | https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html | High; user testing of announcement volume still needed. Parent turn11view0 |
| Programmatic and visible labels | Labeling Controls; W3C WAI; updated 2024-05-13 | https://www.w3.org/WAI/tutorials/forms/labels/ | High; contextual label exceptions. Worker turn7view0 |
| Effect fetch cleanup and race hazards | useEffect; React 19.2; no visible publication date | https://react.dev/reference/react/useEffect#fetching-data-with-effects | High; custom lifecycle retains operational responsibility. Parent turn11view3 |
| CWV p75 good thresholds | Defining Core Web Vitals thresholds; web.dev; updated 2025-05-07 | https://web.dev/articles/defining-core-web-vitals-thresholds | High; not a bounce prediction. Parent turn11view2 |
| Lab/field metrics are distinct | Lab and field data differences; web.dev; date not confirmed | https://web.dev/articles/lab-and-field-data-differences | High; real user population required. Worker direct original |
| Next fetch/cache is explicit | Caching and Revalidating (Previous Model); Next.js; updated 2026-08-25 | https://nextjs.org/docs/app/guides/caching-without-cache-components | High; Next 16.1.6 project has no cacheComponents configuration. Worker direct original |
| GA4 bounce is non-engaged session ratio | Engagement rate and bounce rate; Google Analytics; date not shown | https://support.google.com/analytics/answer/12195621?hl=en | High for definition; cannot compute without actual sessions. Worker direct original |

Gaps: observed user exit reasons, first-use success, actual conversions, field CWV, simultaneous users, cache hit rate, cold-start request amplification, real authenticated persistence. These remain unmeasured. No source claims this app's bounce rate or supports a numeric projected uplift.
