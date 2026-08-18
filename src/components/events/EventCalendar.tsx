'use client';

import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { KoreaEvent } from '@/types/event';
import { Icon } from '@/components/ui/Icon';

type EventCalendarProps = {
  events: KoreaEvent[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayClick: (day: Date) => void;
  selectedDay?: Date | null;
};

export function EventCalendar({
  events,
  currentMonth,
  onMonthChange,
  onDayClick,
  selectedDay,
}: EventCalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventDays = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      // Mark each day from start to end
      const dayRange = eachDayOfInterval({ start, end });
      for (const d of dayRange) {
        const key = format(d, 'yyyy-MM-dd');
        map.set(key, (map.get(key) || 0) + 1);
      }
    }
    return map;
  }, [events]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-800 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          aria-label="이전 달"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-100"
        >
          <Icon name="chevronRight" className="h-4 w-4 rotate-180" />
        </button>
        <h3 className="tnum text-[0.875rem] font-semibold text-slate-100">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h3>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          aria-label="다음 달"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-100"
        >
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7">
        {weekDays.map(d => (
          <div key={d} className="py-1 text-center text-[0.625rem] font-medium text-slate-600">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const eventCount = eventDays.get(dateKey) || 0;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onDayClick(day)}
              aria-pressed={isSelected}
              className={`tnum relative h-8 rounded-md text-[0.6875rem] font-medium transition-colors ${
                !isCurrentMonth
                  ? 'text-slate-700'
                  : isSelected
                  ? 'bg-blue-500 text-white'
                  : isToday
                  ? 'bg-white/[0.08] text-slate-100'
                  : 'text-slate-300 hover:bg-white/[0.05]'
              }`}
            >
              {format(day, 'd')}
              {eventCount > 0 && isCurrentMonth && (
                <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-[0.1875rem] w-[0.1875rem] rounded-full ${
                        isSelected ? 'bg-white/80' : 'bg-blue-400'
                      }`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
