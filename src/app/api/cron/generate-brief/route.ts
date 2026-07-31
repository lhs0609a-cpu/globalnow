import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { hasGroq, hasGemini } from '@/lib/demo/is-demo-mode';
import { MorningBriefItem, NewsCategory } from '@/types/news';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ success: true, message: 'Demo mode - brief generation skipped' });
  }

  try {
    // 1. Fetch last 12 hours of news
    const { getNewsFeed } = await import('@/lib/services/news-service');
    const { items: allNews } = await getNewsFeed({ limit: 50, sortBy: 'latest' });

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const recentNews = allNews.filter(n => n.publishedAt >= twelveHoursAgo);
    const newsToProcess = recentNews.length > 5 ? recentNews : allNews.slice(0, 20);

    // 2. Select top 5 and generate summaries via AI
    let briefItems: MorningBriefItem[];

    if (hasGroq()) {
      briefItems = await generateWithGroq(newsToProcess);
    } else if (hasGemini()) {
      briefItems = await generateWithGemini(newsToProcess);
    } else {
      // Simple extraction fallback - no AI needed
      briefItems = simpleExtract(newsToProcess);
    }

    const today = new Date().toISOString().split('T')[0];
    const summary = briefItems.map(b => b.titleKo).join(', ');

    const briefData = {
      id: `brief-${today}`,
      date: today,
      items: briefItems,
      summary: `오늘의 글로벌 뉴스: ${summary}`,
      generatedAt: new Date().toISOString(),
    };

    // 3. Save to Supabase if available
    try {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (supabase) {
        await supabase
          .from('morning_briefs')
          .upsert({
            id: briefData.id,
            date: briefData.date,
            items: briefData.items,
            summary: briefData.summary,
            generated_at: briefData.generatedAt,
          }, { onConflict: 'date' });
      }
    } catch {
      console.log('[Brief] Supabase save skipped');
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      itemCount: briefItems.length,
    });
  } catch (error) {
    console.error('Brief generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

type NewsInput = { id: string; title: string; titleKo?: string; summaryKo?: string; category: NewsCategory; source: { name: string } | string; sourceId: string };

/** Generate brief items using Groq API */
async function generateWithGroq(news: NewsInput[]): Promise<MorningBriefItem[]> {
  try {
    const prompt = buildPrompt(news);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a news editor. Select the top 5 most important stories and provide Korean summaries. Return valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) return simpleExtract(news);

    const data = await res.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return simpleExtract(news);

    return parseAIResponse(content, news);
  } catch {
    return simpleExtract(news);
  }
}

/** Generate brief items using Gemini API */
async function generateWithGemini(news: NewsInput[]): Promise<MorningBriefItem[]> {
  try {
    const prompt = buildPrompt(news);
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a news editor. Select the top 5 most important stories and provide Korean summaries. Return valid JSON only.\n\n${prompt}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
      }),
    });

    if (!res.ok) return simpleExtract(news);

    const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) return simpleExtract(news);

    return parseAIResponse(content, news);
  } catch {
    return simpleExtract(news);
  }
}

/** Build the prompt for AI models */
function buildPrompt(news: NewsInput[]): string {
  const newsList = news.slice(0, 20).map((n, i) => {
    const sourceName = typeof n.source === 'string' ? n.source : n.source?.name || n.sourceId;
    return `${i + 1}. [${n.category}] ${n.title} (${sourceName}) [ID: ${n.id}]`;
  }).join('\n');

  return `다음 뉴스 목록에서 가장 중요한 5개를 선정하고 각각에 대해 한국어 요약을 작성해주세요.

뉴스 목록:
${newsList}

JSON 형식으로 응답해주세요:
{"items": [{"newsId": "ID", "title": "영어 제목", "titleKo": "한국어 제목", "summaryKo": "2-3문장 한국어 요약", "category": "카테고리", "impact": "high/medium/low"}]}`;
}

/** Parse AI response JSON */
function parseAIResponse(content: string, news: NewsInput[]): MorningBriefItem[] {
  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return simpleExtract(news);

    const parsed = JSON.parse(jsonMatch[0]) as { items: Array<{ newsId: string; title: string; titleKo: string; summaryKo: string; category: string; impact: string }> };
    if (!parsed.items || !Array.isArray(parsed.items)) return simpleExtract(news);

    return parsed.items.slice(0, 5).map((item, i) => {
      const matchedNews = news.find(n => n.id === item.newsId);
      const sourceName = matchedNews
        ? (typeof matchedNews.source === 'string' ? matchedNews.source : matchedNews.source?.name || matchedNews.sourceId)
        : 'Unknown';
      return {
        rank: i + 1,
        newsId: item.newsId || `gen-${i}`,
        title: item.title,
        titleKo: item.titleKo,
        summaryKo: item.summaryKo,
        category: (item.category || 'international') as NewsCategory,
        source: sourceName,
        impact: (item.impact || 'medium') as 'high' | 'medium' | 'low',
      };
    });
  } catch {
    return simpleExtract(news);
  }
}

/** Simple extraction fallback - no AI needed */
function simpleExtract(news: NewsInput[]): MorningBriefItem[] {
  // Pick top 5 by diversity of category
  const seen = new Set<string>();
  const selected: NewsInput[] = [];

  for (const n of news) {
    if (selected.length >= 5) break;
    if (!seen.has(n.category)) {
      seen.add(n.category);
      selected.push(n);
    }
  }

  // Fill remaining slots
  for (const n of news) {
    if (selected.length >= 5) break;
    if (!selected.includes(n)) {
      selected.push(n);
    }
  }

  return selected.map((n, i) => {
    const sourceName = typeof n.source === 'string' ? n.source : n.source?.name || n.sourceId;
    return {
      rank: i + 1,
      newsId: n.id,
      title: n.title,
      titleKo: n.titleKo || n.title,
      summaryKo: n.summaryKo || n.titleKo || n.title,
      category: n.category,
      source: sourceName,
      impact: (i < 2 ? 'high' : i < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    };
  });
}
