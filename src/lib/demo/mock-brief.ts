import { MorningBrief } from '@/types/news';

export const MOCK_BRIEF: MorningBrief = {
  id: 'brief-today',
  date: new Date().toISOString().split('T')[0],
  summary: '오늘의 글로벌 뉴스: 연준 금리 인하 신호, AI 기술 경쟁 심화, EU-중국 무역 합의, 비트코인 신고가, 기후 정상회의 성과',
  generatedAt: new Date().toISOString(),
  items: [
    {
      rank: 1,
      newsId: 'mock-1',
      title: 'Federal Reserve Signals Potential Rate Cut in 2025',
      titleKo: '연준, 2025년 금리 인하 가능성 시사',
      summaryKo: '연방준비제도가 인플레이션 둔화에 따라 올해 내 금리 인하를 시작할 수 있다고 밝혀습니다. 시장은 이미 3회 인하를 선반영하고 있어 실제 정책 변화에 주목해야 합니다.',
      category: 'economy',
      source: 'Bloomberg',
      impact: 'high',
    },
    {
      rank: 2,
      newsId: 'mock-2',
      title: 'OpenAI Announces GPT-5',
      titleKo: 'OpenAI, GPT-5 발표',
      summaryKo: 'OpenAI가 논리적 추론과 코드 생성에서 획기적으로 향상된 GPT-5를 공개했습니다. 이는 AI 산업 전반에 새로운 기준을 제시하며 경쟁사들의 대응이 주목됩니다.',
      category: 'tech',
      source: 'TechCrunch',
      impact: 'high',
    },
    {
      rank: 3,
      newsId: 'mock-3',
      title: 'EU-China Trade Deal on EVs',
      titleKo: 'EU-중국 전기차 무역 합의',
      summaryKo: 'EU와 중국이 수개월간의 협상 끝에 전기차 관세에 대한 합의에 도달했습니다. 이는 글로벌 EV 시장의 판도를 바꿀 수 있는 중요한 결정입니다.',
      category: 'international',
      source: 'Reuters',
      impact: 'high',
    },
    {
      rank: 4,
      newsId: 'mock-7',
      title: 'Bitcoin Surges Past $100K',
      titleKo: '비트코인 10만 달러 돌파',
      summaryKo: '기관 투자자들의 참여 확대로 비트코인이 10만 달러를 돌파했습니다. ETF 자금 유입이 지속되며 암호화폐 시장 전체가 상승세를 보이고 있습니다.',
      category: 'economy',
      source: 'Bloomberg',
      impact: 'medium',
    },
    {
      rank: 5,
      newsId: 'mock-9',
      title: 'Climate Summit Carbon Tax Agreement',
      titleKo: '기후 정상회의 탄소세 합의',
      summaryKo: '150개국이 참여한 기후 정상회의에서 글로벌 탄소 가격 메커니즘에 대한 합의가 이루어졌습니다. 이는 기업 운영 비용에 장기적 영향을 미칠 전망입니다.',
      category: 'international',
      source: 'BBC News',
      impact: 'medium',
    },
  ],
};
export function getMockBrief(date?: string): MorningBrief {
  if (date && date !== new Date().toISOString().split('T')[0]) {
    return {
      ...MOCK_BRIEF,
      id: `brief-${date}`,
      date,
      summary: `${date} 글로벌 뉴스 브리프 (아카이브)`,
    };
  }
  return MOCK_BRIEF;
}
