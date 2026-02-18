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
  // Korea
  { id: 'yonhap', name: 'Yonhap News', nameKo: '연합뉴스', country: 'KR', countryFlag: '🇰🇷', url: 'https://en.yna.co.kr', rssUrl: 'https://en.yna.co.kr/RSS/news.xml', category: 'international', reliability: 5 },
  { id: 'koreaherald', name: 'The Korea Herald', nameKo: '코리아헤럴드', country: 'KR', countryFlag: '🇰🇷', url: 'https://www.koreaherald.com', rssUrl: 'https://www.koreaherald.com/common/rss_xml.php?ct=102', category: 'international', reliability: 4 },
  // India
  { id: 'timesofindia', name: 'Times of India', nameKo: '타임스 오브 인디아', country: 'IN', countryFlag: '🇮🇳', url: 'https://timesofindia.indiatimes.com', rssUrl: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'international', reliability: 4 },
  { id: 'hindustantimes', name: 'Hindustan Times', nameKo: '힌두스탄 타임스', country: 'IN', countryFlag: '🇮🇳', url: 'https://www.hindustantimes.com', rssUrl: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', category: 'international', reliability: 4 },
  // Brazil
  { id: 'folha', name: 'Folha de S.Paulo', nameKo: '폴랴 지 상파울루', country: 'BR', countryFlag: '🇧🇷', url: 'https://www1.folha.uol.com.br/internacional/en/', rssUrl: 'https://feeds.folha.uol.com.br/internacional/en/rss091.xml', category: 'international', reliability: 4 },
  // Australia
  { id: 'abcau', name: 'ABC News Australia', nameKo: 'ABC 뉴스 호주', country: 'AU', countryFlag: '🇦🇺', url: 'https://www.abc.net.au/news', rssUrl: 'https://www.abc.net.au/news/feed/2942460/rss.xml', category: 'international', reliability: 5 },
  { id: 'smh', name: 'Sydney Morning Herald', nameKo: '시드니 모닝 헤럴드', country: 'AU', countryFlag: '🇦🇺', url: 'https://www.smh.com.au', rssUrl: 'https://www.smh.com.au/rss/feed.xml', category: 'international', reliability: 4 },
  // China (English)
  { id: 'cgtn', name: 'CGTN', nameKo: 'CGTN', country: 'CN', countryFlag: '🇨🇳', url: 'https://www.cgtn.com', rssUrl: 'https://www.cgtn.com/subscribe/rss/section/world.xml', category: 'international', reliability: 3 },
  { id: 'xinhua', name: 'Xinhua', nameKo: '신화통신', country: 'CN', countryFlag: '🇨🇳', url: 'https://english.news.cn', rssUrl: 'https://english.news.cn/rss/latest.xml', category: 'international', reliability: 3 },
  // Canada
  { id: 'cbc', name: 'CBC News', nameKo: 'CBC 뉴스', country: 'CA', countryFlag: '🇨🇦', url: 'https://www.cbc.ca/news', rssUrl: 'https://www.cbc.ca/webfeed/rss/rss-topstories', category: 'international', reliability: 5 },
  { id: 'globeandmail', name: 'The Globe and Mail', nameKo: '글로브 앤 메일', country: 'CA', countryFlag: '🇨🇦', url: 'https://www.theglobeandmail.com', rssUrl: 'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/world/', category: 'international', reliability: 4 },
  // Russia
  { id: 'rt', name: 'RT', nameKo: 'RT', country: 'RU', countryFlag: '🇷🇺', url: 'https://www.rt.com', rssUrl: 'https://www.rt.com/rss/news/', category: 'international', reliability: 2 },
  // Israel
  { id: 'jpost', name: 'Jerusalem Post', nameKo: '예루살렘 포스트', country: 'IL', countryFlag: '🇮🇱', url: 'https://www.jpost.com', rssUrl: 'https://www.jpost.com/rss/rssfeedsfrontpage.aspx', category: 'international', reliability: 4 },
  { id: 'haaretz', name: 'Haaretz', nameKo: '하아레츠', country: 'IL', countryFlag: '🇮🇱', url: 'https://www.haaretz.com', rssUrl: 'https://www.haaretz.com/cmlink/1.628752', category: 'international', reliability: 4 },
  // Saudi Arabia
  { id: 'arabnews', name: 'Arab News', nameKo: '아랍 뉴스', country: 'SA', countryFlag: '🇸🇦', url: 'https://www.arabnews.com', rssUrl: 'https://www.arabnews.com/rss.xml', category: 'international', reliability: 3 },
  // Taiwan
  { id: 'taipeitimes', name: 'Taipei Times', nameKo: '타이베이 타임스', country: 'TW', countryFlag: '🇹🇼', url: 'https://www.taipeitimes.com', rssUrl: 'https://www.taipeitimes.com/xml/index.rss', category: 'international', reliability: 4 },
  // Italy
  { id: 'ansa', name: 'ANSA', nameKo: 'ANSA 통신', country: 'IT', countryFlag: '🇮🇹', url: 'https://www.ansa.it/english/', rssUrl: 'https://www.ansa.it/sito/ansait_rss.xml', category: 'international', reliability: 4 },
  // Spain
  { id: 'elpais', name: 'El País', nameKo: '엘 파이스', country: 'ES', countryFlag: '🇪🇸', url: 'https://english.elpais.com', rssUrl: 'https://feeds.elpais.com/mrss-s/pages/ep/site/english.elpais.com/portada', category: 'international', reliability: 4 },
];
