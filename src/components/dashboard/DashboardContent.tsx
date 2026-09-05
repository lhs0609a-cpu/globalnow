'use client';

import { useState } from 'react';
import { MorningBrief } from './MorningBrief';
import { CategoryTabs } from './CategoryTabs';
import { NewsFeed } from './NewsFeed';
import { MarketWidget } from './MarketWidget';
import { TrendingBar } from './TrendingBar';
import { CountryCompare } from './CountryCompare';
import { HumorSection } from './HumorSection';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

/** Keep a failing widget contained so it cannot blank out the whole dashboard. */
function Widget({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="surface p-5 text-center">
          <p className="t-body-sm text-slate-400">{name}을(를) 불러오지 못했습니다</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export function DashboardContent() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="space-y-[var(--gap-section)]">
      {/* Morning Brief */}
      <Widget name="모닝 브리프">
        <MorningBrief />
      </Widget>

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-7">
        {/* News Feed */}
        <div className="min-w-0 flex-1">
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
          <Widget name="뉴스 피드">
            <NewsFeed category={activeCategory} />
          </Widget>
        </div>

        {/* Right Sidebar */}
        <div className="w-full flex-shrink-0 space-y-5 lg:w-[21rem]">
          <Widget name="시장 데이터">
            <MarketWidget />
          </Widget>
          <Widget name="글로벌 트렌딩">
            <TrendingBar />
          </Widget>
        </div>
      </div>

      {/* Country Compare */}
      <Widget name="국가 비교">
        <CountryCompare />
      </Widget>

      {/* Humor Section */}
      <Widget name="유머 섹션">
        <HumorSection />
      </Widget>
    </div>
  );
}
