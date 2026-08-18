import { PageHeader } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/ui/EmptyState';

export default function SatirePage() {
  return (
    <div>
      <PageHeader title="풍자 뉴스" description="The Onion 스타일 풍자 뉴스" />
      <EmptyState
        title="준비 중입니다"
        description="풍자 콘텐츠가 곧 업데이트됩니다"
      />
    </div>
  );
}
