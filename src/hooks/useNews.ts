'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { NewsItem, NewsFeedParams, TrendingItem } from '@/types/news';
import { track } from '@/lib/analytics/events';

/** One request per page; abort superseded queries and only commit successful pages. */
export function useNews(params: NewsFeedParams = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && key !== 'page') query.set(key, String(value));
  }
  const queryKey = query.toString();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const page = useRef(0);
  const exhausted = useRef(false);
  const pending = useRef<AbortController | null>(null);
  const generation = useRef(0);

  const fetchPage = useCallback(async (nextPage: number) => {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    const currentGeneration = generation.current;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news?${queryKey}&page=${nextPage}`, { signal: controller.signal });
      if (!res.ok) throw new Error('request failed');
      const data = await res.json();
      if (!Array.isArray(data.items) || !Number.isFinite(data.total)) throw new Error('invalid response');
      if (currentGeneration !== generation.current) return;
      setItems(previous => {
        const combined: NewsItem[] = nextPage === 1 ? data.items : [...previous, ...data.items];
        return [...new Map(combined.map(item => [item.id, item])).values()];
      });
      exhausted.current = data.items.length === 0;
      page.current = nextPage;
      setTotal(data.total);
      setMode(data.mode || '');
      setUpdatedAt(new Date().toISOString());
      track('feed_loaded', { count: data.items.length, page: nextPage });
      if (nextPage === 1 && data.total === 0) track('search_empty', { hasSearch: queryKey.includes('search=') });
    } catch {
      if (currentGeneration !== generation.current) return;
      setError(controller.signal.aborted ? '응답이 늦어지고 있습니다. 다시 시도해 주세요.' : '뉴스를 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.');
      track('feed_error', { page: nextPage });
    } finally {
      clearTimeout(timeout);
      if (currentGeneration === generation.current) {
        pending.current = null;
        setIsLoading(false);
      }
    }
  }, [queryKey]);

  useEffect(() => {
    page.current = 0;
    exhausted.current = false;
    setItems([]);
    setTotal(0);
    void fetchPage(1);
    return () => {
      generation.current += 1;
      pending.current?.abort();
      pending.current = null;
    };
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!exhausted.current) void fetchPage(page.current + 1);
  }, [fetchPage]);
  const retry = useCallback(() => {
    track('retry', { area: 'news' });
    void fetchPage(page.current + 1);
  }, [fetchPage]);
  return { items, total, isLoading, error, mode, updatedAt, hasMore: !exhausted.current && items.length < total, loadMore, retry };
}

export function useTrending() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/trends', { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error('request failed'); return res.json(); })
      .then(data => setItems(Array.isArray(data) ? data : (data.items || [])))
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, []);
  return { items, isLoading };
}
