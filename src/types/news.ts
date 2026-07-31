export type NewsCategory =
  | 'international'
  | 'economy'
  | 'tech'
  | 'politics'
  | 'risk'
  | 'culture'
  | 'science'
  | 'health'
  | 'sports';

export type NewsSource = {
  id: string;
  name: string;
  nameKo: string;
  country: string;
  countryFlag: string;
  url: string;
  rssUrl?: string;
  category: NewsCategory;
  reliability: number; // 1-5
  logo?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  titleKo?: string;
  summary?: string;
  summaryKo?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  source: NewsSource;
  sourceId: string;
  category: NewsCategory;
  country: string;
  publishedAt: string;
  collectedAt: string;
  sentiment?: number; // -1 to 1
  tags?: string[];
  soWhat?: SoWhatAnalysis;
  viewCount?: number;
  bookmarkCount?: number;
};

export type SoWhatAnalysis = {
  id: string;
  newsId: string;
  keyPoint: string;
  background: string;
  outlook: string;
  actionItem: string;
  generatedAt: string;
};

export type NewsFeedParams = {
  category?: NewsCategory | string;
  country?: string;
  source?: string;
  page?: number;
  limit?: number;
  sortBy?: 'latest' | 'popular' | 'trending';
  search?: string;
};

export type TrendingSource =
  | 'hackernews' | 'producthunt' | 'reddit' | 'github'
  | 'v2ex' | 'zhihu' | '36kr' | 'qiita' | 'hatena'
  | 'geeknews' | 'disquiet' | 'lobsters' | 'tabnews' | 'devto';

export type TrendingItem = {
  id: string;
  title: string;
  titleKo?: string;
  url: string;
  source: TrendingSource;
  score: number;
  commentCount?: number;
  subreddit?: string;
  region?: string;
  publishedAt: string;
};

export type MorningBrief = {
  id: string;
  date: string;
  items: MorningBriefItem[];
  summary: string;
  generatedAt: string;
};

export type MorningBriefItem = {
  rank: number;
  newsId: string;
  title: string;
  titleKo: string;
  summaryKo: string;
  category: NewsCategory;
  source: string;
  impact: 'high' | 'medium' | 'low';
};
