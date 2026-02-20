'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCountryNews } from '@/hooks/useCountryNews';
import { formatRelativeTime } from '@/lib/utils/date';

const WorldMapChart = dynamic(() => import('./WorldMapChart'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

type CountryInfo = {
  code: string;
  name: string;
  nameKo: string;
  flag: string;
};

const COUNTRIES: CountryInfo[] = [
  { code: 'US', name: 'United States', nameKo: '미국', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', nameKo: '캐나다', flag: '🇨🇦' },
  { code: 'BR', name: 'Brazil', nameKo: '브라질', flag: '🇧🇷' },
  { code: 'UK', name: 'United Kingdom', nameKo: '영국', flag: '🇬🇧' },
  { code: 'FR', name: 'France', nameKo: '프랑스', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', nameKo: '독일', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', nameKo: '이탈리아', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', nameKo: '스페인', flag: '🇪🇸' },
  { code: 'RU', name: 'Russia', nameKo: '러시아', flag: '🇷🇺' },
  { code: 'IL', name: 'Israel', nameKo: '이스라엘', flag: '🇮🇱' },
  { code: 'SA', name: 'Saudi Arabia', nameKo: '사우디아라비아', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', nameKo: '카타르', flag: '🇶🇦' },
  { code: 'IN', name: 'India', nameKo: '인도', flag: '🇮🇳' },
  { code: 'CN', name: 'China', nameKo: '중국', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', nameKo: '한국', flag: '🇰🇷' },
  { code: 'JP', name: 'Japan', nameKo: '일본', flag: '🇯🇵' },
  { code: 'TW', name: 'Taiwan', nameKo: '대만', flag: '🇹🇼' },
  { code: 'HK', name: 'Hong Kong', nameKo: '홍콩', flag: '🇭🇰' },
  { code: 'SG', name: 'Singapore', nameKo: '싱가포르', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', nameKo: '호주', flag: '🇦🇺' },
];

const CODE_TO_COUNTRY = new Map(COUNTRIES.map(c => [c.code, c]));

export function WorldNewsMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { items: news, isLoading, error } = useCountryNews(selectedCountry);

  const selectedInfo = selectedCountry ? CODE_TO_COUNTRY.get(selectedCountry) : null;

  const handleSelectCountry = useCallback((code: string | null) => {
    setSelectedCountry(code);
  }, []);

  return (
    <section className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          세계 뉴스 맵
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          국가를 클릭하면 해당 국가의 최신 뉴스를 확인할 수 있습니다
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map Area */}
        <div className="flex-1 p-2 lg:p-4">
          <WorldMapChart
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
          />
        </div>

        {/* News Panel */}
        <div
          className={`lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-700/50 transition-all duration-300 ${
            selectedCountry ? 'max-h-[500px] lg:max-h-none' : 'max-h-0 lg:max-h-none lg:w-0 overflow-hidden'
          }`}
        >
          {selectedCountry && selectedInfo && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{selectedInfo.flag}</span>
                <div>
                  <h3 className="text-white font-semibold">{selectedInfo.nameKo}</h3>
                  <p className="text-slate-500 text-xs">{selectedInfo.name}</p>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="ml-auto text-slate-500 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-3 bg-slate-700 rounded w-full mb-2" />
                      <div className="h-2 bg-slate-700 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-slate-700 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {!isLoading && !error && news.length === 0 && (
                <p className="text-slate-500 text-sm">이 국가의 뉴스를 찾을 수 없습니다</p>
              )}

              {!isLoading && news.length > 0 && (
                <div className="space-y-3">
                  {news.map((item, idx) => (
                    <a
                      key={item.id || idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors"
                    >
                      {item.titleKo && (
                        <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                          {item.titleKo}
                        </p>
                      )}
                      <p className={`text-xs line-clamp-2 mb-2 ${item.titleKo ? 'text-slate-400' : 'text-white font-medium'}`}>
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{item.source?.countryFlag} {item.source?.nameKo || item.sourceId}</span>
                        <span>{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
