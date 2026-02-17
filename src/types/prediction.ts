export type Prediction = {
  id: string;
  question: string;
  questionKo: string;
  description?: string;
  optionA: string;
  optionAKo: string;
  optionB: string;
  optionBKo: string;
  votesA: number;
  votesB: number;
  deadline: string;
  resolvedAt?: string;
  result?: 'A' | 'B';
  category: string;
  relatedNewsId?: string;
  createdAt: string;
};

export type Vote = {
  id: string;
  userId: string;
  predictionId: string;
  choice: 'A' | 'B';
  votedAt: string;
  isCorrect?: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  nickname: string;
  avatarUrl?: string;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number;
  score: number;
  streak: number;
};

export type HumorItem = {
  id: string;
  title: string;
  titleKo?: string;
  type: 'meme' | 'gif' | 'satire' | 'comic';
  imageUrl?: string;
  gifUrl?: string;
  content?: string;
  source: string;
  sourceUrl: string;
  upvotes: number;
  tags?: string[];
  publishedAt: string;
  collectedAt: string;
};
