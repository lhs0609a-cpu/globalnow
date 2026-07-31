import { isDemoMode, hasGroq, hasGemini } from '@/lib/demo/is-demo-mode';
import { getMockBrief } from '@/lib/demo/mock-brief';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { MorningBrief, MorningBriefItem, NewsCategory } from '@/types/news';

/** Generate a brief from live news when DB is not available */
async function generateLiveBrief(date?: string): Promise<MorningBrief | null> {
  try {
    const { getNewsFeed } = await import('@/lib/services/news-service');
    const { items: allNews } = await getNewsFeed({ limit: 30, sortBy: 'latest' });

    if (allNews.length === 0) return null;

    // Select top 5 items with category diversity
    const seen = new Set<string>();
    const selected: typeof allNews = [];

    for (const n of allNews) {
      if (selected.length >= 5) break;
      if (!seen.has(n.category)) {
        seen.add(n.category);
        selected.push(n);
      }
    }
    for (const n of allNews) {
      if (selected.length >= 5) break;
      if (!selected.includes(n)) selected.push(n);
    }

    // Try AI summarization
    let briefItems: MorningBriefItem[];

    if (hasGroq()) {
      briefItems = await aiSummarize('groq', selected);
    } else if (hasGemini()) {
      briefItems = await aiSummarize('gemini', selected);
    } else {
      // Simple extraction
      briefItems = selected.map((n, i) => ({
        rank: i + 1,
        newsId: n.id,
        title: n.title,
        titleKo: n.titleKo || n.title,
        summaryKo: n.summaryKo || n.titleKo || n.title,
        category: n.category,
        source: n.source?.name || n.sourceId,
        impact: (i < 2 ? 'high' : i < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      }));
    }

    const today = date || new Date().toISOString().split('T')[0];

    return {
      id: `brief-${today}`,
      date: today,
      items: briefItems,
      summary: `오늘의 글로벌 뉴스: ${briefItems.map(b => b.titleKo).join(', ')}`,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Live brief generation failed:', error);
    return null;
  }
}

type NewsForAI = { id: string; title: string; titleKo?: string; category: string; source: { name: string } | string; sourceId: string };

/** AI summary fallback chain: Groq -> Gemini -> simple extraction */
async function aiSummarize(provider: 'groq' | 'gemini', news: NewsForAI[]): Promise<MorningBriefItem[]> {
  const prompt = news.slice(0, 10).map((n, i) => {
    const srcName = typeof n.source === 'string' ? n.source : n.source?.name || n.sourceId;
    return `${i + 1}. [${n.category}] ${n.title} (${srcName}) [ID: ${n.id}]`;
  }).join('\n');

  const systemMsg = '뉴스 편집자로서 주어진 뉴스 중 가장 중요한 5개를 선정하고, 각각 2-3문장의 한국어 요약을 작성하세요. JSON만 반환하세요.';
  const userMsg = `뉴스:\n${prompt}\n\nJSON: {"items":[{"newsId":"ID","title":"제목","titleKo":"한국어 제목","summaryKo":"요약","category":"카테고리","impact":"high/medium/low"}]}`;

  try {
    let content: string | null = null;

    if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{ role: 'system', content: systemMsg }, { role: 'user', content: userMsg }],
          temperature: 0.3,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        }),
      });
      if (res.ok) {
        const data = await res.json() as { choices: Array<{ message: { content: string } }> };
        content = data.choices?.[0]?.message?.content || null;
      }
    } else {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemMsg}\n\n${userMsg}` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
        }),
      });
      if (res.ok) {
        const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    }

    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { items: Array<{ newsId: string; title: string; titleKo: string; summaryKo: string; category: string; impact: string }> };
        if (parsed.items && Array.isArray(parsed.items)) {
          return parsed.items.slice(0, 5).map((item, i) => {
            const matched = news.find(n => n.id === item.newsId);
            const srcName = matched
              ? (typeof matched.source === 'string' ? matched.source : matched.source?.name || matched.sourceId)
              : 'Unknown';
            return {
              rank: i + 1,
              newsId: item.newsId || `gen-${i}`,
              title: item.title,
              titleKo: item.titleKo,
              summaryKo: item.summaryKo,
              category: (item.category || 'international') as NewsCategory,
              source: srcName,
              impact: (item.impact || 'medium') as 'high' | 'medium' | 'low',
            };
          });
        }
      }
    }
  } catch (error) {
    console.error(`AI summarize (${provider}) failed:`, error);
  }

  // Fallback: simple extraction
  return news.slice(0, 5).map((n, i) => {
    const srcName = typeof n.source === 'string' ? n.source : n.source?.name || n.sourceId;
    return {
      rank: i + 1,
      newsId: n.id,
      title: n.title,
      titleKo: n.titleKo || n.title,
      summaryKo: n.titleKo || n.title,
      category: n.category as NewsCategory,
      source: srcName,
      impact: (i < 2 ? 'high' : i < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    };
  });
}

export async function getTodayBrief(): Promise<MorningBrief> {
  const today = new Date().toISOString().split('T')[0];

  return cacheGetOrSet(
    `brief:${today}`,
    async () => {
      // Try Supabase first (only if configured)
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('morning_briefs')
              .select('*')
              .eq('date', today)
              .single();

            if (!error && data) return data as unknown as MorningBrief;
          }
        } catch {
          // Supabase not available
        }
      }

      // Generate from live news (works without Supabase)
      const liveBrief = await generateLiveBrief();
      if (liveBrief) return liveBrief;

      return getMockBrief();
    },
    600
  );
}

export async function getBriefByDate(date: string): Promise<MorningBrief> {
  const today = new Date().toISOString().split('T')[0];

  return cacheGetOrSet(
    `brief:${date}`,
    async () => {
      // Try Supabase (only if configured)
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('morning_briefs')
              .select('*')
              .eq('date', date)
              .single();

            if (!error && data) return data as unknown as MorningBrief;
          }
        } catch {
          // Supabase not available
        }
      }

      // For today's date, try generating from live news
      if (date === today) {
        const liveBrief = await generateLiveBrief(date);
        if (liveBrief) return liveBrief;
      }

      return getMockBrief(date);
    },
    3600
  );
}
