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

  // ── US broadcast networks ──
  { id: 'cnn', name: 'CNN', nameKo: 'CNN', country: 'US', countryFlag: '🇺🇸', url: 'https://www.cnn.com', rssUrl: 'http://rss.cnn.com/rss/edition.rss', category: 'international', reliability: 4 },
  { id: 'nbcnews', name: 'NBC News', nameKo: 'NBC 뉴스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.nbcnews.com', rssUrl: 'https://feeds.nbcnews.com/nbcnews/public/news', category: 'international', reliability: 4 },
  { id: 'foxnews', name: 'Fox News', nameKo: '폭스뉴스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.foxnews.com', rssUrl: 'https://moxie.foxnews.com/google-publisher/latest.xml', category: 'politics', reliability: 3 },
  { id: 'abcnews', name: 'ABC News', nameKo: 'ABC 뉴스', country: 'US', countryFlag: '🇺🇸', url: 'https://abcnews.go.com', rssUrl: 'https://feeds.abcnews.com/abcnews/topstories', category: 'international', reliability: 4 },
  { id: 'cbsnews', name: 'CBS News', nameKo: 'CBS 뉴스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.cbsnews.com', rssUrl: 'https://www.cbsnews.com/latest/rss/main', category: 'international', reliability: 4 },
  { id: 'pbs', name: 'PBS NewsHour', nameKo: 'PBS 뉴스아워', country: 'US', countryFlag: '🇺🇸', url: 'https://www.pbs.org/newshour/', rssUrl: 'https://www.pbs.org/newshour/feeds/rss/headlines', category: 'international', reliability: 5 },
  { id: 'npr', name: 'NPR', nameKo: 'NPR', country: 'US', countryFlag: '🇺🇸', url: 'https://www.npr.org', rssUrl: 'https://feeds.npr.org/1001/rss.xml', category: 'international', reliability: 5 },

  // ── US weeklies / long-form ──
  { id: 'time', name: 'TIME', nameKo: '타임', country: 'US', countryFlag: '🇺🇸', url: 'https://time.com', rssUrl: 'https://time.com/feed/', category: 'international', reliability: 4 },
  { id: 'newsweek', name: 'Newsweek', nameKo: '뉴스위크', country: 'US', countryFlag: '🇺🇸', url: 'https://www.newsweek.com', rssUrl: 'https://www.newsweek.com/rss', category: 'international', reliability: 3 },
  { id: 'atlantic', name: 'The Atlantic', nameKo: '디 애틀랜틱', country: 'US', countryFlag: '🇺🇸', url: 'https://www.theatlantic.com', rssUrl: 'https://www.theatlantic.com/feed/all/', category: 'culture', reliability: 4 },
  { id: 'newyorker', name: 'The New Yorker', nameKo: '뉴요커', country: 'US', countryFlag: '🇺🇸', url: 'https://www.newyorker.com', rssUrl: 'https://www.newyorker.com/feed/everything', category: 'culture', reliability: 4 },

  // ── US politics ──
  { id: 'thehill', name: 'The Hill', nameKo: '더 힐', country: 'US', countryFlag: '🇺🇸', url: 'https://thehill.com', rssUrl: 'https://thehill.com/news/feed/', category: 'politics', reliability: 4 },
  { id: 'axios', name: 'Axios', nameKo: '악시오스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.axios.com', rssUrl: 'https://api.axios.com/feed/', category: 'politics', reliability: 4 },
  { id: 'vox', name: 'Vox', nameKo: '복스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.vox.com', rssUrl: 'https://www.vox.com/rss/index.xml', category: 'politics', reliability: 3 },
  { id: 'intercept', name: 'The Intercept', nameKo: '디 인터셉트', country: 'US', countryFlag: '🇺🇸', url: 'https://theintercept.com', rssUrl: 'https://theintercept.com/feed/?rss', category: 'risk', reliability: 4 },
  { id: 'propublica', name: 'ProPublica', nameKo: '프로퍼블리카', country: 'US', countryFlag: '🇺🇸', url: 'https://www.propublica.org', rssUrl: 'https://www.propublica.org/feeds/propublica/main', category: 'politics', reliability: 5 },
  { id: 'nytimes-opinion', name: 'NYT Opinion', nameKo: '뉴욕타임스 사설', country: 'US', countryFlag: '🇺🇸', url: 'https://www.nytimes.com/section/opinion', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Opinion.xml', category: 'politics', reliability: 4 },
  { id: 'guardian-opinion', name: 'Guardian Opinion', nameKo: '가디언 사설', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.theguardian.com/uk/commentisfree', rssUrl: 'https://www.theguardian.com/uk/commentisfree/rss', category: 'politics', reliability: 4 },

  // ── Markets ──
  { id: 'marketwatch', name: 'MarketWatch', nameKo: '마켓워치', country: 'US', countryFlag: '🇺🇸', url: 'https://www.marketwatch.com', rssUrl: 'https://feeds.content.dowjones.io/public/rss/mw_topstories', category: 'economy', reliability: 4 },
  { id: 'coindesk', name: 'CoinDesk', nameKo: '코인데스크', country: 'US', countryFlag: '🇺🇸', url: 'https://www.coindesk.com', rssUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'economy', reliability: 3 },
  { id: 'cointelegraph', name: 'Cointelegraph', nameKo: '코인텔레그래프', country: 'US', countryFlag: '🇺🇸', url: 'https://cointelegraph.com', rssUrl: 'https://cointelegraph.com/rss', category: 'economy', reliability: 3 },

  // ── Tech ──
  { id: 'cnet', name: 'CNET', nameKo: '씨넷', country: 'US', countryFlag: '🇺🇸', url: 'https://www.cnet.com', rssUrl: 'https://www.cnet.com/rss/news/', category: 'tech', reliability: 3 },
  { id: 'engadget', name: 'Engadget', nameKo: '엔가젯', country: 'US', countryFlag: '🇺🇸', url: 'https://www.engadget.com', rssUrl: 'https://www.engadget.com/rss.xml', category: 'tech', reliability: 3 },
  { id: 'gizmodo', name: 'Gizmodo', nameKo: '기즈모도', country: 'US', countryFlag: '🇺🇸', url: 'https://gizmodo.com', rssUrl: 'https://gizmodo.com/feed', category: 'tech', reliability: 3 },
  { id: 'zdnet', name: 'ZDNET', nameKo: 'ZDNet', country: 'US', countryFlag: '🇺🇸', url: 'https://www.zdnet.com', rssUrl: 'https://www.zdnet.com/news/rss.xml', category: 'tech', reliability: 4 },
  { id: 'venturebeat', name: 'VentureBeat', nameKo: '벤처비트', country: 'US', countryFlag: '🇺🇸', url: 'https://venturebeat.com', rssUrl: 'https://venturebeat.com/feed/', category: 'tech', reliability: 3 },
  { id: 'restofworld', name: 'Rest of World', nameKo: '레스트 오브 월드', country: 'US', countryFlag: '🇺🇸', url: 'https://restofworld.org', rssUrl: 'https://restofworld.org/feed/latest', category: 'tech', reliability: 4 },
  { id: 'electrek', name: 'Electrek', nameKo: '일렉트렉', country: 'US', countryFlag: '🇺🇸', url: 'https://electrek.co', rssUrl: 'https://electrek.co/feed/', category: 'tech', reliability: 3 },

  // ── Science ──
  { id: 'nature', name: 'Nature', nameKo: '네이처', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.nature.com', rssUrl: 'https://www.nature.com/nature.rss', category: 'science', reliability: 5 },
  { id: 'physorg', name: 'Phys.org', nameKo: '피즈닷오알지', country: 'UK', countryFlag: '🇬🇧', url: 'https://phys.org', rssUrl: 'https://phys.org/rss-feed/', category: 'science', reliability: 4 },
  { id: 'sciencenews', name: 'Science News', nameKo: '사이언스 뉴스', country: 'US', countryFlag: '🇺🇸', url: 'https://www.sciencenews.org', rssUrl: 'https://www.sciencenews.org/feed', category: 'science', reliability: 5 },
  { id: 'sciencedaily', name: 'ScienceDaily', nameKo: '사이언스데일리', country: 'US', countryFlag: '🇺🇸', url: 'https://www.sciencedaily.com', rssUrl: 'https://www.sciencedaily.com/rss/all.xml', category: 'science', reliability: 4 },
  { id: 'quanta', name: 'Quanta Magazine', nameKo: '콴타 매거진', country: 'US', countryFlag: '🇺🇸', url: 'https://www.quantamagazine.org', rssUrl: 'https://api.quantamagazine.org/feed/', category: 'science', reliability: 5 },

  // ── Health ──
  { id: 'medicalxpress', name: 'Medical Xpress', nameKo: '메디컬익스프레스', country: 'UK', countryFlag: '🇬🇧', url: 'https://medicalxpress.com', rssUrl: 'https://medicalxpress.com/rss-feed/', category: 'health', reliability: 4 },

  // ── Sports ──
  { id: 'espn', name: 'ESPN', nameKo: 'ESPN', country: 'US', countryFlag: '🇺🇸', url: 'https://www.espn.com', rssUrl: 'https://www.espn.com/espn/rss/news', category: 'sports', reliability: 4 },
  { id: 'bbcsport', name: 'BBC Sport', nameKo: 'BBC 스포츠', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.bbc.com/sport', rssUrl: 'https://feeds.bbci.co.uk/sport/rss.xml', category: 'sports', reliability: 5 },

  // ── Entertainment ──
  { id: 'tmz', name: 'TMZ', nameKo: 'TMZ', country: 'US', countryFlag: '🇺🇸', url: 'https://www.tmz.com', rssUrl: 'https://www.tmz.com/rss.xml', category: 'culture', reliability: 2 },
  { id: 'deadline', name: 'Deadline', nameKo: '데드라인', country: 'US', countryFlag: '🇺🇸', url: 'https://deadline.com', rssUrl: 'https://deadline.com/feed/', category: 'culture', reliability: 4 },

  // ── Europe ──
  { id: 'skynews', name: 'Sky News', nameKo: '스카이뉴스', country: 'UK', countryFlag: '🇬🇧', url: 'https://news.sky.com', rssUrl: 'https://feeds.skynews.com/feeds/rss/world.xml', category: 'international', reliability: 4 },
  { id: 'independent', name: 'The Independent', nameKo: '인디펜던트', country: 'UK', countryFlag: '🇬🇧', url: 'https://www.independent.co.uk', rssUrl: 'https://www.independent.co.uk/news/world/rss', category: 'international', reliability: 4 },
  { id: 'euronews', name: 'Euronews', nameKo: '유로뉴스', country: 'FR', countryFlag: '🇫🇷', url: 'https://www.euronews.com', rssUrl: 'https://www.euronews.com/rss', category: 'international', reliability: 4 },
  { id: 'spiegel', name: 'Der Spiegel', nameKo: '슈피겔', country: 'DE', countryFlag: '🇩🇪', url: 'https://www.spiegel.de', rssUrl: 'https://www.spiegel.de/schlagzeilen/index.rss', category: 'international', reliability: 4 },
];
