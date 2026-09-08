'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { NewsItem } from '@/types/news';
import { track } from '@/lib/analytics/events';

const KEY = 'gn-saved-news-v1';
const guest = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
type BookmarkState = { items: NewsItem[]; ready: boolean; guest: boolean; error: string | null; toggle: (news: NewsItem) => Promise<void> };
const Context = createContext<BookmarkState | null>(null);
export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef<NewsItem[]>([]);
  const busy = useRef(new Set<string>());
  const commit = (next: NewsItem[]) => { itemsRef.current = next; setItems(next); };

  useEffect(() => {
    const controller = new AbortController();
    function loadLocal() {
      try {
        const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
        const saved = Array.isArray(parsed) ? parsed.filter((item): item is NewsItem => Boolean(item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.url === 'string')).slice(0, 200) : [];
        commit(saved);
      } catch { setError('이 브라우저의 저장 목록을 읽을 수 없습니다.'); }
      setReady(true);
    }
    if (guest) {
      loadLocal();
      const onStorage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) loadLocal(); };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
    fetch('/api/user/bookmarks', { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error('저장 목록을 불러오지 못했습니다.'); return res.json(); })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('저장 목록의 형식이 올바르지 않습니다.');
        commit(data.flatMap((bookmark: { news?: NewsItem }) => bookmark.news ? [bookmark.news] : []));
      })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setReady(true); });
    return () => controller.abort();
  }, []);

  const toggle = async (news: NewsItem) => {
    if (!ready || busy.current.has(news.id)) return;
    busy.current.add(news.id);
    try {
      let saved = !itemsRef.current.some(item => item.url === news.url);
      if (!guest) {
        const response = await fetch('/api/user/bookmarks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newsId: news.id }) });
        if (response.status === 401) throw new Error('로그인 후 계정에 저장할 수 있습니다.');
        if (!response.ok) throw new Error('저장하지 못했습니다. 다시 시도해 주세요.');
        const result = await response.json();
        if (typeof result.bookmarked !== 'boolean') throw new Error('저장 결과를 확인하지 못했습니다.');
        saved = result.bookmarked;
      }
      const remaining = itemsRef.current.filter(item => item.url !== news.url);
      if (guest && saved && remaining.length >= 200) throw new Error('최대 200건까지 저장할 수 있습니다. 저장 목록을 정리해 주세요.');
      const next = saved ? [news, ...remaining] : remaining;
      if (guest) localStorage.setItem(KEY, JSON.stringify(next));
      commit(next);
      setError(null);
      track('bookmark_success', { saved, storage: guest ? 'browser' : 'account' });
    } finally { busy.current.delete(news.id); }
  };
  return <Context.Provider value={{ items, ready, guest, error, toggle }}>{children}</Context.Provider>;
}
export function useBookmarks() {
  const context = useContext(Context);
  if (!context) throw new Error('BookmarkProvider is required');
  return context;
}
