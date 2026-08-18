'use client';

import { useState, useEffect } from 'react';
import { Prediction, LeaderboardEntry } from '@/types/prediction';
import { VoteButton } from '@/components/news/VoteButton';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/AppShell';

export default function PredictPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [predRes, lbRes] = await Promise.all([
          fetch('/api/news?limit=0').then(() => fetch('/api/predict/active/vote').catch(() => null)),
          fetch('/api/leaderboard'),
        ]);

        // Fetch predictions from a simple endpoint
        const predsResponse = await fetch('/api/news?limit=0');
        // Use mock data for now
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Use direct API calls
    Promise.all([
      fetch('/api/leaderboard').then(r => r.json()).catch(() => []),
    ]).then(([lb]) => {
      setLeaderboard(lb);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader title="뉴스 배틀" description="뉴스 결과를 예측하고 랭킹에 도전하세요" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Predictions */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-[0.9375rem] font-semibold text-slate-100">진행 중인 예측</h2>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />
            </div>
          ) : predictions.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-slate-800 px-6 py-16 text-center">
              <p className="text-[0.875rem] font-medium text-slate-300">
                현재 진행 중인 예측이 없습니다
              </p>
              <p className="mt-1 text-[0.8125rem] text-slate-500">
                새로운 예측이 곧 등록됩니다
              </p>
            </div>
          ) : (
            predictions.map(pred => (
              <div
                key={pred.id}
                className="rounded-xl border border-white/[0.06] bg-slate-800 p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="info">{pred.category}</Badge>
                  <span className="text-[0.6875rem] text-slate-500">
                    마감 {new Date(pred.deadline).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <h3 className="mb-4 text-[0.9375rem] font-semibold leading-snug text-slate-100">
                  {pred.questionKo}
                </h3>
                <div className="space-y-2">
                  <VoteButton
                    predictionId={pred.id}
                    choice="A"
                    label={pred.optionAKo}
                    votes={pred.votesA}
                    totalVotes={pred.votesA + pred.votesB}
                  />
                  <VoteButton
                    predictionId={pred.id}
                    choice="B"
                    label={pred.optionBKo}
                    votes={pred.votesB}
                    totalVotes={pred.votesA + pred.votesB}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="mb-4 text-[0.9375rem] font-semibold text-slate-100">랭킹</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-slate-800">
            {leaderboard.length === 0 ? (
              <p className="px-5 py-10 text-center text-[0.8125rem] text-slate-500">
                랭킹 데이터가 없습니다
              </p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {leaderboard.map(entry => (
                  <div
                    key={entry.userId}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.025]"
                  >
                    {/* 상위 3위만 강조하고 나머지는 숫자로 조용히 둔다 */}
                    <span
                      className={`tnum flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[0.6875rem] font-semibold ${
                        entry.rank <= 3
                          ? 'bg-amber-400/10 text-amber-400'
                          : 'bg-white/[0.05] text-slate-500'
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] font-medium text-slate-100">
                        {entry.nickname}
                      </p>
                      <p className="tnum text-[0.6875rem] text-slate-500">
                        정확도 {entry.accuracy.toFixed(1)}%
                      </p>
                    </div>
                    <span className="tnum text-[0.8125rem] font-semibold text-slate-200">
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
