'use client';

import { KoreaEvent, EventStatus } from '@/types/event';
import { EVENT_CATEGORIES } from '@/lib/constants/events';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  ongoing: { label: '진행 중', className: 'text-emerald-400 bg-emerald-400/10' },
  upcoming: { label: '예정', className: 'text-blue-400 bg-blue-400/10' },
  ended: { label: '종료', className: 'text-slate-500 bg-white/[0.06]' },
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
      className={`group block rounded-xl border border-white/[0.06] bg-slate-800 p-4 transition-colors hover:border-white/[0.14] ${
        status === 'ended' ? 'opacity-55' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Category + Status */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded px-1.5 py-0.5 text-[0.6875rem] font-medium leading-tight ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
            {event.isFree && (
              <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[0.6875rem] font-medium leading-tight text-emerald-400">
                무료
              </span>
            )}
            {categoryMeta && (
              <span className="text-[0.6875rem] text-slate-500">{categoryMeta.label}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[0.9375rem] font-semibold leading-snug text-slate-100 transition-colors group-hover:text-blue-400">
            {event.titleKo}
          </h3>
          {event.titleKo !== event.title && (
            <p className="mt-0.5 text-[0.6875rem] text-slate-600">{event.title}</p>
          )}

          {/* Description */}
          <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-slate-500">
            {event.description}
          </p>

          {/* Meta */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-slate-500">
            <span className="tnum">{dateStr}</span>
            <span className="text-slate-700">·</span>
            <span>{event.venue}</span>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
              {event.tags.slice(0, 4).map(tag => (
                <span key={tag} className="text-[0.6875rem] text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Date badge on right */}
        <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
          <span className="text-[0.625rem] text-slate-500">
            {format(startDate, 'MMM', { locale: ko })}
          </span>
          <span className="tnum text-[0.9375rem] font-semibold leading-tight text-slate-100">
            {format(startDate, 'd')}
          </span>
        </div>
      </div>
    </a>
  );
}
