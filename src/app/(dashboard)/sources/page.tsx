'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { SourceRankingList } from '@/components/sources/SourceRankingList';
import { SourceDirectory } from '@/components/sources/SourceDirectory';
import { PageHeader } from '@/components/layout/AppShell';

type View = 'ranking' | 'directory';

const views: { id: View; label: string; description: string }[] = [
  { id: 'ranking', label: '파워 랭킹', description: '전세계 주요 뉴스 매체의 영향력·신뢰도 순위' },
  { id: 'directory', label: '사이트 디렉토리', description: '전세계에서 실제로 쓰는 도구와 매체를 분야별·중요도순으로' },
];

export default function SourcesPage() {
  const [view, setView] = useState<View>('ranking');
  const active = views.find(v => v.id === view)!;

  return (
    <div>
      <PageHeader title="글로벌 미디어" description={active.description} />

      {/* View switcher: 두 개뿐이라 세그먼트 컨트롤이 탭보다 명확하다 */}
      <div className="mb-5 inline-flex gap-1 rounded-lg border border-line bg-fill-subtle p-1">
        {views.map(v => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={clsx(
              'rounded-md px-3.5 py-1.5 t-body-sm font-medium transition-colors',
              view === v.id
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-400 hover:text-slate-100'
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'ranking' ? <SourceRankingList /> : <SourceDirectory />}
    </div>
  );
}
