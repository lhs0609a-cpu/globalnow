import { UserBadge } from '@/types/user';

export function StreakBadge({ badge }: { badge: UserBadge }) {
  return (
    <div className="flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1.5 hover:bg-slate-700 transition-colors">
      <span className="text-lg">{badge.icon}</span>
      <div>
        <p className="text-white text-xs font-medium">{badge.nameKo}</p>
        <p className="text-slate-500 text-[10px]">{badge.description}</p>
      </div>
    </div>
  );
}
