'use client';

import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/news';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">관점 대결</h1>
        <p className="text-slate-400 text-sm mt-1">같은 이슈, 다른 시각</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {comparisonTopics.map(topic => (
          <button
            key={topic.id}
            onClick={() => setActiveTopic(topic.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTopic === topic.id
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {countries.map(country => (
            <div key={country.code} className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                <span className="text-2xl">{country.flag}</span>
                <span className="text-white font-semibold">{country.name}</span>
              </div>
              <div className="space-y-3">
                {(newsByCountry[country.code] || []).map(news => (
                  <a
                    key={news.id}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {news.titleKo || news.title}
                    </p>
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                      {news.summaryKo || news.summary}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{news.source?.nameKo}</p>
                  </a>
                ))}
                {(!newsByCountry[country.code] || newsByCountry[country.code].length === 0) && (
                  <p className="text-slate-500 text-sm text-center py-4">관련 뉴스 없음</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
