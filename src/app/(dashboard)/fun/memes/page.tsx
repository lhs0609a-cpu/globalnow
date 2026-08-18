import { PageHeader } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MemesPage() {
  return (
    <div>
      <PageHeader title="밈 모음" description="최신 인터넷 밈 컬렉션" />
      <EmptyState
        title="준비 중입니다"
        description="밈 콘텐츠가 곧 업데이트됩니다"
      />
    </div>
  );
}
