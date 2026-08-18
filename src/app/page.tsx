import { AppShell } from '@/components/layout/AppShell';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { WorldNewsMap } from '@/components/dashboard/WorldNewsMap';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-5">
        {/* World News Map */}
        <ErrorBoundary
          fallback={
            <div className="rounded-xl border border-white/[0.06] bg-slate-800 p-6 text-center">
              <p className="text-sm text-slate-400">세계 뉴스 맵을 불러오지 못했습니다</p>
            </div>
          }
        >
          <WorldNewsMap />
        </ErrorBoundary>

        {/* Dashboard Content */}
        <DashboardContent />
      </div>
    </AppShell>
  );
}
