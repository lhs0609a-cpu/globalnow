import { SoWhatAnalysis } from '@/types/news';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/Icon';

/** 네 구간의 색만 다르고 구조는 같아 한 곳으로 모은다 */
const SECTIONS: { key: keyof SoWhatAnalysis; label: string; className: string }[] = [
  { key: 'keyPoint', label: '핵심 포인트', className: 'text-accent-text' },
  { key: 'background', label: '배경', className: 'text-amber-400' },
  { key: 'outlook', label: '전망', className: 'text-emerald-400' },
  { key: 'actionItem', label: '액션 아이템', className: 'text-violet-400' },
];

export function SoWhatPanel({
  analysis,
  isLoading,
  onClose,
}: {
  analysis: SoWhatAnalysis | null;
  isLoading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="surface absolute bottom-full right-0 z-20 mb-2 w-[20rem] overflow-hidden shadow-[var(--shadow-pop)]">
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <h4 className="t-title text-slate-100">So What? AI 분석</h4>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-fill hover:text-slate-100"
        >
          <Icon name="close" className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3 px-3.5 py-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ) : analysis ? (
          SECTIONS.map(section => (
            <div key={section.key}>
              <p
                className={`t-kicker mb-1 ${section.className}`}
              >
                {section.label}
              </p>
              <p className="t-body-sm text-slate-300">
                {analysis[section.key]}
              </p>
            </div>
          ))
        ) : (
          <p className="t-body-sm py-2 text-center text-slate-400">
            분석을 불러올 수 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
