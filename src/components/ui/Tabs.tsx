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
    <div className={clsx('flex gap-1 overflow-x-auto scrollbar-hide', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          )}
        >
          {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
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
