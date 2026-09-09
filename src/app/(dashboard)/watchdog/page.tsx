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
    error,
    mode,
    refresh,
    page,
    setPage,
    addTicker,
    removeTicker,
    addPresetGroup,
    clearAll,
    hasTicker,
  } = useWatchdog();

  return (
    <div>
      <PageHeader
        title="관심 종목 뉴스"
        description="관심 기업·종목의 이름과 일치하는 수집 뉴스를 확인하세요. 브라우저에 최대 100개 종목을 저장합니다."
      />

      {mode === 'demo' && <p className="intel-notice">샘플 기사입니다. 실제 기업 상황이 아닙니다.</p>}
      {error && <div role="alert" className="intel-notice">{error}<button className="action-text" onClick={() => void refresh()}>다시 시도</button></div>}
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
          {total > 20 && <div className="flex justify-between mt-4"><button className="action-secondary" disabled={page === 1 || isLoading} onClick={() => setPage(page - 1)}>이전</button><span className="t-body">{page} 페이지</span><button className="action-secondary" disabled={page * 20 >= total || isLoading} onClick={() => setPage(page + 1)}>다음</button></div>}
        </div>
      </div>
    </div>
  );
}
