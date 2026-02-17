'use client';

import { useState, useEffect } from 'react';
import { Prediction, LeaderboardEntry } from '@/types/prediction';
import { VoteButton } from '@/components/news/VoteButton';
import { Badge } from '@/components/ui/Badge';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">뉴스 배틀</h1>
        <p className="text-slate-400 text-sm mt-1">뉴스 결과를 예측하고 랭킹에 도전하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-white font-semibold">진행 중인 예측</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : predictions.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center">
              <span className="text-4xl">🎯</span>
              <p className="text-slate-400 mt-3">현재 진행 중인 예측이 없습니다</p>
              <p className="text-slate-500 text-sm mt-1">새로운 예측이 곧 등록됩니다</p>
            </div>
          ) : (
            predictions.map(pred => (
              <div key={pred.id} className="bg-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="info">{pred.category}</Badge>
                  <span className="text-slate-500 text-xs">
                    마감: {new Date(pred.deadline).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-4">{pred.questionKo}</h3>
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
          <h2 className="text-white font-semibold mb-4">랭킹</h2>
          <div className="bg-slate-800 rounded-xl p-4">
            {leaderboard.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">랭킹 데이터가 없습니다</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map(entry => (
                  <div key={entry.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50">
                    <span className="text-lg w-8 text-center">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `${entry.rank}`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{entry.nickname}</p>
                      <p className="text-slate-500 text-xs">{entry.accuracy.toFixed(1)}% 정확도</p>
                    </div>
                    <span className="text-blue-400 text-sm font-semibold">{entry.score}</span>
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
