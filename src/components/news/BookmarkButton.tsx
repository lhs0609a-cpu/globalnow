'use client';

import { useState } from 'react';

export function BookmarkButton({ newsId }: { newsId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const prev = isBookmarked;
    setIsBookmarked(!isBookmarked);
    try {
      const res = await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId }),
      });
      if (!res.ok) setIsBookmarked(prev);
    } catch {
      setIsBookmarked(prev);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
      className="flex items-center gap-1 p-2 min-w-[44px] min-h[44px] rounded text-xs text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
    >
      <svg
        className="w-4 h-4"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
