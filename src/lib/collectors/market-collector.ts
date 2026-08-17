import { ForexRate, FearGreedIndex, MarketIndex } from '@/types/market';

export async function collectMarketData() {
  const [crypto, indices, forex, fearGreed] = await Promise.allSettled([
    collectCryptoData(),
    collectIndexData(),
    collectForexData(),
    collectFearGreedIndex(),
  ]);

  return {
    crypto: crypto.status === 'fulfilled' ? crypto.value : [],
    indices: indices.status === 'fulfilled' ? indices.value : [],
    forex: forex.status === 'fulfilled' ? forex.value : [],
    fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
  };
}

async function collectCryptoData() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano&sparkline=true&price_change_percentage=24h',
      { headers: { 'User-Agent': 'GLOBALNOW/1.0' } }
    );
    const data = await res.json();
    return (data || []).map((coin: Record<string, unknown>) => ({
      id: coin.id,
      symbol: (coin.symbol as string).toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      sparkline: (coin.sparkline_in_7d as { price: number[] })?.price?.slice(-7),
    }));
  } catch (error) {
    console.error('Failed to collect crypto data:', error);
    return [];
  }
}

/** Collect forex data from Frankfurter API (free, no key required) */
export async function collectForexData(): Promise<ForexRate[]> {
  try {
    // Fetch current rates first
    const latestRes = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW,EUR,JPY,CNY', {
      headers: { 'User-Agent': 'GLOBALNOW/1.0' },
    });

    if (!latestRes.ok) return [];

    const latest = await latestRes.json() as { date: string; rates: Record<string, number> };
    if (!latest.rates?.KRW) return [];

    // Use the date from the latest response to compute the previous day
    // (avoids getting same-date data when ECB hasn't published today yet)
    const prevDate = getPreviousBusinessDayFrom(latest.date);
    const prevRes = await fetch(`https://api.frankfurter.dev/v1/${prevDate}?base=USD&symbols=KRW,EUR,JPY,CNY`, {
      headers: { 'User-Agent': 'GLOBALNOW/1.0' },
    });

    // If prev fetch fails, still return current rates with 0 change
    let prev: { rates: Record<string, number> } = { rates: latest.rates };
    if (prevRes.ok) {
      const prevData = await prevRes.json() as { date: string; rates: Record<string, number> };
      // Only use if it's actually a different date
      if (prevData.date !== latest.date && prevData.rates?.KRW) {
        prev = prevData;
      }
    }

    const now = new Date().toISOString();
    const usdKrw = latest.rates.KRW;
    const prevUsdKrw = prev.rates.KRW;

    // Cross-rate computation: X/KRW = USD_KRW / USD_X
    const pairs: { pair: string; name: string; nameKo: string; divisor: number; prevDivisor: number; multiplier: number }[] = [
      { pair: 'USD/KRW', name: 'USD/KRW', nameKo: '달러/원', divisor: 1, prevDivisor: 1, multiplier: 1 },
      { pair: 'EUR/KRW', name: 'EUR/KRW', nameKo: '유로/원', divisor: latest.rates.EUR, prevDivisor: prev.rates.EUR, multiplier: 1 },
      { pair: 'JPY/KRW', name: 'JPY/KRW', nameKo: '엔/원(100)', divisor: latest.rates.JPY, prevDivisor: prev.rates.JPY, multiplier: 100 },
      { pair: 'CNY/KRW', name: 'CNY/KRW', nameKo: '위안/원', divisor: latest.rates.CNY, prevDivisor: prev.rates.CNY, multiplier: 1 },
    ];

    return pairs.map(({ pair, name, nameKo, divisor, prevDivisor, multiplier }) => {
      const rate = (usdKrw / divisor) * multiplier;
      const prevRate = (prevUsdKrw / prevDivisor) * multiplier;
      const change = rate - prevRate;
      const changePercent = prevRate !== 0 ? (change / prevRate) * 100 : 0;

      return {
        pair,
        name,
        nameKo,
        rate: Math.round(rate * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        updatedAt: now,
      };
    });
  } catch (error) {
    console.error('Failed to collect forex data:', error);
    return [];
  }
}

/** Collect Fear & Greed Index from alternative.me (free, no key required) */
export async function collectFearGreedIndex(): Promise<FearGreedIndex | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=2', {
      headers: { 'User-Agent': 'GLOBALNOW/1.0' },
    });

    if (!res.ok) return null;

    const data = await res.json() as {
      data: Array<{ value: string; value_classification: string }>;
    };

    if (!data.data || data.data.length === 0) return null;

    const current = data.data[0];
    const previous = data.data[1] || current;

    const labelKoMap: Record<string, string> = {
      'Extreme Fear': '극도의 공포',
      'Fear': '공포',
      'Neutral': '중립',
      'Greed': '탐욕',
      'Extreme Greed': '극도의 탐욕',
    };

    return {
      value: parseInt(current.value, 10),
      label: current.value_classification,
      labelKo: labelKoMap[current.value_classification] || current.value_classification,
      previousValue: parseInt(previous.value, 10),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to collect Fear & Greed Index:', error);
    return null;
  }
}

