'use client';

import { useState, useEffect } from 'react';
import { MarketData } from '@/types/market';

export function useMarket() {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMarket() {
      try {
        const res = await fetch('/api/market');
        const marketData = await res.json();
        setData(marketData);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMarket();

    const interval = setInterval(fetchMarket, 120000);
    return () => clearInterval(interval);
  }, []);

  return { data, isLoading };
}
