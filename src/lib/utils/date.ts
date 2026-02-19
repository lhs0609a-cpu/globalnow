import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/** Safely parse a date string (ISO 8601, RFC 2822, or other formats) */
function safeParseDate(dateString: string): Date {
  // Try ISO 8601 first
  const iso = parseISO(dateString);
  if (!isNaN(iso.getTime())) return iso;

  // Fallback: let native Date handle RFC 2822 and other formats
  const native = new Date(dateString);
  if (!isNaN(native.getTime())) return native;

  // Final fallback: return current date
  return new Date();
}

export function formatRelativeTime(dateString: string): string {
  const date = safeParseDate(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

export function formatDate(dateString: string): string {
  const date = safeParseDate(dateString);
  if (isToday(date)) return '오늘';
  if (isYesterday(date)) return '어제';
  return format(date, 'M월 d일', { locale: ko });
}

export function formatDateTime(dateString: string): string {
  const date = safeParseDate(dateString);
  return format(date, 'yyyy년 M월 d일 HH:mm', { locale: ko });
}

export function formatTime(dateString: string): string {
  const date = safeParseDate(dateString);
  return format(date, 'HH:mm', { locale: ko });
}

export function getKSTDate(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
