'use client';

import { useState, useEffect } from 'react';
import { MorningBrief as MorningBriefType } from '@/types/news';
import { Badge } from '@/components/ui/Badge';

export default function BriefPage() {
  const [brief, setBrief] = useState<MorningBriefType | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/brief/${selectedDate}`);
        const data = await res.json();
        setBrief(data);
      } catch (error) {
        console.error('Failed to fetch brief:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrief();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">모닝 브리프</h1>
          <p className="text-slate-400 text-sm mt-1">매일 아침 꼭 알아야 할 글로벌 뉴스</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : brief ? (
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
            <p className="text-slate-300 text-sm">{brief.summary}</p>
          </div>
          <div className="p-6 space-y-4">
            {brief.items.map(item => (
              <div key={item.rank} className="flex gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-bold">{item.rank}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={item.impact === 'high' ? 'danger' : item.impact === 'medium' ? 'warning' : 'info'}>
                      {item.impact === 'high' ? '높음' : item.impact === 'medium' ? '보통' : '낮음'}
                    </Badge>
                    <span className="text-slate-500 text-xs">{item.source}</span>
                    <span className="text-slate-600 text-xs">|</span>
                    <span className="text-slate-500 text-xs">{item.category}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.titleKo}</h3>
                  <p className="text-slate-400 text-sm">{item.summaryKo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">해당 날짜의 브리프가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
