'use client';

import { useState, useEffect, useCallback } from 'react';
import { KoreaEvent, EventCategory } from '@/types/event';

export function useEvents() {
  const [events, setEvents] = useState<KoreaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<EventCategory | undefined>(undefined);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (month) params.set('month', String(month));
      if (search) params.set('search', search);
      const url = `/api/events${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, month, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    category,
    setCategory,
    month,
    setMonth,
    search,
    setSearch,
  };
}
