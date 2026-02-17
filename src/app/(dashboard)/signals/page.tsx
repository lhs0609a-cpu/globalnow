'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/format';

type Signal = {
  id: string;
  type: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  company?: string;
  ticker?: string;
  value?: number;
  source: string;
  sourceUrl: string;
  detectedAt: string;
  significance: 'high' | 'medium' | 'low';
};

const typeLabels: Record<string, string> = {
  insider_trade: '내부자 거래',
  sec_filing: 'SEC 공시',
  patent: '특허',
  executive_move: '임원 이동',
};

const typeIcons: Record<string, string> = {
  insider_trade: '💰',
  sec_filing: '📄',
  patent: '🔬',
  executive_move: '👔',
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch('/api/signals');
        const data = await res.json();
        setSignals(data);
      } catch (error) {
        console.error('Failed to fetch signals:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSignals();
  }, []);

  const filtered = filter === 'all' ? signals : signals.filter(s => s.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">인사이더 시그널</h1>
        <p className="text-slate-400 text-sm mt-1">내부자 거래, SEC 공시, 특허, 임원 이동 추적</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {['all', 'insider_trade', 'sec_filing', 'patent', 'executive_move'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {type === 'all' ? '전체' : `${typeIcons[type] || ''} ${typeLabels[type] || type}`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(signal => (
            <div key={signal.id} className="bg-slate-800 rounded-xl p-5 hover:ring-1 hover:ring-slate-600 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{typeIcons[signal.type] || '📊'}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={signal.significance === 'high' ? 'danger' : signal.significance === 'medium' ? 'warning' : 'info'}>
                        {signal.significance === 'high' ? '높음' : signal.significance === 'medium' ? '보통' : '낮음'}
                      </Badge>
                      <span className="text-slate-500 text-xs">{typeLabels[signal.type] || signal.type}</span>
                      {signal.ticker && (
                        <span className="text-blue-400 text-xs font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                          ${signal.ticker}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold">{signal.titleKo}</h3>
                    <p className="text-slate-400 text-sm mt-1">{signal.descriptionKo}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>{formatRelativeTime(signal.detectedAt)}</span>
                      <span>{signal.source}</span>
                      {signal.value && <span className="text-amber-400">${formatNumber(signal.value)}</span>}
                    </div>
                  </div>
                </div>
                <a
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:text-blue-300 flex-shrink-0"
                >
                  원문 →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
