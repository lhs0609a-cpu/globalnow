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
      className="block bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition-colors border border-slate-700/50 hover:border-slate-600/50"
    >
      <div className="flex items-start gap-3">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          {/* Matched ticker badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {item.matchedTickers.map(ticker => (
              <Badge key={ticker} variant="info">
                {ticker}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-white font-medium text-sm leading-snug line-clamp-2">
            {item.titleKo || item.title}
          </h3>

          {/* Summary */}
          {(item.summaryKo || item.summary) && (
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">
              {item.summaryKo || item.summary}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span>{item.source?.name || item.sourceId}</span>
            <span>-</span>
            <span>{timeAgo(item.publishedAt)}</span>
            {item.sentiment !== undefined && (
              <>
                <span>-</span>
                <span
                  className={
                    item.sentiment > 0.2
                      ? 'text-emerald-400'
                      : item.sentiment < -0.2
                        ? 'text-red-400'
                        : 'text-slate-400'
                  }
                >
                  {item.sentiment > 0.2 ? 'Positive' : item.sentiment < -0.2 ? 'Negative' : 'Neutral'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
