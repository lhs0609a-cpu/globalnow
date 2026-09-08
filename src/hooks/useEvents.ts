'use client';
import { useState } from 'react';
import type { KoreaEvent, EventCategory } from '@/types/event';
import { useResource } from './useResource';
export function useEvents() {
  const [category, setCategory] = useState<EventCategory | undefined>();
  const [month, setMonth] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (month) params.set('month', String(month));
  if (search.trim()) params.set('search', search.trim());
  const { data, isLoading, error, refresh } = useResource<KoreaEvent[]>(`/api/events?${params}`, search ? 250 : 0);
  return { events: Array.isArray(data) ? data : [], isLoading, error, refresh, category, setCategory, month, setMonth, search, setSearch };
}
