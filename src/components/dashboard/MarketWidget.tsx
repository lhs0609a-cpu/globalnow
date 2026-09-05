'use client';

import { useMarket } from '@/hooks/useMarket';
import { MarketSkeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatPercent } from '@/lib/utils/format';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import type { IconName } from '@/components/ui/Icon';

/**
 * 시장 위젯.
 *
 * 등락은 색만으로 표시하지 않는다. 색각 이상에서 적녹이 붙어 보이는 것도
 * 있지만, 그보다 흑백 출력·스크린샷에서 방향이 사라지는 게 크다. 부호 글리프를
 * 같이 찍고 숫자는 tabular로 고정해 자릿수가 흔들리지 않게 한다.
 *
 * 색 자체는 한국 관행(상승 적색·하락 청색)을 따른다 — 국내 사용자가 초록 상승을
 * 보면 한 박자 늦게 읽는다.
 */
function delta(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { className: 'text-slate-500', glyph: '' };
  }
  if (value > 0) return { className: 'text-up', glyph: '▲' };
  if (value < 0) return { className: 'text-down', glyph: '▼' };
  return { className: 'text-slate-500', glyph: '–' };
}

function Row({
  label,
  sub,
  value,
  changePercent,
}: {
  label: string;
  sub?: string;
  value: string;
  changePercent: number | null | undefined;
}) {
  const d = delta(changePercent);

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-fill-subtle">
      <div className="min-w-0">
        <p className="truncate t-body font-medium text-slate-200">{label}</p>
        {sub && <p className="tnum truncate text-[0.75rem] text-slate-500">{sub}</p>}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="tnum t-title font-semibold text-slate-100">{value}</p>
        <p className={`tnum text-[0.75rem] font-semibold ${d.className}`}>
          {d.glyph && <span aria-hidden className="mr-0.5 t-meta-sm">{d.glyph}</span>}
          {formatPercent(changePercent)}
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
  const fearGreedPct =
    typeof fearGreed === 'number' ? Math.max(0, Math.min(100, fearGreed)) : 0;

  return (
    <div className="space-y-5">
      <Section title="주요 지수" icon="chart">
        {data.indices.map(index => (
          <Row
            key={index.symbol}
            label={index.nameKo}
            sub={index.symbol}
            value={formatPrice(index.value)}
            changePercent={index.changePercent}
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
            changePercent={coin.change24h}
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
            changePercent={fx.changePercent}
          />
        ))}
      </Section>

      <Card>
        <CardHeader title="공포 & 탐욕 지수" icon="gauge" />
        <CardDivider />
        <div className="px-5 py-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="tnum text-[2.25rem] font-bold leading-none tracking-tight text-slate-100">
                {typeof fearGreed === 'number' ? fearGreed : '—'}
              </p>
              <p className="t-meta mt-2 text-slate-400">
                {data.fearGreed?.labelKo ?? '데이터 없음'}
              </p>
            </div>
            <p className="t-meta-sm font-normal text-slate-500">100점 만점</p>
          </div>

          {/* 게이지: 반원 대신 선형 막대가 좁은 칼럼에서 더 정확히 읽힌다 */}
          <div
            role="meter"
            aria-label="공포 탐욕 지수"
            aria-valuenow={typeof fearGreed === 'number' ? fearGreed : undefined}
            aria-valuemin={0}
            aria-valuemax={100}
            className="relative mt-4 h-1.5 rounded-full bg-gradient-to-r from-[var(--neg)] via-[var(--warn)] to-[var(--pos)]"
          >
            {/* 막대를 잘라내는 대신 눈금을 세운다 — 색 띠 전체가 척도이기 때문 */}
            <span
              className="absolute top-1/2 h-3.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 ring-2 ring-[var(--n-800)] transition-[left] duration-500"
              style={{ left: `${fearGreedPct}%` }}
            />
          </div>
          <div className="t-meta-sm mt-2 flex justify-between font-normal text-slate-500">
            <span>극단적 공포</span>
            <span>극단적 탐욕</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
