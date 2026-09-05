'use client';

import { useReports } from '@/hooks/useReports';
import { INDUSTRIES } from '@/lib/constants/industries';
import { IndustryId } from '@/types/report';
import { Tabs } from '@/components/ui/Tabs';
import { ReportCard, ReportSkeleton } from '@/components/reports/ReportCard';
import { PageHeader } from '@/components/layout/AppShell';

const industryTabs = INDUSTRIES.map(i => ({
  id: i.id,
  label: i.nameKo,
}));

export default function ReportsPage() {
  const { industry, report, isLoading, setIndustry } = useReports();

  return (
    <div>
      <PageHeader
        title="산업 리포트"
        description="AI가 분석한 산업별 주간 동향"
      />

      {/* Industry tabs */}
      <Tabs
        tabs={industryTabs}
        activeTab={industry}
        onChange={(id) => setIndustry(id as IndustryId)}
        className="mb-5"
      />

      {/* Report content */}
      {isLoading ? (
        <ReportSkeleton />
      ) : report ? (
        <ReportCard report={report} />
      ) : (
        <div className="surface px-6 py-16 text-center">
          <p className="t-body font-medium text-slate-300">리포트 준비 중</p>
          <p className="mt-1 t-body-sm text-slate-500">
            해당 산업의 주간 리포트가 아직 생성되지 않았습니다
          </p>
        </div>
      )}
    </div>
  );
}
