import { WatchlistItem } from '@/types/watchdog';

export type StockEntry = {
  ticker: string;
  name: string;
  nameKo: string;
  exchange: 'NYSE' | 'NASDAQ' | 'KRX';
};

export const STOCK_DATABASE: StockEntry[] = [
  // US Big Tech
  { ticker: 'AAPL', name: 'Apple', nameKo: '애플', exchange: 'NASDAQ' },
  { ticker: 'MSFT', name: 'Microsoft', nameKo: '마이크로소프트', exchange: 'NASDAQ' },
  { ticker: 'GOOGL', name: 'Alphabet', nameKo: '구글(알파벳)', exchange: 'NASDAQ' },
  { ticker: 'AMZN', name: 'Amazon', nameKo: '아마존', exchange: 'NASDAQ' },
  { ticker: 'NVDA', name: 'NVIDIA', nameKo: '엔비디아', exchange: 'NASDAQ' },
  { ticker: 'META', name: 'Meta Platforms', nameKo: '메타', exchange: 'NASDAQ' },
  { ticker: 'TSLA', name: 'Tesla', nameKo: '테슬라', exchange: 'NASDAQ' },

  // US Semiconductor
  { ticker: 'AMD', name: 'Advanced Micro Devices', nameKo: 'AMD', exchange: 'NASDAQ' },
  { ticker: 'INTC', name: 'Intel', nameKo: '인텔', exchange: 'NASDAQ' },
  { ticker: 'AVGO', name: 'Broadcom', nameKo: '브로드컴', exchange: 'NASDAQ' },
  { ticker: 'QCOM', name: 'Qualcomm', nameKo: '퀄컴', exchange: 'NASDAQ' },
  { ticker: 'MU', name: 'Micron Technology', nameKo: '마이크론', exchange: 'NASDAQ' },
  { ticker: 'ARM', name: 'Arm Holdings', nameKo: 'ARM', exchange: 'NASDAQ' },
  { ticker: 'MRVL', name: 'Marvell Technology', nameKo: '마벨', exchange: 'NASDAQ' },

  // US Software / Cloud
  { ticker: 'CRM', name: 'Salesforce', nameKo: '세일즈포스', exchange: 'NYSE' },
  { ticker: 'ORCL', name: 'Oracle', nameKo: '오라클', exchange: 'NYSE' },
  { ticker: 'ADBE', name: 'Adobe', nameKo: '어도비', exchange: 'NASDAQ' },
  { ticker: 'NOW', name: 'ServiceNow', nameKo: '서비스나우', exchange: 'NYSE' },
  { ticker: 'SNOW', name: 'Snowflake', nameKo: '스노우플레이크', exchange: 'NYSE' },
  { ticker: 'PLTR', name: 'Palantir Technologies', nameKo: '팔란티어', exchange: 'NYSE' },

  // US Finance
  { ticker: 'JPM', name: 'JPMorgan Chase', nameKo: 'JP모건', exchange: 'NYSE' },
  { ticker: 'V', name: 'Visa', nameKo: '비자', exchange: 'NYSE' },
  { ticker: 'MA', name: 'Mastercard', nameKo: '마스터카드', exchange: 'NYSE' },
  { ticker: 'BAC', name: 'Bank of America', nameKo: '뱅크오브아메리카', exchange: 'NYSE' },
  { ticker: 'GS', name: 'Goldman Sachs', nameKo: '골드만삭스', exchange: 'NYSE' },

  // US Healthcare / Pharma
  { ticker: 'JNJ', name: 'Johnson & Johnson', nameKo: '존슨앤존슨', exchange: 'NYSE' },
  { ticker: 'UNH', name: 'UnitedHealth', nameKo: '유나이티드헬스', exchange: 'NYSE' },
  { ticker: 'LLY', name: 'Eli Lilly', nameKo: '일라이릴리', exchange: 'NYSE' },
  { ticker: 'PFE', name: 'Pfizer', nameKo: '화이자', exchange: 'NYSE' },
  { ticker: 'MRNA', name: 'Moderna', nameKo: '모더나', exchange: 'NASDAQ' },

  // US Consumer / Industrial
  { ticker: 'WMT', name: 'Walmart', nameKo: '월마트', exchange: 'NYSE' },
  { ticker: 'COST', name: 'Costco', nameKo: '코스트코', exchange: 'NASDAQ' },
  { ticker: 'DIS', name: 'Walt Disney', nameKo: '디즈니', exchange: 'NYSE' },
  { ticker: 'NFLX', name: 'Netflix', nameKo: '넷플릭스', exchange: 'NASDAQ' },
  { ticker: 'NKE', name: 'Nike', nameKo: '나이키', exchange: 'NYSE' },
  { ticker: 'BA', name: 'Boeing', nameKo: '보잉', exchange: 'NYSE' },
  { ticker: 'XOM', name: 'ExxonMobil', nameKo: '엑슨모빌', exchange: 'NYSE' },
  { ticker: 'COIN', name: 'Coinbase', nameKo: '코인베이스', exchange: 'NASDAQ' },

  // US AI / Robotics
  { ticker: 'AI', name: 'C3.ai', nameKo: 'C3.ai', exchange: 'NYSE' },
  { ticker: 'PATH', name: 'UiPath', nameKo: '유아이패스', exchange: 'NYSE' },
  { ticker: 'SMCI', name: 'Super Micro Computer', nameKo: '슈퍼마이크로', exchange: 'NASDAQ' },

  // KR Semiconductor
  { ticker: '005930', name: 'Samsung Electronics', nameKo: '삼성전자', exchange: 'KRX' },
  { ticker: '000660', name: 'SK hynix', nameKo: 'SK하이닉스', exchange: 'KRX' },

  // KR Battery / EV
  { ticker: '373220', name: 'LG Energy Solution', nameKo: 'LG에너지솔루션', exchange: 'KRX' },
  { ticker: '006400', name: 'Samsung SDI', nameKo: '삼성SDI', exchange: 'KRX' },
  { ticker: '051910', name: 'LG Chem', nameKo: 'LG화학', exchange: 'KRX' },

  // KR Internet / Platform
  { ticker: '035420', name: 'Naver', nameKo: '네이버', exchange: 'KRX' },
  { ticker: '035720', name: 'Kakao', nameKo: '카카오', exchange: 'KRX' },
  { ticker: '263750', name: 'Pearl Abyss', nameKo: '펄어비스', exchange: 'KRX' },

  // KR Bio / Pharma
  { ticker: '207940', name: 'Samsung Biologics', nameKo: '삼성바이오로직스', exchange: 'KRX' },
  { ticker: '068270', name: 'Celltrion', nameKo: '셀트리온', exchange: 'KRX' },

  // KR Finance
  { ticker: '105560', name: 'KB Financial Group', nameKo: 'KB금융', exchange: 'KRX' },
  { ticker: '055550', name: 'Shinhan Financial Group', nameKo: '신한지주', exchange: 'KRX' },

  // KR Major
  { ticker: '000270', name: 'Kia', nameKo: '기아', exchange: 'KRX' },
  { ticker: '005380', name: 'Hyundai Motor', nameKo: '현대차', exchange: 'KRX' },
  { ticker: '066570', name: 'LG Electronics', nameKo: 'LG전자', exchange: 'KRX' },
  { ticker: '003550', name: 'LG', nameKo: 'LG', exchange: 'KRX' },
  { ticker: '012330', name: 'Hyundai Mobis', nameKo: '현대모비스', exchange: 'KRX' },
  { ticker: '028260', name: 'Samsung C&T', nameKo: '삼성물산', exchange: 'KRX' },
  { ticker: '034730', name: 'SK', nameKo: 'SK', exchange: 'KRX' },
  { ticker: '017670', name: 'SK Telecom', nameKo: 'SK텔레콤', exchange: 'KRX' },
  { ticker: '030200', name: 'KT', nameKo: 'KT', exchange: 'KRX' },
  { ticker: '032640', name: 'LG Uplus', nameKo: 'LG유플러스', exchange: 'KRX' },
  { ticker: '009150', name: 'Samsung Electro-Mechanics', nameKo: '삼성전기', exchange: 'KRX' },
  { ticker: '010130', name: 'Korea Zinc', nameKo: '고려아연', exchange: 'KRX' },
  { ticker: '086790', name: 'Hana Financial Group', nameKo: '하나금융지주', exchange: 'KRX' },
  { ticker: '018260', name: 'Samsung SDS', nameKo: '삼성SDS', exchange: 'KRX' },
];

/** Search stocks by ticker, name, or Korean name */
export function searchStocks(query: string, limit = 8): StockEntry[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  return STOCK_DATABASE
    .filter(s =>
      s.ticker.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.nameKo.includes(q)
    )
    .slice(0, limit);
}

/** Convert StockEntry to WatchlistItem */
export function stockToWatchlistItem(stock: StockEntry): WatchlistItem {
  return {
    ticker: stock.ticker,
    name: stock.name,
    nameKo: stock.nameKo,
    exchange: stock.exchange,
    addedAt: new Date().toISOString(),
  };
}

/** Flat name map for all stocks in the database */
export const STOCK_NAME_MAP: Record<string, { name: string; nameKo: string }> = {};
for (const stock of STOCK_DATABASE) {
  STOCK_NAME_MAP[stock.ticker] = { name: stock.name, nameKo: stock.nameKo };
}
