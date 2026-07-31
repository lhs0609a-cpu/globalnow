'use client';

import { useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { EVENT_CATEGORIES } from '@/lib/constants/events';
import { EventCategory } from '@/types/event';
import { EventCard } from '@/components/events/EventCard';
import { EventCalendar } from '@/components/events/EventCalendar';
import { format, isSameDay, parseISO } from 'date-fns';

const categoryTabs = [
  { id: 'all', label: '전체', icon: '📋' },
  ...EVENT_CATEGORIES.map(c => ({ id: c.id, label: c.label, icon: c.icon })),
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📅</span> 전시회/컨퍼런스
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          한국 주요 전시회, 컨퍼런스, 데모데이 일정
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="이벤트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        {categoryTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleCategoryChange(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              (category || 'all') === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content: Calendar + Event list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                onClick={() => setSelectedDay(null)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {format(selectedDay, 'M월 d일')} 필터 해제 ✕
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 bg-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-white text-sm font-semibold mb-2">이벤트 현황</h4>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">진행 중</span>
              <span className="text-white">{events.filter(e => e.status === 'ongoing').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">예정</span>
              <span className="text-white">{events.filter(e => e.status === 'upcoming').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">종료</span>
              <span className="text-white">{events.filter(e => e.status === 'ended').length}</span>
            </div>
          </div>
        </div>

        {/* Event list (right on lg) */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-700 rounded w-1/4" />
                      <div className="h-5 bg-slate-700 rounded w-2/3" />
                      <div className="h-3 bg-slate-700 rounded w-1/2" />
                      <div className="h-3 bg-slate-700 rounded w-1/3" />
                    </div>
                    <div className="w-14 h-14 bg-slate-700 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayEvents.length === 0 ? (
            <div className="bg-slate-800/50 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-white font-semibold mb-1">이벤트가 없습니다</h3>
              <p className="text-slate-400 text-sm">
                {selectedDay ? '선택한 날짜에 이벤트가 없습니다' : '필터를 변경해 보세요'}
              </p>
            </div>
          ) : (
            displayEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}

          {!isLoading && displayEvents.length > 0 && (
            <div className="text-slate-500 text-xs text-center pt-2">
              총 {displayEvents.length}개 이벤트
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
