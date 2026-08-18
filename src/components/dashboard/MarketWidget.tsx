'use client';

import { useMarket } from '@/hooks/useMarket';
import { MarketSkeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatPercent } from '@/lib/utils/format';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import type { IconName } from '@/components/ui/Icon';

/** 등락 색은 세 곳에서 같은 규칙을 써야 한눈에 읽힌다 */
function deltaClass(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'text-slate-500';
  return value >= 0 ? 'text-emerald-400' : 'text-red-400';
}

function Row({
  label,
  sub,
  value,
  delta,
}: {
  label: string;
  sub?: string;
  value: string;
  delta: number | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-white/[0.02]">
      <div className="min-w-0">
        <p className="truncate text-[0.8125rem] text-slate-200">{label}</p>
        {sub && <p className="truncate text-[0.6875rem] text-slate-500">{sub}</p>}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="tnum text-[0.8125rem] font-medium text-slate-100">{value}</p>
        <p className={`tnum text-[0.6875rem] font-medium ${deltaClass(delta)}`}>
          {formatPercent(delta)}
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader title={title} icon={icon} />
      <CardDivider />
      <div className="py-1.5">{children}</div>
    </Card>
  );
}

export function MarketWidget() {
  const { data, isLoading } = useMarket();

  if (isLoading || !data || !Array.isArray(data.indices)) return <MarketSkeleton />;

  const fearGreed = data.fearGreed?.value;
  const fearGreedPct = typeof fearGreed === 'number' ? Math.max(0, Math.min(100, fearGreed)) : 0;

  return (
    <div className="space-y-5">
      <Section title="주요 지수" icon="chart">
        {data.indices.map(index => (
          <Row
            key={index.symbol}
            label={index.nameKo}
            sub={index.symbol}
            value={formatPrice(index.value)}
            delta={index.changePercent}
          />
        ))}
      </Section>

      <Section title="암호화폐" icon="coin">
        {(data.crypto ?? []).map(coin => (
          <Row
            key={coin.id}
            label={coin.nameKo}
            sub={coin.symbol}
            value={`$${formatPrice(coin.price)}`}
            delta={coin.change24h}
          />
        ))}
      </Section>

      <Section title="환율" icon="exchange">
        {(data.forex ?? []).map(fx => (
          <Row
            key={fx.pair}
            label={fx.nameKo}
            sub={fx.pair}
            value={formatPrice(fx.rate)}
            delta={fx.changePercent}
          />
        ))}
      </Section>

      {/* Fear & Greed */}
      <Card>
        <CardHeader title="공포 & 탐욕 지수" icon="gauge" />
        <CardDivider />
        <div className="px-5 py-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="tnum text-3xl font-semibold tracking-tight text-slate-100">
                {typeof fearGreed === 'number' ? fearGreed : '—'}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {data.fearGreed?.labelKo ?? '데이터 없음'}
              </p>
            </div>
            <p className="text-[0.6875rem] text-slate-500">100점 만점</p>
          </div>

          {/* 게이지: 반원 대신 선형 막대가 좁은 칼럼에서 더 정확히 읽힌다 */}
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 transition-[width] duration-500"
              style={{ width: `${fearGreedPct}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[0.625rem] text-slate-500">
            <span>극단적 공포</span>
            <span>극단적 탐욕</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
