import clsx from 'clsx';
import { Icon, type IconName } from './Icon';

/**
 * 카드 표면과 머리글을 한 곳에 모은다.
 *
 * 각 위젯이 저마다 다른 반경·여백·경계선을 들고 있어 나란히 놓았을 때
 * 어긋나 보였다. 여기서만 표면을 정의하면 전 화면의 리듬이 맞는다.
 */
export function Card({
  children,
  className,
  as: Tag = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
}) {
  return (
    <Tag
      className={clsx(
        'rounded-xl bg-slate-800 border border-white/[0.06] overflow-hidden',
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex items-start justify-between gap-4 px-5 py-4',
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[0.9375rem] font-semibold text-slate-100">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/** 카드 안에서 목록과 머리글을 가르는 선 */
export function CardDivider() {
  return <div className="h-px bg-white/[0.06]" />;
}

/** 카드 머리글 오른쪽에 놓는 조용한 링크 */
export function CardAction({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const className =
    'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100';

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
        <Icon name="chevronRight" className="h-3.5 w-3.5" />
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
