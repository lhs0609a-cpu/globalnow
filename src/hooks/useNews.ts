'use client';

import { useState, useEffect, useCallback } from 'react';
import { NewsItem, NewsFeedParams, TrendingItem } from '@/types/news';

export function useNews(initialParams?: NewsFeedParams) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<NewsFeedParams>(initialParams || {});

  const fetchNews = useCallback(async (p: NewsFeedParams, append = false) => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (p.category) searchParams.set('category', p.category);
      if (p.country) searchParams.set('country', p.country);
      if (p.source) searchParams.set('source', p.source);
      if (p.page) searchParams.set('page', String(p.page));
      if (p.limit) searchParams.set('limit', String(p.limit));
      if (p.sortBy) searchParams.set('sortBy', p.sortBy);
      if (p.search) searchParams.set('search', p.search);

      const res = await fetch(`/api/news?${searchParams.toString()}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const newItems = Array.isArray(data.items) ? data.items : [];

      if (append) {
        setItems(prev => [...prev, ...newItems]);
      } else {
        setItems(newItems);
      }
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(params);
  }, [params, fetchNews]);

  const loadMore = useCallback(() => {
    const nextPage = (params.page || 1) + 1;
    const newParams = { ...params, page: nextPage };
    setParams(newParams);
    fetchNews(newParams, true);
  }, [params, fetchNews]);

  const setCategory = useCallback((category: string) => {
    setParams(prev => ({ ...prev, category: category === 'all' ? undefined : category, page: 1 }));
  }, []);

  const hasMore = items.length < total;

  return { items, total, isLoading, hasMore, loadMore, setCategory, setParams };
}

export function useTrending() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trends');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  return { items, isLoading };
}
