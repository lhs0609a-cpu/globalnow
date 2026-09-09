'use client';
import { useState } from 'react';
import { useNow } from '@/hooks/useNow';
import { useResource } from '@/hooks/useResource';
import { REGIONS, THEMES, inWindow, type IntelligenceSnapshot, type Signal } from '@/lib/intelligence/model';
import { SignalDetail } from './SignalDetail';
import { PageHeader } from '@/components/layout/AppShell';
export function RegionCompare() {
  const {data,error,isLoading,refresh}=useResource<IntelligenceSnapshot>('/api/intelligence');
  const [countries,setCountries]=useState(['US','CN','KR']);
  const [hours,setHours]=useState('72');
  const [detail,setDetail]=useState<Signal|null>(null);
  const now=useNow();
  return <div><PageHeader title="지역 비교" description="동일한 기간과 분류 기준으로 지역별 보도와 확인 과제를 나란히 봅니다. 기사 건수는 국가 위험 순위가 아닙니다." />
    <div className="intel-toolbar"><label>비교 기간<select className="intel-input" value={hours} onChange={e=>setHours(e.target.value)}><option value="24">최근 24시간</option><option value="72">최근 72시간</option><option value="168">최근 7일</option></select></label><button className="action-secondary" onClick={()=>void refresh()} disabled={isLoading}>새로고침</button></div>
    {data?.mode==='demo' && <p className="intel-notice">샘플 데이터입니다. 실제 국가 상황 비교가 아닙니다.</p>}
    {error && <p role="alert" className="intel-notice">{error}</p>}
    {isLoading && !data && <p role="status" className="p-6">비교 자료를 불러오고 있습니다…</p>}
    <div className="grid gap-4 xl:grid-cols-3">{countries.map((country,index)=>{
      const signals=(data?.signals||[]).filter(s=>s.countries.includes(country)&&inWindow(s,Number(hours),now));
      return <section className="intel-panel" key={index}><div className="p-4 border-b border-line"><label className="t-label">비교 지역 {index+1}<select className="intel-input mt-2 w-full" value={country} onChange={e=>setCountries(old=>old.map((c,i)=>i===index?e.target.value:c))}>{REGIONS.map(c=><option key={c[0]} value={c[0]} disabled={countries.includes(c[0])&&c[0]!==country}>{c[1]}</option>)}</select></label></div>
        <div className="p-5"><p className="t-headline-lg tnum">{data ? signals.length : '—'}<span className="t-body-sm text-slate-400">건 · 언급된 상황</span></p><p className="t-body-sm text-amber-400 mt-2">우선 확인 키워드 {data ? signals.filter(s=>s.urgent).length : '—'}건</p>
          <dl className="my-5 divide-y divide-line">{THEMES.map(t=><div className="flex justify-between gap-3 py-2 t-body-sm" key={t.id}><dt>{t.label}</dt><dd className="tnum">{signals.filter(s=>s.themes.includes(t.id)).length}</dd></div>)}</dl>
          <h2 className="t-title">주요 보도 근거</h2>{signals.slice(0,5).map(s=><button className="block w-full text-left py-3 border-b border-line t-body-sm hover:text-accent-text" key={s.id} onClick={()=>setDetail(s)}>{s.news.titleKo||s.news.title}<span className="block mt-1 t-meta text-slate-500">{s.news.source?.nameKo||s.news.sourceId} ↗</span></button>)}
          {data&&!signals.length&&<p className="t-body-sm text-slate-500 mt-3">분류된 보도가 없습니다. 수집 범위의 공백일 수 있습니다.</p>}
        </div></section>;
    })}</div>
    <p className="t-body-sm text-slate-400 mt-5">하나의 기사가 여러 지역과 주제에 중복 집계될 수 있습니다. 출처 소재지는 지역 분류에 사용하지 않습니다.</p>
    {detail&&<SignalDetail signal={detail} mode={data?.mode||''} onClose={()=>setDetail(null)} />}
  </div>;
}
