'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WatchlistItem, WatchdogNewsItem } from '@/types/watchdog';

const STORAGE_KEY = 'globalnow_watchlist';
const REFRESH_INTERVAL = 60_000; // 60 seconds

function loadWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(items: WatchlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable
  }
}

export function useWatchdog() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [news, setNews] = useState<WatchdogNewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    setWatchlist(loadWatchlist());
  }, []);

  const tickers = watchlist.map(w => w.ticker);

  const fetchNews = useCallback(async (tickerList: string[], p = 1) => {
    if (tickerList.length === 0) {
      setNews([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        tickers: tickerList.join(','),
        page: String(p),
        limit: '20',
      });
      const res = await fetch(`/api/watchdog?${params}`);
      const data = await res.json();
      setNews(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch watchdog news:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on watchlist or page change
  useEffect(() => {
    fetchNews(tickers, page);
  }, [watchlist, page, fetchNews]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 60s
  useEffect(() => {
    if (tickers.length === 0) return;

    intervalRef.current = setInterval(() => {
      fetchNews(tickers, page);
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tickers.join(','), page, fetchNews]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTicker = useCallback((item: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.some(w => w.ticker === item.ticker)) return prev;
      const updated = [...prev, { ...item, addedAt: new Date().toISOString() }];
      saveWatchlist(updated);
      return updated;
    });
    setPage(1);
  }, []);

  const removeTicker = useCallback((ticker: string) => {
    setWatchlist(prev => {
      const updated = prev.filter(w => w.ticker !== ticker);
      saveWatchlist(updated);
      return updated;
    });
    setPage(1);
  }, []);

  const addPresetGroup = useCallback((items: WatchlistItem[]) => {
    setWatchlist(prev => {
      const existingTickers = new Set(prev.map(w => w.ticker));
      const newItems = items
        .filter(i => !existingTickers.has(i.ticker))
        .map(i => ({ ...i, addedAt: new Date().toISOString() }));
      const updated = [...prev, ...newItems];
      saveWatchlist(updated);
      return updated;
    });
    setPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setWatchlist([]);
    saveWatchlist([]);
    setNews([]);
    setTotal(0);
    setPage(1);
  }, []);

  const hasTicker = useCallback(
    (ticker: string) => watchlist.some(w => w.ticker === ticker),
    [watchlist]
  );

  return {
    watchlist,
    news,
    total,
    isLoading,
    page,
    setPage,
    addTicker,
    removeTicker,
    addPresetGroup,
    clearAll,
    hasTicker,
    refresh: () => fetchNews(tickers, page),
  };
}
