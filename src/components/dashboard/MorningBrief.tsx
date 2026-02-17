'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MorningBrief as MorningBriefType } from '@/types/news';
import { BriefSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

const impactColors = {
  high: 'danger' as const,
  medium: 'warning' as const,
  low: 'info' as const,
};

const impactLabels = {
  high: '높음',
  medium: '보통',
  low: '낮음',
};

export function MorningBrief() {
  const [brief, setBrief] = useState<MorningBriefType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      try {
        const res = await fetch('/api/brief/today');
        const data = await res.json();
        setBrief(data);
      } catch (error) {
        console.error('Failed to fetch brief:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrief();
  }, []);

  if (isLoading) return <BriefSkeleton />;
  if (!brief) return null;

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-700/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">☀️</span>
          <div>
            <h2 className="text-white font-bold text-lg">모닝 브리프</h2>
            <p className="text-slate-400 text-sm">오늘 꼭 알아야 할 5가지</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/brief"
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            아카이브 →
          </Link>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <p className="text-slate-300 text-sm mb-4 bg-slate-700/30 rounded-lg p-3">
            {brief.summary}
          </p>
          <div className="space-y-3">
            {brief.items.map((item) => (
              <div
                key={item.rank}
                className="flex gap-4 p-3 rounded-lg hover:bg-slate-700/30 transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">{item.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={impactColors[item.impact]}>
                      {impactLabels[item.impact]}
                    </Badge>
                    <span className="text-slate-500 text-xs">{item.source}</span>
                  </div>
                  <h3 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                    {item.titleKo}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {item.summaryKo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
