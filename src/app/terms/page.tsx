export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">이용약관</h1>
        <div className="bg-slate-800 rounded-xl p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">제1조 (목적)</h2>
            <p>이 약관은 GLOBALNOW(이하 "서비스")가 제공하는 뉴스 큐레이션 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">제2조 (서비스의 내용)</h2>
            <p>서비스는 글로벌 뉴스 수집, AI 기반 분석 및 번역, 트렌드 모니터링, 시장 데이터 제공 등의 기능을 포함합니다. 서비스 내용은 사전 공지 후 변경될 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">제3조 (이용자의 의무)</h2>
            <p>이용자는 서비스를 통해 수집된 콘텐츠를 상업적으로 재배포할 수 없으며, 서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">제4조 (저작권)</h2>
            <p>서비스에서 제공하는 뉴스 콘텐츠의 저작권은 각 원본 매체에 있습니다. GLOBALNOW는 뉴스를 수집 및 번역하여 정보 제공 목적으로만 사용합니다.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">제5조 (면책)</h2>
            <p>서비스는 뉴스 정보를 "있는 그대로" 제공하며, 투자 조언이나 전문적 판단을 대체하지 않습니다. AI 분석 결과의 정확성을 보증하지 않습니다.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">제6조 (서비스 중단)</h2>
            <p>서비스는 시스템 점검, 장비 교체 등의 사유로 일시적으로 중단될 수 있으며, 사전 공지를 원칙으로 합니다.</p>
          </section>
        </div>
        <p className="text-slate-500 text-xs mt-4 text-center">최종 수정일: 2026년 2월 7일</p>
      </div>
    </div>
  );
}
