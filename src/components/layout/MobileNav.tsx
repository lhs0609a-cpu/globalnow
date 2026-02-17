'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const mobileNavItems = [
  { href: '/', label: '홈', icon: '📊' },
  { href: '/watchdog', label: '워치독', icon: '🐕' },
  { href: '/reports', label: '리포트', icon: '📋' },
  { href: '/predict', label: '배틀', icon: '🎯' },
  { href: '/profile', label: 'MY', icon: '👤' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
              pathname === item.href
                ? 'text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
