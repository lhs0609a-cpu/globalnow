import { isDemoMode } from '@/lib/demo/is-demo-mode';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { Prediction, LeaderboardEntry } from '@/types/prediction';

const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: 'pred-1',
    question: 'Will the Fed cut rates in March?',
    questionKo: '연준이 3월에 금리를 인하할까?',
    optionA: 'Yes, at least 25bp',
    optionAKo: '예, 최소 25bp 인하',
    optionB: 'No, hold steady',
    optionBKo: '아니오, 동결',
    votesA: 3456,
    votesB: 2891,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'economy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-2',
    question: 'Will Bitcoin reach $150K by end of 2025?',
    questionKo: '비트코인이 2025년 말까지 15만 달러에 도달할까?',
    optionA: 'Yes',
    optionAKo: '예',
    optionB: 'No',
    optionBKo: '아니오',
    votesA: 5678,
    votesB: 4321,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'economy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-3',
    question: 'Will GPT-5 be released this quarter?',
    questionKo: 'GPT-5가 이번 분기에 출시될까?',
    optionA: 'Yes',
    optionAKo: '예',
    optionB: 'No',
    optionBKo: '아니오',
    votesA: 7890,
    votesB: 3210,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'tech',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'user-1', nickname: '뉴스마스터', correctPredictions: 45, totalPredictions: 52, accuracy: 86.5, score: 4520, streak: 12 },
  { rank: 2, userId: 'user-2', nickname: '경제전문가', correctPredictions: 38, totalPredictions: 48, accuracy: 79.2, score: 3800, streak: 8 },
  { rank: 3, userId: 'user-3', nickname: '테크워치', correctPredictions: 35, totalPredictions: 45, accuracy: 77.8, score: 3500, streak: 5 },
  { rank: 4, userId: 'user-4', nickname: '글로벌인사이트', correctPredictions: 32, totalPredictions: 44, accuracy: 72.7, score: 3200, streak: 3 },
  { rank: 5, userId: 'user-5', nickname: '데이터분석가', correctPredictions: 30, totalPredictions: 42, accuracy: 71.4, score: 3000, streak: 7 },
];

export async function getPredictions(): Promise<Prediction[]> {
  if (isDemoMode()) return MOCK_PREDICTIONS;

  return cacheGetOrSet(
    'predictions:active',
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return MOCK_PREDICTIONS;

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) return MOCK_PREDICTIONS;
      return (data || []) as unknown as Prediction[];
    },
    60
  );
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (isDemoMode()) return MOCK_LEADERBOARD;

  return cacheGetOrSet(
    'leaderboard',
    async () => {
      const { createServiceRoleClient } = await import('@/lib/supabase/server');
      const supabase = await createServiceRoleClient();
      if (!supabase) return MOCK_LEADERBOARD;

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (error) return MOCK_LEADERBOARD;
      return (data || []) as unknown as LeaderboardEntry[];
    },
    300
  );
}

export async function vote(predictionId: string, userId: string, choice: 'A' | 'B'): Promise<boolean> {
  if (isDemoMode()) return true;

  const { createServiceRoleClient } = await import('@/lib/supabase/server');
  const supabase = await createServiceRoleClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('votes')
    .insert({ prediction_id: predictionId, user_id: userId, choice });

  if (error) return false;

  const column = choice === 'A' ? 'votes_a' : 'votes_b';
  await supabase.rpc('increment_vote', { p_id: predictionId, col: column });

  return true;
}
