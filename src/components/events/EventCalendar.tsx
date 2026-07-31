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
    <div className="bg-slate-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="text-slate-400 hover:text-white p-1 transition-colors"
        >
          ◀
        </button>
        <h3 className="text-white font-semibold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h3>
        <button
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="text-slate-400 hover:text-white p-1 transition-colors"
        >
          ▶
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs text-slate-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const eventCount = eventDays.get(dateKey) || 0;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick(day)}
              className={`relative h-9 rounded-lg text-xs font-medium transition-colors ${
                !isCurrentMonth
                  ? 'text-slate-600'
                  : isSelected
                  ? 'bg-blue-500 text-white'
                  : isToday
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {format(day, 'd')}
              {eventCount > 0 && isCurrentMonth && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-blue-400'
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