/** Collect major stock indices from Yahoo Finance (unofficial, no key required) */
export async function collectIndexData(): Promise<MarketIndex[]> {
  const symbols: { symbol: string; yahoo: string; name: string; nameKo: string }[] = [
    { symbol: 'SPX', yahoo: '^GSPC', name: 'S&P 500', nameKo: 'S&P 500' },
    { symbol: 'DJI', yahoo: '^DJI', name: 'Dow Jones', nameKo: '다우존스' },
    { symbol: 'IXIC', yahoo: '^IXIC', name: 'NASDAQ', nameKo: '나스닥' },
    { symbol: 'N225', yahoo: '^N225', name: 'Nikkei 225', nameKo: '닛케이 225' },
    { symbol: 'HSI', yahoo: '^HSI', name: 'Hang Seng', nameKo: '항셍' },
    { symbol: 'KOSPI', yahoo: '^KS11', name: 'KOSPI', nameKo: '코스피' },
  ];

  const results: MarketIndex[] = [];

  const fetchPromises = symbols.map(async ({ symbol, yahoo, name, nameKo }) => {
    try {
      // 5d window: this endpoint has no `previousClose`, and `chartPreviousClose`
      // is the close *before* the window — with a 2d range that yields a two-session
      // delta. Derive the prior close from the daily close series instead.
      const res = await fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahoo)}?range=5d&interval=1d`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }
      );

      if (!res.ok) return null;

      const data = await res.json() as {
        chart: {
          result: Array<{
            meta: {
              regularMarketPrice?: number;
              chartPreviousClose?: number;
              regularMarketTime?: number;
              gmtoffset?: number;
            };
            timestamp?: number[];
            indicators?: { quote?: Array<{ close?: (number | null)[] }> };
          }>;
        };
      };

      const result = data.chart?.result?.[0];
      const meta = result?.meta;
      if (!meta) return null;

      const rawCloses = result.indicators?.quote?.[0]?.close ?? [];
      const bars = (result.timestamp ?? [])
        .map((t, i) => ({ t, c: rawCloses[i] }))
        .filter((b): b is { t: number; c: number } =>
          Number.isFinite(b.t) && Number.isFinite(b.c)
        );

      const lastBar = bars.length > 0 ? bars[bars.length - 1] : undefined;
      const value = Number.isFinite(meta.regularMarketPrice)
        ? (meta.regularMarketPrice as number)
        : lastBar?.c;
      if (value === undefined) return null;

      // The prior close is the last daily bar from a session before the current
      // one. Comparing prices instead would fail on float rounding, and
      // `chartPreviousClose` sits before the whole window — only use it as a
      // last resort.
      const gmtoffset = Number.isFinite(meta.gmtoffset) ? meta.gmtoffset! : 0;
      const dayOf = (epochSec: number) => Math.floor((epochSec + gmtoffset) / 86400);
      const currentDay = Number.isFinite(meta.regularMarketTime)
        ? dayOf(meta.regularMarketTime!)
        : lastBar && dayOf(lastBar.t);

      const priorBars = currentDay === undefined
        ? bars.slice(0, -1)
        : bars.filter(b => dayOf(b.t) < currentDay);
      const candidate = priorBars.length > 0
        ? priorBars[priorBars.length - 1].c
        : meta.chartPreviousClose;

      const prevClose =
        typeof candidate === 'number' && Number.isFinite(candidate) && candidate !== 0
          ? candidate
          : null;

      const change = prevClose !== null ? value - prevClose : 0;
      const changePercent = prevClose !== null ? (change / prevClose) * 100 : 0;

      return {
        symbol,
        name,
        nameKo,
        value: Math.round(value * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  });

  const settled = await Promise.allSettled(fetchPromises);
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) {
      results.push(result.value);
    }
  }

  return results;
}

/** Get previous business day from a given date string (YYYY-MM-DD) */
function getPreviousBusinessDayFrom(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  const day = d.getUTCDay();
  // If Monday (1), go back to Friday; if Sunday (0), go back to Friday; otherwise go back 1 day
  if (day === 1) d.setUTCDate(d.getUTCDate() - 3);
  else if (day === 0) d.setUTCDate(d.getUTCDate() - 2);
  else d.setUTCDate(d.getUTCDate() - 1);

  return d.toISOString().split('T')[0];
}
