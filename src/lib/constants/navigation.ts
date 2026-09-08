/**
 * 사이드바와 모바일 네비게이션이 공유하는 메뉴 정의.
 *
 * 두 컴포넌트가 각자 목록을 들고 있었을 때 모바일 탭바에 5개만 남아
 * 나머지 6개 화면은 주소를 직접 치지 않으면 갈 수 없었다. 목록을 한 곳에
 * 두어 메뉴를 추가해도 양쪽이 어긋나지 않게 한다.
 */

import type { IconName } from '@/components/ui/Icon';

export type NavItem = {
  href: string;
  label: string;
  /** 하단 탭바는 폭이 좁아 짧은 이름을 따로 둔다 */
  shortLabel?: string;
  icon: IconName;
  /** 하단 탭바에 고정으로 노출할 항목 */
  primary?: boolean;
  /** 사이드바에서 묶어 보여줄 그룹 */
  group: 'daily' | 'research' | 'play';
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '오늘의 뉴스', shortLabel: '뉴스', icon: 'dashboard', primary: true, group: 'daily' },
  { href: '/brief', label: '오늘의 브리프', shortLabel: '브리프', icon: 'brief', primary: true, group: 'daily' },
  { href: '/saved', label: '저장한 뉴스', shortLabel: '저장', icon: 'bookmark', primary: true, group: 'daily' },
  { href: '/watchdog', label: '관심 종목 뉴스', shortLabel: '관심 종목', icon: 'watchdog', group: 'daily' },
  { href: '/signals', label: '인사이더 시그널', shortLabel: '시그널', icon: 'signals', group: 'daily' },

  { href: '/reports', label: '산업 리포트', shortLabel: '리포트', icon: 'reports', primary: true, group: 'research' },
  { href: '/sources', label: '미디어 랭킹', shortLabel: '미디어', icon: 'media', group: 'research' },
  { href: '/sentiment', label: '센티먼트 맵', shortLabel: '센티먼트', icon: 'sentiment', group: 'research' },
  { href: '/compare', label: '관점 대결', shortLabel: '관점', icon: 'compare', group: 'research' },
  { href: '/events', label: '전시회/컨퍼런스', shortLabel: '행사', icon: 'events', group: 'research' },

  { href: '/predict', label: '뉴스 배틀', shortLabel: '배틀', icon: 'predict', group: 'play' },
  { href: '/fun', label: '유머', icon: 'fun', group: 'play' },
];

export const ACCOUNT_ITEMS: NavItem[] = [
  { href: '/profile', label: '마이페이지', shortLabel: 'MY', icon: 'profile', group: 'daily' },
  { href: '/settings', label: '설정', icon: 'settings', group: 'daily' },
];

/** 사이드바 그룹 머리글 */
export const NAV_GROUPS: { id: NavItem['group']; label: string }[] = [
  { id: 'daily', label: '매일' },
  { id: 'research', label: '리서치' },
  { id: 'play', label: '즐기기' },
];

/** 하단 탭바에 그대로 노출되는 항목 */
export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter(item => item.primary);

/** 탭바에 자리가 없어 「더보기」 시트로 넘기는 항목 */
export const SECONDARY_NAV_ITEMS = NAV_ITEMS.filter(item => !item.primary);
