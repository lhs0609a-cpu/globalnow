'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils/date';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';

const countries = [
  { code: 'US', flag: '🇺🇸', name: '미국' },
  { code: 'UK', flag: '🇬🇧', name: '영국' },
  { code: 'JP', flag: '🇯🇵', name: '일본' },
  { code: 'DE', flag: '🇩🇪', name: '독일' },
  { code: 'CN', flag: '🇨🇳', name: '중국' },
];

export function CountryCompare() {
  const [newsByCountry, setNewsByCountry] = useState<Record<string, NewsItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchByCountry() {
      try {
        const results = await Promise.all(
          countries.map(async (c) => {
            const res = await fetch(`/api/news?country=${c.code}&limit=3`);
            const data = await res.json();
            return { code: c.code, items: data.items || [] };
          })
        );
        const map: Record<string, NewsItem[]> = {};
        results.forEach(r => { map[r.code] = r.items; });
        setNewsByCountry(map);
      } catch (error) {
        console.error('Failed to fetch country news:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchByCountry();
  }, []);

  return (
    <Card>
      <CardHeader
        title="국가별 주요 뉴스"
        description="같은 시각, 나라마다 어떤 뉴스를 앞세웠는지 비교합니다"
        icon="compare"
      />
      <CardDivider />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-px bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-5">
          {countries.map(country => (
            <div key={country.code} className="bg-slate-800 px-5 py-4">
              <div className="shimmer mb-3 h-3.5 w-16 rounded bg-white/[0.05]" />
              <div className="space-y-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="shimmer space-y-1.5">
                    <div className="h-3 w-full rounded bg-white/[0.05]" />
                    <div className="h-2.5 w-1/2 rounded bg-white/[0.05]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 얇은 간격을 배경색으로 만들어 칼럼 사이에 경계선을 세운다
        <div className="grid grid-cols-1 gap-px bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-5">
          {countries.map(country => {
            const items = newsByCountry[country.code] || [];
            return (
              <div key={country.code} className="bg-slate-800 px-5 py-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[0.8125rem] leading-none">{country.flag}</span>
                  <span className="text-[0.8125rem] font-semibold text-slate-200">
                    {country.name}
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="py-2 text-xs text-slate-500">뉴스가 없습니다</p>
                ) : (
                  <div className="-mx-2">
                    {items.map(news => (
                      <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-md px-2 py-2 transition-colors hover:bg-white/[0.03]"
                      >
                        <p className="line-clamp-3 text-xs leading-relaxed text-slate-300 transition-colors group-hover:text-blue-400">
                          {news.titleKo || news.title}
                        </p>
                        <p className="mt-1 text-[0.625rem] text-slate-500">
                          {formatRelativeTime(news.publishedAt)}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
