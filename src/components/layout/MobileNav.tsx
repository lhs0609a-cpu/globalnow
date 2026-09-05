'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  ACCOUNT_ITEMS,
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  type NavItem,
} from '@/lib/constants/navigation';
import { Icon } from '@/components/ui/Icon';

function label(item: NavItem) {
  return item.shortLabel ?? item.label;
}

function SheetLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 text-center transition-colors',
        active
          ? 'border-transparent bg-accent-soft text-accent-text'
          : 'border-line bg-fill-subtle text-slate-300 active:bg-fill'
      )}
    >
      <Icon name={item.icon} className="h-5 w-5" />
      <span className="t-meta-sm leading-tight">{item.label}</span>
    </Link>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // 메뉴로 이동하면 시트를 닫는다
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // 시트가 열린 동안 뒤 화면이 스크롤되지 않게 막는다
  useEffect(() => {
    if (!moreOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  // 「더보기」 안의 화면을 보고 있으면 더보기 버튼도 활성으로 보여야 한다
  const moreActive = [...SECONDARY_NAV_ITEMS, ...ACCOUNT_ITEMS].some(
    item => item.href === pathname
  );

  return (
    <>
      {/* 더보기 시트 */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="전체 메뉴"
            className="relative max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-line-strong bg-canvas px-4 pb-8 pt-3"
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-fill-strong" />

            <h2 className="t-kicker px-1 pb-2 text-slate-500">전체 메뉴</h2>
            <div className="grid grid-cols-3 gap-2">
              {SECONDARY_NAV_ITEMS.map(item => (
                <SheetLink key={item.href} item={item} active={pathname === item.href} />
              ))}
            </div>

            <h2 className="t-kicker px-1 pb-2 pt-5 text-slate-500">계정</h2>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_ITEMS.map(item => (
                <SheetLink key={item.href} item={item} active={pathname === item.href} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 하단 탭바 */}
      <nav
        aria-label="주요 메뉴"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-canvas/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <div className="flex h-14 items-center justify-around">
          {PRIMARY_NAV_ITEMS.map(item => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex flex-1 flex-col items-center gap-1 py-1 transition-colors',
                  active ? 'text-accent-text' : 'text-slate-500'
                )}
              >
                <Icon name={item.icon} className="h-[1.125rem] w-[1.125rem]" />
                <span className="t-meta-sm font-semibold">{label(item)}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(v => !v)}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            className={clsx(
              'flex flex-1 flex-col items-center gap-1 py-1 transition-colors',
              moreOpen || moreActive ? 'text-accent-text' : 'text-slate-500'
            )}
          >
            <Icon name="menu" className="h-[1.125rem] w-[1.125rem]" />
            <span className="t-meta-sm font-semibold">더보기</span>
          </button>
        </div>
      </nav>
    </>
  );
}
