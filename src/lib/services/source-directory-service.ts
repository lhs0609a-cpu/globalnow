import {
  DIRECTORY_SITES,
  DIRECTORY_GROUPS,
  DIRECTORY_COUNTRIES,
  groupDirectorySites,
  scopeOf,
} from '@/lib/constants/source-directory';
import {
  DirectoryGroup,
  DirectoryGroupId,
  DirectoryScope,
  DirectorySite,
  MediaLean,
} from '@/types/directory';

export type DirectoryFilters = {
  scope?: DirectoryScope;
  group?: string;
  country?: string;
  search?: string;
  freeOnly?: boolean;
  lean?: MediaLean;
};

export type DecoratedSite = DirectorySite & { countryFlag: string; countryKo: string };

export type DirectorySection = {
  group: DirectoryGroup;
  sites: DecoratedSite[];
};

const GROUP_IDS = new Set<string>(DIRECTORY_GROUPS.map(g => g.id));
const LEANS = new Set<string>(['progressive', 'center', 'conservative']);

export function isDirectoryGroupId(value: string): value is DirectoryGroupId {
  return GROUP_IDS.has(value);
}

export function isDirectoryScope(value: string): value is DirectoryScope {
  return value === 'kr' || value === 'global' || value === 'tools';
}

export function isMediaLean(value: string): value is MediaLean {
  return LEANS.has(value);
}

function decorate(site: DirectorySite): DecoratedSite {
  const country = DIRECTORY_COUNTRIES[site.country];
  return {
    ...site,
    countryFlag: country?.flag ?? '🌐',
    countryKo: country?.nameKo ?? site.country,
  };
}

function inScope(scope?: DirectoryScope) {
  return (site: DirectorySite) => !scope || scopeOf(site) === scope;
}

export function getDirectory(filters: DirectoryFilters = {}): DirectorySection[] {
  const { scope, group, country, search, freeOnly, lean } = filters;
  const needle = search?.trim().toLowerCase();

  let sites = DIRECTORY_SITES.filter(inScope(scope));

  if (group && isDirectoryGroupId(group)) {
    sites = sites.filter(s => s.group === group);
  }
  if (country) {
    sites = sites.filter(s => s.country === country);
  }
  if (freeOnly) {
    sites = sites.filter(s => s.free);
  }
  if (lean) {
    sites = sites.filter(s => s.lean === lean);
  }
  if (needle) {
    sites = sites.filter(s =>
      s.name.toLowerCase().includes(needle) ||
      s.nameKo.toLowerCase().includes(needle) ||
      s.url.toLowerCase().includes(needle) ||
      (s.note?.toLowerCase().includes(needle) ?? false)
    );
  }

  return groupDirectorySites(sites).map(section => ({
    group: section.group,
    sites: section.sites.map(decorate),
  }));
}

/** 필터 UI용 그룹 목록 — 해당 scope의 사이트 수를 함께 준다 */
export function getDirectoryGroupCounts(scope?: DirectoryScope) {
  const counts = new Map<DirectoryGroupId, number>();
  for (const site of DIRECTORY_SITES.filter(inScope(scope))) {
    counts.set(site.group, (counts.get(site.group) ?? 0) + 1);
  }
  return DIRECTORY_GROUPS.filter(g => counts.has(g.id)).map(group => ({
    ...group,
    count: counts.get(group.id) ?? 0,
  }));
}

/** 필터 UI용 국가 목록 — 사이트가 많은 순 */
export function getDirectoryCountries(scope?: DirectoryScope) {
  const counts = new Map<string, number>();
  for (const site of DIRECTORY_SITES.filter(inScope(scope))) {
    counts.set(site.country, (counts.get(site.country) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([code, count]) => ({
      code,
      count,
      flag: DIRECTORY_COUNTRIES[code]?.flag ?? '🌐',
      nameKo: DIRECTORY_COUNTRIES[code]?.nameKo ?? code,
    }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
}

export function getDirectoryStats(scope?: DirectoryScope) {
  const sites = DIRECTORY_SITES.filter(inScope(scope));
  return {
    totalSites: sites.length,
    totalGroups: new Set(sites.map(s => s.group)).size,
    totalCountries: new Set(sites.map(s => s.country)).size,
    freeSites: sites.filter(s => s.free).length,
    rssSites: sites.filter(s => s.rssUrl).length,
  };
}

/** 전체 규모 — 국내/해외 나눠서 */
export function getScopeCounts() {
  const kr = DIRECTORY_SITES.filter(s => scopeOf(s) === 'kr').length;
  const tools = DIRECTORY_SITES.filter(s => scopeOf(s) === 'tools').length;
  return {
    kr,
    tools,
    global: DIRECTORY_SITES.length - kr - tools,
    all: DIRECTORY_SITES.length,
  };
}
