'use client';

import { CATEGORIES } from '@/lib/constants/categories';

// 이모지를 떼고 이름만 남겨야 탭 줄의 높이와 리듬이 일정해진다
const tabs = CATEGORIES.map(c => ({
  id: c.id,
  label: c.nameKo,
}));

export function CategoryTabs({
  activeCategory,
  onChange,
}: {
  activeCategory: string;
  onChange: (category: string) => void;
}) {
  return (
    <div role="group" aria-label="뉴스 주제" className="mb-4 flex gap-1 overflow-x-auto border-b border-line pb-2">
      {tabs.map(tab => <button key={tab.id} type="button" aria-pressed={activeCategory === tab.id} onClick={() => onChange(tab.id)}
        className={`min-h-11 shrink-0 rounded-lg px-3 t-label transition-colors ${activeCategory === tab.id ? 'bg-accent-soft text-accent-text' : 'text-slate-400 hover:bg-fill'}`}>
        {tab.label}
      </button>)}
    </div>
  );
}
