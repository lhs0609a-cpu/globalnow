'use client';
import Link from 'next/link';
import { useBookmarks } from '@/components/news/BookmarkProvider';
import { NewsCard } from '@/components/dashboard/NewsCard';
import { PageHeader } from '@/components/layout/AppShell';

export default function SavedPage() {
  const { items, ready, guest, error } = useBookmarks();
  return <div className="mx-auto max-w-4xl">
    <PageHeader title="저장한 뉴스" description={guest ? '이 브라우저에 저장한 기사입니다. 브라우저 데이터를 지우면 함께 삭제됩니다.' : '계정에 저장한 기사를 다시 읽어보세요.'} action={<Link href="/" className="action-secondary">뉴스 탐색</Link>} />
    {error && <p role="alert" className="surface mb-4 p-4 text-red-400">{error}</p>}
    {!ready ? <p role="status" className="surface p-8">저장 목록을 불러오는 중…</p> : items.length ? <>
      <p role="status" className="t-meta mb-3 text-slate-500">{items.length}건 저장됨</p>
      <div className="divide-y divide-line">{items.map(news => <NewsCard key={news.id} news={news} variant="row" />)}</div>
    </> : <div className="surface space-y-3 p-8 text-center"><h2 className="t-headline">다시 읽고 싶은 뉴스를 모아보세요.</h2><p className="t-body text-slate-500">기사의 저장 버튼을 누르면 여기에 모입니다.</p><Link href="/" className="action-primary">뉴스 둘러보기</Link></div>}
  </div>;
}
