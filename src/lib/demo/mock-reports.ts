import { WeeklyReport, IndustryId } from '@/types/report';

function getWeekDates(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  };
}

const { weekStart, weekEnd } = getWeekDates();

export const MOCK_REPORTS: WeeklyReport[] = [
  {
    id: 'report-semi-1',
    industry: 'semiconductor',
    weekStart,
    weekEnd,
    content: {
      headline: 'HBM4 양산 경쟁 본격화, TSMC 3nm 캐파 확장 발표',
      topIssues: [
        {
          title: 'SK하이닉스 HBM4 샘플 출하 개시',
          summary: 'SK하이닉스가 HBM4 엔지니어링 샘플을 NVIDIA에 출하했으며, 양산은 2026년 하반기 목표입니다. 12단 적층 기술을 적용해 대역폭이 HBM3E 대비 50% 향상됐습니다.',
          impact: 'positive',
        },
        {
          title: 'TSMC 구마모토 제2공장 착공',
          summary: 'TSMC가 일본 구마모토 제2공장 착공을 발표했습니다. 6nm 이하 공정을 도입하며, 일본 정부가 7,400억 엔을 지원합니다.',
          impact: 'positive',
        },
        {
          title: '미국 대중 반도체 수출규제 추가 강화',
          summary: '미 상무부가 중국향 AI 가속기 수출규제를 다시 강화했습니다. NVIDIA H200 등급 이상의 칩이 사실상 전면 차단되어 관련 기업 매출에 영향이 예상됩니다.',
          impact: 'negative',
        },
      ],
      marketImpact: '반도체 섹터 전반적으로 강세. 필라델피아 반도체지수(SOX) 주간 +3.2%. HBM 관련주(SK하이닉스, 마이크론) 특히 강세. 다만 대중 수출규제 우려로 NVIDIA는 -1.5% 약세.',
      outlook: 'AI 수요 확대에 따른 HBM 시장 성장이 지속될 전망입니다. 다만 미중 기술패권 경쟁이 심화되며, 공급망 재편이 가속화될 것으로 보입니다. 투자자들은 지정학적 리스크를 주시해야 합니다.',
      upcomingEvents: [
        'NVIDIA GTC 2026 (2/24~27)',
        'SK하이닉스 실적발표 (2/20)',
        'SEMI 반도체 장비 시장 전망 보고서 발간 (2/19)',
      ],
    },
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'report-ai-1',
    industry: 'ai',
    weekStart,
    weekEnd,
    content: {
      headline: 'GPT-5 발표 임박, 오픈소스 LLM 성능 급성장',
      topIssues: [
        {
          title: 'OpenAI GPT-5 발표 예고',
          summary: 'OpenAI가 GPT-5의 공개를 예고하며, 멀티모달 추론 능력이 대폭 향상될 것이라고 밝혔습니다. 기업용 API 가격은 GPT-4 대비 30% 인하될 전망입니다.',
          impact: 'positive',
        },
        {
          title: 'Meta Llama 4 오픈소스 공개',
          summary: 'Meta가 Llama 4를 오픈소스로 공개했습니다. 400B 파라미터 MoE 모델로, GPT-4 수준의 성능을 달성하며 오픈소스 진영의 경쟁력이 크게 강화됐습니다.',
          impact: 'positive',
        },
        {
          title: 'EU AI Act 시행 개시',
          summary: 'EU의 AI 규제법(AI Act)이 본격 시행됩니다. 고위험 AI 시스템에 대한 의무 준수 요건이 적용되며, 글로벌 AI 기업들의 규제 대응 비용 증가가 예상됩니다.',
          impact: 'negative',
        },
      ],
      marketImpact: 'AI 관련주 혼조세. Microsoft(+2.1%), Alphabet(+1.8%) 강세. 반면 중소 AI 기업들은 EU 규제 우려로 약세. AI 인프라(데이터센터, GPU) 관련 ETF는 주간 +2.5% 상승.',
      outlook: 'AI 모델 성능 경쟁이 정점으로 향하며, 향후 차별화는 애플리케이션 레이어에서 이루어질 전망입니다. 규제 환경 변화에 따른 컴플라이언스 비용이 새로운 변수로 부상하고 있습니다.',
      upcomingEvents: [
        'OpenAI DevDay 2026 (2/25)',
        'Google I/O 2026 (2/28)',
        'Anthropic Claude 신규 모델 발표 예정 (2/21)',
      ],
    },
    generatedAt: new Date().toISOString(),
  },
];

export function getMockReport(industry?: IndustryId, weekStartDate?: string): WeeklyReport | null {
  let reports = MOCK_REPORTS;
  if (industry) {
    reports = reports.filter(r => r.industry === industry);
  }
  if (weekStartDate) {
    reports = reports.filter(r => r.weekStart === weekStartDate);
  }
  return reports[0] || null;
}

export function getMockReports(industry?: IndustryId): WeeklyReport[] {
  if (industry) {
    return MOCK_REPORTS.filter(r => r.industry === industry);
  }
  return MOCK_REPORTS;
}
