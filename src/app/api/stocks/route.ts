import { NextResponse } from "next/server";

const SYMBOLS: Record<string, { name: string; short: string }> = {
  "^GSPC": { name: "S&P 500", short: "SPX" },
  "^DJI": { name: "다우존스", short: "DJI" },
  "^IXIC": { name: "나스닥", short: "IXIC" },
  "^N225": { name: "닛케이 225", short: "N225" },
  "^HSI": { name: "항셍", short: "HSI" },
  "^KS11": { name: "코스피", short: "KOSPI" },
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const results = await Promise.allSettled(
      Object.entries(SYMBOLS).map(async ([symbol, info]) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2d&interval=1d`;
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          next: { revalidate: 300 },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const meta = data.chart?.result?.[0]?.meta;

        if (!meta) throw new Error("No data");

        const price = meta.regularMarketPrice ?? 0;
        const previousClose =
          meta.chartPreviousClose ?? meta.previousClose ?? price;
        const change = price - previousClose;
        const changePercent = previousClose
          ? (change / previousClose) * 100
          : 0;

        return {
          symbol: info.short,
          name: info.name,
          price,
          change,
          changePercent,
        };
      })
    );

    const stocks = results
      .filter(
        (r): r is PromiseFulfilledResult<{
          symbol: string;
          name: string;
          price: number;
          change: number;
          changePercent: number;
        }> => r.status === "fulfilled"
      )
      .map((r) => r.value);

    if (stocks.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch any stock data" },
        { status: 502 }
      );
    }

    cache = { data: stocks, timestamp: Date.now() };
    return NextResponse.json(stocks);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
