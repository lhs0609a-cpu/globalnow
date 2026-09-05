'use client';

import { WatchdogNewsItem } from '@/types/watchdog';
import { Badge } from '@/components/ui/Badge';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

type Props = {
  item: WatchdogNewsItem;
};

export function WatchdogCard({ item }: Props) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block surface p-4 transition-colors hover:border-line-strong"
    >
      <div className="flex items-start gap-3.5">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            className="h-16 w-16 flex-shrink-0 rounded-lg bg-surface-2 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          {/* Matched ticker badges */}
          <div className="mb-1.5 flex flex-wrap gap-1">
            {item.matchedTickers.map(ticker => (
              <Badge key={ticker} variant="info">
                {ticker}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 t-headline-sm text-slate-100 transition-colors group-hover:text-accent-text">
            {item.titleKo || item.title}
          </h3>

          {/* Summary */}
          {(item.summaryKo || item.summary) && (
            <p className="mt-1 line-clamp-2 t-body-sm text-slate-500">
              {item.summaryKo || item.summary}
            </p>
          )}

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 t-meta-sm text-slate-500">
            <span>{item.source?.name || item.sourceId}</span>
            <span className="text-slate-600">·</span>
            <span>{timeAgo(item.publishedAt)}</span>
            {item.sentiment !== undefined && (
              <>
                <span className="text-slate-600">·</span>
                <span
                  className={
                    item.sentiment > 0.2
                      ? 'text-emerald-400'
                      : item.sentiment < -0.2
                        ? 'text-red-400'
                        : 'text-slate-500'
                  }
                >
                  {item.sentiment > 0.2 ? '긍정' : item.sentiment < -0.2 ? '부정' : '중립'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
