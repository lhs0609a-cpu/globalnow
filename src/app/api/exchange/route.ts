import { NextResponse } from "next/server";

const CURRENCIES = ["KRW", "EUR", "JPY", "GBP", "CNY"];
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

let cache: { data: unknown; timestamp: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data);
  }

  try {
    const symbols = CURRENCIES.join(",");

    const [latestRes, yesterdayRes] = await Promise.all([
      fetch(
        `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${symbols}`
      ),
      fetch(
        `https://api.frankfurter.dev/v1/${getYesterday()}?base=USD&symbols=${symbols}`
      ),
    ]);

    if (!latestRes.ok || !yesterdayRes.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const latest = await latestRes.json();
    const yesterday = await yesterdayRes.json();

    const rates = CURRENCIES.map((currency) => {
      const rate = latest.rates[currency] || 0;
      const previousRate = yesterday.rates[currency] || rate;
      const change = rate - previousRate;
      const changePercent = previousRate
        ? (change / previousRate) * 100
        : 0;

      return {
        currency,
        rate,
        previousRate,
        change,
        changePercent,
      };
    });

    cache = { data: rates, timestamp: Date.now() };

    return NextResponse.json(rates);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  // Skip weekends (Frankfurter has no weekend data)
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() - 2); // Sunday -> Friday
  if (day === 6) d.setDate(d.getDate() - 1); // Saturday -> Friday
  return d.toISOString().split("T")[0];
}
