'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { WatchlistItem } from '@/types/watchdog';
import { WATCHLIST_PRESETS } from '@/lib/constants/watchlist-presets';
import { searchStocks, stockToWatchlistItem } from '@/lib/constants/stock-database';
import { Icon } from '@/components/ui/Icon';

type Props = {
  watchlist: WatchlistItem[];
  onAdd: (item: WatchlistItem) => void;
  onRemove: (ticker: string) => void;
  onAddGroup: (items: WatchlistItem[]) => void;
  onClearAll: () => void;
  hasTicker: (ticker: string) => boolean;
};

export function WatchlistManager({ watchlist, onAdd, onRemove, onAddGroup, onClearAll, hasTicker }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = searchQuery.length > 0 ? searchStocks(searchQuery, 8) : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addCustomTicker = useCallback((ticker: string) => {
    const t = ticker.trim().toUpperCase();
    if (!t || hasTicker(t)) return;

    // Check if it's a number (KRX) or text (NASDAQ)
    const isKrx = /^\d+$/.test(t);
    onAdd({
      ticker: t,
      name: t,
      nameKo: t,
      exchange: isKrx ? 'KRX' : 'NASDAQ',
      addedAt: new Date().toISOString(),
    });
    setSearchQuery('');
    setShowDropdown(false);
  }, [hasTicker, onAdd]);

  const handleSelectResult = useCallback((stock: typeof results[0]) => {
    if (!hasTicker(stock.ticker)) {
      onAdd(stockToWatchlistItem(stock));
    }
    setSearchQuery('');
    setShowDropdown(false);
    setHighlightIndex(-1);
  }, [hasTicker, onAdd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < results.length) {
        handleSelectResult(results[highlightIndex]);
      } else if (searchQuery.trim()) {
        // If there's an exact match, use it
        const exact = results.find(r => r.ticker.toLowerCase() === searchQuery.trim().toLowerCase());
        if (exact) {
          handleSelectResult(exact);
        } else {
          addCustomTicker(searchQuery);
        }
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightIndex(-1);
    }
  }, [highlightIndex, results, searchQuery, handleSelectResult, addCustomTicker]);

  return (
    <div className="space-y-4 rounded-xl border border-white/[0.06] bg-slate-800 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[0.875rem] font-semibold text-slate-100">관심 종목</h3>
        {watchlist.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-md px-2 py-1 text-[0.6875rem] text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-red-400"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="종목 검색 (AAPL, 삼성전자, 005930)"
            className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-[0.8125rem] text-slate-100 transition-colors placeholder:text-slate-500 hover:border-white/[0.14] focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        {/* Autocomplete dropdown */}
        {showDropdown && searchQuery.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-white/[0.1] bg-slate-700 shadow-2xl shadow-black/40"
          >
            {results.length > 0 ? (
              results.map((stock, idx) => {
                const alreadyAdded = hasTicker(stock.ticker);
                return (
                  <button
                    key={stock.ticker}
                    type="button"
                    onClick={() => !alreadyAdded && handleSelectResult(stock)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      alreadyAdded
                        ? 'cursor-not-allowed opacity-40'
                        : idx === highlightIndex
                        ? 'bg-white/[0.07]'
                        : 'hover:bg-white/[0.05]'
                    }`}
                    disabled={alreadyAdded}
                  >
                    <span className="w-9 flex-shrink-0 font-mono text-[0.625rem] text-slate-500">
                      {stock.exchange}
                    </span>
                    <span className="w-14 flex-shrink-0 text-[0.8125rem] font-medium text-blue-400">
                      {stock.ticker}
                    </span>
                    <span className="truncate text-[0.8125rem] text-slate-100">
                      {stock.nameKo}
                    </span>
                    {alreadyAdded && (
                      <span className="ml-auto flex-shrink-0 text-[0.625rem] text-blue-400">
                        추가됨
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3">
                <p className="mb-1.5 text-[0.8125rem] text-slate-400">검색 결과 없음</p>
                <button
                  type="button"
                  onClick={() => addCustomTicker(searchQuery)}
                  className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  &quot;{searchQuery.toUpperCase()}&quot; 직접 추가 (Enter)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current watchlist */}
      {watchlist.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {watchlist.map(item => (
            <span
              key={item.ticker}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-400/10 py-1 pl-2.5 pr-1.5 text-xs text-blue-400"
            >
              <span className="font-medium">{item.ticker}</span>
              <button
                type="button"
                onClick={() => onRemove(item.ticker)}
                className="flex h-4 w-4 items-center justify-center rounded text-blue-400/50 transition-colors hover:bg-white/[0.08] hover:text-red-400"
                aria-label={`${item.nameKo} 삭제`}
              >
                <Icon name="close" className="h-3 w-3" strokeWidth={2} />
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
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </span>
                {!allAdded && (
                  <button
                    type="button"
                    onClick={() => onAddGroup(group.items)}
                    className="rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium text-blue-400 transition-colors hover:bg-white/[0.04] hover:text-blue-300"
                  >
                    전체 추가
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {group.items.map(item => {
                  const added = hasTicker(item.ticker);
                  return (
                    <button
                      key={item.ticker}
                      type="button"
                      onClick={() => (added ? onRemove(item.ticker) : onAdd(item))}
                      aria-pressed={added}
                      className={`rounded-md px-2 py-1 text-[0.6875rem] font-medium transition-colors ${
                        added
                          ? 'bg-blue-400/10 text-blue-400'
                          : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-100'
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
        <p className="py-1 text-center text-[0.6875rem] text-slate-600">
          종목을 검색하거나 위 프리셋을 눌러 추가하세요
        </p>
      )}
    </div>
  );
}
