export type MediaTier = 1 | 2 | 3;

export type MediaRanking = {
  sourceId: string;
  tier: MediaTier;
  globalRank: number;
  description: string;
  descriptionKo: string;
  foundedYear: number;
  /** 월간 도달 규모의 대략적인 자릿수 추정치 (공식 감사 수치가 아님) */
  monthlyReach: string;
};

export const TIER_LABELS: Record<MediaTier, { label: string; labelKo: string; color: string; bgColor: string }> = {
  1: { label: 'Tier 1', labelKo: '1등급 - 최고 영향력', color: 'text-amber-400', bgColor: 'border-amber-400' },
  2: { label: 'Tier 2', labelKo: '2등급 - 주요 매체', color: 'text-blue-400', bgColor: 'border-blue-400' },
  3: { label: 'Tier 3', labelKo: '3등급 - 지역·전문 매체', color: 'text-slate-400', bgColor: 'border-slate-400' },
};

export const MEDIA_RANKINGS: MediaRanking[] = [
  // ─── Tier 1 — 글로벌 최고 영향력 ───
  { sourceId: 'reuters', tier: 1, globalRank: 1, description: 'World\'s largest international news agency', descriptionKo: '세계 최대 국제 통신사', foundedYear: 1851, monthlyReach: '1B+' },
  { sourceId: 'ap', tier: 1, globalRank: 2, description: 'Oldest and largest American news agency', descriptionKo: '미국 최대 통신사', foundedYear: 1846, monthlyReach: '1B+' },
  { sourceId: 'bbc', tier: 1, globalRank: 3, description: 'World\'s most trusted broadcast news', descriptionKo: '세계에서 가장 신뢰받는 방송 뉴스', foundedYear: 1922, monthlyReach: '500M' },
  { sourceId: 'nytimes', tier: 1, globalRank: 4, description: 'America\'s newspaper of record', descriptionKo: '미국의 기록 신문', foundedYear: 1851, monthlyReach: '200M' },
  { sourceId: 'bloomberg', tier: 1, globalRank: 5, description: 'Global leader in business and financial news', descriptionKo: '글로벌 비즈니스·금융 뉴스의 선두', foundedYear: 1981, monthlyReach: '250M' },
  { sourceId: 'wsj', tier: 1, globalRank: 6, description: 'Premier business and financial newspaper', descriptionKo: '최고의 비즈니스·금융 신문', foundedYear: 1889, monthlyReach: '150M' },
  { sourceId: 'cnn', tier: 1, globalRank: 7, description: 'The original 24-hour cable news network', descriptionKo: '24시간 케이블 뉴스의 원조', foundedYear: 1980, monthlyReach: '400M' },
  { sourceId: 'ft', tier: 1, globalRank: 8, description: 'Global authority on business and finance', descriptionKo: '글로벌 비즈니스·금융의 권위자', foundedYear: 1888, monthlyReach: '100M' },
  { sourceId: 'economist', tier: 1, globalRank: 9, description: 'Influential weekly on world affairs', descriptionKo: '세계 정세 분석의 권위지', foundedYear: 1843, monthlyReach: '60M' },
  { sourceId: 'guardian', tier: 1, globalRank: 10, description: 'Major UK newspaper with no paywall', descriptionKo: '페이월 없는 영국 대표 일간지', foundedYear: 1821, monthlyReach: '150M' },
  { sourceId: 'npr', tier: 1, globalRank: 11, description: 'US public radio, consistently top-rated for trust', descriptionKo: '신뢰도 최상위권의 미국 공영 라디오', foundedYear: 1970, monthlyReach: '60M' },
  { sourceId: 'cnbc', tier: 1, globalRank: 12, description: 'Leading business TV network', descriptionKo: '주요 비즈니스 TV 네트워크', foundedYear: 1989, monthlyReach: '200M' },

  // ─── Tier 2 — 주요 매체 ───
  { sourceId: 'aljazeera', tier: 2, globalRank: 13, description: 'Middle East\'s most influential news network', descriptionKo: '중동 최고 영향력 뉴스 네트워크', foundedYear: 1996, monthlyReach: '310M' },
  { sourceId: 'abcnews', tier: 2, globalRank: 14, description: 'Major US broadcast news division', descriptionKo: '미국 주요 지상파 뉴스', foundedYear: 1945, monthlyReach: '150M' },
  { sourceId: 'nbcnews', tier: 2, globalRank: 15, description: 'Major US broadcast news division', descriptionKo: '미국 주요 지상파 뉴스', foundedYear: 1940, monthlyReach: '150M' },
  { sourceId: 'cbsnews', tier: 2, globalRank: 16, description: 'Major US broadcast news division', descriptionKo: '미국 주요 지상파 뉴스', foundedYear: 1927, monthlyReach: '120M' },
  { sourceId: 'foxnews', tier: 2, globalRank: 17, description: 'Top-rated US cable news, conservative-leaning', descriptionKo: '시청률 1위 보수 성향 케이블 뉴스', foundedYear: 1996, monthlyReach: '200M' },
  { sourceId: 'politico', tier: 2, globalRank: 18, description: 'Top US political news outlet', descriptionKo: '미국 최고의 정치 매체', foundedYear: 2007, monthlyReach: '50M' },
  { sourceId: 'time', tier: 2, globalRank: 19, description: 'The world\'s best-known newsweekly', descriptionKo: '세계에서 가장 유명한 시사 주간지', foundedYear: 1923, monthlyReach: '50M' },
  { sourceId: 'atlantic', tier: 2, globalRank: 20, description: 'Long-form essays on politics and culture', descriptionKo: '정치·문화 장문 에세이 중심', foundedYear: 1857, monthlyReach: '40M' },
  { sourceId: 'newyorker', tier: 2, globalRank: 21, description: 'Investigative reporting and literary criticism', descriptionKo: '탐사보도와 문예 비평', foundedYear: 1925, monthlyReach: '30M' },
  { sourceId: 'pbs', tier: 2, globalRank: 22, description: 'US public broadcaster known for in-depth reporting', descriptionKo: '심층 보도로 알려진 미국 공영방송', foundedYear: 1975, monthlyReach: '30M' },
  { sourceId: 'dw', tier: 2, globalRank: 23, description: 'Germany\'s international broadcaster', descriptionKo: '독일의 국제 방송', foundedYear: 1953, monthlyReach: '250M' },
  { sourceId: 'france24', tier: 2, globalRank: 24, description: 'France\'s international news channel', descriptionKo: '프랑스 국제 뉴스 채널', foundedYear: 2006, monthlyReach: '100M' },
  { sourceId: 'skynews', tier: 2, globalRank: 25, description: 'UK\'s major 24-hour news channel', descriptionKo: '영국 대표 24시간 뉴스 채널', foundedYear: 1989, monthlyReach: '80M' },
  { sourceId: 'independent', tier: 2, globalRank: 26, description: 'UK digital-first national newspaper', descriptionKo: '디지털 중심의 영국 전국지', foundedYear: 1986, monthlyReach: '70M' },
  { sourceId: 'spiegel', tier: 2, globalRank: 27, description: 'Germany\'s leading investigative newsmagazine', descriptionKo: '독일 대표 탐사보도 시사지', foundedYear: 1947, monthlyReach: '50M' },
  { sourceId: 'euronews', tier: 2, globalRank: 28, description: 'Pan-European multilingual news channel', descriptionKo: '범유럽 다국어 뉴스 채널', foundedYear: 1993, monthlyReach: '40M' },
  { sourceId: 'nikkei', tier: 2, globalRank: 29, description: 'Japan\'s leading economic newspaper', descriptionKo: '일본 최고의 경제 신문', foundedYear: 1876, monthlyReach: '50M' },
  { sourceId: 'nature', tier: 2, globalRank: 30, description: 'The world\'s most cited scientific journal', descriptionKo: '세계에서 가장 많이 인용되는 학술지', foundedYear: 1869, monthlyReach: '20M' },
  { sourceId: 'propublica', tier: 2, globalRank: 31, description: 'Nonprofit investigative newsroom, multiple Pulitzers', descriptionKo: '퓰리처 다수 수상 비영리 탐사보도', foundedYear: 2007, monthlyReach: '10M' },
  { sourceId: 'axios', tier: 2, globalRank: 32, description: 'Concise, bullet-style political and business news', descriptionKo: '요점만 짚는 정치·경제 뉴스', foundedYear: 2017, monthlyReach: '30M' },
  { sourceId: 'thehill', tier: 2, globalRank: 33, description: 'Congressional and policy coverage', descriptionKo: '미국 의회·정책 전문 매체', foundedYear: 1994, monthlyReach: '40M' },
  { sourceId: 'techcrunch', tier: 2, globalRank: 34, description: 'Leading tech startup media', descriptionKo: '대표적인 테크 스타트업 매체', foundedYear: 2005, monthlyReach: '30M' },
  { sourceId: 'wired', tier: 2, globalRank: 35, description: 'Technology and culture magazine', descriptionKo: '기술과 문화 매거진', foundedYear: 1993, monthlyReach: '30M' },
  { sourceId: 'mitreview', tier: 2, globalRank: 36, description: 'MIT\'s flagship technology publication', descriptionKo: 'MIT 대표 기술 매체', foundedYear: 1899, monthlyReach: '15M' },
  { sourceId: 'marketwatch', tier: 2, globalRank: 37, description: 'Real-time market news from Dow Jones', descriptionKo: '다우존스 계열 실시간 증시 뉴스', foundedYear: 1997, monthlyReach: '80M' },
  { sourceId: 'foreignpolicy', tier: 2, globalRank: 38, description: 'Premier foreign affairs magazine', descriptionKo: '대표적인 외교 전문지', foundedYear: 1970, monthlyReach: '20M' },
  { sourceId: 'foreignaffairs', tier: 2, globalRank: 39, description: 'Authoritative journal on international relations', descriptionKo: '국제관계 권위 저널', foundedYear: 1922, monthlyReach: '10M' },
  { sourceId: 'espn', tier: 2, globalRank: 40, description: 'World\'s largest sports media brand', descriptionKo: '세계 최대 스포츠 미디어', foundedYear: 1979, monthlyReach: '120M' },
  { sourceId: 'bbcsport', tier: 2, globalRank: 41, description: 'BBC\'s sports division', descriptionKo: 'BBC 스포츠 부문', foundedYear: 1927, monthlyReach: '80M' },
  { sourceId: 'nytimes-opinion', tier: 2, globalRank: 42, description: 'The most-read editorial page in the US', descriptionKo: '미국에서 가장 많이 읽히는 사설면', foundedYear: 1970, monthlyReach: '50M' },

  // ─── Tier 3 — 지역·전문 매체 ───
  { sourceId: 'theverge', tier: 3, globalRank: 43, description: 'Tech and science news network', descriptionKo: '기술·과학 뉴스 네트워크', foundedYear: 2011, monthlyReach: '50M' },
  { sourceId: 'arstechnica', tier: 3, globalRank: 44, description: 'Deep-dive technology publication', descriptionKo: '심층 기술 매체', foundedYear: 1998, monthlyReach: '15M' },
  { sourceId: 'cnet', tier: 3, globalRank: 45, description: 'Consumer tech reviews and buying guides', descriptionKo: '소비자 테크 리뷰·구매 가이드', foundedYear: 1994, monthlyReach: '60M' },
  { sourceId: 'engadget', tier: 3, globalRank: 46, description: 'Consumer electronics and gadget news', descriptionKo: '소비자 전자제품·가젯 뉴스', foundedYear: 2004, monthlyReach: '25M' },
  { sourceId: 'zdnet', tier: 3, globalRank: 47, description: 'Enterprise IT and business technology', descriptionKo: '기업 IT·비즈니스 기술', foundedYear: 1991, monthlyReach: '20M' },
  { sourceId: 'gizmodo', tier: 3, globalRank: 48, description: 'Technology, science and pop culture', descriptionKo: '기술·과학·대중문화', foundedYear: 2002, monthlyReach: '20M' },
  { sourceId: 'venturebeat', tier: 3, globalRank: 49, description: 'Enterprise tech and AI coverage', descriptionKo: '기업 테크·AI 보도', foundedYear: 2006, monthlyReach: '10M' },
  { sourceId: 'restofworld', tier: 3, globalRank: 50, description: 'Technology reporting beyond the West', descriptionKo: '비서구권 기술 현장 보도', foundedYear: 2020, monthlyReach: '3M' },
  { sourceId: 'electrek', tier: 3, globalRank: 51, description: 'Electric vehicle and clean energy news', descriptionKo: '전기차·청정에너지 전문', foundedYear: 2013, monthlyReach: '10M' },
  { sourceId: 'sciencenews', tier: 3, globalRank: 52, description: 'Century-old nonprofit science magazine', descriptionKo: '100년 역사의 비영리 과학 매체', foundedYear: 1921, monthlyReach: '5M' },
  { sourceId: 'sciencedaily', tier: 3, globalRank: 53, description: 'Aggregator of research press releases', descriptionKo: '연구 보도자료 집약 사이트', foundedYear: 1995, monthlyReach: '10M' },
  { sourceId: 'physorg', tier: 3, globalRank: 54, description: 'Daily physics and technology research news', descriptionKo: '물리·기술 연구 뉴스', foundedYear: 2004, monthlyReach: '10M' },
  { sourceId: 'quanta', tier: 3, globalRank: 55, description: 'Award-winning math and physics explainers', descriptionKo: '수상 경력의 수학·물리 해설', foundedYear: 2012, monthlyReach: '3M' },
  { sourceId: 'medicalxpress', tier: 3, globalRank: 56, description: 'Daily medical research news', descriptionKo: '의학 연구 뉴스', foundedYear: 2011, monthlyReach: '5M' },
  { sourceId: 'intercept', tier: 3, globalRank: 57, description: 'National security investigative journalism', descriptionKo: '국가안보 탐사보도', foundedYear: 2014, monthlyReach: '5M' },
  { sourceId: 'vox', tier: 3, globalRank: 58, description: 'Explanatory journalism on news context', descriptionKo: '뉴스 배경 설명 저널리즘', foundedYear: 2014, monthlyReach: '30M' },
  { sourceId: 'newsweek', tier: 3, globalRank: 59, description: 'Long-running American newsweekly', descriptionKo: '오랜 역사의 미국 시사 주간지', foundedYear: 1933, monthlyReach: '40M' },
  { sourceId: 'guardian-opinion', tier: 3, globalRank: 60, description: 'The Guardian\'s free-to-read comment section', descriptionKo: '무료로 공개된 가디언 논평면', foundedYear: 2006, monthlyReach: '20M' },
  { sourceId: 'coindesk', tier: 3, globalRank: 61, description: 'Leading cryptocurrency news outlet', descriptionKo: '대표적인 가상자산 매체', foundedYear: 2013, monthlyReach: '10M' },
  { sourceId: 'cointelegraph', tier: 3, globalRank: 62, description: 'Major cryptocurrency and blockchain media', descriptionKo: '주요 가상자산·블록체인 매체', foundedYear: 2013, monthlyReach: '10M' },
  { sourceId: 'scmp', tier: 3, globalRank: 63, description: 'Hong Kong\'s leading English-language newspaper', descriptionKo: '홍콩 대표 영자 신문', foundedYear: 1903, monthlyReach: '40M' },
  { sourceId: 'straitstimes', tier: 3, globalRank: 64, description: 'Singapore\'s paper of record', descriptionKo: '싱가포르 대표 신문', foundedYear: 1845, monthlyReach: '20M' },
  { sourceId: 'yonhap', tier: 3, globalRank: 65, description: 'South Korea\'s leading news agency', descriptionKo: '대한민국 대표 통신사', foundedYear: 1980, monthlyReach: '30M' },
  { sourceId: 'koreaherald', tier: 3, globalRank: 66, description: 'Korea\'s leading English-language newspaper', descriptionKo: '한국 대표 영자 신문', foundedYear: 1953, monthlyReach: '10M' },
  { sourceId: 'timesofindia', tier: 3, globalRank: 67, description: 'India\'s largest English newspaper', descriptionKo: '인도 최대 영자 신문', foundedYear: 1838, monthlyReach: '100M' },
  { sourceId: 'hindustantimes', tier: 3, globalRank: 68, description: 'Major Indian English daily', descriptionKo: '인도 주요 영자 일간지', foundedYear: 1924, monthlyReach: '50M' },
  { sourceId: 'lemonde', tier: 3, globalRank: 69, description: 'France\'s newspaper of record', descriptionKo: '프랑스 대표 일간지', foundedYear: 1944, monthlyReach: '40M' },
  { sourceId: 'elpais', tier: 3, globalRank: 70, description: 'Spain\'s largest daily newspaper', descriptionKo: '스페인 최대 일간지', foundedYear: 1976, monthlyReach: '50M' },
  { sourceId: 'folha', tier: 3, globalRank: 71, description: 'Brazil\'s largest newspaper', descriptionKo: '브라질 최대 신문', foundedYear: 1921, monthlyReach: '30M' },
  { sourceId: 'abcau', tier: 3, globalRank: 72, description: 'Australia\'s national broadcaster', descriptionKo: '호주 국영 방송', foundedYear: 1932, monthlyReach: '20M' },
  { sourceId: 'smh', tier: 3, globalRank: 73, description: 'Major Australian daily newspaper', descriptionKo: '호주 주요 일간지', foundedYear: 1831, monthlyReach: '15M' },
  { sourceId: 'cbc', tier: 3, globalRank: 74, description: 'Canada\'s national broadcaster', descriptionKo: '캐나다 국영 방송', foundedYear: 1936, monthlyReach: '25M' },
  { sourceId: 'globeandmail', tier: 3, globalRank: 75, description: 'Canada\'s national newspaper', descriptionKo: '캐나다 대표 전국지', foundedYear: 1844, monthlyReach: '10M' },
  { sourceId: 'cgtn', tier: 3, globalRank: 76, description: 'China\'s global TV network', descriptionKo: '중국 글로벌 TV 네트워크', foundedYear: 2016, monthlyReach: '100M' },
  { sourceId: 'xinhua', tier: 3, globalRank: 77, description: 'China\'s official state news agency', descriptionKo: '중국 관영 통신사', foundedYear: 1931, monthlyReach: '200M' },
  { sourceId: 'jpost', tier: 3, globalRank: 78, description: 'Israel\'s leading English newspaper', descriptionKo: '이스라엘 대표 영자 신문', foundedYear: 1932, monthlyReach: '15M' },
  { sourceId: 'haaretz', tier: 3, globalRank: 79, description: 'Israel\'s oldest daily newspaper', descriptionKo: '이스라엘 최고(最古) 일간지', foundedYear: 1918, monthlyReach: '10M' },
  { sourceId: 'arabnews', tier: 3, globalRank: 80, description: 'Saudi Arabia\'s first English daily', descriptionKo: '사우디 최초 영자 일간지', foundedYear: 1975, monthlyReach: '15M' },
  { sourceId: 'taipeitimes', tier: 3, globalRank: 81, description: 'Taiwan\'s leading English newspaper', descriptionKo: '대만 대표 영자 신문', foundedYear: 1999, monthlyReach: '5M' },
  { sourceId: 'ansa', tier: 3, globalRank: 82, description: 'Italy\'s leading news agency', descriptionKo: '이탈리아 대표 통신사', foundedYear: 1945, monthlyReach: '20M' },
  { sourceId: 'rt', tier: 3, globalRank: 83, description: 'Russia\'s international news network', descriptionKo: '러시아 국제 뉴스 네트워크', foundedYear: 2005, monthlyReach: '100M' },
  { sourceId: 'variety', tier: 3, globalRank: 84, description: 'Premier entertainment industry publication', descriptionKo: '엔터테인먼트 산업 대표 매체', foundedYear: 1905, monthlyReach: '20M' },
  { sourceId: 'hollywoodreporter', tier: 3, globalRank: 85, description: 'Leading entertainment news outlet', descriptionKo: '주요 엔터테인먼트 뉴스 매체', foundedYear: 1930, monthlyReach: '15M' },
  { sourceId: 'deadline', tier: 3, globalRank: 86, description: 'Breaking casting and dealmaking scoops', descriptionKo: '캐스팅·계약 단독 보도', foundedYear: 2006, monthlyReach: '15M' },
  { sourceId: 'rollingstone', tier: 3, globalRank: 87, description: 'Iconic music and culture magazine', descriptionKo: '음악·문화 아이콘 매거진', foundedYear: 1967, monthlyReach: '20M' },
  { sourceId: 'tmz', tier: 3, globalRank: 88, description: 'Fastest-breaking celebrity news', descriptionKo: '셀럽 속보에 가장 빠른 매체', foundedYear: 2005, monthlyReach: '25M' },
];
