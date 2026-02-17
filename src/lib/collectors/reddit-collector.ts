import { SUBREDDITS } from '@/lib/constants/subreddits';
import { hasReddit } from '@/lib/demo/is-demo-mode';

export type RedditPost = {
  id: string;
  title: string;
  url: string;
  permalink: string;
  subreddit: string;
  score: number;
  numComments: number;
  createdUtc: number;
  selftext?: string;
  thumbnail?: string;
};

async function getRedditToken(): Promise<string | null> {
  if (!hasReddit()) return null;

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token || null;
}

export async function collectRedditPosts(): Promise<RedditPost[]> {
  const token = await getRedditToken();
  if (!token) return [];

  const results: RedditPost[] = [];

  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(`https://oauth.reddit.com/r/${sub.name}/hot?limit=25`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'GLOBALNOW/1.0',
        },
      });
      const data = await res.json();
      const posts = (data.data?.children || []).map((child: { data: Record<string, unknown> }) => ({
        id: child.data.id as string,
        title: child.data.title as string,
        url: child.data.url as string,
        permalink: `https://reddit.com${child.data.permalink}`,
        subreddit: sub.name,
        score: child.data.score as number,
        numComments: child.data.num_comments as number,
        createdUtc: child.data.created_utc as number,
        selftext: (child.data.selftext as string)?.slice(0, 500),
        thumbnail: child.data.thumbnail as string,
      }));
      results.push(...posts);
    } catch (error) {
      console.error(`Failed to collect from r/${sub.name}:`, error);
    }
  }

  return results;
}
