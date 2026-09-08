import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { MOCK_SIGNALS } from '@/lib/demo/mock-signals';

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

export type SignalFilters = {
  type?: string;
  company?: string;
  significance?: string;
  page?: number;
  limit?: number;
};

export type SignalResult = {
  signals: Signal[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  isLive: boolean;
};

/** Convert EDGAR filings to signals */
function edgarToSignals(filings: import('@/lib/collectors/edgar-collector').EdgarFiling[]): Signal[] {
  return filings.map((f, i) => {
    const isInsider = f.formType.includes('4') || f.formType.includes('Insider');
    return {
      id: `edgar-${Date.now()}-${i}`,
      type: isInsider ? 'insider_trade' as const : 'sec_filing' as const,
      title: `${f.company} files ${f.formType}`,
      titleKo: `${f.company}, ${f.formType} 제출`,
      description: f.insiderName
        ? `${f.insiderName} ${f.transactionType || 'filed'} ${f.shares ? f.shares.toLocaleString() + ' shares' : ''}`
        : `${f.company} filed ${f.formType} with the SEC`,
      descriptionKo: f.insiderName
        ? `${f.insiderName}이(가) ${f.shares ? f.shares.toLocaleString() + '주' : ''} ${f.transactionType === 'Buy' ? '매수' : '매도'}`
        : `${f.company}이(가) SEC에 ${f.formType}을(를) 제출했습니다`,
      company: f.company,
      ticker: f.ticker,
      value: f.value,
      source: 'SEC EDGAR',
      sourceUrl: f.url,
      detectedAt: f.filedAt,
      significance: f.value && f.value > 10000000 ? 'high' : f.value && f.value > 1000000 ? 'medium' : 'low',
    };
  });
}

/** Convert patents to signals */
function patentsToSignals(patents: import('@/lib/collectors/patent-collector').PatentEntry[]): Signal[] {
  return patents.map((p, i) => ({
    id: `patent-${Date.now()}-${i}`,
    type: 'patent' as const,
    title: `${p.assignee} patents: ${p.title}`,
    titleKo: `${p.assignee} 특허: ${p.title}`,
    description: p.abstract || `Patent ${p.patentNumber} by ${p.inventors.join(', ')}`,
    descriptionKo: p.abstract || `특허 ${p.patentNumber}, 발명자: ${p.inventors.join(', ')}`,
    company: p.assignee,
    source: 'USPTO',
    sourceUrl: p.url,
    detectedAt: p.grantDate || p.filingDate || new Date().toISOString(),
    significance: 'medium' as const,
  }));
}

/** Convert executive moves to signals */
function executiveToSignals(moves: import('@/lib/collectors/executive-collector').ExecutiveMove[]): Signal[] {
  return moves.map((m, i) => ({
    id: `exec-${Date.now()}-${i}`,
    type: 'executive_move' as const,
    title: `${m.previousCompany} ${m.previousRole} joins ${m.newCompany} as ${m.newRole}`,
    titleKo: `${m.previousCompany} ${m.previousRole}, ${m.newCompany} ${m.newRole}로 이직`,
    description: `${m.name} moves from ${m.previousCompany} (${m.previousRole}) to ${m.newCompany} (${m.newRole})`,
    descriptionKo: `${m.name}이(가) ${m.previousCompany}(${m.previousRole})에서 ${m.newCompany}(${m.newRole})로 이동했습니다`,
    company: m.newCompany,
    source: m.source,
    sourceUrl: m.sourceUrl || '',
    detectedAt: m.announcedAt,
    significance: m.significance,
  }));
}

/** Collect signals from all real API sources */
async function collectLiveSignals(): Promise<Signal[]> {
  const signals: Signal[] = [];

  // Collect from multiple sources in parallel
  const [edgarResult, patentResult, executiveResult] = await Promise.allSettled([
    import('@/lib/collectors/edgar-collector').then(m => m.collectEdgarFilings()),
    import('@/lib/collectors/patent-collector').then(m => m.collectPatents()),
    import('@/lib/collectors/executive-collector').then(m => m.collectExecutiveMoves()),
  ]);

  const sources: string[] = [];

  if (edgarResult.status === 'fulfilled' && edgarResult.value.length > 0) {
    signals.push(...edgarToSignals(edgarResult.value));
    sources.push(`EDGAR:${edgarResult.value.length}`);
  }

  if (patentResult.status === 'fulfilled' && patentResult.value.length > 0) {
    signals.push(...patentsToSignals(patentResult.value));
    sources.push(`Patents:${patentResult.value.length}`);
  }

  if (executiveResult.status === 'fulfilled' && executiveResult.value.length > 0) {
    signals.push(...executiveToSignals(executiveResult.value));
    sources.push(`Executive:${executiveResult.value.length}`);
  }

  if (sources.length > 0) {
    console.log(`[Signals] Collected live: ${sources.join(', ')} → total ${signals.length}`);
  }

  return signals;
}

/** Get all signals with filters and pagination */
export async function getSignals(filters: SignalFilters = {}): Promise<SignalResult> {
  const { type, company, significance, page = 1, limit = 20 } = filters;

  let isLive = false;

  // Always try live API collection (free APIs work without Supabase)
  const result = await cacheGetOrSet<{ signals: Signal[]; isLive: boolean }>(
    'signals:all',
    async () => {
      // Try live API collection first
      try {
        const liveSignals = await collectLiveSignals();
        if (liveSignals.length > 0) {
          return { signals: liveSignals, isLive: true };
        }
      } catch (error) {
        console.error('Failed to collect live signals:', error);
      }

      // Try Supabase (only if not demo mode)
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('signals')
              .select('*')
              .order('detected_at', { ascending: false })
              .limit(100);

            if (!error && data && data.length > 0) {
              return { signals: data as unknown as Signal[], isLive: true };
            }
          }
        } catch {
          // Supabase not available
        }
      }

      // Final fallback: mock data only when all live sources fail
      console.log('[Signals] All live sources failed, falling back to mock data');
      return { signals: MOCK_SIGNALS, isLive: false };
    },
    300
  );
  const allSignals = result.signals;
  isLive = result.isLive;

  // Apply filters
  let filtered = allSignals;

  if (type && type !== 'all') {
    filtered = filtered.filter(s => s.type === type);
  }

  if (company) {
    const q = company.toLowerCase();
    filtered = filtered.filter(s =>
      (s.company?.toLowerCase().includes(q)) ||
      (s.ticker?.toLowerCase().includes(q))
    );
  }

  if (significance && significance !== 'all') {
    filtered = filtered.filter(s => s.significance === significance);
  }

  // Sort by detectedAt descending
  filtered.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    signals: paginated,
    total,
    page,
    limit,
    hasMore: start + limit < total,
    isLive,
  };
}
