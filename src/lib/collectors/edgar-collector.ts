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

export async function collectEdgarFilings(): Promise<EdgarFiling[]> {
  try {
    const res = await fetch(
      'https://efts.sec.gov/LATEST/search-index?q=%22Form+4%22&dateRange=custom&startdt=' +
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      { headers: { 'User-Agent': 'GLOBALNOW admin@globalnow.app' } }
    );

    if (!res.ok) return [];

    // Parse SEC EDGAR response
    return [];
  } catch (error) {
    console.error('Failed to collect EDGAR filings:', error);
    return [];
  }
}
