'use client';
import Link from 'next/link';
import { useMarket } from '@/hooks/useMarket';
export function MarketStrip() {
  const { data, error, isLoading, isRefreshing, refresh } = useMarket();
  const quotes = [...(data?.indices || []).slice(0,4).map(q => ({ label:q.nameKo, value:q.value, change:q.changePercent, time:q.updatedAt, kind:'indices' })), ...(data?.forex || []).slice(0,2).map(q => ({ label:q.nameKo, value:q.rate, change:q.changePercent, time:q.updatedAt, kind:'forex' }))];
  return <section className="intel-market" aria-label="시장 스냅샷">
    <div className="intel-market-heading"><Link href="/markets" className="t-label">시장 ↗</Link><button type="button" onClick={() => void refresh()} disabled={isRefreshing} className="intel-small-button" aria-label="시장 새로고침">↻</button></div>
    {isLoading && <p role="status" className="p-3 t-body-sm">시장 조회 중…</p>}
    {error && <p role="status" className="p-3 t-body-sm text-amber-400">{error} {data && '이전 조회값입니다.'}</p>}
    {quotes.map(q => <div className="intel-quote" key={q.label}>
      <span className="t-meta text-slate-400">{q.label}<span className="ml-2 text-amber-400">{data?.provenance?.[q.kind] === 'demo' ? '샘플' : data?.provenance?.[q.kind] === 'live' ? '조회값' : '출처 미확인'}</span></span>
      <span className="tnum t-label">{Number.isFinite(q.value) ? q.value.toLocaleString('en-US',{ maximumFractionDigits:2 }) : '—'} <span className={q.change >= 0 ? 'text-up' : 'text-down'}>{Number.isFinite(q.change) ? (q.change >= 0 ? '+' : '') + q.change.toFixed(2) + '%' : '—'}</span></span>
      <time className="t-meta-sm text-slate-500">{Number.isFinite(Date.parse(q.time)) ? new Date(q.time).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}) + ' KST' : '시각 미확인'}</time>
    </div>)}
  </section>;
}
