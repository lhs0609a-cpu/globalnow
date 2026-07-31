'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { WatchlistItem } from '@/types/watchdog';
import { WATCHLIST_PRESETS } from '@/lib/constants/watchlist-presets';
import { searchStocks, stockToWatchlistItem } from '@/lib/constants/stock-database';

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

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
            placeholder="종목 검색 (AAPL, 삼성전자, 005930...)"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-700 text-white text-sm rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none placeholder-slate-500"
          />
        </div>

        {/* Autocomplete dropdown */}
        {showDropdown && searchQuery.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-20 top-full mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg shadow-xl overflow-hidden"
          >
            {results.length > 0 ? (
              <>
                {results.map((stock, idx) => {
                  const alreadyAdded = hasTicker(stock.ticker);
                  return (
                    <button
                      key={stock.ticker}
                      onClick={() => !alreadyAdded && handleSelectResult(stock)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        alreadyAdded
                          ? 'opacity-40 cursor-not-allowed'
                          : idx === highlightIndex
                          ? 'bg-slate-600'
                          : 'hover:bg-slate-600/50'
                      }`}
                      disabled={alreadyAdded}
                    >
                      <span className="text-xs text-slate-500 font-mono w-10 flex-shrink-0">
                        {stock.exchange}
                      </span>
                      <span className="text-blue-400 text-sm font-medium w-16 flex-shrink-0">
                        {stock.ticker}
                      </span>
                      <span className="text-white text-sm truncate">
                        {stock.nameKo}
                      </span>
                      <span className="text-slate-500 text-xs truncate ml-auto">
                        {stock.name}
                      </span>
                      {alreadyAdded && (
                        <span className="text-blue-400 text-[10px] flex-shrink-0">추가됨</span>
                      )}
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="px-3 py-3 text-sm">
                <p className="text-slate-400 mb-2">검색 결과 없음</p>
                <button
                  onClick={() => addCustomTicker(searchQuery)}
                  className="text-blue-400 hover:text-blue-300 text-xs"
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
          종목을 검색하거나 프리셋을 클릭하여 추가하세요
        </p>
      )}
    </div>
  );
}
