'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HumorItem } from '@/types/prediction';
import { formatNumber } from '@/lib/utils/format';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const typeLabels: Record<string, string> = {
  meme: '밈',
  gif: 'GIF',
  satire: '풍자',
  comic: '만화',
};

export function HumorSection() {
  const [items, setItems] = useState<HumorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHumor() {
      try {
        const res = await fetch('/api/humor/trending');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch humor:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHumor();
  }, []);

  return (
    <Card>
      <CardHeader
        title="유머 & 트렌딩"
        icon="fun"
        action={
          <Link
            href="/fun"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
          >
            더보기
            <Icon name="chevronRight" className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <CardDivider />

      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-white/[0.05]"
              >
                <div className="shimmer aspect-[4/3] bg-white/[0.04]" />
                <div className="space-y-1.5 p-2.5">
                  <div className="shimmer h-3 w-full rounded bg-white/[0.05]" />
                  <div className="shimmer h-2.5 w-1/2 rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-[0.8125rem] text-slate-500">
            표시할 항목이 없습니다
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.slice(0, 4).map(item => (
              <a
                key={item.id}
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.12]"
              >
                {item.imageUrl && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute right-2 top-2 rounded bg-slate-950/70 px-1.5 py-0.5 text-[0.625rem] font-medium text-slate-200 backdrop-blur-sm">
                      {typeLabels[item.type] || item.type}
                    </span>
                  </div>
                )}
                <div className="p-2.5">
                  <p className="line-clamp-2 text-xs leading-snug text-slate-200 transition-colors group-hover:text-blue-400">
                    {item.titleKo || item.title}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[0.625rem] text-slate-500">
                    <span className="tnum">▲ {formatNumber(item.upvotes)}</span>
                    <span className="truncate">{item.source}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
