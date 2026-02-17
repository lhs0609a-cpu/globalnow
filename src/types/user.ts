export type UserProfile = {
  id: string;
  email: string;
  nickname?: string;
  avatarUrl?: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  totalReads: number;
  predictionScore: number;
  badges: UserBadge[];
};

export type UserBadge = {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  description: string;
  earnedAt: string;
};

export type UserStreak = {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  todayRead: boolean;
  badges: UserBadge[];
};

export type NewsDNA = {
  userId: string;
  period: string;
  categoryDistribution: { category: string; percentage: number }[];
  sourceDistribution: { source: string; percentage: number }[];
  timeDistribution: { hour: number; reads: number }[];
  topKeywords: { keyword: string; count: number }[];
  totalReads: number;
  avgReadTime: number;
};

export type KeywordAlert = {
  id: string;
  userId: string;
  keyword: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  matchCount: number;
};

export type Bookmark = {
  id: string;
  userId: string;
  newsId: string;
  createdAt: string;
  news?: import('./news').NewsItem;
};
