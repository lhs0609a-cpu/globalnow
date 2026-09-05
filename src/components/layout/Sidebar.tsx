'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ACCOUNT_ITEMS, NAV_GROUPS, NAV_ITEMS, type NavItem } from '@/lib/constants/navigation';
import { Icon } from '@/components/ui/Icon';

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.875rem] font-medium transition-colors',
        active
          ? 'bg-fill text-slate-100'
          : 'text-slate-400 hover:bg-fill-weak hover:text-slate-100'
      )}
    >
      {/* 활성 표시는 배경만으로는 약해서 왼쪽에 짧은 축을 세운다 */}
      <span
        className={clsx(
          'absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-accent transition-opacity',
          active ? 'opacity-100' : 'opacity-0'
        )}
      />
      <Icon
        name={item.icon}
        className={clsx(
          'h-[1.125rem] w-[1.125rem] flex-shrink-0 transition-colors',
          active ? 'text-accent-text' : 'text-slate-500 group-hover:text-slate-300'
        )}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/user/streak');
        const data = await res.json();
        setStreak(data.streak || 0);
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      }
    }
    fetchStreak();
  }, []);

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-var(--header-h))] w-60 flex-col border-r border-line bg-canvas lg:flex">
      <nav aria-label="주요 메뉴" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, index) => {
          const items = NAV_ITEMS.filter(item => item.group === group.id);
          if (items.length === 0) return null;

          return (
            <div key={group.id} className={index > 0 ? 'mt-6' : undefined}>
              <p className="t-kicker px-2.5 pb-2 text-slate-500">{group.label}</p>
              <div className="space-y-0.5">
                {items.map(item => (
                  <NavLink key={item.href} item={item} active={pathname === item.href} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-line px-3 py-3">
        {ACCOUNT_ITEMS.map(item => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>

      {/* 스트릭: 카드로 띄우면 시선을 뺏어서, 상태 표시줄처럼 조용히 둔다 */}
      <div className="border-t border-line px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon name="flame" className="h-4 w-4 text-amber-400" />
          <span className="tnum t-meta font-semibold text-slate-200">{streak}일 연속</span>
        </div>
        <p className="t-meta-sm mt-1 font-normal text-slate-500">
          매일 읽고 스트릭을 이어가세요
        </p>
      </div>
    </aside>
  );
}
