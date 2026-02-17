export function Footer() {
  return (
    <footer className="border-t border-slate-700/50 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">GN</span>
            </div>
            <span className="text-slate-400 text-sm">
              GLOBAL<span className="text-blue-400">NOW</span>
            </span>
          </div>
          <p className="text-slate-500 text-xs text-center">
            모든 뉴스 콘텐츠는 각 발행사에 귀속됩니다. GLOBALNOW는 정보 제공 목적으로 집계 및 번역합니다.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>GLOBALNOW v1.0</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
