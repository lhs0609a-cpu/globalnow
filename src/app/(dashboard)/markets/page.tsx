import { PageHeader } from '@/components/layout/AppShell';
import { MarketWidget } from '@/components/dashboard/MarketWidget';
export default function MarketsPage() {
  return <div className="max-w-6xl mx-auto"><PageHeader title="글로벌 시장" description="지수·환율·디지털 자산의 조회값과 데이터 상태를 확인하세요. 기사와 시세의 동시 변화가 인과관계를 증명하지는 않습니다." /><div className="intel-market-page"><MarketWidget /></div></div>;
}
