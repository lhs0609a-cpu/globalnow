'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { MarketData } from '@/types/market';
export type MarketResponse = MarketData & { isLive?: boolean; provenance?: Record<string, 'live' | 'demo'> };
export function useMarket() {
  const [data, setData] = useState<MarketResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const pending = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/market', { signal: controller.signal });
      if (!res.ok) throw new Error('request failed');
      const result = await res.json();
      if (!result || !Array.isArray(result.indices)) throw new Error('invalid data');
      if (pending.current === controller) setData(result);
    } catch { if (pending.current === controller) setError('시장 정보를 불러오지 못했습니다.'); }
    finally {
      clearTimeout(timeout);
      if (pending.current === controller) { pending.current = null; setIsLoading(false); setIsRefreshing(false); }
    }
  }, []);
  useEffect(() => {
    void refresh();
    return () => { const controller = pending.current; pending.current = null; controller?.abort(); };
  }, [refresh]);
  useEffect(() => {
    if (!autoUpdate) return;
    const interval = setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 120000);
    return () => clearInterval(interval);
  }, [autoUpdate, refresh]);
  return { data, isLoading, isRefreshing, error, refresh, autoUpdate, setAutoUpdate };
}
