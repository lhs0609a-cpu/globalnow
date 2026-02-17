'use client';

import { useState, useEffect, useCallback } from 'react';
import { IndustryId, WeeklyReport } from '@/types/report';

export function useReports(initialIndustry: IndustryId = 'semiconductor') {
  const [industry, setIndustry] = useState<IndustryId>(initialIndustry);
  const [weekStart, setWeekStart] = useState<string | undefined>();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = useCallback(async (ind: IndustryId, week?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ industry: ind });
      if (week) params.set('weekStart', week);

      const res = await fetch(`/api/reports?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        setReport(null);
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(industry, weekStart);
  }, [industry, weekStart, fetchReport]);

  const changeIndustry = useCallback((id: IndustryId) => {
    setIndustry(id);
    setWeekStart(undefined); // reset to latest
  }, []);

  return {
    industry,
    weekStart,
    report,
    isLoading,
    setIndustry: changeIndustry,
    setWeekStart,
    refresh: () => fetchReport(industry, weekStart),
  };
}
