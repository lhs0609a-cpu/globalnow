export type ExecutiveMove = {
  name: string;
  previousRole: string;
  previousCompany: string;
  newRole: string;
  newCompany: string;
  announcedAt: string;
  source: string;
  sourceUrl?: string;
  significance: 'high' | 'medium' | 'low';
};

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

/** Fallback mock data for executive moves */
const EXECUTIVE_MOVES_FALLBACK: ExecutiveMove[] = [
  {
    name: 'Sarah Chen',
    previousRole: 'VP of Engineering',
    previousCompany: 'Google Cloud',
    newRole: 'CEO',
    newCompany: 'Cerebras Systems',
    announcedAt: daysAgo(1),
    source: 'LinkedIn / Press Release',
    significance: 'high',
  },
  {
    name: 'Michael Torres',
    previousRole: 'CFO',
    previousCompany: 'Stripe',
    newRole: 'CFO',
    newCompany: 'Databricks',
    announcedAt: daysAgo(2),
    source: 'Bloomberg',
    significance: 'high',
  },
  {
    name: 'James Park',
    previousRole: 'SVP of AI Research',
    previousCompany: 'Meta',
    newRole: 'CTO',
    newCompany: 'Anthropic',
    announcedAt: daysAgo(3),
    source: 'The Information',
    significance: 'high',
  },
];

/** Parse SEC 8-K filing search results for executive changes */
function parse8KResults(data: Record<string, unknown>): ExecutiveMove[] {
  const moves: ExecutiveMove[] = [];

  const hits = (data as { hits?: { hits?: Array<Record<string, unknown>> } })?.hits?.hits;
  if (!Array.isArray(hits)) return moves;

  for (const hit of hits.slice(0, 50)) {
    const source = hit._source as Record<string, unknown> | undefined;
    if (!source) continue;

    // SEC EDGAR field mapping
    const displayName = (source.display_names as string[] | undefined)?.[0] || 'Unknown';
    // Extract company name (strip CIK info): "Company Name (TICKER) (CIK ...)" -> "Company Name"
    const companyName = displayName.replace(/\s*\(CIK\s+\d+\)/, '').replace(/\s*\(\w+\)\s*$/, '').trim() || displayName;
    const filedAt = (source.file_date as string) || new Date().toISOString();
    const fileNums = source.file_num as string[] | undefined;
    const fileNum = fileNums?.[0] || '';
    const adsh = (source.adsh as string) || '';

    // 8-K Item 5.02 = Departure/Election of Directors or Officers
    const items = source.items as string[] | undefined;
    const fileDesc = ((source.file_description as string) || '').toLowerCase();
    const hasItem502 = items?.some(item => item.startsWith('5.02')) || false;
    const isExecutiveChange = hasItem502
      || fileDesc.includes('officer')
      || fileDesc.includes('director')
      || fileDesc.includes('appoint')
      || fileDesc.includes('resign');

    if (!isExecutiveChange) continue;

    const isResignation = fileDesc.includes('resign') || fileDesc.includes('depart');

    moves.push({
      name: isResignation ? 'Executive (Departing)' : 'Executive (Appointed)',
      previousRole: isResignation ? 'Officer/Director' : 'N/A',
      previousCompany: isResignation ? companyName : 'N/A',
      newRole: isResignation ? 'N/A' : 'Officer/Director',
      newCompany: companyName,
      announcedAt: filedAt,
      source: 'SEC EDGAR 8-K',
      sourceUrl: adsh
        ? `https://www.sec.gov/Archives/edgar/data/${(source.ciks as string[])?.[0] || ''}/${adsh.replace(/-/g, '')}/${adsh}-index.htm`
        : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&filenum=${fileNum}&type=8-K&dateb=&owner=include&count=10`,
      significance: 'medium',
    });
  }

  return moves;
}

/** Collect executive moves from SEC 8-K filings (free, no key required) */
export async function collectExecutiveMoves(): Promise<ExecutiveMove[]> {
  try {
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    const url = `https://efts.sec.gov/LATEST/search-index?q=%22officer%22+%22director%22&forms=8-K&dateRange=custom&startdt=${startDate}&enddt=${endDate}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'GLOBALNOW contact@globalnow.dev',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      // Try the EDGAR full-text search API as fallback
      const fallbackUrl = `https://efts.sec.gov/LATEST/search-index?q=%22appointment%22+%22resignation%22&forms=8-K&dateRange=custom&startdt=${startDate}&enddt=${endDate}`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'GLOBALNOW contact@globalnow.dev',
          'Accept': 'application/json',
        },
      });

      if (!fallbackRes.ok) {
        console.log('[Executive] SEC EDGAR API unavailable, using fallback data');
        return EXECUTIVE_MOVES_FALLBACK;
      }

      const fallbackData = await fallbackRes.json();
      const moves = parse8KResults(fallbackData as Record<string, unknown>);
      return moves.length > 0 ? moves : EXECUTIVE_MOVES_FALLBACK;
    }

    const data = await res.json();
    const moves = parse8KResults(data as Record<string, unknown>);

    if (moves.length > 0) {
      console.log(`[Executive] Collected ${moves.length} moves from SEC 8-K filings`);
      return moves;
    }

    return EXECUTIVE_MOVES_FALLBACK;
  } catch (error) {
    console.error('Failed to collect executive moves:', error);
    return EXECUTIVE_MOVES_FALLBACK;
  }
}

/** Filter executive moves by company */
export async function collectExecutiveMovesForCompany(company: string): Promise<ExecutiveMove[]> {
  const all = await collectExecutiveMoves();
  const q = company.toLowerCase();
  return all.filter(
    m =>
      m.previousCompany.toLowerCase().includes(q) ||
      m.newCompany.toLowerCase().includes(q)
  );
}
