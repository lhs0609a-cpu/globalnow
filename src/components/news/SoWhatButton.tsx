'use client';

import { useState } from 'react';
import { SoWhatPanel } from './SoWhatPanel';
import { SoWhatAnalysis } from '@/types/news';

export function SoWhatButton({ newsId }: { newsId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState<SoWhatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (isLoading) return;
    setIsOpen(true);
    if (!analysis) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/news/${newsId}/so-what`, { method: 'POST' });
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
        aria-label="AI 분석 보기"
        className="flex items-center gap-1 p-2 min-w-[44px] min-h-[44px] rounded text-xs text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
      {isOpen && (
        <SoWhatPanel
          analysis={analysis}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
