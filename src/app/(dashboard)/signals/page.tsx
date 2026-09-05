'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/format';
import { PageHeader } from '@/components/layout/AppShell';
import { Button, FilterChip } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Skeleton';

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
    <div>
      <PageHeader
        title="인사이더 시그널"
        description="내부자 거래, SEC 공시, 특허, 임원 이동 추적"
        action={
          total > 0 ? (
            <span className="tnum t-body-sm text-slate-500">총 {total}건</span>
          ) : undefined
        }
      />

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="회사명 또는 티커 검색 (예: Apple, NVDA, 삼성)"
            className="h-9 w-full rounded-lg border border-line-strong bg-fill-subtle pl-9 pr-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-500 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary">
          검색
        </Button>
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => { setSearchInput(''); setSearchQuery(''); }}
          >
            초기화
          </Button>
        )}
      </form>

      {/* Type filter tabs */}
      <div className="scrollbar-hide mb-2 flex gap-1 overflow-x-auto">
        {['all', 'insider_trade', 'sec_filing', 'patent', 'executive_move'].map(type => (
          <FilterChip
            key={type}
            active={filter === type}
            onClick={() => setFilter(type)}
          >
            {type === 'all' ? '전체' : typeLabels[type] || type}
          </FilterChip>
        ))}
      </div>

      {/* Significance filter */}
      <div className="mb-5 flex flex-wrap items-center gap-1">
        <span className="mr-1 t-meta-sm text-slate-500">중요도</span>
        {['all', 'high', 'medium', 'low'].map(sig => (
          <button
            key={sig}
            type="button"
            aria-pressed={significanceFilter === sig}
            onClick={() => setSignificanceFilter(sig)}
            className={`rounded-md px-2.5 py-1 t-meta-sm font-medium transition-colors ${
              significanceFilter === sig
                ? 'bg-fill text-slate-100'
                : 'text-slate-500 hover:bg-fill-weak hover:text-slate-300'
            }`}
          >
            {sig === 'all' ? '전체' : significanceLabels[sig] || sig}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : signals.length === 0 ? (
        <div className="surface px-6 py-16 text-center">
          <p className="t-body font-medium text-slate-300">
            시그널을 찾을 수 없습니다
          </p>
          <p className="mt-1 t-body-sm text-slate-500">
            검색어나 필터를 변경해 보세요
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {signals.map(signal => {
              const isExpanded = expandedId === signal.id;
              return (
                <div
                  key={signal.id}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? null : signal.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedId(isExpanded ? null : signal.id);
                    }
                  }}
                  className={`cursor-pointer rounded-xl border bg-surface px-5 py-4 transition-colors ${
                    isExpanded
                      ? 'border-blue-500/40'
                      : 'border-line hover:border-line-strong'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <Badge variant={signal.significance === 'high' ? 'danger' : signal.significance === 'medium' ? 'warning' : 'info'}>
                          {significanceLabels[signal.significance] || signal.significance}
                        </Badge>
                        <span className="t-meta-sm text-slate-500">
                          {typeLabels[signal.type] || signal.type}
                        </span>
                        {signal.ticker && (
                          <span className="rounded bg-blue-400/10 px-1.5 py-0.5 font-mono t-meta-sm text-blue-400">
                            ${signal.ticker}
                          </span>
                        )}
                        {signal.company && (
                          <span className="t-meta-sm text-slate-400">{signal.company}</span>
                        )}
                      </div>

                      <h3 className="t-headline-sm text-slate-100">
                        {signal.titleKo}
                      </h3>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-3 space-y-2 border-l-2 border-line-strong pl-3">
                          <p className="t-body-sm text-slate-300">
                            {signal.descriptionKo}
                          </p>
                          <p className="t-body-sm italic leading-relaxed text-slate-500">
                            {signal.description}
                          </p>
                          {signal.sourceUrl && (
                            <a
                              href={signal.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 t-body-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              원문 보기
                              <Icon name="external" className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 t-meta-sm text-slate-500">
                        <span>{formatRelativeTime(signal.detectedAt)}</span>
                        <span>{signal.source}</span>
                        {signal.value && (
                          <span className="tnum text-amber-400">
                            ${formatNumber(signal.value)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Icon
                      name="chevronDown"
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-6">
              <Button
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                이전
              </Button>
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
                      type="button"
                      onClick={() => setPage(pageNum)}
                      aria-current={page === pageNum ? 'page' : undefined}
                      className={`tnum h-8 w-8 rounded-lg text-[0.8125rem] font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-400 hover:bg-fill-weak hover:text-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={!hasMore}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
