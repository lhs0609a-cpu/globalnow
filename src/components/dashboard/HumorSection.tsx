'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HumorItem } from '@/types/prediction';
import { formatNumber } from '@/lib/utils/format';

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
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch humor:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHumor();
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <span>😄</span> 유머 & 트렌딩
        </h3>
        <Link
          href="/fun"
          className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
        >
          더보기 →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.slice(0, 4).map(item => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg overflow-hidden bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              {item.imageUrl && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.titleKo || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {typeLabels[item.type] || item.type}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-2.5">
                <p className="text-white text-xs line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {item.titleKo || item.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
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
