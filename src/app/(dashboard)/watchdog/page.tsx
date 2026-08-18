'use client';

import { useWatchdog } from '@/hooks/useWatchdog';
import { WatchlistManager } from '@/components/watchdog/WatchlistManager';
import { WatchdogFeed } from '@/components/watchdog/WatchdogFeed';
import { PageHeader } from '@/components/layout/AppShell';

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
    <div>
      <PageHeader
        title="포트폴리오 워치독"
        description="관심 종목을 등록하고 관련 뉴스를 실시간으로 추적하세요"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Watchlist Manager */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[4.75rem]">
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
