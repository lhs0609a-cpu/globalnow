'use client';

import { useState } from 'react';
import { SoWhatPanel } from './SoWhatPanel';
import { Icon } from '@/components/ui/Icon';
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
        className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-fill-weak hover:text-accent-text disabled:opacity-50 lg:h-8 lg:w-8"
      >
        <Icon name="bulb" className="h-[1.125rem] w-[1.125rem] lg:h-4 lg:w-4" />
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
