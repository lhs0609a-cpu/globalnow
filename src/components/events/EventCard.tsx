'use client';

import { KoreaEvent, EventStatus } from '@/types/event';
import { EVENT_CATEGORIES } from '@/lib/constants/events';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const statusConfig: Record<EventStatus, { label: string; color: string; bg: string }> = {
  ongoing: { label: '진행 중', color: 'text-green-400', bg: 'bg-green-500/20' },
  upcoming: { label: '예정', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  ended: { label: '종료', color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

export function EventCard({ event }: { event: KoreaEvent }) {
  const status = event.status || 'upcoming';
  const statusMeta = statusConfig[status];
  const categoryMeta = EVENT_CATEGORIES.find(c => c.id === event.category);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isSameDay = event.startDate === event.endDate;

  const dateStr = isSameDay
    ? format(startDate, 'yyyy.MM.dd (EEE)', { locale: ko })
    : `${format(startDate, 'MM.dd', { locale: ko })} - ${format(endDate, 'MM.dd (EEE)', { locale: ko })}`;

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-slate-800 rounded-xl p-4 hover:bg-slate-700/80 transition-colors group ${
        status === 'ended' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Category + Status */}
          <div className="flex items-center gap-2 mb-1.5">
            {categoryMeta && (
              <span className="text-xs text-slate-400">
                {categoryMeta.icon} {categoryMeta.label}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusMeta.color} ${statusMeta.bg}`}>
              {statusMeta.label}
            </span>
            {event.isFree && (
              <span className="text-xs px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/20">
                무료
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            {event.titleKo}
          </h3>
          {event.titleKo !== event.title && (
            <p className="text-slate-500 text-sm">{event.title}</p>
          )}

          {/* Description */}
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{event.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span>📅 {dateStr}</span>
            <span>📍 {event.venue}</span>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {event.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date badge on right */}
        <div className="flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs text-slate-400">{format(startDate, 'MMM', { locale: ko })}</span>
          <span className="text-lg font-bold text-white">{format(startDate, 'd')}</span>
        </div>
      </div>
    </a>
  );
}
