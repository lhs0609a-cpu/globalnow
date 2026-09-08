import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { BookmarkProvider } from '@/components/news/BookmarkProvider';

/**
 * 앱 골격.
 *
 * 홈과 대시보드 레이아웃이 헤더·사이드바·푸터 조합을 각자 들고 있어
 * 여백이 서로 어긋났다. 골격을 한 곳에 두어 어느 화면으로 넘어가도
 * 본문 시작 위치가 흔들리지 않게 한다.
 */
export function AppShell({ children, search = '' }: { children: React.ReactNode; search?: string }) {
  return (
    <BookmarkProvider><div className="flex min-h-screen flex-col">
      <Header key={search} initialSearch={search} />
      <div className="flex flex-1">
        <Sidebar />
        {/* layout.tsx 의 「본문 바로가기」가 여기로 내려온다 */}
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 pb-24 lg:pb-10">
          <div className="mx-auto max-w-[var(--container)] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div></BookmarkProvider>
  );
}

/**
 * 화면 제목 줄.
 *
 * 페이지마다 h1 크기가 제각각이라 화면을 옮길 때마다 제목이 커졌다 작아졌다
 * 했다. 활자 사다리의 headline-xl 한 칸으로 고정한다.
 */
export function PageHeader({
  title,
  description,
  kicker,
  action,
}: {
  title: string;
  description?: string;
  kicker?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
      <div className="min-w-0">
        {kicker && <p className="t-kicker mb-1.5 text-accent-text">{kicker}</p>}
        <h1 className="t-headline-xl text-slate-100">{title}</h1>
        {description && <p className="t-body-sm mt-1.5 text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
