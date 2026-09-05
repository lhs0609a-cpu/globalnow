'use client';

import { MediaLean } from '@/types/directory';

type SiteLinkCardProps = {
  name: string;
  nameKo: string;
  url: string;
  countryFlag: string;
  note?: string;
  free?: boolean;
  rssUrl?: string;
  lean?: MediaLean;
};

const LEAN_BADGE: Record<MediaLean, { label: string; className: string }> = {
  progressive: { label: '진보', className: 'bg-blue-400/10 text-blue-400' },
  center: { label: '중도', className: 'bg-fill text-slate-400' },
  conservative: { label: '보수', className: 'bg-red-400/10 text-red-400' },
};

export function SiteLinkCard({ name, nameKo, url, countryFlag, note, free, rssUrl, lean }: SiteLinkCardProps) {
  const leanBadge = lean ? LEAN_BADGE[lean] : null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block surface rounded-lg p-3 transition-colors hover:border-line-strong"
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 t-body-sm leading-5">{countryFlag}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate t-body-sm font-semibold text-slate-100 transition-colors group-hover:text-accent-text">
              {nameKo}
            </span>
            {leanBadge && (
              <span className={`rounded px-1.5 py-0.5 t-meta-sm font-medium ${leanBadge.className}`}>
                {leanBadge.label}
              </span>
            )}
            {free && (
              <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 t-meta-sm font-medium text-emerald-400">
                무료
              </span>
            )}
            {rssUrl && (
              <span className="rounded bg-amber-400/10 px-1.5 py-0.5 t-meta-sm font-medium text-amber-400">
                RSS
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate t-meta-sm text-slate-600">{name}</div>
          {note && (
            <p className="mt-1 line-clamp-2 t-meta-sm text-slate-500">
              {note}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
