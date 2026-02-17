'use client';

import { WatchlistItem } from '@/types/watchdog';
import { WATCHLIST_PRESETS } from '@/lib/constants/watchlist-presets';

type Props = {
  watchlist: WatchlistItem[];
  onAdd: (item: WatchlistItem) => void;
  onRemove: (ticker: string) => void;
  onAddGroup: (items: WatchlistItem[]) => void;
  onClearAll: () => void;
  hasTicker: (ticker: string) => boolean;
};

export function WatchlistManager({ watchlist, onAdd, onRemove, onAddGroup, onClearAll, hasTicker }: Props) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">관심 종목</h3>
        {watchlist.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* Current watchlist */}
      {watchlist.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {watchlist.map(item => (
            <span
              key={item.ticker}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              <span className="font-medium">{item.ticker}</span>
              <span className="text-blue-400/60 text-xs">{item.nameKo}</span>
              <button
                onClick={() => onRemove(item.ticker)}
                className="ml-1 text-blue-400/40 hover:text-red-400 transition-colors"
                aria-label={`${item.nameKo} 삭제`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Preset groups */}
      <div className="space-y-3">
        {WATCHLIST_PRESETS.map(group => {
          const allAdded = group.items.every(i => hasTicker(i.ticker));
          return (
            <div key={group.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">{group.label}</span>
                {!allAdded && (
                  <button
                    onClick={() => onAddGroup(group.items)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    전체 추가
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => {
                  const added = hasTicker(item.ticker);
                  return (
                    <button
                      key={item.ticker}
                      onClick={() => (added ? onRemove(item.ticker) : onAdd(item))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        added
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
                      }`}
                    >
                      {item.ticker}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {watchlist.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-2">
          위 프리셋을 클릭하거나 종목을 추가하세요
        </p>
      )}
    </div>
  );
}
