import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/api-security";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
];

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
let cache: { data: unknown; timestamp: number } | null = null;

export async function GET(request: NextRequest) {
  const blocked = applyRateLimit(request, "cached");
  if (blocked) return blocked;

  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const ids = COINS.map((c) => c.id).join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 120 } }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    const results = COINS.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      price: data[coin.id]?.usd ?? 0,
      changePercent: data[coin.id]?.usd_24h_change ?? 0,
    }));

    cache = { data: results, timestamp: Date.now() };
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch crypto data" },
      { status: 500 }
    );
  }
}
