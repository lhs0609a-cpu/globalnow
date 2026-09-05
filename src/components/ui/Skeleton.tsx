import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('shimmer rounded-md bg-fill-weak', className)} />;
}

/** 자리표시자도 실제 카드와 같은 표면을 써야 로딩이 끝날 때 튀지 않는다 */
function SkeletonCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx('surface p-5', className)}>{children}</div>;
}

export function NewsCardSkeleton() {
  return (
    <div className="surface overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/**
 * 피드 전체 자리표시자.
 *
 * 실제 위계(머리기사 → 카드 → 단신)와 같은 모양으로 비워둔다.
 * 로딩 중 화면과 완성 화면의 뼈대가 다르면 내용이 들어올 때 화면이 튄다.
 */
export function FeedSkeleton() {
  return (
    <div>
      <div className="mb-7 grid gap-5 border-b border-line pb-7 lg:grid-cols-[1.15fr_1fr] lg:gap-7">
        <Skeleton className="aspect-[16/9] w-full rounded-xl lg:aspect-[3/2]" />
        <div className="flex flex-col justify-center gap-3">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3].map(i => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>

      <div className="divide-y divide-line border-t border-line">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4 py-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="aspect-[4/3] w-[5.5rem] flex-shrink-0 rounded-lg sm:w-[6.5rem]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BriefSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="mt-5 space-y-5">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-5 w-5 flex-shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
}

export function MarketSkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1].map(card => (
        <SkeletonCard key={card}>
          <Skeleton className="h-4 w-24" />
          <div className="mt-4 space-y-3.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

/**
 * 회전 표시자.
 *
 * 같은 마크업이 여덟 곳에 흩어져 있었고 그중 몇은 흰색 알파 테두리를 써서
 * 라이트 모드에서 링이 거의 사라졌다. 테마 토큰을 쓰는 한 벌로 모은다.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="불러오는 중"
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-line-strong border-t-accent',
        className ?? 'h-6 w-6'
      )}
    />
  );
}
