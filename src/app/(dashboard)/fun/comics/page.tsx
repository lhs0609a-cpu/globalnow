import { PageHeader } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ComicsPage() {
  return (
    <div>
      <PageHeader title="만화" description="XKCD, 시사만평" />
      <EmptyState
        title="준비 중입니다"
        description="만화 콘텐츠가 곧 업데이트됩니다"
      />
    </div>
  );
}
