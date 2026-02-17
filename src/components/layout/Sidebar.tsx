'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: '대시보드', icon: '📊' },
  { href: '/brief', label: '모닝 브리프', icon: '☀️' },
  { href: '/watchdog', label: '포트폴리오 워치독', icon: '🐕' },
  { href: '/reports', label: '산업 리포트', icon: '📋' },
  { href: '/compare', label: '관점 대결', icon: '⚔️' },
  { href: '/sentiment', label: '센티먼트 맵', icon: '🗺️' },
  { href: '/signals', label: '인사이더 시그널', icon: '🔔' },
  { href: '/fun', label: '유머', icon: '😄' },
  { href: '/predict', label: '뉴스 배틀', icon: '🎯' },
];

const bottomItems = [
  { href: '/profile', label: '마이페이지', icon: '👤' },
  { href: '/settings', label: '설정', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch("/api/user/streak");
        const data = await res.json();
        setStreak(data.streak || 0);
      } catch (error) {
        console.error("Failed to fetch streak:", error);
      }
    }
    fetchStreak();
  }, []);

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-700/50 h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
        {bottomItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Streak widget */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🔥</span>
            <span className="text-white text-sm font-semibold">{streak}일 연속</span>
          </div>
          <p className="text-slate-400 text-xs">매일 뉴스를 읽고 스트릭을 유지하세요!</p>
        </div>
      </div>
    </aside>
  );
}
