'use client';
import { useState } from 'react';
import type { IndustryId, WeeklyReport } from '@/types/report';
import { useResource } from './useResource';
export function useReports(initialIndustry: IndustryId = 'semiconductor') {
  const [industry, setIndustry] = useState<IndustryId>(initialIndustry);
  const [weekStart, setWeekStart] = useState<string | undefined>();
  const params = new URLSearchParams({ industry });
  if (weekStart) params.set('weekStart', weekStart);
  const { data, isLoading, error, refresh } = useResource<WeeklyReport>(`/api/reports?${params}`);
  return { industry, weekStart, report: data, isLoading, error, refresh, setWeekStart, setIndustry: (id: IndustryId) => { setIndustry(id); setWeekStart(undefined); } };
}
