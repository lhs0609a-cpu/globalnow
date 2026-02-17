import { SoWhatAnalysis } from '@/types/news';
import { Skeleton } from '@/components/ui/Skeleton';

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
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-slate-700 rounded-xl shadow-2xl border border-slate-600 z-10">
      <div className="flex items-center justify-between p-3 border-b border-slate-600">
        <h4 className="text-white text-sm font-semibold flex items-center gap-1.5">
          <span>💡</span> So What? AI 분석
        </h4>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-3 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : analysis ? (
          <>
            <div>
              <p className="text-blue-400 text-xs font-semibold mb-1">핵심 포인트</p>
              <p className="text-slate-300 text-xs">{analysis.keyPoint}</p>
            </div>
            <div>
              <p className="text-amber-400 text-xs font-semibold mb-1">배경</p>
              <p className="text-slate-300 text-xs">{analysis.background}</p>
            </div>
            <div>
              <p className="text-emerald-400 text-xs font-semibold mb-1">전망</p>
              <p className="text-slate-300 text-xs">{analysis.outlook}</p>
            </div>
            <div>
              <p className="text-purple-400 text-xs font-semibold mb-1">액션 아이템</p>
              <p className="text-slate-300 text-xs">{analysis.actionItem}</p>
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-xs text-center py-2">분석을 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}
