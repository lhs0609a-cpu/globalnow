/** Provider-neutral integration point. No identifiers, search text, or external transmission. */
export type UXEventName = 'page_view' | 'search_submit' | 'search_empty' | 'filter_change' | 'feed_loaded' | 'feed_error' | 'retry' | 'outbound_open' | 'bookmark_success' | 'analysis_open';
export function track(name: UXEventName, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('globalnow:analytics', {
    detail: { name, properties, path: window.location.pathname, timestamp: Date.now() },
  }));
}
