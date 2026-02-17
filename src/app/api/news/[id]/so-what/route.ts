import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { hasGroq, hasGemini } from '@/lib/demo/is-demo-mode';
import { SoWhatAnalysis } from '@/types/news';

const MOCK_ANALYSIS: SoWhatAnalysis = {
  id: 'sowhat-mock',
  newsId: 'mock',
  keyPoint: '이 뉴스의 핵심은 글로벌 경제 질서의 변화 신호입니다. 단기적인 시장 반응보다 장기적 구조 변화에 주목해야 합니다.',
  background: '최근 2년간 주요국의 정책 기조가 크게 변화하고 있으며, 이번 발표는 그 연장선상에 있습니다.',
  outlook: '향후 3-6개월 내 후속 조치가 예상되며, 관련 산업군에 직접적 영향을 미칠 것입니다.',
  actionItem: 'CEO라면 관련 부서에 영향도 분석을 요청하고, 해당 분야 전문가 의견을 수렴하는 것을 권장합니다.',
  generatedAt: new Date().toISOString(),
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isDemoMode()) {
      return NextResponse.json({ ...MOCK_ANALYSIS, newsId: id });
    }

    // Try to get the news article first
    const { getNewsById } = await import('@/lib/services/news-service');
    const news = await getNewsById(id);
    
    if (!news) {
      return NextResponse.json({ ...MOCK_ANALYSIS, newsId: id });
    }

    const articleText = `Title: ${news.title}
Summary: ${news.summary || ''}`;

    // Try Groq first, then Gemini
    if (hasGroq()) {
      try {
        const { generateWithGroq } = await import('@/lib/ai/groq');
        const { PROMPTS } = await import('@/lib/ai/prompts');
        const prompt = PROMPTS.soWhat(news.title, news.summary || '');
        const result = await generateWithGroq(prompt);
        if (!result) throw new Error('No result');
        const parsed = JSON.parse(result);
        return NextResponse.json({
          id: `sowhat-${id}`,
          newsId: id,
          keyPoint: parsed.keyPoint || parsed.key_point || MOCK_ANALYSIS.keyPoint,
          background: parsed.background || MOCK_ANALYSIS.background,
          outlook: parsed.outlook || MOCK_ANALYSIS.outlook,
          actionItem: parsed.actionItem || parsed.action_item || MOCK_ANALYSIS.actionItem,
          generatedAt: new Date().toISOString(),
        });
      } catch {
        // Fall through to Gemini
      }
    }

    if (hasGemini()) {
      try {
        const { generateWithGemini } = await import('@/lib/ai/gemini');
        const { PROMPTS } = await import('@/lib/ai/prompts');
        const prompt = PROMPTS.soWhat(news.title, news.summary || '');
        const result = await generateWithGemini(prompt);
        if (!result) throw new Error('No result');
        const parsed = JSON.parse(result);
        return NextResponse.json({
          id: `sowhat-${id}`,
          newsId: id,
          keyPoint: parsed.keyPoint || parsed.key_point || MOCK_ANALYSIS.keyPoint,
          background: parsed.background || MOCK_ANALYSIS.background,
          outlook: parsed.outlook || MOCK_ANALYSIS.outlook,
          actionItem: parsed.actionItem || parsed.action_item || MOCK_ANALYSIS.actionItem,
          generatedAt: new Date().toISOString(),
        });
      } catch {
        // Fall through to mock
      }
    }

    return NextResponse.json({ ...MOCK_ANALYSIS, newsId: id });
  } catch {
    return NextResponse.json({ error: 'AI 분석에 실패했습니다' }, { status: 500 });
  }
}
