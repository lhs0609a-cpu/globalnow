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

/** Manifold Markets API response type */
type ManifoldMarket = {
  id: string;
  question: string;
  probability: number;
  volume: number;
  closeTime: number;
  createdTime: number;
  totalLiquidity: number;
  url: string;
};

/** Category mapping for Manifold Markets questions */
function categorizeQuestion(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('ai') || q.includes('gpt') || q.includes('tech') || q.includes('software') || q.includes('crypto') || q.includes('bitcoin')) return 'tech';
  if (q.includes('fed') || q.includes('rate') || q.includes('economy') || q.includes('gdp') || q.includes('inflation') || q.includes('stock') || q.includes('market')) return 'economy';
  if (q.includes('election') || q.includes('president') || q.includes('congress') || q.includes('vote') || q.includes('trump') || q.includes('biden')) return 'politics';
  if (q.includes('war') || q.includes('china') || q.includes('russia') || q.includes('ukraine') || q.includes('nato')) return 'international';
  return 'general';
}

/** Fetch predictions from Manifold Markets API (free, no key required) */
async function fetchManifoldMarkets(): Promise<Prediction[]> {
  try {
    const res = await fetch('https://api.manifold.markets/v0/markets?limit=20&sort=last-bet-time', {
      headers: { 'User-Agent': 'GLOBALNOW/1.0' },
    });

    if (!res.ok) return [];

    const data = await res.json() as ManifoldMarket[];
    if (!Array.isArray(data)) return [];

    // Filter to binary markets with reasonable activity
    const binaryMarkets = data.filter(m =>
      m.probability !== undefined &&
      m.volume > 100 &&
      m.closeTime > Date.now()
    );

    return binaryMarkets.slice(0, 10).map(m => {
      const probability = Math.round(m.probability * 100);
      const yesVotes = Math.round(probability * (m.volume / 100));
      const noVotes = Math.round((100 - probability) * (m.volume / 100));

      return {
        id: `manifold-${m.id}`,
        question: m.question,
        questionKo: m.question, // Could be translated with an AI service
        description: `Manifold Markets - ${Math.round(m.probability * 100)}% probability`,
        optionA: 'Yes',
        optionAKo: '예',
        optionB: 'No',
        optionBKo: '아니오',
        votesA: yesVotes,
        votesB: noVotes,
        deadline: new Date(m.closeTime).toISOString(),
        category: categorizeQuestion(m.question),
        createdAt: new Date(m.createdTime).toISOString(),
      };
    });
  } catch (error) {
    console.error('Manifold Markets fetch failed:', error);
    return [];
  }
}

export async function getPredictions(): Promise<Prediction[]> {
  return cacheGetOrSet(
    'predictions:active',
    async () => {
      // Try Manifold Markets first (free, no key needed)
      const manifoldPredictions = await fetchManifoldMarkets();
      if (manifoldPredictions.length > 0) {
        console.log(`[Predictions] Fetched ${manifoldPredictions.length} from Manifold Markets`);
        return manifoldPredictions;
      }

      // Try Supabase (only if not demo mode)
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('predictions')
              .select('*')
              .is('resolved_at', null)
              .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
              return data as unknown as Prediction[];
            }
          }
        } catch {
          // Supabase not available
        }
      }

      return MOCK_PREDICTIONS;
    },
    60
  );
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return cacheGetOrSet(
    'leaderboard',
    async () => {
      // Try Supabase if available
      if (!isDemoMode()) {
        try {
          const { createServiceRoleClient } = await import('@/lib/supabase/server');
          const supabase = await createServiceRoleClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('leaderboard')
              .select('*')
              .order('score', { ascending: false })
              .limit(20);

            if (!error && data && data.length > 0) {
              return data as unknown as LeaderboardEntry[];
            }
          }
        } catch {
          // Supabase not available
        }
      }

      return MOCK_LEADERBOARD;
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
