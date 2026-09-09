'use client';
import { useState } from 'react';
import { useNow } from '@/hooks/useNow';
import { PageHeader } from '@/components/layout/AppShell';
import { useResource } from '@/hooks/useResource';
import { THEMES, inWindow, type IntelligenceSnapshot, type Signal } from '@/lib/intelligence/model';
import { SignalDetail } from './SignalDetail';
import { BookmarkButton } from '@/components/news/BookmarkButton';
const INDUSTRIES = [
  {id:'semiconductor',label:'반도체',terms:/semiconductor|chip|TSMC|NVIDIA|ASML|반도체|파운드리/i},
  {id:'ai',label:'AI·클라우드',terms:/\bAI\b|OpenAI|cloud|data center|인공지능|클라우드|데이터센터/i},
  {id:'energy',label:'에너지·자원',terms:/energy|oil|gas|copper|lithium|에너지|원유|석유|가스|구리|리튬/i},
  {id:'mobility',label:'자동차·배터리',terms:/automotive|vehicle|battery|Tesla|BYD|자동차|배터리|전기차/i},
  {id:'finance',label:'금융',terms:/bank|financ|interest rate|Fed|은행|금융|금리|연준/i},
  {id:'logistics',label:'무역·물류',terms:/trade|shipping|tariff|logistics|무역|물류|관세|항만|공급망/i},
  {id:'health',label:'바이오·의료',terms:/pharma|biotech|FDA|clinical|바이오|의약|제약|임상/i},
  {id:'defense',label:'방산·안보',terms:/defense|military|missile|방산|군사|미사일|국방/i},
];
export function IndustryResearch() {
  const {data,error,isLoading,refresh}=useResource<IntelligenceSnapshot>('/api/intelligence');
  const [industry,setIndustry]=useState('semiconductor');
  const [detail,setDetail]=useState<Signal|null>(null);
  const active=INDUSTRIES.find(i=>i.id===industry)!;
  const now=useNow();
  const signals=(data?.signals||[]).filter(s=>inWindow(s,168,now)&&active.terms.test([s.news.title,s.news.titleKo,s.news.summary,s.news.summaryKo].join(' ')));
  return <div><PageHeader title="산업 리서치" description="최근 7일의 수집 범위에서 산업별 근거를 모으고, 비용·수요·공급·규제의 변화 가능성을 검토합니다." />
    <div className="flex flex-wrap gap-2 mb-5">{INDUSTRIES.map(i=><button className="intel-chip" key={i.id} aria-pressed={i.id===industry} onClick={()=>setIndustry(i.id)}>{i.label}</button>)}</div>
    {data?.mode==='demo'&&<p className="intel-notice">샘플 자료입니다. 실제 산업 전망이나 분석 보고서가 아닙니다.</p>}
    {error&&<div role="alert" className="intel-notice">{error}<button className="action-text" onClick={()=>void refresh()}>다시 시도</button></div>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="intel-panel"><div className="intel-panel-heading"><h2>{active.label} · 근거 목록</h2><span>{signals.length}건 · 최근 7일</span></div>
      {isLoading&&!data&&<p role="status" className="p-5">산업 자료를 불러오고 있습니다…</p>}
      {signals.map(s=><article className="p-5 border-b border-line" key={s.id}><button className="intel-signal-title" onClick={()=>setDetail(s)}>{s.news.titleKo||s.news.title}</button><p className="t-body-sm text-slate-400 mt-2">{s.news.summaryKo||s.news.summary||'요약 미제공. 원문 확인 필요.'}</p><div className="flex flex-wrap items-center justify-between mt-3 gap-2"><span className="t-meta text-slate-500">{s.news.source?.nameKo||s.news.sourceId}</span><BookmarkButton news={s.news}/><a className="action-text" href={s.news.url} target="_blank" rel="noopener noreferrer">원문 ↗</a></div></article>)}
      {data&&!signals.length&&<div className="intel-empty"><h3>해당 산업의 분류된 기사가 없습니다</h3><p>조용한 산업이라는 결론을 내릴 수 없습니다. 다른 산업이나 뉴스 검색을 확인하세요.</p></div>}
    </section><aside className="intel-panel p-5"><h2 className="t-title">검토 프레임</h2><p className="t-body-sm text-slate-500 mt-2">산업 전망을 확정하기 전에 확인할 질문입니다.</p>{THEMES.filter(t=>['technology','trade','policy','macro'].includes(t.id)).map(t=><div className="intel-check" key={t.id}><h3 className="t-label">{t.channel}</h3><p className="t-body-sm mt-2 text-slate-300">{t.check}</p></div>)}</aside></div>
    {detail&&<SignalDetail signal={detail} mode={data?.mode||''} onClose={()=>setDetail(null)}/>}
  </div>;
}
