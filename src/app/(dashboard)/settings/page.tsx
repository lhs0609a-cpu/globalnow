'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/AppShell';
import { useTheme } from '@/components/ui/ThemeToggle';
import { useBookmarks } from '@/components/news/BookmarkProvider';

function csvCell(value: string) {
  const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { items, ready, guest } = useBookmarks();
  const [status, setStatus] = useState('');
  const exportBookmarks = () => {
    try {
      const csv = ['제목,URL,기사 게시일', ...items.map(item => [item.titleKo || item.title, item.url, item.publishedAt].map(csvCell).join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `globalnow-saved-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.append(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`${items.length}건의 저장한 뉴스를 내보냈습니다.`);
    } catch { setStatus('내보내지 못했습니다. 다시 시도해 주세요.'); }
  };
  return <div className="mx-auto max-w-3xl">
    <PageHeader title="설정" description="읽기 편한 화면과 저장한 뉴스를 관리하세요." />
    <div className="space-y-5">
      <section className="surface p-5 sm:p-6" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading" className="t-headline mb-2">화면 테마</h2><p className="t-body-sm text-slate-500">선택한 테마는 이 브라우저에 기억됩니다.</p>
        <div role="group" aria-label="화면 테마" className="mt-4 grid grid-cols-2 gap-3">{(['light', 'dark'] as const).map(value => <button key={value} type="button" aria-pressed={theme === value} onClick={() => setTheme(value)} className={`rounded-xl border p-4 text-left ${theme === value ? 'border-accent bg-accent-soft' : 'border-line-strong hover:bg-fill'}`}>
          <span aria-hidden="true" className={`mb-3 block h-14 rounded-lg border ${value === 'light' ? 'border-gray-300 bg-gray-100' : 'border-gray-600 bg-gray-900'}`} />
          <span className="t-label">{value === 'light' ? '라이트' : '다크'}{theme === value ? ' · 선택됨' : ''}</span>
        </button>)}</div>
      </section>
      <section className="surface p-5 sm:p-6" aria-labelledby="saved-heading">
        <h2 id="saved-heading" className="t-headline">저장한 뉴스</h2><p className="mt-2 t-body-sm text-slate-500">{guest ? '이 브라우저에 저장됩니다. 다른 기기로 옮기기 전에 CSV로 보관하세요.' : '계정에 저장한 기사를 CSV 파일로 보관할 수 있습니다.'}</p>
        <div className="mt-4 flex flex-wrap gap-2"><Link href="/saved" className="action-secondary">저장 목록 보기</Link><button type="button" disabled={!ready || items.length === 0} onClick={exportBookmarks} className="action-primary">CSV 내보내기{ready ? ` (${items.length}건)` : ''}</button></div>
        <p role="status" className="mt-3 t-meta text-slate-400">{status}</p>
      </section>
      <section className="surface p-5 sm:p-6" aria-labelledby="availability-heading"><h2 id="availability-heading" className="t-headline">제공 기능</h2><dl className="mt-4 space-y-4 t-body-sm"><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-400">인터페이스 언어</dt><dd>한국어</dd></div><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-400">이메일 알림</dt><dd>준비 중</dd></div><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-400">계정 삭제</dt><dd>앱 내 삭제 기능 준비 중</dd></div></dl></section>
      <div className="flex flex-wrap gap-3"><Link href="/terms" className="action-text">이용약관</Link><Link href="/privacy" className="action-text">개인정보처리방침</Link></div>
    </div>
  </div>;
}
