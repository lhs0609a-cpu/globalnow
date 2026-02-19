import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { WorldNewsMap } from '@/components/dashboard/WorldNewsMap';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-x-hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* World News Map */}
            <WorldNewsMap />

            {/* Dashboard Content */}
            <DashboardContent />
          </div>
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
