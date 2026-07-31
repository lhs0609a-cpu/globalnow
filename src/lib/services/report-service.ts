import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { getMockReport, getMockReports } from '@/lib/demo/mock-reports';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { IndustryId, WeeklyReport, WeeklyReportContent, ReportIssue } from '@/types/report';
import { getNewsFeed } from '@/lib/services/news-service';

/** Industry keyword mapping for news filtering */
const INDUSTRY_KEYWORDS: Record<IndustryId, string[]> = {
  semiconductor: ['semiconductor', 'chip', 'TSMC', 'Samsung', 'Intel', 'ASML', 'foundry', 'wafer', 'fab', 'NVIDIA'],
  ai: ['AI', 'OpenAI', 'GPT', 'LLM', 'machine learning', 'deep learning', 'Claude', 'Gemini', 'artificial intelligence'],
  battery: ['battery', 'lithium', 'EV battery', 'CATL', 'LG Energy', 'solid-state', 'cathode', 'anode'],
  ev: ['EV', 'electric vehicle', 'Tesla', 'BYD', 'Rivian', 'charging', 'autonomous driving'],
  fintech: ['fintech', 'crypto', 'blockchain', 'DeFi', 'digital bank', 'payment', 'Bitcoin', 'stablecoin'],
  bio: ['biotech', 'pharma', 'drug', 'FDA', 'clinical trial', 'gene therapy', 'mRNA', 'CRISPR'],
  energy: ['energy', 'solar', 'wind', 'nuclear', 'hydrogen', 'renewable', 'oil', 'natural gas', 'OPEC'],
  defense: ['defense', 'military', 'missile', 'NATO', 'arms', 'drone', 'cybersecurity', 'Pentagon'],
  cloud: ['cloud', 'AWS', 'Azure', 'GCP', 'SaaS', 'Kubernetes', 'serverless', 'data center'],
};

/** Generate a live report from recent news articles */
async function generateLiveReport(industry: IndustryId): Promise<WeeklyReport | null> {
  try {
    const keywords = INDUSTRY_KEYWORDS[industry];
    if (!keywords) return null;

    // Fetch recent news
    const { items: allNews } = await getNewsFeed({ limit: 50 });
    if (allNews.length === 0) return null;

    // Filter by industry keywords
    const matched = allNews.filter(news => {
      const text = `${news.title} ${news.titleKo || ''} ${news.summary || ''}`.toLowerCase();
      return keywords.some(kw => text.includes(kw.toLowerCase()));
    });

    if (matched.length === 0) return null;

    // Build report content from matched news
    const topIssues: ReportIssue[] = matched.slice(0, 5).map(news => ({
      title: news.titleKo || news.title,
      summary: news.summary || news.title,
      impact: 'neutral' as const,
    }));

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday

    const content: WeeklyReportContent = {
      headline: `${industry.toUpperCase()} 주간 리포트: ${topIssues[0]?.title || '주요 동향'}`,
      topIssues,
      marketImpact: `이번 주 ${industry} 섹터에서 ${matched.length}건의 관련 뉴스가 발생했습니다.`,
      outlook: `${matched.length}건의 뉴스 기반 분석 결과, ${industry} 산업 동향을 주시할 필요가 있습니다.`,
      upcomingEvents: [],
    };

    const report: WeeklyReport = {
      id: `live-${industry}-${weekStart.toISOString().slice(0, 10)}`,
      industry,
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      content,
      generatedAt: now.toISOString(),
    };

    console.log(`[Report] Generated live report for ${industry} with ${matched.length} articles`);
    return report;
  } catch (error) {
    console.error(`[Report] Live report generation failed for ${industry}:`, error);
    return null;
  }
}

export async function getLatestReport(industry: IndustryId): Promise<WeeklyReport | null> {
  return cacheGetOrSet(
    `report:latest:${industry}`,
    async () => {
      // Try live news-based report first
      const liveReport = await generateLiveReport(industry);
      if (liveReport) return liveReport;

      // Try Supabase if available
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('weekly_reports')
              .select('*')
              .eq('industry', industry)
              .order('week_start', { ascending: false })
              .limit(1)
              .single();

            if (!error && data) {
              return {
                id: data.id,
                industry: data.industry,
                weekStart: data.week_start,
                weekEnd: data.week_end,
                content: data.content,
                generatedAt: data.generated_at,
              } as WeeklyReport;
            }
          }
        } catch {
          // Supabase not available
        }
      }

      return getMockReport(industry);
    },
    3600
  );
}

export async function getReportByWeek(
  industry: IndustryId,
  weekStart: string
): Promise<WeeklyReport | null> {
  return cacheGetOrSet(
    `report:${industry}:${weekStart}`,
    async () => {
      // Try Supabase if available
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('weekly_reports')
              .select('*')
              .eq('industry', industry)
              .eq('week_start', weekStart)
              .single();

            if (!error && data) {
              return {
                id: data.id,
                industry: data.industry,
                weekStart: data.week_start,
                weekEnd: data.week_end,
                content: data.content,
                generatedAt: data.generated_at,
              } as WeeklyReport;
            }
          }
        } catch {
          // Supabase not available
        }
      }

      return getMockReport(industry, weekStart);
    },
    3600
  );
}

export async function getAllReports(industry?: IndustryId): Promise<WeeklyReport[]> {
  return cacheGetOrSet(
    `reports:all:${industry || 'all'}`,
    async () => {
      // Try generating a live report for the latest week
      if (industry) {
        const liveReport = await generateLiveReport(industry);
        if (liveReport) return [liveReport];
      }

      // Try Supabase if available
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            let query = supabase
              .from('weekly_reports')
              .select('*')
              .order('week_start', { ascending: false })
              .limit(12);

            if (industry) {
              query = query.eq('industry', industry);
            }

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
              return data.map(row => ({
                id: row.id,
                industry: row.industry,
                weekStart: row.week_start,
                weekEnd: row.week_end,
                content: row.content,
                generatedAt: row.generated_at,
              })) as WeeklyReport[];
            }
          }
        } catch {
          // Supabase not available
        }
      }

      return getMockReports(industry);
    },
    3600
  );
}
