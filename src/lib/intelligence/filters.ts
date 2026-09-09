import { REGIONS, THEMES } from './model';
export function parseBoardFilters(params: Record<string,string|string[]|undefined>) {
  const get = (key:string) => typeof params[key] === 'string' ? params[key] as string : '';
  return { country: REGIONS.some(c=>c[0]===get('country')) ? get('country') : '', topic: THEMES.some(t=>t.id===get('topic')) ? get('topic') : '', hours: ['24','72','168'].includes(get('hours')) ? get('hours') : '24', view:get('view')==='monitor'?'monitor':'all', search:get('search').trim().slice(0,200) };
}
