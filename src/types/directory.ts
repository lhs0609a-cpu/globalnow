/** 사이트 디렉토리 공통 타입 */

export type DirectoryScope = 'kr' | 'global';

/** 보도 성향 — 「관점 대결」에서 좌우 매체를 짝지을 때 쓴다 */
export type MediaLean = 'progressive' | 'center' | 'conservative';

export type DirectoryGroupId =
  // ── 해외 ──
  | 'agency'
  | 'us-daily'
  | 'broadcast'
  | 'weekly'
  | 'business'
  | 'markets'
  | 'opinion'
  | 'politics'
  | 'thinktank'
  | 'data'
  | 'tech'
  | 'ai'
  | 'science'
  | 'medical'
  | 'auto'
  | 'sports'
  | 'entertainment'
  | 'learning'
  | 'portal'
  // ── 해외 국가별 ──
  | 'uk'
  | 'europe-west'
  | 'europe-nordic'
  | 'europe-south'
  | 'europe-east'
  | 'russia'
  | 'asia-east'
  | 'asia-southeast'
  | 'asia-south'
  | 'asia-central'
  | 'middle-east'
  | 'africa'
  | 'oceania'
  | 'northam'
  | 'latam'
  // ── 국내 ──
  | 'korea-en'
  | 'kr-daily'
  | 'kr-broadcast'
  | 'kr-portal'
  | 'kr-economy'
  | 'kr-stock'
  | 'kr-crypto'
  | 'kr-realestate'
  | 'kr-opinion'
  | 'kr-cartoon'
  | 'kr-progressive'
  | 'kr-conservative'
  | 'kr-investigative'
  | 'kr-media'
  | 'kr-it'
  | 'kr-ai'
  | 'kr-science'
  | 'kr-medical'
  | 'kr-health'
  | 'kr-industry'
  | 'kr-military'
  | 'kr-game'
  | 'kr-auto'
  | 'kr-sports'
  | 'kr-entertainment'
  | 'kr-law'
  | 'kr-tax'
  | 'kr-environment'
  | 'kr-agri'
  | 'kr-nk'
  | 'kr-culture'
  | 'kr-community';

export type DirectoryGroup = {
  id: DirectoryGroupId;
  label: string;
  labelEn: string;
  icon: string;
  description: string;
  scope: DirectoryScope;
};

export type DirectorySite = {
  id: string;
  name: string;
  nameKo: string;
  url: string;
  country: string;
  group: DirectoryGroupId;
  /**
   * 그룹 내 인지도 순위 (1 = 가장 널리 쓰이는 사이트).
   * 측정된 트래픽 수치가 아니라 편집 기준의 상대 순위다.
   */
  rank: number;
  /** 생략하면 소속 그룹의 scope를 따른다 */
  scope?: DirectoryScope;
  /** RSS 주소가 있으면 수집기에 바로 붙일 수 있다 */
  rssUrl?: string;
  /** 로그인·구독 없이 전문을 볼 수 있는가 */
  free?: boolean;
  /** 보도 성향 (해당되는 매체만) */
  lean?: MediaLean;
  /** 한 줄 설명 */
  note?: string;
};
