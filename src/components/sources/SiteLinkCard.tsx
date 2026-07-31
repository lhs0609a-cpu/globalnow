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
  progressive: { label: '진보', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  center: { label: '중도', className: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
  conservative: { label: '보수', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export function SiteLinkCard({ name, nameKo, url, countryFlag, note, free, rssUrl, lean }: SiteLinkCardProps) {
  const leanBadge = lean ? LEAN_BADGE[lean] : null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-800 rounded-lg p-3 border border-slate-700/60 hover:border-blue-500/50 hover:bg-slate-700/60 transition-colors group"
    >
      <div className="flex items-start gap-2">
        <span className="text-base leading-6 flex-shrink-0">{countryFlag}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white text-sm font-semibold group-hover:text-blue-400 transition-colors truncate">
              {nameKo}
            </span>
            {leanBadge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${leanBadge.className}`}>
                {leanBadge.label}
              </span>
            )}
            {free && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                무료
              </span>
            )}
            {rssUrl && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                RSS
              </span>
            )}
          </div>
          <div className="text-slate-500 text-xs mt-0.5 truncate">{name}</div>
          {note && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{note}</p>}
        </div>
      </div>
    </a>
  );
}
