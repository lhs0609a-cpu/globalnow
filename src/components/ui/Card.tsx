import clsx from 'clsx';
import { Icon, type IconName } from './Icon';

/**
 * 카드 표면과 머리글.
 *
 * 위젯마다 반경·여백·경계선이 달라 나란히 놓으면 어긋나 보였다.
 * 표면 정의는 여기 한 곳에만 둔다. 어두운 화면에서는 경계선으로,
 * 밝은 화면에서는 옅은 그림자로 층을 만든다(.surface 토큰).
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
  return <Tag className={clsx('surface overflow-hidden', className)}>{children}</Tag>;
}

/**
 * 카드 머리글.
 *
 * 아이콘 배지를 없앴다. 위젯마다 색 배지가 붙으면 화면에 점이 흩어져
 * 정작 기사 쪽으로 시선이 가지 않는다. 대신 제목 활자만으로 층을 세운다.
 */
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
      className={clsx('flex items-center justify-between gap-4 px-5 py-3.5', className)}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && (
          <Icon name={icon} className="h-4 w-4 flex-shrink-0 text-slate-500" />
        )}
        <div className="min-w-0">
          <h2 className="t-title truncate text-slate-100">{title}</h2>
          {description && (
            <p className="t-meta-sm mt-0.5 truncate text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/** 카드 안에서 목록과 머리글을 가르는 선 */
export function CardDivider() {
  return <div className="h-px bg-line" />;
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
    't-meta inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-slate-400 transition-colors hover:bg-fill-weak hover:text-slate-100';

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

/**
 * 목록 섹션 머리.
 *
 * 카드가 아닌 곳(피드 사이)에서 구획을 나눌 때 쓴다. 신문 지면처럼
 * 위쪽에 굵은 괘선을 얹으면 카드 없이도 섹션이 선다.
 */
export function SectionHeading({
  title,
  kicker,
  action,
  className,
}: {
  title: string;
  kicker?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mb-3.5 border-t-2 border-slate-200/90 pt-2.5', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {kicker && <p className="t-kicker mb-1 text-accent-text">{kicker}</p>}
          <h2 className="t-headline-lg truncate text-slate-100">{title}</h2>
        </div>
        {action && <div className="flex-shrink-0 pb-0.5">{action}</div>}
      </div>
    </div>
  );
}
