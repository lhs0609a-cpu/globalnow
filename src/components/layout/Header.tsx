'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Icon } from '@/components/ui/Icon';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-slate-900/80 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2.5 lg:w-[13.75rem]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-blue-500 text-[0.6875rem] font-bold tracking-tight text-white">
            GN
          </span>
          <span className="hidden text-[0.9375rem] font-semibold tracking-tight text-slate-100 sm:block">
            Global<span className="text-slate-500">now</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder="뉴스 검색"
              aria-label="뉴스 검색"
              className={clsx(
                'h-9 w-full rounded-lg border bg-white/[0.03] pl-9 pr-16 text-[0.8125rem] text-slate-100 transition-colors',
                'placeholder:text-slate-500 focus:outline-none',
                searchOpen
                  ? 'border-blue-500/50 bg-white/[0.05]'
                  : 'border-white/[0.06] hover:border-white/10'
              )}
            />
            <kbd
              className={clsx(
                'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[0.625rem] font-medium text-slate-500 transition-opacity',
                searchOpen ? 'opacity-0' : 'hidden opacity-100 sm:block'
              )}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-shrink-0 items-center gap-1 lg:w-[13.75rem] lg:justify-end">
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-100"
          >
            <Icon name="bell" className="h-[1.125rem] w-[1.125rem]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-slate-900" />
          </button>

          <Link
            href="/profile"
            aria-label="마이페이지"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
              <Icon name="profile" className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
