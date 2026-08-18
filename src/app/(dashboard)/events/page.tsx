'use client';

import { useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { EVENT_CATEGORIES } from '@/lib/constants/events';
import { EventCategory } from '@/types/event';
import { EventCard } from '@/components/events/EventCard';
import { EventCalendar } from '@/components/events/EventCalendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { PageHeader } from '@/components/layout/AppShell';
import { FilterChip } from '@/components/ui/Button';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const categoryTabs = [
  { id: 'all', label: '전체' },
  ...EVENT_CATEGORIES.map(c => ({ id: c.id, label: c.label })),
];

export default function EventsPage() {
  const { events, isLoading, category, setCategory, search, setSearch, month, setMonth } = useEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const handleCategoryChange = (id: string) => {
    setCategory(id === 'all' ? undefined : (id as EventCategory));
    setSelectedDay(null);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    setMonth(date.getMonth() + 1);
    setSelectedDay(null);
  };

  const handleDayClick = (day: Date) => {
    if (selectedDay && isSameDay(day, selectedDay)) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  // Filter events by selected day
  const displayEvents = useMemo(() => {
    if (!selectedDay) return events;
    return events.filter(e => {
      const start = parseISO(e.startDate);
      const end = parseISO(e.endDate);
      return selectedDay >= start && selectedDay <= end;
    });
  }, [events, selectedDay]);

  return (
    <div>
      <PageHeader
        title="전시회 · 컨퍼런스"
        description="한국 주요 전시회, 컨퍼런스, 데모데이 일정"
      />

      {/* Search */}
      <div className="relative mb-3">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="이벤트 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-9 pr-9 text-[0.8125rem] text-slate-100 transition-colors placeholder:text-slate-500 hover:border-white/[0.14] focus:border-blue-500/50 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="검색어 지우기"
            className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition-colors hover:text-slate-100"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="scrollbar-hide mb-5 flex gap-1 overflow-x-auto">
        {categoryTabs.map(tab => (
          <FilterChip
            key={tab.id}
            active={(category || 'all') === tab.id}
            onClick={() => handleCategoryChange(tab.id)}
          >
            {tab.label}
          </FilterChip>
        ))}
      </div>

      {/* Main content: Calendar + Event list */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Calendar (left on lg) */}
        <div className="lg:col-span-1">
          <EventCalendar
            events={events}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            onDayClick={handleDayClick}
            selectedDay={selectedDay}
          />

          {selectedDay && (
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
              >
                {format(selectedDay, 'M월 d일')} 필터 해제
                <Icon name="close" className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Stats */}
          <Card className="mt-4">
            <CardHeader title="이벤트 현황" />
            <CardDivider />
            <div className="px-5 py-3">
              {[
                { label: '진행 중', dot: 'bg-emerald-400', count: events.filter(e => e.status === 'ongoing').length },
                { label: '예정', dot: 'bg-blue-400', count: events.filter(e => e.status === 'upcoming').length },
                { label: '종료', dot: 'bg-slate-600', count: events.filter(e => e.status === 'ended').length },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2 text-[0.8125rem] text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                    {row.label}
                  </span>
                  <span className="tnum text-[0.8125rem] font-medium text-slate-100">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Event list (right on lg) */}
        <div className="space-y-3 lg:col-span-2">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-slate-800 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="shimmer h-2.5 w-1/4 rounded bg-white/[0.05]" />
                      <div className="shimmer h-4 w-2/3 rounded bg-white/[0.05]" />
                      <div className="shimmer h-3 w-1/2 rounded bg-white/[0.05]" />
                    </div>
                    <div className="shimmer h-14 w-14 rounded-lg bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayEvents.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-slate-800 px-6 py-16 text-center">
              <p className="text-[0.875rem] font-medium text-slate-300">이벤트가 없습니다</p>
              <p className="mt-1 text-[0.8125rem] text-slate-500">
                {selectedDay ? '선택한 날짜에 이벤트가 없습니다' : '필터를 변경해 보세요'}
              </p>
            </div>
          ) : (
            displayEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}

          {!isLoading && displayEvents.length > 0 && (
            <p className="pt-1 text-center text-[0.6875rem] text-slate-500">
              총 {displayEvents.length}개 이벤트
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
