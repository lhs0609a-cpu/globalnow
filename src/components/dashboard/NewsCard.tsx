'use client';

import { useState } from 'react';
import { NewsItem } from '@/types/news';
import { Badge } from '@/components/ui/Badge';
import { SoWhatButton } from '@/components/news/SoWhatButton';
import { BookmarkButton } from '@/components/news/BookmarkButton';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/format';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/categories';

export function NewsCard({ news }: { news: NewsItem }) {
  const [imageError, setImageError] = useState(false);

  const sentimentColor = news.sentiment
    ? news.sentiment > 0.3
      ? 'text-emerald-400'
      : news.sentiment < -0.3
      ? 'text-red-400'
      : 'text-slate-400'
    : 'text-slate-400';

  return (
    <article className="bg-slate-800 rounded-xl overflow-hidden hover:ring-1 hover:ring-slate-600 transition-all group">
      {/* Image */}
      {news.imageUrl && !imageError && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.titleKo || news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${CATEGORY_COLORS[news.category] || ''}`}>
              {CATEGORIES.find(c => c.id === news.category)?.nameKo || news.category}
            </span>
          </div>
          {news.source && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-xs">{news.source.countryFlag}</span>
              <span className="text-white text-xs font-medium">{news.source.nameKo || news.source.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Source info when no image */}
        {(!news.imageUrl || imageError) && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_COLORS[news.category] || ''}`}>
              {CATEGORIES.find(c => c.id === news.category)?.nameKo || news.category}
            </span>
            {news.source && (
              <span className="text-slate-500 text-xs">
                {news.source.countryFlag} {news.source.nameKo || news.source.name}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="text-white font-semibold text-sm leading-snug mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
            {news.titleKo || news.title}
          </h3>
          {news.titleKo && (
            <p className="text-slate-500 text-xs mb-2 line-clamp-1">{news.title}</p>
          )}
        </a>

        {/* Summary */}
        {news.summaryKo && (
          <p className="text-slate-400 text-xs line-clamp-2 mb-3">
            {news.summaryKo}
          </p>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {news.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{formatRelativeTime(news.publishedAt)}</span>
            {news.viewCount && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatNumber(news.viewCount)}
              </span>
            )}
            <span className={sentimentColor}>
              {news.sentiment ? (news.sentiment > 0 ? '▲' : news.sentiment < 0 ? '▼' : '−') : ''}
            </span>
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
