'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types/prediction';

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="surface">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <span>🏆</span> 예측 랭킹
        </h3>
      </div>
      <div className="p-2">
        {entries.map(entry => (
          <div key={entry.userId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
            <span className="text-lg w-8 text-center flex-shrink-0">
              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
            </span>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white t-body-sm">{entry.nickname.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-100 t-body font-medium truncate">{entry.nickname}</p>
              <p className="text-slate-500 t-body-sm">{entry.correctPredictions}/{entry.totalPredictions} ({entry.accuracy}%)</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-blue-400 t-title font-bold">{entry.score}</p>
              {entry.streak > 0 && (
                <p className="text-amber-400 t-body-sm">🔥 {entry.streak}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
