import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('shimmer rounded-md bg-white/[0.045]', className)} />
  );
}

/** 자리표시자도 실제 카드와 같은 표면을 써야 로딩이 끝날 때 튀지 않는다 */
function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-800 p-5">
      {children}
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <SkeletonCard>
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-14 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>
    </SkeletonCard>
  );
}

export function BriefSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-40" />
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-3.5">
            <Skeleton className="h-6 w-6 flex-shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-2.5 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

export function MarketSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1].map(card => (
        <SkeletonCard key={card}>
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="mt-4 space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}
