'use client';

import { useState } from 'react';
import { useCountryNews } from '@/hooks/useCountryNews';
import { formatRelativeTime } from '@/lib/utils/date';

type CountryInfo = {
  code: string;
  name: string;
  nameKo: string;
  flag: string;
  // Position on SVG map (approximate center of each country in percentage)
  x: number;
  y: number;
};

const COUNTRIES: CountryInfo[] = [
  { code: 'US', name: 'United States', nameKo: '미국', flag: '🇺🇸', x: 20, y: 40 },
  { code: 'CA', name: 'Canada', nameKo: '캐나다', flag: '🇨🇦', x: 20, y: 28 },
  { code: 'BR', name: 'Brazil', nameKo: '브라질', flag: '🇧🇷', x: 30, y: 65 },
  { code: 'UK', name: 'United Kingdom', nameKo: '영국', flag: '🇬🇧', x: 47, y: 30 },
  { code: 'FR', name: 'France', nameKo: '프랑스', flag: '🇫🇷', x: 48, y: 36 },
  { code: 'DE', name: 'Germany', nameKo: '독일', flag: '🇩🇪', x: 50, y: 32 },
  { code: 'IT', name: 'Italy', nameKo: '이탈리아', flag: '🇮🇹', x: 51, y: 38 },
  { code: 'ES', name: 'Spain', nameKo: '스페인', flag: '🇪🇸', x: 46, y: 39 },
  { code: 'RU', name: 'Russia', nameKo: '러시아', flag: '🇷🇺', x: 65, y: 25 },
  { code: 'IL', name: 'Israel', nameKo: '이스라엘', flag: '🇮🇱', x: 56, y: 42 },
  { code: 'SA', name: 'Saudi Arabia', nameKo: '사우디아라비아', flag: '🇸🇦', x: 58, y: 46 },
  { code: 'QA', name: 'Qatar', nameKo: '카타르', flag: '🇶🇦', x: 59, y: 45 },
  { code: 'IN', name: 'India', nameKo: '인도', flag: '🇮🇳', x: 68, y: 47 },
  { code: 'CN', name: 'China', nameKo: '중국', flag: '🇨🇳', x: 75, y: 38 },
  { code: 'KR', name: 'South Korea', nameKo: '한국', flag: '🇰🇷', x: 80, y: 38 },
  { code: 'JP', name: 'Japan', nameKo: '일본', flag: '🇯🇵', x: 83, y: 38 },
  { code: 'TW', name: 'Taiwan', nameKo: '대만', flag: '🇹🇼', x: 79, y: 44 },
  { code: 'HK', name: 'Hong Kong', nameKo: '홍콩', flag: '🇭🇰', x: 77, y: 44 },
  { code: 'SG', name: 'Singapore', nameKo: '싱가포르', flag: '🇸🇬', x: 75, y: 56 },
  { code: 'AU', name: 'Australia', nameKo: '호주', flag: '🇦🇺', x: 82, y: 68 },
];

export function WorldNewsMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { items: news, isLoading, error } = useCountryNews(selectedCountry);

  const selectedInfo = COUNTRIES.find(c => c.code === selectedCountry);

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
        <div className="flex-1 p-4 min-h-[300px] lg:min-h-[400px] relative">
          {/* SVG World Map Background */}
          <div className="relative w-full h-full" style={{ minHeight: 300 }}>
            {/* Simple world outline using SVG */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full absolute inset-0"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Ocean background */}
              <rect width="100" height="80" fill="transparent" />

              {/* Simplified continent outlines */}
              {/* North America */}
              <path d="M5,18 L10,12 L22,10 L30,14 L32,22 L28,32 L22,38 L18,45 L14,48 L10,42 L8,35 L5,28 Z" fill="rgb(51,65,85)" stroke="rgb(71,85,105)" strokeWidth="0.3" opacity="0.6" />
              {/* South America */}
              <path d="M22,50 L28,48 L33,52 L35,58 L34,65 L30,72 L26,76 L22,72 L20,65 L19,58 Z" fill="rgb(51,65,85)" stroke="rgb(71,85,105)" strokeWidth="0.3" opacity="0.6" />
              {/* Europe */}
              <path d="M43,18 L48,16 L55,18 L56,22 L54,28 L50,32 L48,38 L44,40 L42,36 L40,30 L42,24 Z" fill="rgb(51,65,85)" stroke="rgb(71,85,105)" strokeWidth="0.3" opacity="0.6" />
              {/* Africa */}
              <path d="M44,42 L50,40 L56,42 L60,48 L58,56 L55,64 L50,70 L46,68 L42,62 L40,54 L42,48 Z" fill="rgb(51,65,85)" stroke="rgb(71,85,105)" strokeWidth="0.3" opacity="0.6" />
              {/* Asia */}
              <path d="M56,16 L65,12 L78,14 L85,18 L88,24 L86,32 L82,38 L78,42 L72,48 L66,50 L60,46 L56,40 L54,32 L55,24 Z" fill="rgb(51,65,85)" stroke="rgb(71,85,105)" strokeWidth="0.3" opacity="0.6" />
              {/* Australia */}
              <path d="M74,58 L82,56 L88,60 L90,66 L86,72 L80,74 L74,70 L72,64 Z" fill="rgb(51,65,85)" stroke="rgb(71,85,105)" strokeWidth="0.3" opacity="0.6" />

              {/* Connection lines from selected country */}
              {selectedCountry && selectedInfo && (
                <line
                  x1={selectedInfo.x}
                  y1={selectedInfo.y}
                  x2={selectedInfo.x}
                  y2={selectedInfo.y}
                  stroke="rgb(59,130,246)"
                  strokeWidth="0"
                  opacity="0"
                />
              )}
            </svg>

            {/* Country markers */}
            {COUNTRIES.map(country => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(
                  selectedCountry === country.code ? null : country.code
                )}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 group
                  ${selectedCountry === country.code
                    ? 'scale-125'
                    : 'hover:scale-110'
                  }`}
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
                title={`${country.flag} ${country.nameKo}`}
              >
                {/* Pulse ring for selected */}
                {selectedCountry === country.code && (
                  <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" style={{ width: 32, height: 32, left: -8, top: -8 }} />
                )}
                <span
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm cursor-pointer
                    ${selectedCountry === country.code
                      ? 'bg-blue-500 ring-2 ring-blue-400 shadow-lg shadow-blue-500/30'
                      : 'bg-slate-700 hover:bg-slate-600 ring-1 ring-slate-600'
                    }`}
                >
                  {country.flag}
                </span>
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {country.nameKo}
                </span>
              </button>
            ))}
          </div>
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
                        <span>{item.source?.nameKo || item.sourceId}</span>
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
