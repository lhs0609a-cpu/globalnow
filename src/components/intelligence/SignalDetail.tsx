'use client';
import { Modal } from '@/components/ui/Modal';
import { BookmarkButton } from '@/components/news/BookmarkButton';
import { THEMES, countryName, type Signal } from '@/lib/intelligence/model';
export function SignalDetail({ signal, mode, onClose }: { signal: Signal; mode: string; onClose: () => void }) {
  const themes = THEMES.filter(t => signal.themes.includes(t.id));
  return <Modal isOpen onClose={onClose} title="상황 근거와 확인 과제" className="max-w-2xl">
    <div className="space-y-5">
      {mode === 'demo' && <p className="intel-notice">샘플 기사입니다. 실제 상황 판단에 사용하지 마세요.</p>}
      <h3 className="t-headline-lg">{signal.news.titleKo || signal.news.title}</h3>
      <p className="t-body text-slate-300">{signal.news.summaryKo || signal.news.summary || '제공된 요약이 없습니다. 원문에서 내용을 확인하세요.'}</p>
      <dl className="intel-detail-grid">
        <div><dt>게시 시각</dt><dd>{Number.isFinite(Date.parse(signal.news.publishedAt)) ? new Date(signal.news.publishedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' KST' : '미확인'}</dd></div>
        <div><dt>언급 지역 · 자동 분류</dt><dd>{signal.countries.map(countryName).join(', ') || '미분류'}</dd></div>
        <div><dt>매체 소재지</dt><dd>{countryName(signal.news.source?.country || signal.news.country)}</dd></div>
        <div><dt>표시 근거</dt><dd>{signal.reasons.join(' · ') || '사업 관련 카테고리'}</dd></div>
      </dl>
      <section><h3 className="t-title mb-3">사업·투자 검토 항목</h3><p className="t-body-sm text-slate-500 mb-3">아래는 주제별 확인 질문입니다. 이 기사에 대한 검증된 영향 예측이 아닙니다.</p>
        {themes.length ? themes.map(t => <div key={t.id} className="intel-check"><p className="t-label">{t.channel}</p><p className="t-body-sm text-slate-300 mt-1">{t.check}</p></div>) : <p className="t-body-sm">원문의 사실관계와 사업 관련성을 먼저 확인하세요.</p>}
      </section>
      <section><h3 className="t-title mb-2">원문 근거</h3>{[signal.news,...signal.related].map(news => <a key={news.id} className="intel-source-link" href={news.url} target="_blank" rel="noopener noreferrer">{news.source?.nameKo || news.sourceId}<span>원문 열기 ↗</span></a>)}
        <p className="t-meta mt-2 text-slate-500">동일 제목을 묶은 자료입니다. 매체 수는 독립 검증 횟수를 뜻하지 않습니다.</p>
      </section>
      <BookmarkButton news={signal.news} />
    </div>
  </Modal>;
}
