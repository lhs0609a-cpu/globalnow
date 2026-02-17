'use client';

import { useState, useCallback } from 'react';

export function useInfiniteScroll<T>({
  fetchFn,
  limit = 10,
}: {
  fetchFn: (page: number, limit: number) => Promise<{ items: T[]; total: number }>;
  limit?: number;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await fetchFn(page, limit);
      setItems(prev => [...prev, ...data.items]);
      setTotal(data.total);
      setHasMore(items.length + data.items.length < data.total);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, isLoading, hasMore, fetchFn, items.length]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setHasMore(true);
  }, []);

  return { items, total, isLoading, hasMore, loadMore, reset };
}
