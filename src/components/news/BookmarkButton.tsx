'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Icon } from '@/components/ui/Icon';

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
      className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-fill-weak hover:text-amber-400 disabled:opacity-50 lg:h-8 lg:w-8"
    >
      <Icon
        name="bookmark"
        className={clsx(
          'h-[1.125rem] w-[1.125rem] lg:h-4 lg:w-4',
          // 담긴 상태는 색만으로도 충분히 읽힌다. 채운 아이콘은 목록에서 너무 무겁다
          isBookmarked && 'text-amber-400'
        )}
      />
    </button>
  );
}
