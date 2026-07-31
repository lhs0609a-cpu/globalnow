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

  // Collect from all sources in parallel
  const [xkcd, reddit, rss] = await Promise.allSettled([
    collectXKCD(),
    collectRedditProgrammerHumor(),
    collectSatireRSS(),
  ]);

  if (xkcd.status === 'fulfilled') results.push(...xkcd.value);
  if (reddit.status === 'fulfilled') results.push(...reddit.value);
  if (rss.status === 'fulfilled') results.push(...rss.value);

  return results;
}

/** Collect latest XKCD comics (free, no key required) */
async function collectXKCD(): Promise<CollectedHumor[]> {
  const results: CollectedHumor[] = [];

  try {
    // Get latest comic
    const res = await fetch('https://xkcd.com/info.0.json', {
      headers: { 'User-Agent': 'GLOBALNOW/1.0' },
    });

    if (!res.ok) return results;

    const latest = await res.json() as {
      num: number;
      title: string;
      img: string;
      alt: string;
    };

    results.push({
      title: latest.title,
      url: `https://xkcd.com/${latest.num}/`,
      imageUrl: latest.img,
      source: 'XKCD',
      type: 'comic',
      upvotes: 0,
    });

    // Get a few recent comics
    const recentNums = [latest.num - 1, latest.num - 2, latest.num - 3];
    const recentPromises = recentNums.map(async (num) => {
      try {
        const r = await fetch(`https://xkcd.com/${num}/info.0.json`, {
          headers: { 'User-Agent': 'GLOBALNOW/1.0' },
        });
        if (!r.ok) return null;
        const comic = await r.json() as { num: number; title: string; img: string; alt: string };
        return {
          title: comic.title,
          url: `https://xkcd.com/${comic.num}/`,
          imageUrl: comic.img,
          source: 'XKCD',
          type: 'comic' as const,
          upvotes: 0,
        };
      } catch {
        return null;
      }
    });

    const recent = await Promise.allSettled(recentPromises);
    for (const r of recent) {
      if (r.status === 'fulfilled' && r.value) {
        results.push(r.value);
      }
    }
  } catch (error) {
    console.error('XKCD collection failed:', error);
  }

  return results;
}

/** Collect from Reddit r/ProgrammerHumor JSON API (public, no auth) */
async function collectRedditProgrammerHumor(): Promise<CollectedHumor[]> {
  const results: CollectedHumor[] = [];

  try {
    const res = await fetch('https://www.reddit.com/r/ProgrammerHumor/hot.json?limit=10', {
      headers: { 'User-Agent': 'GLOBALNOW/1.0 (by /u/globalnow)' },
    });

    if (!res.ok) return results;

    const data = await res.json() as {
      data: {
        children: Array<{
          data: {
            title: string;
            url: string;
            permalink: string;
            ups: number;
            is_self: boolean;
            post_hint?: string;
            preview?: { images: Array<{ source: { url: string } }> };
          };
        }>;
      };
    };

    if (!data?.data?.children) return results;

    for (const child of data.data.children.slice(0, 10)) {
      const post = child.data;
      if (post.is_self) continue; // Skip text-only posts

      const imageUrl = post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&');

      results.push({
        title: post.title,
        url: `https://www.reddit.com${post.permalink}`,
        imageUrl: imageUrl || undefined,
        source: 'r/ProgrammerHumor',
        type: 'meme',
        upvotes: post.ups,
      });
    }
  } catch (error) {
    console.error('Reddit ProgrammerHumor collection failed:', error);
  }

  return results;
}

/** Collect satire from RSS feeds (The Onion, CommitStrip) */
async function collectSatireRSS(): Promise<CollectedHumor[]> {
  const results: CollectedHumor[] = [];

  try {
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser({ timeout: 10000 });

    // The Onion
    try {
      const feed = await parser.parseURL('https://www.theonion.com/rss');
      feed.items?.slice(0, 5).forEach(item => {
        results.push({
          title: item.title || '',
          url: item.link || '',
          source: 'The Onion',
          type: 'satire',
          upvotes: 0,
        });
      });
    } catch { /* skip */ }

    // CommitStrip
    try {
      const feed = await parser.parseURL('https://www.commitstrip.com/en/feed/');
      feed.items?.slice(0, 5).forEach(item => {
        results.push({
          title: item.title || '',
          url: item.link || '',
          source: 'CommitStrip',
          type: 'comic',
          upvotes: 0,
        });
      });
    } catch { /* skip */ }
  } catch (error) {
    console.error('Satire RSS collection failed:', error);
  }

  return results;
}
