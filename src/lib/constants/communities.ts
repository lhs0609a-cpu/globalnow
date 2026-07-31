import { TrendingSource } from '@/types/news';

export type CommunitySource = {
  id: TrendingSource;
  name: string;
  nameKo: string;
  region: string;
  regionFlag: string;
  icon: string;
  apiUrl: string;
  apiType: 'json' | 'rss';
};

export const COMMUNITY_SOURCES: CommunitySource[] = [
  { id: 'hackernews', name: 'Hacker News', nameKo: 'HN', region: 'US', regionFlag: '🇺🇸', icon: '🔶', apiUrl: 'https://hacker-news.firebaseio.com/v0/topstories.json', apiType: 'json' },
  { id: 'producthunt', name: 'Product Hunt', nameKo: 'PH', region: 'US', regionFlag: '🇺🇸', icon: '🚀', apiUrl: '', apiType: 'json' },
  { id: 'reddit', name: 'Reddit', nameKo: 'Reddit', region: 'US', regionFlag: '🇺🇸', icon: '🤖', apiUrl: '', apiType: 'json' },
  { id: 'github', name: 'GitHub', nameKo: 'GitHub', region: 'GLOBAL', regionFlag: '🌐', icon: '🐙', apiUrl: '', apiType: 'json' },
  { id: 'v2ex', name: 'V2EX', nameKo: 'V2EX', region: 'CN', regionFlag: '🇨🇳', icon: '💬', apiUrl: 'https://www.v2ex.com/api/topics/hot.json', apiType: 'json' },
  { id: 'zhihu', name: 'Zhihu', nameKo: '즈후', region: 'CN', regionFlag: '🇨🇳', icon: '🔵', apiUrl: 'https://rsshub.app/zhihu/hot', apiType: 'rss' },
  { id: '36kr', name: '36Kr', nameKo: '36Kr', region: 'CN', regionFlag: '🇨🇳', icon: '📰', apiUrl: 'https://rsshub.app/36kr/hot', apiType: 'rss' },
  { id: 'qiita', name: 'Qiita', nameKo: 'Qiita', region: 'JP', regionFlag: '🇯🇵', icon: '📝', apiUrl: 'https://qiita.com/api/v2/items?per_page=20&query=stocks:>10', apiType: 'json' },
  { id: 'hatena', name: 'Hatena', nameKo: '하테나', region: 'JP', regionFlag: '🇯🇵', icon: '🅱️', apiUrl: 'https://b.hatena.ne.jp/hotentry/it.rss', apiType: 'rss' },
  { id: 'geeknews', name: 'GeekNews', nameKo: '긱뉴스', region: 'KR', regionFlag: '🇰🇷', icon: '🤓', apiUrl: 'https://news.hada.io/rss', apiType: 'rss' },
  { id: 'disquiet', name: 'Disquiet', nameKo: '디스콰이엇', region: 'KR', regionFlag: '🇰🇷', icon: '🔮', apiUrl: 'https://disquiet.io/rss/makers', apiType: 'rss' },
  { id: 'lobsters', name: 'Lobste.rs', nameKo: 'Lobsters', region: 'EU', regionFlag: '🇪🇺', icon: '🦞', apiUrl: 'https://lobste.rs/hottest.json', apiType: 'json' },
  { id: 'tabnews', name: 'TabNews', nameKo: 'TabNews', region: 'BR', regionFlag: '🇧🇷', icon: '📋', apiUrl: 'https://www.tabnews.com.br/api/v1/contents?strategy=relevant', apiType: 'json' },
  { id: 'devto', name: 'DEV.to', nameKo: 'DEV.to', region: 'GLOBAL', regionFlag: '🌐', icon: '👩‍💻', apiUrl: 'https://dev.to/api/articles?per_page=20&top=1', apiType: 'json' },
];

export type RegionFilter = {
  id: string;
  label: string;
  flag: string;
};

export const REGION_FILTERS: RegionFilter[] = [
  { id: 'all', label: '전체', flag: '🌐' },
  { id: 'US', label: '미국', flag: '🇺🇸' },
  { id: 'CN', label: '중국', flag: '🇨🇳' },
  { id: 'JP', label: '일본', flag: '🇯🇵' },
  { id: 'KR', label: '한국', flag: '🇰🇷' },
  { id: 'EU', label: '유럽', flag: '🇪🇺' },
  { id: 'BR', label: '브라질', flag: '🇧🇷' },
  { id: 'GLOBAL', label: '글로벌', flag: '🌍' },
];

export function getSourcesByRegion(region: string): CommunitySource[] {
  if (region === 'all') return COMMUNITY_SOURCES;
  return COMMUNITY_SOURCES.filter(s => s.region === region);
}
