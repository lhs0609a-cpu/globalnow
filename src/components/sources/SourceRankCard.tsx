'use client';

import { TIER_LABELS, MediaTier } from '@/lib/constants/media-rankings';

type SourceRankCardProps = {
  sourceId: string;
  name: string;
  nameKo: string;
  countryFlag: string;
  country: string;
  category: string;
  reliability: number;
  tier: MediaTier;
  globalRank: number;
  description: string;
  descriptionKo: string;
  foundedYear: number;
  monthlyReach: string;
  url: string;
};

export function SourceRankCard({
  name,
  nameKo,
  countryFlag,
  category,
  reliability,
  tier,
  globalRank,
  descriptionKo,
  foundedYear,
  monthlyReach,
  url,
}: SourceRankCardProps) {
  const tierMeta = TIER_LABELS[tier];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-white/[0.06] bg-slate-800 p-4 transition-colors hover:border-white/[0.14]"
    >
      <div className="flex items-start gap-3.5">
        {/* Rank number */}
        <span
          className={`tnum w-7 flex-shrink-0 text-right text-lg font-semibold tabular-nums ${tierMeta.color}`}
        >
          {globalRank}
        </span>

        <div className="min-w-0 flex-1">
          {/* Name and badges */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-[0.9375rem] font-semibold text-slate-100 transition-colors group-hover:text-blue-400">
              {nameKo}
            </h3>
            <span className="text-[0.6875rem] text-slate-600">{name}</span>
            <span className="text-[0.8125rem] leading-none">{countryFlag}</span>
          </div>

          {/* Description */}
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-slate-500">
            {descriptionKo}
          </p>

          {/* Meta info */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.6875rem] text-slate-500">
            <span className={`rounded bg-white/[0.05] px-1.5 py-0.5 font-medium ${tierMeta.color}`}>
              {tierMeta.labelKo}
            </span>
            <span className="capitalize">{category}</span>
            <span className="text-slate-700">·</span>
            <span className="tnum">신뢰도 {reliability}/5</span>
            <span className="text-slate-700">·</span>
            <span className="tnum">설립 {foundedYear}</span>
            <span className="text-slate-700">·</span>
            <span>월간 {monthlyReach}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
