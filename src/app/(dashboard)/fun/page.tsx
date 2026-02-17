'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HumorItem } from '@/types/prediction';
import { formatNumber } from '@/lib/utils/format';
import { Tabs } from '@/components/ui/Tabs';

const tabs = [
  { id: 'all', label: '전체' },
  { id: 'meme', label: '밈', icon: '🖼️' },
  { id: 'gif', label: 'GIF', icon: '🎬' },
  { id: 'satire', label: '풍자', icon: '🎭' },
  { id: 'comic', label: '만화', icon: '📰' },
];

const subPages = [
  { href: '/fun/memes', label: '밈 모음', icon: '🖼️', desc: '최신 인터넷 밈' },
  { href: '/fun/gifs', label: 'GIF 모음', icon: '🎬', desc: '재미있는 GIF' },
  { href: '/fun/satire', label: '풍자 뉴스', icon: '🎭', desc: 'The Onion 스타일' },
  { href: '/fun/comics', label: '만화', icon: '📰', desc: 'XKCD, 시사만평' },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">유머 & 트렌딩</h1>
        <p className="text-slate-400 text-sm mt-1">뉴스에 지친 당신을 위한 유머 모음</p>
      </div>

      {/* Sub-page links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subPages.map(page => (
          <Link
            key={page.href}
            href={page.href}
            className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700/80 transition-colors group"
          >
            <span className="text-2xl">{page.icon}</span>
            <p className="text-white text-sm font-semibold mt-2 group-hover:text-blue-400 transition-colors">{page.label}</p>
            <p className="text-slate-500 text-xs mt-0.5">{page.desc}</p>
          </Link>
        ))}
      </div>

      {/* Filter tabs */}
      <Tabs tabs={tabs} activeTab={activeType} onChange={setActiveType} />

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 rounded-xl overflow-hidden hover:ring-1 hover:ring-slate-600 transition-all group"
            >
              {item.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.titleKo || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {item.titleKo || item.title}
                </p>
                {item.content && !item.imageUrl && (
                  <p className="text-slate-400 text-xs mt-2 line-clamp-3">{item.content}</p>
                )}
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                  <span>👍 {formatNumber(item.upvotes)}</span>
                  <span>{item.source}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
