'use client';

import { useState, useEffect } from 'react';
import { SourceRankCard } from '@/components/sources/SourceRankCard';
import { MediaTier, TIER_LABELS } from '@/lib/constants/media-rankings';
import { FilterChip } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

type RankedSourceData = {
  sourceId: string;
  name: string;
  nameKo: string;
  countryFlag: string;
  country: string;
  category: string;
  reliability: number;
  tier: MediaTier;
  globalRank: number;
  description: string;
  descriptionKo: string;
  foundedYear: number;
  monthlyReach: string;
  url: string;
};

type CountryInfo = { code: string; flag: string; name: string };

const tierTabs = [
  { id: 'all', label: '전체' },
  { id: '1', label: '1등급', color: TIER_LABELS[1].color },
  { id: '2', label: '2등급', color: TIER_LABELS[2].color },
  { id: '3', label: '3등급', color: TIER_LABELS[3].color },
];

export function SourceRankingList() {
  const [sources, setSources] = useState<RankedSourceData[]>([]);
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [activeTier, setActiveTier] = useState('all');
  const [activeCountry, setActiveCountry] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTier !== 'all') params.set('tier', activeTier);
        if (activeCountry !== 'all') params.set('country', activeCountry);
        const url = `/api/sources${params.toString() ? '?' + params.toString() : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setSources(data.sources || []);
        if (data.countries) setCountries(data.countries);
      } catch (error) {
        console.error('Failed to fetch sources:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSources();
  }, [activeTier, activeCountry]);

  return (
    <div className="space-y-5">
      {/* Tier filter tabs */}
      <div className="flex gap-1">
        {tierTabs.map(tab => (
          <FilterChip
            key={tab.id}
            active={activeTier === tab.id}
            onClick={() => setActiveTier(tab.id)}
          >
            {tab.label}
          </FilterChip>
        ))}
      </div>

      {/* Country filter — horizontal scroll */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveCountry('all')}
          aria-pressed={activeCountry === 'all'}
          className={`flex-shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
            activeCountry === 'all'
              ? 'bg-white/[0.09] text-slate-100'
              : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
          }`}
        >
          전체
        </button>
        {countries.map(c => (
          <button
            key={c.code}
            type="button"
            onClick={() => setActiveCountry(c.code)}
            aria-pressed={activeCountry === c.code}
            className={`flex-shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              activeCountry === c.code
                ? 'bg-white/[0.09] text-slate-100'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
            }`}
          >
            {c.flag} {c.code}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-slate-800 p-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="shimmer h-6 w-7 rounded bg-white/[0.05]" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-3.5 w-1/3 rounded bg-white/[0.05]" />
                  <div className="shimmer h-3 w-2/3 rounded bg-white/[0.05]" />
                  <div className="shimmer h-3 w-1/2 rounded bg-white/[0.05]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sources.length === 0 ? (
        <EmptyState title="해당하는 매체가 없습니다" description="필터를 변경해 보세요" />
      ) : (
        <div className="space-y-3">
          {sources.map(source => (
            <SourceRankCard key={source.sourceId} {...source} />
          ))}
        </div>
      )}

      {/* Stats */}
      {!isLoading && sources.length > 0 && (
        <p className="text-center text-[0.6875rem] text-slate-600">
          총 {sources.length}개 매체 표시 중
        </p>
      )}
    </div>
  );
}
