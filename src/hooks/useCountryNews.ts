'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { NewsItem } from '@/types/news';

type CountryNewsState = {
  items: NewsItem[];
  isLoading: boolean;
  error: string | null;
};

// Client-side cache: Map<country, { items, timestamp }>
const cache = new Map<string, { items: NewsItem[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useCountryNews(country: string | null) {
  const [state, setState] = useState<CountryNewsState>({
    items: [],
    isLoading: false,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const fetchNews = useCallback(async (countryCode: string) => {
    // Check client cache
    const cached = cache.get(countryCode);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setState({ items: cached.items, isLoading: false, error: null });
      return;
    }

    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await fetch(`/api/news/country?country=${countryCode}&limit=5`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      const items = data.items || [];

      // Update cache
      cache.set(countryCode, { items, timestamp: Date.now() });

      if (!controller.signal.aborted) {
        setState({ items, isLoading: false, error: null });
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (!controller.signal.aborted) {
        setState({ items: [], isLoading: false, error: '뉴스를 불러올 수 없습니다' });
      }
    }
  }, []);

  useEffect(() => {
    if (!country) {
      setState({ items: [], isLoading: false, error: null });
      return;
    }

    fetchNews(country);

    return () => {
      abortRef.current?.abort();
    };
  }, [country, fetchNews]);

  return state;
}
