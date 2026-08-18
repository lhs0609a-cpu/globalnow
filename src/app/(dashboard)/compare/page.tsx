'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/news';
import { PageHeader } from '@/components/layout/AppShell';
import { FilterChip } from '@/components/ui/Button';
import { Card, CardDivider } from '@/components/ui/Card';

const comparisonTopics = [
  { id: 'ai', label: 'AI 규제', labelEn: 'AI Regulation' },
  { id: 'climate', label: '기후 정책', labelEn: 'Climate Policy' },
  { id: 'trade', label: '무역 갈등', labelEn: 'Trade Tensions' },
  { id: 'crypto', label: '암호화폐', labelEn: 'Cryptocurrency' },
];

const countries = [
  { code: 'US', flag: '🇺🇸', name: '미국' },
  { code: 'UK', flag: '🇬🇧', name: '영국' },
  { code: 'CN', flag: '🇨🇳', name: '중국' },
];

export default function ComparePage() {
  const [activeTopic, setActiveTopic] = useState('ai');
  const [newsByCountry, setNewsByCountry] = useState<Record<string, NewsItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          countries.map(async (c) => {
            const res = await fetch(`/api/news?country=${c.code}&search=${activeTopic}&limit=3`);
            const data = await res.json();
            return { code: c.code, items: data.items || [] };
          })
        );
        const map: Record<string, NewsItem[]> = {};
        results.forEach(r => { map[r.code] = r.items; });
        setNewsByCountry(map);
      } catch (error) {
        console.error('Failed to fetch comparison:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, [activeTopic]);

  return (
    <div>
      <PageHeader title="관점 대결" description="같은 이슈를 나라마다 어떻게 다루는지 나란히 봅니다" />

      <div className="scrollbar-hide mb-5 flex gap-1 overflow-x-auto">
        {comparisonTopics.map(topic => (
          <FilterChip
            key={topic.id}
            active={activeTopic === topic.id}
            onClick={() => setActiveTopic(topic.id)}
          >
            {topic.label}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {countries.map(country => {
            const items = newsByCountry[country.code] || [];
            return (
              <Card key={country.code}>
                <div className="flex items-center gap-2.5 px-5 py-3.5">
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="text-[0.875rem] font-semibold text-slate-100">
                    {country.name}
                  </span>
                </div>
                <CardDivider />

                {items.length === 0 ? (
                  <p className="px-5 py-10 text-center text-[0.8125rem] text-slate-500">
                    관련 뉴스 없음
                  </p>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {items.map(news => (
                      <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block px-5 py-3.5 transition-colors hover:bg-white/[0.025]"
                      >
                        <p className="line-clamp-2 text-[0.8125rem] font-medium leading-snug text-slate-100 transition-colors group-hover:text-blue-400">
                          {news.titleKo || news.title}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {news.summaryKo || news.summary}
                        </p>
                        <p className="mt-1.5 text-[0.6875rem] text-slate-600">
                          {news.source?.nameKo}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
