'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { useCountryNews } from '@/hooks/useCountryNews';
import { formatRelativeTime } from '@/lib/utils/date';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const WorldMapChart = dynamic(() => import('./WorldMapChart'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[18rem] flex-1 items-center justify-center lg:min-h-[25rem]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-blue-500" />
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

// Quick-select countries with their map center coordinates
const QUICK_SELECT_COUNTRIES: { code: string; center: [number, number]; zoom: number }[] = [
  { code: 'US', center: [-97, 38], zoom: 3 },
  { code: 'KR', center: [128, 36], zoom: 5 },
  { code: 'JP', center: [138, 36], zoom: 4 },
  { code: 'CN', center: [105, 35], zoom: 3 },
  { code: 'UK', center: [-2, 54], zoom: 5 },
  { code: 'DE', center: [10, 51], zoom: 5 },
  { code: 'IN', center: [79, 22], zoom: 3 },
  { code: 'BR', center: [-52, -14], zoom: 3 },
];

const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 1;

/** 지도 위에 겹치는 버튼들은 같은 표면을 써야 지도를 덜 어지럽힌다 */
function MapButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-slate-100"
    >
      {children}
    </button>
  );
}

export function WorldNewsMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const { items: news, isLoading, error } = useCountryNews(selectedCountry);

  const selectedInfo = selectedCountry ? CODE_TO_COUNTRY.get(selectedCountry) : null;

  const handleSelectCountry = useCallback((code: string | null) => {
    setSelectedCountry(code);
  }, []);

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setMapCenter(position.coordinates);
    setMapZoom(position.zoom);
  }, []);

  const handleZoomIn = useCallback(() => {
    setMapZoom(prev => Math.min(prev * 1.5, 6));
  }, []);

  const handleZoomOut = useCallback(() => {
    setMapZoom(prev => Math.max(prev / 1.5, 1));
  }, []);

  const handleZoomReset = useCallback(() => {
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  }, []);

  const handleQuickSelect = useCallback((code: string, center: [number, number], zoom: number) => {
    setSelectedCountry(code);
    setMapCenter(center);
    setMapZoom(zoom);
  }, []);

  return (
    <Card>
      <CardHeader
        title="세계 뉴스 맵"
        description="국가를 선택하면 해당 국가의 최신 뉴스를 볼 수 있습니다"
        icon="globe"
      />

      {/* Country quick select strip */}
      <div className="scrollbar-hide flex gap-1 px-3 pb-3 overflow-x-auto">
        {QUICK_SELECT_COUNTRIES.map(({ code, center, zoom }) => {
          const info = CODE_TO_COUNTRY.get(code);
          if (!info) return null;
          const isActive = selectedCountry === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleQuickSelect(code, center, zoom)}
              className={clsx(
                'flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-white/[0.09] text-slate-100'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
              )}
            >
              <span className="text-[0.8125rem] leading-none">{info.flag}</span>
              {info.nameKo}
            </button>
          );
        })}
      </div>

      <CardDivider />

      <div className="flex flex-col lg:flex-row">
        {/* Map Area */}
        <div className="relative min-w-0 flex-1 p-2 lg:p-3">
          <WorldMapChart
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            center={mapCenter}
            zoom={mapZoom}
            onMoveEnd={handleMoveEnd}
          />

          {/* Zoom controls overlay */}
          <div className="absolute bottom-4 right-4 flex flex-col divide-y divide-white/[0.06] overflow-hidden rounded-lg border border-white/[0.08] bg-slate-900/85 backdrop-blur-sm">
            <MapButton label="확대" onClick={handleZoomIn}>
              <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2} />
            </MapButton>
            <MapButton label="축소" onClick={handleZoomOut}>
              <Icon name="minus" className="h-3.5 w-3.5" strokeWidth={2} />
            </MapButton>
            <MapButton label="초기화" onClick={handleZoomReset}>
              <Icon name="reset" className="h-3.5 w-3.5" />
            </MapButton>
          </div>

          {/* Zoom level indicator */}
          {mapZoom > 1 && (
            <div className="tnum absolute left-4 top-4 rounded-md border border-white/[0.08] bg-slate-900/85 px-2 py-1 text-[0.625rem] font-medium text-slate-400 backdrop-blur-sm">
              {mapZoom.toFixed(1)}×
            </div>
          )}
        </div>

        {/* News Panel */}
        {selectedCountry && selectedInfo && (
          <div className="w-full flex-shrink-0 border-t border-white/[0.06] lg:w-80 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2.5 px-5 py-3.5">
              <span className="text-base leading-none">{selectedInfo.flag}</span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[0.875rem] font-semibold text-slate-100">
                  {selectedInfo.nameKo}
                </h3>
                <p className="truncate text-[0.6875rem] text-slate-500">
                  {selectedInfo.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCountry(null)}
                aria-label="닫기"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-100"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <CardDivider />

            <div className="max-h-[24rem] overflow-y-auto lg:max-h-[26rem]">
              {isLoading && (
                <div className="space-y-4 px-5 py-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="shimmer space-y-1.5 rounded">
                      <div className="h-3 w-full rounded bg-white/[0.05]" />
                      <div className="h-3 w-4/5 rounded bg-white/[0.05]" />
                      <div className="h-2.5 w-1/3 rounded bg-white/[0.05]" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <p className="px-5 py-8 text-center text-[0.8125rem] text-red-400">{error}</p>
              )}

              {!isLoading && !error && news.length === 0 && (
                <p className="px-5 py-8 text-center text-[0.8125rem] text-slate-500">
                  이 국가의 뉴스를 찾을 수 없습니다
                </p>
              )}

              {!isLoading && news.length > 0 && (
                <div className="divide-y divide-white/[0.04]">
                  {news.map((item, idx) => (
                    <a
                      key={item.id || idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block px-5 py-3 transition-colors hover:bg-white/[0.025]"
                    >
                      {item.titleKo && (
                        <p className="line-clamp-2 text-[0.8125rem] font-medium leading-snug text-slate-100 transition-colors group-hover:text-blue-400">
                          {item.titleKo}
                        </p>
                      )}
                      <p
                        className={clsx(
                          'line-clamp-2 text-xs leading-snug',
                          item.titleKo
                            ? 'mt-1 text-slate-500'
                            : 'font-medium text-slate-100 transition-colors group-hover:text-blue-400'
                        )}
                      >
                        {item.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[0.6875rem] text-slate-500">
                        <span className="truncate">
                          {item.source?.nameKo || item.sourceId}
                        </span>
                        <span className="flex-shrink-0">
                          {formatRelativeTime(item.publishedAt)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
