import { NewsSource } from '@/types/news';

export const NEWS_SOURCES: NewsSource[] = [
  // US
  { id: 'reuters', name: 'Reuters', nameKo: '로이터', country: 'US', countryFlag: '🇺🇸', url: 'https://www.reuters.com', rssUrl: 'https://www.rss.reuters.com/news/topnews', category: 'international', reliability: 5 },
  { id: 'ap', name: 'AP News', nameKo: 'AP 통신', country: 'US', countryFlag: '🇺🇸', url: 'https://apnews.com', rssUrl: 'https://rsshub.app/apnews/topics/apf-topnews', category: 'international', reliability: 5 },
  { id: 'nytimes', name: 'New York Times', nameKo: '뉴욕타임스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.nytimes.com', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'international', reliability: 4 },
  { id: 'wsj', name: 'Wall Street Journal', nameKo: '월스트리트저널', country: 'US', countryFlag: '🇺🇸', url: 'https://www.wsj.com', rssUrl: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', category: 'economy', reliability: 5 },
  { id: 'bloomberg', name: 'Bloomberg', nameKo: '블룸버그', country: 'US', countryFlag: '🇺🇸', url: 'https://www.bloomberg.com', rssUrl: 'https://feeds.bloomberg.com/markets/news.rss', category: 'economy', reliability: 5 },
  { id: 'cnbc', name: 'CNBC', nameKo: 'CNBC', country: 'US', countryFlag: '🇺🇸', url: 'https://www.cnbc.com', rssUrl: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', category: 'economy', reliability: 4 },
  { id: 'techcrunch', name: 'TechCrunch', nameKo: '테크크런치', country: 'US', countryFlag: '🇺🇸', url: 'https://techcrunch.com', rssUrl: 'https://techcrunch.com/feed/', category: 'tech', reliability: 4 },
  { id: 'theverge', name: 'The Verge', nameKo: '더 버지', country: 'US', countryFlag: '🇺🇸', url: 'https://www.theverge.com', rssUrl: 'https://www.theverge.com/rss/index.xml', category: 'tech', reliability: 4 },
  { id: 'wired', name: 'Wired', nameKo: '와이어드', country: 'US', countryFlag: '🇺🇸', url: 'https://www.wired.com', rssUrl: 'https://www.wired.com/feed/rss', category: 'tech', reliability: 4 },
  { id: 'politico', name: 'Politico', nameKo: '폴리티코', country: 'US', countryFlag: '🇺🇸', url: 'https://www.politico.com', rssUrl: 'https://rss.politico.com/politics-news.xml', category: 'politics', reliability: 4 },
  // UK
  { id: 'bbc', name: 'BBC News', nameKo: 'BBC 뉴스', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.bbc.com', rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'international', reliability: 5 },
  { id: 'guardian', name: 'The Guardian', nameKo: '가디언', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.theguardian.com', rssUrl: 'https://www.theguardian.com/world/rss', category: 'international', reliability: 4 },
  { id: 'ft', name: 'Financial Times', nameKo: '파이낸셜타임스', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.ft.com', rssUrl: 'https://www.ft.com/rss/home', category: 'economy', reliability: 5 },
  { id: 'economist', name: 'The Economist', nameKo: '이코노미스트', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.economist.com', rssUrl: 'https://www.economist.com/rss', category: 'economy', reliability: 5 },
  // Europe
  { id: 'dw', name: 'Deutsche Welle', nameKo: '도이체벨레', country: 'DE', countryFlag: '🇩🇪', url: 'https://www.dw.com', rssUrl: 'https://rss.dw.com/rdf/rss-en-all', category: 'international', reliability: 4 },
  { id: 'france24', name: 'France 24', nameKo: '프랑스24', country: 'FR', countryFlag: '🇫🇷', url: 'https://www.france24.com', rssUrl: 'https://www.france24.com/en/rss', category: 'international', reliability: 4 },
  { id: 'lemonde', name: 'Le Monde', nameKo: '르몽드', country: 'FR', countryFlag: '🇫🇷', url: 'https://www.lemonde.fr', rssUrl: 'https://www.lemonde.fr/en/rss/une.xml', category: 'international', reliability: 4 },
  // Asia
  { id: 'scmp', name: 'South China Morning Post', nameKo: '사우스차이나모닝포스트', country: 'HK', countryFlag: '🇭🇰', url: 'https://www.scmp.com', rssUrl: 'https://www.scmp.com/rss/91/feed', category: 'international', reliability: 4 },
  { id: 'nikkei', name: 'Nikkei Asia', nameKo: '닛케이 아시아', country: 'JP', countryFlag: '🇯🇵', url: 'https://asia.nikkei.com', rssUrl: 'https://asia.nikkei.com/rss', category: 'economy', reliability: 4 },
  { id: 'straitstimes', name: 'The Straits Times', nameKo: '스트레이츠타임스', country: 'SG', countryFlag: '🇸🇬', url: 'https://www.straitstimes.com', rssUrl: 'https://www.straitstimes.com/news/world/rss.xml', category: 'international', reliability: 4 },
  // Middle East
  { id: 'aljazeera', name: 'Al Jazeera', nameKo: '알자지라', country: 'QA', countryFlag: '🇶🇦', url: 'https://www.aljazeera.com', rssUrl: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'international', reliability: 4 },
  // Risk/Security
  { id: 'foreignpolicy', name: 'Foreign Policy', nameKo: '포린폴리시', country: 'US', countryFlag: '🇺🇸', url: 'https://foreignpolicy.com', rssUrl: 'https://foreignpolicy.com/feed/', category: 'risk', reliability: 5 },
  { id: 'foreignaffairs', name: 'Foreign Affairs', nameKo: '포린어페어스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.foreignaffairs.com', rssUrl: 'https://www.foreignaffairs.com/rss.xml', category: 'risk', reliability: 5 },
  // Tech focused
  { id: 'arstechnica', name: 'Ars Technica', nameKo: '아스 테크니카', country: 'US', countryFlag: '🇺🇸', url: 'https://arstechnica.com', rssUrl: 'https://feeds.arstechnica.com/arstechnica/index', category: 'tech', reliability: 4 },
  { id: 'mitreview', name: 'MIT Technology Review', nameKo: 'MIT 테크놀로지 리뷰', country: 'US', countryFlag: '🇺🇸', url: 'https://www.technologyreview.com', rssUrl: 'https://www.technologyreview.com/feed/', category: 'tech', reliability: 5 },
  // Culture
  { id: 'variety', name: 'Variety', nameKo: '버라이어티', country: 'US', countryFlag: '🇺🇸', url: 'https://variety.com', rssUrl: 'https://variety.com/feed/', category: 'culture', reliability: 4 },
  { id: 'hollywoodreporter', name: 'The Hollywood Reporter', nameKo: '할리우드 리포터', country: 'US', countryFlag: '🇺🇸', url: 'https://www.hollywoodreporter.com', rssUrl: 'https://www.hollywoodreporter.com/feed/', category: 'culture', reliability: 4 },
  { id: 'rollingstone', name: 'Rolling Stone', nameKo: '롤링스톤', country: 'US', countryFlag: '🇺🇸', url: 'https://www.rollingstone.com', rssUrl: 'https://www.rollingstone.com/feed/', category: 'culture', reliability: 3 },
];
