import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/[0.06] text-slate-400',
  success: 'bg-emerald-400/10 text-emerald-400',
  warning: 'bg-amber-400/10 text-amber-400',
  danger: 'bg-red-400/10 text-red-400',
  info: 'bg-blue-400/10 text-blue-400',
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
        'inline-flex items-center rounded px-1.5 py-0.5 text-[0.6875rem] font-medium leading-tight',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
