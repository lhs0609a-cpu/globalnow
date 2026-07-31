export type EdgarFiling = {
  company: string;
  ticker: string;
  formType: string;
  filedAt: string;
  url: string;
  insiderName?: string;
  transactionType?: string;
  shares?: number;
  value?: number;
};

// Major company CIK numbers for targeted searches
const COMPANY_CIK: Record<string, { cik: string; name: string; ticker: string }> = {
  AAPL: { cik: '0000320193', name: 'Apple', ticker: 'AAPL' },
  MSFT: { cik: '0000789019', name: 'Microsoft', ticker: 'MSFT' },
  NVDA: { cik: '0001045810', name: 'NVIDIA', ticker: 'NVDA' },
  GOOGL: { cik: '0001652044', name: 'Alphabet', ticker: 'GOOGL' },
  AMZN: { cik: '0001018724', name: 'Amazon', ticker: 'AMZN' },
  META: { cik: '0001326801', name: 'Meta Platforms', ticker: 'META' },
  TSLA: { cik: '0001318605', name: 'Tesla', ticker: 'TSLA' },
  JPM: { cik: '0000019617', name: 'JPMorgan Chase', ticker: 'JPM' },
  AMD: { cik: '0000002488', name: 'AMD', ticker: 'AMD' },
  INTC: { cik: '0000050863', name: 'Intel', ticker: 'INTC' },
};

const SEC_USER_AGENT = 'GlobalNow/1.0 admin@globalnow.app';
const EFTS_BASE = 'https://efts.sec.gov/LATEST/search-index';

type EFTSHit = {
  _id: string;
  _source: {
    display_names?: string[];
    file_date?: string;
    form?: string;
    root_forms?: string[];
    file_num?: string[];
    period_ending?: string;
    file_description?: string;
    ciks?: string[];
    adsh?: string;
    items?: string[];
  };
};

type EFTSResponse = {
  hits?: {
    hits?: EFTSHit[];
    total?: { value?: number };
  };
};

async function fetchWithRetry(url: string, retries = 2): Promise<Response | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': SEC_USER_AGENT, Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) return res;
      // SEC rate limit - wait and retry
      if (res.status === 429 && i < retries) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      return null;
    } catch {
      if (i === retries) return null;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return null;
}

/** Collect recent SEC EDGAR filings using the EFTS full-text search API */
export async function collectEdgarFilings(): Promise<EdgarFiling[]> {
  const filings: EdgarFiling[] = [];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];

  // Search for Form 4 (insider trades), 10-K, 10-Q, 8-K for major companies
  // Note: search-index `forms` filter only works for some types (e.g. 8-K)
  // For Form 4, use text query instead
  const formQueries = [
    { formType: '4', queryMode: 'text' },       // Form 4 not in forms filter
    { formType: '10-K', queryMode: 'text' },     // text search fallback
    { formType: '10-Q', queryMode: 'text' },
  ];

  for (const { formType, queryMode } of formQueries) {
    try {
      const params = new URLSearchParams({
        dateRange: 'custom',
        startdt: startDate,
        enddt: endDate,
      });

      if (queryMode === 'text') {
        params.set('q', `"${formType}"`);
      } else {
        params.set('q', '*');
        params.set('forms', formType);
      }

      const url = `${EFTS_BASE}?${params.toString()}`;
      const res = await fetchWithRetry(url);
      if (!res) continue;

      const data: EFTSResponse = await res.json();
      const hits = data.hits?.hits || [];

      for (const hit of hits.slice(0, 15)) {
        const src = hit._source;
        if (!src) continue;

        // Extract company name from display_names
        const displayName = src.display_names?.[0] || '';
        // Parse: "Company Name (TICKER) (CIK 000xxx)"
        const tickerMatch = displayName.match(/\(([A-Z]{1,5})\)/);
        const entityName = displayName.replace(/\s*\(CIK\s+\d+\)/, '').replace(/\s*\([A-Z]{1,5}\)\s*/, '').trim();

        // Try to match to our known companies
        const matchedCompany = Object.values(COMPANY_CIK).find(c =>
          entityName.toLowerCase().includes(c.name.toLowerCase()) ||
          (tickerMatch && tickerMatch[1] === c.ticker)
        );

        const formLabel =
          formType === '4' ? 'Form 4 (Insider Trade)' :
          formType === '10-K' ? '10-K (Annual Report)' :
          '10-Q (Quarterly Report)';

        const cik = src.ciks?.[0] || '';
        const adsh = src.adsh || '';

        filings.push({
          company: matchedCompany?.name || entityName,
          ticker: matchedCompany?.ticker || tickerMatch?.[1] || '',
          formType: formLabel,
          filedAt: src.file_date || new Date().toISOString(),
          url: adsh
            ? `https://www.sec.gov/Archives/edgar/data/${cik}/${adsh.replace(/-/g, '')}/${adsh}-index.htm`
            : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=${formType}&dateb=&owner=include&count=10`,
        });
      }

      // Be respectful of SEC rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch (error) {
      console.error(`Failed to collect EDGAR ${formType} filings:`, error);
    }
  }

  return filings;
}

/** Collect filings for specific companies by CIK */
export async function collectEdgarForCompany(ticker: string): Promise<EdgarFiling[]> {
  const company = COMPANY_CIK[ticker.toUpperCase()];
  if (!company) return [];

  try {
    const url = `${EFTS_BASE}?q=%22${company.cik}%22&dateRange=custom&startdt=${
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }`;

    const res = await fetchWithRetry(url);
    if (!res) return [];

    const data: EFTSResponse = await res.json();
    const hits = data.hits?.hits || [];

    return hits.slice(0, 5).map(hit => ({
      company: company.name,
      ticker: company.ticker,
      formType: hit._source?.form || hit._source?.root_forms?.[0] || 'Unknown',
      filedAt: hit._source?.file_date || new Date().toISOString(),
      url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${company.cik}&type=&dateb=&owner=include&count=10`,
    }));
  } catch (error) {
    console.error(`Failed to collect EDGAR filings for ${ticker}:`, error);
    return [];
  }
}
