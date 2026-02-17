export type CollectedHumor = {
  title: string;
  url: string;
  imageUrl?: string;
  source: string;
  type: 'meme' | 'gif' | 'satire' | 'comic';
  upvotes: number;
};

export async function collectHumor(): Promise<CollectedHumor[]> {
  const results: CollectedHumor[] = [];

  // Collect from various humor RSS feeds
  try {
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser({ timeout: 10000 });

    // The Onion (satire)
    try {
      const feed = await parser.parseURL('https://www.theonion.com/rss');
      feed.items?.slice(0, 10).forEach(item => {
        results.push({
          title: item.title || '',
          url: item.link || '',
          source: 'The Onion',
          type: 'satire',
          upvotes: Math.floor(Math.random() * 10000),
        });
      });
    } catch { /* skip */ }
  } catch (error) {
    console.error('Failed to collect humor:', error);
  }

  return results;
}
