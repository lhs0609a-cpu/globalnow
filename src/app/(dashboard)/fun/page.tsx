'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HumorItem } from '@/types/prediction';
import { formatNumber } from '@/lib/utils/format';
import { Tabs } from '@/components/ui/Tabs';
import { PageHeader } from '@/components/layout/AppShell';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Skeleton';

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'meme', label: '밈' },
  { id: 'gif', label: 'GIF' },
  { id: 'satire', label: '풍자' },
  { id: 'comic', label: '만화' },
];

const subPages = [
  { href: '/fun/memes', label: '밈 모음', desc: '최신 인터넷 밈' },
  { href: '/fun/gifs', label: 'GIF 모음', desc: '재미있는 GIF' },
  { href: '/fun/satire', label: '풍자 뉴스', desc: 'The Onion 스타일' },
  { href: '/fun/comics', label: '만화', desc: 'XKCD, 시사만평' },
];

export default function FunPage() {
  const [items, setItems] = useState<HumorItem[]>([]);
  const [activeType, setActiveType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHumor() {
      setIsLoading(true);
      try {
        const url = activeType === 'all' ? '/api/humor' : `/api/humor?type=${activeType}`;
        const res = await fetch(url);
        const data = await res.json();
        setItems(data.items || data);
      } catch (error) {
        console.error('Failed to fetch humor:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHumor();
  }, [activeType]);

  return (
    <div>
      <PageHeader title="유머 & 트렌딩" description="뉴스에 지친 당신을 위한 유머 모음" />

      {/* Sub-page links */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {subPages.map(page => (
          <Link
            key={page.href}
            href={page.href}
            className="group surface p-4 transition-colors hover:border-line-strong"
          >
            <div className="flex items-center justify-between">
              <p className="t-title font-semibold text-slate-100 transition-colors group-hover:text-accent-text">
                {page.label}
              </p>
              <Icon
                name="chevronRight"
                className="h-4 w-4 text-slate-600 transition-colors group-hover:text-accent-text"
              />
            </div>
            <p className="mt-1 t-body-sm text-slate-500">{page.desc}</p>
          </Link>
        ))}
      </div>

      {/* Filter tabs */}
      <Tabs tabs={tabs} activeTab={activeType} onChange={setActiveType} className="mb-5" />

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden surface transition-colors hover:border-line-strong"
            >
              {item.imageUrl && (
                <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="line-clamp-2 t-headline-sm text-slate-100 transition-colors group-hover:text-accent-text">
                  {item.titleKo || item.title}
                </p>
                {item.content && !item.imageUrl && (
                  <p className="mt-2 line-clamp-3 t-body-sm text-slate-500">
                    {item.content}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between t-meta-sm text-slate-500">
                  <span className="tnum">▲ {formatNumber(item.upvotes)}</span>
                  <span className="truncate">{item.source}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
