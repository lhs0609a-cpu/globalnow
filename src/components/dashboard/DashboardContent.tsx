'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MorningBrief } from './MorningBrief';
import { CategoryTabs } from './CategoryTabs';
import { NewsFeed } from './NewsFeed';
import { MarketWidget } from './MarketWidget';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Icon } from '@/components/ui/Icon';
import { track } from '@/lib/analytics/events';

const WorldNewsMap = dynamic(() => import('./WorldNewsMap').then(m => m.WorldNewsMap), {
  loading: () => <p role="status" className="surface p-8">국가별 뉴스를 준비하고 있습니다…</p>,
});
const TrendingBar = dynamic(() => import('./TrendingBar').then(m => m.TrendingBar));

function Widget({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export function DashboardContent({ search, category }: { search: string; category: string }) {
  const router = useRouter();
  const [mapOpen, setMapOpen] = useState(false);
  const [trendsOpen, setTrendsOpen] = useState(false);
  useEffect(() => { track('page_view', { hasSearch: Boolean(search), category }); }, [search, category]);

  const changeCategory = (next: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (next !== 'all') params.set('category', next);
    track('filter_change', { category: next });
    router.push(params.size ? `/?${params}` : '/', { scroll: false });
  };

  return (
    <div className="space-y-6">
      <section className="edition-heading" aria-labelledby="edition-title">
        <div className="min-w-0">
          <p className="t-kicker mb-3 text-accent-text">GLOBAL PERSPECTIVE · 한국어로 읽는 세계</p>
          <h1 id="edition-title" className="t-display text-slate-100">{search ? '찾고 있는 뉴스, 한곳에서.' : '세계의 흐름을 읽는 시간.'}</h1>
          <p className="t-body mt-3 max-w-2xl text-slate-400">
            {search ? `“${search}” 검색 결과입니다. 주제를 선택해 범위를 좁혀 보세요.` : '주요 언론의 뉴스와 시장 흐름을 살펴보고, 관심 있는 기사는 저장하세요.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/brief" className="action-primary"><Icon name="brief" className="h-4 w-4" />오늘의 브리프</Link>
          <button type="button" className="action-secondary" aria-expanded={mapOpen} aria-controls="world-explorer" onClick={() => setMapOpen(v => !v)}>
            <Icon name="globe" className="h-4 w-4" />국가별 탐색
          </button>
        </div>
      </section>
      <div id="world-explorer" hidden={!mapOpen}>{mapOpen && <Widget><WorldNewsMap /></Widget>}</div>
      <div className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="news-heading" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="news-heading" className="t-headline-lg">{search ? '검색 결과' : '최신 뉴스'}</h2>
            {(search || category !== 'all') && <Link href="/" className="action-text">필터 초기화<Icon name="close" className="h-4 w-4" /></Link>}
          </div>
          <CategoryTabs activeCategory={category} onChange={changeCategory} />
          <Widget><NewsFeed key={`${category}:${search}`} category={category} search={search} /></Widget>
        </section>
        <aside aria-label="오늘의 요약과 시장" className="min-w-0 space-y-5">
          <Widget><MorningBrief /></Widget>
          <Widget><MarketWidget /></Widget>
          <div className="surface overflow-hidden">
            <button type="button" className="flex min-h-12 w-full items-center justify-between gap-3 p-4 text-left t-label" aria-expanded={trendsOpen} aria-controls="global-trends" onClick={() => setTrendsOpen(v => !v)}>
              커뮤니티 트렌드<Icon name="chevronDown" className={`h-4 w-4 ${trendsOpen ? 'rotate-180' : ''}`} />
            </button>
            <div id="global-trends" hidden={!trendsOpen}>{trendsOpen && <Widget><TrendingBar /></Widget>}</div>
          </div>
          <div className="surface p-5">
            <p className="t-kicker text-accent-text">더 깊이 살펴보기</p>
            <Link href="/compare" className="explore-link">같은 이슈, 다른 나라의 관점<Icon name="chevronRight" className="h-4 w-4" /></Link>
            <Link href="/reports" className="explore-link">산업별 리포트 읽기<Icon name="chevronRight" className="h-4 w-4" /></Link>
            <Link href="/fun" className="explore-link">잠깐 쉬어가는 유머<Icon name="chevronRight" className="h-4 w-4" /></Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
