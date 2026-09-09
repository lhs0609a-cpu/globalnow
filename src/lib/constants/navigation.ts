import type { IconName } from '@/components/ui/Icon';
export type NavItem = { href:string;label:string;shortLabel?:string;icon:IconName;primary?:boolean;group:'monitor'|'research' };
export const NAV_ITEMS:NavItem[] = [
  {href:'/',label:'세계 상황판',shortLabel:'상황판',icon:'globe',primary:true,group:'monitor'},
  {href:'/markets',label:'글로벌 시장',shortLabel:'시장',icon:'chart',primary:true,group:'monitor'},
  {href:'/brief',label:'의사결정 브리프',shortLabel:'브리프',icon:'brief',primary:true,group:'monitor'},
  {href:'/saved',label:'저장한 근거',shortLabel:'저장',icon:'bookmark',primary:true,group:'monitor'},
  {href:'/news',label:'뉴스 검색',icon:'search',group:'research'},
  {href:'/compare',label:'지역 비교',icon:'compare',group:'research'},
  {href:'/watchdog',label:'관심 종목 뉴스',icon:'watchdog',group:'research'},
  {href:'/signals',label:'기업·기술 신호',icon:'signals',group:'research'},
  {href:'/reports',label:'산업 리서치',icon:'reports',group:'research'},
  {href:'/events',label:'의사결정·산업 일정',icon:'events',group:'research'},
  {href:'/sources',label:'출처·분류 기준',icon:'media',group:'research'},
];
export const ACCOUNT_ITEMS:NavItem[] = [{href:'/settings',label:'설정',icon:'settings',group:'monitor'}];
export const NAV_GROUPS:{id:NavItem['group'];label:string}[] = [{id:'monitor',label:'상황 모니터'},{id:'research',label:'의사결정 리서치'}];
export const PRIMARY_NAV_ITEMS=NAV_ITEMS.filter(item=>item.primary);
export const SECONDARY_NAV_ITEMS=NAV_ITEMS.filter(item=>!item.primary);
