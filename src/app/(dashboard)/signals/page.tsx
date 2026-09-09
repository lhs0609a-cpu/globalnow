'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/AppShell';
import { useResource } from '@/hooks/useResource';
type Signal={id:string;type:string;title:string;titleKo?:string;description?:string;descriptionKo?:string;source:string;sourceUrl:string;detectedAt:string;company?:string;ticker?:string};
type Result={signals:Signal[];total:number;hasMore:boolean;isLive?:boolean};
const TYPES=[['all','전체'],['sec_filing','기업 공시'],['insider_trade','내부자 거래'],['patent','특허'],['executive_move','임원 이동']];
export default function SignalsPage(){
  const [type,setType]=useState('all');
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const params=new URLSearchParams({type,company:search,page:String(page),limit:'20'});
  const {data,error,isLoading,refresh}=useResource<Result>('/api/signals?'+params,250);
  return <div><PageHeader title="기업·기술 신호" description="기업 공시·특허·인사 관련 자료를 찾아 원문으로 확인합니다. 감지된 신호만으로 투자 판단을 확정하지 마세요."/>
    <div className="intel-toolbar"><div className="flex flex-wrap gap-2">{TYPES.map(([id,label])=><button className="intel-chip" key={id} aria-pressed={type===id} onClick={()=>{setType(id);setPage(1);}}>{label}</button>)}</div><label>기업 검색<input className="intel-input" value={search} maxLength={100} onChange={e=>{setSearch(e.target.value);setPage(1);}} /></label></div>
    {data&&<p className={data.isLive?'t-body-sm text-slate-400 mb-4':'intel-notice'}>{data.isLive?'공개 수집 자료입니다. 탐지 분류와 정확한 거래·공시 내용은 원문에서 확인하세요.':'샘플 자료입니다. 실제 기업 활동으로 해석하지 마세요.'}</p>}
    {error&&<div role="alert" className="intel-notice">{error}<button className="action-text" onClick={()=>void refresh()}>다시 시도</button></div>}
    {isLoading&&!data&&<p role="status" className="p-6">기업 자료를 불러오고 있습니다…</p>}
    {data&&<section className="intel-panel"><div className="intel-panel-heading"><h2>수집된 근거</h2><span>{data.total}건</span></div>{data.signals.map(s=><article className="p-5 border-b border-line" key={s.id}><div className="intel-tags mb-2"><span>{TYPES.find(t=>t[0]===s.type)?.[1]||s.type}</span><span>{s.company||s.ticker}</span><span>{s.source}</span></div><h3 className="t-headline-sm">{s.titleKo||s.title}</h3><p className="t-body-sm text-slate-400 mt-2">{s.descriptionKo||s.description}</p>{/^https?:\/\//i.test(s.sourceUrl)&&<a className="action-text mt-2" href={s.sourceUrl} target="_blank" rel="noopener noreferrer">공개 원문 확인 ↗</a>}</article>)}{!data.signals.length&&<div className="intel-empty"><h3>조건에 맞는 자료가 없습니다</h3><p>검색어나 자료 종류를 변경해 보세요.</p></div>}</section>}
    <div className="flex justify-between items-center mt-5"><button className="action-secondary" disabled={page===1||isLoading} onClick={()=>setPage(v=>v-1)}>이전</button><span className="t-body-sm">{page} 페이지</span><button className="action-secondary" disabled={!data?.hasMore||isLoading} onClick={()=>setPage(v=>v+1)}>다음</button></div>
  </div>;
}
