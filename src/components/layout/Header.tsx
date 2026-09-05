'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/**
 * 상단 바.
 *
 * 워드마크는 편집 세리프로 둔다. 라틴 한 단어짜리 제호는 신문 마스트헤드처럼
 * 세리프로 두면 UI 서체로 짜인 나머지와 확실히 구분된다.
 */
export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4 lg:gap-4 lg:px-5">
        {/* 제호 */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2.5 lg:w-[13.75rem]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-accent t-meta-sm font-bold tracking-tight text-white">
            GN
          </span>
          <span className="t-editorial hidden text-[1.0625rem] font-semibold tracking-tight text-slate-100 sm:block">
            Global<span className="text-slate-500">now</span>
          </span>
        </Link>

        {/* 검색 */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            />
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder="뉴스 검색"
              aria-label="뉴스 검색"
              className={clsx(
                'h-9 w-full rounded-lg border bg-fill-subtle pl-9 pr-16 text-[0.875rem] text-slate-100 transition-colors',
                'placeholder:text-slate-500 focus:outline-none',
                searchOpen ? 'border-accent bg-fill-weak' : 'border-line hover:border-line-strong'
              )}
            />
            <kbd
              className={clsx(
                'tnum pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line-strong',
                'bg-fill-weak px-1.5 py-0.5 t-meta-sm font-medium text-slate-500 transition-opacity',
                searchOpen ? 'opacity-0' : 'hidden opacity-100 sm:block'
              )}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* 오른쪽 동작 */}
        <div className="flex flex-shrink-0 items-center gap-0.5 lg:w-[13.75rem] lg:justify-end">
          <ThemeToggle />

          <IconButton label="알림" className="relative">
            <Icon name="bell" className="h-[1.125rem] w-[1.125rem]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-live ring-2 ring-canvas" />
          </IconButton>

          <Link
            href="/profile"
            aria-label="마이페이지"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line-strong bg-fill-weak">
              <Icon name="profile" className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
