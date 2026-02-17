import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockBrief } from '@/lib/demo/mock-brief';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { MorningBrief } from '@/types/news';

export async function getTodayBrief(): Promise<MorningBrief> {
  if (isDemoMode()) {
    return getMockBrief();
  }

  const today = new Date().toISOString().split('T')[0];

  return cacheGetOrSet(
    `brief:${today}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockBrief();

      const { data, error } = await supabase
        .from('morning_briefs')
        .select('*')
        .eq('date', today)
        .single();

      if (error || !data) return getMockBrief();
      return data as unknown as MorningBrief;
    },
    600
  );
}

export async function getBriefByDate(date: string): Promise<MorningBrief> {
  if (isDemoMode()) {
    return getMockBrief(date);
  }

  return cacheGetOrSet(
    `brief:${date}`,
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return getMockBrief(date);

      const { data, error } = await supabase
        .from('morning_briefs')
        .select('*')
        .eq('date', date)
        .single();

      if (error || !data) return getMockBrief(date);
      return data as unknown as MorningBrief;
    },
    3600
  );
}
