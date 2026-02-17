export type GDELTSentiment = {
  country: string;
  avgTone: number;
  articleCount: number;
  themes: string[];
};

export async function collectGDELTSentiment(): Promise<GDELTSentiment[]> {
  try {
    const res = await fetch(
      'https://api.gdeltproject.org/api/v2/summary/summary?d=web&t=summary'
    );
    const text = await res.text();
    // Parse GDELT response - simplified
    return [];
  } catch (error) {
    console.error('Failed to collect GDELT data:', error);
    return [];
  }
}
