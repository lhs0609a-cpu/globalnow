'use client';

import { Tabs } from '@/components/ui/Tabs';
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
    <Tabs
      tabs={tabs}
      activeTab={activeCategory}
      onChange={onChange}
      className="mb-4"
    />
  );
}
