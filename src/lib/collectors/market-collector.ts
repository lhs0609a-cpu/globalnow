export async function collectMarketData() {
  const [crypto, indices] = await Promise.all([
    collectCryptoData(),
    collectIndexData(),
  ]);

  return { crypto, indices };
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

async function collectIndexData() {
  // Yahoo Finance API (via proxy or direct)
  // For now, return empty - would use yahoo-finance2 in production
  return [];
}
