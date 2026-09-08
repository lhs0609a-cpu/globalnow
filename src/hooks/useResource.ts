'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Shared read-only request lifecycle. Old responses cannot replace a newer filter. */
export function useResource<T>(url: string | null, delay = 0) {
  const [state, setState] = useState<{ url: string | null; data: T | null; error: string | null; loading: boolean }>({ url: null, data: null, error: null, loading: false });
  const active = useRef<AbortController | null>(null);
  const request = useCallback(async () => {
    active.current?.abort();
    if (!url) return;
    const controller = new AbortController();
    active.current = controller;
    const timer = setTimeout(() => controller.abort(), 25000);
    setState(old => ({ url, data: old.url === url ? old.data : null, error: null, loading: true }));
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error('request failed');
      const data: T = await response.json();
      if (active.current === controller) setState({ url, data, error: null, loading: false });
    } catch {
      if (active.current === controller) setState(old => ({ ...old, loading: false, error: '자료를 불러오지 못했습니다. 다시 시도해 주세요.' }));
    } finally { clearTimeout(timer); if (active.current === controller) active.current = null; }
  }, [url]);
  useEffect(() => {
    const timer = setTimeout(() => void request(), delay);
    return () => { clearTimeout(timer); const controller = active.current; active.current = null; controller?.abort(); };
  }, [request, delay]);
  return { data: state.url === url ? state.data : null, error: state.url === url ? state.error : null, isLoading: Boolean(url) && (state.url !== url || state.loading), refresh: request };
}
