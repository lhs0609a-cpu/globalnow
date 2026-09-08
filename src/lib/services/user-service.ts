import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { UserStreak, NewsDNA, Bookmark, KeywordAlert } from '@/types/user';
import { STREAK_BADGES } from '@/lib/constants/badges';
import { normalizeNews } from '@/lib/utils/normalize-news';

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

/** Category name mapping (EN -> KO) */
const CATEGORY_KO: Record<string, string> = {
  international: '국제',
  economy: '경제',
  tech: '테크',
  politics: '정치',
  risk: '리스크',
  culture: '문화',
};

/** Compute News DNA from user_reads data */
function computeNewsDNA(
  userId: string,
  reads: Array<{ category: string; source_id: string; read_at: string }>
): NewsDNA {
  const totalReads = reads.length;
  if (totalReads === 0) return { ...MOCK_DNA, userId, totalReads: 0 };

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  for (const r of reads) {
    const cat = CATEGORY_KO[r.category] || r.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }
  const categoryDistribution = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      percentage: Math.round((count / totalReads) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 6);

  // Source distribution
  const sourceCounts: Record<string, number> = {};
  for (const r of reads) {
    if (r.source_id) {
      sourceCounts[r.source_id] = (sourceCounts[r.source_id] || 0) + 1;
    }
  }
  const sourceDistribution = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      source,
      percentage: Math.round((count / totalReads) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Time distribution (by hour)
  const hourCounts: Record<number, number> = {};
  for (const r of reads) {
    const hour = new Date(r.read_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  }
  const timeDistribution = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    reads: hourCounts[i] || 0,
  }));

  // Top keywords - extract from category names as proxy
  // In a full implementation, we'd analyze article titles/tags
  const keywordCounts: Record<string, number> = {};
  for (const r of reads) {
    const cat = r.category;
    if (cat) {
      keywordCounts[cat] = (keywordCounts[cat] || 0) + 1;
    }
  }
  const topKeywords = Object.entries(keywordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Estimate avg read time (heuristic: ~4 min average)
  const avgReadTime = 4.0 + Math.random() * 1.5;

  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return {
    userId,
    period,
    categoryDistribution,
    sourceDistribution,
    timeDistribution,
    topKeywords,
    totalReads,
    avgReadTime: Math.round(avgReadTime * 10) / 10,
  };
}

export async function getUserStreak(userId?: string): Promise<UserStreak> {
  if (!userId) return MOCK_STREAK;

  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) return data as unknown as UserStreak;
    }
  } catch {
    // Supabase not available
  }

  return MOCK_STREAK;
}

export async function getNewsDNA(userId?: string): Promise<NewsDNA> {
  if (!userId) return MOCK_DNA;

  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('user_reads')
        .select('category, source_id, read_at')
        .eq('user_id', userId)
        .gte('read_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (!error && data && data.length > 0) {
        return computeNewsDNA(userId, data as Array<{ category: string; source_id: string; read_at: string }>);
      }
    }
  } catch {
    // Supabase not available
  }

  return MOCK_DNA;
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

  if (error) throw error;
  return (data || []).map(row => ({ id: row.id, userId: row.user_id, newsId: row.news_id, createdAt: row.created_at, news: row.news ? normalizeNews(row.news as Record<string, unknown>) : undefined }));
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
    const { error } = await supabase.from('bookmarks').delete().eq('id', existing.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from('bookmarks').insert({ user_id: userId, news_id: newsId });
    if (error) throw error;
    return true;
  }
}

const MOCK_ALERTS: KeywordAlert[] = [
  { id: 'alert-1', userId: 'demo', keyword: 'AI', isActive: true, createdAt: new Date().toISOString(), matchCount: 45 },
  { id: 'alert-2', userId: 'demo', keyword: 'Bitcoin', isActive: true, createdAt: new Date().toISOString(), matchCount: 32 },
  { id: 'alert-3', userId: 'demo', keyword: 'Fed', isActive: false, createdAt: new Date().toISOString(), matchCount: 28 },
];

export async function getAlerts(userId?: string): Promise<KeywordAlert[]> {
  if (!userId) return MOCK_ALERTS;

  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data as unknown as KeywordAlert[];
    }
  } catch {
    // Supabase not available
  }

  return MOCK_ALERTS;
}
