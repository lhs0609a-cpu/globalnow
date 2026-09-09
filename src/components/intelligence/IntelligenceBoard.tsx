'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useResource } from '@/hooks/useResource';
import { useMonitorProfile } from '@/hooks/useMonitorProfile';
import { THEMES, REGIONS, countryName, inWindow, matchesProfile, briefMarkdown, type IntelligenceSnapshot, type Signal } from '@/lib/intelligence/model';
import { MarketStrip } from './MarketStrip';
import { MonitorEditor } from './MonitorEditor';
import { SignalDetail } from './SignalDetail';
import { BookmarkButton } from '@/components/news/BookmarkButton';
import { Icon } from '@/components/ui/Icon';

const IntelligenceMap = dynamic(() => import('./IntelligenceMap'), { ssr:false, loading: () => <div className="intel-map-loading" role="status">세계 지도 준비 중…</div> });
export type BoardFilters = { country: string; topic: string; hours: string; view: string; search: string };
export const DEFAULT_FILTERS: BoardFilters = { country:'', topic:'', hours:'24', view:'all', search:'' };
export function IntelligenceBoard({ filters = DEFAULT_FILTERS, briefing = false }: { filters?: BoardFilters; briefing?: boolean }) {
  const router = useRouter();
  const { data, error, isLoading, refresh } = useResource<IntelligenceSnapshot>('/api/intelligence');
  const { profile, save } = useMonitorProfile();
  const [editor, setEditor] = useState(false);
  const [detail, setDetail] = useState<Signal | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [auto, setAuto] = useState(false);
  const [limit, setLimit] = useState(15);
  const [notice, setNotice] = useState('');
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()),60000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (!auto) return; const timer = setInterval(() => { if (document.visibilityState === 'visible') void refresh(); },120000); return () => clearInterval(timer); }, [auto,refresh]);
  const update = (next: Partial<BoardFilters>) => {
    const values = { ...filters, ...next };
    const params = new URLSearchParams();
    for (const [key,value] of Object.entries(values)) if (value && value !== DEFAULT_FILTERS[key as keyof BoardFilters]) params.set(key,value);
    setLimit(15);
    router.push((briefing ? '/brief' : '/') + (params.size ? '?' + params : ''), { scroll:false });
  };
  const period = useMemo(() => (data?.signals || []).filter(s => inWindow(s,Number(filters.hours),now)), [data,filters.hours,now]);
  const scope = useMemo(() => period.filter(s => (!filters.topic || s.themes.some(t => t === filters.topic)) && (filters.view !== 'monitor' || matchesProfile(s,profile)) && (!filters.search || [s.news.title,s.news.titleKo,s.news.summary,s.news.summaryKo].join(' ').toLowerCase().includes(filters.search.toLowerCase()))), [period,filters.topic,filters.view,filters.search,profile]);
  const selected = scope.filter(s => !filters.country || s.countries.includes(filters.country));
  const ranked = [...selected].sort((a,b) => Number(b.urgent) - Number(a.urgent) || (Date.parse(b.news.publishedAt)||0) - (Date.parse(a.news.publishedAt)||0));
  const counts: Record<string,number> = {};
  for (const signal of scope) for (const country of signal.countries) counts[country] = (counts[country]||0)+1;
  const hasProfile = Boolean(profile.countries.length || profile.themes.length || profile.keywords.trim());
  const monitoring = period.filter(s => matchesProfile(s,profile));
  const scopeLabel = [filters.hours + '시간',filters.country ? countryName(filters.country) : '전체 지역',THEMES.find(t=>t.id===filters.topic)?.label || '전체 주제',filters.view==='monitor' ? '내 모니터' : '전체 상황',filters.search ? '검색: '+filters.search : ''].filter(Boolean).join(' · ');
  const exportBrief = () => {
    if (!data) return;
    const url = URL.createObjectURL(new Blob([briefMarkdown(ranked,data,scopeLabel)],{type:'text/markdown;charset=utf-8'}));
    const link = document.createElement('a'); link.href=url; link.download='globalnow-decision-brief.md'; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000); setNotice('현재 필터의 브리프를 내보냈습니다.');
  };
  return <div className="intel-board">
    <header className="intel-heading">
      <div><p className="intel-eyebrow">GLOBALNOW / DECISION INTELLIGENCE</p><h1>{briefing ? '의사결정 브리프' : '세계 상황판'}</h1><p className="t-body-sm text-slate-400">{briefing ? '판단에 필요한 변화, 근거, 확인 과제를 한 문서로.' : '세계의 변화에서 사업과 투자의 다음 확인 지점까지.'}</p></div>
      <div className="flex flex-wrap gap-2"><button className="action-secondary" onClick={()=>setEditor(true)}><Icon name="watchdog" className="h-4 w-4" />내 모니터 설정</button><button className="action-primary" onClick={exportBrief} disabled={!data || !ranked.length}><Icon name="brief" className="h-4 w-4" />브리프 내보내기</button></div>
    </header>
    {!briefing && <MarketStrip />}
    <div className="intel-statusbar">
      <span className={data?.mode === 'demo' ? 'text-amber-400' : 'text-slate-300'}>{data ? data.mode === 'demo' ? '샘플 모드 · 실제 세계 상황이 아닙니다' : data.mode === 'stored' ? '저장 자료 · 최신성 확인 필요' : 'RSS 수집 자료 · 실시간 속보 피드 아님' : '상황 데이터 연결 중'}</span>
      <span className="tnum">{data && '조회 ' + new Date(data.retrievedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}) + ' KST'}</span>
      <div className="flex items-center gap-3"><label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)} />2분 자동 갱신</label><button className="intel-small-button" onClick={()=>void refresh()} disabled={isLoading}>새로고침</button></div>
    </div>
    {error && <div role="alert" className="intel-notice">{error} {data && '이전 조회 자료를 표시하고 있습니다.'}<button className="action-text" onClick={()=>void refresh()}>다시 시도</button></div>}
    <section className="intel-toolbar" aria-label="상황 필터">
      <div className="intel-segment"><button aria-pressed={filters.view==='all'} onClick={()=>update({view:'all'})}>전체 상황</button><button aria-pressed={filters.view==='monitor'} onClick={()=>update({view:'monitor'})}>내 모니터 <span className="tnum">{monitoring.length}</span></button></div>
      <label>기간<select aria-label="기간" className="intel-input" value={filters.hours} onChange={e=>update({hours:e.target.value})}><option value="24">최근 24시간</option><option value="72">최근 72시간</option><option value="168">최근 7일</option></select></label>
      <label>지역<select aria-label="지역" className="intel-input" value={filters.country} onChange={e=>update({country:e.target.value})}><option value="">전체 지역</option>{REGIONS.map(c=><option key={c[0]} value={c[0]}>{c[1]} · {counts[c[0]] || 0}건</option>)}</select></label>
      <label>주제<select aria-label="주제" className="intel-input" value={filters.topic} onChange={e=>update({topic:e.target.value})}><option value="">전체 주제</option>{THEMES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></label>
      {(filters.country || filters.topic || filters.search || filters.view!=='all' || filters.hours!=='24') && <button className="action-text" onClick={()=>update(DEFAULT_FILTERS)}>필터 초기화</button>}
    </section>
    {filters.search && <p className="t-body-sm mb-3">검색: <strong>{filters.search}</strong></p>}
    {filters.view==='monitor' && !hasProfile && <div className="intel-empty"><h2>내 사업과 투자에 맞는 시야를 만드세요</h2><p>관심 지역·주제·기업 키워드를 설정하면 관련 상황만 모아볼 수 있습니다.</p><button className="action-primary" onClick={()=>setEditor(true)}>관심 범위 설정</button></div>}
    <div className="intel-kpis" aria-label="조회 범위 요약">
      <div><span>확인할 상황</span><strong>{data ? ranked.length : '—'}<small>건</small></strong></div>
      <div><span>우선 확인 키워드</span><strong>{data ? ranked.filter(s=>s.urgent).length : '—'}<small>건</small></strong></div>
      <div><span>언급 지역</span><strong>{data ? new Set(selected.flatMap(s=>s.countries)).size : '—'}<small>개</small></strong></div>
      <div><span>내 관심과 일치</span><strong>{data ? selected.filter(s=>matchesProfile(s,profile)).length : '—'}<small>건</small></strong></div>
    </div>
    {!briefing && <div className="intel-overview-grid">
      <section className="intel-panel" aria-labelledby="situation-map-heading"><div className="intel-panel-heading"><h2 id="situation-map-heading">세계의 변화</h2><span>기사 언급 기준 · 자동 분류</span></div>
        <IntelligenceMap counts={counts} selected={filters.country} onSelect={country=>update({country})} />
        <div className="intel-region-strip" aria-label="언급 지역 빠른 선택">{REGIONS.filter(c=>counts[c[0]]>0).sort((a,b)=>counts[b[0]]-counts[a[0]]).slice(0,8).map(c=><button className="intel-chip" aria-pressed={filters.country===c[0]} key={c[0]} onClick={()=>update({country:filters.country===c[0]?'':c[0]})}>{c[1]} <span className="tnum">{counts[c[0]]}</span></button>)}
          {data && !Object.keys(counts).length && <p className="t-body-sm text-slate-500">선택 범위에서 지역을 분류할 수 있는 기사가 없습니다.</p>}</div>
      </section>
      <section className="intel-panel" aria-labelledby="priority-heading"><div className="intel-panel-heading"><h2 id="priority-heading">먼저 확인할 변화</h2><span>{scopeLabel}</span></div>
        {isLoading && !data && <p role="status" className="p-5 t-body-sm">주요 상황을 불러오고 있습니다…</p>}
        {ranked.slice(0,3).map((signal,index)=><button key={signal.id} className="intel-priority" onClick={()=>setDetail(signal)}><span className="intel-priority-number">0{index+1}</span><span><span className={signal.urgent?'intel-flag':'intel-neutral-flag'}>{signal.urgent?'우선 확인':'동향 확인'}</span><strong>{signal.news.titleKo || signal.news.title}</strong><small>{signal.countries.map(countryName).join(' · ') || '지역 미분류'} / {signal.news.source?.nameKo || signal.news.sourceId}</small></span><Icon name="arrowUpRight" className="h-4 w-4 shrink-0" /></button>)}
        {data && !ranked.length && <p className="p-5 t-body-sm text-slate-500">선택 범위의 상황이 없습니다. 기간이나 관심 범위를 변경해 보세요.</p>}
        <div className="intel-method-note">우선순위는 중단·제재 관련 키워드와 게시 시각 기준입니다. 위험 점수·영향 예측이 아닙니다.</div>
      </section>
    </div>}
    <section className="intel-panel mt-5" aria-labelledby="signal-list-heading">
      <div className="intel-panel-heading"><h2 id="signal-list-heading">{briefing ? '검토할 상황과 근거' : '상황 스트림'}</h2><span>{scopeLabel}</span><Link href="/news" className="action-text">전체 기사 검색 ↗</Link></div>
      {!isLoading && data && !ranked.length && <div className="intel-empty"><h3>조건에 맞는 상황이 없습니다</h3><p>보도 부재는 위험 부재를 의미하지 않습니다. 기간을 넓히거나 필터를 초기화하세요.</p><button className="action-secondary" onClick={()=>update({hours:'168',country:'',topic:'',search:'',view:'all'})}>최근 7일 전체 보기</button></div>}
      {ranked.slice(0,briefing ? 30 : limit).map(signal=><article key={signal.id} className="intel-signal">
        <div className="intel-signal-meta"><span className={signal.urgent?'intel-flag':'intel-neutral-flag'}>{signal.urgent?'우선 확인':'동향'}</span><time dateTime={signal.news.publishedAt}>{new Date(signal.news.publishedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})} KST</time></div>
        <div className="min-w-0"><button className="intel-signal-title" onClick={()=>setDetail(signal)}>{signal.news.titleKo || signal.news.title}</button><div className="intel-tags"><span>{signal.countries.map(countryName).join(' · ') || '지역 미분류'}</span><span>{signal.themes.map(t=>THEMES.find(x=>x.id===t)?.label).join(' / ') || '일반 동향'}</span><span>{signal.news.source?.nameKo || signal.news.sourceId}{signal.related.length > 0 && ' 외 ' + signal.related.length + '건'}</span></div>
          {briefing && <><p className="t-body-sm text-slate-300 mt-3">{signal.news.summaryKo || signal.news.summary || '요약 미제공. 원문 확인 필요.'}</p><p className="t-body-sm mt-2"><strong>확인 과제 · </strong>{THEMES.filter(t=>signal.themes.includes(t.id)).map(t=>t.check).join(' ') || '사업 관련성과 사실관계를 확인하세요.'}</p></>}
        </div>
        <div className="intel-signal-actions"><button className="action-text" onClick={()=>setDetail(signal)}>근거·영향 검토</button><BookmarkButton news={signal.news} /><a className="action-text" href={signal.news.url} target="_blank" rel="noopener noreferrer" aria-label={'원문: '+(signal.news.titleKo || signal.news.title)}>원문 ↗</a></div>
      </article>)}
      {!briefing && ranked.length>limit && <div className="p-4 text-center"><button className="action-secondary" onClick={()=>setLimit(v=>v+15)}>상황 더 보기 ({ranked.length-limit}건)</button></div>}
    </section>
    <footer className="intel-coverage">
      <div><h2 className="t-title">판단 전에, 데이터 범위를 확인하세요</h2><p>조회한 {data?.scanned ?? '—'}건 중 사업 관련 상황을 분류했습니다. 날짜 미확인 {data?.undated ?? '—'}건은 기간 필터에서 제외됩니다. {data?.truncated && '최신 400건까지만 분석한 제한된 범위입니다.'}</p><p>매체 소재지는 사건 위치와 다릅니다. 지도는 기사에서 인식한 {REGIONS.length}개 지역만 분류하며, 키워드 오분류·수집 공백이 있을 수 있습니다.</p></div><Link className="action-secondary" href="/sources">출처·분류 기준</Link>
    </footer>
    <p role="status" className="sr-only">{notice || (!isLoading && data ? '선택 범위에서 '+ranked.length+'건을 표시합니다.' : '')}</p>
    {editor && <MonitorEditor initial={profile} save={save} onClose={()=>setEditor(false)} />}
    {detail && <SignalDetail signal={detail} mode={data?.mode || ''} onClose={()=>setDetail(null)} />}
  </div>;
}
