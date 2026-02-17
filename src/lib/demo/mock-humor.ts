import { HumorItem } from '@/types/prediction';

export const MOCK_HUMOR: HumorItem[] = [
  {
    id: 'humor-1',
    title: 'When the code works on the first try',
    titleKo: '코드가 첫 번째 시도에서 작동할 때',
    type: 'meme',
    imageUrl: 'https://images.unsplash.com/photo-1531747118685-64e4a8eb8e58?w=400',
    source: '9GAG',
    sourceUrl: 'https://9gag.com',
    upvotes: 45200,
    tags: ['programming', 'coding', 'meme'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    collectedAt: new Date().toISOString(),
  },
  {
    id: 'humor-2',
    title: 'CEO explaining blockchain to the board',
    titleKo: 'CEO가 이사회에 블록체인을 설명하는 모습',
    type: 'gif',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
    gifUrl: 'https://media.giphy.com/media/example/giphy.gif',
    source: 'Reddit',
    sourceUrl: 'https://reddit.com/r/funny',
    upvotes: 32100,
    tags: ['business', 'blockchain', 'funny'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    collectedAt: new Date().toISOString(),
  },
  {
    id: 'humor-3',
    title: "The Onion: Nation's CEOs Announce They Will Be Taking A More Hands-Off Approach To Everything",
    titleKo: '디 어니언: 전국 CEO들, 모든 것에 더 손 안 대겠다고 발표',
    type: 'satire',
    content: "In a joint press conference Monday, the nation's CEOs announced that they would be taking a more hands-off approach to literally everything.",
    source: 'The Onion',
    sourceUrl: 'https://theonion.com',
    upvotes: 28900,
    tags: ['satire', 'business', 'ceo'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    collectedAt: new Date().toISOString(),
  },
  {
    id: 'humor-4',
    title: 'Monday morning standup meeting vibes',
    titleKo: '월요일 아침 스탠드업 미팅 분위기',
    type: 'meme',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400',
    source: '9GAG',
    sourceUrl: 'https://9gag.com',
    upvotes: 19800,
    tags: ['work', 'monday', 'meeting'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    collectedAt: new Date().toISOString(),
  },
  {
    id: 'humor-5',
    title: 'AI trying to understand sarcasm',
    titleKo: 'AI가 비꼴을 이해하려고 할 때',
    type: 'comic',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
    content: 'Panel 1: Human says "Great job AI"\nPanel 2: AI: "Thank you! I aim to please!"\nPanel 3: Human: "That was sarcasm"\nPanel 4: AI: *confused beeping*',
    source: 'XKCD',
    sourceUrl: 'https://xkcd.com',
    upvotes: 15600,
    tags: ['ai', 'comic', 'tech humor'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    collectedAt: new Date().toISOString(),
  },
  {
    id: 'humor-6',
    title: 'Stock market traders when it drops 0.1%',
    titleKo: '주식 시장이 0.1% 하락했을 때 트레이더들',
    type: 'gif',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    source: 'Reddit',
    sourceUrl: 'https://reddit.com/r/wallstreetbets',
    upvotes: 42300,
    tags: ['stocks', 'trading', 'wsb'],
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    collectedAt: new Date().toISOString(),
  },
];

export function getMockHumor(type?: string): HumorItem[] {
  if (type) {
    return MOCK_HUMOR.filter(h => h.type === type);
  }
  return MOCK_HUMOR;
}

export function getMockTrendingHumor(): HumorItem[] {
  return [...MOCK_HUMOR].sort((a, b) => b.upvotes - a.upvotes).slice(0, 10);
}
