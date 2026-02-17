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
];

export const CATEGORY_COLORS: Record<string, string> = {
  international: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  economy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  tech: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  politics: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  risk: 'bg-red-500/10 text-red-400 border-red-500/20',
  culture: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};
