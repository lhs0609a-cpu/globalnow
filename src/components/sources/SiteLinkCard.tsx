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
  center: { label: '중도', className: 'bg-white/[0.06] text-slate-400' },
  conservative: { label: '보수', className: 'bg-red-400/10 text-red-400' },
};

export function SiteLinkCard({ name, nameKo, url, countryFlag, note, free, rssUrl, lean }: SiteLinkCardProps) {
  const leanBadge = lean ? LEAN_BADGE[lean] : null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-white/[0.06] bg-slate-800 p-3 transition-colors hover:border-white/[0.14]"
    >
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 text-[0.8125rem] leading-5">{countryFlag}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-[0.8125rem] font-semibold text-slate-100 transition-colors group-hover:text-blue-400">
              {nameKo}
            </span>
            {leanBadge && (
              <span className={`rounded px-1.5 py-0.5 text-[0.625rem] font-medium ${leanBadge.className}`}>
                {leanBadge.label}
              </span>
            )}
            {free && (
              <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-emerald-400">
                무료
              </span>
            )}
            {rssUrl && (
              <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[0.625rem] font-medium text-amber-400">
                RSS
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate text-[0.6875rem] text-slate-600">{name}</div>
          {note && (
            <p className="mt-1 line-clamp-2 text-[0.6875rem] leading-relaxed text-slate-500">
              {note}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
