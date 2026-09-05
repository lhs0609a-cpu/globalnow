'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/news';
import { PageHeader } from '@/components/layout/AppShell';
import { FilterChip } from '@/components/ui/Button';
import { Card, CardDivider } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Skeleton';

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
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {countries.map(country => {
            const items = newsByCountry[country.code] || [];
            return (
              <Card key={country.code}>
                <div className="flex items-center gap-2.5 px-5 py-3.5">
                  <span className="text-[1.0625rem] leading-none">{country.flag}</span>
                  <span className="t-title font-semibold text-slate-100">
                    {country.name}
                  </span>
                </div>
                <CardDivider />

                {items.length === 0 ? (
                  <p className="px-5 py-10 text-center t-body-sm text-slate-500">
                    관련 뉴스 없음
                  </p>
                ) : (
                  <div className="divide-y divide-line">
                    {items.map(news => (
                      <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block px-5 py-3.5 transition-colors hover:bg-fill-subtle"
                      >
                        <p className="line-clamp-2 t-body-sm font-medium leading-snug text-slate-100 transition-colors group-hover:text-accent-text">
                          {news.titleKo || news.title}
                        </p>
                        <p className="mt-1.5 line-clamp-2 t-body-sm text-slate-500">
                          {news.summaryKo || news.summary}
                        </p>
                        <p className="mt-1.5 t-meta-sm text-slate-600">
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
