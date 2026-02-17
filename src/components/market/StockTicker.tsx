'use client';

import { useMarket } from '@/hooks/useMarket';
import { formatPrice, formatPercent } from '@/lib/utils/format';

export function StockTicker() {
  const { data, isLoading } = useMarket();

  if (isLoading || !data) return null;

  const allItems = [
    ...data.indices.map(i => ({ name: i.nameKo, value: formatPrice(i.value), change: i.changePercent })),
    ...data.crypto.map(c => ({ name: c.symbol, value: '$' + formatPrice(c.price), change: c.change24h })),
    ...data.forex.map(f => ({ name: f.nameKo, value: formatPrice(f.rate), change: f.changePercent })),
  ];

  return (
    <div className="bg-slate-800/50 border-b border-slate-700/50 overflow-hidden">
      <div className="flex animate-scroll gap-8 py-2 px-4 whitespace-nowrap">
        {allItems.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs">
            <span className="text-slate-400">{item.name}</span>
            <span className="text-white">{item.value}</span>
            <span className={item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {formatPercent(item.change)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
