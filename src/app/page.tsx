import { AppShell } from '@/components/layout/AppShell';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { CATEGORIES } from '@/lib/constants/categories';

export default async function HomePage({ searchParams }: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search.trim().slice(0, 200) : '';
  const category = CATEGORIES.some(c => c.id === params.category) ? params.category! : 'all';
  return <AppShell search={search}><DashboardContent search={search} category={category} /></AppShell>;
}
