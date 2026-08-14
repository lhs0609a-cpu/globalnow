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

function label(item: NavItem) {
  return item.shortLabel ?? item.label;
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
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="전체 메뉴"
            className="relative bg-slate-900 border-t border-slate-700/50 rounded-t-2xl px-4 pt-3 pb-6 max-h-[75vh] overflow-y-auto"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-700" />

            <h2 className="text-slate-400 text-xs font-medium mb-2 px-1">전체 메뉴</h2>
            <div className="grid grid-cols-3 gap-2">
              {SECONDARY_NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors',
                    pathname === item.href
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>

            <h2 className="text-slate-400 text-xs font-medium mt-4 mb-2 px-1">계정</h2>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors',
                    pathname === item.href
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 하단 탭바 */}
      <nav
        aria-label="주요 메뉴"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50"
      >
        <div className="flex items-center justify-around h-16">
          {PRIMARY_NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
                pathname === item.href
                  ? 'text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{label(item)}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setMoreOpen(v => !v)}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            className={clsx(
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
              moreOpen || moreActive
                ? 'text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <span className="text-xl">☰</span>
            <span className="text-[10px] font-medium">더보기</span>
          </button>
        </div>
      </nav>
    </>
  );
}
