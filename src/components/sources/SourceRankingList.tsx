'use client';

import { useState, useEffect } from 'react';
import { SourceRankCard } from '@/components/sources/SourceRankCard';
import { MediaTier, TIER_LABELS } from '@/lib/constants/media-rankings';

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
      <div className="flex gap-2">
        {tierTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTier(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTier === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Country filter — horizontal scroll */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setActiveCountry('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            activeCountry === 'all'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
          }`}
        >
          🌐 전체
        </button>
        {countries.map(c => (
          <button
            key={c.code}
            onClick={() => setActiveCountry(c.code)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCountry === c.code
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
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
            <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sources.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-white font-semibold mb-1">해당하는 매체가 없습니다</h3>
          <p className="text-slate-400 text-sm">필터를 변경해 보세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map(source => (
            <SourceRankCard key={source.sourceId} {...source} />
          ))}
        </div>
      )}

      {/* Stats */}
      {!isLoading && sources.length > 0 && (
        <div className="text-slate-500 text-xs text-center">
          총 {sources.length}개 매체 표시 중
        </div>
      )}
    </div>
  );
}
