'use client';

import { Tabs } from '@/components/ui/Tabs';
import { CATEGORIES } from '@/lib/constants/categories';

const tabs = CATEGORIES.map(c => ({
  id: c.id,
  label: c.nameKo,
  icon: c.icon,
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
