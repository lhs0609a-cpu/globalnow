'use client';

import { useState, useEffect } from 'react';
import { KeywordAlert } from '@/types/user';

export function KeywordAlerts() {
  const [alerts, setAlerts] = useState<KeywordAlert[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/user/alerts');
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const addAlert = async () => {
    if (!newKeyword.trim()) return;
    try {
      const res = await fetch('/api/user/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword }),
      });
      const data = await res.json();
      setAlerts(prev => [...prev, {
        id: data.id,
        userId: 'demo',
        keyword: newKeyword,
        isActive: true,
        createdAt: new Date().toISOString(),
        matchCount: 0,
      }]);
      setNewKeyword('');
    } catch (error) {
      console.error('Failed to add alert:', error);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <span>🔔</span> 키워드 알림
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newKeyword}
          onChange={e => setNewKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addAlert()}
          placeholder="키워드 입력..."
          className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={addAlert}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          추가
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${alert.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className="text-white text-sm">{alert.keyword}</span>
                <span className="text-slate-500 text-xs">({alert.matchCount}회 매칭)</span>
              </div>
              <button className="text-slate-400 hover:text-red-400 transition-colors text-xs">
                삭제
              </button>
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">등록된 키워드 알림이 없습니다</p>
          )}
        </div>
      )}
    </div>
  );
}
