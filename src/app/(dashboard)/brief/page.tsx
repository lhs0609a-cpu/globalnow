import { IntelligenceBoard } from '@/components/intelligence/IntelligenceBoard';
import { parseBoardFilters } from '@/lib/intelligence/filters';
export default async function BriefPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  return <IntelligenceBoard filters={parseBoardFilters(await searchParams)} briefing />;
}
