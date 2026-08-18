import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';

/**
 * 앱 골격.
 *
 * 홈과 대시보드 레이아웃이 헤더·사이드바·푸터 조합을 각자 들고 있어
 * 여백이 서로 어긋났다. 골격을 한 곳에 두어 어느 화면으로 넘어가도
 * 본문 시작 위치가 흔들리지 않게 한다.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden pb-20 lg:pb-10">
          <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}

/**
 * 화면 제목 줄. 각 페이지가 h1 크기를 제각각 쓰고 있어 통일한다.
 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">{title}</h1>
        {description && (
          <p className="mt-1 text-[0.8125rem] text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
