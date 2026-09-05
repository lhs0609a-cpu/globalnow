'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';

type Tab = {
  id: string;
  label: string;
  icon?: string;
};

/**
 * 섹션 탭.
 *
 * 알약 대신 밑줄로 바꿨다. 카테고리가 열 개에 가까우면 알약은 색 덩어리가
 * 줄줄이 늘어서 제목보다 먼저 눈에 띈다. 신문 지면처럼 괘선 위에 이름만
 * 늘어놓고, 선택된 것만 밑줄과 흰 글자로 든다.
 *
 * 좌우 화살표로 탭을 옮길 수 있어야 키보드 사용자가 목록을 지나칠 수 있다.
 */
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
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const index = tabs.findIndex(t => t.id === activeTab);
    const next =
      e.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    const node = listRef.current?.querySelectorAll('[role="tab"]')[next];
    (node as HTMLElement | undefined)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={clsx(
        'scrollbar-hide fade-edge-r flex gap-1 overflow-x-auto border-b border-line',
        className
      )}
    >
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={clsx(
              't-label relative whitespace-nowrap px-3 py-2.5 transition-colors',
              active ? 'text-slate-100' : 'text-slate-500 hover:text-slate-200'
            )}
          >
            {tab.label}
            <span
              aria-hidden
              className={clsx(
                'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-slate-100 transition-opacity',
                active ? 'opacity-100' : 'opacity-0'
              )}
            />
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
      <div className="mt-5">{children(activeTab)}</div>
    </div>
  );
}
