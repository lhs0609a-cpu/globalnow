'use client';

import { useState } from 'react';
import { SoWhatPanel } from './SoWhatPanel';
import { Icon } from '@/components/ui/Icon';
import { SoWhatAnalysis } from '@/types/news';
import { track } from '@/lib/analytics/events';

export function SoWhatButton({ newsId }: { newsId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<SoWhatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsOpen(true);
    track('analysis_open');
    if (!analysis) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/news/${newsId}/so-what`, { method: 'POST', signal: AbortSignal.timeout(30000) });
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
        }
      } catch {
        // Failed silently
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading && !isOpen}
        type="button"
        aria-label="AI 분석 보기"
        aria-haspopup="dialog"
        className="flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg px-2 t-meta text-slate-400 transition-colors hover:bg-fill-weak hover:text-accent-text disabled:opacity-50"
      >
        <Icon name="bulb" className="h-[1.125rem] w-[1.125rem] lg:h-4 lg:w-4" />
        <span>해설</span>
      </button>
      {isOpen && (
        <SoWhatPanel
          analysis={analysis}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
          onRetry={handleClick}
        />
      )}
    </div>
  );
}
