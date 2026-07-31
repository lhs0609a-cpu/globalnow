'use client';

import { useState, useEffect } from 'react';
import { SiteLinkCard } from '@/components/sources/SiteLinkCard';
import { MediaLean } from '@/types/directory';

type DirectorySiteData = {
  id: string;
  name: string;
  nameKo: string;
  url: string;
  countryFlag: string;
  countryKo: string;
  note?: string;
  free?: boolean;
  rssUrl?: string;
  lean?: MediaLean;
};

type Section = {
  group: { id: string; label: string; labelEn: string; icon: string; description: string };
  sites: DirectorySiteData[];
};

type GroupOption = { id: string; label: string; icon: string; count: number };
type CountryOption = { code: string; flag: string; nameKo: string; count: number };
type Stats = { totalSites: number; totalGroups: number; totalCountries: number; freeSites: number; rssSites: number };
type ScopeCounts = { kr: number; global: number; all: number };

type Scope = 'all' | 'kr' | 'global';

const leanFilters: { id: MediaLean; label: string; className: string }[] = [
  { id: 'progressive', label: '🔵 진보', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'center', label: '⚪ 중도', className: 'bg-slate-500/20 text-slate-200 border-slate-500/30' },
  { id: 'conservative', label: '🔴 보수', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
];

export function SourceDirectory() {
  const [sections, setSections] = useState<Section[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [scopeCounts, setScopeCounts] = useState<ScopeCounts | null>(null);

  const [scope, setScope] = useState<Scope>('all');
  const [activeGroup, setActiveGroup] = useState('all');
  const [activeCountry, setActiveCountry] = useState('all');
  const [activeLean, setActiveLean] = useState<MediaLean | null>(null);
  const [freeOnly, setFreeOnly] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 타이핑이 멈춘 뒤에만 요청한다
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // scope가 바뀌면 하위 필터는 의미를 잃으므로 초기화한다
  useEffect(() => {
    setActiveGroup('all');
    setActiveCountry('all');
  }, [scope]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDirectory() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (scope !== 'all') params.set('scope', scope);
        if (activeGroup !== 'all') params.set('group', activeGroup);
        if (activeCountry !== 'all') params.set('country', activeCountry);
        if (activeLean) params.set('lean', activeLean);
        if (freeOnly) params.set('free', '1');
        if (search) params.set('q', search);

        const res = await fetch(`/api/sources/directory?${params.toString()}`);
        const data = await res.json();
        if (cancelled) return;

        setSections(data.sections || []);
        if (data.groups) setGroups(data.groups);
        if (data.countries) setCountries(data.countries);
        if (data.stats) setStats(data.stats);
        if (data.scopeCounts) setScopeCounts(data.scopeCounts);
      } catch (error) {
        console.error('Failed to fetch source directory:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchDirectory();
    return () => {
      cancelled = true;
    };
  }, [scope, activeGroup, activeCountry, activeLean, freeOnly, search]);

  const shownCount = sections.reduce((sum, section) => sum + section.sites.length, 0);
  const scopeTabs: { id: Scope; label: string; count?: number }[] = [
    { id: 'all', label: '🌏 전체', count: scopeCounts?.all },
    { id: 'kr', label: '🇰🇷 국내', count: scopeCounts?.kr },
    { id: 'global', label: '🌐 해외', count: scopeCounts?.global },
  ];

  return (
    <div className="space-y-5">
      {/* 국내 / 해외 */}
      <div className="flex gap-1 bg-slate-800/60 p-1 rounded-lg w-fit">
        {scopeTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setScope(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              scope === tab.id ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 text-xs ${scope === tab.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: '수록 사이트', value: stats.totalSites },
            { label: '카테고리', value: stats.totalGroups },
            { label: '국가·지역', value: stats.totalCountries },
            { label: '무료 열람', value: stats.freeSites },
          ].map(item => (
            <div key={item.label} className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/50">
              <div className="text-white text-lg font-bold">{item.value}</div>
              <div className="text-slate-400 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + toggles */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="search"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="사이트 이름으로 검색 (예: 한겨레, 로이터, 네이처)"
          className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => setFreeOnly(v => !v)}
          className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
            freeOnly
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
          }`}
        >
          무료만
        </button>
      </div>

      {/* 성향 필터 */}
      <div className="flex gap-1.5 items-center flex-wrap">
        <span className="text-slate-500 text-xs mr-1">보도 성향</span>
        {leanFilters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveLean(prev => (prev === f.id ? null : f.id))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              activeLean === f.id
                ? f.className
                : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
        {activeLean && (
          <button onClick={() => setActiveLean(null)} className="text-slate-500 text-xs hover:text-white underline">
            해제
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setActiveGroup('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
            activeGroup === 'all'
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
          }`}
        >
          🗂 전체
        </button>
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              activeGroup === group.id
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            {group.icon} {group.label} <span className="text-slate-500">{group.count}</span>
          </button>
        ))}
      </div>

      {/* Country filter — 국내만 볼 때는 의미가 없어 숨긴다 */}
      {scope !== 'kr' && countries.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveCountry('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              activeCountry === 'all'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            🌐 전체
          </button>
          {countries.map(country => (
            <button
              key={country.code}
              onClick={() => setActiveCountry(country.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                activeCountry === country.code
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {country.flag} {country.nameKo} <span className="text-slate-500">{country.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-20 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-white font-semibold mb-1">조건에 맞는 사이트가 없습니다</h3>
          <p className="text-slate-400 text-sm">검색어나 필터를 바꿔 보세요</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(section => (
            <section key={section.group.id}>
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-white font-semibold">
                  {section.group.icon} {section.group.label}
                </h2>
                <span className="text-slate-500 text-xs">{section.group.description}</span>
                <span className="text-slate-600 text-xs ml-auto">{section.sites.length}곳</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {section.sites.map(site => (
                  <SiteLinkCard key={site.id} {...site} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!isLoading && shownCount > 0 && (
        <div className="text-slate-500 text-xs text-center">총 {shownCount}개 사이트 표시 중</div>
      )}
    </div>
  );
}
