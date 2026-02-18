'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils/date';

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
    <div className="bg-slate-800 rounded-xl p-4">
      <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
        <span>🌍</span> 국가별 주요 뉴스
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {countries.map(country => (
            <div key={country.code} className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-700/50">
                <span className="text-lg">{country.flag}</span>
                <span className="text-white text-sm font-medium">{country.name}</span>
              </div>
              {(newsByCountry[country.code] || []).map(news => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 rounded hover:bg-slate-700/50 transition-colors"
                >
                  <p className="text-white text-xs line-clamp-2 hover:text-blue-400 transition-colors">
                    {news.titleKo || news.title}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">
                    {formatRelativeTime(news.publishedAt)}
                  </p>
                </a>
              ))}
              {(!newsByCountry[country.code] || newsByCountry[country.code].length === 0) && (
                <p className="text-slate-500 text-xs py-2">뉴스가 없습니다</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
