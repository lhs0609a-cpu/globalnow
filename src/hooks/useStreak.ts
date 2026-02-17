'use client';

import { useState, useEffect } from 'react';
import { UserStreak } from '@/types/user';

export function useStreak() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/user/streak');
        const data = await res.json();
        setStreak(data);
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStreak();
  }, []);

  return { streak, isLoading };
}
