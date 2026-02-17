'use client';

import { useState } from 'react';
import { MorningBrief } from './MorningBrief';
import { CategoryTabs } from './CategoryTabs';
import { NewsFeed } from './NewsFeed';
import { MarketWidget } from './MarketWidget';
import { TrendingBar } from './TrendingBar';
import { CountryCompare } from './CountryCompare';
import { HumorSection } from './HumorSection';

export function DashboardContent() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="space-y-6">
      {/* Morning Brief */}
      <MorningBrief />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* News Feed */}
        <div className="flex-1 min-w-0">
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
          <NewsFeed category={activeCategory} />
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          <MarketWidget />
          <TrendingBar />
        </div>
      </div>

      {/* Country Compare */}
      <CountryCompare />

      {/* Humor Section */}
      <HumorSection />
    </div>
  );
}
