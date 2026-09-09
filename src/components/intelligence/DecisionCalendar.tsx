'use client';
import { useNow } from '@/hooks/useNow';
const FOMC=[['2026-09-15','2026-09-16'],['2026-10-27','2026-10-28'],['2026-12-08','2026-12-09']];
export function DecisionCalendar(){
  const now=useNow();
  const upcoming=FOMC.filter(([,end])=>Date.parse(end+'T23:59:59-04:00')>=now);
  return <section className="intel-panel mb-6"><div className="intel-panel-heading"><h2>통화정책 확인 일정</h2><span>미 연준 공식 일정 · 2026-09-09 확인 · 자동 동기화 아님</span></div><div className="grid md:grid-cols-3">{upcoming.map(([start,end])=><a className="intel-source-card" key={start} href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" rel="noopener noreferrer"><span className="tnum">{start} ~ {end}</span><strong>미국 FOMC 회의</strong><span>금리 · 달러 · 조달 비용</span><span>미국 현지 회의 날짜 · 발표 시각은 원문 확인 ↗</span></a>)}</div>{!upcoming.length&&<p className="p-5 t-body-sm">저장된 예정 일정이 없습니다. 연준 공식 캘린더에서 새 일정을 확인하세요.</p>}<p className="p-4 t-meta text-slate-500">정책 결과나 시장 반응을 예측하는 일정이 아닙니다. 일정 변경 여부를 공식 발표에서 재확인하세요.</p></section>;
}
