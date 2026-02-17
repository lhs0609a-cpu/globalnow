import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockReport, getMockReports } from '@/lib/demo/mock-reports';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { IndustryId, WeeklyReport } from '@/types/report';

export async function getLatestReport(industry: IndustryId): Promise<WeeklyReport | null> {
  if (isDemoMode()) {
    return getMockReport(industry);
  }

  return cacheGetOrSet(
    `report:latest:${industry}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockReport(industry);

      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('industry', industry)
        .order('week_start', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return getMockReport(industry);

      return {
        id: data.id,
        industry: data.industry,
        weekStart: data.week_start,
        weekEnd: data.week_end,
        content: data.content,
        generatedAt: data.generated_at,
      } as WeeklyReport;
    },
    3600
  );
}

export async function getReportByWeek(
  industry: IndustryId,
  weekStart: string
): Promise<WeeklyReport | null> {
  if (isDemoMode()) {
    return getMockReport(industry, weekStart);
  }

  return cacheGetOrSet(
    `report:${industry}:${weekStart}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockReport(industry, weekStart);

      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('industry', industry)
        .eq('week_start', weekStart)
        .single();

      if (error || !data) return getMockReport(industry, weekStart);

      return {
        id: data.id,
        industry: data.industry,
        weekStart: data.week_start,
        weekEnd: data.week_end,
        content: data.content,
        generatedAt: data.generated_at,
      } as WeeklyReport;
    },
    3600
  );
}

export async function getAllReports(industry?: IndustryId): Promise<WeeklyReport[]> {
  if (isDemoMode()) {
    return getMockReports(industry);
  }

  return cacheGetOrSet(
    `reports:all:${industry || 'all'}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockReports(industry);

      let query = supabase
        .from('weekly_reports')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(12);

      if (industry) {
        query = query.eq('industry', industry);
      }

      const { data, error } = await query;
      if (error || !data) return getMockReports(industry);

      return data.map(row => ({
        id: row.id,
        industry: row.industry,
        weekStart: row.week_start,
        weekEnd: row.week_end,
        content: row.content,
        generatedAt: row.generated_at,
      })) as WeeklyReport[];
    },
    3600
  );
}
