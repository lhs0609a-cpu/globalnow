'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { useBookmarks } from './BookmarkProvider';
import type { NewsItem } from '@/types/news';

export function BookmarkButton({ news }: { news: NewsItem }) {
  const { items, ready, guest, toggle } = useBookmarks();
  const saved = items.some(item => item.url === news.url);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try { await toggle(news); setStatus(saved ? '저장 해제했습니다.' : guest ? '이 브라우저에 저장했습니다.' : '계정에 저장했습니다.'); }
    catch (err) { setError(err instanceof Error ? err.message : '저장 공간을 사용할 수 없습니다.'); }
    finally { setBusy(false); }
  };
  return <>
    <button type="button" onClick={handleClick} disabled={!ready || busy} aria-label={saved ? '저장 해제' : '기사 저장'} aria-pressed={saved} title={saved ? '저장 해제' : '기사 저장'}
      className={`flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg px-2 t-meta transition-colors hover:bg-fill disabled:opacity-50 ${saved ? 'text-accent-text' : 'text-slate-400'}`}>
      <Icon name="bookmark" className="h-4 w-4" /><span>{saved ? '저장됨' : '저장'}</span>
    </button>
    <span role="status" className="sr-only">{status}</span>
    <Modal isOpen={Boolean(error)} onClose={() => setError(null)} title="기사 저장"><p className="t-body">{error}</p>{!guest && <Link className="action-primary mt-4" href="/auth/login">로그인</Link>}</Modal>
  </>;
}
