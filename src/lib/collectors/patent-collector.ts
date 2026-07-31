export type PatentEntry = {
  patentNumber: string;
  title: string;
  abstract: string;
  assignee: string;
  inventors: string[];
  filingDate: string;
  grantDate: string;
  url: string;
};

// Major tech companies for patent tracking
const PATENT_COMPANIES = [
  'Apple',
  'Microsoft',
  'Google',
  'Amazon',
  'NVIDIA',
  'Meta Platforms',
  'Tesla',
  'Samsung Electronics',
  'Intel',
  'AMD',
  'Qualcomm',
  'IBM',
];

type PatentsViewResult = {
  patents?: Array<{
    patent_number?: string;
    patent_title?: string;
    patent_abstract?: string;
    patent_date?: string;
    patent_firstnamed_assignee_id?: string;
    assignees?: Array<{
      assignee_organization?: string;
    }>;
    inventors?: Array<{
      inventor_first_name?: string;
      inventor_last_name?: string;
    }>;
    applications?: Array<{
      app_date?: string;
    }>;
  }>;
  count?: number;
  total_patent_count?: number;
};

/** Collect recent patents from USPTO PatentsView API
 * Note: Legacy API (api.patentsview.org) was discontinued May 2025.
 * New API (search.patentsview.org) requires API key.
 * Falls back gracefully when unavailable. */
export async function collectPatents(): Promise<PatentEntry[]> {
  const patents: PatentEntry[] = [];
  const apiKey = process.env.PATENTSVIEW_API_KEY;

  // New PatentsView API requires an API key
  if (!apiKey) {
    return [];
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  for (const company of PATENT_COMPANIES.slice(0, 6)) {
    try {
      const query = {
        _and: [
          { _gte: { patent_date: thirtyDaysAgo } },
          { _text_any: { 'assignees.assignee_organization': company } },
        ],
      };

      const params = new URLSearchParams({
        q: JSON.stringify(query),
        f: JSON.stringify([
          'patent_id',
          'patent_title',
          'patent_abstract',
          'patent_date',
          'assignees.assignee_organization',
          'inventors.inventor_name_first',
          'inventors.inventor_name_last',
          'applications.filing_date',
        ]),
        o: JSON.stringify({ size: 5 }),
      });

      const res = await fetch(
        `https://search.patentsview.org/api/v1/patent/?${params.toString()}`,
        {
          headers: { Accept: 'application/json', 'X-Api-Key': apiKey },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!res.ok) continue;

      const data: PatentsViewResult = await res.json();
      if (!data.patents) continue;

      for (const p of data.patents) {
        patents.push({
          patentNumber: p.patent_number || '',
          title: p.patent_title || 'Untitled Patent',
          abstract: (p.patent_abstract || '').slice(0, 300),
          assignee: p.assignees?.[0]?.assignee_organization || company,
          inventors: (p.inventors || []).map(
            inv => `${inv.inventor_first_name || ''} ${inv.inventor_last_name || ''}`.trim()
          ),
          filingDate: p.applications?.[0]?.app_date || '',
          grantDate: p.patent_date || '',
          url: `https://patents.google.com/patent/US${p.patent_number}`,
        });
      }

      // Rate limit courtesy
      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error(`Failed to collect patents for ${company}:`, error);
    }
  }

  return patents;
}

/** Collect patents for a specific company */
export async function collectPatentsForCompany(companyName: string): Promise<PatentEntry[]> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const query = {
      _and: [
        { _gte: { patent_date: thirtyDaysAgo } },
        { _text_any: { assignee_organization: companyName } },
      ],
    };

    const params = new URLSearchParams({
      q: JSON.stringify(query),
      f: JSON.stringify([
        'patent_number',
        'patent_title',
        'patent_abstract',
        'patent_date',
        'assignee_organization',
        'inventor_first_name',
        'inventor_last_name',
        'app_date',
      ]),
      o: JSON.stringify({ per_page: 10 }),
    });

    const res = await fetch(
      `https://api.patentsview.org/patents/query?${params.toString()}`,
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) return [];

    const data: PatentsViewResult = await res.json();
    if (!data.patents) return [];

    return data.patents.map(p => ({
      patentNumber: p.patent_number || '',
      title: p.patent_title || 'Untitled Patent',
      abstract: (p.patent_abstract || '').slice(0, 300),
      assignee: p.assignees?.[0]?.assignee_organization || companyName,
      inventors: (p.inventors || []).map(
        inv => `${inv.inventor_first_name || ''} ${inv.inventor_last_name || ''}`.trim()
      ),
      filingDate: p.applications?.[0]?.app_date || '',
      grantDate: p.patent_date || '',
      url: `https://patents.google.com/patent/US${p.patent_number}`,
    }));
  } catch (error) {
    console.error(`Failed to collect patents for ${companyName}:`, error);
    return [];
  }
}
