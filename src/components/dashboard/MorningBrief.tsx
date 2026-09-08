'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MorningBrief as Brief } from '@/types/news';
import { Icon } from '@/components/ui/Icon';

export function MorningBrief() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    fetch('/api/brief/today', { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error('request failed'); return res.json(); })
      .then(data => { if (data && Array.isArray(data.items)) setBrief(data); })
      .catch(() => {})
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  return <section className="surface overflow-hidden" aria-labelledby="brief-heading">
    <div className="flex items-center gap-2 border-b border-line px-5 py-4"><Icon name="brief" className="h-4 w-4 text-accent-text" /><h2 id="brief-heading" className="t-title">오늘의 브리프</h2></div>
    <div className="p-5">
      {loading ? <p role="status" className="t-body-sm text-slate-500">주요 이슈를 정리하고 있습니다…</p> : brief ? <>
        <p className="t-meta text-slate-500">{brief.date} · 주요 이슈 {brief.items.length}건</p>
        <ol className="mt-3 space-y-3">{brief.items.slice(0, 3).map((item, index) => <li key={item.newsId || index} className="flex gap-3"><span aria-hidden="true" className="tnum font-semibold text-accent-text">{String(index + 1).padStart(2, '0')}</span><p className="t-body-sm text-slate-200">{item.titleKo || item.title}</p></li>)}</ol>
        <Link href="/brief" className="action-text mt-3">브리프 전체 읽기<Icon name="chevronRight" className="h-4 w-4" /></Link>
      </> : <><p role="status" className="t-body-sm text-slate-500">브리프를 불러오지 못했습니다.</p><button type="button" className="action-text mt-2" onClick={() => { setLoading(true); setAttempt(v => v + 1); }}>다시 시도</button></>}
    </div>
  </section>;
}
