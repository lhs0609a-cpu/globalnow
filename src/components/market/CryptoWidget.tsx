'use client';

import { CryptoData } from '@/types/market';
import { formatPrice, formatPercent } from '@/lib/utils/format';

export function CryptoWidget({ crypto }: { crypto: CryptoData[] }) {
  return (
    <div className="space-y-2">
      {crypto.map(coin => (
        <div key={coin.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 t-body font-medium">{coin.symbol}</span>
            <span className="text-slate-500 t-body-sm">{coin.nameKo}</span>
          </div>
          <div className="text-right">
            <div className="text-slate-100 t-body">${formatPrice(coin.price)}</div>
            <div className={`t-body-sm ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatPercent(coin.change24h)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
