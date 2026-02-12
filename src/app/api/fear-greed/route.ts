import { NextResponse } from "next/server";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      next: { revalidate: 1800 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const item = data.data?.[0];

    if (!item) throw new Error("No data");

    const result = {
      value: parseInt(item.value, 10),
      classification: item.value_classification ?? "Neutral",
      timestamp: item.timestamp,
    };

    cache = { data: result, timestamp: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fear & greed index" },
      { status: 500 }
    );
  }
}
