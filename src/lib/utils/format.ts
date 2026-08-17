/**
 * Upstream feeds occasionally hand back null/NaN for a single field. These
 * formatters run inside render, so an unguarded call takes the whole page down
 * with a client-side exception — always degrade to a placeholder instead.
 */
const PLACEHOLDER = '-';

function isNumeric(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatNumber(num: number | null | undefined): string {
  if (!isNumeric(num)) return PLACEHOLDER;
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatCurrency(value: number | null | undefined, currency: string = 'KRW'): string {
  if (!isNumeric(value)) return PLACEHOLDER;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (!isNumeric(value)) return PLACEHOLDER;
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatPrice(value: number | null | undefined): string {
  if (!isNumeric(value)) return PLACEHOLDER;
  if (value >= 1000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return value.toFixed(value < 1 ? 4 : 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
