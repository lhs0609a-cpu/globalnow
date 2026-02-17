'use client';

import { useReports } from '@/hooks/useReports';
import { INDUSTRIES } from '@/lib/constants/industries';
import { IndustryId } from '@/types/report';
import { Tabs } from '@/components/ui/Tabs';
import { ReportCard, ReportSkeleton } from '@/components/reports/ReportCard';

const industryTabs = INDUSTRIES.map(i => ({
  id: i.id,
  label: i.nameKo,
  icon: i.icon,
}));

export default function ReportsPage() {
  const { industry, report, isLoading, setIndustry } = useReports();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Weekly Industry Report</h1>
        <p className="text-slate-400 text-sm mt-1">
          AI가 분석한 산업별 주간 동향 리포트
        </p>
      </div>

      {/* Industry tabs */}
      <Tabs
        tabs={industryTabs}
        activeTab={industry}
        onChange={(id) => setIndustry(id as IndustryId)}
        className="pb-1"
      />

      {/* Report content */}
      {isLoading ? (
        <ReportSkeleton />
      ) : report ? (
        <ReportCard report={report} />
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-white font-semibold mb-1">리포트 준비 중</h3>
          <p className="text-slate-400 text-sm">
            해당 산업의 주간 리포트가 아직 생성되지 않았습니다
          </p>
        </div>
      )}
    </div>
  );
}
