import { AppShell } from '@/components/layout/AppShell';
import { IntelligenceBoard } from '@/components/intelligence/IntelligenceBoard';
import { parseBoardFilters } from '@/lib/intelligence/filters';
export default async function HomePage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const filters = parseBoardFilters(await searchParams);
  return <AppShell search={filters.search}><IntelligenceBoard filters={filters} /></AppShell>;
}
