'use client';

import { useState, useEffect, useCallback } from 'react';
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

type SignalResult = {
  signals: Signal[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
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

const significanceLabels: Record<string, string> = {
  high: '높음',
  medium: '보통',
  low: '낮음',
};

export default function SignalsPage() {
  const [result, setResult] = useState<SignalResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [significanceFilter, setSignificanceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const limit = 20;

  const fetchSignals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('type', filter);
      if (significanceFilter !== 'all') params.set('significance', significanceFilter);
      if (searchQuery) params.set('company', searchQuery);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await fetch(`/api/signals?${params.toString()}`);
      const data = await res.json();

      // Handle both old format (array) and new format (object with signals array)
      if (Array.isArray(data)) {
        setResult({ signals: data, total: data.length, page: 1, limit: data.length, hasMore: false });
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error('Failed to fetch signals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, significanceFilter, searchQuery, page]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filter, significanceFilter, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const signals = result?.signals || [];
  const total = result?.total || 0;
  const hasMore = result?.hasMore || false;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">인사이더 시그널</h1>
          <p className="text-slate-400 text-sm mt-1">내부자 거래, SEC 공시, 특허, 임원 이동 추적</p>
        </div>
        {total > 0 && (
          <span className="text-sm text-slate-500 mt-1">
            총 {total}건
          </span>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="회사명 또는 티커 검색 (예: Apple, NVDA, 삼성...)"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-800 text-white text-sm rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none placeholder-slate-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          검색
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchInput(''); setSearchQuery(''); }}
            className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-400 text-sm rounded-lg transition-colors"
          >
            초기화
          </button>
        )}
      </form>

      {/* Type filter tabs */}
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

      {/* Significance filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">중요도:</span>
        {['all', 'high', 'medium', 'low'].map(sig => (
          <button
            key={sig}
            onClick={() => setSignificanceFilter(sig)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              significanceFilter === sig
                ? sig === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : sig === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : sig === 'low' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {sig === 'all' ? '전체' : significanceLabels[sig] || sig}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : signals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">시그널을 찾을 수 없습니다</p>
          <p className="text-slate-600 text-sm mt-1">검색어나 필터를 변경해 보세요</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {signals.map(signal => {
              const isExpanded = expandedId === signal.id;
              return (
                <div
                  key={signal.id}
                  className={`bg-slate-800 rounded-xl p-5 transition-all cursor-pointer ${
                    isExpanded ? 'ring-1 ring-blue-500/50' : 'hover:ring-1 hover:ring-slate-600'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : signal.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{typeIcons[signal.type] || '📊'}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant={signal.significance === 'high' ? 'danger' : signal.significance === 'medium' ? 'warning' : 'info'}>
                            {significanceLabels[signal.significance] || signal.significance}
                          </Badge>
                          <span className="text-slate-500 text-xs">{typeLabels[signal.type] || signal.type}</span>
                          {signal.ticker && (
                            <span className="text-blue-400 text-xs font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                              ${signal.ticker}
                            </span>
                          )}
                          {signal.company && (
                            <span className="text-slate-400 text-xs">{signal.company}</span>
                          )}
                        </div>
                        <h3 className="text-white font-semibold">{signal.titleKo}</h3>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="mt-3 space-y-2">
                            <p className="text-slate-300 text-sm">{signal.descriptionKo}</p>
                            <p className="text-slate-500 text-xs italic">{signal.description}</p>
                            {signal.sourceUrl && (
                              <a
                                href={signal.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300 mt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                원문 보기 →
                              </a>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>{formatRelativeTime(signal.detectedAt)}</span>
                          <span>{signal.source}</span>
                          {signal.value && <span className="text-amber-400">${formatNumber(signal.value)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <svg
                        className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={!hasMore}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
