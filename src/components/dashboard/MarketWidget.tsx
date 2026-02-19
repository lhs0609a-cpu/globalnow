'use client';

import { useMarket } from '@/hooks/useMarket';
import { MarketSkeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatPercent } from '@/lib/utils/format';

export function MarketWidget() {
  const { data, isLoading } = useMarket();

  if (isLoading || !data || !Array.isArray(data.indices)) return <MarketSkeleton />;

  return (
    <div className="space-y-4">
      {/* Stock Indices */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <span>📈</span> 주요 지수
        </h3>
        <div className="space-y-2">
          {data.indices.map(index => (
            <div key={index.symbol} className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">{index.nameKo}</span>
                <span className="text-slate-500 text-xs ml-1">({index.symbol})</span>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{formatPrice(index.value)}</div>
                <div className={`text-xs ${index.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPercent(index.changePercent)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <span>🪙</span> 암호화폐
        </h3>
        <div className="space-y-2">
          {data.crypto.map(coin => (
            <div key={coin.id} className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">{coin.nameKo}</span>
                <span className="text-slate-500 text-xs ml-1">{coin.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">${formatPrice(coin.price)}</div>
                <div className={`text-xs ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPercent(coin.change24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forex */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <span>💱</span> 환율
        </h3>
        <div className="space-y-2">
          {data.forex.map(fx => (
            <div key={fx.pair} className="flex items-center justify-between">
              <span className="text-white text-sm">{fx.nameKo}</span>
              <div className="text-right">
                <div className="text-white text-sm">{formatPrice(fx.rate)}</div>
                <div className={`text-xs ${fx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPercent(fx.changePercent)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fear & Greed */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <span>😱</span> 공포 & 탐욕 지수
        </h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-16">
            <svg viewBox="0 0 120 60" className="w-full h-full">
              <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <path
                d="M10 55 A50 50 0 0 1 110 55"
                fill="none"
                stroke="url(#fearGreedGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${((data.fearGreed?.value || 0) / 100) * 157} 157`}
              />
              <defs>
                <linearGradient id="fearGreedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end">
              <span className="text-white text-xl font-bold">{data.fearGreed?.value ?? '-'}</span>
              <span className="text-slate-400 text-xs">{data.fearGreed?.labelKo ?? ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
