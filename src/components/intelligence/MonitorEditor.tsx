'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { REGIONS, THEMES, type MonitorProfile } from '@/lib/intelligence/model';
export function MonitorEditor({ initial, save, onClose }: { initial: MonitorProfile; save: (profile: MonitorProfile) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState('');
  const toggle = (key: 'countries' | 'themes', value: string) => setDraft(old => ({ ...old, [key]: old[key].includes(value) ? old[key].filter(x => x !== value) : [...old[key],value] }));
  return <Modal isOpen onClose={onClose} title="내 모니터 설정" className="max-w-2xl">
    <form onSubmit={event => { event.preventDefault(); try { save(draft); onClose(); } catch { setError('브라우저 저장 공간에 접근할 수 없습니다. 저장 설정을 확인해 주세요.'); } }} className="space-y-5">
      <p className="t-body-sm text-slate-400">사업장·고객·공급망·투자와 관련된 지역과 주제를 선택하세요. 하나라도 일치하는 기사를 모읍니다. 이 브라우저에 저장되며 외부 알림은 발송하지 않습니다.</p>
      <fieldset><legend className="t-label mb-2">관심 지역</legend><div className="flex flex-wrap gap-2">{REGIONS.map(c => <button key={c[0]} type="button" aria-pressed={draft.countries.includes(c[0])} className="intel-chip" onClick={() => toggle('countries',c[0])}>{c[1]}</button>)}</div></fieldset>
      <fieldset><legend className="t-label mb-2">의사결정 주제</legend><div className="flex flex-wrap gap-2">{THEMES.map(t => <button key={t.id} type="button" aria-pressed={draft.themes.includes(t.id)} className="intel-chip" onClick={() => toggle('themes',t.id)}>{t.label}</button>)}</div></fieldset>
      <label className="block t-label">기업·품목 키워드<span className="block t-body-sm font-normal text-slate-400 mt-1">쉼표로 구분하세요. 예: 삼성, TSMC, copper</span><input className="intel-input mt-2 w-full" value={draft.keywords} maxLength={200} onChange={e => setDraft(old => ({ ...old, keywords: e.target.value }))} /></label>
      {error && <p role="alert" className="text-red-400 t-body-sm">{error}</p>}
      <div className="flex justify-end gap-2"><button type="button" className="action-secondary" onClick={onClose}>취소</button><button className="action-primary" type="submit">모니터 저장</button></div>
    </form>
  </Modal>;
}
