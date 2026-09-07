'use client';

import { useState, useEffect } from 'react';
import { SiteLinkCard } from '@/components/sources/SiteLinkCard';
import { MediaLean } from '@/types/directory';
import { EmptyState } from '@/components/ui/EmptyState';

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
type ScopeCounts = { kr: number; global: number; tools: number; all: number };

type Scope = 'all' | 'kr' | 'global' | 'tools';

const leanFilters: { id: MediaLean; label: string; className: string }[] = [
  { id: 'progressive', label: '진보', className: 'bg-blue-400/15 text-blue-400' },
  { id: 'center', label: '중도', className: 'bg-fill text-slate-200' },
  { id: 'conservative', label: '보수', className: 'bg-red-400/15 text-red-400' },
];

/** 디렉토리 전용 필터 알약 — 종류가 많아 칩보다 더 작게 잡는다 */
function Pill({
  active,
  activeClassName = 'bg-fill text-slate-100',
  onClick,
  children,
}: {
  active: boolean;
  activeClassName?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 t-meta-sm font-medium transition-colors ${
        active ? activeClassName : 'text-slate-500 hover:bg-fill-weak hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

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
    { id: 'all', label: '전체', count: scopeCounts?.all },
    { id: 'tools', label: '유용한 도구', count: scopeCounts?.tools },
    { id: 'global', label: '해외 뉴스', count: scopeCounts?.global },
    { id: 'kr', label: '국내 뉴스', count: scopeCounts?.kr },
  ];

  return (
    <div className="space-y-4">
      {/* 국내 / 해외 */}
      <div className="inline-flex gap-1 rounded-lg border border-line bg-fill-subtle p-1">
        {scopeTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setScope(tab.id)}
            aria-pressed={scope === tab.id}
            className={`rounded-md px-3.5 py-1.5 t-body-sm font-medium transition-colors ${
              scope === tab.id
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`tnum ml-1.5 t-meta-sm ${
                  scope === tab.id ? 'text-slate-500' : 'text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-fill-weak sm:grid-cols-4">
          {[
            { label: '수록 사이트', value: stats.totalSites },
            { label: '카테고리', value: stats.totalGroups },
            { label: '국가·지역', value: stats.totalCountries },
            { label: '무료 열람', value: stats.freeSites },
          ].map(item => (
            <div key={item.label} className="bg-surface px-4 py-3">
              <div className="tnum t-headline-lg font-semibold tracking-tight text-slate-100">
                {item.value}
              </div>
              <div className="t-meta-sm text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + toggles */}
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="사이트 이름으로 검색 (예: 피그마, 로이터, 아카이브)"
          className="h-9 min-w-[12.5rem] flex-1 rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-500 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setFreeOnly(v => !v)}
          aria-pressed={freeOnly}
          className={`h-9 whitespace-nowrap rounded-lg px-3.5 text-[0.875rem] font-medium transition-colors ${
            freeOnly
              ? 'bg-emerald-400/15 text-emerald-400'
              : 'border border-line-strong bg-fill-subtle text-slate-400 hover:border-line-strong hover:text-slate-100'
          }`}
        >
          무료만
        </button>
      </div>

      {/* 성향 필터 — 도구에는 논조가 없다 */}
      <div className={`flex-wrap items-center gap-1 ${scope === 'tools' ? 'hidden' : 'flex'}`}>
        <span className="mr-1 t-meta-sm text-slate-500">보도 성향</span>
        {leanFilters.map(f => (
          <Pill
            key={f.id}
            active={activeLean === f.id}
            activeClassName={f.className}
            onClick={() => setActiveLean(prev => (prev === f.id ? null : f.id))}
          >
            {f.label}
          </Pill>
        ))}
      </div>

      {/* Category filter */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto">
        <Pill active={activeGroup === 'all'} onClick={() => setActiveGroup('all')}>
          전체
        </Pill>
        {groups.map(group => (
          <Pill
            key={group.id}
            active={activeGroup === group.id}
            onClick={() => setActiveGroup(group.id)}
          >
            {group.label}
            <span className="tnum ml-1 text-slate-600">{group.count}</span>
          </Pill>
        ))}
      </div>

      {/* Country filter — 국내만 볼 때는 의미가 없어 숨긴다 */}
      {scope !== 'kr' && countries.length > 1 && (
        <div className="scrollbar-hide flex gap-1 overflow-x-auto">
          <Pill active={activeCountry === 'all'} onClick={() => setActiveCountry('all')}>
            전체
          </Pill>
          {countries.map(country => (
            <Pill
              key={country.code}
              active={activeCountry === country.code}
              onClick={() => setActiveCountry(country.code)}
            >
              {country.flag} {country.nameKo}
              <span className="tnum ml-1 text-slate-600">{country.count}</span>
            </Pill>
          ))}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="shimmer h-3.5 w-32 rounded bg-fill-weak" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div
                    key={j}
                    className="shimmer h-[4.5rem] surface rounded-lg"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : sections.length === 0 ? (
        <EmptyState
          title="조건에 맞는 사이트가 없습니다"
          description="검색어나 필터를 바꿔 보세요"
        />
      ) : (
        <div className="space-y-6">
          {sections.map(section => (
            <section key={section.group.id}>
              <div className="mb-2 flex items-baseline gap-2">
                <h2 className="t-title font-semibold text-slate-100">
                  {section.group.label}
                </h2>
                <span className="truncate t-meta-sm text-slate-500">
                  {section.group.description}
                </span>
                <span className="tnum ml-auto flex-shrink-0 t-meta-sm text-slate-600">
                  {section.sites.length}곳
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {section.sites.map(site => (
                  <SiteLinkCard key={site.id} {...site} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!isLoading && shownCount > 0 && (
        <p className="text-center t-meta-sm text-slate-600">
          총 {shownCount}개 사이트 표시 중
        </p>
      )}
    </div>
  );
}
