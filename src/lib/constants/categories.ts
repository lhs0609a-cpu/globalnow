import { NewsCategory } from '@/types/news';

export type CategoryInfo = {
  id: NewsCategory | 'all';
  name: string;
  nameKo: string;
  icon: string;
  color: string;
};

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All', nameKo: '전체', icon: '🌐', color: 'blue' },
  { id: 'international', name: 'International', nameKo: '국제', icon: '🌍', color: 'blue' },
  { id: 'economy', name: 'Economy', nameKo: '경제', icon: '📈', color: 'emerald' },
  { id: 'tech', name: 'Tech', nameKo: '테크', icon: '💻', color: 'violet' },
  { id: 'politics', name: 'Politics', nameKo: '정치', icon: '🏛️', color: 'amber' },
  { id: 'risk', name: 'Risk', nameKo: '리스크', icon: '⚠️', color: 'red' },
  { id: 'culture', name: 'Culture', nameKo: '문화', icon: '🎭', color: 'pink' },
  { id: 'science', name: 'Science', nameKo: '과학', icon: '🔬', color: 'cyan' },
  { id: 'health', name: 'Health', nameKo: '의학·건강', icon: '🩺', color: 'teal' },
  { id: 'sports', name: 'Sports', nameKo: '스포츠', icon: '⚽', color: 'orange' },
];

/**
 * 카테고리 칩 색.
 *
 * 테두리까지 두르면 촘촘한 목록에서 상자가 겹겹이 보인다. 배경과 글자색만
 * 남겨 색으로만 구분되게 한다.
 */
export const CATEGORY_COLORS: Record<string, string> = {
  international: 'bg-blue-400/10 text-blue-400',
  economy: 'bg-emerald-400/10 text-emerald-400',
  tech: 'bg-violet-400/10 text-violet-400',
  politics: 'bg-amber-400/10 text-amber-400',
  risk: 'bg-red-400/10 text-red-400',
  culture: 'bg-pink-400/10 text-pink-400',
  science: 'bg-cyan-400/10 text-cyan-400',
  health: 'bg-teal-400/10 text-teal-400',
  sports: 'bg-orange-400/10 text-orange-400',
};
