import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { INDUSTRIES } from '@/lib/constants/industries';
import { PROMPTS } from '@/lib/ai/prompts';
import { generateWithGroq } from '@/lib/ai/groq';
import { generateWithGemini } from '@/lib/ai/gemini';
import { IndustryId, WeeklyReportContent } from '@/types/report';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({ success: true, message: 'Demo mode - report generation skipped' });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetIndustry = (body as { industry?: IndustryId }).industry;
    const industries = targetIndustry
      ? INDUSTRIES.filter(i => i.id === targetIndustry)
      : INDUSTRIES;

    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Calculate current week
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekStart = monday.toISOString().split('T')[0];
    const weekEnd = sunday.toISOString().split('T')[0];

    const results: { industry: string; success: boolean; error?: string }[] = [];

    for (const industry of industries) {
      try {
        // Fetch this week's news matching industry keywords
        const orConditions = industry.keywords
          .map(kw => `title.ilike.%${kw}%,title_ko.ilike.%${kw}%,summary.ilike.%${kw}%`)
          .join(',');

        const { data: newsData } = await supabase
          .from('news')
          .select('title, title_ko, summary, summary_ko, source_id, published_at')
          .or(orConditions)
          .gte('published_at', weekStart)
          .lte('published_at', weekEnd + 'T23:59:59Z')
          .order('published_at', { ascending: false })
          .limit(30);

        if (!newsData || newsData.length === 0) {
          results.push({ industry: industry.id, success: false, error: 'No news found' });
          continue;
        }

        const articles = newsData.map(n =>
          `[${n.source_id}] ${n.title}\n${n.title_ko || ''}\n${n.summary || ''}\n${n.summary_ko || ''}`
        );

        const prompt = PROMPTS.weeklyReport(industry.nameKo, industry.keywords, articles);

        // Try Groq first, then Gemini
        let response = await generateWithGroq(prompt, 'You are a senior Korean industry analyst.');
        if (!response) {
          response = await generateWithGemini(prompt);
        }

        if (!response) {
          results.push({ industry: industry.id, success: false, error: 'AI generation failed' });
          continue;
        }

        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          results.push({ industry: industry.id, success: false, error: 'Invalid AI response' });
          continue;
        }

        const content: WeeklyReportContent = JSON.parse(jsonMatch[0]);

        // Upsert to weekly_reports
        const { error: upsertError } = await supabase
          .from('weekly_reports')
          .upsert(
            {
              industry: industry.id,
              week_start: weekStart,
              week_end: weekEnd,
              content,
              generated_at: new Date().toISOString(),
            },
            { onConflict: 'industry,week_start' }
          );

        if (upsertError) {
          results.push({ industry: industry.id, success: false, error: upsertError.message });
        } else {
          results.push({ industry: industry.id, success: true });
        }
      } catch (err) {
        results.push({ industry: industry.id, success: false, error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      weekStart,
      weekEnd,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weekly report generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
