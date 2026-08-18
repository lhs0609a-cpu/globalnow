import { PageHeader } from '@/components/layout/AppShell';
import { EmptyState } from '@/components/ui/EmptyState';

export default function GifsPage() {
  return (
    <div>
      <PageHeader title="GIF 모음" description="재미있는 GIF 컬렉션" />
      <EmptyState
        title="준비 중입니다"
        description="GIF 콘텐츠가 곧 업데이트됩니다"
      />
    </div>
  );
}
