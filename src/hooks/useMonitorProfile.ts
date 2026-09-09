'use client';
import { useSyncExternalStore } from 'react';
import type { MonitorProfile } from '@/lib/intelligence/model';
const KEY = 'gn-monitor-v1';
const EMPTY = '{"countries":[],"themes":[],"keywords":""}';
let fallback = EMPTY;
function snapshot() { try { return localStorage.getItem(KEY) || fallback; } catch { return fallback; } }
function subscribe(callback: () => void) { window.addEventListener('storage', callback); window.addEventListener(KEY, callback); return () => { window.removeEventListener('storage', callback); window.removeEventListener(KEY, callback); }; }
export function useMonitorProfile() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  let profile: MonitorProfile = { countries: [], themes: [], keywords: '' };
  try { const value = JSON.parse(raw); profile = { countries: Array.isArray(value.countries) ? value.countries.filter((x: unknown) => typeof x === 'string').slice(0,40) : [], themes: Array.isArray(value.themes) ? value.themes.filter((x: unknown) => typeof x === 'string').slice(0,6) : [], keywords: typeof value.keywords === 'string' ? value.keywords.slice(0,200) : '' }; } catch { /* Use empty profile for malformed storage. */ }
  const save = (next: MonitorProfile) => {
    const value = JSON.stringify(next);
    localStorage.setItem(KEY, value);
    fallback = value;
    window.dispatchEvent(new Event(KEY));
  };
  return { profile, save };
}
