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
      className={`block bg-slate-800 rounded-xl p-4 border-l-4 ${tierMeta.bgColor} hover:bg-slate-700/80 transition-colors group`}
    >
      <div className="flex items-start gap-3">
        {/* Rank number */}
        <div className={`text-2xl font-bold ${tierMeta.color} w-8 text-center flex-shrink-0`}>
          {globalRank}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name and badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {nameKo}
            </h3>
            <span className="text-slate-500 text-sm">{name}</span>
            <span className="text-base">{countryFlag}</span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm mt-1">{descriptionKo}</p>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${tierMeta.color} bg-slate-700/50`}>
              {tierMeta.labelKo}
            </span>
            <span className="text-xs text-slate-500 capitalize">{category}</span>
            <span className="text-xs text-slate-500">
              신뢰도 {'★'.repeat(reliability)}{'☆'.repeat(5 - reliability)}
            </span>
            <span className="text-xs text-slate-500">설립 {foundedYear}년</span>
            <span className="text-xs text-slate-500">월간 {monthlyReach}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
