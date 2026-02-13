import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/api-security";
import { validateStockSymbol } from "@/lib/api-validation";

// In-memory cache: symbol -> { data, timestamp }
const cache = new Map<
  string,
  { data: StockQuoteData; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface StockQuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export async function GET(request: NextRequest) {
  const blocked = applyRateLimit(request, "cached");
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const symbolResult = validateStockSymbol(searchParams.get("symbol"));

  if (!symbolResult.valid) {
    return NextResponse.json(
      { error: symbolResult.error },
      { status: 400 }
    );
  }

  const symbol = symbolResult.value;

  // Check cache
  const cached = cache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // Use Yahoo Finance v8 API (public, no key needed)
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "GlobalNow/1.0",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch quote" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      return NextResponse.json(
        { error: "No data found for symbol" },
        { status: 404 }
      );
    }

    const meta = result.meta;
    const previousClose = meta.chartPreviousClose || meta.previousClose || 0;
    const currentPrice = meta.regularMarketPrice || 0;
    const change = currentPrice - previousClose;
    const changePercent = previousClose
      ? (change / previousClose) * 100
      : 0;

    const quoteData: StockQuoteData = {
      symbol: meta.symbol || symbol,
      name: meta.shortName || meta.longName || symbol,
      price: currentPrice,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      currency: meta.currency || "USD",
    };

    // Cache result
    cache.set(symbol, { data: quoteData, timestamp: Date.now() });

    // Clean old cache
    if (cache.size > 200) {
      const now = Date.now();
      for (const [k, v] of cache) {
        if (now - v.timestamp > CACHE_TTL) cache.delete(k);
      }
    }

    return NextResponse.json(quoteData);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stock quote" },
      { status: 500 }
    );
  }
}
