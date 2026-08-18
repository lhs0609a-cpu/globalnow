import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary:
    'border border-white/[0.08] bg-white/[0.03] text-slate-200 hover:border-white/[0.14] hover:bg-white/[0.06]',
  ghost: 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-3.5 text-[0.8125rem]',
};

/** 화면마다 버튼 높이가 달라 정렬이 어긋나던 것을 두 가지 크기로 고정한다 */
export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={clsx(
        'inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

/** 목록 위에 놓이는 필터 칩 */
export function FilterChip({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={clsx(
        'flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium transition-colors',
        active
          ? 'bg-slate-100 text-slate-900'
          : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100',
        className
      )}
      {...props}
    />
  );
}
