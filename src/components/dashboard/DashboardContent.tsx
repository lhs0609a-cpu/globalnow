'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CategoryTabs } from './CategoryTabs';
import { NewsFeed } from './NewsFeed';
import { PageHeader } from '@/components/layout/AppShell';
export function DashboardContent({search,category}:{search:string;category:string}) {
  const router = useRouter();
  const changeCategory = (next:string) => { const params = new URLSearchParams(); if(search)params.set('search',search); if(next!=='all')params.set('category',next); router.push('/news'+(params.size?'?'+params:''),{scroll:false}); };
  return <div className="max-w-5xl mx-auto">
    <PageHeader title="뉴스 검색" description="상황판의 근거를 더 깊게 탐색하세요. 전체 기사를 검색하고 원문을 확인할 수 있습니다." action={<Link className="action-secondary" href="/">세계 상황판 ↗</Link>} />
    {search && <p className="t-body mb-3">“{search}” 검색 결과</p>}
    {(search || category!=='all') && <Link href="/news" className="action-text">필터 초기화</Link>}
    <CategoryTabs activeCategory={category} onChange={changeCategory} />
    <NewsFeed key={category+':'+search} category={category} search={search} />
  </div>;
}
