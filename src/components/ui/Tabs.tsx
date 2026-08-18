'use client';

import { useState } from 'react';
import clsx from 'clsx';

type Tab = {
  id: string;
  label: string;
  icon?: string;
};

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
}: {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={clsx('scrollbar-hide flex gap-1 overflow-x-auto', className)}
    >
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'whitespace-nowrap rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium transition-colors',
              // 선택된 탭을 반전시키면 강조색을 쓰지 않고도 대비가 가장 확실하다
              active
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabsControlled({
  tabs,
  defaultTab,
  children,
  className,
}: {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div className={className}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-4">{children(activeTab)}</div>
    </div>
  );
}
