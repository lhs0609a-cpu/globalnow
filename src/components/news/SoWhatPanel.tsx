import type { SoWhatAnalysis } from '@/types/news';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
const SECTIONS = [
  { key: 'keyPoint', label: '핵심 포인트' }, { key: 'background', label: '배경' },
  { key: 'outlook', label: '전망' }, { key: 'actionItem', label: '확인할 점' },
] as const;
export function SoWhatPanel({ analysis, isLoading, onClose, onRetry }: {
  analysis: SoWhatAnalysis | null; isLoading: boolean; onClose: () => void; onRetry: () => void;
}) {
  return <Modal isOpen onClose={onClose} title="AI로 맥락 읽기">
    {isLoading ? <div role="status" aria-label="AI 분석 불러오는 중" className="space-y-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-20 w-full" /><p className="t-meta text-slate-500">기사의 배경과 영향을 정리하고 있습니다…</p></div> : analysis ? <div className="space-y-5">
      {SECTIONS.map(section => <section key={section.key}><h3 className="t-label mb-2 text-accent-text">{section.label}</h3><p className="t-body text-slate-300">{analysis[section.key]}</p></section>)}
      <p className="t-meta text-slate-500">AI가 생성한 해설입니다. 중요한 내용은 기사 원문과 함께 확인하세요.</p>
    </div> : <div className="space-y-4"><p role="alert" className="t-body">분석을 불러오지 못했습니다.</p><button type="button" className="action-primary" onClick={onRetry}>다시 시도</button></div>}
  </Modal>;
}
