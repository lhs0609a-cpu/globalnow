export type HNStory = {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
};

const HN_API = 'https://hacker-news.firebaseio.com/v0';

export async function collectHackerNews(limit: number = 30): Promise<HNStory[]> {
  try {
    const topRes = await fetch(`${HN_API}/topstories.json`);
    const topIds: number[] = await topRes.json();

    const storyPromises = topIds.slice(0, limit).map(async (id) => {
      const res = await fetch(`${HN_API}/item/${id}.json`);
      return res.json() as Promise<HNStory>;
    });

    const stories = await Promise.all(storyPromises);
    return stories.filter(s => s && s.title);
  } catch (error) {
    console.error('Failed to collect HN stories:', error);
    return [];
  }
}
