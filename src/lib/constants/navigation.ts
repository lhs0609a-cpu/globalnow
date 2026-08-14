/**
 * 사이드바와 모바일 네비게이션이 공유하는 메뉴 정의.
 *
 * 두 컴포넌트가 각자 목록을 들고 있었을 때 모바일 탭바에 5개만 남아
 * 나머지 6개 화면은 주소를 직접 치지 않으면 갈 수 없었다. 목록을 한 곳에
 * 두어 메뉴를 추가해도 양쪽이 어긋나지 않게 한다.
 */

export type NavItem = {
  href: string;
  label: string;
  /** 하단 탭바는 폭이 좁아 짧은 이름을 따로 둔다 */
  shortLabel?: string;
  icon: string;
  /** 하단 탭바에 고정으로 노출할 항목 */
  primary?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '대시보드', shortLabel: '홈', icon: '📊', primary: true },
  { href: '/brief', label: '모닝 브리프', shortLabel: '브리프', icon: '☀️' },
  { href: '/watchdog', label: '포트폴리오 워치독', shortLabel: '워치독', icon: '🐕', primary: true },
  { href: '/reports', label: '산업 리포트', shortLabel: '리포트', icon: '📋', primary: true },
  { href: '/sources', label: '미디어 랭킹', shortLabel: '미디어', icon: '🏆' },
  { href: '/events', label: '전시회/컨퍼런스', shortLabel: '행사', icon: '📅' },
  { href: '/compare', label: '관점 대결', shortLabel: '관점', icon: '⚔️' },
  { href: '/sentiment', label: '센티먼트 맵', shortLabel: '센티먼트', icon: '🗺️' },
  { href: '/signals', label: '인사이더 시그널', shortLabel: '시그널', icon: '🔔' },
  { href: '/fun', label: '유머', icon: '😄' },
  { href: '/predict', label: '뉴스 배틀', shortLabel: '배틀', icon: '🎯', primary: true },
];

export const ACCOUNT_ITEMS: NavItem[] = [
  { href: '/profile', label: '마이페이지', shortLabel: 'MY', icon: '👤' },
  { href: '/settings', label: '설정', icon: '⚙️' },
];

/** 하단 탭바에 그대로 노출되는 항목 */
export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter(item => item.primary);

/** 탭바에 자리가 없어 「더보기」 시트로 넘기는 항목 */
export const SECONDARY_NAV_ITEMS = NAV_ITEMS.filter(item => !item.primary);
