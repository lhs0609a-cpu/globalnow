'use client';

import { useState, useEffect } from 'react';
import { UserStreak, NewsDNA } from '@/types/user';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [dna, setDna] = useState<NewsDNA | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [streakRes, dnaRes] = await Promise.all([
          fetch('/api/user/streak').then(r => r.json()),
          fetch('/api/user/dna').then(r => r.json()),
        ]);
        setStreak(streakRes);
        setDna(dnaRes);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">마이페이지</h1>

      {/* Streak */}
      {streak && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔥</span>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">{streak.currentStreak}일</p>
              <p className="text-slate-400 text-sm">연속 방문 스트릭</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-white text-xl font-bold">{streak.longestStreak}</p>
              <p className="text-slate-400 text-xs">최장 스트릭</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-white text-xl font-bold">{streak.badges.length}</p>
              <p className="text-slate-400 text-xs">획득 배지</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-white text-xl font-bold">{streak.todayRead ? 'O' : 'X'}</p>
              <p className="text-slate-400 text-xs">오늘 방문</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {streak.badges.map(badge => (
              <div key={badge.id} className="flex items-center gap-1.5 bg-slate-800/50 rounded-full px-3 py-1.5">
                <span>{badge.icon}</span>
                <span className="text-white text-xs font-medium">{badge.nameKo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News DNA */}
      {dna && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">뉴스 DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category distribution */}
            <div>
              <h3 className="text-slate-400 text-sm mb-3">카테고리 분포</h3>
              <div className="space-y-2">
                {dna.categoryDistribution.map(cat => (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{cat.category}</span>
                      <span className="text-slate-400">{cat.percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Keywords */}
            <div>
              <h3 className="text-slate-400 text-sm mb-3">관심 키워드 TOP 5</h3>
              <div className="space-y-2">
                {dna.topKeywords.map((kw, i) => (
                  <div key={kw.keyword} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs w-5">{i + 1}</span>
                      <span className="text-white text-sm">{kw.keyword}</span>
                    </div>
                    <Badge variant="info">{kw.count}회</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-white text-2xl font-bold">{dna.totalReads}</p>
              <p className="text-slate-400 text-xs">총 읽은 기사</p>
            </div>
            <div className="text-center">
              <p className="text-white text-2xl font-bold">{dna.avgReadTime}분</p>
              <p className="text-slate-400 text-xs">평균 읽기 시간</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
