import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'live';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-fill text-slate-300',
  success: 'bg-emerald-400/12 text-emerald-400',
  warning: 'bg-amber-400/12 text-amber-400',
  danger: 'bg-red-400/12 text-red-400',
  info: 'bg-accent-soft text-accent-text',
  live: 'bg-[color-mix(in_srgb,var(--live)_14%,transparent)] text-live',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        // 알약보다 살짝 각진 모서리가 촘촘한 목록에서 덜 튄다
        'inline-flex items-center rounded px-1.5 py-0.5 text-[0.75rem] font-semibold leading-tight',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * 카테고리 라벨.
 *
 * 카테고리마다 색을 주면 목록 하나에 아홉 색이 흩어져 정작 "속보"처럼
 * 진짜 급한 것이 묻힌다. 색은 빼고 대문자 자간으로만 구분한다.
 */
export function Kicker({
  children,
  tone = 'muted',
  className,
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'accent' | 'live';
  className?: string;
}) {
  return (
    <span
      className={clsx(
        't-kicker',
        tone === 'accent' && 'text-accent-text',
        tone === 'live' && 'text-live',
        tone === 'muted' && 'text-slate-400',
        className
      )}
    >
      {children}
    </span>
  );
}

/** 지금 들어온 기사 표시 — 점만 깜빡이고 글자는 가만히 둔다 */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={clsx('live-dot inline-block h-1.5 w-1.5 rounded-full bg-live', className)}
    />
  );
}
