'use client';

import { useState } from 'react';
import { SourceRankingList } from '@/components/sources/SourceRankingList';
import { SourceDirectory } from '@/components/sources/SourceDirectory';

type View = 'ranking' | 'directory';

const views: { id: View; label: string; icon: string; description: string }[] = [
  { id: 'ranking', label: '파워 랭킹', icon: '🏆', description: '전세계 주요 뉴스 매체의 영향력·신뢰도 순위' },
  { id: 'directory', label: '사이트 디렉토리', icon: '🗂', description: '분야별·국가별 뉴스와 리서치 사이트 모음' },
];

export default function SourcesPage() {
  const [view, setView] = useState<View>('ranking');
  const active = views.find(v => v.id === view)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>{active.icon}</span> 글로벌 미디어
        </h1>
        <p className="text-slate-400 text-sm mt-1">{active.description}</p>
      </div>

      {/* View switcher */}
      <div className="flex gap-1 bg-slate-800/60 p-1 rounded-lg w-fit">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === v.id ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {view === 'ranking' ? <SourceRankingList /> : <SourceDirectory />}
    </div>
  );
}
