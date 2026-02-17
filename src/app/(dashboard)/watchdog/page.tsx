'use client';

import { useWatchdog } from '@/hooks/useWatchdog';
import { WatchlistManager } from '@/components/watchdog/WatchlistManager';
import { WatchdogFeed } from '@/components/watchdog/WatchdogFeed';

export default function WatchdogPage() {
  const {
    watchlist,
    news,
    total,
    isLoading,
    addTicker,
    removeTicker,
    addPresetGroup,
    clearAll,
    hasTicker,
  } = useWatchdog();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Watchdog</h1>
        <p className="text-slate-400 text-sm mt-1">
          관심 종목을 등록하고 관련 뉴스를 실시간으로 추적하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Watchlist Manager */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <WatchlistManager
              watchlist={watchlist}
              onAdd={addTicker}
              onRemove={removeTicker}
              onAddGroup={addPresetGroup}
              onClearAll={clearAll}
              hasTicker={hasTicker}
            />
          </div>
        </div>

        {/* Right: News Feed */}
        <div className="lg:col-span-8">
          <WatchdogFeed
            items={news}
            total={total}
            isLoading={isLoading}
            isEmpty={watchlist.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
