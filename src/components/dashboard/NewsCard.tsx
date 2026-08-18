'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { NewsItem } from '@/types/news';
import { SoWhatButton } from '@/components/news/SoWhatButton';
import { BookmarkButton } from '@/components/news/BookmarkButton';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/format';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/categories';

function CategoryChip({ category }: { category: string }) {
  const label = CATEGORIES.find(c => c.id === category)?.nameKo || category;
  return (
    <span
      className={clsx(
        'inline-flex flex-shrink-0 items-center rounded px-1.5 py-0.5 text-[0.6875rem] font-medium leading-tight',
        CATEGORY_COLORS[category] || 'bg-white/[0.06] text-slate-400'
      )}
    >
      {label}
    </span>
  );
}

export function NewsCard({ news }: { news: NewsItem }) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(news.imageUrl) && !imageError;

  const sentimentMark =
    typeof news.sentiment === 'number' && news.sentiment !== 0
      ? news.sentiment > 0
        ? { glyph: '▲', className: 'text-emerald-400' }
        : { glyph: '▼', className: 'text-red-400' }
      : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-slate-800 transition-colors hover:border-white/[0.12]">
      {/* Image */}
      {hasImage && (
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[16/9] overflow-hidden bg-slate-700"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={news.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImageError(true)}
          />
          {/* 아래쪽 그라데이션이 있어야 출처 글자가 밝은 사진 위에서도 읽힌다 */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
          {news.source && (
            <span className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[0.6875rem] font-medium text-white/90">
              <span>{news.source.countryFlag}</span>
              {news.source.nameKo || news.source.name}
            </span>
          )}
        </a>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <CategoryChip category={news.category} />
          {!hasImage && news.source && (
            <span className="truncate text-[0.6875rem] text-slate-500">
              {news.source.countryFlag} {news.source.nameKo || news.source.name}
            </span>
          )}
        </div>

        <a href={news.url} target="_blank" rel="noopener noreferrer" className="block">
          <h3 className="line-clamp-2 text-[0.875rem] font-semibold leading-snug text-slate-100 transition-colors group-hover:text-blue-400">
            {news.titleKo || news.title}
          </h3>
          {news.titleKo && (
            <p className="mt-1 line-clamp-1 text-[0.6875rem] text-slate-600">
              {news.title}
            </p>
          )}
        </a>

        {news.summaryKo && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {news.summaryKo}
          </p>
        )}

        {news.tags && news.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {news.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[0.6875rem] text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3.5">
          <div className="flex items-center gap-2.5 text-[0.6875rem] text-slate-500">
            <span>{formatRelativeTime(news.publishedAt)}</span>
            {news.viewCount ? (
              <span className="tnum">조회 {formatNumber(news.viewCount)}</span>
            ) : null}
            {sentimentMark && (
              <span className={sentimentMark.className}>{sentimentMark.glyph}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <SoWhatButton newsId={news.id} />
            <BookmarkButton newsId={news.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
