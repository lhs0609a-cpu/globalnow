import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { cacheGetOrSet } from '@/lib/redis/cache';

export type Signal = {
  id: string;
  type: 'insider_trade' | 'sec_filing' | 'patent' | 'executive_move';
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  company?: string;
  ticker?: string;
  value?: number;
  source: string;
  sourceUrl: string;
  detectedAt: string;
  significance: 'high' | 'medium' | 'low';
};

const MOCK_SIGNALS: Signal[] = [
  {
    id: 'sig-1',
    type: 'insider_trade',
    title: 'NVIDIA CEO sells $50M in shares',
    titleKo: 'NVIDIA CEO, 5천만 달러 주식 매도',
    description: 'Jensen Huang sold 240,000 shares under a pre-arranged 10b5-1 trading plan.',
    descriptionKo: '젠슨 황이 사전 설정된 10b5-1 거래 계획에 따라 24만 주를 매도했습니다.',
    company: 'NVIDIA',
    ticker: 'NVDA',
    value: 50000000,
    source: 'SEC EDGAR',
    sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar',
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    significance: 'high',
  },
  {
    id: 'sig-2',
    type: 'sec_filing',
    title: 'Tesla files 10-K with significant risk factor updates',
    titleKo: '테슬라, 주요 위험 요인 업데이트된 10-K 제출',
    description: 'Tesla updated its annual report with new risk disclosures related to AI regulation.',
    descriptionKo: '테슬라가 AI 규제 관련 새로운 위험 공시가 포함된 연차 보고서를 제출했습니다.',
    company: 'Tesla',
    ticker: 'TSLA',
    source: 'SEC EDGAR',
    sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar',
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    significance: 'medium',
  },
  {
    id: 'sig-3',
    type: 'executive_move',
    title: 'Google Cloud VP joins AI startup as CEO',
    titleKo: '구글 클라우드 VP, AI 스타트업 CEO로 이직',
    description: 'Former Google Cloud VP of Engineering moves to lead a well-funded AI infrastructure startup.',
    descriptionKo: '전 구글 클라우드 엔지니어링 VP가 대규모 투자를 받은 AI 인프라 스타트업의 CEO로 합류했습니다.',
    company: 'Google',
    ticker: 'GOOGL',
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com',
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    significance: 'medium',
  },
  {
    id: 'sig-4',
    type: 'patent',
    title: 'Apple patents new AR display technology',
    titleKo: '애플, 새로운 AR 디스플레이 기술 특허 취득',
    description: 'Apple received a patent for a novel augmented reality projection system.',
    descriptionKo: '애플이 새로운 증강현실 프로젝션 시스템에 대한 특허를 취득했습니다.',
    company: 'Apple',
    ticker: 'AAPL',
    source: 'USPTO',
    sourceUrl: 'https://www.uspto.gov',
    detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    significance: 'low',
  },
];

export async function getSignals(): Promise<Signal[]> {
  if (isDemoMode()) return MOCK_SIGNALS;

  return cacheGetOrSet(
    'signals:latest',
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return MOCK_SIGNALS;

      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(20);

      if (error) return MOCK_SIGNALS;
      return (data || []) as unknown as Signal[];
    },
    300
  );
}
