import { NEWS_SOURCES } from '@/lib/constants/sources';
import { PageHeader } from '@/components/layout/AppShell';
import { countryName, THEMES, REGIONS } from '@/lib/intelligence/model';
export default function SourcesPage() {
  const sources = NEWS_SOURCES.filter(s=>s.rssUrl && ['international','economy','tech','politics','risk'].includes(s.category));
  return <div className="space-y-6"><PageHeader title="출처·분류 기준" description="판단의 신뢰도는 근거와 한계를 확인할 수 있을 때 생깁니다." />
    <section className="intel-panel p-5 space-y-3"><h2 className="t-headline-lg">상황판을 읽는 기준</h2>
      <p className="t-body">상황판은 최신 수집 기사 최대 400건의 제목·요약을 분류합니다. 전체 세계 사건을 빠짐없이 수집한 데이터베이스가 아닙니다. 24시간·72시간·7일 필터는 수집 시각이 아닌 기사 게시 시각을 기준으로 합니다.</p>
      <p className="t-body">지역은 {REGIONS.length}개 국가·지역의 이름과 일부 도시 이름이 기사에 언급됐는지 확인합니다. 사건 위치로 확정하지 않으며, 매체 소재지로 대신 채우지 않습니다. 분류되지 않은 기사와 보도 공백은 별도로 해석해야 합니다.</p>
      <p className="t-body">우선 확인은 제재·봉쇄·가동 중단 등 키워드가 있는 기사를 먼저 배치하는 규칙입니다. 국가 위험 점수, 확률, 투자 수익 전망이 아닙니다. 같은 제목의 기사를 묶지만 독립된 사실 검증으로 간주하지 않습니다.</p>
      <p className="t-body">RSS 실패 시 저장 자료 또는 샘플을 표시할 수 있습니다. 샘플은 실제 상황 판단에 사용할 수 없습니다. 조회 시각은 기사 발생 시각이나 거래소 실시간 시세를 의미하지 않습니다.</p>
    </section>
    <section className="intel-panel p-5"><h2 className="t-headline-lg mb-4">의사결정 주제</h2><div className="grid gap-4 md:grid-cols-2">{THEMES.map(t=><div key={t.id}><h3 className="t-title">{t.label}</h3><p className="t-body-sm text-slate-400 mt-1">{t.channel}</p><p className="t-body-sm mt-1">{t.check}</p></div>)}</div></section>
    <section className="intel-panel p-5"><h2 className="t-headline-lg mb-2">공식 자료로 교차 확인</h2><p className="t-body-sm text-slate-400 mb-3">아래 자료는 외부 확인 경로이며 이 서비스에 자동 연동된 데이터가 아닙니다.</p>
      <div className="grid gap-2 sm:grid-cols-2">{[['IMF PortWatch · 항만·무역 흐름','https://portwatch.imf.org/'],['WTO · 무역 통계','https://stats.wto.org/'],['미 연준 · 통화정책 발표','https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm'],['SEC EDGAR · 기업 공시','https://www.sec.gov/edgar/search/']].map(([label,url])=><a key={url} className="intel-source-link" href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</div>
    </section>
    <section className="intel-panel"><div className="intel-panel-heading"><h2>구성된 사업·경제 뉴스 출처</h2><span>{sources.length}개 · 현재 수집 성공 여부와는 다릅니다</span></div><div className="grid md:grid-cols-2 xl:grid-cols-3">{sources.map(source=><a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="intel-source-card"><strong>{source.nameKo}</strong><span>{countryName(source.country)} · {source.name}</span><span>매체 원문 ↗</span></a>)}</div></section>
  </div>;
}
