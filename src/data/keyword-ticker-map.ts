import type { TickerMatch } from "@/types/news";

interface TickerEntry {
  keywords: string[];
  symbol: string;
  name: string;
}

const TICKER_MAP: TickerEntry[] = [
  // US Tech
  { keywords: ["apple", "iphone", "ipad", "macbook"], symbol: "AAPL", name: "Apple" },
  { keywords: ["google", "alphabet", "gemini ai", "android"], symbol: "GOOGL", name: "Alphabet" },
  { keywords: ["microsoft", "windows", "azure", "copilot"], symbol: "MSFT", name: "Microsoft" },
  { keywords: ["amazon", "aws", "alexa"], symbol: "AMZN", name: "Amazon" },
  { keywords: ["meta", "facebook", "instagram", "whatsapp", "threads"], symbol: "META", name: "Meta" },
  { keywords: ["nvidia", "gpu", "cuda", "geforce"], symbol: "NVDA", name: "NVIDIA" },
  { keywords: ["tesla", "elon musk", "spacex", "cybertruck"], symbol: "TSLA", name: "Tesla" },
  { keywords: ["netflix"], symbol: "NFLX", name: "Netflix" },
  { keywords: ["openai", "chatgpt"], symbol: "MSFT", name: "Microsoft (OpenAI)" },

  // Korean
  { keywords: ["samsung", "삼성", "galaxy"], symbol: "005930.KS", name: "Samsung" },
  { keywords: ["hyundai", "현대", "ioniq"], symbol: "005380.KS", name: "Hyundai" },
  { keywords: ["sk hynix", "하이닉스"], symbol: "000660.KS", name: "SK Hynix" },
  { keywords: ["lg"], symbol: "066570.KS", name: "LG Electronics" },
  { keywords: ["kakao", "카카오"], symbol: "035720.KS", name: "Kakao" },
  { keywords: ["naver", "네이버"], symbol: "035420.KS", name: "Naver" },

  // Japanese
  { keywords: ["toyota", "トヨタ"], symbol: "TM", name: "Toyota" },
  { keywords: ["sony", "playstation", "ソニー"], symbol: "SONY", name: "Sony" },
  { keywords: ["nintendo", "任天堂", "switch"], symbol: "NTDOY", name: "Nintendo" },

  // Crypto
  { keywords: ["bitcoin", "btc", "비트코인"], symbol: "BTC-USD", name: "Bitcoin" },
  { keywords: ["ethereum", "eth", "이더리움"], symbol: "ETH-USD", name: "Ethereum" },
  { keywords: ["solana", "sol"], symbol: "SOL-USD", name: "Solana" },
  { keywords: ["ripple", "xrp"], symbol: "XRP-USD", name: "Ripple" },
  { keywords: ["dogecoin", "doge"], symbol: "DOGE-USD", name: "Dogecoin" },

  // Finance
  { keywords: ["jpmorgan", "jp morgan"], symbol: "JPM", name: "JPMorgan" },
  { keywords: ["goldman sachs"], symbol: "GS", name: "Goldman Sachs" },
  { keywords: ["visa"], symbol: "V", name: "Visa" },
  { keywords: ["mastercard"], symbol: "MA", name: "Mastercard" },

  // Other US
  { keywords: ["boeing"], symbol: "BA", name: "Boeing" },
  { keywords: ["walmart"], symbol: "WMT", name: "Walmart" },
  { keywords: ["disney"], symbol: "DIS", name: "Disney" },
  { keywords: ["coca cola", "coca-cola"], symbol: "KO", name: "Coca-Cola" },
  { keywords: ["pfizer"], symbol: "PFE", name: "Pfizer" },
  { keywords: ["moderna"], symbol: "MRNA", name: "Moderna" },

  // Oil & Energy
  { keywords: ["oil", "crude", "opec", "원유"], symbol: "CL=F", name: "Crude Oil" },
  { keywords: ["gold", "금값"], symbol: "GC=F", name: "Gold" },
  { keywords: ["exxon", "exxonmobil"], symbol: "XOM", name: "ExxonMobil" },

  // Chinese
  { keywords: ["alibaba", "알리바바"], symbol: "BABA", name: "Alibaba" },
  { keywords: ["tencent", "텐센트", "wechat"], symbol: "TCEHY", name: "Tencent" },
  { keywords: ["baidu", "바이두"], symbol: "BIDU", name: "Baidu" },
  { keywords: ["byd"], symbol: "BYDDY", name: "BYD" },

  // European
  { keywords: ["volkswagen", "vw"], symbol: "VWAGY", name: "Volkswagen" },
  { keywords: ["bmw"], symbol: "BMWYY", name: "BMW" },
  { keywords: ["airbus"], symbol: "EADSY", name: "Airbus" },
  { keywords: ["nestle", "nestlé"], symbol: "NSRGY", name: "Nestlé" },

  // Indices
  { keywords: ["dow jones", "dow"], symbol: "^DJI", name: "Dow Jones" },
  { keywords: ["s&p 500", "s&p"], symbol: "^GSPC", name: "S&P 500" },
  { keywords: ["nasdaq"], symbol: "^IXIC", name: "NASDAQ" },
  { keywords: ["kospi", "코스피"], symbol: "^KS11", name: "KOSPI" },
  { keywords: ["nikkei", "日経"], symbol: "^N225", name: "Nikkei 225" },
];

export function findTickersForText(text: string): TickerMatch[] {
  const lower = text.toLowerCase();
  const matches: TickerMatch[] = [];
  const seen = new Set<string>();

  for (const entry of TICKER_MAP) {
    if (seen.has(entry.symbol)) continue;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        matches.push({
          keyword,
          symbol: entry.symbol,
          name: entry.name,
        });
        seen.add(entry.symbol);
        break;
      }
    }
  }

  return matches.slice(0, 5); // Max 5 matches
}
