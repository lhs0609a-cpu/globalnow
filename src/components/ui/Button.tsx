import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'border border-line-strong bg-fill-subtle text-slate-200 hover:bg-fill-weak hover:text-slate-100',
  ghost: 'text-slate-400 hover:bg-fill-weak hover:text-slate-100',
  danger: 'border border-line-strong bg-fill-subtle text-red-400 hover:bg-fill-weak',
};

/**
 * 높이 사다리.
 *
 * 32/36/44. 44는 모바일 주 동작용 — 손가락 표적 최소 44px 규칙을 지킨다.
 */
const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-2.5 text-[0.8125rem]',
  md: 'h-9 gap-1.5 px-3.5 text-[0.875rem]',
  lg: 'h-11 gap-2 px-5 text-[0.9375rem]',
};

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
        'inline-flex flex-shrink-0 items-center justify-center rounded-lg font-semibold',
        'transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

/**
 * 목록 위 필터 칩.
 *
 * 선택된 칩을 반전(밝은 바탕·어두운 글자)시키면 강조색을 쓰지 않고도
 * 가장 확실한 대비가 나온다. 강조색은 링크와 활성 메뉴에만 남긴다.
 */
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
        't-label h-8 flex-shrink-0 whitespace-nowrap rounded-full px-3.5 transition-colors',
        active
          ? 'bg-slate-100 text-slate-900'
          : 'bg-fill-subtle text-slate-400 hover:bg-fill-weak hover:text-slate-100',
        className
      )}
      {...props}
    />
  );
}

/** 아이콘 단독 버튼 — 헤더·카드 우측의 작은 동작 */
export function IconButton({
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
        'text-slate-400 transition-colors hover:bg-fill-weak hover:text-slate-100',
        className
      )}
      {...props}
    />
  );
}
