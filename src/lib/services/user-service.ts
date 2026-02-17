import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { UserStreak, NewsDNA, Bookmark, KeywordAlert } from '@/types/user';
import { STREAK_BADGES } from '@/lib/constants/badges';

const MOCK_STREAK: UserStreak = {
  currentStreak: 7,
  longestStreak: 14,
  lastVisit: new Date().toISOString(),
  todayRead: true,
  badges: STREAK_BADGES.filter(b => b.requirement <= 7).map(b => ({
    id: b.id,
    name: b.name,
    nameKo: b.nameKo,
    icon: b.icon,
    description: b.descriptionKo,
    earnedAt: new Date().toISOString(),
  })),
};

const MOCK_DNA: NewsDNA = {
  userId: 'demo-user',
  period: '2025-01',
  categoryDistribution: [
    { category: '테크', percentage: 35 },
    { category: '경제', percentage: 25 },
    { category: '국제', percentage: 20 },
    { category: '정치', percentage: 10 },
    { category: '리스크', percentage: 7 },
    { category: '문화', percentage: 3 },
  ],
  sourceDistribution: [
    { source: 'TechCrunch', percentage: 20 },
    { source: 'Bloomberg', percentage: 18 },
    { source: 'Reuters', percentage: 15 },
    { source: 'BBC News', percentage: 12 },
    { source: 'The Verge', percentage: 10 },
  ],
  timeDistribution: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    reads: i >= 7 && i <= 9 ? 15 + Math.floor(Math.random() * 10) : i >= 12 && i <= 14 ? 10 + Math.floor(Math.random() * 8) : i >= 20 && i <= 23 ? 8 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 3),
  })),
  topKeywords: [
    { keyword: 'AI', count: 45 },
    { keyword: 'Bitcoin', count: 32 },
    { keyword: 'Fed', count: 28 },
    { keyword: 'OpenAI', count: 24 },
    { keyword: 'semiconductor', count: 19 },
  ],
  totalReads: 342,
  avgReadTime: 4.5,
};

export async function getUserStreak(userId?: string): Promise<UserStreak> {
  if (isDemoMode() || !userId) {
    return MOCK_STREAK;
  }

  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();
  if (!supabase) return MOCK_STREAK;

  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return MOCK_STREAK;
  return data as unknown as UserStreak;
}

export async function getNewsDNA(userId?: string): Promise<NewsDNA> {
  if (isDemoMode() || !userId) {
    return MOCK_DNA;
  }

  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();
  if (!supabase) return MOCK_DNA;

  const { data, error } = await supabase
    .from('user_reads')
    .select('category, source_id, read_at')
    .eq('user_id', userId)
    .gte('read_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error || !data) return MOCK_DNA;
  return MOCK_DNA; // TODO: compute from real data
}

export async function getBookmarks(userId?: string): Promise<Bookmark[]> {
  if (isDemoMode() || !userId) return [];

  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('bookmarks')
    .select('*, news(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []) as unknown as Bookmark[];
}

export async function toggleBookmark(userId: string, newsId: string): Promise<boolean> {
  if (isDemoMode()) return true;

  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();
  if (!supabase) return false;

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('news_id', newsId)
    .single();

  if (existing) {
    await supabase.from('bookmarks').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('bookmarks').insert({ user_id: userId, news_id: newsId });
    return true;
  }
}

export async function getAlerts(userId?: string): Promise<KeywordAlert[]> {
  if (isDemoMode() || !userId) {
    return [
      { id: 'alert-1', userId: 'demo', keyword: 'AI', isActive: true, createdAt: new Date().toISOString(), matchCount: 45 },
      { id: 'alert-2', userId: 'demo', keyword: 'Bitcoin', isActive: true, createdAt: new Date().toISOString(), matchCount: 32 },
      { id: 'alert-3', userId: 'demo', keyword: 'Fed', isActive: false, createdAt: new Date().toISOString(), matchCount: 28 },
    ];
  }

  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('user_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []) as unknown as KeywordAlert[];
}
